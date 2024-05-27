import { safe_stringify } from './util.js'

export let log_enable_all = false
export let log_group_enabled = {}
export const LOG = (...args) => { console.log(...args) }
export const LOGG = (loggroup, ...args) => { if (log_enable_all || log_group_enabled[loggroup]) { console.log(...args) } }
export const LOGGO = (loggroup, caption, o) => { LOGG(loggroup, `${caption} ${safe_stringify(o)}`); return o; }
export function log_clearall() { log_enable_all = false; log_group_enabled = {} }
export function log_enableall() { log_enable_all = true }
export function log_enablegroup(loggroup) { log_group_enabled[loggroup] = true }
export function log_enablegroups(log_groups_array) {
  if (log_groups_array === 'all') { log_enableall(true) } else
  if (log_groups_array === 'none') { log_clearall() } else { 
    for (const group of log_groups_array) { log_enablegroup(group, true) }
  }
}
