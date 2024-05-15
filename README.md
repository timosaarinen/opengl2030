# Open Graphics Library 2030

- In the spirit, simplicity and beauty of the OpenGL.. *ES 3.0* rendering system specification (no, not the 1.1 one)
- Simplified from all the non-essentials, except where to avoid boilerplate and ease the learning curve (getting things fast on the screen)
- Defines an API through which a client app can control rendering and allows for IHV (GPU) drivers
- For current immediate mode and tiled rendering architectures and future approaches
- Higher-level rendering API allows IHVs to differentiate and optimize for their next generation hardware design
- C native and JS browser environment open-source libraries with ES3.0(WebGL2) / WebGPU / Vulkan rendering backends for initial development
- A community initiative
- KISS.

# Show me the code!

### Native (naturally with C.. Rust is an option, but not for this)
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

### Webtech (JS but later types, maybe TS compatible)

```js
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>OGL2030 example: Hello, Triangle!</title>
  <style>
    body { margin: 0; background-color: #000; color: #FFF; display: flex; flex-direction: column; justify-content: flex-end; align-items: center; height: 100vh; }
    canvas { display: block; width: 100vw; height: 100vh; }
    .caption, .logo { position: absolute; bottom: 10px; text-align: center; width: 100%; font-family: Arial, sans-serif; }
    .caption { bottom: 30px; font-size: 24px; }
    .logo { bottom: 10px; font-size: 18px; color: #03D000; }
  </style>
</head>
<body>
  <div id="canvas" class="canvas">Come on baby, bring on the gfxheat!</div>
  <script type="module">
    //------------------------------------------------------------------------
    import { ogl_open, ogl_add_render, ogl_run_render_loop, ogl_debug_tri, TWOPI } from '/src/ogl2030.js';

    function myrender(gl, rs) {
      const t = rs.time;
      const trisize = 0.5;
      const sin = Math.sin;
      const cos = Math.cos;
      ogl_debug_tri(gl,
        trisize * cos(t), trisize * sin(t),
        trisize * cos(t + 1/3.0*TWOPI), trisize * sin(t + 1/3.0*TWOPI),
        trisize * cos(t + 2/3.0*TWOPI), trisize * sin(t + 2/3.0*TWOPI) );
    }
    document.addEventListener('DOMContentLoaded', function() {
      const config = {
        mode: 'fullscreen',
        parent: document.getElementById('canvas'),
        debug: true,
        fullscreen: true,
      };
      const gl = ogl_open( config );
      ogl_add_render( gl, myrender );
      ogl_run_render_loop( gl );
    });
    //------------------------------------------------------------------------
  </script>
  <div class="caption">Hello, (un-aspect) Triangle!</div>
  <div class="logo">Open Graphics Library 2030</div>
</body>
</html>
```


# Roadmap / TODO:
- WebGL2 backend, minimal .html example
- Vulkan backend (MoltenVK on Mac?)
- ++

# Contributions

Feel free to contribute - we're just getting started.
