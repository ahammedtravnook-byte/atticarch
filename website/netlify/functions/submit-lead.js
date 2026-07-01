// ════════════════════════════════════════════════════════════════════
//  ATTICARCH — Lead intake serverless function (Netlify)
//
//  Single, guarded write-path for every contact / landing-page lead:
//    1. Honeypot check       → silently drop bots
//    2. Basic validation     → name + 10-digit phone required
//    3. IP rate limiting     → max N submissions per IP per window (Firestore)
//    4. Write via Admin SDK  → bypasses Firestore rules, so client writes can
//                              be locked off entirely (see firestore.rules)
//    5. Email notification   → send the lead to the sales inbox (Resend)
//
//  Required Netlify environment variables:
//    FIREBASE_SERVICE_ACCOUNT  – the service-account JSON (raw or base64)
//  Optional:
//    RESEND_API_KEY            – enables the email notification to sales
//    LEAD_TO_EMAIL             – recipient (default atticarchwebsite@gmail.com)
//    LEAD_FROM_EMAIL           – sender (default onboarding@resend.dev)
//    LEAD_RATE_MAX             – submissions per window (default 5)
//    LEAD_RATE_WINDOW_MS       – window length in ms (default 3600000 = 1h)
//
//  The CAPTCHA is handled client-side (see src/components/Captcha.jsx). This
//  function's server-side guards are the honeypot + IP rate limit.
// ════════════════════════════════════════════════════════════════════
import admin from 'firebase-admin'

let dbInstance = null
function getDb() {
  if (dbInstance) return dbInstance
  if (!admin.apps.length) {
    const raw = process.env.FIREBASE_SERVICE_ACCOUNT
    if (!raw) throw new Error('missing-service-account')
    // Accept either the raw JSON or a base64-encoded blob (base64 avoids any
    // newline-mangling when pasting the key into the Netlify env-var UI).
    const jsonStr = raw.trim().startsWith('{')
      ? raw
      : Buffer.from(raw, 'base64').toString('utf8')
    const creds = JSON.parse(jsonStr)
    // Restore real newlines if the private key came through with literal "\n".
    if (creds.private_key) creds.private_key = creds.private_key.replace(/\\n/g, '\n')
    admin.initializeApp({ credential: admin.credential.cert(creds) })
  }
  dbInstance = admin.firestore()
  return dbInstance
}

const RATE_MAX = parseInt(process.env.LEAD_RATE_MAX || '5', 10)
const RATE_WINDOW_MS = parseInt(process.env.LEAD_RATE_WINDOW_MS || `${60 * 60 * 1000}`, 10)
const ALLOWED_SOURCES = ['contact-page', 'landing-page', 'website']

const RESEND_API_KEY = process.env.RESEND_API_KEY || ''
// Default recipient is the Resend account inbox (works on the free tier with no
// domain verification). Once atticarch.com is verified in Resend, set
// LEAD_TO_EMAIL=sales@atticarch.com and LEAD_FROM_EMAIL=leads@atticarch.com.
const LEAD_TO_EMAIL = process.env.LEAD_TO_EMAIL || 'atticarchwebsite@gmail.com'
const LEAD_FROM_EMAIL = process.env.LEAD_FROM_EMAIL || 'ATTICARCH Leads <onboarding@resend.dev>'

function json(statusCode, obj) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(obj),
  }
}

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

// Fire the lead to the sales inbox via Resend. Best-effort — never blocks the
// lead write, and silently no-ops if RESEND_API_KEY isn't configured.
async function sendLeadEmail(lead) {
  if (!RESEND_API_KEY) return
  const rows = [
    ['Name', lead.name],
    ['Phone', `+91 ${lead.phone}`],
    ['Email', lead.email || '—'],
    ['Property Type', lead.projectType || '—'],
    ['Size (sq.ft)', lead.size || '—'],
    ['Possession', lead.possession || '—'],
    ['Location', lead.location || '—'],
    ['Budget', lead.budget || '—'],
    ['Message', lead.message || '—'],
    ['Source', lead.source],
  ]
  const html = `<div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto">
    <h2 style="color:#3c2e16;border-bottom:2px solid #c9a96e;padding-bottom:8px">New Consultation Lead — ATTICARCH</h2>
    <table style="border-collapse:collapse;width:100%;font-size:14px">
      ${rows.map(([k, v]) => `<tr>
        <td style="padding:9px 12px;border:1px solid #e7e0d2;background:#faf7f0;font-weight:bold;width:150px;vertical-align:top">${esc(k)}</td>
        <td style="padding:9px 12px;border:1px solid #e7e0d2">${esc(v)}</td>
      </tr>`).join('')}
    </table>
    <p style="color:#8a7a5a;font-size:12px;margin-top:16px">Received ${esc(lead.createdAt)} · IP ${esc(lead.ip)}</p>
  </div>`

  const payload = {
    from: LEAD_FROM_EMAIL,
    to: [LEAD_TO_EMAIL],
    subject: `New Lead: ${lead.name} — ${lead.projectType || 'Enquiry'} (+91 ${lead.phone})`,
    html,
  }
  if (lead.email) payload.reply_to = lead.email

  const resp = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!resp.ok) {
    const t = await resp.text().catch(() => '')
    console.error('email send failed:', resp.status, t)
  }
}

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') return json(405, { ok: false, error: 'Method not allowed' })

  let payload
  try {
    payload = JSON.parse(event.body || '{}')
  } catch {
    return json(400, { ok: false, error: 'Bad request', code: 'bad-json' })
  }

  // 1. Honeypot — a hidden field no human fills. If present, pretend success.
  if (payload.company && String(payload.company).trim()) {
    return json(200, { ok: true })
  }

  const headers = event.headers || {}
  const ip =
    headers['x-nf-client-connection-ip'] ||
    (headers['x-forwarded-for'] || '').split(',')[0].trim() ||
    'unknown'

  // 2. Validation
  const name = String(payload.name || '').trim()
  const phone = String(payload.phone || '').replace(/\D/g, '')
  if (name.length < 2 || name.length > 200) {
    return json(400, { ok: false, error: 'Please enter your name.', code: 'invalid-name' })
  }
  if (phone.length !== 10) {
    return json(400, { ok: false, error: 'Enter a valid 10-digit mobile number.', code: 'invalid-phone' })
  }

  let db
  try {
    db = getDb()
  } catch {
    return json(500, { ok: false, error: 'Server not configured.', code: 'no-admin' })
  }

  // 3. IP rate limiting (atomic via a Firestore transaction)
  const ipKey = (ip.replace(/[^a-zA-Z0-9]/g, '_') || 'unknown').slice(0, 200)
  const rlRef = db.collection('rateLimits').doc(ipKey)
  try {
    const allowed = await db.runTransaction(async (tx) => {
      const snap = await tx.get(rlRef)
      const now = Date.now()
      let count = 0
      let windowStart = now
      if (snap.exists) {
        const d = snap.data()
        if (now - (d.windowStart || 0) < RATE_WINDOW_MS) {
          count = d.count || 0
          windowStart = d.windowStart
        }
      }
      if (count >= RATE_MAX) return false
      tx.set(rlRef, { count: count + 1, windowStart, ip, updatedAt: now }, { merge: true })
      return true
    })
    if (!allowed) {
      return json(429, {
        ok: false,
        error: 'Too many submissions from your network. Please try again later or call us directly.',
        code: 'rate-limited',
      })
    }
  } catch (e) {
    // Never lose a real lead over a rate-limit store hiccup — log and continue.
    console.error('rate-limit error:', e)
  }

  // 4. Write the lead (Admin SDK bypasses Firestore rules)
  const source = ALLOWED_SOURCES.includes(payload.source) ? payload.source : 'website'
  const leadId = `lead_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
  const lead = {
    id: leadId,
    name,
    email: String(payload.email || '').trim().slice(0, 200),
    phone,
    projectType: String(payload.projectType || '').slice(0, 100),
    size: String(payload.size || '').slice(0, 100),
    possession: String(payload.possession || '').slice(0, 100),
    location: String(payload.location || '').slice(0, 300),
    budget: String(payload.budget || '').slice(0, 100),
    message: String(payload.message || '').slice(0, 5000),
    verified: false,
    source,
    ip,
    createdAt: new Date().toISOString(),
  }
  try {
    await db.collection('leads').doc(leadId).set(lead)
  } catch (e) {
    console.error('lead write error:', e)
    return json(500, { ok: false, error: 'Failed to save. Please try again or call us.', code: 'write-failed' })
  }

  // 5. Email the sales inbox (best-effort — never fails the request)
  try {
    await sendLeadEmail(lead)
  } catch (e) {
    console.error('email error:', e)
  }

  return json(200, { ok: true, id: leadId })
}
