import { ogl_new_buffer, ogl_new_vao } from './resource.js'
import { gl_update_buffer, gl_use_program, gl_use_vao, gl_draw_vertices } from './gl.js'
import { vs_pos_passthrough, fs_pink } from './shaderlib.js'
import { VERTEX_BUFFER, FLOAT, TRIANGLES } from './constants.js'

export function debug_open(ogl) {
  let pos2d = [ -0.5,  0.5, -0.5, -0.5, 0.5, -0.5 ]
  const pink_shader     = ogl_new_program   (ogl, vs_pos_passthrough, fs_pink)
  const pink_buffer     = ogl_new_buffer    (ogl, VERTEX_BUFFER, pos2d)
  const pink_vao        = ogl_new_vao       (ogl, pink_buffer, [ {name: 'a_position', dim: 2, type: FLOAT, offset: 0, normalize: false} ] )
  const pink = { shader: pink_shader, buffer: pink_buffer, vertexarray: pink_vao, prim: TRIANGLES, start: 0, count: 3 }
  //----> debug
  return {
    triangle: (rs, x0, y0, x1, y1, x2, y2) => {
      let newpos2d = [ x0, y0, x1, y1, x2, y2 ]
      gl_update_buffer(rs.gl, pink.buffer, newpos2d) // TODO: for multiple triangles, only update in flush
      gl_use_program(rs.gl, pink.program)
      gl_use_vertexarray(rs.gl, pink.vertexarray)
      gl_draw_vertices(rs.gl, pink.prim, pink.start, pink.count)
    }
  }
}