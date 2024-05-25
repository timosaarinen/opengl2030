import { g_open, g_add_render, g_run_render_loop } from '/src/ogl2030.js';
    import { gl_viewport, gl_clear } from '/src/gl.js'
    import { vec4, rect, sin, cos, TWOPI } from '/src/vecmath.js'
    import { debug_open } from '/src/debug.js'
    import { log_enablegroups } from '/src/log.js'

    document.addEventListener('DOMContentLoaded', main)

    async function main() {
      const container = document.getElementById('canvas-container')
      const g = await g_open({ backend: 'webgl2', parent: container })
      const debug = debug_open( g )
      log_enablegroups( ['resize'] )
      g_add_render( g, (rs) => {
        const trisize = 0.69
        gl_viewport   ( rs.gl, rect(0, 0, rs.w, rs.h) )
        gl_clear      ( rs.gl, vec4(0.03, 0.01, 0.51, 1.0), 1.0 )
        debug.imageshader( rs.gl )
        debug.triangle( rs.gl, trisize * cos(rs.time)               / rs.aspect, trisize * sin(rs.time),
                               trisize * cos(rs.time + 1/3.0*TWOPI) / rs.aspect, trisize * sin(rs.time + 1/3.0*TWOPI),
                               trisize * cos(rs.time + 2/3.0*TWOPI) / rs.aspect, trisize * sin(rs.time + 2/3.0*TWOPI) )
      })
      g_run_render_loop( g )
    }