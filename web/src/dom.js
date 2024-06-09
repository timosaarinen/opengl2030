export function escapehtml(s) {
  return s.replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
          .replace(/'/g, "&#039;")
          .replace(/\n/g, '<br>')
}
export function md2html(s) { // "Markdown" -> HTML
  return s.replace(/^# (.*?)(\n|$)/gm, '<h1>$1</h1>\n') // # Header1 -> <h1>..</h1>
          .replace(/^## (.*?)(\n|$)/gm, '<h2>$1</h2>\n') // ## Header2 -> <h2>..</h2>
          .replace(/\n/g, '<br>') // newlines
          .replace(/\_([^_]+)\_/g, '<i>$1</i>') // _italic_ -> <i>italic</i>
          .replace(/\*([^*]+)\*/g, '<b>$1</b>') // *bold* -> <b>bold</b>
          .replace(/(\w)\^(\w+)/g, '$1<sup>$2</sup>') // Convert superscript x^2 -> x<sup>2</sup>
          .replace(/ {2,}/g, match => '&nbsp;'.repeat(match.length)) // 2+ spaces
}
//-------------------------------------------------------------------------------------------------
export function domappendtext(id, text) {
  const e = document.getElementById(id)
  if (e) e.textContent += text
}
export function domcanvas() {
  const canvas = document.createElement('canvas')
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  return canvas
}
//-------------------------------------------------------------------------------------------------
import { TESTLOG } from './test.js'

export function test_dom() {
  TESTLOG(`escapehtml('<\n>"')) =>`,
           escapehtml('<\n>"'))
  TESTLOG(`md2html('# Markdowny\n*Lorem* _lipsumlapsum_^2') =>`,
           md2html('# Markdowny\n*Lorem* _lipsumlapsum_^2'))
}
