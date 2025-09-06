const SPECIALS = new Map([
  ['\\', '\\textbackslash{}'],
  ['{', '\\{'],
  ['}', '\\}'],
  ['$', '\\$'],
  ['&', '\\&'],
  ['#', '\\#'],
  ['^', '\\textasciicircum{}'],
  ['_', '\\_'],
  ['%', '\\%'],
  ['~', '\\textasciitilde{}']
])

export function escapeLatex(str) {
  if (str == null) return ''
  let s = String(str)
  
  // Remove any Unicode control characters (including backspace U+0008)
  s = s.replace(/[\u0000-\u001F\u007F-\u009F]/g, '')
  
  // Normalize newlines to LaTeX line breaks for multi-line inputs
  s = s.replace(/\r\n?|\n/g, '\\\\ ')
  
  // Escape LaTeX special characters
  for (const [ch, repl] of SPECIALS) {
    s = s.split(ch).join(repl)
  }
  
  return s
}

export function texLink(url, label) {
  const safeUrl = String(url || '').replace(/[\u0000-\u001F\u007F-\u009F]/g, '')
  const safeLabel = escapeLatex(label || url || '')
  return `\\href{${safeUrl}}{${safeLabel}}`
}
