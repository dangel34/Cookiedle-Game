export function sanitizeInput(str, maxLen = 100) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/[^\x20-\x7E\u00A0-\u024F]/g, '')
    .trim()
    .slice(0, maxLen);
}
