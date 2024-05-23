import { LOGG } from './log.js'

export function create_nulldevice_context(config, canvas) {
  return {
    name:                 'null device',
    canvas:               canvas,
    submit_display_list:  function(gl) { LOGG( 'backend', 'display list submit:', gl_tostring(gl) ) }
  }
}
