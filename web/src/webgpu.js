// TODO: wip, inits WebGPU, but falls back to WebGL for now
import { panic } from './util.js'
import { create_webgl2_context } from './webgl2.js';

export async function create_webgpu_context(config, canvas) {
  const adapter = await navigator.gpu?.requestAdapter();
  const device = await adapter?.requestDevice();
  if (!device) { panic('Need a browser that supports WebGPU'); return }
  const webgpu = canvas.getContext('webgpu')
  if (!webgpu) { panic('WebGPU context not supported'); return null }
  const present_format = navigator.gpu.getPreferredCanvasFormat() // "rgba8unorm" | 'bgra8unorm'
  webgpu.configure({ device, format: present_format })
  
  const webgpu_context = {
    name: 'WebGPU',
    webgpu: webgpu,
    adapter: adapter,
    device: device,
    present_format: present_format,
    canvas: canvas,
/*
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
*/
  }

  // TODO: falls back to WebGL, but keeps the initialized WebGPU fields
  const webgl2_context = create_webgl2_context(config, canvas);
  Object.assign(webgpu_context, webgl2_context); // mix WebGPU/WebGL2 objects -> webgpu_context
  return webgpu_context;
}
