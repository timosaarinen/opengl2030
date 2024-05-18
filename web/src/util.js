// TODO: keep in context object?
export let disable_logging = false // set by config or ogl_enable_log(true | false)
export let force_single_threaded = false // for debugging, can force single-threaded (TODO: WebWorkers..)

export const vw      = () => (window.innerWidth)
export const vh      = () => (window.innerHeight)
export const fmt     = (str) => str;
export const LOG     = (...args) => disable_logging ?? console.log(...args) // TODO: proper logging groups
export const TESTLOG = (...args) => { const s = fmt(...args); console.log(s); etext('testlog', s); }
export const WARNING = (...args) => console.error(...args)
export const panic   = (...args) => { throw new Error(...args) }
export const assert  = (mustbetrue) => mustbetrue ? undefined : panic(JSON.stringify(mustbetrue))

// TODO:
export function arrpush(arr, e) {
  const n = arr.length
  arr.push(e);
  return n
}

