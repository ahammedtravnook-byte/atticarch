import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useInView, useScroll, useSpring } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import {
  Phone, Send, Star, Check, MessageCircle, ArrowRight, MapPin, Mail,
  ShieldCheck, Play, Award, Hammer, Clock
} from 'lucide-react'
import {
  services as staticServices, workTypes as staticWorkTypes, valueProps,
  partners, partnerLogo, pickImages
} from '../data/siteData'
import { useData } from '../context/DataContext'
import { db, doc, setDoc } from '../lib/firebase'
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

/* Parse the homepage rotating titles: one sentence per line, "|" splits the
   two display lines, the second line is the gold accent. */
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

/* ─────────────────────────────────────────
   SMALL PIECES
───────────────────────────────────────── */

function Kicker({ children }) {
  return (
    <motion.span
      className="lnd-kicker"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.6 }}
    >
      <i />{children}<i />
    </motion.span>
  )
}

function H2({ children }) {
  return (
    <motion.h2
      className="lnd-h2"
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.h2>
  )
}

function ValueStat({ stat, index }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })
  return (
    <motion.div
      ref={ref}
      className="lnd-stat"
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
    >
      <span className="lnd-stat__value">{stat.value}</span>
      <span className="lnd-stat__rule" />
      <span className="lnd-stat__label">{stat.label}</span>
    </motion.div>
  )
}

/* ─────────────────────────────────────────
   MAIN
───────────────────────────────────────── */

export default function LandingPage() {
  const { landingSettings, heroSettings, studioSettings, workTypes, testimonials, projects } = useData()

  const [form, setForm] = useState({ name: '', phone: '', type: 'Apartment', budget: '10 - 15 Lakhs' })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | success | error
  const [titleIdx, setTitleIdx] = useState(0)
  const [showSticky, setShowSticky] = useState(false)

  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 })

  const phone = landingSettings?.phone || '+919845013138'
  const whatsapp = landingSettings?.whatsapp || '919845013138'
  const whatsappPrefill = landingSettings?.whatsappPrefill || "Hi ATTICARCH, I'd like a design consultation."
  const whatsappLink = `https://wa.me/${whatsapp}?text=${encodeURIComponent(whatsappPrefill)}`
  const telLink = `tel:${phone}`

  /* Homepage-driven content */
  const eyebrow = heroSettings?.eyebrow || 'An Award-Winning Design Studio in Bangalore'
  const rotating = parseRotating(heroSettings?.rotatingTitles)
  const heroImage = projects?.[0]?.image || pickImages(1, 0)[0]

  const displayWorkTypes = (workTypes?.length ? workTypes : staticWorkTypes).map(w => w.title || w)
  const studioDesc = studioSettings?.desc || FALLBACK_STUDIO_DESC
  const studioHighlights = studioSettings?.highlights?.length ? studioSettings.highlights : FALLBACK_HIGHLIGHTS
  const studioImage = studioSettings?.images?.[0]?.imageUrl || pickImages(1, 84)[0]

  const videoTestimonials = (testimonials || []).filter(t => t.videoId).slice(0, 3)
  const displayTestimonials = videoTestimonials.length ? videoTestimonials : FALLBACK_TESTIMONIALS

  /* Rotating hero loop — same cadence as the home page */
  useEffect(() => {
    if (rotating.length < 2) return
    const t = setInterval(() => setTitleIdx(i => (i + 1) % rotating.length), 5000)
    return () => clearInterval(t)
  }, [rotating.length])

  useEffect(() => {
    const onScroll = () => setShowSticky(window.scrollY > 600)
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
    <motion.main className="lnd" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
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

      <motion.div className="lnd-progress" style={{ scaleX }} />

      {/* ═══ TOP BAR ═══ */}
      <header className="lnd-topbar">
        <div className="lnd-topbar__inner">
          <div className="lnd-topbar__brand">
            <span className="lnd-topbar__mark">A</span>
            <div className="lnd-topbar__name">
              <strong>ATTICARCH</strong>
              <span>Bangalore · Est. 2002</span>
            </div>
          </div>
          <div className="lnd-topbar__actions">
            <a href={telLink} className="lnd-topbar__phone"><Phone size={13} /> <span>{phone}</span></a>
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="lnd-topbar__wa">
              <MessageCircle size={13} /> <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </header>

      {/* ═══ HERO — rotating headline + consultation form ═══ */}
      <section className="lnd-hero">
        <div className="lnd-hero__inner">
          <div className="lnd-hero__copy">
            <motion.span
              className="lnd-hero__eyebrow"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              <i className="lnd-hero__eyebrow-dot" /> {eyebrow}
            </motion.span>

            <h1 className="lnd-hero__title" aria-live="polite">
              <AnimatePresence mode="wait">
                <motion.span
                  key={titleIdx}
                  className="lnd-hero__title-frame"
                  initial={{ opacity: 0, y: 34 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -28 }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                >
                  <span className="lnd-hero__title-line">{active?.line1}</span>
                  {active?.line2 && (
                    <span className="lnd-hero__title-line lnd-hero__title-line--gold">{active.line2}</span>
                  )}
                </motion.span>
              </AnimatePresence>
            </h1>

            <motion.div
              className="lnd-hero__ornament"
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.9, delay: 0.5 }}
            >
              <i /><b /><i />
            </motion.div>

            <motion.ul
              className="lnd-hero__points"
              initial="hidden"
              animate="show"
              variants={{ show: { transition: { staggerChildren: 0.12, delayChildren: 0.6 } } }}
            >
              {HERO_POINTS.map((p, i) => (
                <motion.li
                  key={i}
                  variants={{ hidden: { opacity: 0, x: -16 }, show: { opacity: 1, x: 0, transition: { duration: 0.55 } } }}
                >
                  <Check size={14} /> {p}
                </motion.li>
              ))}
            </motion.ul>

            <motion.div
              className="lnd-hero__trust"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 1 }}
            >
              <span className="lnd-hero__stars">
                {[...Array(5)].map((_, i) => <Star key={i} size={13} fill="#C9A96E" color="#C9A96E" />)}
              </span>
              <span className="lnd-hero__trust-text"><strong>4.5</strong> · 41 Google Reviews</span>
            </motion.div>

            <motion.div
              className="lnd-hero__ctas"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1.1 }}
            >
              <a href="#lead-form" className="lnd-btn lnd-btn--gold">
                <span>Book a Consultation</span> <ArrowRight size={15} />
              </a>
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="lnd-btn lnd-btn--line">
                <MessageCircle size={15} /> <span>WhatsApp Us</span>
              </a>
            </motion.div>
          </div>

          {/* CONSULTATION FORM */}
          <motion.div
            id="lead-form"
            className="lnd-form-wrap"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="lnd-form-card">
              <i className="lnd-tick lnd-tick--tl" /><i className="lnd-tick lnd-tick--tr" />
              <i className="lnd-tick lnd-tick--bl" /><i className="lnd-tick lnd-tick--br" />

              <div className="lnd-form-card__head">
                <span className="lnd-form-card__kicker">Start Your Project</span>
                <h2>Book a Design Consultation</h2>
                <p>Share your details — our senior designer will call you back.</p>
              </div>

              <AnimatePresence mode="wait">
                {status === 'success' ? (
                  <motion.div
                    key="ok" className="lnd-form-success"
                    initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="lnd-form-success__icon"><Check size={30} /></div>
                    <h3>Thank you, {form.name.split(' ')[0]}!</h3>
                    <p>We've received your request. Our designer will call you shortly.</p>
                    <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="lnd-btn lnd-btn--gold" style={{ marginTop: 16 }}>
                      <MessageCircle size={15} /> <span>Chat on WhatsApp</span>
                    </a>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form" onSubmit={handleSubmit} className="lnd-form"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  >
                    <div className={`lnd-field ${errors.name ? 'err' : ''}`}>
                      <label>Full Name <span>*</span></label>
                      <input type="text" placeholder="Your name" value={form.name} onChange={update('name')} />
                      {errors.name && <small>{errors.name}</small>}
                    </div>
                    <div className={`lnd-field ${errors.phone ? 'err' : ''}`}>
                      <label>Phone <span>*</span></label>
                      <input type="tel" placeholder="10-digit mobile" value={form.phone} onChange={update('phone')} maxLength={10} />
                      {errors.phone && <small>{errors.phone}</small>}
                    </div>
                    <div className="lnd-field-row">
                      <div className="lnd-field">
                        <label>Property Type</label>
                        <select value={form.type} onChange={update('type')}>
                          <option>Apartment</option>
                          <option>Villa</option>
                          <option>Commercial</option>
                          <option>Renovation</option>
                          <option>Others</option>
                        </select>
                      </div>
                      <div className="lnd-field">
                        <label>Budget</label>
                        <select value={form.budget} onChange={update('budget')}>
                          <option>10 - 15 Lakhs</option>
                          <option>15 - 20 Lakhs</option>
                          <option>Over 20 Lakhs</option>
                        </select>
                      </div>
                    </div>
                    <button type="submit" disabled={status === 'sending'} className="lnd-form__submit">
                      <span className="lnd-form__submit-sheen" />
                      {status === 'sending' ? 'Sending…' : <>Request a Call Back <ArrowRight size={15} /></>}
                    </button>
                    {status === 'error' && (
                      <p className="lnd-form__error">Couldn't submit right now. Please retry, or call us at {phone}.</p>
                    )}
                    <p className="lnd-form__privacy">
                      <ShieldCheck size={12} /> Your details are 100% secure. We never spam.
                    </p>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* Framed hero image band */}
        <motion.div
          className="lnd-hero__band"
          initial={{ opacity: 0, y: 44 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="lnd-hero__band-frame">
            <img src={heroImage} alt="ATTICARCH interiors, Bangalore" />
            <span className="lnd-hero__band-caption">ATTICARCH Residence · Bangalore</span>
          </div>
        </motion.div>
      </section>

      {/* ═══ STATS — homepage value props ═══ */}
      <section className="lnd-stats">
        <div className="lnd-stats__grid">
          {valueProps.map((s, i) => <ValueStat key={i} stat={s} index={i} />)}
        </div>
        <div className="lnd-partners">
          {partners.slice(0, 8).map(p => {
            const logo = partnerLogo(p.slug)
            return (
              <div key={p.slug} className="lnd-partners__logo" title={p.name}>
                {logo ? <img src={logo} alt={p.name} /> : <span>{p.name}</span>}
              </div>
            )
          })}
        </div>
      </section>

      {/* ═══ CORE SERVICES ═══ */}
      <section className="lnd-section">
        <div className="lnd-head">
          <Kicker>Our Core Services</Kicker>
          <H2>Spaces We <em>Design & Build</em></H2>
        </div>
        <div className="lnd-services">
          {staticServices.map((s, i) => (
            <motion.article
              key={s.id}
              className="lnd-service"
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.75, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="lnd-service__media">
                <img src={s.image} alt={s.title} loading="lazy" />
                <span className="lnd-service__num">{String(i + 1).padStart(2, '0')}</span>
              </div>
              <div className="lnd-service__body">
                <span className="lnd-service__sub">{s.subtitle}</span>
                <h3>{s.title}</h3>
                <p>{s.description}</p>
                <ul>
                  {s.features.slice(0, 4).map((f, j) => (
                    <li key={j}><Check size={12} /> {f}</li>
                  ))}
                </ul>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* ═══ WHAT WE BUILD — compact listing ═══ */}
      <section className="lnd-section lnd-build">
        <div className="lnd-head">
          <Kicker>What We Build</Kicker>
          <H2>Everything, <em>Under One Roof</em></H2>
        </div>
        <div className="lnd-build__list">
          {displayWorkTypes.map((w, i) => (
            <motion.div
              key={i}
              className="lnd-build__item"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: (i % 8) * 0.05 }}
            >
              <span className="lnd-build__num">{String(i + 1).padStart(2, '0')}</span>
              <span className="lnd-build__title">{w}</span>
              <span className="lnd-build__star">✦</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══ INSIDE THE STUDIO ═══ */}
      <section className="lnd-section lnd-studio">
        <div className="lnd-studio__grid">
          <motion.div
            className="lnd-studio__media"
            initial={{ opacity: 0, x: -36 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          >
            <img src={studioImage} alt="Inside the ATTICARCH studio" loading="lazy" />
            <div className="lnd-studio__badge">
              <Hammer size={16} />
              <div>
                <strong>In-House Production</strong>
                <span>Built by us, not outsourced</span>
              </div>
            </div>
          </motion.div>
          <motion.div
            className="lnd-studio__text"
            initial={{ opacity: 0, x: 36 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.85, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="lnd-kicker lnd-kicker--left"><i />Inside the Studio</span>
            <h2 className="lnd-h2">Built Around You. <em>Made by Hand.</em></h2>
            <p className="lnd-studio__desc">{studioDesc}</p>
            <div className="lnd-studio__highlights">
              {studioHighlights.map((h, i) => (
                <div key={i} className="lnd-studio__hl">
                  <strong>{h.value}</strong>
                  <span>{h.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ CLIENT VIDEO TESTIMONIALS ═══ */}
      <section className="lnd-section lnd-videos">
        <div className="lnd-head">
          <Kicker>What Our Clients Say</Kicker>
          <H2>Real Homes. <em>Real Walkthroughs.</em></H2>
        </div>
        <div className="lnd-videos__grid">
          {displayTestimonials.map((t, i) => (
            <motion.a
              key={t.videoId || i}
              className="lnd-video"
              href={`https://www.youtube.com/watch?v=${t.videoId}`}
              target="_blank" rel="noopener noreferrer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.65, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="lnd-video__thumb">
                <img src={`https://i.ytimg.com/vi/${t.videoId}/hqdefault.jpg`} alt={t.project || t.name} loading="lazy" />
                <span className="lnd-video__play"><Play size={18} fill="currentColor" /></span>
              </div>
              <div className="lnd-video__meta">
                <strong>{t.project || 'Home Interiors'}</strong>
                <span>{t.name}</span>
              </div>
            </motion.a>
          ))}
        </div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <section className="lnd-final">
        <motion.div
          className="lnd-final__inner"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="lnd-final__icons">
            <Award size={16} /> <Clock size={16} /> <Hammer size={16} />
          </span>
          <h2>Ready to Begin Your <em>Dream Home?</em></h2>
          <p>An award-winning studio, our own production unit, and a 10-year warranty — since 2002.</p>
          <div className="lnd-final__buttons">
            <a href="#lead-form" className="lnd-btn lnd-btn--gold lnd-btn--xl">
              <span>Book a Consultation</span> <ArrowRight size={17} />
            </a>
            <a href={telLink} className="lnd-btn lnd-btn--line lnd-btn--xl">
              <Phone size={16} /> <span>{phone}</span>
            </a>
          </div>
        </motion.div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="lnd-footer">
        <div className="lnd-footer__inner">
          <div className="lnd-footer__brand">
            <strong>ATTICARCH</strong>
            <span>Transforming Spaces, Transforming Lives · Since 2002</span>
          </div>
          <div className="lnd-footer__contact">
            <a href={telLink}><Phone size={13} /> {phone}</a>
            <a href="mailto:sales@atticarch.com"><Mail size={13} /> sales@atticarch.com</a>
            <span><MapPin size={13} /> #12, 3rd Floor, 10th Main, Outer Ring Rd, Banaswadi, Bengaluru 560043</span>
          </div>
          <small>© {new Date().getFullYear()} ATTICARCH. All rights reserved.</small>
        </div>
      </footer>

      {/* ═══ MOBILE STICKY ═══ */}
      <AnimatePresence>
        {showSticky && (
          <motion.div
            className="lnd-sticky"
            initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <a href={telLink} className="lnd-sticky__btn lnd-sticky__btn--call"><Phone size={17} /> Call</a>
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="lnd-sticky__btn lnd-sticky__btn--wa">
              <MessageCircle size={17} /> WhatsApp
            </a>
            <a href="#lead-form" className="lnd-sticky__btn lnd-sticky__btn--form"><Send size={17} /> Enquire</a>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.main>
  )
}
