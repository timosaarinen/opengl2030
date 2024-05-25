import { WARNING, ASSERT, safe_stringify } from './util.js'
import { LOGG, log_enablegroup } from './log.js'
import { FLOAT } from './constants.js'
import { gl_tostring } from './gl.js'

export const bufferdata           = (webgl2, buffer, srcdata)     => webgl2.bufferData(buffer.type, srcdata, webgl2.DYNAMIC_DRAW)
export const use_vertexbuffer     = (webgl2, vbuffer)             => webgl2.bindBuffer(webgl2.ARRAY_BUFFER, vbuffer.buffer)
export const use_indexbuffer      = (webgl2, ibuffer)             => webgl2.bindBuffer(webgl2.ELEMENT_BUFFER, ibuffer.buffer)
export const use_vertexarray      = (webgl2, vertexarray)         => webgl2.bindVertexArray(vertexarray.vertexarray)
export const use_program          = (webgl2, program)             => webgl2.useProgram(program.program)
export const draw_vertices        = (webgl2, prim, start, count)  => webgl2.drawArrays(prim, start, count)
export const draw_indexed         = (webgl2, prim, start, count)  => webgl2.drawElements(prim, count, webgl2.UNSIGNED_SHORT, start)
//------------------------------------------------------------------------
function load_shader(webgl2, type, source) {
  const shader = webgl2.createShader(type)
  webgl2.shaderSource(shader, source)
  webgl2.compileShader(shader)
  if (!webgl2.getShaderParameter(shader, webgl2.COMPILE_STATUS)) {
    WARNING('An error occurred compiling the shaders: ' + webgl2.getShaderInfoLog(shader))
    webgl2.deleteShader(shader)
    return null
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
    WARNING('Unable to initialize the shader program: ' + webgl2.getProgramInfoLog(program))
    return null
  }
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
  ASSERT(layout == 'vec2 a_position;') // TODO: parse layout -> attribs. Don't require program here, bind in g_new_pipe()
  const attribs = [ {name: 'a_position', dim: 2, type: FLOAT, offset: 0, normalize: false} ]

  const vb = webgl2.createBuffer()
  webgl2.bindBuffer(webgl2.ARRAY_BUFFER, vb)
  if (data) { webgl2.bufferData(webgl2.ARRAY_BUFFER, data, webgl2.STATIC_DRAW) }

  const vertexarray = webgl2.createVertexArray()
  webgl2.bindVertexArray(vertexarray)

  for (const a of attribs) {
    const index = webgl2.getAttribLocation( program.program, a.name )
    webgl2.enableVertexAttribArray( index )
    webgl2.vertexAttribPointer( index, a.dim, a.type, a.normalize ?? false, a.stride ?? 0, a.offset ?? 0 )
  }
  webgl2.bindVertexArray(null) // TODO: unbinded for "safety", but could skip - any real perf hit? -> Profile
  
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
  webgl2.viewport( rect.x, rect.y, rect.width, rect.height )
}
function clear( webgl2, color, depth, stencil ) {
  let clearbits = 0
  if (color)   { clearbits |= webgl2.COLOR_BUFFER_BIT; webgl2.clearColor( color.x, color.y, color.z, color.w ) }
  if (depth)   { clearbits |= webgl2.DEPTH_BUFFER_BIT; webgl2.clearDepth( depth ) }
  if (stencil) { clearbits |= webgl2.STENCIL_BUFFER_BIT; webgl2.stencilMask( 0xFF ) } // TODO: stencil test
  webgl2.clear( clearbits )
}
function upload_uniforms( webgl2, program, uniforms ) {
  //log_enablegroup('uniforms-loc') // DEBUG
  use_program( webgl2, program )
  for (const key in uniforms) { if (uniforms.hasOwnProperty(key)) {
    const u = uniforms[key]
    const loc = webgl2.getUniformLocation(program.program, key) // TODO: cache these to 'program'
    if (loc === null) continue; // unused by the shader (even if declared)
    const type = typeof(u); // TODO: for C API, need to get type non-dynamic way
    const v = u; // value (float, vec2, vec3, vec4, ...)
    LOGG('uniforms-loc', loc, key, type, v.type, Array.isArray(u), safe_stringify(u)) // DEBUG
    switch(typeof u) {
      case 'number':
        LOGG('uniforms', key, 'uniform1f', v); webgl2.uniform1f(loc, v); break
      case 'object': {
        if (Array.isArray(u)) {
          switch(v.length) {
            case (3 * 3): LOGG('uniforms', key, 'uniformMatrix3fv', v); webgl2.uniformMatrix3fv(loc, false, v); break
            case (4 * 4): LOGG('uniforms', key, 'uniformMatrix4fv', v); webgl2.uniformMatrix4fv(loc, false, v); break
            default:      WARNING(`Unsupported uniform array length for key ${key} = ${v}`);
          }
        } else {
          ASSERT(v.type); // TODO: must have .type, other ways?
          switch(v.type) {
            case 'vec2':    LOGG('uniforms', key, 'uniform2f', v); webgl2.uniform2f(loc, v.x, v.y); break
            case 'vec3':    LOGG('uniforms', key, 'uniform3f', v); webgl2.uniform3f(loc, v.x, v.y, v.z); break
            case 'vec4':    LOGG('uniforms', key, 'uniform4f', v); webgl2.uniform4f(loc, v.x, v.y, v.z, v.w); break    
          }
        }
      }
    }
  } }
}

function submit_display_list(webgl2, displaylist) {
  LOGG( 'backend', 'display list submit -> WebGL2:', gl_tostring(displaylist) )
  for (const c of displaylist.cmd) {
    switch(c.cmd) {
      case 'viewport':            viewport           (webgl2, c.rect) ; break
      case 'clear':               clear              (webgl2, c.color, c.depth, c.stencil) ; break
      case 'update_vertexbuffer': update_vertexbuffer(webgl2, c.vertexbuffer, c.data) ; break
      case 'update_indexbuffer':  update_indexbuffer (webgl2, c.indexbuffer, c.data) ; break
      case 'use_pipe':            use_pipe           (webgl2, c.pipe) ; break
      case 'upload_uniforms':     upload_uniforms    (webgl2, c.program, c.uniforms) ; break
      case 'draw_vertices':       draw_vertices      (webgl2, c.prim, c.start, c.count) ; break
      case 'draw_indices':        draw_indices       (webgl2, c.prim, c.start, c.count) ; break
      default:                    WARNING(`unknown command: ${c.cmd}`) ; break
    }
  }
}
//------------------------------------------------------------------------
export function create_webgl2_context(config, canvas) {
  const webgl2 = canvas.getContext('webgl2') // WebGL 2.0 (GLSL ES 3.00 #version 300 es)
  if( !webgl2 ) panic('You need a browser with WebGL 2.0 support')
  return {
    name: 'WebGL 2.0',
    webgl2: webgl2,
    canvas: canvas,
    new_program:          (vshader, fshader)      => new_program( webgl2, vshader, fshader ),
    new_vertexbuffer:     (data, layout, program) => new_vertexbuffer( webgl2, data, layout, program ),
    new_indexbuffer:      (data)                  => new_indexbuffer( webgl2, data ),
    new_pipe:             (program, vb, ib)       => new_pipe( webgl2, program, vb, ib ),
    submit_display_list:  (displaylist)           => submit_display_list( webgl2, displaylist ),
  }
}