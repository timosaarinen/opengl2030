export const ogl_new_program  = (g, vshader, fshader) => g.backend.new_program(vshader, fshader)
export const ogl_new_buffer   = (g, type, data, flags = STATIC_DRAW) => g.backend.new_buffer(type, data, flags)
export const ogl_new_vao      = (g, buffer, program, attribs) => g.backend.new_vao(buffer, program, attribs)
