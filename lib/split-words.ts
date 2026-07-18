// lib/split-words.ts
// Split text into words for per-word reveal. Uses Intl.Segmenter when available
// (correct for Indonesian/English), falls back to whitespace split.
export function splitWords(text: string): string[] {
  const t = text.trim()
  if (!t) return []
  if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    const seg = new Intl.Segmenter('id', { granularity: 'word' })
    return [...seg.segment(t)].map((s) => s.segment).filter((s) => s.trim().length > 0)
  }
  return t.split(/\s+/).filter(Boolean)
}
