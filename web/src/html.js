export const ebyid = (id) => document.getElementById(id)

// TODO: support markdown?
export const tohtml = (str) => {
  // Replace special HTML characters with their respective HTML entities
  const escapeHtml = (unsafe) => {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;")
  }
  // Escape HTML characters and replace newlines with <br> tags
  return escapeHtml(str).replace(/\n/g, '<br>')
}
export function etext(id, text) {
  const e = ebyid(id)
  if (e) e.innerHTML += tohtml(s)
}
export function create_canvas() {
  const canvas = document.createElement('canvas')
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  return canvas
}