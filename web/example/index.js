import { g_open, g_add_render, g_run_render_loop } from '/src/ogl2030.js';
import { gl_viewport, gl_clear } from '/src/gl.js'
import { vec4, rect, sin, cos, TWOPI } from '/src/vecmath.js'
import { debug_open } from '/src/debug.js'
import { log_enablegroups } from '/src/log.js'
import { example_open as open_000 } from './000_hello_vertexcolor_tri.js'
import { example_open as open_001 } from './001_hello_webgpu.js'
import { example_open as open_002 } from './002_devgui.js'

const examples = [
  { openfn: open_000, name: '000_Hello, vertex color triangle!' },
  { openfn: open_001, name: '001_WebGPU initialization' },
  { openfn: open_002, name: '002_Developer GUI' },
]

let g = null
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
function example_open(openfn) {
  openfn({ g, debug })
}
function get_parent_container() {
  const container = document.getElementById('canvas-container')
  return container
}
function example_ui() {
  const name_element = document.getElementById('example-name')
  const button_next = document.getElementById('button-next')
  const button_prev = document.getElementById('button-prev')
  let current = 0
  function goto_example(n) { current = n; name_element.textContent = examples[n].name; example_open(examples[n].openfn) }
  if (button_next) button_next.addEventListener('click', () => { goto_example((current + 1) % examples.length) })
  if (button_prev) button_prev.addEventListener('click', () => { goto_example((current - 1 + examples.length) % examples.length) })
  return { goto_example }
}
async function main() {
  g = await g_open({ parent: get_parent_container() })
  debug = debug_open( g )
  log_enablegroups( ['resize'] )
  g_add_render( g, render )
  const ui = example_ui()
  ui.goto_example(0)
  g_run_render_loop( g )
}
document.addEventListener('DOMContentLoaded', main)
