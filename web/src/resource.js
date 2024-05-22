function og(o, g) { return {...o, g} }
export const g_new_program      = (g, vshader, fshader)       => g.backend.new_program(vshader, fshader)
export const g_new_vertexbuffer = (g, data, layout, program)  => g.backend.new_vertexbuffer(data, layout, program)
export const g_new_indexbuffer  = (g, data)                   => g.backend.new_buffer(data)
export const g_new_pipe         = (g, program, vb, ib)        => og(g.backend.new_pipe(program, vb, ib), g)
