import { panic } from './util.js'
import { TODO, log_print_md } from './log.js'

export async function create_webgpu_context(config, canvas) {
  const adapter = await navigator.gpu?.requestAdapter()
  const device = await adapter?.requestDevice()
  if (!device) { panic('Need a browser that supports WebGPU'); return }
  const webgpu = canvas.getContext('webgpu')
  if (!webgpu) { panic('WebGPU context not supported'); return null }
  const present_format = navigator.gpu.getPreferredCanvasFormat() // "rgba8unorm" | 'bgra8unorm'
  webgpu.configure({ device, format: present_format })

  log_print_md('# next-gen WebGPU.. _initialization_!\n') // DEBUG: TODO:

  return {
    name: 'WebGPU',
    webgpu: webgpu,
    adapter: adapter,
    device: device,
    present_format: present_format,
    canvas: canvas,
    new_program: (vshader, fshader)               => TODO('WebGPU new_program()'),
    new_vertexbuffer: (g, data, layout, program)  => TODO('WebGPU new_vertexbuffer()'),
    new_indexbuffer: (g, data)                    => TODO('WebGPU new_buffer()'),
    new_pipe: (g, program, vb, ib)                => TODO('WebGPU new_pipe()'),
    submit_display_list: (displaylist)            => TODO('WebGPU submit_display_list()'),
  }
}
