import { mat4, vec2, vec4, fvec, float } from './vecmath.js'

export const UBO_SIZE = 8192     // TODO:
export const UBO_ARRAY_INDEX = 0 // TODO: hard-coded, matters?

// TODO: going with one uniform-buffer-to-rule-them-all, but Scene >> View >> Object might be useful?
// TODO: DRY.. duplicated in shaderlib.js, codegen
// mvp == object -> view -> proj (not 'u_ovp' for historical reasons, m == "model" -> model-view-projection)
export const Uniforms = {
  mvp:              mat4(),
  object_to_world:  mat4(),
  object_to_view:   mat4(),
  world_to_proj:    mat4(),
  world_to_view:    mat4(),
  world_to_object:  mat4(),
  view_to_object:   mat4(),
  view_to_world:    mat4(),
  view_to_proj:     mat4(),
  proj_to_view:     mat4(),
  u0:               vec4(),
  u1:               vec4(),
  u2:               vec4(),
  u3:               vec4(),
  u4:               vec4(),
  u5:               vec4(),
  u6:               vec4(),
  u7:               vec4(),
  umtx0:            mat4(),
  umtx1:            mat4(),
  umtx2:            mat4(),
  umtx3:            mat4(),
  uvec:             fvec(256),
  iResolution:      vec2(),
  iTime:            float(),
  iMouse:           vec4(),
}
export function uniforms_new() {
  return Uniforms
}
export function uniforms_update(u, mvp = mat4(), w = 0, h = 0, time = 0, mx = 0, my = 0) {
  u.mvp = mvp
  u.iResolution = vec2(w, h)      // vec2(g.canvas.width, g.canvas.height),
  u.iTime = time                  // g.rs.time,
  u.iMouse = vec4(mx, my, 0, 0)   // vec4(g.mouse.x, g.mouse.y, 0, 0)
  return u
}
