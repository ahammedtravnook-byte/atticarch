import { useState, useEffect, useRef } from 'react'
import {
  motion, AnimatePresence, useInView, useScroll, useSpring, useTransform
} from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import {
  Phone, Send, Star, Check, Shield, Clock, Award, MessageCircle,
  ArrowRight, ArrowDown, MapPin, Mail, Sparkles, Box, Palette, FileText,
  ChevronDown, ShieldCheck, Wallet, Calendar, Users, Hammer
} from 'lucide-react'
import { projects as staticProjects, pickImages, partners, partnerLogo } from '../data/siteData'
import { useData } from '../context/DataContext'
import { db, doc, setDoc } from '../lib/firebase'
import './LandingPage.css'

/* ─────────────────────────────────────────
   CONFIG / FALLBACKS
───────────────────────────────────────── */

function fireConversion() {
  if (typeof window !== 'undefined' && window.gtag) {
    // window.gtag('event', 'conversion', { send_to: 'AW-XXXXX/YYYYY' })
  }
}

const HERO_IMAGES = pickImages(5, 0)
const GALLERY = staticProjects.slice(0, 6)

const BENEFITS = [
  { icon: Box, title: 'Free 3D Visualization', desc: 'See your home before we build it — photo-real renders included.' },
  { icon: Palette, title: 'Material Selection', desc: '500+ finishes from premium brand partners, all visualized for you.' },
  { icon: FileText, title: 'Detailed Quote', desc: 'Itemized BOQ with zero hidden costs — what you see is what you pay.' },
  { icon: MapPin, title: 'On-site Survey', desc: 'Our designer visits your home and measures everything — free.' },
]

const STATS = [
  { value: 1000, suffix: '+', label: 'Homes Delivered' },
  { value: 22, suffix: ' yrs', label: 'Since 2002' },
  { value: 4.5, suffix: '★', label: 'Google Rating', decimal: true },
  { value: 100, suffix: '%', label: 'On-Time Handover' },
]

const PRICING = [
  {
    type: '1 BHK',
    starts: '₹4 Lacs',
    range: '₹4L – ₹6L',
    inclusions: ['Modular Kitchen', '1 Wardrobe', 'False Ceiling (Living)', 'TV Unit', 'Basic Electrical'],
  },
  {
    type: '2 BHK',
    starts: '₹6 Lacs',
    range: '₹6L – ₹10L',
    featured: true,
    inclusions: ['Modular Kitchen', '2 Wardrobes', 'Full False Ceiling', 'TV Unit + Crockery', 'Lighting & Electrical', 'Painting Included'],
  },
  {
    type: '3 BHK +',
    starts: '₹10 Lacs',
    range: '₹10L – ₹18L',
    inclusions: ['Premium Modular Kitchen', '3+ Wardrobes', 'Full False Ceiling', 'TV + Crockery + Pooja', 'Premium Finishes', 'Bathroom Upgrades'],
  },
]

const STEPS = [
  { num: '01', day: 'Day 1', title: 'Free Consultation Call', desc: 'A 20-minute call with our senior designer to understand your style, family needs and budget.' },
  { num: '02', day: 'Days 2-7', title: '3D Design & Quote', desc: 'You receive photo-real 3D renders of every room + a detailed itemized BOQ — completely free.' },
  { num: '03', day: 'Day 8 onwards', title: 'Execute & Move In', desc: 'Sign-off and we begin. Weekly progress photos, on-time handover, 10-year warranty.' },
]

const TESTIMONIALS = [
  { name: 'Amit & Neetoo', project: 'Sobha Royal Pavilion', stars: 5, text: 'ATTICARCH transformed our 3BHK into a dream home. The 3D renders matched the final result exactly. Worth every rupee.' },
  { name: 'Kranti & Deepti', project: 'Assetz Marq', stars: 5, text: 'Punctual, transparent and incredibly skilled. They delivered our apartment one week ahead of schedule.' },
  { name: 'Moumita Sen', project: 'Brigade Utopia', stars: 5, text: 'From concept to keys in 11 weeks. Premium quality, fair pricing, zero stress. Highly recommend.' },
]

const FAQ = [
  { q: 'How much does interior design cost in Bangalore?', a: 'Our turnkey interior projects start at ₹4 Lacs for 1BHK, ₹6 Lacs for 2BHK and ₹10 Lacs for 3BHK+. You get an exact quote after the free consultation — no hidden costs, ever.' },
  { q: 'How long does a typical project take?', a: 'A 2BHK takes 45-60 days from sign-off to handover. 3BHK and villas: 60-90 days. We commit to a date in writing and pay you for delays.' },
  { q: 'What does the 10-year warranty cover?', a: 'Full workmanship warranty on all carpentry, modular units, false ceiling, electrical and plumbing work executed by us. We come back and fix anything, free.' },
  { q: 'Do you offer EMI or flexible payment plans?', a: 'Yes. We accept staged payments tied to project milestones and can also help arrange EMI through partner banks.' },
  { q: 'What brands and materials do you use?', a: 'CenturyPly, Kitply, Hettich, Blum, Saint-Gobain, Asian Paints, KAFF, Elica and more — all premium IS-certified brands you can verify.' },
  { q: 'Which areas in Bangalore do you serve?', a: 'All of Bangalore — Whitefield, Sarjapur, Electronic City, North Bangalore, JP Nagar, HSR Layout, Indiranagar and more. We have project teams across the city.' },
]

const MARQUEE_ITEMS = [
  'Free 3D Design', '10-Year Warranty', 'Since 2002', 'In-House Production',
  'On-Time Handover', 'Zero Hidden Costs', 'Free Consultation',
]

/* ─────────────────────────────────────────
   UTILITY HELPERS
───────────────────────────────────────── */

const getBenefitIcon = (iconName) => {
  switch (iconName) {
    case 'Box': return Box
    case 'Palette': return Palette
    case 'FileText': return FileText
    case 'MapPin': return MapPin
    case 'Shield': return Shield
    case 'Clock': return Clock
    case 'Award': return Award
    default: return Box
  }
}

const parseInclusions = (inc) => {
  if (Array.isArray(inc)) return inc
  if (typeof inc === 'string') return inc.split(',').map(s => s.trim()).filter(Boolean)
  return []
}

function useCountUp(end, duration = 1800, decimal = false, start = false) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!start) return
    let raf
    const t0 = performance.now()
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / duration)
      const eased = 1 - Math.pow(1 - p, 3)
      setVal(decimal ? +(end * eased).toFixed(1) : Math.floor(end * eased))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [end, duration, decimal, start])
  return val
}

/* Per-word masked reveal for big serif headlines */
function MaskedLine({ text, delay = 0, className = '' }) {
  return (
    <span className={`lpx-mask-line ${className}`}>
      {String(text).split(' ').map((w, i) => (
        <span className="lpx-mask-word" key={i}>
          <motion.span
            className="lpx-mask-inner"
            initial={{ y: '115%' }}
            animate={{ y: 0 }}
            transition={{ duration: 1, delay: delay + i * 0.09, ease: [0.16, 1, 0.3, 1] }}
          >
            {w}&nbsp;
          </motion.span>
        </span>
      ))}
    </span>
  )
}

/* Section heading: mono kicker + serif title that reveals on scroll */
function SectionHead({ kicker, children, sub, light = false, align = 'center' }) {
  return (
    <div className={`lpx-head lpx-head--${align} ${light ? 'lpx-head--light' : ''}`}>
      <motion.span
        className="lpx-kicker"
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.6 }}
      >
        <i />{kicker}<i />
      </motion.span>
      <motion.h2
        className="lpx-h2"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.85, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.h2>
      {sub && (
        <motion.p
          className="lpx-sub"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, delay: 0.18 }}
        >
          {sub}
        </motion.p>
      )}
    </div>
  )
}

function StatBlock({ stat, index }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })
  const v = useCountUp(stat.value, 2000, stat.decimal, inView)
  return (
    <motion.div
      ref={ref}
      className="lpx-stat"
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
    >
      <span className="lpx-stat__value">
        {stat.decimal ? v.toFixed(1) : v}
        <em>{stat.suffix}</em>
      </span>
      <span className="lpx-stat__rule" />
      <span className="lpx-stat__label">{stat.label}</span>
    </motion.div>
  )
}

function FaqItem({ q, a, idx, open, onToggle }) {
  return (
    <motion.div
      className={`lpx-faq ${open ? 'open' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: idx * 0.05 }}
    >
      <button className="lpx-faq__q" onClick={onToggle} aria-expanded={open}>
        <span className="lpx-faq__num">{String(idx + 1).padStart(2, '0')}</span>
        <span className="lpx-faq__text">{q}</span>
        <motion.span className="lpx-faq__chev" animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.35 }}>
          <ChevronDown size={18} />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="a"
            className="lpx-faq__a-wrap"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="lpx-faq__a">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/* Parallax gallery — three columns drifting at different speeds */
function ParallaxGallery({ items }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y1 = useTransform(scrollYProgress, [0, 1], [60, -90])
  const y2 = useTransform(scrollYProgress, [0, 1], [-40, 70])
  const y3 = useTransform(scrollYProgress, [0, 1], [80, -60])
  const cols = [
    { y: y1, items: [items[0], items[3]].filter(Boolean) },
    { y: y2, items: [items[1], items[4]].filter(Boolean) },
    { y: y3, items: [items[2], items[5]].filter(Boolean) },
  ]
  return (
    <div className="lpx-collage" ref={ref}>
      {cols.map((col, ci) => (
        <motion.div className="lpx-collage__col" style={{ y: col.y }} key={ci}>
          {col.items.map((p, i) => (
            <motion.figure
              className="lpx-collage__item"
              key={p.id || i}
              initial={{ opacity: 0, scale: 0.94 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, delay: ci * 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
              <img src={p.image} alt={p.title} loading="lazy" />
              <figcaption>
                <span>{p.category}</span>
                <h4>{p.title}</h4>
                <p>{p.location}</p>
              </figcaption>
            </motion.figure>
          ))}
        </motion.div>
      ))}
    </div>
  )
}

/* ─────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────── */

export default function LandingPage() {
  const { landingSettings, projects, testimonials } = useData()
  const [form, setForm] = useState({ name: '', phone: '', email: '', type: '2BHK', budget: '6-10 Lacs' })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | success | error
  const [heroIdx, setHeroIdx] = useState(0)
  const [openFaq, setOpenFaq] = useState(0)
  const [showStickyMobile, setShowStickyMobile] = useState(false)

  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 })

  /* Hero parallax */
  const heroRef = useRef(null)
  const { scrollYProgress: heroProg } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroBgY = useTransform(heroProg, [0, 1], ['0%', '18%'])
  const heroFade = useTransform(heroProg, [0, 0.7], [1, 0])

  /* Timeline draw */
  const stepsRef = useRef(null)
  const { scrollYProgress: stepsProg } = useScroll({ target: stepsRef, offset: ['start 0.75', 'end 0.6'] })
  const lineScale = useSpring(stepsProg, { stiffness: 90, damping: 26 })

  /* Final CTA parallax */
  const ctaRef = useRef(null)
  const { scrollYProgress: ctaProg } = useScroll({ target: ctaRef, offset: ['start end', 'end start'] })
  const ctaBgY = useTransform(ctaProg, [0, 1], ['-12%', '12%'])

  // Database settings bindings with fallbacks
  const heroTitleLine1 = landingSettings?.heroTitleLine1 || 'Luxury Interiors in'
  const heroTitleLine2 = landingSettings?.heroTitleLine2 || 'Bangalore'
  const heroSubtitle = landingSettings?.heroSubtitle || 'Free 3D Design + Detailed Quote in 48 Hours'
  const bullets = landingSettings?.bullets || [
    'Free 3D visualization of every room',
    '10-year workmanship warranty',
    'Turnkey execution — starts ₹4 Lacs'
  ]
  const phone = landingSettings?.phone || '+919845013138'
  const whatsapp = landingSettings?.whatsapp || '919845013138'
  const whatsappPrefill = landingSettings?.whatsappPrefill || "Hi ATTICARCH, I'd like a free interior design consultation."

  const displayBenefits = landingSettings?.benefits || BENEFITS
  const displayStats = landingSettings?.stats || STATS
  const displayPricing = landingSettings?.pricing || PRICING
  const displaySteps = landingSettings?.steps || STEPS
  const displayFAQs = landingSettings?.faqs || FAQ
  const displayTestimonials = testimonials?.length > 0 ? testimonials : TESTIMONIALS

  const heroImages = projects?.length > 0
    ? projects.slice(0, 5).map(p => p.image || p.imageUrl || p.images?.[0]).filter(Boolean)
    : HERO_IMAGES

  const galleryProjects = projects?.length > 0
    ? projects.filter(p => p.category !== 'residential').slice(0, 6)
    : GALLERY

  /* Cycle hero images */
  useEffect(() => {
    if (heroImages.length === 0) return
    const t = setInterval(() => setHeroIdx(i => (i + 1) % heroImages.length), 5200)
    return () => clearInterval(t)
  }, [heroImages.length])

  /* Mobile sticky CTA shows after small scroll */
  useEffect(() => {
    const onScroll = () => setShowStickyMobile(window.scrollY > 600)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const validate = () => {
    const e = {}
    if (!form.name.trim() || form.name.trim().length < 2) e.name = 'Please enter your name'
    if (!/^\d{10}$/.test(form.phone.replace(/\D/g, ''))) e.phone = 'Enter a valid 10-digit phone'
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setStatus('sending')

    /* Write the lead to Firestore — same `leads` collection the admin panel
       reads. Failures are surfaced honestly so no lead is silently lost. */
    try {
      const leadId = `lead_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
      await setDoc(doc(db, 'leads', leadId), {
        id: leadId,
        name: form.name.trim(),
        email: (form.email || '').trim(),
        phone: form.phone.replace(/\D/g, ''),
        projectType: form.type || '',
        budget: form.budget || '',
        verified: false,
        source: 'landing-page',
        createdAt: new Date().toISOString(),
      })
      setStatus('success')
      fireConversion()
    } catch (err) {
      console.error('Lead submit error:', err)
      setStatus('error')
    }
  }

  const update = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const whatsappLink = `https://wa.me/${whatsapp}?text=${encodeURIComponent(whatsappPrefill)}`
  const telLink = `tel:${phone}`

  return (
    <motion.main className="lpx" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Helmet>
        <title>Free Interior Design Consultation in Bangalore | ATTICARCH</title>
        <meta name="description" content="Get a FREE 3D design + quote in 48 hours. Bangalore's most trusted interior designers since 2002. 10-year warranty. Starting from ₹4 Lacs. Book your free consultation today." />
        <meta property="og:title" content="ATTICARCH — Free Interior Design Consultation in Bangalore" />
        <meta property="og:description" content="Free 3D design + detailed quote in 48 hours. Turnkey interiors with 10-year warranty. Since 2002." />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'LocalBusiness',
          name: 'ATTICARCH',
          telephone: phone,
          email: 'sales@atticarch.com',
          address: { '@type': 'PostalAddress', streetAddress: '#12, 3rd Floor, 10th Main, Outer Ring Rd, Banaswadi', addressLocality: 'Bengaluru', addressRegion: 'KA', postalCode: '560043', addressCountry: 'IN' },
          priceRange: '₹₹₹',
          aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.5', reviewCount: '41' },
        })}</script>
      </Helmet>

      {/* Scroll progress hairline */}
      <motion.div className="lpx-progress" style={{ scaleX }} />

      {/* ═══════════════════════════════════════
          TOP BAR
      ═══════════════════════════════════════ */}
      <header className="lpx-topbar">
        <div className="lpx-topbar__inner">
          <div className="lpx-topbar__brand">
            <span className="lpx-topbar__mark">A</span>
            <div className="lpx-topbar__name">
              <strong>ATTICARCH</strong>
              <span>Bangalore · Est. 2002</span>
            </div>
          </div>
          <div className="lpx-topbar__actions">
            <a href={telLink} className="lpx-topbar__phone">
              <Phone size={13} /> <span>{phone}</span>
            </a>
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="lpx-topbar__wa">
              <MessageCircle size={13} /> <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </header>

      {/* ═══════════════════════════════════════
          HERO — cinematic
      ═══════════════════════════════════════ */}
      <section className="lpx-hero" ref={heroRef}>
        <motion.div className="lpx-hero__bg" style={{ y: heroBgY }}>
          <AnimatePresence mode="sync">
            {heroImages[heroIdx] && (
              <motion.img
                key={heroIdx}
                src={heroImages[heroIdx]}
                alt=""
                initial={{ opacity: 0, scale: 1.14 }}
                animate={{ opacity: 1, scale: 1.04 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 2.2, ease: 'easeInOut' }}
              />
            )}
          </AnimatePresence>
        </motion.div>
        <div className="lpx-hero__veil" />
        <div className="lpx-hero__frame" aria-hidden="true" />

        <motion.div className="lpx-hero__inner" style={{ opacity: heroFade }}>
          <div className="lpx-hero__copy">
            <motion.span
              className="lpx-hero__pill"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
            >
              <Sparkles size={12} /> Free Consultation · Limited Slots This Week
            </motion.span>

            <h1 className="lpx-hero__title">
              <MaskedLine text={heroTitleLine1} delay={0.25} />
              <MaskedLine text={heroTitleLine2} delay={0.45} className="lpx-mask-line--gold" />
            </h1>

            <motion.div
              className="lpx-hero__ornament"
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.9, delay: 0.85 }}
            >
              <i /><b /><i />
            </motion.div>

            <motion.p
              className="lpx-hero__subtitle"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.95 }}
            >
              {heroSubtitle}
            </motion.p>

            <motion.ul
              className="lpx-hero__bullets"
              initial="hidden"
              animate="show"
              variants={{ show: { transition: { staggerChildren: 0.12, delayChildren: 1.05 } } }}
            >
              {bullets.map((b, i) => (
                <motion.li
                  key={i}
                  variants={{ hidden: { opacity: 0, x: -18 }, show: { opacity: 1, x: 0, transition: { duration: 0.6 } } }}
                >
                  <Check size={14} /> {b}
                </motion.li>
              ))}
            </motion.ul>

            <motion.div
              className="lpx-hero__trust"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.4 }}
            >
              <div className="lpx-hero__stars">
                {[...Array(5)].map((_, i) => <Star key={i} size={13} fill="#C9A96E" color="#C9A96E" />)}
              </div>
              <span><strong>4.5</strong> · 41 Google Reviews</span>
            </motion.div>

            <motion.div
              className="lpx-hero__ctas"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.5 }}
            >
              <a href="#lead-form" className="lpx-btn lpx-btn--gold">
                <span>Book Free Consultation</span> <ArrowRight size={15} />
              </a>
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="lpx-btn lpx-btn--line">
                <MessageCircle size={15} /> <span>WhatsApp Now</span>
              </a>
            </motion.div>
          </div>

          {/* LEAD FORM — gold-framed card */}
          <motion.div
            id="lead-form"
            className="lpx-form-wrap"
            initial={{ opacity: 0, y: 44 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="lpx-form-card">
              <i className="lpx-tick lpx-tick--tl" /><i className="lpx-tick lpx-tick--tr" />
              <i className="lpx-tick lpx-tick--bl" /><i className="lpx-tick lpx-tick--br" />

              <div className="lpx-form-card__head">
                <span className="lpx-form-card__kicker">Complimentary</span>
                <h2>Get Your Free Design</h2>
                <p>Our senior designer will call you within 2 hours.</p>
              </div>

              <AnimatePresence mode="wait">
                {status === 'success' ? (
                  <motion.div
                    key="success" className="lpx-form-success"
                    initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="lpx-form-success__icon"><Check size={32} /></div>
                    <h3>Thank you, {form.name.split(' ')[0]}!</h3>
                    <p>We've received your request. A senior designer will call you within 2 hours.</p>
                    <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="lpx-btn lpx-btn--gold" style={{ marginTop: 18 }}>
                      <MessageCircle size={15} /> <span>Continue on WhatsApp</span>
                    </a>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form" onSubmit={handleSubmit} className="lpx-form"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  >
                    <div className={`lpx-field ${errors.name ? 'err' : ''}`}>
                      <label>Full Name <span>*</span></label>
                      <input type="text" placeholder="Your name" value={form.name} onChange={update('name')} />
                      {errors.name && <small>{errors.name}</small>}
                    </div>
                    <div className={`lpx-field ${errors.phone ? 'err' : ''}`}>
                      <label>Phone <span>*</span></label>
                      <input type="tel" placeholder="10-digit mobile" value={form.phone} onChange={update('phone')} maxLength={10} />
                      {errors.phone && <small>{errors.phone}</small>}
                    </div>
                    <div className="lpx-field-row">
                      <div className="lpx-field">
                        <label>Property Type</label>
                        <select value={form.type} onChange={update('type')}>
                          <option>1 BHK</option>
                          <option>2 BHK</option>
                          <option>3 BHK</option>
                          <option>4 BHK / Villa</option>
                          <option>Commercial</option>
                        </select>
                      </div>
                      <div className="lpx-field">
                        <label>Budget</label>
                        <select value={form.budget} onChange={update('budget')}>
                          <option>Under 4 Lacs</option>
                          <option>4-6 Lacs</option>
                          <option>6-10 Lacs</option>
                          <option>10-18 Lacs</option>
                          <option>18 Lacs+</option>
                        </select>
                      </div>
                    </div>
                    <button type="submit" disabled={status === 'sending'} className="lpx-form__submit">
                      <span className="lpx-form__submit-sheen" />
                      {status === 'sending' ? 'Sending…' : <>Get My Free 3D Design <ArrowRight size={15} /></>}
                    </button>
                    {status === 'error' && (
                      <p className="lpx-form__error">
                        Couldn't submit right now. Please retry, or call us at {phone}.
                      </p>
                    )}
                    <p className="lpx-form__privacy">
                      <ShieldCheck size={12} /> Your details are 100% secure. We never spam.
                    </p>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>

        <motion.a
          href="#lpx-marquee" className="lpx-hero__scrollcue"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}
          aria-label="Scroll down"
        >
          <span>Scroll</span>
          <ArrowDown size={14} />
        </motion.a>
      </section>

      {/* ═══════════════════════════════════════
          GOLD MARQUEE
      ═══════════════════════════════════════ */}
      <div className="lpx-marquee" id="lpx-marquee" aria-hidden="true">
        <div className="lpx-marquee__track">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((m, i) => (
            <span key={i}>{m} <b>✦</b></span>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════
          STATS — giant numerals
      ═══════════════════════════════════════ */}
      <section className="lpx-stats">
        <div className="lpx-stats__grid">
          {displayStats.map((s, i) => <StatBlock key={i} stat={s} index={i} />)}
        </div>
        <div className="lpx-stats__trustline">
          <Users size={15} />
          <span><strong>2,000+</strong> Bangalore homeowners trust us since 2002</span>
        </div>
        <div className="lpx-partners">
          {partners.slice(0, 8).map(p => {
            const logo = partnerLogo(p.slug)
            return (
              <div key={p.slug} className="lpx-partners__logo" title={p.name}>
                {logo ? <img src={logo} alt={p.name} /> : <span>{p.name}</span>}
              </div>
            )
          })}
        </div>
      </section>

      {/* ═══════════════════════════════════════
          BENEFITS — editorial numbered rows
      ═══════════════════════════════════════ */}
      <section className="lpx-section lpx-benefits">
        <SectionHead
          kicker="Your Free Consultation Includes"
          sub="A serious design conversation — not a sales pitch. You leave with renders, materials and an exact price."
        >
          Everything You Need <em>Before You Commit</em>
        </SectionHead>
        <div className="lpx-benefits__list">
          {displayBenefits.map((b, i) => {
            const IconComponent = b.icon || getBenefitIcon(b.iconName)
            return (
              <motion.div
                key={i} className="lpx-benefit"
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className="lpx-benefit__num">{String(i + 1).padStart(2, '0')}</span>
                <span className="lpx-benefit__icon"><IconComponent size={22} /></span>
                <div className="lpx-benefit__body">
                  <h3>{b.title}</h3>
                  <p>{b.desc}</p>
                </div>
                <span className="lpx-benefit__star">✦</span>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* ═══════════════════════════════════════
          GALLERY — parallax collage
      ═══════════════════════════════════════ */}
      <section className="lpx-section lpx-gallery">
        <SectionHead kicker="Recent Transformations">
          See What We've <em>Built</em>
        </SectionHead>
        <ParallaxGallery items={galleryProjects} />
        <div className="lpx-center-cta">
          <a href="#lead-form" className="lpx-btn lpx-btn--gold">
            <span>Get My Design</span> <ArrowRight size={15} />
          </a>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          HOW IT WORKS — drawn timeline
      ═══════════════════════════════════════ */}
      <section className="lpx-section lpx-how">
        <SectionHead kicker="3 Simple Steps">
          From Click to <em>Keys</em>
        </SectionHead>
        <div className="lpx-how__timeline" ref={stepsRef}>
          <div className="lpx-how__line"><motion.i style={{ scaleY: lineScale }} /></div>
          {displaySteps.map((s, i) => (
            <motion.div
              key={i}
              className={`lpx-how__step ${i % 2 ? 'lpx-how__step--right' : ''}`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="lpx-how__dot" />
              <span className="lpx-how__num">{s.num}</span>
              <div className="lpx-how__card">
                <span className="lpx-how__day">{s.day}</span>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════
          PRICING
      ═══════════════════════════════════════ */}
      <section className="lpx-section lpx-pricing">
        <SectionHead
          kicker="Transparent Pricing"
          sub="Starting prices for fully-furnished, turnkey interiors. Get your exact quote in the free consultation."
        >
          No Hidden Costs. <em>Ever.</em>
        </SectionHead>
        <div className="lpx-pricing__grid">
          {displayPricing.map((p, i) => (
            <motion.div
              key={i}
              className={`lpx-price ${p.featured ? 'featured' : ''}`}
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              {p.featured && <span className="lpx-price__badge">Most Popular</span>}
              <span className="lpx-price__type">{p.type}</span>
              <div className="lpx-price__amount">
                <small>Starts at</small>
                <strong>{p.starts}</strong>
                <span>Range: {p.range}</span>
              </div>
              <span className="lpx-price__rule" />
              <ul>
                {parseInclusions(p.inclusions).map((inc, j) => (
                  <li key={j}><Check size={13} /> {inc}</li>
                ))}
              </ul>
              <a href="#lead-form" className="lpx-btn lpx-btn--line lpx-btn--full">
                <span>Get Exact Quote</span> <ArrowRight size={14} />
              </a>
            </motion.div>
          ))}
        </div>
        <div className="lpx-pricing__note">
          <span><Wallet size={13} /> EMI options available</span>
          <span><Calendar size={13} /> Milestone stage payments</span>
          <span><Hammer size={13} /> 10-year carpentry warranty</span>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          TESTIMONIALS — editorial quotes
      ═══════════════════════════════════════ */}
      <section className="lpx-section lpx-quotes">
        <SectionHead kicker="What Our Clients Say" light>
          Real Stories. <em>Real Homes.</em>
        </SectionHead>
        <div className="lpx-quotes__grid">
          {displayTestimonials.slice(0, 3).map((t, i) => (
            <motion.blockquote
              key={i} className="lpx-quote"
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="lpx-quote__mark">"</span>
              <div className="lpx-quote__stars">
                {[...Array(t.stars || t.rating || 5)].map((_, j) => (
                  <Star key={j} size={13} fill="#C9A96E" color="#C9A96E" />
                ))}
              </div>
              <p>{t.text}</p>
              <footer>
                <span className="lpx-quote__avatar">
                  {t.avatar
                    ? <img src={t.avatar} alt="" />
                    : (t.name || 'A').charAt(0)}
                </span>
                <span className="lpx-quote__who">
                  <strong>{t.name}</strong>
                  <em>{t.project || 'Bangalore'}</em>
                </span>
              </footer>
            </motion.blockquote>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════
          FAQ
      ═══════════════════════════════════════ */}
      <section className="lpx-section lpx-faqs">
        <SectionHead kicker="Got Questions?">
          <em>Answered.</em>
        </SectionHead>
        <div className="lpx-faqs__list">
          {displayFAQs.map((f, i) => (
            <FaqItem
              key={i} q={f.q} a={f.a} idx={i}
              open={openFaq === i}
              onToggle={() => setOpenFaq(openFaq === i ? -1 : i)}
            />
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════
          FINAL CTA — parallax
      ═══════════════════════════════════════ */}
      <section className="lpx-final" ref={ctaRef}>
        <motion.div className="lpx-final__bg" style={{ y: ctaBgY }}>
          {heroImages[0] && <img src={heroImages[0]} alt="" />}
        </motion.div>
        <div className="lpx-final__veil" />
        <motion.div
          className="lpx-final__inner"
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="lpx-final__pill"><Sparkles size={12} /> Only 7 slots left this week</span>
          <h2>Ready to Begin Your <em>Dream Home?</em></h2>
          <p>Free consultation. Free 3D design. Free quote. Zero obligation.</p>
          <div className="lpx-final__buttons">
            <a href="#lead-form" className="lpx-btn lpx-btn--gold lpx-btn--xl">
              <span>Book Free Consultation</span> <ArrowRight size={17} />
            </a>
            <a href={telLink} className="lpx-btn lpx-btn--line lpx-btn--xl">
              <Phone size={16} /> <span>{phone}</span>
            </a>
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════
          MINI FOOTER
      ═══════════════════════════════════════ */}
      <footer className="lpx-footer">
        <div className="lpx-footer__inner">
          <div className="lpx-footer__brand">
            <strong>ATTICARCH</strong>
            <span>Transforming Spaces, Transforming Lives · Since 2002</span>
          </div>
          <div className="lpx-footer__contact">
            <a href={telLink}><Phone size={13} /> {phone}</a>
            <a href="mailto:sales@atticarch.com"><Mail size={13} /> sales@atticarch.com</a>
            <span><MapPin size={13} /> #12, 3rd Floor, 10th Main, Outer Ring Rd, Banaswadi, Bengaluru 560043</span>
          </div>
          <small>© {new Date().getFullYear()} ATTICARCH. All rights reserved.</small>
        </div>
      </footer>

      {/* ═══════════════════════════════════════
          MOBILE STICKY CTA
      ═══════════════════════════════════════ */}
      <AnimatePresence>
        {showStickyMobile && (
          <motion.div
            className="lpx-sticky"
            initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <a href={telLink} className="lpx-sticky__btn lpx-sticky__btn--call">
              <Phone size={17} /> Call Now
            </a>
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="lpx-sticky__btn lpx-sticky__btn--wa">
              <MessageCircle size={17} /> WhatsApp
            </a>
            <a href="#lead-form" className="lpx-sticky__btn lpx-sticky__btn--form">
              <Send size={17} /> Form
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.main>
  )
}
