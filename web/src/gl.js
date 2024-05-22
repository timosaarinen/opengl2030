import { LOG } from './util.js';

const cmd = (gl, name, data) => { LOG(gl, name, data); gl.cmd.push({ cmd: name, ...data }) }

export const gl_viewport            = (gl, rect)                  => cmd(gl, 'viewport', { rect } )
export const gl_clear               = (gl, color, depth, stencil) => cmd(gl, 'clear', { color, depth, stencil } )
export const gl_update_vertexbuffer = (gl, vertexbuffer, data)    => cmd(gl, 'update_vertexbuffer', { vertexbuffer, data } )
export const gl_update_indexbuffer  = (gl, indexbuffer, data)     => cmd(gl, 'update_indexbuffer', { indexbuffer, data } )
export const gl_use_pipe            = (gl, pipe)                  => cmd(gl, 'use_pipe', { pipe } )
export const gl_draw_vertices       = (gl, prim, start, count)    => cmd(gl, 'draw_vertices', { prim, start, count } )
export const gl_draw_indices        = (gl, prim, start, count)    => cmd(gl, 'draw_indices', { prim, start, count } )
export const gl_tojson              = (gl) => gl.cmd
export const gl_tostring            = (gl) => JSON.stringify(gl.cmd)
