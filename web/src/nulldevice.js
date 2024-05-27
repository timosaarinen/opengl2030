import { LOGG } from './log.js'

export async function create_nulldevice_context(config, canvas) {
  return {
    name:                 'null device',
    canvas:               canvas,
    submit_display_list:  function(gl) { LOGG( 'nulldevice', 'display list submit:', gl_tostring(gl) ) }
  }
}
