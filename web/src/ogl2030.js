// TODO: dev: maybe lock into using ; or not..?
import { INDEX_BUFFER, VERTEX_BUFFER } from './constants.js';
import { etext, create_canvas } from './html.js'

export function ogl_log(state) {
  if (typeof state === 'boolean') disable_logging = !state; // ignore if passed undefined
}
export async function ogl_open(config) {
  ogl_log(config.logging)
  const canvas = create_canvas(); assert(canvas)
  const select_backend = config.backend ?? 'webgl2'
  let backend;
  switch(select_backend) {
    case 'webgl2':  LOG('WebGL2 backend selected.'); backend = create_webgl2_context(config, canvas); break
    case 'webgpu':  LOG('WebGPU backend selected.'); backend = await create_webgpu_context(config, canvas); break
    case 'null':    LOG('nulldevice backend selected.'); backend = create_null_device(config, canvas); break
    default:        panic('Unsupported backend')
  }
  assert(backend);
  if (config.parent) config.parent.appendChild(canvas)
  // main OGL30 object
  let ogl = {
    config:   config,
    w:        canvas.innerWidth,
    h:        canvas.innerHeight,
    canvas:   canvas,
    backend:  backend, // @see webgpu.js and webgl2.js
    renderfn: [], // render frame callbacks, in draw order
    rs:       { time: 0.0 }, // TODO: init with full render state?
  }
  // baselib
  ogl.debug = debug_open(ogl);
  ogl_add_render(g, g.debug.draw);
  return ogl;
}
export function ogl_add_render(g, fn) {
  g.renderfn.push(fn);
}
export function ogl_display_list(name = 'a display list') {
  return {
    name: name,
    cmd: [],
  }
}
export function ogl_run_render_loop(g) {
  function set_renderer_size(w, h) {
    const aspect = w / h;
    LOG('resize:', 'width', w, 'height', h, 'aspect', aspect);
    // TODO: update projection matrix ..or just do it in render_frame(), simpler.
    // TODO: need to reallocate textures/buffers dependant on resolution?
  }
  function on_window_resize() {
    const w = vw();
    const h = vh();
    set_renderer_size(w,h);
  }
  function render_frame(timestamp) {
    const secs = timestamp / 1000.0;
    const rs = {
      g: g,
      gl: ogl_display_list('main'),
      w: g.canvas.innerWidth,
      h: g.canvas.innerHeight,
      frame: g.frame,
      aspect: g.canvas.innerWidth / g.canvas.innerHeight,
      time: secs,
      dt: secs - g.rs.time,
    };
    LOG('renderframe:', JSON.stringify(rs));
    g.rs = rs;
    for (const fn of g.renderfn) fn(rs);  // execute the render callbacks
    g.backend.submit_display_list(rs.gl); // submit the main display list for rendering -> backend
    requestAnimationFrame(render_frame);  // re-schedule for next V-sync (hopefully)
  }
  window.addEventListener('resize', on_window_resize, false); // listen to window size changes
  on_window_resize();                                         // initial setup for window size and aspect ratio
  render_frame();                                             // internally schedules next frame, so the render loop starts from this call
}
