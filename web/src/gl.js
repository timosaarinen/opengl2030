const cmd = (gl, name, data) => gl.cmd.push({ cmd: name, ...data })

export const gl_viewport = (gl, rect) => cmd(gl, 'viewport', { rect })
export const gl_clear = (gl, color, depth, stencil) => cmd(gl, 'clear', { color, depth, stencil })
export const gl_update_buffer = (gl, buffer, data) => cmd(gl, 'update_buffer', { data })
export const gl_draw_renderable = (gl, renderable) => cmd(gl, 'draw_renderable', { renderable })
export const gl_tojson = (gl) => gl.cmd
export const gl_tostring = (gl) => {
  let s = ""
  for (const c of gl.cmd) {
    switch (c.cmd) {
      case 'viewport':
        s += `Viewport: x=${c.rect.x}, y=${c.rect.y}, width=${c.rect.width}, height=${c.rect.height}\n`
        break
      case 'clear':
        s += `Clear: color=${c.color}, depth=${c.depth}, stencil=${c.stencil}\n`
        break
      case 'renderable':
        s += `Renderable: ${JSON.stringify(c.renderable)}\n`
        break
      default:
        s += `WARNING: unknown command: ${c.cmd}\n`
        break
    }
  }
  return s
}