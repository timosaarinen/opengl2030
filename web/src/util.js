export let force_single_threaded = false // for debugging, can force single-threadex (TODO: WebWorkers..)

export const vw      = () => (window.innerWidth)
export const vh      = () => (window.innerHeight)
export const fmt     = (str) => str;
export const WARNING = (...args) => console.error(...args)
export const panic   = (...args) => { throw new Error(...args) }
export const ASSERT  = (mustbetrue) => mustbetrue ? undefined : panic(JSON.stringify(mustbetrue))

// TODO:
export function arrpush(arr, e) {
  const n = arr.length
  arr.push(e)
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
    panic('Error stringifying object:', e)
  }
}