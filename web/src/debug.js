import { g_new_program, g_new_vertexbuffer, g_new_pipe, g_new_imageshader } from './resource.js'
import { gl_update_vertexbuffer, gl_draw_vertices, gl_use_pipe, gl_draw_imageshader } from './gl.js'
import { vs_pos_passthrough, vs_pos_color, fs_pink, fs_vertexcolor, fs_imageshader_test } from './shaderlib.js'
import { color, vec2, tovec2, vecstoref32array } from './vecmath.js'
import { TRIANGLES } from './constants.js'
import { ASSERT } from './util.js'

export function debug_open(g) {
  const pink_program = g_new_program( g, vs_pos_passthrough, fs_pink )
  const pink_vertexbuffer = g_new_vertexbuffer( g, null, 'vec2 a_position;', pink_program )
  const pink_pipe = g_new_pipe( g, pink_program, pink_vertexbuffer, null )

  const vertexcolor_program = g_new_program( g, vs_pos_color, fs_vertexcolor )
  const vertexcolor_vertexbuffer = g_new_vertexbuffer( g, null, 'vec2 a_position; vec4 a_color;', vertexcolor_program )
  const vertexcolor_pipe = g_new_pipe( g, vertexcolor_program, vertexcolor_vertexbuffer, null )

  const imageshader = g_new_imageshader( g, fs_imageshader_test )
  const VBUFFER_LEN = 64*1024
  const vbuffer = new Float32Array( VBUFFER_LEN )
  let vbuffer_n = 0
  let debug_color = color(1, 0, 1, 1) // default debug color: traditional placeholder pink

  const flush_vbuffer = (gl) => {
    gl_update_vertexbuffer( gl, vertexcolor_vertexbuffer, vbuffer )
    gl_use_pipe( gl, vertexcolor_pipe ) // TODO: per pipe buffers
    gl_draw_vertices( gl, TRIANGLES, 0, vbuffer_n ) // TODO: quad + that buffer + flush!
    vbuffer_n = 0
  }

  //----> debug
  return {
    color: (c) => debug_color = c,
    flush: (gl) => flush_vbuffer(gl),
    triangle: (gl, x0, y0, x1, y1, x2, y2, c0 = debug_color, c1 = debug_color, c2 = debug_color) => { // TODO: just use vec-input tri() below, remove this func?
      const len = 3*(2+4)
      if (vbuffer_n + len > VBUFFER_LEN) { flush_vbuffer(gl) }
      let start = vbuffer_n
      vbuffer_n += vecstoref32array(vbuffer, vbuffer_n, vec2(x0, y0)) // 'vec2 a_position; vec4 a_color;'
      vbuffer_n += vecstoref32array(vbuffer, vbuffer_n, c0)
      vbuffer_n += vecstoref32array(vbuffer, vbuffer_n, vec2(x1, y1))
      vbuffer_n += vecstoref32array(vbuffer, vbuffer_n, c1)
      vbuffer_n += vecstoref32array(vbuffer, vbuffer_n, vec2(x2, y2))
      vbuffer_n += vecstoref32array(vbuffer, vbuffer_n, c2)
      ASSERT(vbuffer_n == start+len)
    },
    tri: (gl, v0, v1, v2, c0 = debug_color, c1 = debug_color, c2 = debug_color) => {
      const len = 3*(2+4)
      if (vbuffer_n + len > VBUFFER_LEN) { flush_vbuffer(gl) }
      let start = vbuffer_n
      v0 = tovec2(v0)
      v1 = tovec2(v1)
      v2 = tovec2(v2)
      vbuffer_n += vecstoref32array(vbuffer, vbuffer_n, v0) // 'vec2 a_position; vec4 a_color;' 
      vbuffer_n += vecstoref32array(vbuffer, vbuffer_n, c0)
      vbuffer_n += vecstoref32array(vbuffer, vbuffer_n, v1)
      vbuffer_n += vecstoref32array(vbuffer, vbuffer_n, c1)
      vbuffer_n += vecstoref32array(vbuffer, vbuffer_n, v2)
      vbuffer_n += vecstoref32array(vbuffer, vbuffer_n, c2)
      ASSERT(vbuffer_n == start+len)
    },
    quad: (gl, v0, v1, v2, v3, c0 = debug_color, c1 = debug_color, c2 = debug_color, c3 = debug_color) => {
      const len = 2*3*(2+4)
      if (vbuffer_n + len > VBUFFER_LEN) { flush_vbuffer(gl) }
      let start = vbuffer_n
      v0 = tovec2(v0)
      v1 = tovec2(v1)
      v2 = tovec2(v2)
      v3 = tovec2(v3)
      vbuffer_n += vecstoref32array(vbuffer, vbuffer_n, v0) // 'vec2 a_position; vec4 a_color;'
      vbuffer_n += vecstoref32array(vbuffer, vbuffer_n, c0)
      vbuffer_n += vecstoref32array(vbuffer, vbuffer_n, v1)
      vbuffer_n += vecstoref32array(vbuffer, vbuffer_n, c1)
      vbuffer_n += vecstoref32array(vbuffer, vbuffer_n, v2)
      vbuffer_n += vecstoref32array(vbuffer, vbuffer_n, c2)
      // second tri (TODO: indexed drawing - could use strips, but too much hassle for debug)
      vbuffer_n += vecstoref32array(vbuffer, vbuffer_n, v0)
      vbuffer_n += vecstoref32array(vbuffer, vbuffer_n, c0)
      vbuffer_n += vecstoref32array(vbuffer, vbuffer_n, v2)
      vbuffer_n += vecstoref32array(vbuffer, vbuffer_n, c2)
      vbuffer_n += vecstoref32array(vbuffer, vbuffer_n, v3)
      vbuffer_n += vecstoref32array(vbuffer, vbuffer_n, c3)
      ASSERT(vbuffer_n == start+len)
    },
    imageshader: (gl) => {
      gl_draw_imageshader( gl, imageshader )
    }
  }
}
