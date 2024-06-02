#include <g2030.h>

void myrender(g2030* g, g_renderstate* rs) {
  const float t = rs->time;
  const float trisize = 0.5f;
  g_debug_tri( g,
     trisize * cos(t), trisize * sin(t),
     trisize * cos(t + 1/3.0f*TWOPI), trisize * sin(t + 1/3.0f*TWOPI),
     trisize * cos(t + 2/3.0f*TWOPI), trisize * sin(t + 2/3.0f*TWOPI) );
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