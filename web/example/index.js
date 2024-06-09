import { g_open, g_close, g_add_render, g_run_render_loop } from '../src/g2030.js';
import { gl_viewport, gl_clear } from '../src/gl.js'
import { vec4, rect, sin, cos, TWOPI } from '../src/vecmath.js'
import { debug_open } from '../src/debug.js'
import { log_enablegroups } from '../src/log.js'
import { run_all_tests } from '../src/testlib.js'
import { example_open as open_000 } from './000_hello_vertexcolor_tri.js'
import { example_open as open_001 } from './001_hello_webgpu.js'
import { example_open as open_002 } from './002_devgui.js'

const examples = [
  { openfn: open_000, name: '000 - Hello, vertex color triangle!' },
  { openfn: open_001, name: '001 - WebGPU initialization' },
  { openfn: open_002, name: '002 - Dev GUI' },
]

let g = null
let debug = null

const name_element = document.getElementById('example-name')
const button_next = document.getElementById('button-next')
const button_prev = document.getElementById('button-prev')
let current = 0
let example = null
async function example_open(openfn) {
  if (example && example.close) example.close();
  example = await openfn({ g, debug })
}
async function goto_example(n) {
  current = n;
  name_element.textContent = examples[n].name; 
  await example_open(examples[n].openfn)
}
function get_parent_container() {
  const container = document.getElementById('canvas-container')
  return container
}
async function example_ui() {
  if (button_next) button_next.addEventListener('click', () => { goto_example((current + 1) % examples.length) })
  if (button_prev) button_prev.addEventListener('click', () => { goto_example((current - 1 + examples.length) % examples.length) })
}
async function main() {
  try { run_all_tests() } catch(e) { console.log(e); return }
  g = await g_open({ parent: get_parent_container() })
  debug = debug_open( g )
  log_enablegroups( ['resize'] )
  example_ui()
  await goto_example(0)
  g_run_render_loop( g )
}
document.addEventListener('DOMContentLoaded', main)
