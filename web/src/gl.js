import { safe_stringify } from './util.js'
import { LOGG } from './log.js'
import { TRIANGLES } from './constants.js'
import { assert_rect, vec2, vec3, vec4 } from './vecmath.js'

const cmd = (gl, name, data) => { LOGG('gl', gl, name, data); gl.cmd.push({ cmd: name, ...data }) }

export const gl_viewport            = (gl, rect)                  => cmd(gl, 'viewport', { rect: assert_rect(rect) } )
export const gl_clear               = (gl, color, depth, stencil) => cmd(gl, 'clear', { color, depth, stencil } )
export const gl_update_vertexbuffer = (gl, vertexbuffer, data)    => cmd(gl, 'update_vertexbuffer', { vertexbuffer, data } )
export const gl_update_indexbuffer  = (gl, indexbuffer, data)     => cmd(gl, 'update_indexbuffer', { indexbuffer, data } )
export const gl_use_pipe            = (gl, pipe)                  => cmd(gl, 'use_pipe', { pipe } )
export const gl_upload_uniforms     = (gl, program, uniforms)     => cmd(gl, 'upload_uniforms', { program, uniforms } )
export const gl_draw_vertices       = (gl, prim, start, count)    => cmd(gl, 'draw_vertices', { prim, start, count } )
export const gl_draw_indices        = (gl, prim, start, count)    => cmd(gl, 'draw_indices', { prim, start, count } )
export const gl_tojson              = (gl) => gl.cmd
export const gl_tostring            = (gl) => safe_stringify(gl.cmd)

export function gl_draw_imageshader(gl, pipe) {
  const g = pipe.g // kludgy..
  const program = pipe.program
  const uniforms = {
    iResolution:  vec2(g.canvas.width, g.canvas.height),
    iTime:        g.rs.time,
    iMouse:       vec4(g.mouse.x, g.mouse.y, 0, 0),
    // TODO: combine with user uniforms
  }
  gl_upload_uniforms( gl, pipe.program, uniforms )
  gl_use_pipe( gl, pipe ) // TODO: order?
  gl_draw_vertices( gl, TRIANGLES, 0, 3 )
}
