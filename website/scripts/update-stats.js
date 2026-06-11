/* One-off: sync homes count (1000+) and the real Google rating (4.5, 41
   reviews) into Firestore CMS data. Run: node scripts/update-stats.js */
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

// settings/homepage → studio.highlights: 200+ → 1000+
const homeRef = doc(db, 'settings', 'homepage')
const home = (await getDoc(homeRef)).data() || {}
if (home.studio) {
  const highlights = (home.studio.highlights || []).map(h =>
    String(h.value).trim() === '200+' ? { ...h, value: '1000+' } : h
  )
  await setDoc(homeRef, { ...home, studio: { ...home.studio, highlights } })
  console.log('settings/homepage studio.highlights =', JSON.stringify(highlights))
} else {
  console.log('settings/homepage: no studio key, skipped')
}

// settings/landingpage → stats: rating 4.8 → 4.5
const lpRef = doc(db, 'settings', 'landingpage')
const lp = (await getDoc(lpRef)).data() || {}
if (lp.stats) {
  const stats = lp.stats.map(s =>
    /google rating/i.test(s.label || '') ? { ...s, value: 4.5 } : s
  )
  await setDoc(lpRef, { ...lp, stats })
  console.log('settings/landingpage stats =', JSON.stringify(stats))
} else {
  console.log('settings/landingpage: no stats key, skipped')
}
console.log('DONE')
process.exit(0)
