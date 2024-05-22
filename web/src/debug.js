import { ogl_new_program, ogl_new_vertexbuffer, ogl_new_pipe } from './resource.js'
import { gl_update_vertexbuffer, gl_draw_vertices, gl_use_pipe } from './gl.js'
import { vs_pos_passthrough, fs_pink } from './shaderlib.js'
import { TRIANGLES } from './constants.js'

export function debug_open(ogl) {
  const pink_program      = ogl_new_program(ogl, vs_pos_passthrough, fs_pink)
  const pink_vertexbuffer = ogl_new_vertexbuffer(ogl, null, 'vec2 a_position;', pink_program)
  const pinkpipe          = ogl_new_pipe(ogl, pink_program, pink_vertexbuffer, null)
  //----> debug
  return {
    triangle: (gl, x0, y0, x1, y1, x2, y2) => {
      let pos2d = [ x0, y0, x1, y1, x2, y2 ]
      gl_update_vertexbuffer( gl, pink_vertexbuffer, pos2d )
      gl_use_pipe( gl, pinkpipe )
      gl_draw_vertices( gl, TRIANGLES, 0, 3 )
    }
  }
}