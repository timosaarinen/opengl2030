export function ogl_new_program(g, vshader, fshader) {
  assert(vshader && fshader)
  return g.backend.new_program(vshader, fshader)
}
export function ogl_new_buffer(g, type, data, flags = STATIC_DRAW) {
  assert(type == VERTEX_BUFFER || type == INDEX_BUFFER)
  return g.backend.new_buffer(type, data, flags)
}
export function ogl_new_vao(g, buffer, attribs) {
  // TODO: store buffer?
  assert(buffer && typeof attribs == 'array');
  return g.backend.new_vao(attribs);
}
export function ogl_new_renderable(g, shader, buffer, vao, prim, start, count) {
  return { shader: shader, buffer: buffer, vao: vao, prim: prim, start: start, count: count }
}
