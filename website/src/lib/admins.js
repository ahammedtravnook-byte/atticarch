/**
 * Admin allowlist.
 *
 * Source of truth is the Firestore document `settings/admins` → { emails: [...] }.
 * A bootstrap list from VITE_ADMIN_EMAILS (comma-separated) is ALWAYS merged in,
 * so the very first admin can sign in before the doc exists, and you can never
 * lock yourself out by removing the last entry from the UI.
 *
 * NOTE: this is the client-side gate (UX only). The real enforcement lives in
 * firestore.rules — keep the bootstrap email there in sync with VITE_ADMIN_EMAILS.
 */
import { db, doc, getDoc, setDoc, arrayUnion, arrayRemove } from './firebase'

const ADMINS_DOC = ['settings', 'admins']

export const BOOTSTRAP_ADMINS = (import.meta.env.VITE_ADMIN_EMAILS || '')
  .split(',')
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean)

const norm = (e) => (e || '').trim().toLowerCase()

/** Read the full admin email list (Firestore + bootstrap), de-duplicated. */
export async function fetchAdminEmails() {
  let fromDb = []
  try {
    const snap = await getDoc(doc(db, ...ADMINS_DOC))
    if (snap.exists() && Array.isArray(snap.data().emails)) {
      fromDb = snap.data().emails.map(norm)
    }
  } catch {
    // Permission/network error — fall back to bootstrap only.
  }
  return Array.from(new Set([...BOOTSTRAP_ADMINS, ...fromDb]))
}

/** Is this email allowed admin access? */
export function isAllowedAdmin(email, list) {
  return !!email && list.includes(norm(email))
}

/** Add an email to the Firestore allowlist (creates the doc if missing). */
export async function addAdminEmail(email) {
  await setDoc(
    doc(db, ...ADMINS_DOC),
    { emails: arrayUnion(norm(email)) },
    { merge: true }
  )
}

/** Remove an email from the Firestore allowlist. */
export async function removeAdminEmail(email) {
  await setDoc(
    doc(db, ...ADMINS_DOC),
    { emails: arrayRemove(norm(email)) },
    { merge: true }
  )
}
