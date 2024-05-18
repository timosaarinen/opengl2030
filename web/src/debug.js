import { ogl_new_shader, ogl_new_buffer, ogl_new_vao, ogl_new_renderable } from './resource.js';

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
  return gl_program(gl, vshader, fshader);
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
function debug_open(ogl) {
  let pos2d = [ -0.5,  0.5,
                -0.5, -0.5,
                 0.5, -0.5 ]
  const vshader = `#version 300 es
    in vec4 a_position;
    void main() {
      gl_Position = vec4(a_position.x, a_position.y, 0.0, 1.0);
  }`
  const fshader = `#version 300 es
    precision mediump float;
    out vec4 outColor;
    void main() {
      outColor = vec4(1.0, 0.0, 1.0, 1.0); // the traditional gamedev placeholder color: bright pink!
  }`
  const pink_shader     = ogl_new_shader(ogl, vshader, fshader)
  const pink_buffer     = ogl_new_buffer(ogl, VERTEX_BUFFER, pos2d)
  const pink_vao        = ogl_new_vao   (ogl, pink_buffer, [{loc: webgl2.getAttribLocation(program, 'a_position'), numcomponents: 2, type: webgl2.FLOAT, offset: 0, normalize: false}])
  const pink_renderable = ogl_new_renderable(ogl, pink_shader, pink_buffer, pink_vao, TRIANGLES, 0, 3);

  //----> debug
  return {
    draw: (rs) => gl_draw_renderable(rs.gl, pink_renderable)
  }
}
