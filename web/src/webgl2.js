import { LOG, WARNING } from './util.js'

export const bufferdata           = (webgl2, buffer, srcdata)     => webgl2.bufferData(buffer.type, srcdata, webgl2.DYNAMIC_DRAW)
export const use_vertexbuffer     = (webgl2, vbuffer)             => webgl2.bindBuffer(webgl2.ARRAY_BUFFER, vbuffer.buffer)
export const use_indexbuffer      = (webgl2, ibuffer)             => webgl2.bindBuffer(webgl2.ELEMENT_BUFFER, ibuffer.buffer)
export const use_vertexarray      = (webgl2, vertexarray)         => webgl2.bindVertexArray(vertexarray.vertexarray)
export const use_program          = (webgl2, program)             => webgl2.useProgram(program.progarm)
export const draw_vertices        = (webgl2, prim, start, count)  => webgl2.drawArrays(prim, start, count)
export const draw_indexed         = (webgl2, prim, start, count)  => webgl2.drawElements(prim, count, webgl2.UNSIGNED_SHORT, start)
//------------------------------------------------------------------------
export function load_shader(webgl2, type, source) { // create a shader of 'type' VERTEX_SHADER | FRAGMENT_SHADER with 'source' es300 shader code
  const shader = webgl2.createShader(type)
  webgl2.shaderSource(shader, source)
  webgl2.compileShader(shader)
  if (!webgl2.getShaderParameter(shader, webgl2.COMPILE_STATUS)) {
    WARNING('An error occurred compiling the shaders: ' + webgl2.getShaderInfoLog(shader))
    webgl2.deleteShader(shader)
    return null
  }
  return { shader }
}
export function new_program(webgl2, vshader, fshader) {
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
  return { program, vs, fs }
}
export function new_vertexbuffer(webgl2, data) {
  const buffer = webgl2.createBuffer()
  webgl2.bindBuffer(webgl2.ARRAY_BUFFER, buffer)
  webgl2.bufferData(webgl2.ARRAY_BUFFER, data, webgl2.STATIC_DRAW) // TODO: usage hints, null data
  return { buffer, type: webgl2.ARRAY_BUFFER, bytesize: data.length } // TODO: check that bytesize
}
export function new_indexbuffer(webgl2, data) {
  const buffer = webgl2.createBuffer()
  webgl2.bindBuffer(webgl2.ELEMENT_BUFFER, buffer)
  webgl2.bufferData(webgl2.ELEMENT_BUFFER, data, webgl2.STATIC_DRAW) // TODO: usage hints, null data
  return { buffer, type: webgl2.ELEMENT_BUFFER, bytesize: data.length } // TODO: check that bytesize
}
export function new_vertex_array(webgl2, buffer, program, attribs) {
  webgl2.bindBuffer(webgl2.ARRAY_BUFFER, buffer) // TODO: after new_buffer(), sets this unnecessarily, cache?
  const vertexarray = webgl2.createVertexArray()
  webgl2.bindVertexArray(vertexarray)
  // Example: 2D position vec2 (in Float32Array) -> 'in vec4 a_position' GLSL-es300 vertex shader attribute input (expanded vec2 -> vec4)
  //
  // Map two floats (vec2) starting at byte offset 0 to vertex shader's position attribute 'a_position', where
  //   name -> index: The vertex attribute index from the name getAttribLocation('a_position')
  //   dim:           Dimension / # of components 1, 2, 3 or 4 (here 2 for the two floats in vec2)
  //   type:          Data type of each component in the array, BYTE/SHORT/UNSIGNED_BYTE/UNSIGNED_SHORT/FLOAT/HALF_FLOAT/INT/UNSIGNED_INT/INT_2_10_10_10_REV (here FLOAT for the 32-bit floats in vec2
  //   normalize:     Tells whether to normalize signed types (BYTE/SHORT) -> [-1,1] or unsigned types -> [0,1] to the vertex shader attribute input value
  //   offset:        The byte offset (of the first component, i.e. offsetof(MyVertex, pos))
  //   stride:        # of bytes to the next (usually sizeof(MyVertex)) or can be 0 if no other data in between (here 0, as we only have array of vec2 positions)
  for (const a of attribs) {
    const index = webgl2.getAttribLocation( program, a.name )
    webgl2.enableVertexAttribArray( index )
    webgl2.vertexAttribPointer( index, a.dim, a.type, a.normalize ?? false, a.stride ?? 0, a.offset ?? 0 )
  }
  webgl2.bindVertexArray(null) // TODO: unbinded for "safety", but could skip - any real perf hit? -> Profile
  return { vertexarray, buffer, program, attribs }
}
// TODO: "it's all bits in the end" uniform-byte-buffers? obfuscates?
function submit_display_list(webgl2, displaylist) {
  LOG('display list submit -> WebGL2:', gl_tostring(displaylist))
  for (const c of displaylist.cmd) {
    switch(c.cmd) {
      case 'viewport':            viewport(webgl2, c.rect) ; break
      case 'clear':               clear(webgl2, c.color, c.depth, c.stencil) ; break
      case 'update_vertexbuffer': use_vertexbuffer(webgl2, c.vertexbuffer); bufferdata(webgl2, c.vertexbuffer, c.data); break
      case 'update_indexbuffer':  use_indexbuffer(webgl2, c.indexbuffer); bufferdata(webgl2, c.indexbuffer, c.data); break
      case 'use_program':         use_program(webgl2, c.program) ; break
      case 'use_vertexbuffer':    use_vertexbuffer(webgl2, c.vertexbuffer) ; break
      case 'use_indexbuffer':     use_indexbuffer(webgl2, c.indexbuffer) ; break
      case 'draw_vertices':       draw_vertices(webgl2, c.prim, c.start, c.count) ; break
      case 'draw_indices':        draw_indices(weblgl2, c.prim, c.start, c.count) ; break
      default:                    WARNING(`unknown command: ${c.cmd}`) ; break
    }
  }
}
export function create_webgl2_context(config, canvas) {
  const webgl2 = canvas.getContext('webgl2') // WebGL 2.0 (GLSL ES 3.00 #version 300 es)
  if( !webgl2 ) panic('You need a browser with WebGL 2.0 support')
  return {
    name: 'WebGL 2.0',
    webgl2: webgl2,
    canvas: canvas,
    new_program:          (vshader, fshader)          => new_program( webgl2, vshader, fshader ),
    new_vertexbuffer:     (data)                      => new_vertexbuffer( webgl2, data ),
    new_indexbuffer:      (data)                      => new_indexbuffer( webgl2, data ),
    new_vertexarray:      (vbuffer, program, attribs) => new_vertexarray( webgl2, vbuffer, program, attribs ),
    submit_display_list:  (displaylist)               => submit_display_list( webgl2, displaylist ),
  }
}