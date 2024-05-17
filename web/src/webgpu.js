import { LOG, WARNING, panic } from './ogl2030.js'

export async function create_webgpu_context(config, canvas) {
  const adapter = await navigator.gpu?.requestAdapter();
  const device = await adapter?.requestDevice();
  if (!device) { panic('Need a browser that supports WebGPU'); return }
  const webgpu = canvas.getContext('webgpu')
  if (!webgpu) { panic('WebGPU context not supported'); return null }
  const present_format = navigator.gpu.getPreferredCanvasFormat() // "rgba8unorm" | 'bgra8unorm'
  webgpu.configure({ device, format: present_format })
  return {
    open: function(config) {
      return {
        name: 'WebGL 2.0',
        webgpu: webgpu,
        adapter: adapter,
        device: device,
        present_format: present_format,
        canvas: canvas,
      }
    },
    submit_display_list: function(gl) {
      LOG('display list submit -> WebGL2:', gl_tostring(gl))
      for (const c of gl.cmd) {
        switch(c.cmd) {
          case 'viewport':  viewport(c.rect); break
          case 'clear':     clear(c.color, c.depth, c.stencil); break
          // TODO: cmds
          default:          WARNING(`unknown command: ${c.cmd}`); break
        }
      }
    }
  }
}
