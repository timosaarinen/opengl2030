import { g_new_program, g_new_vertexbuffer, g_new_pipe, g_new_imageshader } from './resource.js'
import { gl_update_vertexbuffer, gl_draw_vertices, gl_use_pipe, gl_draw_imageshader } from './gl.js'
import { vs_pos_passthrough, fs_pink, fs_imageshader_test } from './shaderlib.js'
import { TRIANGLES } from './constants.js'

export function debug_open(g) {
  const pink_program = g_new_program( g, vs_pos_passthrough, fs_pink )
  const pink_vertexbuffer = g_new_vertexbuffer( g, null, 'vec2 a_position;', pink_program )
  const pinkpipe = g_new_pipe( g, pink_program, pink_vertexbuffer, null )
  const imageshader = g_new_imageshader( g, fs_imageshader_test )
  //----> debug
  return {
    triangle: (gl, x0, y0, x1, y1, x2, y2) => {
      let pos2d = new Float32Array([ x0, y0, x1, y1, x2, y2 ])
      gl_update_vertexbuffer( gl, pink_vertexbuffer, pos2d )
      gl_use_pipe( gl, pinkpipe )
      gl_draw_vertices( gl, TRIANGLES, 0, 3 )
    },
    imageshader: (gl) => {
      gl_draw_imageshader( gl, imageshader )
    }
  }
}
