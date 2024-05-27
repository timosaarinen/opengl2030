import { create_canvas } from './html.js'
import { LOG, LOGG } from './log.js'
import { ASSERT, safe_stringify } from './util.js'
import { create_webgl2_context } from './webgl2.js'
import { create_webgpu_context } from './webgpu.js'
import { create_nulldevice_context } from './nulldevice.js'
import { mat4, vec2, vec4 } from './vecmath.js'

export const g_s_get_uniforms = (mvp = mat4(), w = 0, h = 0, time = 0, mx = 0, my = 0) => ({
  mvp:          mvp,
  iResolution:  vec2(w, h),         // vec2(g.canvas.width, g.canvas.height),
  iTime:        time,               // g.rs.time,
  iMouse:       vec4(mx, my, 0, 0), // vec4(g.mouse.x, g.mouse.y, 0, 0)
})

export async function g_open(config) {
  const canvas = create_canvas(); ASSERT(canvas)
  // TODO: support user uniforms, combine with std ones
  ASSERT(!config.uniforms)
  config.uniforms = g_s_get_uniforms()
  // backend selection & init
  const select_backend = config.backend ?? 'webgl2'
  let backend = null
  switch(select_backend) {
    case 'webgl2':  backend = await create_webgl2_context(config, canvas); LOG('OGL2030: WebGL2 backend selected.');  break
    case 'webgpu':  backend = await create_webgpu_context(config, canvas); LOG('OGL2030: WebGPU backend selected.'); break
    case 'null':    backend = await create_nulldevice_context(config, canvas); LOG('OGL2030: nulldevice backend selected.'); break
    default:        panic('Unsupported backend')
  }
  ASSERT(backend)
  if (config.parent) config.parent.appendChild(canvas)
  // @returns The main OGL30 context 'g'
  return {
    config:   config,
    parent:   config.parent,
    canvas:   canvas,
    backend:  backend, // @see webgpu.js and webgl2.js
    renderfn: [], // render frame callbacks, in draw order
    rs:       { time: 0.0, w: 0, h: 0 }, // TODO: init with full render state?
    mouse:    { x: 0, y: 0 },
  }
}
export function g_add_render(g, fn) {
  g.renderfn.push(fn)
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
      dt:       secs - g.rs.time,
      uniforms: g_s_get_uniforms(mat4(), g.canvas.width, g.canvas.height, secs, g.mouse.x, g.mouse.y) // TODO:
    }
    LOGG( 'renderframe', safe_stringify( rs ) )
    g.rs = rs                               // TODO: need? ..diagnostics? g.rs.gl
    for (const fn of g.renderfn) fn( rs )   // execute the render callbacks
    LOGG( 'g', safe_stringify(g) )
    g.backend.submit_display_list( rs.gl )  // submit the main display list for rendering -> backend
    requestAnimationFrame( render_frame )   // re-schedule for next V-sync (hopefully)
  }
  canvas.addEventListener('mousemove', (event) => { g.mouse = { x: event.clientX, y: g.rs.h - event.clientY }; LOGG( 'input', g.mouse ) })
  render_frame()
}
export async function g_close(g) {
  if (g.backend.close) { g.backend.close() }
}
