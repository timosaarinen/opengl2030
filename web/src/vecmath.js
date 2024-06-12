"use strict"
import { panic, safe_stringify, ASSERT } from './util.js'
//-------------------------------------------------------------------------------------------------
//  Base types
//-------------------------------------------------------------------------------------------------
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
export const vec4  = (x = 0, y = x, z = y ?? x, w = 1.) =>  ({ type: 'vec4', meta: 'vec4',    x,            y,            z,            w         })
export const color = (r = 0, g = r, b = g ?? r, a = 1.) =>  ({ type: 'vec4', meta: 'color',   x: r,         y: g,         z: b,         w: a      })
export const quat = (a = 1, b = 0, c = 0, d = 0) =>         ({ type: 'vec4', meta: 'quat',    x: b,         y: c,         z: d,         w: a      }) // quaternion a+bI+cJ+dK   -> w+xI+yJ+zK
export const plane = (n = vec3(0), d) =>                    ({ type: 'vec4', meta: 'plane',   x: n.x,       y: n.y,       z: n.z,       w: d      }) // plane      aX+bY+cZ+d=0 -> xX+yY+zZ+w=0
export const rect = (x = 0, y = 0, w = 0, h = 0) =>         ({ type: 'vec4', meta: 'rect',    x,            y,            z: w,         w: h      }) // TODO: should actually be x2/y2 bounds for faster shader inside test?
export const sphere = (center = vec3(0), radius = 0) =>     ({ type: 'vec4', meta: 'sphere',  x: center.x,  y: center.y,  z: center.z,  w: radius })
export const aabb = (center = vec3(0), extents = vec3(0)) =>({ type: 'aabb', center, extents })
export const frustum = (l, t, r, b, near, far) =>           ({ type: 'frustum', l, t, r, b, near, far })
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
export const tonumber = (v) => typeof v === 'number' ? v : v.m[0] // TODO:
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
//-------------------------------------------------------------------------------------------------
//  Scalar math
//-------------------------------------------------------------------------------------------------
export const PI = Math.PI
export const TWOPI = 2.0 * PI
export const HALFPI = 0.5 * PI
export const EPSILON = 1e-42 // TODO:
export const sin = (rad) => Math.sin(rad)
export const cos = (rad) => Math.cos(rad)
export const acos = (x) => Math.acos(x)
export const atan = (y, x) => Math.atan2(y, x)
export const sqrt = (v) => Math.sqrt(v)
export const pow = (x, e) => Math.pow(x, e)
export const floor = (v) => Math.floor(v)
export const ceil = (v) => Math.ceil(v)
export const abs = (v) => Math.abs(v)
export const min = (a, b) => a < b ? a : b
export const max = (a, b) => a > b ? a : b
export const lerp = (minv, maxv, t) => minv + t * (maxv - minv)
export const clamp = (x, minv, maxv) => min(max(x, minv), maxv)
export const saturate = (x) => clamp(x, 0.0, 1.0)
export const urand = () => Math.random() //[0,1]
export const srand = () => 2.0 * Math.random() - 1.0 //[-1,1]
export const deg = (degrees) => degrees/180.0*PI
export const radians_to_degrees = (rad) => rad/PI*180.0
//-------------------------------------------------------------------------------------------------
//  3D vector
//-------------------------------------------------------------------------------------------------
export const VEC3_FAILURE = vec3(0, 0, 1)
export const dot = (a, b) => a.x * b.x + a.y * b.y + a.z * b.z
export const min3 = (a, b) => vec3(a.x < b.x ? a.x : b.x, a.y < b.y ? a.y : b.y, a.z < b.z ? a.z : b.z)
export const max3 = (a, b) => vec3(a.x > b.x ? a.x : b.x, a.y > b.y ? a.y : b.y, a.z > b.z ? a.z : b.z)
export const add3 = (a, b) => vec3(a.x+b.x, a.y+b.y, a.z+b.z)
export const sub3 = (a, b) => vec3(a.x+b.x, a.y+b.y, a.z+b.z)
export const mul3 = (v, s) => vec3(s*v.x, s*v.y, s*v.z) // TODO: scale3? mul3scalar?
export const invert3 = (v) => vec3(-v.x, -v.y, -v.z)
export const lensquared3 = (v) => v.x*v.x + v.y*v.y + v.z*v.z
export const len3 = (v) => sqrt( lensquared3(v) )
export const normalize = (v) => { const d = len3(v); return ( d < EPSILON ) ? VEC3_FAILURE : mul3(v, 1.0/d) } // TODO:
export const distancesquared3 = (a, b) => lensquared3( sub3(b, a) )
export const distance3 = (a, b) => len3( sub3(b,a) )
export const cross = (b, c) => vec3(  b.y*c.z - b.z*c.y,  b.z*c.x - b.x*c.z,  b.x*c.y - b.y*c.x )
//-------------------------------------------------------------------------------------------------
// 2x2 (transformation) matrix  - ccw radian angles 
//-------------------------------------------------------------------------------------------------
export const rotation2d         = (a) => mat2( cos(a), -sin(a), sin(a),  cos(a) )
export const scale2d_uniform    = (s) => mat2( s, 0.0, 0.0, s )
export const scale2d            = (v) => mat2( v.x, 0.0, 0.0, v.y )
export const shear2d            = (s) => mat2( 1, s.x, s.y, 1 )
//-------------------------------------------------------------------------------------------------
// 4x4 (transformation) matrix - "column-major like in OpenGL"
//-------------------------------------------------------------------------------------------------
export const identity = ()                => mat4(1,0,0,0,    0,1,0,0,    0,0,1,0,    0,0,0,1 )
export const translate = (v)              => mat4(1,0,0,v.x,  0,1,0,v.y,  0,0,1,v.z,  0,0,0,1 )
export const scale = (s)                  => { s = s.z ? s : vec3(s); return mat4(s.x,0,0,0,  0,s.y,0,0,  0,0,s.z,0,  0,0,0,1 )}
export const xrotate = (angle)            => { const c = cos(angle); const s = sin(angle); return mat4(1,0,0, 0,  0, c,s,0,  0, -s, c, 0,  0, 0, 0, 1)  }
export const yrotate = (angle)            => { const c = cos(angle); const s = sin(angle); return mat4(c,0,-s,0,  0, 1,0,0,  s, 0,  c, 0,  0, 0, 0, 1)  }
export const zrotate = (angle)            => { const c = cos(angle); const s = sin(angle); return mat4(c,s,0, 0,  -s,c,0,0,  0, 0, 1, 0,   0, 0, 0, 1)  }
export const axisangle = (axis, angle)    => {
  axis = normalize(axis); const s = sin(angle); const c = cos(angle); const oc = 1.0 - c
  return mat4( oc * axis.x * axis.x + c,          oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0,
               oc * axis.x * axis.y + axis.z * s, oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0,
               oc * axis.z * axis.x - axis.y * s, oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0,
               0,                                 0,                                  0,                                  1 )
}
export const perspective = (frustum) => {
  const { l, t, r, b, near, far } = frustum
  return mat4(  2*near/(r - l),   0,                    (r + l)/(r -l),     0,
                0,                2*near / (t - b),     (t + b) / (t - b),  0,
                0,                2*near / (t - b),     (t + b) / (t - b),  -2*far*near / (far - near),
                0,                0,                    -1,                 0 )
}
export const ortho = (width, height, depth, flipy = -1) =>
  mat4( 2/width,  0,                0,        0,
        0,        flipy*2/height,   0,        0,
        0,        0,                2/depth,  0, 
        -1,       1,                0,        1 )
export const mat4vec3dir = (m, v) => {
  const x = v.x; const y = v.y; const z = v.z; m = m.m
  return vec3(  x*m[0]  + y*m[1]  + z*m[2],
                x*m[4]  + y*m[5]  + z*m[6],
                x*m[8]  + y*m[9]  + z*m[10] )
}
export const mat4vec3point = (m, v) => {
  const x = v.x; const y = v.y; const z = v.z; m = m.m
  return vec3(  x*m[0]  + y*m[1]  + z*m[2]  + m[3],
                x*m[4]  + y*m[5]  + z*m[6]  + m[7],
                x*m[8]  + y*m[9]  + z*m[10] + m[11] )
}
export const mat4vec4mul = (m, v) => {
  const x = v.x; const y = v.y; const z = v.z; const w = v.w; m = m.m
  return vec4(  x*m[0]  + y*m[1]  + z*m[2]  + w*m[3],
                x*m[4]  + y*m[5]  + z*m[6]  + w*m[7],
                x*m[8]  + y*m[9]  + z*m[10] + w*m[11],
                x*m[12] + y*m[13] + z*m[14] + w*m[15] )
}
export const mat4mat4mul = (a, b) => { // TODO: optimize (unroll?)
  let m = mat4()
  for (let i=0; i < 4; ++i) {
    for (let j=0; j < 4; ++j) {
      let acc = 0;
      for (let k=0; k < 4; ++k) {
        acc += a.m[i*4 + k] * b.m[k*4 + j]
      }
      m.m[i*4 + j] = acc;
    }
  }
  return m;
}
//-------------------------------------------------------------------------------------------------
// (Unit) Quaternion
//-------------------------------------------------------------------------------------------------
export const quatident = () => quat(1, 0, 0, 0) // identity unit quaternion, no rotation
export const quatzero  = () => quat(0, 0, 0, 0) // zero quoternion (invalid)
export const quatrotx  = () => quat(0, 1, 0, 0) // 180 degrees rotation around X-axis
export const quatroty  = () => quat(0, 0, 1, 0) // 180 degrees rotation around Y-axis
export const quatrotz  = () => quat(0, 0, 0, 1) // 180 degrees rotation around Z-axis
export const quatadd = (q, r) => quat(q.w + r.w, q.x + r.x, q.y + r.y, q.z + r.z)
export const quatmul = (q, r) => quat( (q.w * r.w) - (q.x * r.x) - (q.y * r.y) - (q.z * r.z),
                                       (q.w * r.x) + (q.x * r.w) - (q.y * r.z) + (q.z * r.y),
                                       (q.w * r.y) + (q.x * r.z) + (q.y * r.w) - (q.z * r.x),
                                       (q.w * r.z) - (q.x * r.y) - (q.y * r.x) + (q.z * r.w) )
export const quatslerp = (a, b, t) => {
  const minrot = 0.000001 //EPSILON
  const coshalftheta = a.w*b.w + a.x*b.x + a.y*b.y + a.z*b.z; if (abs(coshalftheta) >= 1.0) return a;
  const halftheta = acos(coshalftheta)
  const sinhalftheta = sqrt(1.0 - coshalftheta*coshalftheta); if (abs(sinhalftheta) < minrot) return quat(a.w*0.5 + b.w*0.5, a.x*0.5 + b.x*0.5, a.y*0.5 + b.y*0.5, a.z*0.5 + b.z*0.5)
  const ra = sin(1.0 - t)*halftheta/sinhalftheta
  const rb = sin(t*halftheta)/sinhalftheta
  return quat(a.w*ra + b.w*rb, a.x*ra + b.x*rb, a.y*ra + b.y*rb, a.z*ra + b.z*rb)
}
//-------------------------------------------------------------------------------------------------
// Transform with coordinate system: +X = right, +Y = forward, +Z = up
//-------------------------------------------------------------------------------------------------
export const tright    = (m) => vec3(m.m[0], m.m[4], m.m[8])
export const tforward  = (m) => vec3(m.m[1], m.m[5], m.m[9])
export const tup       = (m) => vec3(m.m[2], m.m[6], m.m[10])
export const tlocation = (m) => vec3(m.m[3], m.m[7], m.m[11])
export const transform = (m) => ({ right: tright(m), forward: tforward(m), up: tup(m), location: tlocation(m) })
export const maketransform = ({ right, up, forward, location }) =>
  mat4( right.x, forward.x,  up.x,  location.x, 
        right.y, forward.y,  up.y,  location.y,
        right.z, forward.z,  up.y,  location.z,
        0,       0,          0,     1 )
//-------------------------------------------------------------------------------------------------
// Generic branch-by-type "operator functions", if we had e.g. '*' mul op
//-------------------------------------------------------------------------------------------------
export const mul = (a, b) => {
  const typecombination = `${vectype(a)} * ${vectype(b)}` // TODO: ...
  switch (typecombination) {
    case 'vec3 * float': return mul3(a,b)
    case 'mat4 * mat4':  return mat4mat4mul(a,b)
    case 'mat4 * vec4':  return mat4vec4mul(a,b)
    case 'mat4 * vec3':  return mat4vec3point(a,b) // NOTE: need to explicitly call mat4vec3dir() or use m4*vec4(v.xyz,0) for direction transform
    default: panic('unsupported type combination in vecmath.mul():', typecombination)
  } 
}
