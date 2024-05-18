export const PI      = Math.PI
export const TWOPI   = 2.0 * PI
export const HALFPI  = 0.5 * PI
export const sin = (rad) => Math.sin(rad)
export const cos = (rad) => Math.cos(rad)
export const vec2 = (x, y) => ({ x, y })
export const vec3 = (x, y, z) => ({ x, y, z })
export const vec4 = (x, y, z, w) => ({ x, y, z, w })
export const rect = (x, y, width, height) => ({ x, y, width, height })
export const box = (left, top, front, right, bottom, back) => ({ left, top, front, right, bottom, back }) // TODO: vec3 center, vec3 extents?
export const sphere = (x, y, z, radius) => ({ x, y, z, radius })                                          // TODO: vec3 center?
export const mat3 = (m00 = 1, m01 = 0, m02 = 0, m10 = 0, m11 = 1, m12 = 0, m20 = 0, m21 = 0, m22 = 1) => [
  [m00, m01, m02,
   m10, m11, m12,
   m20, m21, m22]
]
export const mat4 = (m00 = 1, m01 = 0, m02 = 0, m03 = 0, m10 = 0, m11 = 1, m12 = 0, m13 = 0, m20 = 0, m21 = 0, m22 = 1, m23 = 0, m30 = 0, m31 = 0, m32 = 0, m33 = 1) => [
  [m00, m01, m02, m03,
   m10, m11, m12, m13,
   m20, m21, m22, m23,
   m30, m31, m32, m33]
]
