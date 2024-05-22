// TODO: keep in context object?
export let disable_logging = false // set by config or g_enable_log(true | false)
export let force_single_threaded = false // for debugging, can force single-threadex (TODO: WebWorkers..)

export const vw      = () => (window.innerWidth)
export const vh      = () => (window.innerHeight)
export const fmt     = (str) => str;
//export const LOG     = (...args) => console.log(...args)
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
export function safe_stringify(obj, indent = 2) {
  let result
  try {
    const cache = new Set()
    const result = JSON.stringify(obj, (key, value) => {
      if (typeof value === 'object' && value !== null) {
        if (cache.has(value)) {
          return '[Circular]'
        }
        cache.add(value)
      }
      return value
    }, indent)
    cache.clear()
    return result
  } catch (e) {
    panic('Error stringifying object:', e);
  }
}