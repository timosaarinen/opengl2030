// TODO:

const myvertexbuffer = g_new_buffer( g, 
  'vertexbuffer', 
  'struct { vec3 position; vec2 uv; }', 
  [vec3(-0.5,  0.5, 0.0), vec2(0, 0), 
   vec3(-0.5, -0.5, 0.0), vec2(1, 0),
   vec3( 0.5, -0.5, 0.0), vec2(0, 1) ])

  // canvas.width = window.innerWidth;
  // canvas.height = window.innerHeight;
  // gl.viewport(0, 0, canvas.width, canvas.height);
