// TODO: dev: maybe lock into using ; or not..?
import { etext, create_canvas } from './html.js'

let disable_logging = false // set by config or ogl_enable_log(true | false)
let force_single_threaded = false // for debugging, can force single-threaded (TODO: WebWorkers..)

export const PI      = Math.PI
export const TWOPI   = 2.0 * PI
export const HALFPI  = 0.5 * PI
export const vw      = () => (window.innerWidth)
export const vh      = () => (window.innerHeight)
export const fmt     = (str) => str;
export const LOG     = (...args) => disable_logging ?? console.log(...args) // TODO: proper logging groups
export const TESTLOG = (...args) => { const s = fmt(...args); console.log(s); etext('testlog', s); }
export const WARNING = (...args) => console.error(...args)
export const panic   = (...args) => { throw new Error(...args) }
export const assert  = (mustbetrue) => mustbetrue ? undefined : panic(JSON.stringify(mustbetrue))
export const sin = (rad) => Math.sin(rad)
export const cos = (rad) => Math.cos(rad)
export const vec2 = (x, y) => ({ x, y });
export const vec3 = (x, y, z) => ({ x, y, z });
export const vec4 = (x, y, z, w) => ({ x, y, z, w });
export const rect = (x, y, width, height) => ({ x, y, width, height });
export const mat3 = (m00 = 1, m01 = 0, m02 = 0, m10 = 0, m11 = 1, m12 = 0, m20 = 0, m21 = 0, m22 = 1) => [
  [m00, m01, m02,
   m10, m11, m12,
   m20, m21, m22]
]
export const mat4 = (m00 = 1, m01 = 0, m02 = 0, m03 = 0, m10 = 0, m11 = 1, m12 = 0, m13 = 0, m20 = 0, m21 = 0, m22 = 1, m23 = 0, m30 = 0, m31 = 0, m32 = 0, m33 = 1) => [
  [m00, m01, m02, m03,
   m10, m11, m12, m13,
   m20, m21, m22, m23,
   m30, m31, m32, m33]
]
// TODO: vecmath functions?
//------------------------------------------------------------------------
// Display list / command buffer
//  - for familiarity reasons parameter is named 'gl' == Graphics List
//------------------------------------------------------------------------
export function ogl_display_list(name = 'a display list') {
  return {
    name: name,
    cmd: [],
  }
}
export const gl_viewport = (gl, rect) => { gl.cmd.push({ cmd: 'viewport', rect: rect }) };
export const gl_clear    = (gl, color_vec4, depth, stencil) => { gl.cmd.push({ cmd: 'clear', color: color_vec4, depth: depth, stencil: stencil }) }; // color/depth/stencil can be undefined for no-clear (in WebGL: gl.COLOR_BUFFER_BIT etc)

export function gl_tostring(gl) {
  let s = "";
  for (const c of gl.cmd) {
    switch(c.cmd) {
      case 'viewport':  s += fmt(`[${gl.name}] viewport x ${c.rect.x} y ${c.rect.y} width ${c.rect.width} height ${c.rect.height}`); break;
      case 'clear':     s += fmt(`[${gl.name}] clear color ${c.color} depth ${c.depth} stencil ${c.stencil}`); break;
      default:          s += fmt(`[${gl.name}] WARNING: unknown command: ${c.cmd}`); break;
    }
    s += '\n';
  }
  return s
}
export function gl_tojson(gl) {
  let o = [];
  for (const c of gl.cmd) {
    switch(c.cmd) {
      case 'viewport':  o.push(`[${gl.name}] viewport x ${c.rect.x} y ${c.rect.y} width ${c.rect.width} height ${c.rect.height}`); break;
      case 'clear':     o.push(`[${gl.name}] clear color ${c.color} depth ${c.depth} stencil ${c.stencil}`); break;
      default:          o.push(`[${gl.name}] WARNING: unknown command: ${c.cmd}`); break;
    }
  }
  return o // example usage: JSON.stringify( gl_tojson(gl) )
}


// create a shader of 'type' VERTEX_SHADER | FRAGMENT_SHADER with 'source' es300 shader code
function load_shader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    WARNING('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader
}
// create a system debug shader (also called a program, vertex/fragment shader combo)
function create_debug_shader(gl) {
  const vshader = `#version 300 es
  in vec4 a_position;
  void main() {
    gl_Position = vec4(a_position.x, a_position.y, 0.0, 1.0);
  }`;
  const fshader = `#version 300 es
  precision mediump float;
  out vec4 outColor;
  void main() {
    outColor = vec4(1.0, 0.0, 1.0, 1.0); // the traditional gamedev placeholder color: bright pink!
  }`;

  const vs = load_shader(gl, gl.VERTEX_SHADER, vshader);
  const fs = load_shader(gl, gl.FRAGMENT_SHADER, fshader);
  const program = gl.createProgram();
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    WARNING('Unable to initialize the shader program: ' + gl.getProgramInfoLog(program));
    return;
  }
  //----> shader
  return {
    program: program,
    attrib: {
      pos: gl.getAttribLocation(program, 'a_position'),
    }
  }
}
function create_debug_buffer(gl, shader) {
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  // initial clipspace XY positions, overwritten
  const pos2d = [
    -0.5,  0.5,
    -0.5, -0.5,
     0.5, -0.5,
  ];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pos2d), gl.STATIC_DRAW);
  // setup Vertex Array Object (VAO) telling how to pull the positions into the position attribute
  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  gl.enableVertexAttribArray(shader.attrib.pos);
  gl.vertexAttribPointer(shader.attrib.pos, 2, gl.FLOAT, false, 0, 0);
  //----> buffer
  return {
    buffer: buffer,
    vao: vao,
    shader: shader,
  }
}
export function create_null_device(config, canvas) {
  return {
    open: function(config) {
      return {
        name: 'null device',
        canvas: canvas,
      }
    },
    submit_display_list: function(gl) {
      if (config.debug) console.log('display list submit:', gl_tostring(gl)) // TODO: use console.log here?
      // TODO: simulate commands?
    }
  }
}
//------------------------------------------------------------------------
// public API
//------------------------------------------------------------------------
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
    case 'null':    LOG('nulldevice backend selected.'); backend = create_null_device(config); break
    default:        panic('Unsupported backend')
  }
  assert(backend);
  if (config.parent) config.parent.appendChild(canvas)
  // debug components
  const debug_pink_shader = create_debug_shader(webgl2)
  const debug_pink_data = create_debug_buffer(webgl2, debug_pink_shader)
  //----> our gl context
  return {
    config:   config,
    w:        canvas.innerWidth,
    h:        canvas.innerHeight,
    canvas:   canvas,
    backend:  backend, // @see webgpu.js and webgl2.js
    renderfn: [], // render frame callbacks, in draw order
    debug_pink: {
      shader: debug_pink_shader,
      bytes:  debug_pink_data,
    }
  }
}
export function ogl_add_render(g, fn) {
  g.renderfn.push(fn);
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
  function auto_clear(gl) {
    gl.viewport(0, 0, rs.w, rs.h);
    //gl.clearColor(0.0, 0.0, 0.0, 1.0);
    //gl.clear(gl.COLOR_BUFFER_BIT);
  }
  function draw_debug_primitives() {
    gl.useProgram(g.debug_pink.shader.program);
    gl.bindVertexArray(g.debug_pink.bytes.vao);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }
  function render_frame(timestamp) {
    const secs = timestamp / 1000.0;
    const rs = {
      gl: ogl_display_list('main'),
      w: g.canvas.innerWidth,
      h: g.canvas.innerHeight,
      frame: g.frame,
      aspect: g.canvas.innerWidth / g.canvas.innerHeight,
      time: secs,
    };
    LOG('renderframe:', JSON.stringify(rs));
    for (const fn of g.renderfn) fn(g, rs); // execute the render callbacks
    requestAnimationFrame(render_frame);    // re-schedule for next V-sync (hopefully)
    ogl_submit_display_list(rs.gl);         // submit the main display list for rendering
  }
  ogl_add_render(g, draw_debug_primitives);                   // add our debug draw to per-frame render callbacks
  window.addEventListener('resize', on_window_resize, false); // listen to window size changes
  on_window_resize();                                         // initial setup for window size and aspect ratio
  render_frame();                                             // internally schedules next frame, so the render loop starts from this call
}
export function ogl_debug_tri(g, x0, y0, x1, y1, x2, y2) {
  const gl = g.webgl2;
  const pos2d = new Float32Array([ x0, y0, x1, y1, x2, y2 ]);
  gl.bindBuffer(gl.ARRAY_BUFFER, g.debug_pink.bytes.buffer);
  gl.bufferData(gl.ARRAY_BUFFER, pos2d, gl.STATIC_DRAW);
  gl.vertexAttribPointer(g.debug_pink.shader.attrib.pos, 2, gl.FLOAT, false, 0, 0);
  log("Updated buffer:", x0, y0, g.debug_pink.bytes.buffer, g.debug_pink.shader.attrib.pos);
}
