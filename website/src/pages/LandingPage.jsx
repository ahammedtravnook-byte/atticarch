import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useInView, useScroll, useSpring } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import {
  Phone, Send, Star, Check, Shield, Clock, Award, MessageCircle,
  ArrowRight, MapPin, Mail, Sparkles, Box, Palette, FileText,
  Home as HomeIcon, ChevronDown, ShieldCheck, Wallet, Calendar, Users, Hammer
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
  { value: 4.8, suffix: '★', label: 'Google Rating', decimal: true },
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

function StatCard({ stat, index }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.4 })
  const v = useCountUp(stat.value, 1800, stat.decimal, inView)
  return (
    <motion.div
      ref={ref}
      className="lp-stat"
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.08 }}
    >
      <div className="lp-stat__value">
        {stat.decimal ? v.toFixed(1) : v}<span>{stat.suffix}</span>
      </div>
      <div className="lp-stat__label">{stat.label}</div>
    </motion.div>
  )
}

function FaqItem({ q, a, idx, open, onToggle }) {
  return (
    <motion.div
      className={`lp-faq ${open ? 'open' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, delay: idx * 0.05 }}
    >
      <button className="lp-faq__q" onClick={onToggle} aria-expanded={open}>
        <span>{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.3 }}>
          <ChevronDown size={20} />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="a"
            className="lp-faq__a-wrap"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="lp-faq__a">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
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
    const t = setInterval(() => setHeroIdx(i => (i + 1) % heroImages.length), 5000)
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
    <motion.main className="lp" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
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
          address: { '@type': 'PostalAddress', addressLocality: 'Bangalore', addressRegion: 'KA', addressCountry: 'IN' },
          priceRange: '₹₹₹',
          aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.8', reviewCount: '347' },
        })}</script>
      </Helmet>

      {/* Scroll progress bar */}
      <motion.div className="lp-scrollbar" style={{ scaleX }} />

      {/* ═══════════════════════════════════════
          TOP TRUST BAR
      ═══════════════════════════════════════ */}
      <div className="lp-topbar">
        <div className="lp-topbar__inner">
          <div className="lp-topbar__brand">
            <span className="lp-topbar__dot" />
            <strong>ATTICARCH</strong>
            <span className="lp-topbar__est">Since 2002</span>
          </div>
          <div className="lp-topbar__actions">
            <a href={telLink} className="lp-topbar__phone">
              <Phone size={14} /> <span>{phone}</span>
            </a>
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="lp-topbar__wa">
              <MessageCircle size={14} /> <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════
          HERO
      ═══════════════════════════════════════ */}
      <section className="lp-hero">
        <div className="lp-hero__bg">
          <AnimatePresence mode="sync">
            {heroImages[heroIdx] && (
              <motion.img
                key={heroIdx}
                src={heroImages[heroIdx]}
                alt=""
                className="lp-hero__bg-img"
                initial={{ opacity: 0, scale: 1.12 }}
                animate={{ opacity: 1, scale: 1.04 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 2, ease: 'easeInOut' }}
              />
            )}
          </AnimatePresence>
          <div className="lp-hero__overlay" />
        </div>

        <motion.div className="lp-hero__orb lp-hero__orb--1"
          animate={{ y: [0, -30, 0], scale: [1, 1.08, 1] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }} />
        <motion.div className="lp-hero__orb lp-hero__orb--2"
          animate={{ y: [0, 24, 0], x: [0, -16, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }} />

        <div className="lp-hero__inner">
          <motion.div
            className="lp-hero__left"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.span className="lp-hero__pill"
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}>
              <Sparkles size={13} /> Free Consultation · Limited Slots This Week
            </motion.span>

            <h1 className="lp-hero__title">
              <span className="lp-hero__title-line">{heroTitleLine1}</span>
              <span className="lp-hero__title-line lp-hero__title-line--gold">
                <em>{heroTitleLine2}</em>
              </span>
              <span className="lp-hero__title-sub">{heroSubtitle}</span>
            </h1>

            <ul className="lp-hero__bullets">
              {bullets.map((b, i) => (
                <li key={i}><Check size={16} /> {b}</li>
              ))}
            </ul>

            <div className="lp-hero__trust-row">
              <div className="lp-hero__stars">
                {[...Array(5)].map((_, i) => <Star key={i} size={15} fill="#FFB800" color="#FFB800" />)}
              </div>
              <span className="lp-hero__rating-text"><strong>4.8</strong> · 347+ Google Reviews</span>
            </div>

            <div className="lp-hero__ctas">
              <a href="#lead-form" className="lp-btn lp-btn--primary">
                Book Free Consultation <ArrowRight size={16} />
              </a>
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="lp-btn lp-btn--ghost">
                <MessageCircle size={16} /> WhatsApp Now
              </a>
            </div>

            <div className="lp-hero__featured">
              <span>As featured in:</span>
              <div className="lp-hero__featured-logos">
                {partners.slice(0, 5).map(p => {
                  const logo = partnerLogo(p.slug)
                  return logo ? <img key={p.slug} src={logo} alt={p.name} /> : null
                })}
              </div>
            </div>
          </motion.div>

          {/* FORM */}
          <motion.div
            id="lead-form"
            className="lp-hero__form-wrap"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="lp-form-card">
              <div className="lp-form-card__head">
                <h2>Get Your Free Design</h2>
                <p>Fill in your details — our designer will call within 2 hours.</p>
              </div>

              <AnimatePresence mode="wait">
                {status === 'success' ? (
                  <motion.div key="success" className="lp-form-success"
                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}>
                    <div className="lp-form-success__icon"><Check size={36} /></div>
                    <h3>Thank you, {form.name.split(' ')[0]}!</h3>
                    <p>We've received your request. A senior designer will call you within 2 hours.</p>
                    <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="lp-btn lp-btn--primary" style={{ marginTop: 18 }}>
                      <MessageCircle size={16} /> Continue on WhatsApp
                    </a>
                  </motion.div>
                ) : (
                  <motion.form key="form" onSubmit={handleSubmit} className="lp-form"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <div className={`lp-field ${errors.name ? 'err' : ''}`}>
                      <label>Full Name <span>*</span></label>
                      <input type="text" placeholder="Your name" value={form.name} onChange={update('name')} />
                      {errors.name && <small>{errors.name}</small>}
                    </div>
                    <div className={`lp-field ${errors.phone ? 'err' : ''}`}>
                      <label>Phone <span>*</span></label>
                      <input type="tel" placeholder="10-digit mobile" value={form.phone} onChange={update('phone')} maxLength={10} />
                      {errors.phone && <small>{errors.phone}</small>}
                    </div>
                    <div className="lp-field-row">
                      <div className="lp-field">
                        <label>Property Type</label>
                        <select value={form.type} onChange={update('type')}>
                          <option>1 BHK</option>
                          <option>2 BHK</option>
                          <option>3 BHK</option>
                          <option>4 BHK / Villa</option>
                          <option>Commercial</option>
                        </select>
                      </div>
                      <div className="lp-field">
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
                    <button type="submit" disabled={status === 'sending'} className="lp-form__submit">
                      {status === 'sending' ? 'Sending…' : <>Get My Free 3D Design <ArrowRight size={16} /></>}
                    </button>
                    {status === 'error' && (
                      <p style={{ color: '#e05252', fontSize: 13, marginTop: 10, textAlign: 'center' }}>
                        Couldn't submit right now. Please retry, or call us at {phone}.
                      </p>
                    )}
                    <p className="lp-form__privacy">
                      <ShieldCheck size={12} /> Your details are 100% secure. We never spam.
                    </p>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          TRUST STRIP
      ═══════════════════════════════════════ */}
      <section className="lp-trust">
        <div className="lp-trust__inner">
          <div className="lp-trust__badge">
            <Users size={18} />
            <span><strong>2,000+</strong> Bangalore homeowners trust us since 2002</span>
          </div>
          <div className="lp-trust__logos">
            {partners.slice(0, 8).map(p => {
              const logo = partnerLogo(p.slug)
              return (
                <div key={p.slug} className="lp-trust__logo" title={p.name}>
                  {logo ? <img src={logo} alt={p.name} /> : <span>{p.name}</span>}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          STATS
      ═══════════════════════════════════════ */}
      <section className="lp-stats-section">
        <div className="lp-stats-grid">
          {displayStats.map((s, i) => <StatCard key={i} stat={s} index={i} />)}
        </div>
      </section>

      {/* ═══════════════════════════════════════
          BENEFITS — WHAT'S INCLUDED
      ═══════════════════════════════════════ */}
      <section className="lp-section lp-benefits">
        <div className="lp-section__head">
          <span className="lp-eyebrow">Your Free Consultation Includes</span>
          <h2 className="lp-h2">Everything You Need <em>Before You Commit</em></h2>
          <p className="lp-sub">A serious design conversation — not a sales pitch. You leave with renders, materials and an exact price.</p>
        </div>
        <div className="lp-benefits__grid">
          {displayBenefits.map((b, i) => {
            const IconComponent = b.icon || getBenefitIcon(b.iconName)
            return (
              <motion.div key={i} className="lp-benefit"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.55, delay: i * 0.1 }}
                whileHover={{ y: -6 }}>
                <div className="lp-benefit__icon"><IconComponent size={26} /></div>
                <h3>{b.title}</h3>
                <p>{b.desc}</p>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* ═══════════════════════════════════════
          GALLERY
      ═══════════════════════════════════════ */}
      <section className="lp-section lp-gallery-section">
        <div className="lp-section__head">
          <span className="lp-eyebrow">Recent Transformations</span>
          <h2 className="lp-h2">See What We've <em>Built</em></h2>
        </div>
        <div className="lp-gallery">
          {galleryProjects.map((p, i) => (
            <motion.div key={p.id} className={`lp-gallery__item lp-gallery__item--${i}`}
              initial={{ opacity: 0, scale: 0.94 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.55, delay: i * 0.07 }}>
              <img src={p.image} alt={p.title} loading="lazy" />
              <div className="lp-gallery__overlay">
                <span>{p.category}</span>
                <h4>{p.title}</h4>
                <p>{p.location}</p>
              </div>
            </motion.div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <a href="#lead-form" className="lp-btn lp-btn--primary">
            Get My Design <ArrowRight size={16} />
          </a>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          HOW IT WORKS — TIMELINE
      ═══════════════════════════════════════ */}
      <section className="lp-section lp-how">
        <div className="lp-section__head">
          <span className="lp-eyebrow">3 Simple Steps</span>
          <h2 className="lp-h2">From Click to <em>Keys</em></h2>
        </div>
        <div className="lp-how__timeline">
          {displaySteps.map((s, i) => (
            <motion.div key={i} className="lp-how__step"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: i * 0.15 }}>
              <div className="lp-how__num">{s.num}</div>
              <div className="lp-how__day">{s.day}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
              {i < displaySteps.length - 1 && <div className="lp-how__connector" />}
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════
          PRICING
      ═══════════════════════════════════════ */}
      <section className="lp-section lp-pricing-section">
        <div className="lp-section__head">
          <span className="lp-eyebrow">Transparent Pricing</span>
          <h2 className="lp-h2">No Hidden Costs. <em>Ever.</em></h2>
          <p className="lp-sub">Starting prices for fully-furnished, turnkey interiors. Get your exact quote in the free consultation.</p>
        </div>
        <div className="lp-pricing-grid">
          {displayPricing.map((p, i) => (
            <motion.div key={i} className={`lp-price-card ${p.featured ? 'featured' : ''}`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55, delay: i * 0.1 }}>
              {p.featured && <span className="lp-price-card__badge">Most Popular</span>}
              <div className="lp-price-card__type">{p.type}</div>
              <div className="lp-price-card__price">
                <small>Starts at</small>
                <strong>{p.starts}</strong>
                <span>Range: {p.range}</span>
              </div>
              <ul>
                {parseInclusions(p.inclusions).map((inc, j) => (
                  <li key={j}><Check size={14} /> {inc}</li>
                ))}
              </ul>
              <a href="#lead-form" className="lp-btn lp-btn--outline">
                Get Exact Quote <ArrowRight size={14} />
              </a>
            </motion.div>
          ))}
        </div>
        <div className="lp-pricing-note">
          <span><Wallet size={13} /> EMI options available</span>
          <span><Calendar size={13} /> Milestone Stage payments</span>
          <span><Hammer size={13} /> 10-year carpentry warranty</span>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          TESTIMONIALS
      ═══════════════════════════════════════ */}
      <section className="lp-section lp-testimonials">
        <div className="lp-section__head">
          <span className="lp-eyebrow lp-eyebrow--light">What Our Clients Say</span>
          <h2 className="lp-h2" style={{ color: '#fff' }}>Real Stories. <em>Real Homes.</em></h2>
        </div>
        <div className="lp-test-grid">
          {displayTestimonials.map((t, i) => (
            <motion.div key={i} className="lp-test-card"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55, delay: i * 0.1 }}>
              <div className="lp-test-card__stars">
                {[...Array(t.stars || 5)].map((_, j) => <Star key={j} size={16} fill="#C9A96E" color="#C9A96E" />)}
              </div>
              <p className="lp-test-card__text">"{t.text}"</p>
              <div className="lp-test-card__author">
                <div className="lp-test-card__avatar">
                  {t.avatar ? (
                    <img src={t.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                  ) : (
                    t.name.charAt(0)
                  )}
                </div>
                <div>
                  <strong>{t.name}</strong>
                  <span>{t.project || 'Bangalore'}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════
          FAQ
      ═══════════════════════════════════════ */}
      <section className="lp-section lp-faq-section">
        <div className="lp-section__head">
          <span className="lp-eyebrow">Got Questions?</span>
          <h2 className="lp-h2"><em>Answered.</em></h2>
        </div>
        <div className="lp-faq-list">
          {displayFAQs.map((f, i) => (
            <FaqItem key={i} q={f.q} a={f.a} idx={i}
              open={openFaq === i}
              onToggle={() => setOpenFaq(openFaq === i ? -1 : i)} />
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════
          FINAL CTA
      ═══════════════════════════════════════ */}
      <section className="lp-final-cta">
        <div className="lp-final-cta__bg" />
        <motion.div className="lp-final-cta__inner"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}>
          <span className="lp-final-cta__pill"><Sparkles size={13} /> Only 7 slots left this week</span>
          <h2>Ready to Begin Your <em>Dream Home</em>?</h2>
          <p>Free consultation. Free 3D design. Free quote. Zero obligation.</p>
          <div className="lp-final-cta__buttons">
            <a href="#lead-form" className="lp-btn lp-btn--primary lp-btn--large">
              Book Free Consultation <ArrowRight size={18} />
            </a>
            <a href={telLink} className="lp-btn lp-btn--ghost lp-btn--large">
              <Phone size={18} /> {phone}
            </a>
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════
          MINI FOOTER
      ═══════════════════════════════════════ */}
      <footer className="lp-mini-footer">
        <div className="lp-mini-footer__inner">
          <div className="lp-mini-footer__brand">
            <strong>ATTICARCH</strong>
            <span>Luxury Interiors · Bangalore · Since 2002</span>
          </div>
          <div className="lp-mini-footer__contact">
            <a href={telLink}><Phone size={14} /> {phone}</a>
            <a href="mailto:info@atticarch.com"><Mail size={14} /> info@atticarch.com</a>
            <span><MapPin size={14} /> Bangalore, KA</span>
          </div>
          <small>© {new Date().getFullYear()} ATTICARCH. All rights reserved.</small>
        </div>
      </footer>

      {/* ═══════════════════════════════════════
          MOBILE STICKY CTA
      ═══════════════════════════════════════ */}
      <AnimatePresence>
        {showStickyMobile && (
          <motion.div className="lp-mobile-sticky"
            initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}>
            <a href={telLink} className="lp-mobile-sticky__btn lp-mobile-sticky__btn--phone">
              <Phone size={18} /> Call Now
            </a>
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer"
              className="lp-mobile-sticky__btn lp-mobile-sticky__btn--wa">
              <MessageCircle size={18} /> WhatsApp
            </a>
            <a href="#lead-form" className="lp-mobile-sticky__btn lp-mobile-sticky__btn--form">
              <Send size={18} /> Form
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.main>
  )
}
