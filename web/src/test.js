import { vec2, vec3, vec4, rect, mat3, mat4, TESTLOG } from './ogl2030.js'

export function test_types() {
  const v2 = vec2(1, 2);
  const v3 = vec3(1, 2, 3);
  const v4 = vec4(1, 2, 3, 4);
  const re = rect(0, 0, 320, 240);
  const m3 = mat3();
  const m4 = mat4();

  TESTLOG('vec2:', v2);
  TESTLOG('vec3:', v3);
  TESTLOG('vec4:', v4);
  TESTLOG('rect:', re);
  TESTLOG('mat3:', m3);
  TESTLOG('mat4:', m4);
}
export function test_display_list() {
  const gl         = ogl_display_list();
  const viewport_rect = { x: 0, y: 0, width: 320, height: 240 };
  const clear_color   = { color: vec4(0.5, 0.07, 1.0, 1) };
  const clear_depth   = 1.0;
  gl_viewport( gl, viewport_rect );
  gl_clear( gl, clear_color, clear_depth ); // no stencil clear (undefined)
  TESTLOG( JSON.stringify(gl_dump(gl)) );
}
