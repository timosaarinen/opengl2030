import { vs_pos_passthrough } from './shaderlib.js'

function og(o, g) { return {...o, g} }
export const g_new_program      = (g, vshader, fshader)       => g.backend.new_program(vshader, fshader)
export const g_new_vertexbuffer = (g, data, layout, program)  => g.backend.new_vertexbuffer(data, layout, program)
export const g_new_indexbuffer  = (g, data)                   => g.backend.new_buffer(data)
export const g_new_pipe         = (g, program, vb, ib)        => og(g.backend.new_pipe(program, vb, ib), g)

export function g_new_imageshader(g, fshader) {
  const program = g_new_program( g, vs_pos_passthrough, fshader ) // TODO: vb shouldn't take this!
  const vertices = new Float32Array([-1.0, -1.0, 3.0, -1.0, -1.0, 3.0])
  const vb = g_new_vertexbuffer(g, vertices, 'vec2 a_position;', program) // TODO: can reuse VB for all imageshaders, except need quad for non-fullscreen.. or actually just gl_viewport? Want to keep that one triangle, no ugly diagonal lines please. HW should have that as no-cost. Need to restore viewport to original one, tho. Or was.. there another cliprect call?
  const imageshader = g_new_pipe( g, program, vb )
  return imageshader
}
