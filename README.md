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
#include <math.h>

void myrender(GL2030* gl) {
  float t = gl2030_time( gl );

  const float trisize = 0.5f;
  gl2030_debug_tri( gl,
     trisize * cos(t), trisize * sinf(t),
     trisize * cos(t + 1/3.0f*M_2PI), trisize * sinf(t + 1/3.0f*M_2PI),
     trisize * cos(t + 2/3.0f*M_2PI), trisize * sinf(t + 2/3.0f*M_2PI) );
}

void main() {
  GL2030* gl = gl2030_open_json( '{ "mode": "fullscreen", "debug": true, "vsync": true }' ); // same as Web API
  gl2030_add_render( gl, &myrender );
  gl2030_run_render_loop( gl );
}
```

# Roadmap / TODO:
- test-compile above with dummy functions
- Vulkan backend to actually implement this
- Compatible Web API with WebGL2 backend
- ++

# Contributions

Feel free to contribute - we're just getting started.
