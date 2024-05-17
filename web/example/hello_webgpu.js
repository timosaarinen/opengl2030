import { gl_viewport } from '../src/ogl2030';
import { ogl_open, ogl_add_render, ogl_run_render_loop, ogl_debug_tri, TWOPI, sin, cos } from '/src/ogl2030.js';

function myrender(gl, rs) {
  const t = rs.time;
  const gl = ogl_display_list();
  gl_viewport( gl, rect(0, 0, rs.w, rs.h) );
  gl_clear( gl, color_vec4, depth );

  const trisize = 0.8;
  ogl_debug_tri(gl,
    trisize * cos(t), trisize * sin(t),
    trisize * cos(t + 1/3.0*TWOPI), trisize * sin(t + 1/3.0*TWOPI),
    trisize * cos(t + 2/3.0*TWOPI), trisize * sin(t + 2/3.0*TWOPI) );
}
async function main() {
  const config = {
    mode: 'fullscreen',
    backend: 'webgpu',
    parent: document.getElementById('canvas'),
    debug: true,
    fullscreen: true,
  }
  const g = await ogl_open({ 
    mode: 'fullscreen', parent: parent
  })
  ogl_add_render( g, myrender )
  ogl_run_render_loop( g )
}
document.addEventListener('DOMContentLoaded', main)
