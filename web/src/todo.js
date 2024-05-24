// TODO:

const myvertexbuffer = g_new_buffer( g, 
  'vertexbuffer', 
  'struct { vec3 position; vec2 uv; }', 
  [vec3(-0.5,  0.5, 0.0), vec2(0, 0), 
   vec3(-0.5, -0.5, 0.0), vec2(1, 0),
   vec3( 0.5, -0.5, 0.0), vec2(0, 1) ])


function draw_imageshader(webgl2, pipe) {
  const g = pipe.g // kludgy..
  use_pipe( webgl2, pipe )
  const program = pipe.program.program
  const aPosition = webgl2.getAttribLocation(program, 'a_position')
  const iResolution = webgl2.getUniformLocation(program, 'iResolution')
  const iTime = webgl2.getUniformLocation(program, 'iTime')
  const iMouse = webgl2.getUniformLocation(program, 'iMouse')
  const positionBuffer = webgl2.createBuffer()
  webgl2.bindBuffer(webgl2.ARRAY_BUFFER, positionBuffer)
  webgl2.bufferData(webgl2.ARRAY_BUFFER, new Float32Array([-1.0, -1.0, 3.0, -1.0, -1.0, 3.0]), webgl2.STATIC_DRAW)
  webgl2.enableVertexAttribArray(aPosition)
  webgl2.vertexAttribPointer(aPosition, 2, webgl2.FLOAT, false, 0, 0)
  webgl2.uniform3f(iResolution, canvas.width, canvas.height, 1.0)
  webgl2.uniform1f(iTime, g.rs.time)
  webgl2.uniform4f(iMouse, g.mouse.x, g.mouse.y, 0.0, 0.0)
  webgl2.drawArrays(webgl2.TRIANGLES, 0, 3)
}
