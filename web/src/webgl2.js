import { LOG, WARNING } from './ogl2030.js'

export function use_program(webgl2, program) {
  webgl2.useProgram(program);
}
export function bind_vertex_array(webgl2, vao) {
  webgl2.bindVertexArray(vao);
}
export function draw_arrays(webgl2, prim, start, count) {
  webgl2.drawArrays(gl.TRIANGLES, start, count); // TODO: prim
}
export function create_webgl2_context(config, canvas) {
  const webgl2 = canvas.getContext('webgl2') // WebGL 2.0 (GLSL ES 3.00 #version 300 es)
  if (!webgl2) {
    panic('You need a browser with WebGL 2.0 support')
    return null
  }
  return {
    open: function(config) {
      return {
        name: 'WebGL 2.0',
        webgl2: webgl2,
        canvas: canvas,
      }
    },
    submit_display_list: function(gl) {
      LOG('display list submit -> WebGL2:', gl_tostring(gl))
      for (const c of gl.cmd) {
        switch(c.cmd) {
          case 'viewport':  viewport(c.rect); break
          case 'clear':     clear(c.color, c.depth, c.stencil); break
          // TODO: program, etc cmds
          default:          WARNING(`unknown command: ${c.cmd}`); break
        }
      }
    }
  }
}
