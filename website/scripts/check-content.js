/* Read-only check: what does Firestore currently hold for testimonials and
   homepage settings? Run: node scripts/check-content.js */
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, getDocs, doc, getDoc } from 'firebase/firestore'
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

const tSnap = await getDocs(collection(db, 'testimonials'))
console.log('--- testimonials (' + tSnap.size + ') ---')
tSnap.forEach(d => {
  const t = d.data()
  console.log(`[${d.id}] ${t.name} | ${t.project} | videoId=${t.videoId || '-'} | ${String(t.text).slice(0, 60)}`)
})

const home = await getDoc(doc(db, 'settings', 'homepage'))
if (home.exists()) {
  const h = home.data()
  console.log('--- settings/homepage keys:', Object.keys(h).join(', '))
  if (h.hero) console.log('hero.eyebrow =', h.hero.eyebrow, '| rotatingTitles =', JSON.stringify(h.hero.rotatingTitles || null))
  if (h.studio) console.log('studio.desc =', String(h.studio.desc || '').slice(0, 100))
} else {
  console.log('--- settings/homepage: MISSING')
}
process.exit(0)
