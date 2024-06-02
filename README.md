# Open Graphics Library 2030
<p>A pragmatic rendering library aiming for simplicity in the modern mobile and desktop GPU landscape.</p>
<p>Unified interface for web (JS/wasm) and native (C).</p>
<p>Focused on acting as a base for a path tracer, but supports rasterization as well.</p>

*This library is in early design phase, do not use in production, API changes *will* happen!*

# Backends
* WebGL 2.0
* WebGPU (status: init)
* Vulkan (status: later)
* nulldevice

# Web example
Video: [https://www.youtube.com/watch?v=cjz-T7c9jKI](https://youtu.be/cjz-T7c9jKI?si=F4gr5txx47eD-b8R)
```js
<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>G2030 example: Hello, Triangle!</title>
  <style>
    body { margin: 0; background-color: #000; color: #FFF; display: flex; flex-direction: column; justify-content: flex-end; align-items: center; height: 100vh; }
    canvas { width: 100%; height: 100%; display: block; }
    #canvas-container { width: 100%; height: 100%; display: block; }
    .caption, .logo { position: absolute; bottom: 10px; text-align: center; width: 100%; font-family:'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif; }
    .caption { bottom: 30px; font-size: 24px; }
    .logo { bottom: 10px; font-size: 18px; color: #00FF00; text-shadow: 0 0 4px #00A000, 0 0 16px #00A000 }
  </style>
</head><body>
  <div id="canvas-container"></div>
  <script type="module">
    import { g_open, g_add_render, g_run_render_loop } from '../src/g2030.js'
    import { gl_viewport, gl_clear, gl_update_uniforms } from '../src/gl.js'
    import { vec4, rect, sin, cos, TWOPI } from '../src/vecmath.js'
    import { debug_open } from '../src/debug.js'
    import { log_enablegroups } from '../src/log.js'

    document.addEventListener('DOMContentLoaded', main)

    async function main() {
      const container = document.getElementById('canvas-container')
      const g = await g_open({ backend: 'webgl2', parent: container })
      const debug = debug_open( g )
      log_enablegroups( ['resize'] )
      g_add_render( g, (rs) => {
        const trisize = 0.69
        gl_update_uniforms( rs.gl, rs.uniforms )
        gl_viewport( rs.gl, rect(0, 0, rs.w, rs.h) )
        gl_clear( rs.gl, vec4(0.03, 0.01, 0.51, 1.0), 1.0 )
        debug.imageshader( rs.gl )
        debug.triangle( rs.gl, trisize * cos(rs.time)               / rs.aspect, trisize * sin(rs.time),
                               trisize * cos(rs.time + 1/3.0*TWOPI) / rs.aspect, trisize * sin(rs.time + 1/3.0*TWOPI),
                               trisize * cos(rs.time + 2/3.0*TWOPI) / rs.aspect, trisize * sin(rs.time + 2/3.0*TWOPI) )
      })
      g_run_render_loop( g )
    }
  </script>
  <div class="caption">Hello, Triangle!</div>
  <div class="logo">Open Graphics Library 2030</div>
</body></html>
```

# Native C example [_outdated_]
```c
#include <g2030.h>

void myrender(g2030* g, g_renderstate* rs) {
  const float t = rs->time;
  const float trisize = 0.5f;
  g_debug_tri( g,
     trisize * cosf(t), trisize * sinf(t),
     trisize * cosf(t + 1/3.0f*TWOPI), trisize * sinf(t + 1/3.0f*TWOPI),
     trisize * cosf(t + 2/3.0f*TWOPI), trisize * sinf(t + 2/3.0f*TWOPI) );
}

int main() {
  const g_config config = {
    .mode  = g_FULLSCREEN,
    .debug = true,
    .vsync = true,
  };
  g2030* g = g_open(&config);
  g_add_render( g, &myrender );
  g_run_render_loop( g );
  return 0;
}
```

# How to test?

```bash
opengl2030/web$ serve
```
Open the localhost link in a browser that supports WebGL 2.0 and click 'example' for rendering examples.

# Devnotes-in-readme
- need this myself for own projects - but if someone else finds it useful at some point of time, good
- TypeScript was an option, but decided on JS with ESM, partly to minimize dependencies
- now "declared dead" OpenGL was a major inspiration with GLSL #version 300 es for shader simplicity (see Shadertoy)
- ..but also mind: DX9/DX11/DX12/Vulkan/WebGL/WebGPU/Metal/Glide/Xbox-DX
- the year in the name.. well, few years still left to work on this. And round decades are cooler.
- native C/Vulkan not a priority at the moment, but keeping it in mind
- ..dynamic typing allows things that will require alternative solutions with C
- need work-stealing job system, not a render API responsibility usually, but will probably add it here
- Q: MoltenVK on Mac?

# Contributions
Feel free to contribute - we're just getting started.
