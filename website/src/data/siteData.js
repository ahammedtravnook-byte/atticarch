import heroLiving from '../assets/images/hero-living.png'
import kitchen from '../assets/images/kitchen.png'
import bedroom from '../assets/images/bedroom.png'
import villa from '../assets/images/villa.png'
import apartment from '../assets/images/apartment.png'
import commercial from '../assets/images/commercial.png'
import foyer from '../assets/images/foyer.png'
import dining from '../assets/images/dining.png'
import bathroom from '../assets/images/bathroom.png'

export const projects = [
  { id: 1, title: '4BHK @ SNN Clermont', category: 'apartments', location: 'Bangalore', size: '2400 sq.ft', image: apartment, year: '2024', description: 'A contemporary 4BHK apartment with warm wood tones, designer lighting, and seamless open-plan living.' },
  { id: 2, title: '4BHK Villa in Bangalore', category: 'villas', location: 'Whitefield, Bangalore', size: '3800 sq.ft', image: villa, year: '2024', description: 'Sprawling luxury villa with bespoke interiors, private garden, and premium Italian marble throughout.' },
  { id: 3, title: '3BHK @ Rohan Upvan', category: 'apartments', location: 'Hennur, Bangalore', size: '1800 sq.ft', image: heroLiving, year: '2023', description: 'Elegant 3BHK with minimalist design language, smart home integration, and custom joinery.' },
  { id: 4, title: '3BHK @ Prestige Lakeside Habitat', category: 'apartments', location: 'Varthur, Bangalore', size: '2100 sq.ft', image: kitchen, year: '2023', description: 'Lake-facing apartment with floor-to-ceiling windows, premium kitchen, and spa-inspired bathrooms.' },
  { id: 5, title: '4BHK @ SNN Raj Eternia', category: 'apartments', location: 'Bilekahalli, Bangalore', size: '2600 sq.ft', image: bedroom, year: '2023', description: 'Luxury apartment with master suite, walk-in wardrobes, and designer lighting throughout.' },
  { id: 6, title: 'Corporate Office Interiors', category: 'commercial', location: 'MG Road, Bangalore', size: '5000 sq.ft', image: commercial, year: '2024', description: 'Modern executive workspace with collaborative zones, premium boardroom, and biophilic design.' },
  { id: 7, title: '4BHK Villa @ Prestige Lakeside', category: 'villas', location: 'Varthur, Bangalore', size: '4200 sq.ft', image: villa, year: '2022', description: 'Exclusive villa with private pool, landscaped garden, and bespoke interior finishes.' },
  { id: 8, title: 'Renovation @ Koramangala', category: 'renovation', location: 'Koramangala, Bangalore', size: '1600 sq.ft', image: foyer, year: '2024', description: 'Complete home renovation transforming a dated apartment into a contemporary luxury living space.' },
]

export const upcomingProjects = [
  { id: 1, title: '5BHK Penthouse @ Brigade Gateway', location: 'Rajajinagar', size: '5500 sq.ft', status: 'Design Phase', progress: 35, image: heroLiving },
  { id: 2, title: 'Luxury Villa @ Total Environment', location: 'Whitefield', size: '6000 sq.ft', status: 'Concept Creation', progress: 20, image: villa },
  { id: 3, title: 'Commercial Showroom', location: 'Indiranagar', size: '3000 sq.ft', status: 'Execution', progress: 70, image: commercial },
]

export const services = [
  {
    id: 'residential',
    title: 'Residential Interiors',
    subtitle: 'Your Dream Home, Crafted',
    description: 'From cosy apartments to sprawling villas, we design stunning homes tailored to your lifestyle. Full turnkey execution with a 10-Year Warranty on all work. Interiors starting from ₹10 Lacs.',
    features: ['Space Planning & Layout', 'Custom Wardrobe & Storage', 'Modular Kitchen Design', 'False Ceiling & Lighting', 'Flooring & Civil Work', 'Electrical & Plumbing'],
    image: heroLiving,
  },
  {
    id: 'commercial',
    title: 'Commercial Spaces',
    subtitle: 'Inspiring Workspaces',
    description: 'We design high-impact commercial interiors — offices, showrooms, restaurants, and retail spaces — that reflect your brand identity and elevate the client experience.',
    features: ['Office & Workspace Design', 'Retail & Showroom Interiors', 'Restaurant & Hospitality', 'Brand-Aligned Design', 'MEP Coordination', 'Turnkey Execution'],
    image: commercial,
  },
  {
    id: 'renovation',
    title: 'Renovation & Refurbishment',
    subtitle: 'Transform, Refresh, Elevate',
    description: 'Breathe new life into your existing space. From a single room refresh to a complete home makeover — we deliver remarkable transformations, on time and within budget.',
    features: ['Complete Home Renovation', 'Room-wise Makeovers', 'Kitchen & Bath Upgrades', 'Flooring & Ceiling Refresh', 'Civil & Plumbing', 'Electrical & Lighting'],
    image: foyer,
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
  { slug: 'kitchen-interior-designers', title: 'Kitchen', subtitle: 'The Heart of Your Home', image: kitchen, description: 'Modular and custom kitchen designs featuring premium materials, smart storage solutions, and world-class appliances integration.' },
  { slug: 'living-room', title: 'Living Room', subtitle: 'Where Life Happens', image: heroLiving, description: 'Expansive living spaces designed for comfort and elegance, with custom furniture, ambient lighting, and artistic elements.' },
  { slug: 'bedrooms', title: 'Bedrooms', subtitle: 'Your Personal Sanctuary', image: bedroom, description: 'Serene bedroom designs with premium fabrics, walk-in wardrobes, and spa-inspired ensuite bathrooms.' },
  { slug: 'foyer', title: 'Foyer', subtitle: 'First Impressions Matter', image: foyer, description: 'Grand entrance designs that set the tone for your entire home with statement lighting and premium finishes.' },
  { slug: 'dining-room', title: 'Dining Room', subtitle: 'Gather & Celebrate', image: dining, description: 'Elegant dining spaces designed for intimate dinners and grand celebrations, with bespoke furniture and lighting.' },
  { slug: 'kids-bedroom', title: 'Kids Bedroom', subtitle: 'Imagination Unleashed', image: bedroom, description: 'Creative and functional kids rooms that grow with your child, featuring smart storage and playful design elements.' },
  { slug: 'bathrooms', title: 'Bathrooms', subtitle: 'Spa at Home', image: bathroom, description: 'Luxurious bathroom designs with premium fixtures, natural stone, and spa-inspired layouts for ultimate relaxation.' },
  { slug: 'balcony', title: 'Balcony', subtitle: 'Outdoor Living', image: villa, description: 'Transform your balcony into a serene retreat with custom landscaping, comfortable seating, and ambient lighting.' },
]

export const testimonials = [
  { id: 1, name: 'Rajesh Kumar', project: '4BHK @ SNN Clermont', text: 'ATTICARCH transformed our apartment into a dream home. The attention to detail and quality of execution was exceptional. Every corner tells a story of luxury and comfort.', rating: 5 },
  { id: 2, name: 'Priya Sharma', project: '3BHK @ Prestige Lakeside', text: 'Working with ATTICARCH was a delightful experience. They understood our vision perfectly and delivered beyond our expectations. The design is both beautiful and functional.', rating: 5 },
  { id: 3, name: 'Arun Menon', project: 'Villa in Whitefield', text: 'From concept to completion, the team was professional and creative. Our villa looks like it belongs in an architectural magazine. Highly recommend their services!', rating: 5 },
  { id: 4, name: 'Sneha Patel', project: 'Corporate Office', text: 'ATTICARCH designed our office space and the result has boosted team morale and productivity. The design perfectly balances aesthetics with functionality.', rating: 5 },
]

export const blogPosts = [
  { id: 1, slug: 'winter-ready-homes', title: 'A Guide to Winter-Ready Homes in Bangalore', excerpt: 'As the pleasant Bangalore weather takes a winter turn, ensure your home is ready to embrace the cool breeze.', date: 'Jan 2024', image: heroLiving, category: 'Tips' },
  { id: 2, slug: 'office-interior-designers', title: 'Why Choose Atticarch for Your Dream Workspace', excerpt: 'The workplace is more than just a physical space; it influences creativity, collaboration, and productivity.', date: 'Dec 2023', image: commercial, category: 'Commercial' },
  { id: 3, slug: 'scenic-views-interior-design', title: "Utilizing Bangalore's Scenic Views in Interior Design", excerpt: 'Interior design takes on a new dimension, blending modern aesthetics with breathtaking scenic views.', date: 'Nov 2023', image: apartment, category: 'Design' },
]

export const stats = [
  { number: '22+', label: 'Years Experience' },
  { number: '500+', label: 'Projects Delivered' },
  { number: '100%', label: 'Client Satisfaction' },
  { number: '50+', label: 'Design Awards' },
]

export const processSteps = [
  { step: 1, title: 'Get Acquainted', description: 'We begin with understanding your vision, lifestyle, and preferences through an in-depth consultation.' },
  { step: 2, title: 'Concept Creation', description: 'Our designers develop unique concepts with mood boards, 3D renders, and material palettes for your approval.' },
  { step: 3, title: 'Design Development', description: 'Detailed drawings, specifications, and selections are finalized. Every element is meticulously planned.' },
  { step: 4, title: 'Registration', description: 'Project agreements, timelines, and budgets are formalized. Your dream project officially begins.' },
  { step: 5, title: 'Execution', description: 'Our skilled craftsmen bring the design to life with premium materials and uncompromising quality standards.' },
  { step: 6, title: 'Delivery', description: 'Final walkthrough, quality checks, and handover. We ensure every detail meets our exacting standards.' },
]
