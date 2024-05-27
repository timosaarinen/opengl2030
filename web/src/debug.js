import { g_new_program, g_new_vertexbuffer, g_new_pipe, g_new_imageshader } from './resource.js'
import { gl_update_vertexbuffer, gl_draw_vertices, gl_use_pipe, gl_draw_imageshader } from './gl.js'
import { vs_pos_passthrough, vs_pos_color, fs_pink, fs_vertexcolor, fs_imageshader_test } from './shaderlib.js'
import { vec4 } from './vecmath.js'
import { TRIANGLES } from './constants.js'

export function debug_open(g) {
  const pink_program = g_new_program( g, vs_pos_passthrough, fs_pink )
  const pink_vertexbuffer = g_new_vertexbuffer( g, null, 'vec2 a_position;', pink_program )
  const pink_pipe = g_new_pipe( g, pink_program, pink_vertexbuffer, null )

  const vertexcolor_program = g_new_program( g, vs_pos_color, fs_vertexcolor )
  const vertexcolor_vertexbuffer = g_new_vertexbuffer( g, null, 'vec2 a_position; vec4 a_color;', vertexcolor_program )
  const vertexcolor_pipe = g_new_pipe( g, vertexcolor_program, vertexcolor_vertexbuffer, null )

  const imageshader = g_new_imageshader( g, fs_imageshader_test )
  let debug_color = vec4(1, 0, 1, 1) // default debug color: traditional placeholder pink
  //----> debug
  return {
    color: (c) => debug_color = c,
    triangle: (gl, x0, y0, x1, y1, x2, y2) => {
      let vertexdata = new Float32Array([ x0, y0, debug_color.x, debug_color.y, debug_color.z, debug_color.w, 
                                          x1, y1, debug_color.x, debug_color.y, debug_color.z, debug_color.w,
                                          x2, y2, debug_color.x, debug_color.y, debug_color.z, debug_color.w ]) // 'vec2 a_position; vec4 a_color;'
      gl_update_vertexbuffer( gl, vertexcolor_vertexbuffer, vertexdata )
      gl_use_pipe( gl, vertexcolor_pipe )
      gl_draw_vertices( gl, TRIANGLES, 0, 3 )
    },
    imageshader: (gl) => {
      gl_draw_imageshader( gl, imageshader )
    }
  }
}
