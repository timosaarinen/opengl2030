export let force_single_threaded = false // TODO: WebWorkers + job system.. for debugging, can force single-threaded
export const WARNING = (...args) => console.error(...args)
export const panic   = (...args) => { throw new Error(...args) }
export const ASSERT  = (mustbetrue)      => mustbetrue ? undefined : panic('assertion failed')
export const ASSERTM = (mustbetrue, msg) => (typeof msg !== 'string') ? panic('put the message second in ASSERTM(boolean, string)') : (mustbetrue ? undefined : panic('assertion failed: ' + JSON.stringify(msg)))
export const arr_without = (arr, wo) => arr.filter( e => e !== wo )
export const timeout_promise = (ms) => new Promise(resolve => setTimeout(resolve, ms))
export const sleep_ms = async (ms) => await( timeout_promise(ms) )
//------------------------------------------------------------------------
//  String utils
//------------------------------------------------------------------------
export const fmtdecim = (f, n) => f.toFixed(n) // @example: fmtdecim(1.23456789, 2) == '1.23'

export function safe_stringify(obj, indent) {
  //return safe_stringify2(obj, indent) // TODO: currently this function takes 80% of script time.. find a way to avoid calling if logs are not enabled
  try { return JSON.stringify(obj, indent) }
  catch { return "<circular references>"; }
}

export function safe_stringify2(obj, indent = 2) {
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
    panic('Error stringifying object:', e)
  }
}
export function fmt(...args) {
  return args.map(arg => {
    if (arg === null) {
      return 'null';
    } else if (typeof arg === 'object') {
      return safe_stringify(arg);
    } else if (typeof arg === 'undefined') {
      return 'undefined';
    } else {
      return arg.toString();
    }
  }).join(' ');
}
