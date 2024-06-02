import { g_open, g_close, g_force_clear, g_add_render, g_run_render_loop, g_remove_render } from '../src/g2030.js';
import { gl_viewport, gl_clear, gl_update_uniforms } from '../src/gl.js'
import { vec4, rect, sin, cos, TWOPI } from '../src/vecmath.js'
import { debug_open } from '../src/debug.js'
import { log_enablegroups } from '../src/log.js'

let debug = null

function drawtri(rs) {
  const trisize = 0.42
  debug.triangle( rs.gl, trisize * cos(rs.time) / rs.aspect, trisize * sin(rs.time),
                         trisize * cos(rs.time + 1/3.0*TWOPI) / rs.aspect, trisize * sin(rs.time + 1/3.0*TWOPI),
                         trisize * cos(rs.time + 2/3.0*TWOPI) / rs.aspect, trisize * sin(rs.time + 2/3.0*TWOPI) )
}
function render(rs) {
  gl_update_uniforms( rs.gl, rs.uniforms )
  gl_viewport( rs.gl, rect(0, 0, rs.w, rs.h) )
  gl_clear( rs.gl, vec4(0.0, 0.0, 1.0, 1.0), 1.0 )
  drawtri( rs )
  debug.flush( rs.gl )
}
export async function example_open(ctx) {
  g_force_clear( ctx.g, vec4(0) )
  // NOTE: unlike most examples, creates and destroys own context with g_open() / g_close() 
  // create new WebGPU context and canvas element for this example
  const parent = document.createElement( 'div' )
  parent.id = 'webgpu-container'
  parent.style.width = '100px'
  parent.style.height = '100px'
  parent.style.background = 'black'
  parent.style.color = 'white'
  parent.innerHTML = 'WebGPU canvas here (this text should not be visible)'
  //document.getElementById( 'example-container' ).appendChild( parent )
  const g = await g_open({ backend: 'webgpu', parent })
  debug = debug_open( g )
  debug.color( vec4(1,1,1,1) )  
  log_enablegroups( ['resize'] )
  g_add_render( g, render )
  g_run_render_loop( g )
  return { close: async () => { await g_close( g ); parent.remove() } } // NOTE: this does g_close() with own context
}
