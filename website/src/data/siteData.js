/* ──────────────────────────────────────────────
   REAL PROJECT IMAGERY
   All photos live in src/assets/projects/<Project>/
   and are optimized to .webp by `npm run optimize`.
────────────────────────────────────────────── */
const globbed = import.meta.glob('../assets/projects/**/*.webp', { eager: true, import: 'default' })

const natSort = (a, b) => a.localeCompare(b, undefined, { numeric: true })

const imagesFor = (folder) =>
  Object.keys(globbed)
    .filter((k) => k.includes(`/${folder}/`))
    .sort(natSort)
    .map((k) => globbed[k])

/* Flat pool of every photo — used to scatter real imagery across the site */
export const allImages = Object.keys(globbed).sort(natSort).map((k) => globbed[k])

/* deterministic shuffle so layouts stay stable between renders */
const shuffled = (() => {
  const a = [...allImages]
  let seed = 7
  for (let i = a.length - 1; i > 0; i--) {
    seed = (seed * 9301 + 49297) % 233280
    const j = Math.floor((seed / 233280) * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
})()
export const pickImages = (count, offset = 0) =>
  Array.from({ length: count }, (_, i) => shuffled[(offset + i) % shuffled.length])

/* ── Projects (portfolio) ── */
const projectDefs = [
  { id: '42-mark-3-villament', title: '42 Mark 3 Villament', category: 'villas', location: 'Bangalore', folder: '42 Mark 3 Villament', year: '2024', description: 'A contemporary luxury villament with warm wood tones, designer lighting and seamless open-plan living.' },
  { id: 'assetz-marq', title: 'Assetz Marq', category: 'apartments', location: 'Whitefield, Bangalore', folder: 'Assetz Marq - Kranti & Deepti', year: '2024', description: 'A refined apartment for Kranti & Deepti — minimalist palettes, custom joinery and layered lighting.' },
  { id: 'brigade-utopia', title: 'Brigade Utopia', category: 'apartments', location: 'Varthur, Bangalore', folder: 'Brigade Utopia - Moumita', year: '2024', description: 'Moumita’s home — a calm, contemporary apartment with bespoke storage and elegant finishes.' },
  { id: 'gm-infinite', title: 'GM Infinite', category: 'apartments', location: 'Bangalore', folder: 'GM Infinite - Priyankar and Pallavi', year: '2024', description: 'A modern, elegant apartment for Priyankar & Pallavi with smart space planning throughout.' },
  { id: 'greenfield-villa', title: 'Greenfield Villa', category: 'villas', location: 'Bangalore', folder: 'Greenfield Villa - Gabriel and Blessie', year: '2024', description: 'A sprawling luxury villa for Gabriel & Blessie with bespoke interiors and premium materials.' },
  { id: 'post-and-toast', title: 'Post & Toast', category: 'commercial', location: 'Bangalore', folder: 'Post and Toast', year: '2024', description: 'A high-impact commercial space designed for atmosphere, flow and a memorable guest experience.' },
  { id: 'snn-clermont-jay', title: 'SNN Clermont — Jay & Sushma', category: 'apartments', location: 'Bilekahalli, Bangalore', folder: 'SNN Clermont Jay & Sushma', year: '2024', description: 'A contemporary luxury apartment for Jay & Sushma with a warm, inviting material story.' },
  { id: 'snn-clermont-vijayee', title: 'SNN Clermont — Vijayee', category: 'apartments', location: 'Bilekahalli, Bangalore', folder: 'SNN Clermont Vijayee', year: '2024', description: 'A modern apartment interior with clean lines, designer lighting and custom wardrobes.' },
  { id: 'sobha-royal', title: 'Sobha Royal Pavilion', category: 'apartments', location: 'Bangalore', folder: 'Sobha Royal Pavilion - Amit and Neetoo', year: '2024', description: 'An elegant luxury apartment for Amit & Neetoo — refined, timeless and beautifully detailed.' },
  { id: 'sobha-sentosa', title: 'Sobha Sentosa', category: 'apartments', location: 'Bangalore', folder: 'Sobha Sentosa - Arpit and Shikha', year: '2024', description: 'Arpit & Shikha’s home — a luxury apartment balancing comfort with sophisticated design.' },
]

export const projects = projectDefs.map((p) => {
  const images = imagesFor(p.folder)
  return { ...p, images, image: images[0] || allImages[0], size: 'Premium' }
})

export const upcomingProjects = [
  { id: 1, title: '5BHK Penthouse @ Brigade Gateway', location: 'Rajajinagar', size: '5500 sq.ft', status: 'Design Phase', progress: 35, image: pickImages(1, 11)[0] },
  { id: 2, title: 'Luxury Villa @ Total Environment', location: 'Whitefield', size: '6000 sq.ft', status: 'Concept Creation', progress: 20, image: pickImages(1, 23)[0] },
  { id: 3, title: 'Commercial Showroom', location: 'Indiranagar', size: '3000 sq.ft', status: 'Execution', progress: 70, image: pickImages(1, 41)[0] },
]

export const services = [
  {
    id: 'residential',
    title: 'Residential Interiors',
    subtitle: 'Your Dream Home, Crafted',
    description: 'From cosy apartments to sprawling villas, we design stunning homes tailored to your lifestyle. Full turnkey execution with a 10-Year Warranty on all work. Interiors starting from ₹10 Lacs.',
    features: ['Space Planning & Layout', 'Custom Wardrobe & Storage', 'Modular Kitchen Design', 'False Ceiling & Lighting', 'Flooring & Civil Work', 'Electrical & Plumbing'],
    image: pickImages(1, 3)[0],
  },
  {
    id: 'commercial',
    title: 'Commercial Spaces',
    subtitle: 'Inspiring Workspaces',
    description: 'We design high-impact commercial interiors — offices, showrooms, restaurants, and retail spaces — that reflect your brand identity and elevate the client experience.',
    features: ['Office & Workspace Design', 'Retail & Showroom Interiors', 'Restaurant & Hospitality', 'Brand-Aligned Design', 'MEP Coordination', 'Turnkey Execution'],
    image: imagesFor('Post and Toast')[0] || pickImages(1, 9)[0],
  },
  {
    id: 'renovation',
    title: 'Renovation & Refurbishment',
    subtitle: 'Transform, Refresh, Elevate',
    description: 'Breathe new life into your existing space. From a single room refresh to a complete home makeover — we deliver remarkable transformations, on time and within budget.',
    features: ['Complete Home Renovation', 'Room-wise Makeovers', 'Kitchen & Bath Upgrades', 'Flooring & Ceiling Refresh', 'Civil & Plumbing', 'Electrical & Lighting'],
    image: pickImages(1, 17)[0],
  },
]

export const workTypes = [
  'Modular Kitchens', 'Wardrobes', 'False Ceiling', 'Lighting Design',
  'Flooring', 'Electrical', 'Plumbing', 'Civil Work',
  'TV Units', 'Crockery Units', 'Pooja Rooms', 'Balcony Design',
  'Kids Bedrooms', 'Home Office', 'Wallpaper & Textures', 'Landscaping',
]

export const partners = [
  'Hettich', 'Hafele', 'Asian Paints', 'Jaquar', 'Kohler',
  'Duravit', 'Grohe', 'Bosch', 'Dorma', 'Pergo',
  'Armstrong', 'Saint-Gobain',
]

export const rooms = [
  { slug: 'kitchen-interior-designers', title: 'Kitchen', subtitle: 'The Heart of Your Home', image: pickImages(1, 0)[0], description: 'Modular and custom kitchen designs featuring premium materials, smart storage solutions, and world-class appliance integration.' },
  { slug: 'living-room', title: 'Living Room', subtitle: 'Where Life Happens', image: pickImages(1, 6)[0], description: 'Expansive living spaces designed for comfort and elegance, with custom furniture, ambient lighting, and artistic elements.' },
  { slug: 'bedrooms', title: 'Bedrooms', subtitle: 'Your Personal Sanctuary', image: pickImages(1, 13)[0], description: 'Serene bedroom designs with premium fabrics, walk-in wardrobes, and spa-inspired ensuite bathrooms.' },
  { slug: 'foyer', title: 'Foyer', subtitle: 'First Impressions Matter', image: pickImages(1, 20)[0], description: 'Grand entrance designs that set the tone for your entire home with statement lighting and premium finishes.' },
  { slug: 'dining-room', title: 'Dining Room', subtitle: 'Gather & Celebrate', image: pickImages(1, 27)[0], description: 'Elegant dining spaces designed for intimate dinners and grand celebrations, with bespoke furniture and lighting.' },
  { slug: 'kids-bedroom', title: 'Kids Bedroom', subtitle: 'Imagination Unleashed', image: pickImages(1, 34)[0], description: 'Creative and functional kids rooms that grow with your child, featuring smart storage and playful design elements.' },
  { slug: 'bathrooms', title: 'Bathrooms', subtitle: 'Spa at Home', image: pickImages(1, 48)[0], description: 'Luxurious bathroom designs with premium fixtures, natural stone, and spa-inspired layouts for ultimate relaxation.' },
  { slug: 'balcony', title: 'Balcony', subtitle: 'Outdoor Living', image: pickImages(1, 55)[0], description: 'Transform your balcony into a serene retreat with custom landscaping, comfortable seating, and ambient lighting.' },
]

export const testimonials = [
  { id: 1, name: 'Rajesh Kumar', project: 'SNN Clermont', text: 'ATTICARCH transformed our apartment into a dream home. The attention to detail and quality of execution was exceptional. Every corner tells a story of luxury and comfort.', rating: 5 },
  { id: 2, name: 'Priya Sharma', project: 'Sobha Royal Pavilion', text: 'Working with ATTICARCH was a delightful experience. They understood our vision perfectly and delivered beyond our expectations. The design is both beautiful and functional.', rating: 5 },
  { id: 3, name: 'Arun Menon', project: 'Greenfield Villa', text: 'From concept to completion, the team was professional and creative. Our villa looks like it belongs in an architectural magazine. Highly recommend their services!', rating: 5 },
  { id: 4, name: 'Sneha Patel', project: 'Post & Toast', text: 'ATTICARCH designed our commercial space and the result has elevated the entire guest experience. The design perfectly balances aesthetics with functionality.', rating: 5 },
]

export const blogPosts = [
  { id: 1, slug: 'winter-ready-homes', title: 'A Guide to Winter-Ready Homes in Bangalore', excerpt: 'As the pleasant Bangalore weather takes a winter turn, ensure your home is ready to embrace the cool breeze.', date: 'Jan 2024', image: pickImages(1, 2)[0], category: 'Tips' },
  { id: 2, slug: 'office-interior-designers', title: 'Why Choose Atticarch for Your Dream Workspace', excerpt: 'The workplace is more than just a physical space; it influences creativity, collaboration, and productivity.', date: 'Dec 2023', image: pickImages(1, 38)[0], category: 'Commercial' },
  { id: 3, slug: 'scenic-views-interior-design', title: "Utilizing Bangalore's Scenic Views in Interior Design", excerpt: 'Interior design takes on a new dimension, blending modern aesthetics with breathtaking scenic views.', date: 'Nov 2023', image: pickImages(1, 52)[0], category: 'Design' },
]

/* Real, defensible value propositions — no fabricated counts */
export const valueProps = [
  { value: 'Est. 2002', label: 'Bangalore Studio' },
  { value: '10-Year', label: 'Workmanship Warranty' },
  { value: 'Turnkey', label: 'End-to-End Execution' },
  { value: '₹10L+', label: 'Bespoke Interiors' },
]

export const processSteps = [
  { step: 1, title: 'Get Acquainted', description: 'We begin with understanding your vision, lifestyle, and preferences through an in-depth consultation.' },
  { step: 2, title: 'Concept Creation', description: 'Our designers develop unique concepts with mood boards, 3D renders, and material palettes for your approval.' },
  { step: 3, title: 'Design Development', description: 'Detailed drawings, specifications, and selections are finalized. Every element is meticulously planned.' },
  { step: 4, title: 'Registration', description: 'Project agreements, timelines, and budgets are formalized. Your dream project officially begins.' },
  { step: 5, title: 'Execution', description: 'Our skilled craftsmen bring the design to life with premium materials and uncompromising quality standards.' },
  { step: 6, title: 'Delivery', description: 'Final walkthrough, quality checks, and handover. We ensure every detail meets our exacting standards.' },
]
