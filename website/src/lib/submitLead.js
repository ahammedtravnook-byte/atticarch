import { db, doc, setDoc } from './firebase'

// ────────────────────────────────────────────────────────────────────
//  Client-side lead submission.
//
//  Primary path  → POST to the Netlify function (honeypot + IP rate-limit +
//                  server write + email to sales). This is the guarded path.
//  Fallback path → if the function is unreachable (not yet deployed / network
//                  error / 5xx), write straight to Firestore so no lead is lost
//                  during the rollout window. Once firestore.rules locks client
//                  creates, this fallback simply fails (expected).
//
//  Explicit rejections (rate-limited / invalid) are thrown so the UI can show
//  the right message — they are NOT retried via the fallback.
// ────────────────────────────────────────────────────────────────────

const ENDPOINT = '/.netlify/functions/submit-lead'

async function directWrite(payload) {
  // Note: turnstileToken + company (honeypot) are intentionally NOT written.
  const leadId = `lead_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
  await setDoc(doc(db, 'leads', leadId), {
    id: leadId,
    name: (payload.name || '').trim(),
    email: (payload.email || '').trim(),
    phone: (payload.phone || '').replace(/\D/g, ''),
    projectType: payload.projectType || '',
    size: payload.size || '',
    possession: payload.possession || '',
    location: payload.location || '',
    budget: payload.budget || '',
    message: payload.message || '',
    verified: false,
    source: payload.source || 'website',
    createdAt: new Date().toISOString(),
  })
  return { ok: true, via: 'fallback' }
}

export async function submitLead(payload) {
  // Honeypot filled → silently succeed without doing anything.
  if (payload.company && String(payload.company).trim()) {
    return { ok: true, via: 'honeypot' }
  }

  let res
  try {
    res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
  } catch {
    // Network error — function unreachable → fallback.
    return directWrite(payload)
  }

  if (res.ok) return { ok: true, via: 'function' }

  let data = {}
  try {
    data = await res.json()
  } catch {
    /* ignore */
  }

  if (res.status === 429) {
    const e = new Error(data.error || 'Too many submissions. Please try again later.')
    e.code = 'rate-limited'
    throw e
  }
  if (res.status === 400) {
    const e = new Error(data.error || 'Invalid submission.')
    e.code = data.code || 'invalid'
    throw e
  }

  // 404 / 5xx → function not deployed or misconfigured → fallback.
  return directWrite(payload)
}
