#ifndef G2030_H_INCLUDED
#define G2030_H_INCLUDED

#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>
#include <stdbool.h>
#include <inttypes.h>
#include <math.h>

typedef float     f32;
typedef double    f64;
typedef uint32_t  u32;
typedef uint64_t  u64;
typedef int32_t   s32;
typedef int64_t   s64;

typedef struct g_t g2030;

typedef enum g_mode_t { 
  g_FULLSCREEN = 0x00000001,
} g_mode;

typedef struct g_config_t {
  g_mode  mode;
  bool      debug;
  bool      vsync;
} g_config;

typedef struct g_renderstate_t {
  f32       time;
  f32       dt;
  u64       frame;
} g_renderstate;

typedef void (*g_renderfn_t)(g2030* g, g_renderstate* rs);

// TODO: vecmath.h
static const f32 PI      = 3.141592;
static const f32 TWOPI   = 2.f * 3.141592;
static const f32 HALFPI  = 0.5f * 3.141592;
static inline float cos(float a) { return cosf(a); }
static inline float sin(float a) { return sinf(a); }

extern g2030* g_open          (const g_config* config);
extern void g_add_render      (g2030* gl, g_renderfn_t fn);
extern void g_run_render_loop (g2030* gl);
extern void g_debug_tri       (g2030* gl, f32 x0, f32 y0, f32 x1, f32 y1, f32 x2, f32 y2);

#endif