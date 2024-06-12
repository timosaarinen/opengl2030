//const { performance } = require('perf_hooks') // TODO: for nodejs?
import { LOG } from './log.js'
import { TESTLOG } from './test.js'

export const TIMEMS_TO_NS      = 1e6
export const TIMENS_SEC        =         1_000_000_000 // nanosecond == one billionth of a second (1e-9)
export const TIMENS_60FPS      =            16_666_666 // 60 frames per second frame duration in nanoseconds, rounded down
export const TIMENS_LATEST     = 9_007_199_254_740_991 // largest exact integer in JS number (TODO: 9,007,199 second soft limit == ~104 days, will lose nanosecond accuracy after that!)
export const TIMENS_TO_MS      = 1e-6
export const TIMENS_TO_SECONDS = 1e-9
//------------------------------------------------------------------------
//  Nanosecond performance profiler
//------------------------------------------------------------------------
export function nstime() {
  return performance.now() * TIMEMS_TO_NS
}
export function nsprofile(func, times = 1, log = true) {
  return (...args) => {
    const start = performance.now() * TIMEMS_TO_NS // milliseconds
    let funcresult
    for (let n=0; n < times; ++n) {
      funcresult = func(...args) // call the function
    }
    const end = performance.now() * TIMEMS_TO_NS
    const durationns = end - start
    const averagens = durationns / times
    const averagems = averagens * TIMENS_TO_MS
    const averages  = averagens * TIMENS_TO_SECONDS
    
    if (log) {
      LOG(`---- Function x${times} performance ----`)
      LOG(`Function:        ${func.toString()}`) // TODO: limit if too long, '...' at the end
      //LOG(`Function result: ${funcresult}`)
      LOG(`Start Time (ns): ${start}`)
      LOG(`End Time (ns):   ${end}`)
      LOG(`Total time (ns): ${durationns}`)
      LOG(`Average (ns):    ${averagens}`)
      LOG(`Average (ms):    ${averagems}`)
      LOG(`Average (s):     ${averages}`)
    }    
    return {
      funcresult,
      durationns,
      startns:      start,
      endns:        end,
    }
  }
}
//-------------------------------------------------------------------------------------------------
// TEST:
//-------------------------------------------------------------------------------------------------
export function test_time() {
  function sum(n) {
    let sum = 0;
    for (let i = 0; i < n; i++) {
      sum += i;
    }
    return sum;
  }
  TESTLOG(`nstime() ${nstime()}`)
  const profile_once = nsprofile(sum, 1, true)(1_000_000)
  const profile_100_times = nsprofile(sum, 100, true)(1_000_000)
}
