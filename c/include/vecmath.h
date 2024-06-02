// TODO: vecmath.h
#include "g2030.h"

static const f32 PI      = 3.14159265358979323846f;
static const f32 TWOPI   = 2.f * 3.14159265358979323846f;
static const f32 HALFPI  = 0.5f * 3.14159265358979323846f;
// TODO: was there any non-preprocessor way to get GLSL-like sin() cos() w/o conflicts with math.h?
// static inline float cos(float a) { return cosf(a); }
// static inline float sin(float a) { return sinf(a); }
// #define sin(a) sinf(a)
// #define cos(a) cosf(a)
