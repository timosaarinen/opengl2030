# Open Graphics Library 2030

- In the spirit, simplicity and beauty of the original OpenGL rendering system specification
- Simplified from all the non-essentials, except where to avoid boilerplate and ease the learning curve (debug functions)
- Defines an API through which a client app can control rendering and allows for IHV (GPU) drivers
- For current immediate mode and tiled rendering architectures and future approaches
- Higher-level rendering API allows IHVs to differentiate and optimize for their next generation hardware design
- C native and JS browser environment open-source libraries with ES3.0(WebGL2) / WebGPU / Vulkan rendering backends for initial development
- A community initiative
- KISS.

# Show me the code!

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

# Roadmap / TODO:
- WebGL2 backend, minimal .html example
- Vulkan backend (MoltenVK on Mac?)
- ++

# Contributions

Feel free to contribute - we're just getting started.
