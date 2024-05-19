import { ogl_new_shader, ogl_new_buffer, ogl_new_vao, ogl_new_renderable } from './resource.js'
import { gl_draw_renderable, gl_update_buffer } from './gl.js'

export function debug_open(ogl) {
  let pos2d = [ -0.5,  0.5,
                -0.5, -0.5,
                 0.5, -0.5 ]
  const vshader = `#version 300 es
    in vec4 a_position;
    void main() {
      gl_Position = vec4(a_position.x, a_position.y, 0.0, 1.0);
  }`
  const fshader = `#version 300 es
    precision mediump float;
    out vec4 outColor;
    void main() {
      outColor = vec4(1.0, 0.0, 1.0, 1.0); // the traditional gamedev placeholder color: bright pink!
  }`
  const pink_shader     = ogl_new_program   (ogl, vshader, fshader)
  const pink_buffer     = ogl_new_buffer    (ogl, VERTEX_BUFFER, pos2d)
  const pink_vao        = ogl_new_vao       (ogl, pink_buffer, [ {name: 'a_position', dim: 2, type: webgl2.FLOAT, offset: 0, normalize: false} ] )
  const pink = { shader: pink_shader, buffer: pink_buffer, vao: pink_vao, prim: TRIANGLES, start: 0, count: 3 }
  
  //----> debug
  return {
    triangle: (rs, x0, y0, x1, y1, x2, y2) => {
      let newpos2d = [ x0, y0, x1, y1, x2, y2 ]
      gl_update_buffer(rs.gl, pink.buffer, newpos2d) // TODO: for multiple triangles, only update in "flush"..
      gl_use_program(rs.gl, pink.program)
      gl_use_vao(rs.gl, pink.vao)
      gl_draw_vertices(webgl2, pink.prim, pink.start, pink.count)
    }
  }
}