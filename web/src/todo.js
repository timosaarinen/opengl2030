// !! This file is not included, used for possible todo notes and random copy-paste !!
export const box = (left, top, front, right, bottom, back)=>({ type: 'box', left, top, front, right, bottom, back }) // TODO: useful?

time: vec4() // .x = t, .y = t^2, .z = t^3, .w = t^4

//export const vw      = () => (window.innerWidth) // TODO: useful? remove? ref?
//export const vh      = () => (window.innerHeight)

// clear active WebGL context (TODO: allow pushing commands outside renderframe()?)
const clear = (rs) => {
  gl_clear( rs.gl, vec4(0) );
}
g_add_render(ctx.g, clear)
await g_wait_nframes(4)
g_remove_render(ctx.g, clear)
