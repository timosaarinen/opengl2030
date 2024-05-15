export const PI      = Math.PI
export const TWOPI   = 2.0 * PI
export const HALFPI  = 0.5 * PI

const vw = () => (window.innerWidth)
const vh = () => (window.innerHeight)
const assert = (come_on_be_true_to_me_baby) => come_on_be_true_to_me_baby ? undefined : console.error(JSON.stringify(come_on_be_true_to_me_baby));

// create a shader of 'type' VERTEX_SHADER | FRAGMENT_SHADER with 'source' es300 shader code
function load_shader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
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
    console.error('Unable to initialize the shader program: ' + gl.getProgramInfoLog(program));
    return;
  }
  //---- shader
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
  //---- buffer
  return {
    buffer: buffer,
    vao: vao,
    shader: shader,
  }
}
// create a fullscreen HTML canvas element and get 'webgl2' context from it
// @returns webgl2 context or null, if not supported by browser
function create_webgl2_canvas_context() {
  // create a fullscreen canvas element
  const canvas = document.createElement('canvas');
  canvas.width = vw();
  canvas.height = vh();
  const webgl2 = canvas.getContext('webgl2'); // WebGL 2.0 (GLSL ES 3.00 #version 300 es)
  if (!webgl2) {
    console.error("WebGL 2 not supported");
    return null;
  }
  return [canvas, webgl2];
}
//------------------------------------------------------------------------
// public API
//------------------------------------------------------------------------
export function ogl_open(config) {
  const [canvas, webgl2] = create_webgl2_canvas_context();
  if (!webgl2) return null;
  assert(canvas);
  assert(webgl2);
  if (config.parent) {
    config.parent.appendChild(canvas);
  }

  const pink_shader = create_debug_shader(webgl2);
  const pink_data = create_debug_buffer(webgl2, pink_shader);
  
  //---- gl (context)
  return {
    canvas: canvas,
    webgl2: webgl2,
    renderfn: [], // render frame callbacks, in draw order
    pink: {
      shader: pink_shader,
      bytes:  pink_data,
    }
  }
}
export function ogl_add_render(g, fn) {
  g.renderfn.push(fn);
}
export function ogl_run_render_loop(g) {
  const gl = g.webgl2;
  function set_renderer_size(w, h) {
    const aspect = w / h;
    console.log('resize:', 'width', w, 'height', h, 'aspect', aspect);
    // TODO: update projection matrix ..if we had one!
  }
  function on_window_resize() {
    const w = vw();
    const h = vh();
    set_renderer_size(w,h);
  }
  function render_frame(timestamp) {
    const rs = { time: timestamp / 1000.0 }; // ms -> seconds
    const w = g.canvas.width;
    const h = g.canvas.height;
    console.log('renderframe:', 'width', w, 'height', h);
    gl.viewport(0, 0, w, h);
    for (const fn of g.renderfn) fn(g, rs);
    // draw the debug prims
    gl.useProgram(g.pink.shader.program);
    gl.bindVertexArray(g.pink.bytes.vao);
    gl.clearColor(0.0, 0.0, 0.0, 1.0); // back in Black!
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    // schedule for next V-sync (hopefully)
    requestAnimationFrame(render_frame);
  }
  window.addEventListener('resize', on_window_resize, false); // listen to window size changes
  on_window_resize(); // initial setup for window size and aspect ratio
  render_frame(); // internally schedules next frame, so the render loop starts from this call
}
// export function ogl_debug_tri(gl, x0, y0, x1, y1, x2, y2) {
//   const webgl2 = gl.webgl2;
//   const pos2d = new Float32Array([ x0, y0, x1, y1, x2, y2 ]);
//   webgl2.bindBuffer(webgl2.ARRAY_BUFFER, gl.pink.shader.attrib.pos);
//   webgl2.bufferSubData(webgl2.ARRAY_BUFFER, 0, pos2d);
// }
export function ogl_debug_tri(g, x0, y0, x1, y1, x2, y2) {
  const gl = g.webgl2;
  const pos2d = new Float32Array([ x0, y0, x1, y1, x2, y2 ]);
  gl.bindBuffer(gl.ARRAY_BUFFER, g.pink.bytes.buffer);
  gl.bufferData(gl.ARRAY_BUFFER, pos2d, gl.STATIC_DRAW);
  gl.vertexAttribPointer(g.pink.shader.attrib.pos, 2, gl.FLOAT, false, 0, 0);

  console.log("Updated buffer:", x0, y0, g.pink.bytes.buffer, g.pink.shader.attrib.pos);
}
