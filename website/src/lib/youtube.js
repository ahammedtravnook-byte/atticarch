/**
 * Extract a YouTube video ID from any common link form (or a raw ID):
 *   https://www.youtube.com/watch?v=ID
 *   https://youtu.be/ID
 *   https://www.youtube.com/embed/ID
 *   https://www.youtube.com/shorts/ID
 *   ID  (11 chars)
 * Returns '' if nothing usable is found.
 */
export function parseYouTubeId(input) {
  if (!input) return ''
  const s = String(input).trim()
  if (/^[\w-]{11}$/.test(s)) return s // already an ID
  try {
    const u = new URL(s.startsWith('http') ? s : `https://${s}`)
    if (u.hostname.includes('youtu.be')) return u.pathname.split('/').filter(Boolean)[0] || ''
    const v = u.searchParams.get('v')
    if (v) return v
    const parts = u.pathname.split('/').filter(Boolean)
    const i = parts.findIndex((p) => ['embed', 'shorts', 'v'].includes(p))
    if (i >= 0 && parts[i + 1]) return parts[i + 1]
    return parts[parts.length - 1] || ''
  } catch {
    return ''
  }
}

/** YouTube thumbnail URL for a video id. */
export function youTubeThumb(id, quality = 'mqdefault') {
  return id ? `https://img.youtube.com/vi/${id}/${quality}.jpg` : ''
}
