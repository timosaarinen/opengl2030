//const { performance } = require('perf_hooks') // TODO: for nodejs?
import { LOG } from './log.js'

const PERF_TO_NS = 1e6
const NS_TO_MS = 1e-6
const NS_TO_SECONDS = 1e-9

//------------------------------------------------------------------------
//  Nanosecond performance profiler
//------------------------------------------------------------------------
export function nsprofile(func, times = 1, log = true) {
  return (...args) => {
    const start = performance.now()
    let funcresult
    for (let n=0; n < times; ++n) {
      funcresult = func(...args) // call the function
    }
    const end = performance.now()
    const durationns = (end - start) * PERF_TO_NS
    const averagens = durationns / times
    const averagems = averagens * NS_TO_MS
    const averages  = averagens * NS_TO_SECONDS
    
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
      startns: start * PERF_TO_NS,
      endns: end * PERF_TO_NS
    }
  }
}
//-------------------------------------------------------------------------------------------------
export function test_perf() {
  function sum(n) {
    let sum = 0;
    for (let i = 0; i < n; i++) {
      sum += i;
    }
    return sum;
  }
  const profile_once = nsprofile(sum, 1, true)(1_000_000)
  const profile_100_times = nsprofile(sum, 100, true)(1_000_000)
}
