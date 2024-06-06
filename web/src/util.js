export let force_single_threaded = false // TODO: WebWorkers + job system.. for debugging, can force single-threaded
export const WARNING = (...args) => console.error(...args)
export const panic   = (...args) => { throw new Error(...args) }
export const ASSERT  = (mustbetrue)      => mustbetrue ? undefined : panic('assertion failed')
export const ASSERTM = (msg, mustbetrue) => mustbetrue ? undefined : panic('assertion failed: ' + JSON.stringify(msg))
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
//------------------------------------------------------------------------
//  HTML functions
//------------------------------------------------------------------------
export function md2html(s) { // "Markdown" -> HTML
  s = s.replace(/^# (.*?)(\n|$)/gm, '<h1>$1</h1>\n'); // # Header1 -> <h1>..</h1>
  s = s.replace(/^## (.*?)(\n|$)/gm, '<h2>$1</h2>\n'); // ## Header2 -> <h2>..</h2>
  s = s.replace(/\n/g, '<br>'); // newlines 
  s = s.replace(/\_([^_]+)\_/g, '<i>$1</i>'); // _italic_ -> <i>italic</i>
  s = s.replace(/\*([^*]+)\*/g, '<b font>$1</b>'); // *bold* -> <b>bold</b>
  s = s.replace(/(\w)\^(\w+)/g, '$1<sup>$2</sup>'); // Convert superscript x^2 -> x<sup>2</sup>
  s = s.replace(/ {2,}/g, match => '&nbsp;'.repeat(match.length)); // 2+ spaces
  return s;
}
