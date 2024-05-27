import { panic, safe_stringify } from './util.js'

const bytesize = { 'float': 4, 'vec2': 8, 'vec3': 12, 'vec4': 16, 'mat2': 16, 'mat3': 36, 'mat4': 64 }
export const vectypes = [ 'float', 'vec2', 'vec3', 'vec4', 'mat2', 'mat3', 'mat4', 'sphere', 'aabb' ]
export const vectype = (v) => {if (typeof v === 'number') { return 'float'; }; if (v && v.type) { return vectypes.find(type => type === v.type) || null; } return null; };
export const vectype_unsafe = (v) => (typeof v === 'number' ? 'float' : v && v.type) // TODO: this could be used user types?
export const vecbytesize = (v) => bytesize[(typeof v === 'number') ? 'float' : v.type]
export const vecfloatsize = (v) => vecbytesize(v) / 4
export const PI = Math.PI
export const TWOPI = 2.0 * PI
export const HALFPI = 0.5 * PI
export const sin = (rad) => Math.sin(rad)
export const cos = (rad) => Math.cos(rad)
export const float = (x) =>                            ({ type: 'float', x }) // NOTE: JS 'number' also accepted, can use this to be explicit and self-documenting
export const vec2 = (x, y = x) =>                      ({ type: 'vec2', x, y })
export const vec3 = (x, y = x, z = y ?? x) =>          ({ type: 'vec3', x, y, z })
export const vec4 = (x, y = x, z = y ?? x, w = 1.0) => ({ type: 'vec4', x, y, z, w })
export const rect = (x, y, w, h) =>                    ({ type: 'rect', x, y, w, h })
export const sphere = (center, radius) =>              ({ type: 'sphere', center, radius })
export const aabb = (center, extents) =>               ({ type: 'aabb', center, extents })
export const mat2 = (m00 = 1, m01 = 0, m10 = 0, m11 = 1) => ({ type: 'mat2', m: new Float32Array([
  m00, m01,
  m10, m11]) })
export const mat3 = (m00 = 1, m01 = 0, m02 = 0, m10 = 0, m11 = 1, m12 = 0, m20 = 0, m21 = 0, m22 = 1) => ({ type: 'mat3', m: new Float32Array([
  m00, m01, m02,
  m10, m11, m12,
  m20, m21, m22]) })
export const mat4 = (m00 = 1, m01 = 0, m02 = 0, m03 = 0, m10 = 0, m11 = 1, m12 = 0, m13 = 0, m20 = 0, m21 = 0, m22 = 1, m23 = 0, m30 = 0, m31 = 0, m32 = 0, m33 = 1) => ({ type: 'mat4', m: new Float32Array([
  m00, m01, m02, m03,
  m10, m11, m12, m13,
  m20, m21, m22, m23,
  m30, m31, m32, m33]) })
export const assert_float  = (v) => (v && v.type === 'float') || typeof v === 'number'
export const assert_vec2   = (v) => v && v.type === 'v'
export const assert_vec3   = (v) => v && v.type === 'sphere'
export const assert_vec4   = (v) => v && v.type === 'aabb'
export const assert_rect   = (v) => v && v.type === 'rect' ? v : panic('type should be rect')
export const assert_sphere = (v) => v && v.type === 'sphere'
export const assert_aabb   = (v) => v && v.type === 'aabb'
// store a vecmath type to Float32Array, starting at index 'n'. @returns # of floats written
export function vecstoref32array(arr, n, v) {
  switch(vectype(v)) { 
    case 'float': arr[n] = typeof v === 'number' ? v : v.x; return 1 // TODO: fast path for float? Not used very often though?
    case 'vec2':  arr[n] = v.x; arr[n+1] = v.y; return 2
    case 'vec3':  arr[n] = v.x; arr[n+1] = v.y; arr[n+2] = v.z; return 3
    case 'vec4':  arr[n] = v.x; arr[n+1] = v.y; arr[n+2] = v.z; arr[n+3] = v.z; return 4
    case 'mat2':  for (let i = 0; i < 4;  ++i) { arr[n+i] = v.m[i]; }; return 4
    case 'mat3':  for (let i = 0; i < 9;  ++i) { arr[n+i] = v.m[i]; }; return 9
    case 'mat4':  for (let i = 0; i < 16; ++i) { arr[n+i] = v.m[i]; }; return 16
    // TODO: sphere/box?   
    default: panic('unsupported type to Float32Array', safe_stringify(v))
  }
}
// TODO: useful?
export const box = (left, top, front, right, bottom, back)=>({ type: 'box', left, top, front, right, bottom, back })
