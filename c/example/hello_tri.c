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