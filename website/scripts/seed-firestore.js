#!/usr/bin/env node
/**
 * seed-firestore.js
 *
 * Pushes ALL static site data from siteData.js defaults + DataContext defaults
 * into Firestore so the site runs entirely from the database.
 *
 * Usage:  node scripts/seed-firestore.js
 *
 * Uses the Firebase client SDK (not Admin SDK) so no service-account key is needed.
 * Reads credentials from website/.env (VITE_FIREBASE_* vars).
 */

import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { initializeApp } from 'firebase/app'
import {
  getFirestore, collection, doc, setDoc, getDocs
} from 'firebase/firestore'

const __dirname = dirname(fileURLToPath(import.meta.url))

// ── Load .env manually (no dotenv dependency) ──
const envPath = resolve(__dirname, '..', '.env')
const envFile = readFileSync(envPath, 'utf8')
const env = {}
envFile.split('\n').forEach(line => {
  const trimmed = line.trim()
  if (!trimmed || trimmed.startsWith('#')) return
  const eqIdx = trimmed.indexOf('=')
  if (eqIdx === -1) return
  env[trimmed.slice(0, eqIdx)] = trimmed.slice(eqIdx + 1)
})

// ── Firebase init ──
const firebaseConfig = {
  apiKey:            env.VITE_FIREBASE_API_KEY,
  authDomain:        env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             env.VITE_FIREBASE_APP_ID,
  measurementId:     env.VITE_FIREBASE_MEASUREMENT_ID,
}

console.log(`\n  Firestore Seed Script`)
console.log(`  Project: ${firebaseConfig.projectId}\n`)

const app = initializeApp(firebaseConfig)
const db  = getFirestore(app)

// ═══════════════════════════════════════════════
//  ALL STATIC DATA — matches siteData.js + DataContext.jsx defaults
// ═══════════════════════════════════════════════

// NOTE: Image URLs below use placeholder paths. When seeded from the admin panel
// these get real Cloudinary/asset URLs. For this script we use descriptive placeholders
// that the admin can later replace via the CMS.

const PLACEHOLDER = '/placeholder.webp'

// ── 1. Categories ──
const categories = [
  { id: 'residential',  title: 'Residential Projects', short: 'Residential', slug: 'projects-residential', filter: ['apartments', 'villas'], order: 1 },
  { id: 'apartments',   title: 'Apartment Projects',   short: 'Apartments',  slug: 'projects-apartments',  filter: ['apartments'],            order: 2 },
  { id: 'villas',       title: 'Villa Projects',        short: 'Villas',      slug: 'projects-villas',      filter: ['villas'],                order: 3 },
  { id: 'commercial',   title: 'Commercial Projects',   short: 'Commercial',  slug: 'projects-commercial',  filter: ['commercial'],            order: 4 },
  { id: 'renovation',   title: 'Renovation Projects',   short: 'Renovation',  slug: 'projects-renovation',  filter: ['renovation'],            order: 5 },
]

// ── 2. Projects ──
const projects = [
  { id: '42-mark-3-villament',    title: '42 Mark 3 Villament',            category: 'villas',     location: 'Bangalore',              year: '2024', size: 'Premium', description: 'A contemporary luxury villament with warm wood tones, designer lighting and seamless open-plan living.',          image: PLACEHOLDER, images: [] },
  { id: 'assetz-marq',            title: 'Assetz Marq',                    category: 'apartments', location: 'Whitefield, Bangalore',  year: '2024', size: 'Premium', description: 'A refined apartment for Kranti & Deepti — minimalist palettes, custom joinery and layered lighting.',            image: PLACEHOLDER, images: [] },
  { id: 'brigade-utopia',         title: 'Brigade Utopia',                 category: 'apartments', location: 'Varthur, Bangalore',     year: '2024', size: 'Premium', description: "Moumita's home — a calm, contemporary apartment with bespoke storage and elegant finishes.",                    image: PLACEHOLDER, images: [] },
  { id: 'gm-infinite',            title: 'GM Infinite',                    category: 'apartments', location: 'Bangalore',              year: '2024', size: 'Premium', description: 'A modern, elegant apartment for Priyankar & Pallavi with smart space planning throughout.',                     image: PLACEHOLDER, images: [] },
  { id: 'greenfield-villa',       title: 'Greenfield Villa',               category: 'villas',     location: 'Bangalore',              year: '2024', size: 'Premium', description: 'A sprawling luxury villa for Gabriel & Blessie with bespoke interiors and premium materials.',                  image: PLACEHOLDER, images: [] },
  { id: 'post-and-toast',         title: 'Post & Toast',                   category: 'commercial', location: 'Bangalore',              year: '2024', size: 'Premium', description: 'A high-impact commercial space designed for atmosphere, flow and a memorable guest experience.',                 image: PLACEHOLDER, images: [] },
  { id: 'snn-clermont-jay',       title: 'SNN Clermont — Jay & Sushma',    category: 'apartments', location: 'Bilekahalli, Bangalore', year: '2024', size: 'Premium', description: 'A contemporary luxury apartment for Jay & Sushma with a warm, inviting material story.',                       image: PLACEHOLDER, images: [] },
  { id: 'snn-clermont-vijayee',   title: 'SNN Clermont — Vijayee',         category: 'apartments', location: 'Bilekahalli, Bangalore', year: '2024', size: 'Premium', description: 'A modern apartment interior with clean lines, designer lighting and custom wardrobes.',                         image: PLACEHOLDER, images: [] },
  { id: 'sobha-royal',            title: 'Sobha Royal Pavilion',            category: 'apartments', location: 'Bangalore',              year: '2024', size: 'Premium', description: 'An elegant luxury apartment for Amit & Neetoo — refined, timeless and beautifully detailed.',                   image: PLACEHOLDER, images: [] },
  { id: 'sobha-sentosa',          title: 'Sobha Sentosa',                   category: 'apartments', location: 'Bangalore',              year: '2024', size: 'Premium', description: "Arpit & Shikha's home — a luxury apartment balancing comfort with sophisticated design.",                      image: PLACEHOLDER, images: [] },
]

// ── 3. Testimonials ──
const testimonials = [
  { id: '1', name: 'Rajesh Kumar',  project: 'SNN Clermont',         text: 'ATTICARCH transformed our apartment into a dream home. The attention to detail and quality of execution was exceptional. Every corner tells a story of luxury and comfort.', rating: 5 },
  { id: '2', name: 'Priya Sharma',  project: 'Sobha Royal Pavilion', text: 'Working with ATTICARCH was a delightful experience. They understood our vision perfectly and delivered beyond our expectations. The design is both beautiful and functional.', rating: 5 },
  { id: '3', name: 'Arun Menon',    project: 'Greenfield Villa',     text: 'From concept to completion, the team was professional and creative. Our villa looks like it belongs in an architectural magazine. Highly recommend their services!',         rating: 5 },
  { id: '4', name: 'Sneha Patel',   project: 'Post & Toast',         text: 'ATTICARCH designed our commercial space and the result has elevated the entire guest experience. The design perfectly balances aesthetics with functionality.',             rating: 5 },
]

// ── 4. Blog Posts ──
const blogPosts = [
  { id: '1', slug: 'winter-ready-homes',         title: 'A Guide to Winter-Ready Homes in Bangalore',                   excerpt: 'As the pleasant Bangalore weather takes a winter turn, ensure your home is ready to embrace the cool breeze.',                       date: 'Jan 2024', image: PLACEHOLDER, category: 'Tips' },
  { id: '2', slug: 'office-interior-designers',   title: 'Why Choose Atticarch for Your Dream Workspace',                excerpt: 'The workplace is more than just a physical space; it influences creativity, collaboration, and productivity.',                       date: 'Dec 2023', image: PLACEHOLDER, category: 'Commercial' },
  { id: '3', slug: 'scenic-views-interior-design', title: "Utilizing Bangalore's Scenic Views in Interior Design",       excerpt: 'Interior design takes on a new dimension, blending modern aesthetics with breathtaking scenic views.',                               date: 'Nov 2023', image: PLACEHOLDER, category: 'Design' },
]

// ── 5. Services ──
const services = [
  {
    id: 'residential',
    title: 'Residential Interiors',
    subtitle: 'Your Dream Home, Crafted',
    description: 'From cosy apartments to sprawling villas, we design stunning homes tailored to your lifestyle. Full turnkey execution with a 10-Year Warranty on all work. Interiors starting from ₹10 Lacs.',
    features: ['Space Planning & Layout', 'Custom Wardrobe & Storage', 'Modular Kitchen Design', 'False Ceiling & Lighting', 'Flooring & Civil Work', 'Electrical & Plumbing'],
    image: PLACEHOLDER,
    order: 1,
  },
  {
    id: 'commercial',
    title: 'Commercial Spaces',
    subtitle: 'Inspiring Workspaces',
    description: 'We design high-impact commercial interiors — offices, showrooms, restaurants, and retail spaces — that reflect your brand identity and elevate the client experience.',
    features: ['Office & Workspace Design', 'Retail & Showroom Interiors', 'Restaurant & Hospitality', 'Brand-Aligned Design', 'MEP Coordination', 'Turnkey Execution'],
    image: PLACEHOLDER,
    order: 2,
  },
  {
    id: 'renovation',
    title: 'Renovation & Refurbishment',
    subtitle: 'Transform, Refresh, Elevate',
    description: 'Breathe new life into your existing space. From a single room refresh to a complete home makeover — we deliver remarkable transformations, on time and within budget.',
    features: ['Complete Home Renovation', 'Room-wise Makeovers', 'Kitchen & Bath Upgrades', 'Flooring & Ceiling Refresh', 'Civil & Plumbing', 'Electrical & Lighting'],
    image: PLACEHOLDER,
    order: 3,
  },
]

// ── 6. Rooms ──
const rooms = [
  { id: 'kitchen-interior-designers', title: 'Kitchen',      subtitle: 'The Heart of Your Home',    description: 'Modular and custom kitchen designs featuring premium materials, smart storage solutions, and world-class appliance integration.',      image: PLACEHOLDER, order: 1 },
  { id: 'living-room',               title: 'Living Room',   subtitle: 'Where Life Happens',        description: 'Expansive living spaces designed for comfort and elegance, with custom furniture, ambient lighting, and artistic elements.',            image: PLACEHOLDER, order: 2 },
  { id: 'bedrooms',                  title: 'Bedrooms',      subtitle: 'Your Personal Sanctuary',   description: 'Serene bedroom designs with premium fabrics, walk-in wardrobes, and spa-inspired ensuite bathrooms.',                                  image: PLACEHOLDER, order: 3 },
  { id: 'foyer',                     title: 'Foyer',         subtitle: 'First Impressions Matter',  description: 'Grand entrance designs that set the tone for your entire home with statement lighting and premium finishes.',                          image: PLACEHOLDER, order: 4 },
  { id: 'dining-room',               title: 'Dining Room',   subtitle: 'Gather & Celebrate',        description: 'Elegant dining spaces designed for intimate dinners and grand celebrations, with bespoke furniture and lighting.',                      image: PLACEHOLDER, order: 5 },
  { id: 'kids-bedroom',              title: 'Kids Bedroom',  subtitle: 'Imagination Unleashed',     description: 'Creative and functional kids rooms that grow with your child, featuring smart storage and playful design elements.',                    image: PLACEHOLDER, order: 6 },
  { id: 'bathrooms',                 title: 'Bathrooms',     subtitle: 'Spa at Home',               description: 'Luxurious bathroom designs with premium fixtures, natural stone, and spa-inspired layouts for ultimate relaxation.',                    image: PLACEHOLDER, order: 7 },
  { id: 'balcony',                   title: 'Balcony',       subtitle: 'Outdoor Living',            description: 'Transform your balcony into a serene retreat with custom landscaping, comfortable seating, and ambient lighting.',                      image: PLACEHOLDER, order: 8 },
]

// ── 7. Team Members ──
const team = [
  { id: 'kamlesh-kumar-bhargava', name: 'Kamlesh Kumar Bhargava', role: 'Principal Partner & Head Architect',                      bio: 'Principal founder of ATTICARCH, Kamlesh is a professional architect (BMS College of Architecture) with over two decades of rich experience across interiors consultancy, execution and design. Since founding ATTICARCH in 2002 he has driven the firm to the heights it has reached today — his strength lies in listening to clients and translating their vision into artistic yet functional spaces.', featured: true,  avatar: '', order: 1 },
  { id: 'priyanka-bhargava',      name: 'Priyanka Bhargava',      role: 'Principal Partner & Head of Marketing & Administration',  bio: 'Principal owner of ATTICARCH, Priyanka leads sales & marketing, finance and administration. A software engineer (MS Software, BITS Pilani) with 10+ years in software and management, she brings deep operational expertise and drives the firm\'s national visibility.',                                                                                                                       featured: true,  avatar: '', order: 2 },
  { id: 'guna-sekhar',            name: 'Guna Sekhar',            role: 'Manager — Operations',                                    bio: 'With ATTICARCH from the day we entered residential interiors, Guna handles site operations, vendor coordination and project execution end-to-end. A core team asset, his dedication has been pivotal to smooth completions and on-time handovers.',                                                                                                                                             featured: true,  avatar: '', order: 3 },
  { id: 'sruthi-raguraj',         name: 'Sruthi Raguraj',         role: 'Architect',                                               bio: '',                                                                                                                                                                                                                                                                                                                                                                                             featured: false, avatar: '', order: 4 },
  { id: 'muhammed-ramshad',       name: 'Muhammed Ramshad',       role: 'Designer',                                                bio: '',                                                                                                                                                                                                                                                                                                                                                                                             featured: false, avatar: '', order: 5 },
  { id: 'sumodh-johnson',         name: 'Sumodh Johnson',         role: 'Senior 3D Designer',                                      bio: '',                                                                                                                                                                                                                                                                                                                                                                                             featured: false, avatar: '', order: 6 },
  { id: 'reddy-sekhar',           name: 'Reddy Sekhar',           role: 'Senior Site Supervisor',                                   bio: '',                                                                                                                                                                                                                                                                                                                                                                                             featured: false, avatar: '', order: 7 },
  { id: 'samson',                  name: 'Samson',                  role: 'Site Supervisor',                                         bio: '',                                                                                                                                                                                                                                                                                                                                                                                             featured: false, avatar: '', order: 8 },
]

// ── 8. Partners ──
const partners = [
  { id: 'centuryply',   name: 'CenturyPly',           category: 'Plywood & Laminates',           logo: '', order: 1 },
  { id: 'kitply',       name: 'Kitply',               category: 'Plywood & Boards',              logo: '', order: 2 },
  { id: 'evershine',    name: 'Evershine Industries', category: 'Door Hardware & Locks',          logo: '', order: 3 },
  { id: 'hettich',      name: 'Hettich',              category: 'Hinges & Sliding Systems',       logo: '', order: 4 },
  { id: 'blum',         name: 'Blum',                 category: 'Drawer Slides & Hinges',         logo: '', order: 5 },
  { id: 'saint-gobain', name: 'Saint-Gobain',         category: 'Glass & Insulation',             logo: '', order: 6 },
  { id: 'gyproc',       name: 'Gyproc',               category: 'False Ceiling & Drywall',        logo: '', order: 7 },
  { id: 'asian-paints', name: 'Asian Paints',         category: 'Paints & Finishes',              logo: '', order: 8 },
  { id: 'kaff',         name: 'KAFF',                 category: 'Modular Kitchens & Appliances',  logo: '', order: 9 },
  { id: 'elica',        name: 'Elica',                category: 'Kitchen Hoods & Hobs',           logo: '', order: 10 },
]

// ── 9. About Page Content ──
const aboutContent = {
  visionStatement: 'We aim to revolutionise interior design with innovative, stunning yet workable design concepts. With our remarkably distinctive style we aspire to be a leading interior design firm in India.',
  principles: [
    { num: '01', title: 'Quality',    desc: 'Maintaining the highest quality standards for every project. Under no circumstance do we compromise on the quality of our deliverables.' },
    { num: '02', title: 'Timeliness', desc: 'We are committed to delivering the end product with the highest specification and within the defined timelines.' },
    { num: '03', title: 'Budget',     desc: 'Clients have a clear budget in mind. We believe in working within those parameters and delivering the very best within them.' },
  ],
  approachPoints: [
    'Identifying project objectives — clarifying and building the brief, including timelines and budget',
    'Space planning and concept design',
    'Detailed drawings, finishes, colour and material specification',
    'On-site consultation and liaison with contractors and suppliers',
    'Final quality control inspections, snagging and remedial action',
    'Equal attention to aesthetics, functionality and operational drivers',
  ],
  valueProps: [
    { value: 'Est. 2002', label: 'Bangalore Studio' },
    { value: '10-Year',   label: 'Workmanship Warranty' },
    { value: 'Turnkey',   label: 'End-to-End Execution' },
    { value: '₹10L+',    label: 'Bespoke Interiors' },
  ],
  processSteps: [
    { step: 1, title: 'Get Acquainted',      description: 'We begin with understanding your vision, lifestyle, and preferences through an in-depth consultation.' },
    { step: 2, title: 'Concept Creation',     description: 'Our designers develop unique concepts with mood boards, 3D renders, and material palettes for your approval.' },
    { step: 3, title: 'Design Development',   description: 'Detailed drawings, specifications, and selections are finalized. Every element is meticulously planned.' },
    { step: 4, title: 'Registration',         description: 'Project agreements, timelines, and budgets are formalized. Your dream project officially begins.' },
    { step: 5, title: 'Execution',            description: 'Our skilled craftsmen bring the design to life with premium materials and uncompromising quality standards.' },
    { step: 6, title: 'Delivery',             description: 'Final walkthrough, quality checks, and handover. We ensure every detail meets our exacting standards.' },
  ],
}

// ── 10. Homepage Settings (single doc) ──
const homepageSettings = {
  hero: {
    eyebrow: 'Award-Winning Bangalore Studio',
    titleLine1: 'Designing Homes',
    titleLine2: 'That Tell Your Story',
    subtitle: "Bangalore's award-winning interior design studio, crafting breathtaking spaces since 2002.",
    primaryCtaText: 'Free Consultation',
    primaryCtaPath: '/contact-us',
    secondaryCtaText: 'Explore Portfolio',
    secondaryCtaPath: '/project-category/projects-apartments',
    ytText: 'Watch Our Transformations',
    ytUrl: 'https://www.youtube.com/channel/UCYGM6iXNjQVNfW8Klw_oRWA',
    slides: projects.slice(0, 5).map(p => ({ imageUrl: p.image, publicId: '' })),
  },
  studio: {
    eyebrow: 'Inside the Studio',
    title: 'Built Around You. Made by Hand.',
    desc: 'Every ATTICARCH home starts with a conversation, not a catalogue. Our in-house team of designers and on-site experts work side-by-side under one roof — drawing, picking materials and finishing each room with care, so the work lasts long after we hand over the keys.',
    highlights: [
      { value: '200+', label: 'Homes Finished' },
      { value: 'In-House', label: 'Design & Build Team' },
      { value: '100%', label: 'On-Site Supervision' },
      { value: '48 Hrs', label: 'Quick Quote' },
    ],
    images: [
      { imageUrl: PLACEHOLDER, publicId: '' },
      { imageUrl: PLACEHOLDER, publicId: '' },
      { imageUrl: PLACEHOLDER, publicId: '' },
      { imageUrl: PLACEHOLDER, publicId: '' },
    ],
  },
  workTypes: [
    'Modular Kitchens', 'Wardrobes', 'False Ceiling', 'Lighting Design',
    'Flooring', 'Electrical', 'Plumbing', 'Civil Work',
    'TV Units', 'Crockery Units', 'Pooja Rooms', 'Balcony Design',
    'Kids Bedrooms', 'Home Office', 'Wallpaper & Textures', 'Landscaping',
  ].map(title => ({ title, imageUrl: PLACEHOLDER, publicId: '' })),
  youtube: [
    { videoId: 'vcUMkExgiCw', title: 'ATTICARCH — Luxury Interior Design' },
    { videoId: 'N2QJ6ETLnaQ', title: 'ATTICARCH — Residential Transformation' },
    { videoId: 'XzEPJfpn4FI', title: 'ATTICARCH — Premium Villa Interiors' },
    { videoId: 'qRjYhNeu1To', title: 'Step Inside Modern Luxury with ATTICARCH' },
    { videoId: 'zPJQttiz4SQ', title: 'Luxury 4BHK Villa Interiors — Samruddhi Lake Drive' },
    { videoId: 'Kp0BATDxKFI', title: '3BHK Flat Interiors at Prestige Tranquility' },
    { videoId: 'yvptQo71mnw', title: '3BHK Apartment Tour — Prestige Song of the South' },
  ],
  instagram: Array.from({ length: 12 }, () => ({
    imageUrl: PLACEHOLDER,
    link: 'https://www.instagram.com/atticarch2020/',
  })),
}

// ── 11. Landing Page Settings (single doc) ──
const landingSettings = {
  heroTitleLine1: 'Luxury Interiors in',
  heroTitleLine2: 'Bangalore',
  heroSubtitle: 'Free 3D Design + Detailed Quote in 48 Hours',
  bullets: [
    'Free 3D visualization of every room',
    '10-year workmanship warranty',
    'Turnkey execution — starts ₹4 Lacs',
  ],
  phone: '+919916666222',
  whatsapp: '919916666222',
  whatsappPrefill: "Hi ATTICARCH, I'd like a free interior design consultation.",
  benefits: [
    { iconName: 'Box',      title: 'Free 3D Visualization', desc: 'See your home before we build it — photo-real renders included.' },
    { iconName: 'Palette',  title: 'Material Selection',    desc: '500+ finishes from premium brand partners, all visualized for you.' },
    { iconName: 'FileText', title: 'Detailed Quote',        desc: 'Itemized BOQ with zero hidden costs — what you see is what you pay.' },
    { iconName: 'MapPin',   title: 'On-site Survey',        desc: 'Our designer visits your home and measures everything — free.' },
  ],
  stats: [
    { value: 1000, suffix: '+',     label: 'Homes Delivered' },
    { value: 22,   suffix: ' yrs',  label: 'Since 2002' },
    { value: 4.8,  suffix: '★',    label: 'Google Rating', decimal: true },
    { value: 100,  suffix: '%',     label: 'On-Time Handover' },
  ],
  pricing: [
    { type: '1 BHK',  starts: '₹4 Lacs',  range: '₹4L – ₹6L',  inclusions: 'Modular Kitchen, 1 Wardrobe, False Ceiling (Living), TV Unit, Basic Electrical' },
    { type: '2 BHK',  starts: '₹6 Lacs',  range: '₹6L – ₹10L', featured: true, inclusions: 'Modular Kitchen, 2 Wardrobes, Full False Ceiling, TV Unit + Crockery, Lighting & Electrical, Painting Included' },
    { type: '3 BHK +', starts: '₹10 Lacs', range: '₹10L – ₹18L', inclusions: 'Premium Modular Kitchen, 3+ Wardrobes, Full False Ceiling, TV + Crockery + Pooja, Premium Finishes, Bathroom Upgrades' },
  ],
  steps: [
    { num: '01', day: 'Day 1',           title: 'Free Consultation Call', desc: 'A 20-minute call with our senior designer to understand your style, family needs and budget.' },
    { num: '02', day: 'Days 2-7',        title: '3D Design & Quote',     desc: 'You receive photo-real 3D renders of every room + a detailed itemized BOQ — completely free.' },
    { num: '03', day: 'Day 8 onwards',   title: 'Execute & Move In',     desc: 'Sign-off and we begin. Weekly progress photos, on-time handover, 10-year warranty.' },
  ],
  faqs: [
    { q: 'How much does interior design cost in Bangalore?', a: 'Our turnkey interior projects start at ₹4 Lacs for 1BHK, ₹6 Lacs for 2BHK and ₹10 Lacs for 3BHK+. You get an exact quote after the free consultation — no hidden costs, ever.' },
    { q: 'How long does a typical project take?', a: 'A 2BHK takes 45-60 days from sign-off to handover. 3BHK and villas: 60-90 days. We commit to a date in writing and pay you for delays.' },
    { q: 'What does the 10-year warranty cover?', a: 'Full workmanship warranty on all carpentry, modular units, false ceiling, electrical and plumbing work executed by us. We come back and fix anything, free.' },
    { q: 'Do you offer EMI or flexible payment plans?', a: 'Yes. We accept staged payments tied to project milestones and can also help arrange EMI through partner banks.' },
    { q: 'What brands and materials do you use?', a: 'CenturyPly, Kitply, Hettich, Blum, Saint-Gobain, Asian Paints, KAFF, Elica and more — all premium IS-certified brands you can verify.' },
    { q: 'Which areas in Bangalore do you serve?', a: 'All of Bangalore — Whitefield, Sarjapur, Electronic City, North Bangalore, JP Nagar, HSR Layout, Indiranagar and more. We have project teams across the city.' },
  ],
}

// ── 12. Upcoming Projects ──
const upcomingProjects = [
  { id: '1', title: '5BHK Penthouse @ Brigade Gateway', location: 'Rajajinagar',  size: '5500 sq.ft', status: 'Design Phase',     progress: 35, image: PLACEHOLDER },
  { id: '2', title: 'Luxury Villa @ Total Environment',  location: 'Whitefield',   size: '6000 sq.ft', status: 'Concept Creation', progress: 20, image: PLACEHOLDER },
  { id: '3', title: 'Commercial Showroom',                location: 'Indiranagar',  size: '3000 sq.ft', status: 'Execution',        progress: 70, image: PLACEHOLDER },
]


// ═══════════════════════════════════════════════
//  SEED FUNCTIONS
// ═══════════════════════════════════════════════

async function seedCollection(name, items) {
  let count = 0
  for (const item of items) {
    const docId = String(item.id)
    await setDoc(doc(db, name, docId), {
      ...item,
      id: docId,
      createdAt: new Date().toISOString(),
    })
    count++
  }
  console.log(`  ✓ ${name} — ${count} documents`)
}

async function seedDoc(path, docId, data) {
  await setDoc(doc(db, path, docId), data)
  console.log(`  ✓ ${path}/${docId}`)
}

async function countCollection(name) {
  const snap = await getDocs(collection(db, name))
  return snap.size
}


// ═══════════════════════════════════════════════
//  MAIN
// ═══════════════════════════════════════════════

async function main() {
  console.log('  Checking existing data...\n')

  const counts = {}
  for (const col of ['projects', 'categories', 'testimonials', 'blogPosts', 'services', 'rooms', 'team', 'partners', 'upcomingProjects']) {
    counts[col] = await countCollection(col)
  }

  console.log('  Current Firestore state:')
  for (const [col, count] of Object.entries(counts)) {
    console.log(`    ${col}: ${count} docs`)
  }
  console.log()

  console.log('  Seeding all collections...\n')

  // Collections
  await seedCollection('categories',       categories)
  await seedCollection('projects',         projects)
  await seedCollection('testimonials',     testimonials)
  await seedCollection('blogPosts',        blogPosts)
  await seedCollection('services',         services)
  await seedCollection('rooms',            rooms)
  await seedCollection('team',             team)
  await seedCollection('partners',         partners)
  await seedCollection('upcomingProjects', upcomingProjects)

  // Single documents
  await seedDoc('settings', 'homepage',    homepageSettings)
  await seedDoc('settings', 'landingpage', landingSettings)
  await seedDoc('settings', 'about',       aboutContent)

  console.log('\n  ══════════════════════════════════════')
  console.log('  ✅ All data seeded successfully!')
  console.log('  ══════════════════════════════════════')
  console.log(`
  Firestore Collections Created:
  ─────────────────────────────────────
  categories        ${categories.length} docs
  projects          ${projects.length} docs
  testimonials      ${testimonials.length} docs
  blogPosts         ${blogPosts.length} docs
  services          ${services.length} docs
  rooms             ${rooms.length} docs
  team              ${team.length} docs
  partners          ${partners.length} docs
  upcomingProjects  ${upcomingProjects.length} docs
  ─────────────────────────────────────
  settings/homepage     1 doc
  settings/landingpage  1 doc
  settings/about        1 doc
  ─────────────────────────────────────

  NOTE: Image fields are set to '${PLACEHOLDER}'.
  Upload real images via the Admin Panel and they
  will be stored as Cloudinary URLs in Firestore.
  `)

  process.exit(0)
}

main().catch(err => {
  console.error('\n  ❌ Seed failed:', err.message)
  process.exit(1)
})
