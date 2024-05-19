import { LOG, WARNING, arrpush } from './util.js'
import { TRIANGLES, STATIC_DRAW } from './constants.js'

export function use_buffer  (webgl2, buffer)              { webgl2.bindBuffer(webgl2.ARRAY_BUFFER, buffer) }
export function use_vao     (webgl2, vao)                 { webgl2.bindVertexArray(vao) }
export function use_program (webgl2, program)             { webgl2.useProgram(program.program) }
export function draw        (webgl2, prim, start, count)  { webgl2.drawArrays(prim, start, count) }
export function draw_indexed(webgl2, prim, start, count)  { webgl2.drawElements(prim, count, webgl2.UNSIGNED_SHORT, start) }
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
  return shader
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
  return program
}
export function new_buffer(webgl2, type, data, flags) { // example: new_buffer(webgl2, VERTEX_BUFFER, new Float32Array(positions), STATIC_DRAW)
  const buffer = webgl2.createBuffer()
  webgl2.bindBuffer(type, buffer)
  webgl2.bufferData(type, data, flags)
  return buffer
}
export function new_vao(webgl2, buffer, program, attribs) {
  webgl2.bindBuffer(webgl2.ARRAY_BUFFER, buffer) // TODO: after new_buffer(), sets this unnecessarily, cache?
  const vao = webgl2.createVertexArray()
  webgl2.bindVertexArray(vao)
  // Example: 2D position vec2 (in Float32Array) -> 'in vec4 a_position' GLSL-es300 vertex shader attribute input (expanded vec2 -> vec4)
  //
  // Map two floats (vec2) starting at byte offset 0 to vertex shader's position attribute 'a_position', where
  //   name -> index: The vertex attribute index (usually queried by name specified in vertex shader using webgl2.getAttribLocation())
  //   dim:           Dimension / # of components 1, 2, 3 or 4 (here 2 for the two floats in vec2)
  //   type:          Data type of each component in the array, webgl2.BYTE/SHORT/UNSIGNED_BYTE/UNSIGNED_SHORT/FLOAT/HALF_FLOAT/INT/UNSIGNED_INT/INT_2_10_10_10_REV (here FLOAT for the 32-bit floats in vec2
  //   normalize:     Tells whether to normalize signed types (BYTE/SHORT) -> [-1,1] or unsigned types -> [0,1] to the vertex shader attribute input value
  //   offset:        The byte offset (of the first component, i.e. offsetof(MyVertex, pos))
  //   stride:        # of bytes to the next (usually sizeof(MyVertex)) or can be 0 if no other data in between (here 0, as we only have array of vec2 positions)
  for (const a of attribs) {
    const index = webgl2.getAttribLocation( program, a.name )
    webgl2.enableVertexAttribArray( index )
    webgl2.vertexAttribPointer( index, a.dim, a.type, a.normalize ?? false, a.stride ?? 0, a.offset ?? 0 )
  }
  webgl2.bindVertexArray(null) // TODO: unbind for safety - conditional?
  return vao
}
function submit_display_list(webgl2, device, glist) {
  LOG('display list submit -> WebGL2:', gl_tostring(glist))
  for (const c of glist.cmd) {
    switch(c.cmd) {
      case 'viewport':        viewport(c.rect) ; break
      case 'clear':           clear(c.color, c.depth, c.stencil) ; break
      case 'use_program':     use_program(device.programs[c.program]) ; break
      case 'use_buffer':      use_buffer(device.buffers[c.buffer]) ; break
      case 'draw_vertices':   draw_vertices(webgl2, c.prim, c.start, c.count) ; break
      case 'draw_indices':    draw_indices(weblgl2, c.indexbuffer, c.prim, c.start, c.count) ; break
      case 'draw_renderable': draw_renderable(webgl2, c.renderable) ; break
      default:                WARNING(`unknown command: ${c.cmd}`) ; break
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
    new_program:          (vshader, fshader)                => new_program        ( webgl2, vshader, fshader ),
    new_buffer:           (type, data, flags = STATIC_DRAW) => new_buffer         ( webgl2, type, data, flags ),
    new_vao:              (buffer, program, attribs)        => new_vao            ( webgl2, buffer, program, attribs ),
    submit_display_list:  (glist)                           => submit_display_list( webgl2, device, glist ),
  }
}