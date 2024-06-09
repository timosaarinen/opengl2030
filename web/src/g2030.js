import { domcanvas } from './dom.js'
import { LOG, LOGG } from './log.js'
import { ASSERT, safe_stringify, arr_without, sleep_ms } from './util.js'
import { create_webgl2_context } from './webgl2.js' // TODO: naming..
import { create_webgpu_context } from './webgpu.js'
import { create_nulldevice_context } from './nulldevice.js'
import { mat4 } from './vecmath.js'
import { uniforms_new, uniforms_update } from './uniforms.js'

export async function g_open(config) {
  ASSERT(!config.uniforms) // TODO: might have init-time uniforms?
  config.uniforms = uniforms_new()
  const canvas = domcanvas()
  const select_backend = config.backend ?? 'webgl2' // by default, use WebGL 2.0 backend
  let backend = null
  switch(select_backend) {
    case 'webgl2':  backend = await create_webgl2_context(config, canvas);     LOG('G2030 WebGL2 backend selected.');  break
    case 'webgpu':  backend = await create_webgpu_context(config, canvas);     LOG('G2030 WebGPU backend selected.'); break
    case 'null':    backend = await create_nulldevice_context(config, canvas); LOG('G2030 nulldevice backend selected.'); break
    default:        panic('Unsupported backend')
  }
  ASSERT(backend)
  if (config.parent) config.parent.appendChild(canvas)
  return {
    config:   config,
    parent:   config.parent,
    uniforms: config.uniforms, // can be set directly by user
    canvas:   canvas,
    backend:  backend, // @see webgpu.js webgl2.js nulldevice.js
    renderfn: [], // render frame callbacks, in draw order
    rs:       { time: 0.0, w: 0, h: 0 }, // TODO: init with full render state?
    mouse:    { x: 0, y: 0 },
  }
}
export function g_add_render(g, fn) {
  g.renderfn.push(fn)
}
export function g_remove_render(g, fn) {
  g.renderfn = arr_without(g.renderfn, fn)
}
export function g_force_clear(g, color) {
  if (g.backend.force_clear) g.backend.force_clear(color)
}
export function g_display_list(g, name = 'a display list') {
  return { g,
    name: name,
    cmd: [],
  }
}
export function g_run_render_loop(g) {
  let start = performance.now(); const getSeconds = () => (performance.now() - start) / 1000
  const canvas = g.canvas
  const render_frame = () => {
    const w = canvas.clientWidth
    const h = canvas.clientHeight
    if (w !== g.rs.w || h !== g.rs.h) {
      canvas.width = w // resize: canvas to new display size
      canvas.height = h
      LOGG( 'resize', `resize ${w} ${h} aspect ${w / h} window ${window.innerWidth} ${window.innerHeight}` )
    }
    const secs = getSeconds()
    const rs = { g,
      gl:       g_display_list( g, 'main' ),
      w:        w,
      h:        h,
      aspect:   w / h,
      frame:    g.frame,
      time:     secs,
      dt:       secs - g.rs.time, // TODO: clamp 'dt' if we have been inactive
      uniforms: uniforms_update(g.uniforms, mat4(), g.canvas.width, g.canvas.height, secs, g.mouse.x, g.mouse.y) // TODO:
    }
    LOGG( 'renderframe', safe_stringify( rs ) )
    g.rs = rs                               // TODO: need? ..diagnostics? g.rs.gl
    for (const fn of g.renderfn) fn( rs )   // execute the render callbacks
    LOGG( 'g', safe_stringify(g) )
    g.backend.submit_display_list( rs.gl )  // submit the main display list for rendering -> backend
    if( !g.closed ) g.raf = requestAnimationFrame( render_frame )   // re-schedule for next V-sync (hopefully)
  }
  g.on_mousemove = (e) => { g.mouse = { x: e.clientX, y: window.innerHeight - e.clientY }; LOGG( 'input', g.mouse ) }
  window.addEventListener('mousemove', g.on_mousemove) // TODO: was 'canvas', add clientrect handling if not 100% windowsize
  g.raf = requestAnimationFrame( render_frame ) //render_frame()
}
export async function g_wait_nframes(g, numframes) {
  await sleep_ms(numframes*20) // TODO: temp
}
export async function g_close(g) {
  // TODO: check
  g.closed = true
  g.canvas.removeEventListener('mousemove', g.on_mousemove) // TODO: push into a list, remove all handlers with one call -> util.js
  cancelAnimationFrame(g.raf)
  if (g.backend.close) { g.backend.close() }
  g.config = null
  g.uniforms = null
  g.canvas = null
  g.backend = null
  g.renderfn = null
  g.rs = null
  g.mouse = null
}
//-------------------------------------------------------------------------------------------------
import { TESTLOG } from './test.js'
import { vec4 } from './vecmath.js'
import { gl_viewport, gl_clear, gl_tostring } from './gl.js'

export function test_display_list() {
  const gl            = g_display_list()
  const viewport_rect = { x: 0, y: 0, width: 320, height: 240 }
  const clear_color   = { color: vec4(0.5, 0.07, 1.0, 1) }
  const clear_depth   = 1.0
  gl_viewport( gl, viewport_rect )
  gl_clear( gl, clear_color, clear_depth ) // no stencil clear (undefined)
  TESTLOG( 'test_display_list:', gl_tostring(gl) )
}
