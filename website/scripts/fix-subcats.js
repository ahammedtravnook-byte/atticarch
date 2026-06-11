/* One-off: repair subcategory data.
   - apartments: restore BHK chips (the rename to Villas/Apartments broke the
     slugs; project assetz-marq is tagged 2-bhk and matched nothing)
   - residential: Apartments/Villas chips (match via project category)
   Run: node scripts/fix-subcats.js */
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

const updates = {
  apartments: [
    { title: '2 BHK', short: '2 BHK', slug: '2-bhk' },
    { title: '3 BHK', short: '3 BHK', slug: '3-bhk' },
    { title: '4 BHK', short: '4 BHK', slug: '4-bhk' },
  ],
  residential: [
    { title: 'Apartments', short: 'Apartments', slug: 'apartments' },
    { title: 'Villas', short: 'Villas', slug: 'villas' },
  ],
}

for (const [id, subcategories] of Object.entries(updates)) {
  const ref = doc(db, 'categories', id)
  const cur = (await getDoc(ref)).data() || {}
  await setDoc(ref, { ...cur, subcategories })
  console.log(`categories/${id} subcategories =`, subcategories.map(s => s.slug).join(', '))
}
console.log('DONE')
process.exit(0)
