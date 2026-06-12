import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useSpring, useTransform } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import {
  Phone, Send, Star, Check, MessageCircle, ArrowRight, ArrowUpRight, MapPin, Mail,
  ShieldCheck, Play, Hammer, Clock, Plus, Minus, Box, Palette, FileText, Shield
} from 'lucide-react'
import {
  services as staticServices, workTypes as staticWorkTypes, valueProps,
  partners, partnerLogo, pickImages
} from '../data/siteData'
import { useData } from '../context/DataContext'
import { db, doc, setDoc } from '../lib/firebase'
import logoSrc from '../assets/logo.png'
import './LandingPage.css'

/* ─────────────────────────────────────────
   FALLBACKS (mirror the home page content)
───────────────────────────────────────── */

const FALLBACK_ROTATING = 'We Design Homes|That Tell Your Story\nHomes Designed by|Expert Architects\nAward-Winning Interiors|Built In-House Since 2002'

const HERO_POINTS = [
  '10-Year Workmanship Warranty',
  'Our own in-house production unit',
  'On-time handover, since 2002',
]

const FALLBACK_TESTIMONIALS = [
  { name: 'Our Clients at SNN Clermont', project: '4BHK Complete Home Interiors', videoId: 'J5x3HquAop0' },
  { name: 'Our Clients at Prestige Lakeside Habitat', project: 'Luxury 3BHK Interiors', videoId: 'MeX1zJkH3u0' },
  { name: 'Our Clients at Rohan Upvan', project: '3BHK Apartment Interiors', videoId: 'rzoFHrfdrc0' },
]

const FALLBACK_STUDIO_DESC = 'Every ATTICARCH home starts with a conversation, not a catalogue. We have our own in-house production unit — our designers, carpenters and finishing experts work under one roof, so every wardrobe, kitchen and panel is built by us, not outsourced. That is how we control quality, cost and timelines from drawing board to handover.'

const FALLBACK_HIGHLIGHTS = [
  { value: '1000+', label: 'Homes Finished' },
  { value: 'In-House', label: 'Production Unit' },
  { value: '100%', label: 'On-Site Supervision' },
  { value: '48 Hrs', label: 'Quick Quote' },
]

const FALLBACK_STATS = [
  { value: 1000, suffix: '+', label: 'Homes Delivered' },
  { value: 22, suffix: ' yrs', label: 'Since 2002' },
  { value: 4.5, suffix: '★', label: 'Google Rating', decimal: true },
  { value: 100, suffix: '%', label: 'On-Time Handover' }
]

const FALLBACK_BENEFITS = [
  { iconName: 'Box', title: 'Free 3D Visualization', desc: 'See your home before we build it — photo-real renders included.' },
  { iconName: 'Palette', title: 'Material Selection', desc: '500+ finishes from premium brand partners, all visualized for you.' },
  { iconName: 'FileText', title: 'Detailed Quote', desc: 'Itemized BOQ with zero hidden costs — what you see is what you pay.' },
  { iconName: 'MapPin', title: 'On-site Survey', desc: 'Our designer visits your home and measures everything — free.' }
]

const FALLBACK_PRICING = [
  {
    type: '1 BHK',
    starts: '₹4 Lacs',
    range: '₹4L – ₹6L',
    inclusions: 'Modular Kitchen, 1 Wardrobe, False Ceiling (Living), TV Unit, Basic Electrical'
  },
  {
    type: '2 BHK',
    starts: '₹6 Lacs',
    range: '₹6L – ₹10L',
    featured: true,
    inclusions: 'Modular Kitchen, 2 Wardrobes, Full False Ceiling, TV Unit + Crockery, Lighting & Electrical, Painting Included'
  },
  {
    type: '3 BHK +',
    starts: '₹10 Lacs',
    range: '₹10L – ₹18L',
    inclusions: 'Premium Modular Kitchen, 3+ Wardrobes, Full False Ceiling, TV + Crockery + Pooja, Premium Finishes, Bathroom Upgrades'
  }
]

const FALLBACK_STEPS = [
  { num: '01', day: 'Day 1', title: 'Free Consultation Call', desc: 'A 20-minute call with our senior designer to understand your style, family needs and budget.' },
  { num: '02', day: 'Days 2-7', title: '3D Design & Quote', desc: 'You receive photo-real 3D renders of every room + a detailed itemized BOQ — completely free.' },
  { num: '03', day: 'Day 8 onwards', title: 'Execute & Move In', desc: 'Sign-off and we begin. Weekly progress photos, on-time handover, 10-year warranty.' }
]

const FALLBACK_FAQS = [
  { q: 'How much does interior design cost in Bangalore?', a: 'Our turnkey interior projects start at ₹4 Lacs for 1BHK, ₹6 Lacs for 2BHK and ₹10 Lacs for 3BHK+. You get an exact quote after the free consultation — no hidden costs, ever.' },
  { q: 'How long does a typical project take?', a: 'A 2BHK takes 45-60 days from sign-off to handover. 3BHK and villas: 60-90 days. We commit to a date in writing and pay you for delays.' },
  { q: 'What does the 10-year warranty cover?', a: 'Full workmanship warranty on all carpentry, modular units, false ceiling, electrical and plumbing work executed by us. We come back and fix anything, free.' },
  { q: 'Do you offer EMI or flexible payment plans?', a: 'Yes. We accept staged payments tied to project milestones and can also help arrange EMI through partner banks.' },
  { q: 'What brands and materials do you use?', a: 'CenturyPly, Kitply, Hettich, Blum, Saint-Gobain, Asian Paints, KAFF, Elica and more — all premium IS-certified brands you can verify.' },
  { q: 'Which areas in Bangalore do you serve?', a: 'All of Bangalore — Whitefield, Sarjapur, Electronic City, North Bangalore, JP Nagar, HSR Layout, Indiranagar and more. We have project teams across the city.' }
]

const parseRotating = (raw) =>
  String(raw || FALLBACK_ROTATING)
    .split('\n')
    .map(l => l.trim())
    .filter(Boolean)
    .map(l => {
      const [a, b] = l.split('|')
      return { line1: (a || '').trim(), line2: (b || '').trim() }
    })

function fireConversion() {
  if (typeof window !== 'undefined' && window.gtag) {
    // window.gtag('event', 'conversion', { send_to: 'AW-XXXXX/YYYYY' })
  }
}

const getBenefitIcon = (name) => {
  switch (name) {
    case 'Box': return <Box size={24} />
    case 'Palette': return <Palette size={24} />
    case 'FileText': return <FileText size={24} />
    case 'MapPin': return <MapPin size={24} />
    case 'Shield': return <Shield size={24} />
    case 'Clock': return <Clock size={24} />
    default: return <Check size={24} />
  }
}

const getHeroPointIcon = (idx) => {
  switch (idx) {
    case 0: return <ShieldCheck size={14} />
    case 1: return <Hammer size={14} />
    case 2: return <Clock size={14} />
    default: return <Check size={14} />
  }
}


/* ─────────────────────────────────────────
   PIECES
───────────────────────────────────────── */

function Kicker({ children, center = false }) {
  return (
    <motion.span
      className={`lx-kicker ${center ? 'lx-kicker--center' : ''}`}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.6 }}
    >
      <i />{children}
    </motion.span>
  )
}

function H2({ children, center = false }) {
  return (
    <motion.h2
      className={`lx-h2 ${center ? 'lx-h2--center' : ''}`}
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.h2>
  )
}

/* ─────────────────────────────────────────
   MAIN
───────────────────────────────────────── */

export default function LandingPage() {
  const { landingSettings, heroSettings, studioSettings, workTypes, testimonials, projects } = useData()

  const [form, setForm] = useState({ name: '', phone: '', type: 'Apartment', budget: '10 - 15 Lakhs' })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')
  const [titleIdx, setTitleIdx] = useState(0)
  const [imgIdx, setImgIdx] = useState(0)
  const [showSticky, setShowSticky] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [expandedFaq, setExpandedFaq] = useState(null)

  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 })

  const heroRef = useRef(null)
  const { scrollYProgress: heroProg } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroImgY = useTransform(heroProg, [0, 1], ['0%', '12%'])

  const phone = landingSettings?.phone || '+919845013138'
  const whatsapp = landingSettings?.whatsapp || '919845013138'
  const whatsappPrefill = landingSettings?.whatsappPrefill || "Hi ATTICARCH, I'd like a design consultation."
  const whatsappLink = `https://wa.me/${whatsapp}?text=${encodeURIComponent(whatsappPrefill)}`
  const telLink = `tel:${phone}`

  const heroPoints = landingSettings?.bullets?.length ? landingSettings.bullets : HERO_POINTS
  const eyebrow = heroSettings?.eyebrow || 'An Award-Winning Design Studio in Bangalore'
  const rotating = parseRotating(heroSettings?.rotatingTitles)

  const stats = landingSettings?.stats?.length ? landingSettings.stats : FALLBACK_STATS
  const benefits = landingSettings?.benefits?.length ? landingSettings.benefits : FALLBACK_BENEFITS
  const pricing = landingSettings?.pricing?.length ? landingSettings.pricing : FALLBACK_PRICING
  const steps = landingSettings?.steps?.length ? landingSettings.steps : FALLBACK_STEPS
  const faqs = landingSettings?.faqs?.length ? landingSettings.faqs : FALLBACK_FAQS

  /* Prefer each project's second photo for variety (living rooms / bedrooms
     rather than the cover wardrobe shots) */
  const heroImages = projects?.length > 0
    ? projects.slice(0, 8).map(p => p.images?.[2] || p.images?.[1] || p.image).filter(Boolean).slice(0, 5)
    : pickImages(5, 24)

  const displayWorkTypes = (workTypes?.length ? workTypes : staticWorkTypes).map(w => w.title || w)
  const studioDesc = studioSettings?.desc || FALLBACK_STUDIO_DESC
  const studioHighlights = studioSettings?.highlights?.length ? studioSettings.highlights : FALLBACK_HIGHLIGHTS
  const studioImage = studioSettings?.images?.[0]?.imageUrl || pickImages(1, 84)[0]

  const videoTestimonials = (testimonials || []).filter(t => t.videoId).slice(0, 3)
  const displayTestimonials = videoTestimonials.length ? videoTestimonials : FALLBACK_TESTIMONIALS

  /* loops */
  useEffect(() => {
    if (rotating.length < 2) return
    const t = setInterval(() => setTitleIdx(i => (i + 1) % rotating.length), 5000)
    return () => clearInterval(t)
  }, [rotating.length])

  useEffect(() => {
    if (heroImages.length < 2) return
    const t = setInterval(() => setImgIdx(i => (i + 1) % heroImages.length), 4600)
    return () => clearInterval(t)
  }, [heroImages.length])

  useEffect(() => {
    const onScroll = () => {
      setShowSticky(window.scrollY > 700)
      setScrolled(window.scrollY > 30)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const validate = () => {
    const e = {}
    if (!form.name.trim() || form.name.trim().length < 2) e.name = 'Please enter your name'
    if (!/^\d{10}$/.test(form.phone.replace(/\D/g, ''))) e.phone = 'Enter a valid 10-digit phone'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setStatus('sending')
    try {
      const leadId = `lead_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
      await setDoc(doc(db, 'leads', leadId), {
        id: leadId,
        name: form.name.trim(),
        email: '',
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
  const active = rotating[titleIdx % rotating.length] || rotating[0]

  return (
    <motion.main className="lx" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Helmet>
        <title>Book a Design Consultation in Bangalore | ATTICARCH</title>
        <meta name="description" content="ATTICARCH — an award-winning interior design studio in Bangalore since 2002. In-house production, 10-year workmanship warranty, interiors from ₹10 Lakhs. Book a consultation." />
        <meta property="og:title" content="ATTICARCH — Design Consultation in Bangalore" />
        <meta property="og:description" content="Award-winning interiors built in-house since 2002. 10-year warranty. Book your consultation." />
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

      <motion.div className="lx-progress" style={{ scaleX }} />

      {/* ═══ NAVBAR — airy, hairline, gold CTA ═══ */}
      <header className={`lx-nav ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="lx-nav__inner">
          <img src={logoSrc} alt="ATTICARCH" className="lx-nav__logo" />
          <div className="lx-nav__right">
            <a href={telLink} className="lx-nav__phone">
              <span className="lx-nav__phone-label">Call the studio</span>
              <span className="lx-nav__phone-num">{phone}</span>
            </a>
            <span className="lx-nav__divider" />
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="lx-nav__wa" aria-label="WhatsApp">
              <MessageCircle size={17} />
            </a>
            <a href="#lead-form" className="lx-nav__cta">
              Book Consultation <ArrowUpRight size={14} />
            </a>
          </div>
        </div>
      </header>

      {/* ═══ HERO — editorial split ═══ */}
      <section className="lx-hero" ref={heroRef}>
        <div className="lx-hero__inner">
          <div className="lx-hero__copy">
            <motion.span
              className="lx-hero__eyebrow"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              <i /> {eyebrow}
            </motion.span>

            <h1 className="lx-hero__title" aria-live="polite">
              <AnimatePresence mode="wait">
                <motion.span
                  key={titleIdx}
                  className="lx-hero__title-frame"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -24 }}
                  transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                >
                  <span className="lx-hero__line1">{active?.line1}</span>
                  {active?.line2 && <span className="lx-hero__line2">{active.line2}</span>}
                </motion.span>
              </AnimatePresence>
            </h1>

            <motion.div
              className="lx-hero__badges"
              initial="hidden"
              animate="show"
              variants={{ show: { transition: { staggerChildren: 0.1, delayChildren: 0.55 } } }}
            >
              {heroPoints.map((p, i) => (
                <motion.div
                  key={i}
                  className="lx-hero__badge-item"
                  variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
                >
                  <span className="lx-hero__badge-icon-wrapper">
                    {getHeroPointIcon(i)}
                  </span>
                  <span className="lx-hero__badge-text">{p}</span>
                </motion.div>
              ))}
            </motion.div>


            <motion.div
              className="lx-hero__ctas"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.95 }}
            >
              <a href="#lead-form" className="lx-btn lx-btn--gold">
                Book a Consultation <ArrowRight size={15} />
              </a>
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="lx-btn lx-btn--ghost">
                <MessageCircle size={15} /> WhatsApp Us
              </a>
            </motion.div>

            <motion.div
              className="lx-hero__meta"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 1.15 }}
            >
              {valueProps.slice(0, 3).map((v, i) => (
                <div className="lx-hero__meta-item" key={i}>
                  <strong>{v.value}</strong>
                  <span>{v.label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Cinematic image column */}
          <motion.div
            className="lx-hero__visual"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div className="lx-hero__media" style={{ y: heroImgY }}>
              <AnimatePresence mode="sync">
                {heroImages[imgIdx] && (
                  <motion.img
                    key={imgIdx}
                    src={heroImages[imgIdx]}
                    alt="ATTICARCH interiors"
                    initial={{ opacity: 0, scale: 1.08 }}
                    animate={{ opacity: 1, scale: 1.02 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.6, ease: 'easeInOut' }}
                  />
                )}
              </AnimatePresence>
            </motion.div>

            <motion.div
              className="lx-hero__rating"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1.1 }}
            >
              <span className="lx-hero__rating-stars">
                {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="#C9A96E" color="#C9A96E" />)}
              </span>
              <strong>4.5 / 5</strong>
              <span className="lx-hero__rating-sub">41 Google Reviews</span>
            </motion.div>

            <span className="lx-hero__caption">ATTICARCH Residence · Bangalore</span>

            {/* next-image preview + counter */}
            <motion.div
              className="lx-hero__next"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1.25 }}
              aria-hidden="true"
            >
              <img src={heroImages[(imgIdx + 1) % heroImages.length]} alt="" />
              <span>{String(imgIdx + 1).padStart(2, '0')} / {String(heroImages.length).padStart(2, '0')}</span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══ THIN GOLD TICKER ═══ */}
      <div className="lx-ticker" aria-hidden="true">
        <div className="lx-ticker__track">
          {[...Array(3)].flatMap((_, r) =>
            ['Award-Winning Studio', '10-Year Warranty', 'In-House Production', 'Since 2002', 'On-Time Handover', 'From ₹10 Lakhs'].map((m, i) => (
              <span key={`${r}-${i}`}>{m}<b>✦</b></span>
            ))
          )}
        </div>
      </div>

      {/* ═══ STATS RAIL ═══ */}
      <section className="lx-stats-rail">
        <div className="lx-stats-rail__inner">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              className="lx-stat-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="lx-stat-card__val">
                {s.value}
                <span className="lx-stat-card__suffix">{s.suffix}</span>
              </span>
              <span className="lx-stat-card__label">{s.label}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══ BOOKING — form + contact rail ═══ */}
      <section className="lx-book" id="lead-form">
        <div className="lx-book__panel">
          <div className="lx-book__intro">
            <Kicker>Start Your Project</Kicker>
            <h2 className="lx-h2">Book a Design <em>Consultation</em></h2>
            <p className="lx-book__sub">
              Share your details and our senior designer will call you back to
              understand your home, your style and your budget.
            </p>
            <div className="lx-book__alt">
              <a href={telLink}><Phone size={15} /> {phone}</a>
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer"><MessageCircle size={15} /> Chat on WhatsApp</a>
              <span><Clock size={15} /> We reply within working hours</span>
            </div>
          </div>

          <div className="lx-book__form-side">
            <AnimatePresence mode="wait">
              {status === 'success' ? (
                <motion.div
                  key="ok" className="lx-form-success"
                  initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="lx-form-success__icon"><Check size={28} /></div>
                  <h3>Thank you, {form.name.split(' ')[0]}!</h3>
                  <p>We've received your request. Our designer will call you shortly.</p>
                  <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="lx-btn lx-btn--gold" style={{ marginTop: 16 }}>
                    <MessageCircle size={15} /> Chat on WhatsApp
                  </a>
                </motion.div>
              ) : (
                <motion.form
                  key="form" onSubmit={handleSubmit} className="lx-form"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                >
                  <div className="lx-form__row">
                    <div className={`lx-field ${errors.name ? 'err' : ''}`}>
                      <label>Full Name <span>*</span></label>
                      <input type="text" placeholder="Your name" value={form.name} onChange={update('name')} />
                      {errors.name && <small>{errors.name}</small>}
                    </div>
                    <div className={`lx-field ${errors.phone ? 'err' : ''}`}>
                      <label>Phone <span>*</span></label>
                      <input type="tel" placeholder="10-digit mobile" value={form.phone} onChange={update('phone')} maxLength={10} />
                      {errors.phone && <small>{errors.phone}</small>}
                    </div>
                  </div>
                  <div className="lx-form__row">
                    <div className="lx-field">
                      <label>Property Type</label>
                      <select value={form.type} onChange={update('type')}>
                        <option>Apartment</option>
                        <option>Villa</option>
                        <option>Commercial</option>
                        <option>Renovation</option>
                        <option>Others</option>
                      </select>
                    </div>
                    <div className="lx-field">
                      <label>Budget</label>
                      <select value={form.budget} onChange={update('budget')}>
                        <option>10 - 15 Lakhs</option>
                        <option>15 - 20 Lakhs</option>
                        <option>Over 20 Lakhs</option>
                      </select>
                    </div>
                  </div>
                  <button type="submit" disabled={status === 'sending'} className="lx-form__submit">
                    {status === 'sending' ? 'Sending…' : <>Request a Call Back <ArrowRight size={15} /></>}
                  </button>
                  {status === 'error' && (
                    <p className="lx-form__error">Couldn't submit right now. Please retry, or call us at {phone}.</p>
                  )}
                  <p className="lx-form__privacy"><ShieldCheck size={12} /> Your details are 100% secure. We never spam.</p>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ═══ BENEFITS BENTO GRID ═══ */}
      <section className="lx-section lx-benefits">
        <div className="lx-head">
          <Kicker center>Why Choose Atticarch</Kicker>
          <H2 center>Built For Quality. <em>Designed For Living.</em></H2>
        </div>
        <div className="lx-benefits__grid">
          {benefits.map((b, i) => (
            <motion.div
              key={i}
              className={`lx-benefit-card lx-benefit-card--${i}`}
              initial={{ opacity: 0, scale: 0.96, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="lx-benefit-card__icon">
                {getBenefitIcon(b.iconName)}
              </div>
              <div className="lx-benefit-card__content">
                <h3>{b.title}</h3>
                <p>{b.desc}</p>
              </div>
              <div className="lx-benefit-card__bg-glow" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══ CORE SERVICES — alternating editorial rows ═══ */}
      <section className="lx-section">
        <div className="lx-head">
          <Kicker center>Our Core Services</Kicker>
          <H2 center>Spaces We <em>Design & Build</em></H2>
        </div>
        <div className="lx-services">
          {staticServices.map((s, i) => (
            <motion.article
              key={s.id}
              className={`lx-service ${i % 2 ? 'lx-service--flip' : ''}`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="lx-service__media">
                <img src={s.image} alt={s.title} loading="lazy" />
              </div>
              <div className="lx-service__body">
                <span className="lx-service__index">{String(i + 1).padStart(2, '0')}</span>
                <span className="lx-service__sub">{s.subtitle}</span>
                <h3>{s.title}</h3>
                <p>{s.description}</p>
                <ul>
                  {s.features.slice(0, 4).map((f, j) => (
                    <li key={j}><Check size={12} /> {f}</li>
                  ))}
                </ul>
                <a href="#lead-form" className="lx-service__link">
                  Discuss your project <ArrowUpRight size={14} />
                </a>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* ═══ WHAT WE BUILD — minimal index ═══ */}
      <section className="lx-section lx-build">
        <div className="lx-head">
          <Kicker center>What We Build</Kicker>
          <H2 center>Everything, <em>Under One Roof</em></H2>
        </div>
        <div className="lx-build__grid">
          {displayWorkTypes.map((w, i) => (
            <motion.div
              key={i}
              className="lx-build__item"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: (i % 4) * 0.06 }}
            >
              <span className="lx-build__num">{String(i + 1).padStart(2, '0')}</span>
              <span className="lx-build__title">{w}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══ PRICING PACKAGES ═══ */}
      <section className="lx-section lx-pricing-sec">
        <div className="lx-head">
          <Kicker center>Transparent Estimates</Kicker>
          <H2 center>Interior Design <em>Packages</em></H2>
        </div>
        <div className="lx-pricing-grid">
          {pricing.map((p, i) => (
            <motion.div
              key={i}
              className={`lx-pricing-card ${p.featured ? 'is-featured' : ''}`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              {p.featured && <span className="lx-pricing-card__badge">Most Popular</span>}
              <div className="lx-pricing-card__header">
                <span className="lx-pricing-card__type">{p.type}</span>
                <div className="lx-pricing-card__price-box">
                  <span className="lx-pricing-card__lbl">Starting at</span>
                  <span className="lx-pricing-card__price">{p.starts}</span>
                  <span className="lx-pricing-card__range">Range: {p.range}</span>
                </div>
              </div>
              <div className="lx-pricing-card__body">
                <h4>Inclusions:</h4>
                <ul>
                  {p.inclusions?.split(',').map((inc, idx) => (
                    <li key={idx}>
                      <span className="lx-pricing-card__check"><Check size={11} /></span>
                      {inc.trim()}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="lx-pricing-card__footer">
                <a href="#lead-form" className={`lx-btn ${p.featured ? 'lx-btn--gold' : 'lx-btn--ghost'}`} style={{ width: '100%' }}>
                  Get Detailed Quote
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══ WORK TIMELINE ═══ */}
      <section className="lx-section lx-timeline-sec">
        <div className="lx-head">
          <Kicker center>Our Process</Kicker>
          <H2 center>How We <em>Deliver Excellence</em></H2>
        </div>
        <div className="lx-timeline">
          <div className="lx-timeline__line" />
          {steps.map((s, i) => (
            <motion.div
              key={i}
              className={`lx-timeline-item ${i % 2 === 1 ? 'lx-timeline-item--alt' : ''}`}
              initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="lx-timeline-item__marker">
                <span>{s.num}</span>
              </div>
              <div className="lx-timeline-item__card">
                <span className="lx-timeline-item__day">{s.day}</span>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══ INSIDE THE STUDIO ═══ */}
      <section className="lx-section lx-studio">
        <div className="lx-studio__grid">
          <motion.div
            className="lx-studio__media"
            initial={{ opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          >
            <img src={studioImage} alt="Inside the ATTICARCH studio" loading="lazy" />
            <div className="lx-studio__badge">
              <Hammer size={15} />
              <span>In-House Production</span>
            </div>
          </motion.div>
          <motion.div
            className="lx-studio__text"
            initial={{ opacity: 0, x: 32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.85, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <Kicker>Inside the Studio</Kicker>
            <h2 className="lx-h2">Built Around You. <em>Made In Our Own Production Unit.</em></h2>
            <p className="lx-studio__desc">{studioDesc}</p>
            <div className="lx-studio__highlights">
              {studioHighlights.map((h, i) => (
                <div key={i} className="lx-studio__hl">
                  <strong>{h.value}</strong>
                  <span>{h.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ CLIENT VIDEO WALKTHROUGHS ═══ */}
      <section className="lx-section lx-videos">
        <div className="lx-head">
          <Kicker center>What Our Clients Say</Kicker>
          <H2 center>Real Homes. <em>Real Walkthroughs.</em></H2>
        </div>
        <div className="lx-videos__grid">
          {displayTestimonials.map((t, i) => (
            <motion.a
              key={t.videoId || i}
              className="lx-video"
              href={`https://www.youtube.com/watch?v=${t.videoId}`}
              target="_blank" rel="noopener noreferrer"
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.65, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="lx-video__thumb">
                <img src={`https://i.ytimg.com/vi/${t.videoId}/hqdefault.jpg`} alt={t.project || t.name} loading="lazy" />
                <span className="lx-video__play"><Play size={16} fill="currentColor" /></span>
              </div>
              <div className="lx-video__meta">
                <strong>{t.project || 'Home Interiors'}</strong>
                <span>{t.name}</span>
              </div>
            </motion.a>
          ))}
        </div>
        <div className="lx-partners">
          {partners.slice(0, 8).map(p => {
            const logo = partnerLogo(p.slug)
            return (
              <div key={p.slug} className="lx-partners__logo" title={p.name}>
                {logo ? <img src={logo} alt={p.name} /> : <span>{p.name}</span>}
              </div>
            )
          })}
        </div>
      </section>

      {/* ═══ FAQ SECTION ═══ */}
      <section className="lx-section lx-faq-sec">
        <div className="lx-head">
          <Kicker center>Have Questions?</Kicker>
          <H2 center>Frequently Asked <em>Questions</em></H2>
        </div>
        <div className="lx-faq-list">
          {faqs.map((faq, i) => {
            const isExpanded = expandedFaq === i
            return (
              <motion.div
                key={i}
                className={`lx-faq-item ${isExpanded ? 'is-expanded' : ''}`}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
              >
                <button
                  type="button"
                  className="lx-faq-item__trigger"
                  onClick={() => setExpandedFaq(isExpanded ? null : i)}
                  aria-expanded={isExpanded}
                >
                  <span>{faq.q}</span>
                  <span className="lx-faq-item__icon-wrapper">
                    {isExpanded ? <Minus size={15} /> : <Plus size={15} />}
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="lx-faq-item__collapse"
                    >
                      <div className="lx-faq-item__answer">
                        <p>{faq.a}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <section className="lx-final">
        <motion.div
          className="lx-final__inner"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="lx-final__ornament"><i /><b /><i /></span>
          <h2>Ready to Begin Your <em>Dream Home?</em></h2>
          <p>An award-winning studio, our own production unit, and a 10-year warranty — since 2002.</p>
          <div className="lx-final__buttons">
            <a href="#lead-form" className="lx-btn lx-btn--gold lx-btn--xl">
              Book a Consultation <ArrowRight size={16} />
            </a>
            <a href={telLink} className="lx-btn lx-btn--ghost lx-btn--xl">
              <Phone size={15} /> {phone}
            </a>
          </div>
        </motion.div>
      </section>

      {/* ═══ FOOTER — editorial ═══ */}
      <footer className="lx-footer">
        <div className="lx-footer__inner">
          <div className="lx-footer__grid">
            <div className="lx-footer__brand">
              <img src={logoSrc} alt="ATTICARCH" className="lx-footer__logo" />
              <span className="lx-footer__tag">Transforming Spaces,<br />Transforming Lives.</span>
              <span className="lx-footer__est">Bangalore · Est. 2002</span>
            </div>
            <div className="lx-footer__col">
              <h4>Visit the Studio</h4>
              <p>#12, 3rd Floor, 10th Main,<br />Outer Ring Rd, Banaswadi,<br />Bengaluru, Karnataka 560043</p>
            </div>
            <div className="lx-footer__col">
              <h4>Talk to Us</h4>
              <a href={telLink}><Phone size={13} /> {phone}</a>
              <a href="mailto:sales@atticarch.com"><Mail size={13} /> sales@atticarch.com</a>
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer"><MessageCircle size={13} /> WhatsApp the studio</a>
            </div>
            <div className="lx-footer__col lx-footer__col--cta">
              <h4>Start a Project</h4>
              <p>A 20-minute conversation is all it takes to begin.</p>
              <a href="#lead-form" className="lx-btn lx-btn--gold">
                Book a Consultation <ArrowRight size={14} />
              </a>
            </div>
          </div>
          <div className="lx-footer__bottom">
            <small>© {new Date().getFullYear()} ATTICARCH. All rights reserved.</small>
            <span className="lx-footer__rating">
              <Star size={11} fill="#C9A96E" color="#C9A96E" /> 4.5 on Google · 41 reviews
            </span>
          </div>
        </div>
      </footer>

      {/* ═══ MOBILE STICKY ═══ */}
      <AnimatePresence>
        {showSticky && (
          <motion.div
            className="lx-sticky"
            initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <a href={telLink} className="lx-sticky__btn lx-sticky__btn--call"><Phone size={16} /> Call</a>
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="lx-sticky__btn lx-sticky__btn--wa">
              <MessageCircle size={16} /> WhatsApp
            </a>
            <a href="#lead-form" className="lx-sticky__btn lx-sticky__btn--form"><Send size={16} /> Enquire</a>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.main>
  )
}
