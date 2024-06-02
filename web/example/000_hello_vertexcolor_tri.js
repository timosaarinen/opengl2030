import { g_add_render, g_remove_render } from '../src/g2030.js';
import { gl_viewport, gl_clear, gl_update_uniforms } from '../src/gl.js'
import { vec4, color, rect, sin, cos, TWOPI } from '../src/vecmath.js'
import { log_enablegroups } from '../src/log.js'

let ctx = null; let g = null; let debug = null; function setctx(c) { ctx = c; g = c.g; debug = c.debug }

function drawtri(rs) {
  const trisize = 1.33
  //debug.color( color(1.0) ) //constant color written as vertex color input, if will omit the colors below:
  debug.triangle( rs.gl, trisize * cos(rs.time) / rs.aspect, trisize * sin(rs.time),
                         trisize * cos(rs.time + 1/3.0*TWOPI) / rs.aspect, trisize * sin(rs.time + 1/3.0*TWOPI),
                         trisize * cos(rs.time + 2/3.0*TWOPI) / rs.aspect, trisize * sin(rs.time + 2/3.0*TWOPI),
                         color(1,0,0), color(0,1,0), color(0,0,1) )
}
function render(rs) {
  gl_update_uniforms( rs.gl, rs.uniforms )
  gl_viewport( rs.gl, rect(0, 0, rs.w, rs.h) )
  gl_clear( rs.gl, vec4(0.0, 0.0, 1.0, 1.0), 1.0 )
  drawtri( rs )
  debug.flush( rs.gl )
}
export async function example_open(examplecontext) {
  setctx( examplecontext )
  log_enablegroups( ['resize'] )
  g_add_render( g, render )
  return { close: async () => { g_remove_render( g, render ) } }
}
