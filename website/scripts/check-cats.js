/* Read-only: dump categories + their subcategories + projects' category/subcategory.
   Run: node scripts/check-cats.js */
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, getDocs } from 'firebase/firestore'
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

const cats = await getDocs(collection(db, 'categories'))
console.log('--- categories (' + cats.size + ') ---')
cats.forEach(d => {
  const c = d.data()
  console.log(`[${d.id}] slug=${c.slug} filter=${JSON.stringify(c.filter)} subcats=${JSON.stringify(c.subcategories || null)}`)
})

const projs = await getDocs(collection(db, 'projects'))
console.log('--- projects (' + projs.size + ') ---')
projs.forEach(d => {
  const p = d.data()
  console.log(`[${d.id}] cat=${p.category} sub=${p.subcategory || '-'} | ${p.title}`)
})
process.exit(0)
