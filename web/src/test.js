import { vec2, vec3, vec4, rect, mat3, mat4 } from './vecmath.js'
import { fmt } from './util.js'
import { etext } from './html.js'
import { yx, wzyx } from './swizzle.js'

export const TESTLOG = (...args) => { const s = fmt(...args); console.log(s); etext('testlog', s) } // also print to 'testlog' HTML element

export function test_types() {
  const v2 = vec2(1, 2)
  const v3 = vec3(1, 2, 3)
  const v4 = vec4(1, 2, 3, 4)
  const re = rect(0, 0, 320, 240)
  const m3 = mat3()
  const m4 = mat4()

  TESTLOG('vec2: v2 = vec2(1, 2) =>', v2)
  TESTLOG('vec3: v3 = vec3(1, 2, 3) =>', v3)
  TESTLOG('vec4: v4 = vec4(1, 2, 3, 4) =>', v4)
  TESTLOG('rect: re = rect(0, 0, 320, 240)', re)
  TESTLOG('mat3: m3 = mat3() =>', m3)
  TESTLOG('mat4: m4 = mat4() =>', m4)
  
  TESTLOG('-- swizzle --')
  TESTLOG('s2 = yx(v2) =>', yx(v2))
  TESTLOG('s4 = wzyx(v4) =>', wzyx(v4))
}
export function test_display_list() {
  const gl            = g_display_list()
  const viewport_rect = { x: 0, y: 0, width: 320, height: 240 }
  const clear_color   = { color: vec4(0.5, 0.07, 1.0, 1) }
  const clear_depth   = 1.0
  gl_viewport( gl, viewport_rect )
  gl_clear( gl, clear_color, clear_depth ) // no stencil clear (undefined)
  TESTLOG( JSON.stringify(gl_dump(gl)) )
}
