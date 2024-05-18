//------------------------------------------------------------------------
// backend: null rendering device
//------------------------------------------------------------------------
export function create_null_device(config, canvas) {
  return {
    open: function(config) {
      return {
        name: 'null device',
        canvas: canvas,
      }
    },
    submit_display_list: function(gl) {
      if (config.debug) console.log('display list submit:', gl_tostring(gl)) // TODO: use console.log here?
      // TODO: simulate commands?
    }
  }
}
