/* Read-only: dump settings/about valueProps. Run: node scripts/check-about.js */
import { initializeApp } from 'firebase/app'
import { getFirestore, doc, getDoc } from 'firebase/firestore'
import { readFileSync } from 'fs'

const env = Object.fromEntries(
  readFileSync(new URL('../.env', import.meta.url), 'utf8')
    .split('\n').filter(l => l.includes('=') && !l.trim().startsWith('#'))
    .map(l => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim()])
)

const app = initializeApp({
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
})
const db = getFirestore(app)

const snap = await getDoc(doc(db, 'settings', 'about'))
if (snap.exists()) {
  const d = snap.data()
  console.log('settings/about keys:', Object.keys(d).join(', '))
  console.log('valueProps =', JSON.stringify(d.valueProps || null, null, 2))
} else {
  console.log('settings/about: MISSING (static defaults in use)')
}
process.exit(0)
