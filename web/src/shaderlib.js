export const vs_pos_passthrough = `#version 300 es
in vec4 a_position;
void main() {
  gl_Position = a_position;
}`
export const vs_pos = `#version 300 es
in vec4 a_position;
uniform highp mat4 u_mvp;
void main() {
  gl_Position = a_position * u_mvp;
}`
export const vs_pos_color = `#version 300 es
in vec4 a_position;
in vec4 a_color;
out vec4 v_color;
uniform highp mat4 u_mvp;
void main() {
  gl_Position = a_position * u_mvp;
  v_color = a_color;
}`
export const vs_pos_uv_color = `#version 300 es
in vec4 a_position;
in vec4 a_color;
in vec2 a_uv;
out vec2 v_uv;
out vec4 v_color;
uniform highp mat4 u_mvp;
void main() {
  gl_Position = a_position * u_mvp;
  v_uv = a_uv;
  v_color = a_color;
}`
export const fs_pink = `#version 300 es
precision mediump float;
out vec4 frag_color;
void main() {
  frag_color = vec4(1.0, 0.0, 1.0, 1.0); // the traditional gamedev placeholder color: bright pink!
}`
export const fs_vertexcolor = `#version 300 es
precision mediump float;
in vec4 v_color;
out vec4 frag_color;
void main() {
  frag_color = v_color;
}`
export const fs_texture = `#version 300 es
precision mediump float;
in vec4 v_color;
in vec2 v_uv;
out vec4 frag_color;
uniform texture2D iChannel0;
void main() {
  frag_color = v_color * texture(iChannel0, v_uv);
}`
// TODO: shadertoy compat, uniforms, add to gl the sets (uniform buffers) - TODO: Protean Clouds by X here
export const fs_test_shadertoy = `#version 300 es
precision mediump float;
uniform vec3 iResolution;
uniform float iTime;
uniform vec4 iMouse;
out vec4 frag_color;
void main() {
  vec2 uv = gl_FragCoord.xy / iResolution.xy;
  vec3 color = 0.5 + 0.5 * cos(iTime + uv.xyx);
  frag_color = vec4(color, 1.0);
}`
