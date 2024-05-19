import { create_canvas } from './html.js'
import { assert } from './util.js'
import { create_webgl2_context } from './webgl2.js'
import { create_webgpu_context } from './webgpu.js'
import { create_nulldevice_context } from './nulldevice.js'

export function ogl_log(state) {
  if (typeof state === 'boolean') disable_logging = !state // ignore if passed undefined
}
export async function ogl_open(config) {
  ogl_log(config.logging)
  const canvas = create_canvas(); assert(canvas)
  const select_backend = config.backend ?? 'webgl2'
  let backend
  switch(select_backend) {
    case 'webgl2':  LOG('WebGL2 backend selected.');     backend = create_webgl2_context(config, canvas); break
    case 'webgpu':  LOG('WebGPU backend selected.');     backend = await create_webgpu_context(config, canvas); break
    case 'null':    LOG('nulldevice backend selected.'); backend = create_nulldevice_context(config, canvas); break
    default:        panic('Unsupported backend')
  }
  assert(backend)
  if (config.parent) config.parent.appendChild(canvas)
  //----> main OGL30 object
  let ogl = {
    config:   config,
    w:        canvas.innerWidth,
    h:        canvas.innerHeight,
    canvas:   canvas,
    backend:  backend, // @see webgpu.js and webgl2.js
    renderfn: [], // render frame callbacks, in draw order
    rs:       { time: 0.0 }, // TODO: init with full render state?
  }
  return ogl
}
export function ogl_add_render(g, fn) {
  g.renderfn.push(fn)
}
export function ogl_display_list(name = 'a display list') {
  return {
    name: name,
    cmd: [],
  }
}
export function ogl_run_render_loop(g) {
  const w = () => g.canvas.innerWidth
  const h = () => g.canvas.innerHeight
const render_frame = (timestamp) => {
    const secs = timestamp / 1000.0
    const rs = {
      g:      g,
      gl:     ogl_display_list( 'main' ),
      w:      w(),
      h:      h(),
      aspect: w() / h(),
      frame:  g.frame,
      time:   secs,
      dt:     secs - g.rs.time,
    }
    LOG('renderframe:', JSON.stringify( rs ) )
    g.rs = rs                               // TODO: need? ..diagnostics?
    for (const fn of g.renderfn) fn( rs )   // execute the render callbacks
    g.backend.submit_display_list( rs.gl )  // submit the main display list for rendering -> backend
    requestAnimationFrame( render_frame )   // re-schedule for next V-sync (hopefully)
  }
  window.addEventListener('resize', () => {
    const aspect = w() / h()
    LOG( `resize ${w()} ${h()} aspect ${aspect}` )
  }, false)
  //---- start ticking....
  render_frame()
}