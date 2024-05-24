import { create_canvas } from './html.js'
import { LOGG, log_enableall, log_enablegroup, log_clearall } from './log.js'
import { ASSERT, safe_stringify } from './util.js'
import { create_webgl2_context } from './webgl2.js'
import { create_webgpu_context } from './webgpu.js'
import { create_nulldevice_context } from './nulldevice.js'

const w = () => window.innerWidth
const h = () => window.innerHeight

export async function g_open(config) {
  const canvas = create_canvas(); ASSERT(canvas)
  const select_backend = config.backend ?? 'webgl2'
  let backend
  switch(select_backend) {
    case 'webgl2':  LOGG('WebGL2 backend selected.');     backend = create_webgl2_context(config, canvas); break
    case 'webgpu':  LOGG('WebGPU backend selected.');     backend = await create_webgpu_context(config, canvas); break
    case 'null':    LOGG('nulldevice backend selected.'); backend = create_nulldevice_context(config, canvas); break
    default:        panic('Unsupported backend')
  }
  ASSERT(backend)
  if (config.parent) config.parent.appendChild(canvas)
  //----> main OGL30 object
  let g = {
    config:   config,
    w:        w(),
    h:        h(),
    canvas:   canvas,
    backend:  backend, // @see webgpu.js and webgl2.js
    renderfn: [], // render frame callbacks, in draw order
    rs:       { time: 0.0 }, // TODO: init with full render state?
    mouse:    { x: 0, y: 0 },
  }
  return g
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
  const render_frame = () => {
    const secs = getSeconds()
    const rs = { g,
      gl:     g_display_list( g, 'main' ),
      w:      w(),
      h:      h(),
      aspect: w() / h(),
      frame:  g.frame,
      time:   secs,
      dt:     secs - g.rs.time,
    }
    LOGG( 'renderframe', safe_stringify( rs ) )
    g.rs = rs                               // TODO: need? ..diagnostics? g.rs.gl
    for (const fn of g.renderfn) fn( rs )   // execute the render callbacks
    LOGG( 'g', safe_stringify(g) )
    g.backend.submit_display_list( rs.gl )  // submit the main display list for rendering -> backend
    requestAnimationFrame( render_frame )   // re-schedule for next V-sync (hopefully)
  }
  const resize = () => {
    const width = w()
    const height = h()
    if (width !== g.rs.w || height !== g.rs.h) {
      // resize canvas to new display size
      canvas.width = width
      canvas.height = height
      g.rs.w = width
      g.rs.h = height
      LOGG( 'resize', `resize ${w()} ${h()} aspect ${w()/h()} - window ${window.innerWidth} - ${window.innerHeight}` )
    }
  }
  window.addEventListener('resize', resize)
  canvas.addEventListener('mousemove', (event) => { g.mouse = { x: event.clientX, y: h() - event.clientY }; LOGG( 'input', g.mouse ) })
  resize()
  render_frame()
}