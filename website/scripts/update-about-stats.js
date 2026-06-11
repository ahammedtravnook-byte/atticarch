/* One-off: sync settings/about.valueProps with the new code defaults
   (remove "Turnkey", price reads "From ₹10 Lakhs"). Run: node scripts/update-about-stats.js */
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

const ref = doc(db, 'settings', 'about')
const cur = (await getDoc(ref)).data() || {}
const valueProps = [
  { value: 'Est. 2002', label: 'Bangalore Studio' },
  { value: '10-Year', label: 'Workmanship Warranty' },
  { value: 'In-House', label: 'Production Unit' },
  { value: 'From ₹10 Lakhs', label: 'Bespoke Interiors' },
]
await setDoc(ref, { ...cur, valueProps })
console.log('settings/about.valueProps updated')
process.exit(0)
