import { mat4 } from './vecmath.js'

// TODO: going with one uniform-buffer-to-rule-them-all, but Scene >> View >> Object might be useful?
const Uniforms = {
  u_mvp:              mat4(), // object -> view -> proj (not 'u_ovp' for historical reasons, m == "model")
  u_object_to_world:  mat4(),
  u_object_to_view:   mat4(),
  u_world_to_proj:    mat4(),
  u_world_to_view:    mat4(),
  u_world_to_object:  mat4(),
  u_view_to_object:   mat4(),
  u_view_to_world:    mat4(),
  u_view_to_proj:     mat4(),
  u_proj_to_view:     mat4(),
  u_time:             vec4(0.0, 0*0, 0*0*0, 0*0*0*0), // t, t^2, t^3, t^4.. just to fill vec4 mainly, can save some cycles
}


const uniforms = {
  u_lightWorldPos: [1, 8, -10],
  u_lightColor: [1, 0.8, 0.8, 1],
  u_ambient: [0, 0, 0, 1],
  u_specular: [1, 1, 1, 1],
  u_shininess: 50,
  u_specularFactor: 1,
  u_diffuse: tex,
};