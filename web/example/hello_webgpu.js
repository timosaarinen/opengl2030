import { ogl_open, ogl_add_render, ogl_run_render_loop } from '/src/ogl2030.js';
import { gl_viewport, gl_clear, gl_debug_tri } from '/src/gl.js'
import { TWOPI, sin, cos } from '/src/vecmath.js'

function myrender(rs) {
  const t = rs.time;
  const trisize = 0.8;
  const aspect = rs.w / rs.h;
  gl_viewport ( rs.gl, rect(0, 0, rs.w, rs.h) );
  gl_clear    ( rs.gl, vec4(0.1, 0.02, 0.4), 1.0 );
  gl_debug_tri( rs.gl, trisize * cos(t), trisize * sin(t) * aspect,
                       trisize * cos(t + 1/3.0*TWOPI), trisize * sin(t + 1/3.0*TWOPI) * aspect,
                       trisize * cos(t + 2/3.0*TWOPI), trisize * sin(t + 2/3.0*TWOPI) * aspect);
}
async function main() {
  const config = {
    mode: 'fullscreen',
    backend: 'webgpu',
    parent: document.getElementById('canvas'),
    debug: true,
    fullscreen: true,
  }
  const g = await ogl_open(config);
  ogl_add_render( g, myrender )
  ogl_run_render_loop( g )
}
document.addEventListener('DOMContentLoaded', main)
