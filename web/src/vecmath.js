import { panic, safe_stringify, ASSERT } from './util.js'
//------------------------------------------------------------------------
//  Base types
//------------------------------------------------------------------------
export const FLOAT_SIZE = 4
export const vectypes = [ 'float', 'fvec', 'vec2', 'vec3', 'vec4', 'mat2', 'mat3', 'mat4', 'aabb' ] // TODO: 'number' for from js 'number' conversion?
const bytesize = { 'float': 4, 'vec2': 8, 'vec3': 12, 'vec4': 16, 'mat2': 16, 'mat3': 36, 'mat4': 64 }
export const vectype = (v) => { if (typeof v === 'number') { return 'float'; }; if (v && v.type) { return vectypes.find(type => type === v.type) || null; } return null; };
export const vectype_unsafe = (v) => (typeof v === 'number' ? 'float' : v.type)
export const vecbytesize = (v) => (typeof v === 'number') ? FLOAT_SIZE : ((v.type === 'fvec') ? (v.m.length * FLOAT_SIZE) : bytesize[v.type])
export const vecfloatsize = (v) => vecbytesize(v) / FLOAT_SIZE
export const float = (x = 0) =>                             ({ type: 'float', m: new Float32Array( [x] ) }) // TODO: if accepting js 'number' as float, req?
export const fvec = (len) =>                                ({ type: 'fvec',  m: new Float32Array( len ) })
export const vec2 = (x = 0, y = x) =>                       ({ type: 'vec2', x, y })
export const vec3 = (x = 0, y = x, z = y ?? x) =>           ({ type: 'vec3', x, y, z })
export const vec4  = (x = 0, y = x, z = y ?? x, w = 1.) =>  ({ type: 'vec4',   x,            y,            z,            w         })
export const color = (r = 0, g = r, b = g ?? r, a = 1.) =>  ({ type: 'vec4',   x: r,         y: g,         z: b,         w: a      })
export const plane = (n = vec3(0), d) =>                    ({ type: 'vec4',   x: n.x,       y: n.y,       z: n.z,       w: d      }) // plane ax + by + cz + d = 0
export const rect = (x = 0, y = 0, w = 0, h = 0) =>         ({ type: 'vec4',   x,            y,            z: w,         w: h      }) // TODO: should actually be x2/y2 bounds for faster shader inside test?
export const sphere = (center = vec3(0), radius = 0) =>     ({ type: 'vec4',   x: center.x,  y: center.y,  z: center.z,  w: radius })
export const aabb = (center = vec3(0), extents = vec3(0)) =>({ type: 'aabb', center, extents }) // TODO: this doesn't fit in vec4, uses?
export const mat2 = (m00 = 1, m01 = 0, m10 = 0, m11 = 1) => ({ type: 'mat2', m: new Float32Array([ // TODO: would fit into vec4, but keep 'mat2' for 'm'
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
export const tovec2 = (v) => vec2(v.x, v.y) // TODO:
export const tovec3 = (v) => vec3(v.x, v.y, v.z) // TODO:
export const tovec4 = (v) => vec4(v.x, v.y, v.z, v.w) // TODO:
export const assert_float  = (v) => ((v && v.type === 'float') || typeof v === 'number') ? v : panic('type should be float')
export const assert_fvec   = (v) => (v && v.type === 'vec2'   ) ? v : panic('type should be fvec')
export const assert_vec2   = (v) => (v && v.type === 'vec2'   ) ? v : panic('type should be vec2')
export const assert_vec3   = (v) => (v && v.type === 'vec3'   ) ? v : panic('type should be vec3')
export const assert_vec4   = (v) => (v && v.type === 'vec4'   ) ? v : panic('type should be vec4')
export const assert_aabb   = (v) => (v && v.type === 'aabb'   ) ? v : panic('type should be aabb')
export const assert_mat2   = (v) => (v && v.type === 'mat2'   ) ? v : panic('type should be mat2')
export const assert_mat3   = (v) => (v && v.type === 'mat3'   ) ? v : panic('type should be mat3')
export const assert_mat4   = (v) => (v && v.type === 'mat4'   ) ? v : panic('type should be mat4')
// generic get Nth component
export function vget(v, n) { 
  switch(vectype(v)) { 
    case 'vec2':    ASSERT(n < 2); return n === 0 ? v.x : v.y
    case 'vec3':    ASSERT(n < 3); return n === 0 ? v.x : (n === 1 ? v.y : v.z)
    case 'vec4':    ASSERT(n < 4); return n === 0 ? v.x : (n === 1 ? v.y : (n === 2 ? v.z : v.w))
    case 'float':   ASSERT(n === 0); return typeof v === 'number' ? v : v.m[0]
    case 'fvec':    ASSERT(n < v.m.length); return v.m[n]
    case 'mat2':    for (let i = 0; i < 4;  ++i) { arr[n+i] = v.m[i]; }; return 4
    case 'mat3':    for (let i = 0; i < 9;  ++i) { arr[n+i] = v.m[i]; }; return 9
    case 'mat4':    for (let i = 0; i < 16; ++i) { arr[n+i] = v.m[i]; }; return 16
    default: panic('vget(): unsupported type', safe_stringify(v))
  }
}
// store a vecmath type to Float32Array, starting at index 'n'. @returns # of floats written
export function vecstoref32array(arr, n, v) {
  switch(vectype(v)) { 
    case 'vec2':    arr[n] = v.x; arr[n+1] = v.y; return 2
    case 'vec3':    arr[n] = v.x; arr[n+1] = v.y; arr[n+2] = v.z; return 3
    case 'vec4':    arr[n] = v.x; arr[n+1] = v.y; arr[n+2] = v.z; arr[n+3] = v.z; return 4
    case 'float':   arr[n] = typeof v === 'number' ? v :              v.m[0];    return 1 // TODO: fast path for float? Not used very often though?
    case 'fvec':    for (let i = 0; i < v.m.length; ++i) { arr[n+i] = v.m[i]; }; return v.m.length
    case 'mat2':    for (let i = 0; i < 4;  ++i) { arr[n+i] = v.m[i]; }; return 4
    case 'mat3':    for (let i = 0; i < 9;  ++i) { arr[n+i] = v.m[i]; }; return 9
    case 'mat4':    for (let i = 0; i < 16; ++i) { arr[n+i] = v.m[i]; }; return 16
    default: panic('vecstoref32array(): unsupported type', safe_stringify(v))
  }
}
//------------------------------------------------------------------------
//  Scalar math
//------------------------------------------------------------------------
export const PI = Math.PI
export const TWOPI = 2.0 * PI
export const HALFPI = 0.5 * PI
export const EPSILON = 1e-42 // TODO:
export const sin = (rad) => Math.sin(rad)
export const cos = (rad) => Math.cos(rad)
export const sqrt = (v) => Math.sqrt(v)
export const pow = (x, e) => Math.pow(x, e)
export const floor = (v) => Math.floor(v)
export const ceil = (v) => Math.ceil(v)
export const abs = (v) => Math.abs(v)
export const min = (a, b) => a < b ? a : b
export const max = (a, b) => a > b ? a : b
export const lerp = (minv, maxv, t) => minv + t * (maxv - minv)
export const clamp = (x, minv, maxv) => min( maxv, x, max(0.0, 1.0) )   
export const saturate = (x) => clamp( x, 0.0, 1.0 )
export const urand = () => Math.random() //[0,1]
export const srand = () => 2.0 * Math.random() - 1.0 //[-1,1]
export const deg = (degrees) => degrees/180.0*PI 
//------------------------------------------------------------------------
//  3D vector math
//------------------------------------------------------------------------
export const VEC3_FAILURE = vec3(0, 0, 1)
export const dot = (a, b) => a.x * b.x + a.y * b.y + a.z * b.z
export const min3 = (a, b) => vec3(a.x < b.x ? a.x : b.x, a.y < b.y ? a.y : b.y, a.z < b.z ? a.z : b.z)
export const max3 = (a, b) => vec3(a.x > b.x ? a.x : b.x, a.y > b.y ? a.y : b.y, a.z > b.z ? a.z : b.z)
export const add3 = (a, b) => vec3(a.x+b.x, a.y+b.y, a.z+b.z)
export const sub3 = (a, b) => vec3(a.x+b.x, a.y+b.y, a.z+b.z)
export const mul3 = (v, s) => vec3(s*v.x, s*v.y, s*v.z) // TODO: scale3? mul3scalar?
export const lensquared3 = (v) => v.x*v.x + v.y*v.y + v.z*v.z
export const len3 = (v) => sqrt( lensquared3(v) )
export const normalize = (v) => { const d = len3(v); return ( d < EPSILON ) ? VEC3_FAILURE : mul3(v, 1.0/d) } // TODO:
export const distancesquared3 = (a, b) => lensquared3( sub3(b, a) )
export const distance3 = (a, b) => len3( sub3(b,a) )
export const cross = (b, c) => vec3(  b.y*c.z - b.z*c.y,  b.z*c.x - b.x*c.z,  b.x*c.y - b.y*c.x )
//------------------------------------------------------------------------
// 2x2 transformation matrix functions (ccw radian angles)
//------------------------------------------------------------------------
export const rotation2d         = (a) => mat2( cos(a), -sin(a), sin(a),  cos(a) )
export const scale2d_uniform    = (s) => mat2( s, 0.0, 0.0, s )
export const scale2d            = (v) => mat2( v.x, 0.0, 0.0, v.y )
export const shear2d            = (s) => mat2( 1, s.x, s.y, 1 )
//------------------------------------------------------------------------
// 4x4 transformation matrix functions
//------------------------------------------------------------------------
export const rotation_axis_angle = (axis, angle) => {
  axis = normalize(axis); const s = sin(angle); const c = cos(angle); const oc = 1.0 - c
  return mat4( oc * axis.x * axis.x + c,          oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0,
               oc * axis.x * axis.y + axis.z * s, oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0,
               oc * axis.z * axis.x - axis.y * s, oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0,
               0,                                 0,                                  0,                                  1 )
}
export const mat4vec4mul = (m, v) => { // TODO: generic, but.. m * vec3
  const x = v.x; const y = v.y; const z = v.z; const w = v.w; m = m.m
  return vec4(  x*m[0]  + y*m[1]  + z*m[2]  + w*m[3],
                x*m[4]  + y*m[5]  + z*m[6]  + w*m[7],
                x*m[8]  + y*m[9]  + z*m[10] + w*m[11],
                x*m[12] + y*m[13] + z*m[14] + w*m[15] )
}
