[![Video Demo](https://img.youtube.com/vi/EqL-VRLRdWY/0.jpg)](https://www.youtube.com/watch?v=EqL-VRLRdWY)

## This library is in early design phase, do not use in production, API changes *will* happen!
<br>
<hr>

# Open Graphics Library 2030
A pragmatic rendering library aiming for simplicity in the modern mobile and desktop GPU landscape. Unified interface for JS and C.

# Backends
* WebGL 2.0
* WebGPU
* Vulkan

# Web example
```js
<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>OGL2030 example: Hello, Triangle!</title>
  <style>
    body { margin: 0; background-color: #000; color: #FFF; display: flex; flex-direction: column; justify-content: flex-end; align-items: center; height: 100vh; }
    canvas { display: block; width: 100vw; height: 100vh; }
    .caption, .logo { position: absolute; bottom: 10px; text-align: center; width: 100%; font-family: Arial, sans-serif; }
    .caption { bottom: 30px; font-size: 24px; }
    .logo { bottom: 10px; font-size: 18px; color: #03D000; }
  </style>
</head><body>
  <div id="canvas"></div>
  <script type="module">
    import { ogl_open, ogl_add_render, ogl_run_render_loop } from '/src/ogl2030.js';
    import { gl_viewport, gl_clear } from '/src/gl.js'
    import { vec4, rect, sin, cos, TWOPI } from '/src/vecmath.js'
    import { debug_open } from '/src/debug.js'

    async function main() {
      const container = document.getElementById('canvas')
      const g = await ogl_open({ mode: 'fullscreen', backend: 'webgl2', parent: container })
      const debug = debug_open( g )
      ogl_add_render( g, (rs) => {
        const t = rs.time
        const trisize = 0.8
        const aspect = rs.w / rs.h
        gl_viewport   ( rs.gl, rect(0, 0, rs.w, rs.h) )
        gl_clear      ( rs.gl, vec4(0.1, 0.02, 0.4, 1.0), 1.0 )
        debug.triangle( rs.gl, trisize * cos(t)               / aspect, trisize * sin(t),
                               trisize * cos(t + 1/3.0*TWOPI) / aspect, trisize * sin(t + 1/3.0*TWOPI),
                               trisize * cos(t + 2/3.0*TWOPI) / aspect, trisize * sin(t + 2/3.0*TWOPI) )
      });
      ogl_run_render_loop( g )
    }
    document.addEventListener('DOMContentLoaded', main)
  </script>
  <div class="caption">Hello, Triangle!</div>
  <div class="logo">Open Graphics Library 2030</div>
</body></html>
```

# Native C example [_outdated_]
```c
#include <ogl2030.h>

void myrender(OGL* ogl, OGL_renderstate* rs) {
  const float t = rs->time;
  const float trisize = 0.5f;
  ogl_debug_tri( ogl,
     trisize * cosf(t), trisize * sinf(t),
     trisize * cosf(t + 1/3.0f*TWOPI), trisize * sinf(t + 1/3.0f*TWOPI),
     trisize * cosf(t + 2/3.0f*TWOPI), trisize * sinf(t + 2/3.0f*TWOPI) );
}

int main() {
  const OGL_config config = {
    .mode  = OGL_FULLSCREEN,
    .debug = true,
    .vsync = true,
  };
  OGL* ogl = ogl_open(&config);
  ogl_add_render( ogl, &myrender );
  ogl_run_render_loop( ogl );
  return 0;
}
```

# Devnotes-in-readme
- TypeScript was an option, but decided on JS with ESM, partly to minimize dependencies
- OpenGL "open-sourceness" (specification..) was the inspiration, but also mind: DX9/DX11/DX12/Vulkan/WebGL/WebGPU/Metal/Glide/Xbox-DX
- GLSL #version 300 as main inspiration for shader simplicity (see Shadertoy)
- TODO: WebGL2 backend with examples/tests
- TODO: WebGPU backend on the side, but not a priority
- TODO: Vulkan backend even later
- Q: MoltenVK on Mac?

# Contributions
Feel free to contribute - we're just getting started.
