/* One-off: replace the landing hero bullets (old ones said "Free 3D...") with
   the new points, via the same settings/landingpage doc the admin save uses.
   Run: node scripts/update-landing-bullets.js */
import { initializeApp } from 'firebase/app'
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore'
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

const ref = doc(db, 'settings', 'landingpage')
const cur = (await getDoc(ref)).data() || {}
console.log('old bullets =', JSON.stringify(cur.bullets || null))
const bullets = [
  '10-Year Workmanship Warranty',
  'Our own in-house production unit',
  'On-time handover, since 2002',
]
await setDoc(ref, { ...cur, bullets })
console.log('new bullets =', JSON.stringify(bullets))
process.exit(0)
