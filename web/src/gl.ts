import { arrpush, fmt } from './util.js';
//------------------------------------------------------------------------
// 'gl': Graphics List / Display List / Command Buffer
//------------------------------------------------------------------------
export const gl_viewport        = (gl, rect) => { gl.cmd.push({ cmd: 'viewport', rect: rect }) };
export const gl_clear           = (gl, color_vec4, depth, stencil) => { gl.cmd.push({ cmd: 'clear', color: color_vec4, depth: depth, stencil: stencil }) }; // color/depth/stencil can be undefined for no-clear (in WebGL: gl.COLOR_BUFFER_BIT/DEPTH_BUFFER_BIT/STENCIL_BUFFER_BIT)
export const gl_draw_renderable = (gl, renderable) => { gl.cmd.push({ cmd: 'renderable', renderable: renderable }) };

export function gl_tostring(gl) {
  let s = "";
  for (const c of gl.cmd) {
    switch(c.cmd) {
      case 'viewport':  s += fmt(`[${gl.name}] viewport x ${c.rect.x} y ${c.rect.y} width ${c.rect.width} height ${c.rect.height}`); break;
      case 'clear':     s += fmt(`[${gl.name}] clear color ${c.color} depth ${c.depth} stencil ${c.stencil}`); break;
      default:          s += fmt(`[${gl.name}] WARNING: unknown command: ${c.cmd}`); break;
    }
    s += '\n';
  }
  return s
}
export function gl_tojson(gl) { // example usage: JSON.stringify( gl_tojson(gl) )
  let o = [];
  for (const c of gl.cmd) {
    switch(c.cmd) {
      case 'viewport':  arrpush(o, `[${gl.name}] viewport x ${c.rect.x} y ${c.rect.y} width ${c.rect.width} height ${c.rect.height}`); break;
      case 'clear':     arrpush(o, `[${gl.name}] clear color ${c.color} depth ${c.depth} stencil ${c.stencil}`); break;
      default:          arrpush(o, `[${gl.name}] WARNING: unknown command: ${c.cmd}`); break;
    }
  }
  return o
}