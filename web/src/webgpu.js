// TODO: wip, inits WebGPU, but falls back to WebGL for now
import { panic } from './util.js'
import { create_webgl2_context } from './webgl2.js'

export async function create_webgpu_context(config, canvas) {
  const adapter = await navigator.gpu?.requestAdapter()
  const device = await adapter?.requestDevice()
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
    // new_program:          (vshader, fshader)      => undefined,
    // new_vertexbuffer:     (data, layout, program) => undefined,
    // new_indexbuffer:      (data)                  => undefined,
    // new_pipe:             (program, vb, ib)       => undefined,
    // submit_display_list:  (displaylist)           => undefined,
  }
  const webgl2_context = create_webgl2_context(config, canvas)
  Object.assign(webgpu_context, webgl2_context) // mix WebGPU/WebGL2 objects -> webgpu_context
  return webgpu_context
}
