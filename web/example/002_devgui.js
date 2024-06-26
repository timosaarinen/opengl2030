import { g_add_render, g_remove_render, g_close } from '../src/g2030.js';
import { gl_viewport, gl_clear, gl_update_uniforms } from '../src/gl.js'
import { vec4, color, rect, sin, cos, TWOPI } from '../src/vecmath.js'
import { new_gui, guiexample } from '../src/devgui.js'
import { LOG } from '../src/log.js';

let ctx = null; let g = null; let debug = null; function setctx(c) { ctx = c; g = c.g; debug = c.debug }

function drawtri(rs) {
  const trisize = 0.2
  debug.color( color(1, 1, 0, 0.5) ) // TODO: alpha blending
  debug.triangle( rs.gl, trisize * cos(rs.time) / rs.aspect, trisize * sin(rs.time),
                         trisize * cos(rs.time + 1/3.0*TWOPI) / rs.aspect, trisize * sin(rs.time + 1/3.0*TWOPI),
                         trisize * cos(rs.time + 2/3.0*TWOPI) / rs.aspect, trisize * sin(rs.time + 2/3.0*TWOPI) )
}
function render(rs) {
  gl_update_uniforms( rs.gl, rs.uniforms )
  gl_viewport( rs.gl, rect(0, 0, rs.w, rs.h) )
  gl_clear( rs.gl, vec4(0, 0.1, 0, 1), 1 )
  drawtri( rs )
  debug.flush( rs.gl )
}
export async function example_open(examplecontext) {
  const gui = new_gui()
  guiexample(gui)
  setctx( examplecontext )
  g_add_render( g, render )
  return { 
    close: async () => {
      LOG('closing devgui example..')
      g_remove_render( g, render )
      gui.destroy();
      //await g_close( g ) 
    } 
  }
}
