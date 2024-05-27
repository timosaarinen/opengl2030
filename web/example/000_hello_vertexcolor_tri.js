import { g_add_render } from '/src/ogl2030.js';
import { gl_viewport, gl_clear } from '/src/gl.js'
import { vec4, rect, sin, cos, TWOPI } from '/src/vecmath.js'
import { log_enablegroups } from '/src/log.js'

let ctx = null
let g = null
let debug = null
function setctx(c) { ctx = c; g = c.g; debug = c.debug }

function drawtri(rs) {
  debug.color( vec4(1.0) )
  debug.triangle( rs.gl, trisize * cos(rs.time) / rs.aspect, trisize * sin(rs.time),
                         trisize * cos(rs.time + 1/3.0*TWOPI) / rs.aspect, trisize * sin(rs.time + 1/3.0*TWOPI),
                         trisize * cos(rs.time + 2/3.0*TWOPI) / rs.aspect, trisize * sin(rs.time + 2/3.0*TWOPI) )
}
function render(rs) {
  const trisize = 1.33
  gl_viewport( rs.gl, rect(0, 0, rs.w, rs.h) )
  gl_clear( rs.gl, vec4(0.0, 0.0, 1.0, 1.0), 1.0 )
  drawtri( rs )
}
export async function example_open(examplecontext) {
  setctx( examplecontext )
  log_enablegroups( ['resize'] )
  g_add_render( g, render )
  return { close: async () => await g_close( g ) }
}
