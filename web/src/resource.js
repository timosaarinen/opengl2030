export const ogl_new_program      = (g, vshader, fshader)       => g.backend.new_program(vshader, fshader)
export const ogl_new_vertexbuffer = (g, data, layout, program)  => g.backend.new_vertexbuffer(data, layout, program)
export const ogl_new_indexbuffer  = (g, data)                   => g.backend.new_buffer(data)
export const ogl_new_pipe         = (g, program, vb, ib)        => g.backend.new_pipe(program, vb, ib)
