#include <g2030.h>

#ifdef _WIN32
#include <windows.h>
#else
#include <unistd.h>
#endif

#ifdef DEBUG
#define LOG(...) printf(__VA_ARGS__)
#else
#define LOG(...) do { } while (0)
#endif

typedef struct g_t {
  struct g_renderstate_t renderstate;
  g_renderfn_t           renderfn;
} gl;

//------------------------------------------------------------------------
// internal functions
//------------------------------------------------------------------------
static const char* log_prefix = "G2030:";

static void* memalloc(size_t bytes) {
  void* p = malloc(bytes);
  if (p) return p;

  LOG("Failed to allocate %zu bytes, aborting.\n", bytes);
  exit(EXIT_FAILURE);
}

static void os_sleep(unsigned int milliseconds) {
  #ifdef _WIN32
    Sleep(milliseconds);
  #else
    usleep(milliseconds * 1000);
  #endif
}
static void renderstate_init(g_renderstate* rs) {
  rs->frame = 0;
  rs->time = 0.f;
  rs->dt = 0.f;
}
//------------------------------------------------------------------------
// public API
//------------------------------------------------------------------------
g2030* g_open(const g_config* config) {
  LOG("%s mode:0x%x debug:%d vsync:%d\n", log_prefix, config->mode, config->debug, config->vsync);

  gl* g = memalloc(sizeof(struct g_t));
  renderstate_init(&g->renderstate);
  g->renderfn = 0;

  return g;
}
void g_add_render(g2030* g, g_renderfn_t fn) {
  g->renderfn = fn; 
}
void g_debug_tri(g2030* g, f32 x0, f32 y0, f32 x1, f32 y1, f32 x2, f32 y2) {
  LOG("%s Pushing debug triangle draw: vec2(%f, %f), vec2(%f, %f), vec2(%f, %f)\n", 
       log_prefix,                         x0, y0,       x1, y1,       x2, y2);
}
void g_run_render_loop(g2030* g) {
  LOG("%s Running renderloop..\n", log_prefix);
  while(1) {
    g_renderstate* rs = &g->renderstate;
    rs->dt = 1/60.f; // TODO: realtime

    LOG("%s Frame %" PRIu64 " time:%f dt:%f\n", log_prefix, rs->frame, rs->time, rs->dt);
    if (g->renderfn) {
      g->renderfn(g, rs);
    }

    rs->frame++;
    rs->time += rs->dt;
    os_sleep(16);
  }
}
