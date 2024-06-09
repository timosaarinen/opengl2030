// by convention, returned objects have .type constant string field, e.g. 'vec3'
export const type  = (o) => o.type
export const kind  = (o) => o.kind  // TODO: keep 'kind' as a "type of type"?
export const group = (o) => o.group // TODO: keep 'group' for logical grouping? Or 'egroup' for entity grouping?

//-------------------------------------------------------------------------------------------------
import { TESTLOG } from './test.js'
import { vec2, vec3, vec4, rect, mat3, mat4 } from './vecmath.js'
import { yx, wzyx } from './swizzle.js' // TODO: import * too polluting?

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
