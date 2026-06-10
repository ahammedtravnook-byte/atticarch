/* One-off content sync: push the new testimonials (real client videos from the
   old atticarch.com), the in-house-production studio copy, and the rotating
   hero sentences into Firestore so the live CMS data matches the new code.
   Run: node scripts/update-content.js */
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, getDocs, doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore'
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

const testimonials = [
  { id: '1', name: 'Our Clients at SNN Clermont', project: '4BHK Complete Home Interiors', text: 'Watch the family take us through their finished 4BHK at SNN Clermont.', rating: 5, videoId: 'J5x3HquAop0' },
  { id: '2', name: 'Our Clients at Prestige Lakeside Habitat', project: 'Luxury 3BHK Interiors', text: 'A walkthrough of the completed luxury 3BHK at Prestige Lakeside Habitat.', rating: 5, videoId: 'MeX1zJkH3u0' },
  { id: '3', name: 'Our Clients at Rohan Upvan', project: '3BHK Apartment Interiors', text: 'Recently completed 3BHK apartment interiors at Rohan Upvan.', rating: 5, videoId: 'rzoFHrfdrc0' },
  { id: '4', name: 'Our Clients at Copper Pod', project: '3BHK Home Interiors', text: 'A tour of the completed 3BHK interiors at Copper Pod, Bangalore.', rating: 5, videoId: 'Q1cbRekh5Uw' },
  { id: '5', name: 'Our Villa Clients', project: 'Lavish Villa Interiors', text: 'Lavish villa interiors completed end-to-end by Team ATTICARCH.', rating: 5, videoId: 'qeH0zeMjS6Q' },
  { id: '6', name: 'Our Clients at Prestige Lakeside Habitat', project: 'Customised 3BHK Interiors', text: 'Fully customised 3BHK apartment interiors at Prestige Lakeside Habitat.', rating: 5, videoId: '4xhqfUHf0u0' },
  { id: '7', name: 'Our Clients at JRK Gardens', project: '3BHK Renovation', text: 'A complete 3BHK renovation at JRK Gardens, Bangalore.', rating: 5, videoId: 'DuqOE3XRjmY' },
]

console.log('Updating testimonials...')
for (const t of testimonials) {
  await setDoc(doc(db, 'testimonials', t.id), t)
  console.log('  saved', t.id, t.project)
}

console.log('Updating settings/homepage (hero rotating titles + studio desc)...')
const homeRef = doc(db, 'settings', 'homepage')
const home = (await getDoc(homeRef)).data() || {}

const hero = {
  ...(home.hero || {}),
  eyebrow: 'An Award-Winning Design Studio in Bangalore',
  rotatingTitles: 'We Design Homes|That Tell Your Story\nHomes Designed by|Expert Architects\nAward-Winning Interiors|Built In-House Since 2002',
}
const studio = {
  ...(home.studio || {}),
  desc: 'Every ATTICARCH home starts with a conversation, not a catalogue. We have our own in-house production unit — our designers, carpenters and finishing experts work under one roof, so every wardrobe, kitchen and panel is built by us, not outsourced. That is how we control quality, cost and timelines from drawing board to handover.',
  highlights: (home.studio?.highlights || []).map(h =>
    h.value === 'In-House' ? { ...h, label: 'Production Unit' } : h
  ),
}
await setDoc(homeRef, { ...home, hero, studio })
console.log('  settings/homepage saved')
console.log('DONE')
process.exit(0)
