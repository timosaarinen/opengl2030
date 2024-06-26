// TODO: dynamic shadergen, generate this from uniforms.js 'Uniforms'
export const ubo_shadercode = `\n
precision highp float;
uniform Uniforms {
  uniform highp mat4        mvp;
  uniform highp mat4        object_to_world;
  uniform highp mat4        object_to_view;
  uniform highp mat4        world_to_proj;
  uniform highp mat4        world_to_view;
  uniform highp mat4        world_to_object;
  uniform highp mat4        view_to_object;
  uniform highp mat4        view_to_world;
  uniform highp mat4        view_to_proj;
  uniform highp mat4        proj_to_view;
  uniform highp vec4        u0;
  uniform highp vec4        u1;
  uniform highp vec4        u2;
  uniform highp vec4        u3;
  uniform highp vec4        u4;
  uniform highp vec4        u5;
  uniform highp vec4        u6;
  uniform highp vec4        u7;
  uniform highp mat4        umtx0;
  uniform highp mat4        umtx1;
  uniform highp mat4        umtx2;
  uniform highp mat4        umtx3;
  uniform highp float       uvec[256];
  uniform highp vec2        iResolution;
  uniform highp float       iTime;
  uniform highp vec4        iMouse;
};
uniform highp sampler2D     iChannel0;
uniform highp sampler2D     iChannel1;
uniform highp sampler2D     iChannel2;
uniform highp sampler2D     iChannel3;
\n`
export const vs_ubo_ref = `#version 300 es` + ubo_shadercode + `in vec4 a_position; void main() { gl_Position = a_position; }`
export const fs_ubo_ref = `#version 300 es` + ubo_shadercode + `out vec4 frag_color; void main() { frag_color = vec4(1); }`
//------------------------------------------------------------------------
export const vs_pos_passthrough = `#version 300 es
in vec4 a_position;
void main() {
  gl_Position = a_position;
}`
export const vs_pos = `#version 300 es` + ubo_shadercode + `
in vec4 a_position;
void main() {
  gl_Position = a_position * mvp;
}`
export const vs_pos_color = `#version 300 es` + ubo_shadercode + `
in vec4 a_position; in vec4 a_color;
out vec4 v_color;
void main() {
  gl_Position = a_position * mvp;
  v_color = a_color;
}`
export const vs_pos_uv_color = `#version 300 es` + ubo_shadercode + `
in vec4 a_position; in vec4 a_color; in vec2 a_uv;
out vec2 v_uv; out vec4 v_color;
void main() {
  gl_Position = a_position * mvp;
  v_uv = a_uv;
  v_color = a_color;
}`
export const fs_pink = `#version 300 es` + ubo_shadercode + `
out vec4 frag_color;
void main() {
  frag_color = vec4(1.0, 0.0, 1.0, 1.0); // the traditional gamedev placeholder color: bright pink!
}`
export const fs_vertexcolor = `#version 300 es` + ubo_shadercode + `
in vec4 v_color;
out vec4 frag_color;
void main() {
  frag_color = v_color;
}`
export const fs_texture = `#version 300 es` + ubo_shadercode + `
in vec4 v_color; in vec2 v_uv;
out vec4 frag_color;
void main() {
  frag_color = v_color * texture(iChannel0, v_uv);
}`
export const fs_imageshader_test = `#version 300 es` + ubo_shadercode + `
out vec4 frag_color;
void main() {
  //frag_color = vec4(1.0, 0.0, 0.0, 1.0); return; // DEBUG:
  vec2 uv = gl_FragCoord.xy / iResolution.xy;
  //frag_color = vec4(uv.x, uv.y, 0.0, 1.0); return; // DEBUG:
  vec2 d = iMouse.xy - gl_FragCoord.xy;
  float anim = sin(2.0*iTime);
  float aspect = iResolution.x / iResolution.y;
  vec3 color = vec3(0.2, 1.0, 0.2) * (0.75 + 0.25*mod(floor(42.0*uv.x*aspect + cos(0.01*d.x + iTime)) + floor(42.0*uv.y + sin(0.01*d.y)), 2.0)) * 500.0*pow(1.0/(1.0 + length(d)), 1.64 + 0.2 * anim);
  //color *= vec3(0.5 + 0.5*sin(997.0 * iTime * uv.y));
  color += pow((1.0 - anim) / (1.0 + d.y), 0.25);
  color *= color;
  frag_color = vec4(color, 1.0);
}`
export const fs_shadertoy_prefix = `#version 300 es
uniform highp vec3 iResolution;
uniform highp float iTime;
uniform highp vec4 iMouse;
out vec4 frag_color;
`
export const fs_shadertoy_postfix = `\n
void main() {
  mainImage( frag_color, gl_FragCoord );
}`
// "Let's self reflect" by mrange: https://www.shadertoy.com/view/XfyXRV
export const fs_shadertoy_let_us_self_reflect_by_mrange = fs_shadertoy_prefix + `
// CC0: Let's self reflect
//  Always enjoyed the videos of Platonic solids with inner mirrors
//  I made some previous attempts but thought I make another attempt it

// Reducing the alias effects on the inner reflections turned out to be a bit tricky. 
//  Simplest solution is just to run run fullscreen on a 4K screen ;)

// Function to generate the solid found here: https://www.shadertoy.com/view/MsKGzw

// Tinker with these parameters to create different solids
// -------------------------------------------------------
const float rotation_speed= 0.25;

const float poly_U        = 1.;   // [0, inf]
const float poly_V        = 0.5;  // [0, inf]
const float poly_W        = 1.0;  // [0, inf]
const int   poly_type     = 3;    // [2, 5]
const float poly_zoom     = 2.0;

const float inner_sphere  = 1.;

const float refr_index    = 0.9;

#define MAX_BOUNCES2        6
// -------------------------------------------------------



#define TIME        iTime
#define RESOLUTION  iResolution
#define PI          3.141592654
#define TAU         (2.0*PI)

// License: WTFPL, author: sam hocevar, found: https://stackoverflow.com/a/17897228/418488
const vec4 hsv2rgb_K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
vec3 hsv2rgb(vec3 c) {
  vec3 p = abs(fract(c.xxx + hsv2rgb_K.xyz) * 6.0 - hsv2rgb_K.www);
  return c.z * mix(hsv2rgb_K.xxx, clamp(p - hsv2rgb_K.xxx, 0.0, 1.0), c.y);
}
// License: WTFPL, author: sam hocevar, found: https://stackoverflow.com/a/17897228/418488
//  Macro version of above to enable compile-time constants
#define HSV2RGB(c)  (c.z * mix(hsv2rgb_K.xxx, clamp(abs(fract(c.xxx + hsv2rgb_K.xyz) * 6.0 - hsv2rgb_K.www) - hsv2rgb_K.xxx, 0.0, 1.0), c.y))

#define TOLERANCE2          0.0005
//#define MAX_RAY_LENGTH2   10.0
#define MAX_RAY_MARCHES2    50
#define NORM_OFF2           0.005
#define BACKSTEP2

#define TOLERANCE3          0.0005
#define MAX_RAY_LENGTH3     10.0
#define MAX_RAY_MARCHES3    90
#define NORM_OFF3           0.005

const vec3 rayOrigin    = vec3(0.0, 1., -5.);
const vec3 sunDir       = normalize(-rayOrigin);


const vec3 sunCol       = HSV2RGB(vec3(0.06 , 0.90, 1E-2))*1.;
const vec3 bottomBoxCol = HSV2RGB(vec3(0.66, 0.80, 0.5))*1.;
const vec3 topBoxCol    = HSV2RGB(vec3(0.60, 0.90, 1.))*1.;
const vec3 glowCol0     = HSV2RGB(vec3(0.05 , 0.7, 1E-3))*1.;
const vec3 glowCol1     = HSV2RGB(vec3(0.95, 0.7, 1E-3))*1.;
const vec3 beerCol      = -HSV2RGB(vec3(0.15+0.5, 0.7, 2.)); 
const float rrefr_index = 1./refr_index;


// License: Unknown, author: knighty, found: https://www.shadertoy.com/view/MsKGzw
const float poly_cospin   = cos(PI/float(poly_type));
const float poly_scospin  = sqrt(0.75-poly_cospin*poly_cospin);
const vec3  poly_nc       = vec3(-0.5, -poly_cospin, poly_scospin);
const vec3  poly_pab      = vec3(0., 0., 1.);
const vec3  poly_pbc_     = vec3(poly_scospin, 0., 0.5);
const vec3  poly_pca_     = vec3(0., poly_scospin, poly_cospin);
const vec3  poly_p        = normalize((poly_U*poly_pab+poly_V*poly_pbc_+poly_W*poly_pca_));
const vec3  poly_pbc      = normalize(poly_pbc_);
const vec3  poly_pca      = normalize(poly_pca_);

mat3 g_rot;
vec2 g_gd;
  
// License: MIT, author: Inigo Quilez, found: https://iquilezles.org/articles/noacos/
mat3 rot(vec3 d, vec3 z) {
  vec3  v = cross( z, d );
  float c = dot( z, d );
  float k = 1.0/(1.0+c);

  return mat3( v.x*v.x*k + c,     v.y*v.x*k - v.z,    v.z*v.x*k + v.y,
               v.x*v.y*k + v.z,   v.y*v.y*k + c,      v.z*v.y*k - v.x,
               v.x*v.z*k - v.y,   v.y*v.z*k + v.x,    v.z*v.z*k + c    );
}

// License: Unknown, author: Matt Taylor (https://github.com/64), found: https://64.github.io/tonemapping/
vec3 aces_approx(vec3 v) {
  v = max(v, 0.0);
  v *= 0.6;
  float a = 2.51;
  float b = 0.03;
  float c = 2.43;
  float d = 0.59;
  float e = 0.14;
  return clamp((v*(a*v+b))/(v*(c*v+d)+e), 0.0, 1.0);
}

float sphere(vec3 p, float r) {
  return length(p) - r;
}

// License: MIT, author: Inigo Quilez, found: https://iquilezles.org/articles/distfunctions/
float box(vec2 p, vec2 b) {
  vec2 d = abs(p)-b;
  return length(max(d,0.0)) + min(max(d.x,d.y),0.0);
}
  
// License: Unknown, author: knighty, found: https://www.shadertoy.com/view/MsKGzw
void poly_fold(inout vec3 pos) {
  vec3 p = pos;

  for(int i = 0; i < poly_type; ++i){
    p.xy  = abs(p.xy);
    p    -= 2.*min(0., dot(p,poly_nc)) * poly_nc;
  }
  
  pos = p;
}

float poly_plane(vec3 pos) {
  float d0 = dot(pos, poly_pab);
  float d1 = dot(pos, poly_pbc);
  float d2 = dot(pos, poly_pca);
  float d = d0;
  d = max(d, d1);
  d = max(d, d2);
  return d;
}

float poly_corner(vec3 pos) {
  float d = length(pos) - .0125;
  return d;
}

float dot2(vec3 p) {
  return dot(p, p);
}

float poly_edge(vec3 pos) {
  float dla = dot2(pos-min(0., pos.x)*vec3(1., 0., 0.));
  float dlb = dot2(pos-min(0., pos.y)*vec3(0., 1., 0.));
  float dlc = dot2(pos-min(0., dot(pos, poly_nc))*poly_nc);
  return sqrt(min(min(dla, dlb), dlc))-2E-3;
}

vec3 shape(vec3 pos) {
  pos *= g_rot;
  pos /= poly_zoom;
  poly_fold(pos);
  pos -= poly_p;

  return vec3(poly_plane(pos), poly_edge(pos), poly_corner(pos))*poly_zoom;
}

vec3 render0(vec3 ro, vec3 rd) {
  vec3 col = vec3(0.0);
  
  float srd  = sign(rd.y);
  float tp   = -(ro.y-6.)/abs(rd.y);

  if (srd < 0.) {
    col += bottomBoxCol*exp(-0.5*(length((ro + tp*rd).xz)));
  }

  if (srd > 0.0) {
    vec3 pos  = ro + tp*rd;
    vec2 pp = pos.xz;
    float db = box(pp, vec2(5.0, 9.0))-3.0;
    
    col += topBoxCol*rd.y*rd.y*smoothstep(0.25, 0.0, db);
    col += 0.2*topBoxCol*exp(-0.5*max(db, 0.0));
    col += 0.05*sqrt(topBoxCol)*max(-db, 0.0);
  }


  col += sunCol/(1.001-dot(sunDir, rd));
  return col; 
}

float df2(vec3 p) {
  vec3 ds = shape(p);
  float d2 = ds.y-5E-3;
  float d0 = min(-ds.x, d2);
  float d1 = sphere(p, inner_sphere);
  g_gd = min(g_gd, vec2(d2, d1));
  float d = (min(d0, d1));
  return d;
}

float rayMarch2(vec3 ro, vec3 rd, float tinit) {
  float t = tinit;
#if defined(BACKSTEP2)
  vec2 dti = vec2(1e10,0.0);
#endif
  int i;
  for (i = 0; i < MAX_RAY_MARCHES2; ++i) {
    float d = df2(ro + rd*t);
#if defined(BACKSTEP2)
    if (d<dti.x) { dti=vec2(d,t); }
#endif  
    // Bouncing in a closed shell, will never miss
    if (d < TOLERANCE2/* || t > MAX_RAY_LENGTH3 */) {
      break;
    }
    t += d;
  }
#if defined(BACKSTEP2)
  if(i==MAX_RAY_MARCHES2) { t=dti.y; };
#endif  
  return t;
}

vec3 normal2(vec3 pos) {
  vec2  eps = vec2(NORM_OFF2,0.0);
  vec3 nor;
  nor.x = df2(pos+eps.xyy) - df2(pos-eps.xyy);
  nor.y = df2(pos+eps.yxy) - df2(pos-eps.yxy);
  nor.z = df2(pos+eps.yyx) - df2(pos-eps.yyx);
  return normalize(nor);
}

vec3 render2(vec3 ro, vec3 rd, float db) {
  vec3 agg = vec3(0.0);
  float ragg = 1.;
  float tagg = 0.;
  
  for (int bounce = 0; bounce < MAX_BOUNCES2; ++bounce) {
    if (ragg < 0.1) break;
    g_gd      = vec2(1E3);
    float t2  = rayMarch2(ro, rd, min(db+0.05, 0.3));
    vec2 gd2  = g_gd;
    tagg      += t2;
    
    vec3 p2   = ro+rd*t2;
    vec3 n2   = normal2(p2);
    vec3 r2   = reflect(rd, n2);
    vec3 rr2  = refract(rd, n2, rrefr_index);
    float fre2= 1.+dot(n2,rd);
    
    vec3 beer = ragg*exp(0.2*beerCol*tagg);
    agg += glowCol1*beer*((1.+tagg*tagg*4E-2)*6./max(gd2.x, 5E-4+tagg*tagg*2E-4/ragg));
    vec3 ocol = 0.2*beer*render0(p2, rr2);
    if (gd2.y <= TOLERANCE2) {
      ragg *= 1.-0.9*fre2;
    } else {
      agg     += ocol;
      ragg    *= 0.8;
    }
    
    ro        = p2;
    rd        = r2;
    db        = gd2.x; 
  }


  return agg;
}

float df3(vec3 p) {
  vec3 ds = shape(p);
  g_gd = min(g_gd, ds.yz);
  const float sw = 0.02;
  float d1 = min(ds.y, ds.z)-sw;
  float d0 = ds.x;
  d0 = min(d0, ds.y);
  d0 = min(d0, ds.z);
  return d0;
}

float rayMarch3(vec3 ro, vec3 rd, float tinit, out int iter) {
  float t = tinit;
  int i;
  for (i = 0; i < MAX_RAY_MARCHES3; ++i) {
    float d = df3(ro + rd*t);
    if (d < TOLERANCE3 || t > MAX_RAY_LENGTH3) {
      break;
    }
    t += d;
  }
  iter = i;
  return t;
}

vec3 normal3(vec3 pos) {
  vec2  eps = vec2(NORM_OFF3,0.0);
  vec3 nor;
  nor.x = df3(pos+eps.xyy) - df3(pos-eps.xyy);
  nor.y = df3(pos+eps.yxy) - df3(pos-eps.yxy);
  nor.z = df3(pos+eps.yyx) - df3(pos-eps.yyx);
  return normalize(nor);
}

vec3 render3(vec3 ro, vec3 rd) {
  int iter;

  vec3 skyCol = render0(ro, rd);
  vec3 col  = skyCol;

  g_gd      = vec2(1E3);
  float t1  = rayMarch3(ro, rd, 0.1, iter);
  vec2 gd1  = g_gd;
  vec3 p1   = ro+t1*rd;
  vec3 n1   = normal3(p1);
  vec3 r1   = reflect(rd, n1);
  vec3 rr1  = refract(rd, n1, refr_index);
  float fre1= 1.+dot(rd, n1);
  fre1 *= fre1;

  float ifo = mix(0.5, 1., smoothstep(1.0, 0.9, float(iter)/float(MAX_RAY_MARCHES3)));

  if (t1 < MAX_RAY_LENGTH3) {
    col = render0(p1, r1)*(0.5+0.5*fre1)*ifo;
    vec3 icol = render2(p1, rr1, gd1.x); 
    if (gd1.x > TOLERANCE3 && gd1.y > TOLERANCE3 && rr1 != vec3(0.)) {
      col += icol*(1.-0.75*fre1)*ifo;
    }
  }

  col += (glowCol0+1.*fre1*(glowCol0))/max(gd1.x, 3E-4);
  return col;

}

  
vec3 effect(vec2 p, vec2 pp) {
  const float fov = 2.0;
  
  const vec3 up = vec3(0., 1., 0.);
  const vec3 la   = vec3(0.0);

  const vec3 ww = normalize(normalize(la-rayOrigin));
  const vec3 uu = normalize(cross(up, ww));
  const vec3 vv = cross(ww, uu);
  
  vec3 rd = normalize(-p.x*uu + p.y*vv + fov*ww);

  vec3 col = vec3(0.0);
  col = render3(rayOrigin, rd);
  
  col -= 2E-2*vec3(2.,3.,1.)*(length(p)+0.25);
  col = aces_approx(col);
  col = sqrt(col);
  return col;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
  vec2 q = fragCoord/RESOLUTION.xy;
  vec2 p = -1. + 2. * q;
  vec2 pp = p;
  p.x *= RESOLUTION.x/RESOLUTION.y;

  float a = TIME*rotation_speed;
  vec3 r0 = vec3(1.0, sin(vec2(sqrt(0.5), 1.0)*a));
  vec3 r1 = vec3(cos(vec2(sqrt(0.5), 1.0)*0.913*a), 1.0);
  mat3 rot = rot(normalize(r0), normalize(r1));
  g_rot = rot;

  vec3 col = effect(p, pp);
  
  fragColor = vec4(col, 1.0);
}` + fs_shadertoy_postfix

