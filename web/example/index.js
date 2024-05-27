import { g_open, g_add_render, g_run_render_loop } from '/src/ogl2030.js';
import { gl_viewport, gl_clear } from '/src/gl.js'
import { vec4, rect, sin, cos, TWOPI } from '/src/vecmath.js'
import { debug_open } from '/src/debug.js'
import { log_enablegroups } from '/src/log.js'
import { example_open as open_000 } from './000_hello_vertexcolor_tri.js'
import { example_open as open_001 } from './001_hello_webgpu.js'

const examples = [
  { open: open_000, name: '000 - Hello, vertex color triangle!' },
  { open: open_001, name: '001 - WebGPU initialization' },
]
let example_current = 0
let debug = null

function render(rs) {
  const trisize = 1.2
  gl_viewport( rs.gl, rect(0, 0, rs.w, rs.h) )
  gl_clear( rs.gl, vec4(0, 0, 0.1, 1.0), 1.0 )
  debug.imageshader( rs.gl )
  debug.color( vec4(1, 1, 1, 1) )
  debug.triangle( rs.gl, trisize * cos(rs.time)               / rs.aspect, trisize * sin(rs.time),
                         trisize * cos(rs.time + 1/3.0*TWOPI) / rs.aspect, trisize * sin(rs.time + 1/3.0*TWOPI),
                         trisize * cos(rs.time + 2/3.0*TWOPI) / rs.aspect, trisize * sin(rs.time + 2/3.0*TWOPI) )
}

async function main() {
  const container = document.getElementById('canvas-container')
  const g = await g_open({ parent: container })
  debug = debug_open( g )
  log_enablegroups( ['resize'] )
  g_add_render( g, render )
  g_run_render_loop( g )
}

document.addEventListener('DOMContentLoaded', main)
