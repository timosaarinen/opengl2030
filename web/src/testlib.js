// TODO: auto-generate this file by parsing test_x() functions from './*.js'
import { TESTLOG } from './test.js'
import { test_types } from './type.js'
import { test_display_list } from './g2030.js'
import { test_dom } from './dom.js'
import { test_uuid } from './uuid.js'
import { test_perf } from './perf.js'
//import { test_vectorf } from './vectorf.js' // TODO: move wasm vector ops

export function run_all_tests(runslowtests = true) {
  test_types()
  test_display_list()
  test_dom()
  test_uuid()
  if (runslowtests) { 
    test_perf() 
  }
}
