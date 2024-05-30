import { panic, WARNING, ASSERT, ASSERTM, safe_stringify } from './util.js'
import { LOG, LOGG, LOGGO, log_enablegroup } from './log.js'
import { FLOAT } from './constants.js'
import { gl_tostring } from './gl.js'
import { vs_ubo_ref, fs_ubo_ref } from './shaderlib.js' // TODO: should not be required?
import { vectype, vecstoref32array } from './vecmath.js'
import { UBO_ARRAY_INDEX, UBO_SIZE } from './uniforms.js'

//log_enablegroup('ubo') // DEBUG:

const no_webgl2 = 'You need a browser with WebGL 2.0 support'

export const bufferdata           = (webgl2, buffer, srcdata)     => webgl2.bufferData(buffer.type, srcdata, webgl2.DYNAMIC_DRAW)
export const use_vertexbuffer     = (webgl2, vbuffer)             => webgl2.bindBuffer(webgl2.ARRAY_BUFFER, vbuffer.buffer)
export const use_indexbuffer      = (webgl2, ibuffer)             => webgl2.bindBuffer(webgl2.ELEMENT_BUFFER, ibuffer.buffer)
export const use_vertexarray      = (webgl2, vertexarray)         => webgl2.bindVertexArray(vertexarray.vertexarray)
export const use_program          = (webgl2, program)             => webgl2.useProgram(program.program)
export const draw_vertices        = (webgl2, prim, start, count)  => webgl2.drawArrays(prim, start, count)
export const draw_indexed         = (webgl2, prim, start, count)  => webgl2.drawElements(prim, count, webgl2.UNSIGNED_SHORT, start)
//------------------------------------------------------------------------
function parse_layout( layout ) {
  // Layout 'vec2 a_position' example -> webgl2.vertexAttribPointer()
  //   float, float (in Float32Array) -> 'in vec4 a_position' GLSL-es300 vertex shader attribute input (expanded vec2 -> vec4)
  //
  // Map two floats (vec2) starting at byte offset 0 to vertex shader's position attribute 'a_position', where
  //   name -> index: The vertex attribute index from the name getAttribLocation('a_position')
  //   dim:           Dimension / # of components 1, 2, 3 or 4 (here 2 for the two floats in vec2)
  //   type:          Data type of each component in the array, BYTE/SHORT/UNSIGNED_BYTE/UNSIGNED_SHORT/FLOAT/HALF_FLOAT/INT/UNSIGNED_INT/INT_2_10_10_10_REV (here FLOAT for the 32-bit floats in vec2
  //   normalize:     Tells whether to normalize signed types (BYTE/SHORT) -> [-1,1] or unsigned types -> [0,1] to the vertex shader attribute input value
  //   offset:        The byte offset (of the first component, i.e. offsetof(MyVertex, pos))
  //   stride:        # of bytes to the next (usually sizeof(MyVertex)) or can be 0 if no other data in between (here 0, as we only have array of vec2 positions)
  switch( layout ) {
    case 'vec2 a_position;': 
      return [ {name: 'a_position', dim: 2, type: FLOAT, offset: 0, normalize: false} ]
    case 'vec2 a_position; vec4 a_color;':
      return [ {name: 'a_position', dim: 2, type: FLOAT, offset: 0,   normalize: false, stride: 6*4},
               {name: 'a_color',    dim: 4, type: FLOAT, offset: 2*4, normalize: false, stride: 6*4} ]
    default:
      panic('TODO: parse layout -> WebGL attribute desc') // TODO: also don't require program here, bind in newpipe()
  }
}
function load_shader(webgl2, type, source) {
  const shader = webgl2.createShader(type)
  webgl2.shaderSource(shader, source)
  webgl2.compileShader(shader)
  if (!webgl2.getShaderParameter(shader, webgl2.COMPILE_STATUS)) {
    panic('An error occurred compiling the shaders: ' + webgl2.getShaderInfoLog(shader)) // TODO: was WARNING, but better to panic here?
    webgl2.deleteShader(shader); return null
  }
  return shader
}
//------------------------------------------------------------------------
function new_program(webgl2, vshader, fshader) {
  const vs = load_shader(webgl2, webgl2.VERTEX_SHADER, vshader)
  const fs = load_shader(webgl2, webgl2.FRAGMENT_SHADER, fshader)
  const program = webgl2.createProgram()
  webgl2.attachShader(program, vs)
  webgl2.attachShader(program, fs)
  webgl2.linkProgram(program)
  if (!webgl2.getProgramParameter(program, webgl2.LINK_STATUS)) {
    panic('Unable to initialize the shader program: ' + webgl2.getProgramInfoLog(program)) // TODO: was WARNING, but better to panic here?
    return null
  }
  const active_uniforms = webgl2.getProgramParameter(program, webgl2.ACTIVE_UNIFORMS)
  const ubi = webgl2.getUniformBlockIndex(program, 'Uniforms')
  webgl2.uniformBlockBinding(program, ubi, UBO_ARRAY_INDEX)
  LOGG('ubo', '[vs]', vshader, '\n[fs]', fshader, '\n[ACTIVE_UNIFORMS]', active_uniforms)
  return { program, vshader, fshader }
}
function new_indexbuffer(webgl2, data) {
  // TODO: VAO and IB interaction in WebGL
  // TODO: only 16bit index support?
  const ib = webgl2.createBuffer()
  webgl2.bindBuffer( webgl2.ELEMENT_ARRAY_BUFFER, ib )
  if (data) { webgl2.bufferData( webgl2.ELEMENT_ARRAY_BUFFER, data, webgl2.STATIC_DRAW ) }
  return { indexbuffer: ib, size: data ? data.length : 0 }
}
function update_indexbuffer( webgl2, ib, data ) {
  webgl2.bindBuffer( webgl2.ELEMENT_ARRAY_BUFFER, ib.indexbuffer )
  webgl2.bufferData( webgl2.ELEMENT_ARRAY_BUFFER, data, webgl2.DYNAMIC_DRAW )
}
function new_vertexbuffer(webgl2, data, layout, program) {
  const vb = webgl2.createBuffer()
  webgl2.bindBuffer(webgl2.ARRAY_BUFFER, vb)
  if (data) { webgl2.bufferData(webgl2.ARRAY_BUFFER, data, webgl2.STATIC_DRAW) }
  const vertexarray = webgl2.createVertexArray()
  webgl2.bindVertexArray(vertexarray)
  const attribs = parse_layout( layout )
  for (const a of attribs) {
    const index = webgl2.getAttribLocation( program.program, a.name )
    webgl2.enableVertexAttribArray( index )
    webgl2.vertexAttribPointer( index, a.dim, a.type, a.normalize ?? false, a.stride ?? 0, a.offset ?? 0 )
  }
  webgl2.bindVertexArray(null)
  return { vertexbuffer: vb, vertexarray, size: data ? data.length : 0 }
}
function update_vertexbuffer( webgl2, vb, data ) {
  webgl2.bindBuffer( webgl2.ARRAY_BUFFER, vb.vertexbuffer )
  webgl2.bufferData( webgl2.ARRAY_BUFFER, data, webgl2.DYNAMIC_DRAW )
}
function new_pipe( webgl2, program, vb, ib ) {
  return { type: 'pipe', program, vb, ib }
}
function use_pipe( webgl2, pipe ) {
  ASSERT( pipe.vb.vertexarray )
  use_program( webgl2, pipe.program )
  if (pipe.ib) {} // TODO:
  webgl2.bindVertexArray( pipe.vb.vertexarray )
}
function viewport( webgl2, rect ) {
  webgl2.viewport( rect.x, rect.y, rect.z, rect.w ) // TODO: rect() -> vec4 components misleading here, deconstructor?
}
function clear( webgl2, color, depth, stencil ) {
  let clearbits = 0
  if (color)   { clearbits |= webgl2.COLOR_BUFFER_BIT; webgl2.clearColor( color.x, color.y, color.z, color.w ) }
  if (depth)   { clearbits |= webgl2.DEPTH_BUFFER_BIT; webgl2.clearDepth( depth ) }
  if (stencil) { clearbits |= webgl2.STENCIL_BUFFER_BIT; webgl2.stencilMask( 0xFF ) } // TODO: stencil test
  webgl2.clear( clearbits )
}
function new_uniform_buffer( webgl2, uniforms, capacity, ref_program ) {
  const index = webgl2.getUniformBlockIndex(ref_program.program, 'Uniforms')
  const size = webgl2.getActiveUniformBlockParameter(ref_program.program, index, webgl2.UNIFORM_BLOCK_DATA_SIZE)
  const ubo = webgl2.createBuffer()
  webgl2.bindBuffer(webgl2.UNIFORM_BUFFER, ubo)
  ASSERTM(capacity >= size, "UBO capacity must be greater or equal than the actual shader-side size")
  webgl2.bufferData(webgl2.UNIFORM_BUFFER, capacity, webgl2.DYNAMIC_DRAW)
  webgl2.bindBuffer(webgl2.UNIFORM_BUFFER, null)
  webgl2.bindBufferBase(webgl2.UNIFORM_BUFFER, UBO_ARRAY_INDEX, ubo)
  let varnames = [];
  for (const v in uniforms) {
    LOG('ubo', 'uniform[', varnames.length, '] =', v)
    varnames.push(v)
  }
  const indices = webgl2.getUniformIndices(ref_program.program, varnames) // indices: number[]
  for (let n = 0; n < indices.length; ++n) {
    if (indices[n] === webgl2.INVALID_INDEX) {
      //panic('new_uniform_buffer(): uniform: ', varnames[n], 'is invalid - check the naming') // TODO: fix panic args
      panic(`new_uniform_buffer(): uniform '${varnames[n]}' is invalid - check the naming on host and shader-side.`)
    }
  }
  const offsets = webgl2.getActiveUniforms(ref_program.program, indices, webgl2.UNIFORM_OFFSET);
  LOGG('ubo', 'ubo offsets', safe_stringify(offsets))
  const mapping = {}
  for (let n = 0; n < varnames.length; ++n) {
    const name = varnames[n]
    mapping[name] = LOGGO( 'ubo', { index: indices[n], offset: offsets[n] } )
  }
  return LOGGO( 'ubo', { ubo, size, index, UBO_ARRAY_INDEX, mapping }, 'new ubo' )
}
function newfloat32array(uniforms, numbytes, mapping) {
  let numfloats = numbytes / 4
  let arr = new Float32Array(numfloats) // TODO: alloc once
  let count = 0
  for (const key in uniforms) {
    const value = uniforms[key]
    LOGG('ubo', '  ', key, vectype(value), uniforms[key], 'mapping', mapping[key])
    const byteoffset = mapping[key].offset
    ASSERTM( 'uniforms must 4-byte aligned', byteoffset % 4 == 0 )
    const floatoffset = byteoffset / 4 
    const numfloats = vecstoref32array(arr, floatoffset, value)
    LOGG('ubo', '     -> offset', byteoffset, 'numbytes', numfloats * 4)
    count++
  }
  LOGG('ubo', '  =>', count, '/',  Object.keys(mapping).length, 'uniforms set') // TODO: should require that all uniforms are set?
  return arr
}
function update_uniforms( webgl2, ubo, uniforms ) {
  LOGG('ubo', 'ubo', ubo, 'updating', ubo.size, 'bytes')
  const array = newfloat32array(uniforms, ubo.size, ubo.mapping)
  const offset = 0
  webgl2.bindBuffer(webgl2.UNIFORM_BUFFER, ubo.ubo)
  webgl2.bufferSubData(webgl2.UNIFORM_BUFFER, offset, array)
  webgl2.bindBuffer(webgl2.UNIFORM_BUFFER, ubo.ubo)
  //----------------------------------------------------------------------
  // OLD non-UBO code for reference
  //----------------------------------------------------------------------
  // use_program( webgl2, program )
  // for (const key in uniforms) { if (uniforms.hasOwnProperty(key)) {
  //   const v = uniforms[key]
  //   const vtype = typeof v === 'number' ? 'float' : v.type // vectype(v)
  //   const vtype2 = vectype_unsafe(v)
  //   ASSERTM(v, vtype)
  //   ASSERTM(v, vtype === vtype2)
  //   const loc = webgl2.getUniformLocation(program.program, key)
  //   if (loc === null) continue; // unused by the shader (even if declared in the shader, "optimized away")
  //   LOGG('uniforms-verbose', key, ':', vtype, '=', safe_stringify(v), 'loc', loc)
  //   switch(vtype) {
  //     case 'float': LOGG('uniform-set', key, 'uniform1f', v); webgl2.uniform1f(loc, v); break
  //     case 'vec2':  LOGG('uniform-set', key, 'uniform2f', v); webgl2.uniform2f(loc, v.x, v.y); break
  //     case 'vec3':  LOGG('uniform-set', key, 'uniform3f', v); webgl2.uniform3f(loc, v.x, v.y, v.z); break
  //     case 'vec4':  LOGG('uniform-set', key, 'uniform4f', v); webgl2.uniform4f(loc, v.x, v.y, v.z, v.w); break
  //     case 'mat2':  LOGG('uniform-set', key, 'uniformMatrix2fv', v); webgl2.uniformMatrix2fv(loc, false, v.m); break
  //     case 'mat3':  LOGG('uniform-set', key, 'uniformMatrix3fv', v); webgl2.uniformMatrix3fv(loc, false, v.m); break
  //     case 'mat4':  LOGG('uniform-set', key, 'uniformMatrix4fv', v); webgl2.uniformMatrix4fv(loc, false, v.n); break
  //   } } }
  //----------------------------------------------------------------------
}
function submit_display_list(webgl2, displaylist, the_ubo) {
  LOGG( 'backend', 'display list submit -> WebGL2:', gl_tostring(displaylist) )
  for (const c of displaylist.cmd) {
    switch(c.cmd) {
      case 'viewport':            viewport           (webgl2, c.rect) ; break
      case 'clear':               clear              (webgl2, c.color, c.depth, c.stencil) ; break
      case 'update_vertexbuffer': update_vertexbuffer(webgl2, c.vertexbuffer, c.data) ; break
      case 'update_indexbuffer':  update_indexbuffer (webgl2, c.indexbuffer, c.data) ; break
      case 'use_pipe':            use_pipe           (webgl2, c.pipe) ; break
      case 'update_uniforms':     update_uniforms    (webgl2, the_ubo, c.uniforms) ; break
      case 'draw_vertices':       draw_vertices      (webgl2, c.prim, c.start, c.count) ; break
      case 'draw_indices':        draw_indices       (webgl2, c.prim, c.start, c.count) ; break
      default:                    WARNING(`unknown command: ${c.cmd}`) ; break
    }
  }
}
//------------------------------------------------------------------------
export async function create_webgl2_context(config, canvas) {
  const webgl2 = canvas.getContext('webgl2') // WebGL 2.0 (GLSL ES 3.00 #version 300 es)
  if( !webgl2 ) { alert(no_webgl2); panic(no_webgl2) }
  const ref_program = new_program( webgl2, vs_ubo_ref, fs_ubo_ref )
  const ubo = new_uniform_buffer(webgl2, config.uniforms, UBO_SIZE, ref_program )
  return {
    name: 'WebGL 2.0',
    webgl2: webgl2,
    canvas: canvas,
    new_program:          (vshader, fshader)      => new_program( webgl2, vshader, fshader ),
    new_vertexbuffer:     (data, layout, program) => new_vertexbuffer( webgl2, data, layout, program ),
    new_indexbuffer:      (data)                  => new_indexbuffer( webgl2, data ),
    new_pipe:             (program, vb, ib)       => new_pipe( webgl2, program, vb, ib ),
    submit_display_list:  (displaylist)           => submit_display_list( webgl2, displaylist, ubo ),
  }
}