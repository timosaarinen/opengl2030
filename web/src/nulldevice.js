export function create_nulldevice_context(config, canvas) {
  return {
    name:                 'null device',
    canvas:               canvas,
    submit_display_list:  function(gl) {
      if (config.debug) console.log('display list submit:', gl_tostring(gl)) // TODO: use console.log here?
      // TODO: simulate commands?
    }
  }
}
