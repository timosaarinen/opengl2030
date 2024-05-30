import { panic, safe_stringify, ASSERT } from './util.js'
//------------------------------------------------------------------------
//  Base types
//------------------------------------------------------------------------
export const FLOAT_SIZE = 4
export const vectypes = [ 'float', 'fvec', 'vec2', 'vec3', 'vec4', 'color', 'sphere', 'rect', 'mat2', 'mat3', 'mat4', 'sphere', 'aabb' ]
const bytesize = { 'float': 4, 'vec2': 8, 'vec3': 12, 'vec4': 16, 'color': 16, 'sphere': 16, 'rect': 16, 'mat2': 16, 'mat3': 36, 'mat4': 64 }
export const vectype = (v) => { if (typeof v === 'number') { return 'float'; }; if (v && v.type) { return vectypes.find(type => type === v.type) || null; } return null; };
export const vectype_unsafe = (v) => (typeof v === 'number' ? 'float' : v.type)
export const vecbytesize = (v) => (typeof v === 'number') ? FLOAT_SIZE : ((v.type === 'fvec') ? (v.m.length * FLOAT_SIZE) : bytesize[v.type])
export const vecfloatsize = (v) => vecbytesize(v) / FLOAT_SIZE
export const float = (x) =>                            ({ type: 'float', x }) // TODO: if accepting js 'number' as float, req?
export const fvec = (len) =>                           ({ type: 'fvec', m: new Float32Array(len) })
export const vec2 = (x, y = x) =>                      ({ type: 'vec2', x, y })
export const vec3 = (x, y = x, z = y ?? x) =>          ({ type: 'vec3', x, y, z })
export const vec4 = (x, y = x, z = y ?? x, w = 1.) =>  ({ type: 'vec4', x, y, z, w })
export const color = (r, g = r, b = g ?? r, a = 1.) => ({ type: 'vec4', r, g, b, a }) // TODO: need implicit color -> vec4
export const plane = (n, d) =>                         {{ type: 'vec4', n.x, n.y, n.z, d }} // plane ax + by + cz + d = 0, or n.x*x + n.y*y + n.z*z + d = 0, or dot(n,p) + d = 0
export const rect = (x, y, w, h) =>                    ({ type: 'rect', x, y, w, h }) // TODO: should actually be x2/y2 bounds for faster shader inside test?
export const sphere = (center, radius) =>              ({ type: 'sphere', center, radius })
export const aabb = (center, extents) =>               ({ type: 'aabb', center, extents }) // TODO: this doesn't fit in vec4, uses?
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
export const assert_float  = (v) => ((v && v.type === 'float') || typeof v === 'number') ? v : panic('type should be float')
export const assert_fvec   = (v) => (v && v.type === 'vec2'   ) ? v : panic('type should be fvec')
export const assert_vec2   = (v) => (v && v.type === 'vec2'   ) ? v : panic('type should be vec2')
export const assert_vec3   = (v) => (v && v.type === 'vec3'   ) ? v : panic('type should be vec3')
export const assert_vec4   = (v) => (v && v.type === 'vec4'   ) ? v : panic('type should be vec4')
export const assert_color  = (v) => (v && v.type === 'color'  ) ? v : panic('type should be color')
export const assert_rect   = (v) => (v && v.type === 'rect'   ) ? v : panic('type should be rect')
export const assert_sphere = (v) => (v && v.type === 'sphere' ) ? v : panic('type should be sphere')
export const assert_aabb   = (v) => (v && v.type === 'aabb'   ) ? v : panic('type should be aabb')
// generic get Nth component
export function vget(v, n) { 
  switch(vectype(v)) { 
    case 'fvec':    ASSERT(n < v.m.length); return v.m[n]
    case 'float':   ASSERT(n === 0); return typeof v === 'number' ? v : v.x
    case 'vec2':    ASSERT(n < 2); return n === 0 ? v.x : v.y
    case 'vec3':    ASSERT(n < 3); return n === 0 ? v.x : (n === 1 ? v.y : v.z)
    case 'vec4':    ASSERT(n < 4); return n === 0 ? v.x : (n === 1 ? v.y : (n === 2 ? v.z : v.w))
    case 'color':   ASSERT(n < 4); return n === 0 ? v.r : (n === 1 ? v.g : (n === 2 ? v.b : v.a))
    case 'rect':    ASSERT(n < 4); return n === 0 ? v.x : (n === 1 ? v.y : (n === 2 ? v.w : v.h))
    case 'sphere':  ASSERT(n < 4); return n === 0 ? v.center.x : (n === 1 ? v.center.y : (n === 2 ? v.center.z : v.radius))
    case 'mat2':    for (let i = 0; i < 4;  ++i) { arr[n+i] = v.m[i]; }; return 4
    case 'mat3':    for (let i = 0; i < 9;  ++i) { arr[n+i] = v.m[i]; }; return 9
    case 'mat4':    for (let i = 0; i < 16; ++i) { arr[n+i] = v.m[i]; }; return 16
    default: panic('vget(): unsupported type', safe_stringify(v))
  }
}
// store a vecmath type to Float32Array, starting at index 'n'. @returns # of floats written
export function vecstoref32array(arr, n, v) {
  switch(vectype(v)) { 
    case 'float':   arr[n] = typeof v === 'number' ? v : v.x; return 1 // TODO: fast path for float? Not used very often though?
    case 'vec2':    arr[n] = v.x; arr[n+1] = v.y; return 2
    case 'vec3':    arr[n] = v.x; arr[n+1] = v.y; arr[n+2] = v.z; return 3
    case 'vec4':    arr[n] = v.x; arr[n+1] = v.y; arr[n+2] = v.z; arr[n+3] = v.z; return 4
    case 'color':   arr[n] = v.r; arr[n+1] = v.g; arr[n+2] = v.b; arr[n+3] = v.a; return 4
    case 'rect':    arr[n] = v.x; arr[n+1] = v.y; arr[n+2] = v.w; arr[n+3] = v.h; return 4
    case 'sphere':  arr[n] = v.center.x; arr[n+1] = v.center.y; arr[n+2] = v.center.z; arr[n+3] = v.radius; return 4
    case 'mat2':    for (let i = 0; i < 4;  ++i) { arr[n+i] = v.m[i]; }; return 4
    case 'mat3':    for (let i = 0; i < 9;  ++i) { arr[n+i] = v.m[i]; }; return 9
    case 'mat4':    for (let i = 0; i < 16; ++i) { arr[n+i] = v.m[i]; }; return 16
    case 'fvec':    for (let i = 0; i < v.m.length; ++i) { arr[n+i] = v.m[i]; }; return v.m.length
    default: panic('vecstoref32array(): unsupported type', safe_stringify(v))
  }
}
//------------------------------------------------------------------------
//  Scalar math
//------------------------------------------------------------------------
export const PI = Math.PI
export const TWOPI = 2.0 * PI
export const HALFPI = 0.5 * PI
export const sin = (rad) => Math.sin(rad)
export const cos = (rad) => Math.cos(rad)
export const pow = (x, e) => Math.pow(x, e)
export const min = (a, b) => a < b ? a : b
export const max = (a, b) => a > b ? a : b
export const lerp = (minv, maxv, t) => minv + t * (maxv - minv)
export const clamp = (x, minv, maxv) => min( maxv, x, max(0.0, 1.0) )   
export const saturate = (x) => clamp( x, 0.0, 1.0 )
export const urand = () => Math.random() //[0,1]
export const srand = () => 2.0 * Math.random() - 1.0 //[-1,1]
//------------------------------------------------------------------------
//  3D vector math
//------------------------------------------------------------------------
export const dot = (a, b) => a.x * b.x + a.y * b.y + a.z * b.z
export const min3 = (a, b) => vec3(a.x < b.x ? a.x : b.x, a.y < b.y ? a.y : b.y, a.z < b.z ? a.z : b.z)
export const max3 = (a, b) => vec3(a.x > b.x ? a.x : b.x, a.y > b.y ? a.y : b.y, a.z > b.z ? a.z : b.z)
//------------------------------------------------------------------------
// 2x2 transformation matrix functions
//  - rotations 'a' are counter-clockwise radians
//------------------------------------------------------------------------
export const rotation2d         = (a) => mat2( cos(a), -sin(a), sin(a),  cos(a) )
export const scale2d_uniform    = (s) => mat2( s, 0.0, 0.0, s )
export const scale2d            = (v) => mat2( v.x, 0.0, 0.0, v.y )
export const shear2d            = (v) => mat2( 1, v.x, v.y, 1 )
//------------------------------------------------------------------------
// 4x4 transformation matrix functions
//------------------------------------------------------------------------
export const rotation_axis_angle = (axis, angle) => {
  axis = normalize(axis)
  const s = sin(angle)
  const c = cos(angle)
  const oc = 1.0 - c
  return mat4( oc * axis.x * axis.x + c,          oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0,
               oc * axis.x * axis.y + axis.z * s, oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0,
               oc * axis.z * axis.x - axis.y * s, oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0,
               0,                                 0,                                  0,                                  1 )
}
