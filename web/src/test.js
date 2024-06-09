import { fmt } from './util.js'
import { domappendtext } from './dom.js'

export const TESTLOG = (...args) => { const s = fmt(...args); console.log(s); domappendtext('testlog', s) } // also print to 'testlog' DOM element
