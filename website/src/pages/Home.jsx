import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { ArrowUpRight, ArrowRight, Star, Calculator, ChevronLeft, ChevronRight, Quote, Play, Check } from 'lucide-react'

/* brand SVGs — lucide doesn't include these */
const IconYoutube = ({ size = 16, ...p }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6a3 3 0 0 0-2.1 2.1C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8zM9.75 15.5v-7l6.5 3.5-6.5 3.5z"/>
  </svg>
)
const IconInstagram = ({ size = 16, ...p }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
  </svg>
)
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { projects, upcomingProjects, services, rooms, testimonials, stats, processSteps, blogPosts, workTypes, partners } from '../data/siteData'
import heroLiving from '../assets/images/hero-living.png'
import kitchen from '../assets/images/kitchen.png'
import bedroom from '../assets/images/bedroom.png'
import villa from '../assets/images/villa.png'
import apartment from '../assets/images/apartment.png'
import commercial from '../assets/images/commercial.png'
import foyer from '../assets/images/foyer.png'
import dining from '../assets/images/dining.png'
import bathroom from '../assets/images/bathroom.png'
import './Home.css'

gsap.registerPlugin(ScrollTrigger)

/* ── constants ── */
const HERO_IMAGES = [heroLiving, villa, kitchen, bedroom, apartment]
const HERO_SLIDE_INTERVAL = 5000
const YT_CATALOG = [
  { id: 'vcUMkExgiCw', title: 'ATTICARCH — Luxury Interior Design' },
  { id: 'N2QJ6ETLnaQ', title: 'ATTICARCH — Residential Transformation' },
  { id: 'XzEPJfpn4FI', title: 'ATTICARCH — Premium Villa Interiors' },
  { id: 'qRjYhNeu1To', title: 'Step Inside Modern Luxury with ATTICARCH' },
  { id: 'zPJQttiz4SQ', title: 'Luxury 4BHK Villa Interiors — Samruddhi Lake Drive' },
  { id: 'Kp0BATDxKFI', title: '3BHK Flat Interiors at Prestige Tranquility' },
  { id: 'yvptQo71mnw', title: '3BHK Apartment Tour — Prestige Song of the South' },
]
const ALL_IMGS = [heroLiving, kitchen, bedroom, villa, apartment, commercial, foyer, dining, bathroom]
const PROCESS_IMGS = [heroLiving, villa, apartment, commercial, kitchen, bedroom]
const ROOM_IMGS = {
  'kitchen-interior-designers': [kitchen, dining, commercial, apartment, foyer],
  'living-room':  [heroLiving, villa, apartment, foyer, dining],
  'bedrooms':     [bedroom, bathroom, heroLiving, apartment, villa],
  'foyer':        [foyer, heroLiving, villa, dining, kitchen],
  'dining-room':  [dining, kitchen, foyer, villa, apartment],
  'kids-bedroom': [bedroom, apartment, bathroom, kitchen, heroLiving],
  'bathrooms':    [bathroom, bedroom, villa, foyer, apartment],
  'balcony':      [villa, heroLiving, apartment, dining, commercial],
}
const SVC_IMGS = {
  residential: [heroLiving, villa, apartment, dining, bedroom],
  commercial:  [commercial, apartment, villa, kitchen, foyer],
  renovation:  [foyer, kitchen, bathroom, bedroom, heroLiving],
}
const INSTA_IMGS = [heroLiving, kitchen, bedroom, villa, apartment, commercial, foyer, dining, bathroom]

/* ─────────────────────────────────────────
   UTILITY COMPONENTS
───────────────────────────────────────── */

function Counter({ end, suffix = '', duration = 2 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  useEffect(() => {
    if (!inView || !ref.current) return
    const num = parseFloat(end)
    gsap.fromTo(ref.current, { innerText: 0 }, {
      innerText: num, duration, snap: { innerText: 1 }, ease: 'power2.out',
      onUpdate() { ref.current.textContent = Math.floor(ref.current.innerText || 0) + suffix },
    })
  }, [inView, end, suffix, duration])
  return <span ref={ref}>0{suffix}</span>
}

function Reveal({ children, className = '', delay = 0, dir = 'up' }) {
  const map = {
    up:    { hidden: { opacity: 0, y: 40 },   show: { opacity: 1, y: 0 } },
    left:  { hidden: { opacity: 0, x: -40 },  show: { opacity: 1, x: 0 } },
    right: { hidden: { opacity: 0, x: 40 },   show: { opacity: 1, x: 0 } },
    scale: { hidden: { opacity: 0, scale: 0.92 }, show: { opacity: 1, scale: 1 } },
  }
  const v = map[dir] || map.up
  return (
    <motion.div className={className} initial={v.hidden} whileInView={v.show}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.85, delay, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  )
}

function ImageCycler({ images, interval = 2800, className = '', style = {} }) {
  const [idx, setIdx] = useState(0)
  const ref = useRef(null)
  const inView = useInView(ref, { amount: 0.1, once: false })
  useEffect(() => {
    if (!inView) return
    const t = setInterval(() => setIdx(i => (i + 1) % images.length), interval)
    return () => clearInterval(t)
  }, [inView, images.length, interval])
  return (
    <div ref={ref} className={className} style={{ position: 'relative', overflow: 'hidden', ...style }}>
      <AnimatePresence mode="sync">
        <motion.img
          key={idx} src={images[idx]} alt=""
          initial={{ opacity: 0, scale: 1.07 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: 'easeInOut' }}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          draggable={false}
        />
      </AnimatePresence>
    </div>
  )
}

/* ─────────────────────────────────────────
   HERO — CINEMATIC PARALLAX IMAGE HERO
   Cycling images with Ken Burns effect,
   parallax scroll, floating gold elements.
   Zero iframes = zero lag.
───────────────────────────────────────── */

const HERO_ROTATING_WORDS = ['Luxury', 'Elegance', 'Comfort', 'Perfection']

function HeroParallax() {
  const [slideIdx, setSlideIdx] = useState(0)
  const [wordIdx, setWordIdx] = useState(0)
  const [progress, setProgress] = useState(0)
  const heroRef = useRef(null)
  const bgRef = useRef(null)

  /* Cycle hero images */
  useEffect(() => {
    const start = Date.now()
    const frame = setInterval(() => {
      const p = ((Date.now() - start) % HERO_SLIDE_INTERVAL) / HERO_SLIDE_INTERVAL
      setProgress(p)
    }, 50)
    const cycle = setInterval(() => setSlideIdx(i => (i + 1) % HERO_IMAGES.length), HERO_SLIDE_INTERVAL)
    return () => { clearInterval(frame); clearInterval(cycle) }
  }, [slideIdx])

  /* Rotate words */
  useEffect(() => {
    const t = setInterval(() => setWordIdx(i => (i + 1) % HERO_ROTATING_WORDS.length), 2800)
    return () => clearInterval(t)
  }, [])

  /* GSAP parallax on scroll */
  useEffect(() => {
    if (!heroRef.current || !bgRef.current) return
    const ctx = gsap.context(() => {
      gsap.to(bgRef.current, {
        yPercent: 30,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.8,
        },
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <section className="hero" ref={heroRef}>
      {/* Parallax background layer */}
      <div className="hero__bg" ref={bgRef}>
        <AnimatePresence mode="sync">
          <motion.img
            key={slideIdx}
            src={HERO_IMAGES[slideIdx]}
            alt="ATTICARCH luxury interior"
            className="hero__bg-img"
            initial={{ opacity: 0, scale: 1.15 }}
            animate={{ opacity: 1, scale: 1.05 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2, ease: 'easeInOut' }}
          />
        </AnimatePresence>
        <div className="hero__grain" />
        <div className="hero__overlay" />
      </div>

      {/* Floating decorative elements */}
      <div className="hero__decor">
        <motion.div className="hero__orb hero__orb--gold"
          animate={{ y: [0, -25, 0], x: [0, 15, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }} />
        <motion.div className="hero__orb hero__orb--white"
          animate={{ y: [0, 30, 0], x: [0, -18, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }} />
        <motion.div className="hero__frame hero__frame--1"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }} />
        <motion.div className="hero__frame hero__frame--2"
          animate={{ rotate: [360, 0] }}
          transition={{ duration: 80, repeat: Infinity, ease: 'linear' }} />
      </div>

      {/* Main content — Split layout */}
      <div className="hero__content container">
        <div className="hero__grid">
          {/* Left: Text */}
          <motion.div className="hero__left"
            initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}>

            <motion.div className="hero__eyebrow"
              initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}>
              <span className="hero__eyebrow-dot" />
              <span>Est. 2002 · Award-Winning Studio</span>
            </motion.div>

            <h1 className="hero__title">
              <div style={{ overflow: 'hidden' }}>
                <motion.span className="hero__title-line"
                  initial={{ y: 130 }} animate={{ y: 0 }}
                  transition={{ duration: 1.2, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}>
                  Designing Homes
                </motion.span>
              </div>
              <div style={{ overflow: 'hidden' }}>
                <motion.span className="hero__title-line hero__title-line--accent"
                  initial={{ y: 130 }} animate={{ y: 0 }}
                  transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}>
                  That Tell <em>Your</em> Story
                </motion.span>
              </div>
            </h1>

            {/* Animated tagline pill */}
            <motion.div className="hero__tagline"
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.85 }}>
              <span className="hero__tagline-label">We Specialize In</span>
              <div className="hero__tagline-word">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={wordIdx}
                    initial={{ y: 24, opacity: 0, filter: 'blur(4px)' }}
                    animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                    exit={{ y: -24, opacity: 0, filter: 'blur(4px)' }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>
                    {HERO_ROTATING_WORDS[wordIdx]}
                  </motion.span>
                </AnimatePresence>
              </div>
            </motion.div>

            <motion.p className="hero__subtitle"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.95 }}>
              From concept to keys, we create breathtaking interiors that blend functionality with unmatched elegance. Bangalore's most trusted design studio.
            </motion.p>

            {/* Feature highlights */}
            <motion.div className="hero__features"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.05 }}>
              <div className="hero__feature">
                <Check size={14} />
                <span>10-Year Warranty</span>
              </div>
              <div className="hero__feature">
                <Check size={14} />
                <span>500+ Projects</span>
              </div>
              <div className="hero__feature">
                <Check size={14} />
                <span>Starting ₹10 Lacs</span>
              </div>
            </motion.div>

            <motion.div className="hero__actions"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.15 }}>
              <Link to="/contact-us" className="btn btn-primary hero__cta-primary">
                Start Your Project <ArrowUpRight size={18} />
              </Link>
              <Link to="/project-category/projects-residential" className="btn btn-outline hero__outline-btn">
                Explore Portfolio
              </Link>
            </motion.div>
          </motion.div>

          {/* Right: Preview + Stats */}
          <motion.div className="hero__right"
            initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}>

            {/* Floating image preview */}
            <div className="hero__preview">
              <AnimatePresence mode="wait">
                <motion.img
                  key={slideIdx}
                  src={HERO_IMAGES[slideIdx]}
                  alt="Latest project"
                  className="hero__preview-img"
                  initial={{ opacity: 0, scale: 1.08 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.2, ease: 'easeInOut' }}
                />
              </AnimatePresence>
              <div className="hero__preview-border" />
              <div className="hero__preview-label">
                <span className="hero__preview-dot" />
                Latest Project
              </div>
            </div>

            {/* Stats grid */}
            <div className="hero__stats-grid">
              {stats.map((s, i) => (
                <motion.div key={i} className="hero__stat-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.0 + i * 0.1 }}>
                  <span className="hero__stat-number text-mono">
                    <Counter end={s.number.replace(/\D/g, '')} suffix={s.number.replace(/\d/g, '')} />
                  </span>
                  <span className="hero__stat-label">{s.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom image strip — inside container for proper alignment */}
        <motion.div className="hero__strip"
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.5 }}>
          {ALL_IMGS.slice(0, 6).map((img, i) => (
            <motion.div key={i} className="hero__strip-item"
              whileHover={{ scale: 1.08, y: -4 }}
              transition={{ duration: 0.3 }}>
              <img src={img} alt="" loading="lazy" />
            </motion.div>
          ))}
          <div className="hero__strip-cta">
            <span>50+</span>
            <small>More Projects</small>
          </div>
        </motion.div>
      </div>

      {/* Slide indicators */}
      <div className="hero__slide-nav">
        <div className="hero__slide-dots">
          {HERO_IMAGES.map((_, i) => (
            <button key={i} className={`hero__slide-dot ${i === slideIdx ? 'active' : ''}`} onClick={() => setSlideIdx(i)}>
              {i === slideIdx && (
                <motion.div className="hero__slide-dot-fill"
                  initial={{ scaleX: 0 }} animate={{ scaleX: progress }}
                  transition={{ duration: 0, ease: 'linear' }}
                  style={{ transformOrigin: 'left' }} />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="hero__scroll-cue">
        <motion.div className="hero__scroll-line"
          animate={{ y: [0, 16, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }} />
        <span className="hero__scroll-text">Scroll</span>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────
   ROOM ACCORDION
   Expanding horizontal strips — hover/click
   any strip to expand it with cycling images
───────────────────────────────────────── */

function RoomAccordion() {
  const [active, setActive] = useState(0)

  return (
    <Reveal>
      <div className="room-accordion">
        {rooms.map((room, i) => {
          const isActive = i === active
          const images = ROOM_IMGS[room.slug] || [room.image]
          return (
            <motion.div
              key={room.slug}
              className="room-acc-strip"
              animate={{ flex: isActive ? 6 : 1 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              onHoverStart={() => setActive(i)}
              onClick={() => setActive(i)}
            >
              {/* cycling images */}
              <ImageCycler
                images={images}
                interval={isActive ? 2200 : 5000}
                style={{ position: 'absolute', inset: 0 }}
              />

              {/* gradient */}
              <div className="room-acc-grad" />

              {/* collapsed label (rotated) */}
              <AnimatePresence>
                {!isActive && (
                  <motion.div
                    key="collapsed"
                    className="room-acc-collapsed"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <span>{room.title}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* expanded content */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    key="expanded"
                    className="room-acc-expanded"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.45, delay: 0.18 }}
                  >
                    <p className="room-acc-sub">{room.subtitle}</p>
                    <h3 className="room-acc-title">{room.title}</h3>
                    <p className="room-acc-desc">{room.description}</p>
                    <Link to={`/${room.slug}`} className="room-acc-btn">
                      Explore Space <ArrowUpRight size={14} />
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* step number badge */}
              <div className="room-acc-index">{String(i + 1).padStart(2, '0')}</div>
            </motion.div>
          )
        })}
      </div>
    </Reveal>
  )
}

/* ─────────────────────────────────────────
   ABOUT MOSAIC
───────────────────────────────────────── */

function AboutMosaic() {
  const imgs = [heroLiving, villa, kitchen, bedroom]
  return (
    <div className="about-mosaic">
      {imgs.map((img, i) => (
        <motion.div
          key={i}
          className={`mosaic-cell mosaic-cell--${i + 1}`}
          initial={{ opacity: 0, clipPath: 'inset(100% 0 0 0)' }}
          whileInView={{ opacity: 1, clipPath: 'inset(0% 0 0 0)' }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 1, delay: i * 0.14, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.img
            src={img} alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.6 }}
          />
          <div className="mosaic-cell-border" />
        </motion.div>
      ))}
    </div>
  )
}

/* ─────────────────────────────────────────
   SERVICE CARD — FULL BLEED
───────────────────────────────────────── */

function ServiceCard({ service, images }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      className="svc-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <ImageCycler images={images} interval={hovered ? 2000 : 4500} style={{ position: 'absolute', inset: 0 }} />
      <div className="svc-card__overlay" />
      <motion.div className="svc-card__shine" animate={{ opacity: hovered ? 1 : 0 }} transition={{ duration: 0.5 }} />
      <div className="svc-card__content">
        <span className="svc-card__sub">{service.subtitle}</span>
        <h3 className="svc-card__title">{service.title}</h3>
        <motion.p className="svc-card__desc" animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 18 }} transition={{ duration: 0.4 }}>
          {service.description}
        </motion.p>
        <motion.div animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 14 }} transition={{ duration: 0.4, delay: 0.07 }}>
          <Link to="/services" className="svc-card__btn">Learn More <ArrowRight size={14} /></Link>
        </motion.div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────
   PROCESS — ZIGZAG ALTERNATING LAYOUT
   Steps alternate: text-left/image-right,
   then image-left/text-right, connected
   by a live gold vertical spine.
───────────────────────────────────────── */

/* ─────────────────────────────────────────
   HOW WE WORK — TABBED CINEMA PANEL
   6 tabs across top with auto-progress bar.
   Click any tab → image wipes in with a
   clip-path horizontal reveal + text slides.
───────────────────────────────────────── */

const STEP_PERKS = [
  ['Vision & lifestyle discovery', 'Budget framework', 'Site measurement'],
  ['3D visualisations & mood boards', 'Material & finish palette', 'Client approval session'],
  ['Technical drawings & BOQ', 'Vendor & product selection', 'Detailed cost estimation'],
  ['Contract & timeline sign-off', 'Team briefing & kickoff', 'Procurement begins'],
  ['Premium on-site craftsmanship', 'Weekly progress reports', 'Quality checkpoints'],
  ['Final client walkthrough', 'Snag rectification', '3-Month post-delivery warranty'],
]

function HowWeWork() {
  const [active, setActive] = useState(0)
  const [tabProg, setTabProg] = useState(0)
  const TAB_DUR = 6000

  useEffect(() => {
    setTabProg(0)
    const start = Date.now()
    const frame = setInterval(() => {
      const p = (Date.now() - start) / TAB_DUR
      if (p >= 1) {
        setActive(i => (i + 1) % processSteps.length)
      } else {
        setTabProg(p)
      }
    }, 40)
    return () => clearInterval(frame)
  }, [active])

  const step = processSteps[active]
  const perks = STEP_PERKS[active]
  const img   = PROCESS_IMGS[active]

  return (
    <section className="section section-linen hww-section">
      <div className="container">
        <Reveal>
          <div className="hww-header">
            <div>
              <span className="section-label">How We Work</span>
              <h2 className="section-title" style={{ marginBottom: 0 }}>Our 6-Step Design Process</h2>
            </div>
            <Link to="/how-we-work" className="btn btn-outline">Full Process <ArrowRight size={16} /></Link>
          </div>
        </Reveal>

        {/* ── Step tabs ── */}
        <Reveal delay={0.1}>
          <div className="hww-tabs">
            {processSteps.map((s, i) => (
              <button key={i} className={`hww-tab ${i === active ? 'active' : ''}`} onClick={() => setActive(i)}>
                <span className="hww-tab-num">{String(i + 1).padStart(2, '0')}</span>
                <span className="hww-tab-name">{s.title}</span>
                {i === active && (
                  <motion.div
                    className="hww-tab-bar"
                    initial={{ width: 0 }}
                    animate={{ width: `${tabProg * 100}%` }}
                    transition={{ duration: 0, ease: 'linear' }}
                  />
                )}
              </button>
            ))}
          </div>
        </Reveal>

        {/* ── Main panel ── */}
        <div className="hww-panel">

          {/* Left — text block */}
          <div className="hww-text">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="hww-big-num">{String(active + 1).padStart(2, '0')}</div>
                <h3 className="hww-step-title">{step.title}</h3>
                <p className="hww-step-desc">{step.description}</p>

                <div className="hww-perks">
                  {perks.map((perk, j) => (
                    <motion.div
                      key={j}
                      className="hww-perk"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: j * 0.1 + 0.25 }}
                    >
                      <div className="hww-perk-icon"><Check size={11} /></div>
                      <span>{perk}</span>
                    </motion.div>
                  ))}
                </div>

                <p className="hww-step-counter text-mono">
                  <span style={{ color: 'var(--gold)' }}>{String(active + 1).padStart(2, '0')}</span>
                  <span style={{ color: 'var(--ash)' }}> / {String(processSteps.length).padStart(2, '0')}</span>
                </p>
              </motion.div>
            </AnimatePresence>

            <div className="hww-dots">
              {processSteps.map((_, i) => (
                <button key={i} className={`hww-dot ${i === active ? 'active' : ''}`} onClick={() => setActive(i)} />
              ))}
            </div>
          </div>

          {/* Right — cinematic image wipe */}
          <div className="hww-visual">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ clipPath: 'inset(0 100% 0 0)', opacity: 0.6 }}
                animate={{ clipPath: 'inset(0 0% 0 0)', opacity: 1 }}
                exit={{ clipPath: 'inset(0 0 0 100%)', opacity: 0 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="hww-img"
              >
                <img src={img} alt={step.title} />
                <div className="hww-img-overlay" />
                <div className="hww-img-footer">
                  <span className="text-mono" style={{ color: 'var(--gold)', fontSize: 12 }}>
                    {String(active + 1).padStart(2, '0')} / {String(processSteps.length).padStart(2, '0')}
                  </span>
                  <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>{step.title}</span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────
   TESTIMONIALS — QUOTE STAGE
───────────────────────────────────────── */

function TestimonialsStage() {
  const [active, setActive] = useState(0)
  const [dir, setDir] = useState(1)

  useEffect(() => {
    const t = setInterval(() => { setDir(1); setActive(i => (i + 1) % testimonials.length) }, 6500)
    return () => clearInterval(t)
  }, [])

  const go = n => {
    setDir(n)
    setActive(i => (i + n + testimonials.length) % testimonials.length)
  }

  const t = testimonials[active]
  const slideV = {
    enter: d => ({ opacity: 0, x: d > 0 ? 70 : -70 }),
    center: { opacity: 1, x: 0 },
    exit: d => ({ opacity: 0, x: d > 0 ? -70 : 70 }),
  }

  return (
    <section className="section section-dark testimonials-stage-wrap">
      <div className="container">
        <div className="testimonials-stage">
          <div className="testimonials-quote-bg"><Quote size={200} /></div>
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div key={active} custom={dir}
              variants={slideV} initial="enter" animate="center" exit="exit"
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="testimonials-inner"
            >
              <div className="testimonials-stars">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <motion.span key={i} initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: i * 0.08, type: 'spring', stiffness: 300 }}>
                    <Star size={20} fill="var(--gold)" color="var(--gold)" />
                  </motion.span>
                ))}
              </div>
              <blockquote className="testimonials-quote">"{t.text}"</blockquote>
              <div className="testimonials-author">
                <div className="testimonials-avatar">{t.name.charAt(0)}</div>
                <div>
                  <strong>{t.name}</strong>
                  <span>{t.project}</span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
          <div className="testimonials-nav">
            <motion.button className="testimonials-btn" onClick={() => go(-1)} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <ChevronLeft size={20} />
            </motion.button>
            <div className="testimonials-dots">
              {testimonials.map((_, i) => (
                <button key={i} className={`t-dot ${i === active ? 'active' : ''}`}
                  onClick={() => { setDir(i > active ? 1 : -1); setActive(i) }} />
              ))}
            </div>
            <motion.button className="testimonials-btn" onClick={() => go(1)} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <ChevronRight size={20} />
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────
   YOUTUBE VIDEO GRID
───────────────────────────────────────── */

function YouTubeCard({ video, featured }) {
  const [hov, setHov] = useState(false)
  const thumb = `https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`
  return (
    <motion.a
      href={`https://www.youtube.com/watch?v=${video.id}`}
      target="_blank" rel="noopener noreferrer"
      className={`yt-card ${featured ? 'yt-card--featured' : ''}`}
      onHoverStart={() => setHov(true)} onHoverEnd={() => setHov(false)}
      whileHover={{ y: -6 }} transition={{ duration: 0.35 }}
    >
      <div className="yt-card__thumb">
        <img src={thumb} alt={video.title} loading="lazy"
          onError={e => { e.target.src = heroLiving }} />
        <div className="yt-card__overlay" />
        <motion.div className="yt-card__play" animate={{ scale: hov ? 1.18 : 1 }} transition={{ duration: 0.3 }}>
          <Play size={featured ? 34 : 24} fill="white" />
        </motion.div>
        <div className="yt-card__duration">ATTICARCH</div>
      </div>
      <div className="yt-card__info">
        <IconYoutube size={14} color="var(--gold)" />
        <h3 className="yt-card__title">{video.title}</h3>
      </div>
    </motion.a>
  )
}

/* ─────────────────────────────────────────
   INSTAGRAM GRID
───────────────────────────────────────── */

function InstaCard({ img, index }) {
  return (
    <Reveal delay={index * 0.05} dir="scale">
      <motion.a
        href="https://www.instagram.com/atticarch2020/"
        target="_blank" rel="noopener noreferrer"
        className="insta-card"
        whileHover={{ scale: 1.04 }}
        transition={{ duration: 0.4 }}
      >
        <img src={img} alt="ATTICARCH Instagram" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        <div className="insta-card__overlay">
          <IconInstagram size={28} />
        </div>
      </motion.a>
    </Reveal>
  )
}

/* ─────────────────────────────────────────
   MAIN HOME COMPONENT
───────────────────────────────────────── */

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('all')
  const categories = ['all', ...new Set(projects.map(p => p.category))]
  const filtered = activeCategory === 'all' ? projects : projects.filter(p => p.category === activeCategory)

  const [lightbox, setLightbox] = useState(null)

  useEffect(() => {
    const timer = setTimeout(() => ScrollTrigger.refresh(), 800)
    return () => { clearTimeout(timer); ScrollTrigger.getAll().forEach(tr => tr.kill()) }
  }, [])

  return (
    <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
      <Helmet>
        <title>ATTICARCH — Best Interior Designers in Bangalore | Luxury Interior Design</title>
        <meta name="description" content="ATTICARCH: Bangalore's premier interior design firm since 2002. Luxury residential, commercial & villa interiors. 500+ projects delivered. Get your free consultation today." />
      </Helmet>

      {/* ═══════════════════════════════════════════
          HERO — CINEMATIC PARALLAX IMAGE
      ══════════════════════════════════════════ */}
      <HeroParallax />

      {/* ═══════════════════════════════════════════
          ROOM EXPLORER — ACCORDION
      ══════════════════════════════════════════ */}
      <section className="section rooms-section">
        <div className="container">
          <Reveal>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 48, flexWrap: 'wrap', gap: 16 }}>
              <div>
                <span className="section-label">Room by Room</span>
                <h2 className="section-title" style={{ marginBottom: 0 }}>Every Space, Crafted to Perfection</h2>
              </div>
              <span style={{ fontSize: 13, color: 'var(--ash)', fontFamily: 'var(--font-accent)', letterSpacing: '0.06em' }}>
                Hover to explore
              </span>
            </div>
          </Reveal>
          <RoomAccordion />
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          ABOUT TEASER — KINETIC MOSAIC
      ══════════════════════════════════════════ */}
      <section className="section section-dark about-teaser">
        <div className="container">
          <div className="about-teaser__grid">
            <Reveal className="about-teaser__text" dir="left">
              <span className="section-label" style={{ color: 'var(--gold-light)' }}>About ATTICARCH</span>
              <h2 className="section-title" style={{ color: 'var(--warm-white)' }}>
                Crafting Luxury Interiors<br />Since <span className="text-gold">2002</span>
              </h2>
              <p className="about-teaser__desc">
                ATTICARCH is a multi-disciplinary consultancy firm providing Architectural, Interior Designing
                and Project Management services to domestic and corporate clients across Bangalore. With over
                22 years of expertise, we transform ordinary spaces into extraordinary living experiences.
              </p>
              <div className="about-teaser__highlights">
                {[{ n: '500', s: '+', l: 'Projects Completed' }, { n: '22', s: '+', l: 'Years Excellence' }, { n: '50', s: '+', l: 'Design Awards' }].map((h, i) => (
                  <div key={i} className="highlight-item">
                    <span className="highlight-number text-mono"><Counter end={h.n} suffix={h.s} /></span>
                    <span>{h.l}</span>
                  </div>
                ))}
              </div>
              <Link to="/about-us" className="btn btn-outline" style={{ marginTop: 40 }}>
                Know More <ArrowRight size={16} />
              </Link>
            </Reveal>
            <AboutMosaic />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SERVICES — FULL-BLEED IMMERSIVE
      ══════════════════════════════════════════ */}
      <section className="section services-section">
        <div className="container">
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <span className="section-label" style={{ justifyContent: 'center' }}>What We Do</span>
              <h2 className="section-title">Our Core Services</h2>
            </div>
          </Reveal>
          <div className="svc-grid">
            {services.map((svc, i) => (
              <Reveal key={svc.id} delay={i * 0.12}>
                <ServiceCard service={svc} images={SVC_IMGS[svc.id] || ALL_IMGS.slice(0, 5)} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          WORK TYPES — WHAT WE BUILD
      ══════════════════════════════════════════ */}
      <section className="section section-linen work-types-section">
        <div className="container">
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
              <span className="section-label" style={{ justifyContent: 'center' }}>Everything Under One Roof</span>
              <h2 className="section-title">What We Build</h2>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="work-types-grid">
              {workTypes.map((w, i) => (
                <motion.div key={i} className="work-type-chip"
                  whileHover={{ scale: 1.06, background: 'var(--gold-glow)', borderColor: 'var(--gold)' }}
                  transition={{ duration: 0.25 }}>
                  <span className="work-type-num text-mono">{String(i + 1).padStart(2, '0')}</span>
                  <span>{w}</span>
                </motion.div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          HOW WE WORK — TABBED CINEMA
      ══════════════════════════════════════════ */}
      <HowWeWork />

      {/* ═══════════════════════════════════════════
          ESTIMATE CALCULATOR
      ══════════════════════════════════════════ */}
      <section className="section section-dark estimate-mini">
        <div className="container">
          <div className="estimate-mini__grid">
            <Reveal>
              <span className="section-label" style={{ color: 'var(--gold-light)' }}>Estimate Calculator</span>
              <h2 className="section-title" style={{ color: 'var(--warm-white)' }}>
                Get an Instant <span className="text-gold">Cost Estimate</span>
              </h2>
              <p style={{ color: 'var(--mist)', lineHeight: 1.8, marginBottom: 32 }}>
                Use our smart calculator to get a rough estimate. Select your property type, size, and design style to get started.
              </p>
              <Link to="/estimate" className="btn btn-primary"><Calculator size={18} /> Open Full Calculator</Link>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="estimate-mini__card">
                {[['Property Type', '2/3 BHK Apartment'], ['Interior Style', 'Premium'], ['Carpet Area', '1,200 – 1,800 sq.ft']].map(([k, v]) => (
                  <div key={k} className="estimate-mini__row"><span>{k}</span><strong>{v}</strong></div>
                ))}
                <div className="estimate-mini__divider" />
                <div className="estimate-mini__total">
                  <span>Estimated Range</span>
                  <strong className="text-gold text-mono" style={{ fontSize: 'var(--text-3xl)' }}>₹12L — ₹22L</strong>
                </div>
                <Link to="/estimate" className="btn btn-outline" style={{ width: '100%', justifyContent: 'center', marginTop: 16 }}>
                  Customize Your Estimate <ArrowRight size={16} />
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          PROJECTS — EDITORIAL MASONRY
      ══════════════════════════════════════════ */}
      <section className="section projects-section">
        <div className="container">
          <Reveal>
            <div className="section-header-row" style={{ marginBottom: 32 }}>
              <div>
                <span className="section-label">Our Portfolio</span>
                <h2 className="section-title" style={{ marginBottom: 0 }}>Recently Completed</h2>
              </div>
              <Link to="/project-category/projects-residential" className="btn btn-outline">
                View All <ArrowRight size={16} />
              </Link>
            </div>
          </Reveal>

          {/* filters */}
          <Reveal>
            <div className="proj-filters">
              {categories.map(cat => (
                <motion.button key={cat}
                  className={`proj-filter-btn ${activeCategory === cat ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat)}
                  whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </motion.button>
              ))}
            </div>
          </Reveal>

          {/* masonry */}
          <div className="proj-masonry">
            <AnimatePresence mode="popLayout">
              {filtered.map((proj, i) => (
                <motion.div key={proj.id}
                  layout
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.38, delay: i * 0.04 }}
                  className="proj-item"
                  onClick={() => setLightbox(proj)}
                >
                  <ImageCycler
                    images={[proj.image, ...ALL_IMGS.filter(x => x !== proj.image).slice(0, 3)]}
                    interval={3200}
                    style={{ width: '100%', height: '100%' }}
                  />
                  <div className="proj-item__overlay">
                    <span className="proj-item__cat">{proj.category}</span>
                    <div>
                      <h3 className="proj-item__title">{proj.title}</h3>
                      <p className="proj-item__meta">{proj.location} · {proj.size}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          UPCOMING PROJECTS
      ══════════════════════════════════════════ */}
      <section className="section section-linen upcoming-section">
        <div className="container">
          <Reveal>
            <span className="section-label">Coming Soon</span>
            <h2 className="section-title">Upcoming Projects</h2>
          </Reveal>
          <div className="upcoming-grid">
            {upcomingProjects.map((project, i) => (
              <Reveal key={project.id} delay={i * 0.15}>
                <div className="upcoming-card">
                  <div className="upcoming-card__image">
                    <img src={project.image} alt={project.title} loading="lazy" />
                    <span className="upcoming-card__badge text-accent">{project.status}</span>
                  </div>
                  <div className="upcoming-card__content">
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-xl)' }}>{project.title}</h3>
                    <p style={{ color: 'var(--ash)', fontSize: 13, marginTop: 4 }}>{project.location} • {project.size}</p>
                    <div className="upcoming-card__progress">
                      <div className="upcoming-card__progress-bar">
                        <motion.div className="upcoming-card__progress-fill"
                          initial={{ width: 0 }} whileInView={{ width: `${project.progress}%` }}
                          viewport={{ once: true }} transition={{ duration: 1.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }} />
                      </div>
                      <span className="text-mono" style={{ fontSize: 12, color: 'var(--gold)' }}>{project.progress}%</span>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          TESTIMONIALS — QUOTE STAGE
      ══════════════════════════════════════════ */}
      <TestimonialsStage />

      {/* ═══════════════════════════════════════════
          TRUSTED PARTNERS
      ══════════════════════════════════════════ */}
      <section className="section section-linen partners-section">
        <div className="container">
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
              <span className="section-label" style={{ justifyContent: 'center' }}>We Work With the Best</span>
              <h2 className="section-title">Trusted Brand Partners</h2>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="partners-marquee-wrap">
              {[...partners, ...partners].map((p, i) => (
                <div key={i} className="partner-chip">{p}</div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          YOUTUBE VIDEO GRID
      ══════════════════════════════════════════ */}
      <section className="section section-linen yt-section">
        <div className="container">
          <Reveal>
            <div className="section-header-row" style={{ marginBottom: 48 }}>
              <div>
                <span className="section-label">Video Testimonials & Project Tours</span>
                <h2 className="section-title" style={{ marginBottom: 0 }}>See the Transformation</h2>
              </div>
              <a href="https://www.youtube.com/channel/UCYGM6iXNjQVNfW8Klw_oRWA" target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                <IconYoutube size={15} /> Subscribe
              </a>
            </div>
          </Reveal>
          <div className="yt-grid">
            {YT_CATALOG.map((v, i) => (
              <Reveal key={v.id} delay={i * 0.07}>
                <YouTubeCard video={v} featured={i === 0} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          INSTAGRAM GRID
      ══════════════════════════════════════════ */}
      <section className="section section-dark insta-section">
        <div className="container">
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <span className="section-label" style={{ justifyContent: 'center', color: 'var(--gold-light)' }}>Follow Along</span>
              <h2 className="section-title" style={{ color: 'var(--warm-white)' }}>@atticarch2020</h2>
              <p style={{ color: 'var(--mist)', marginTop: 8 }}>Daily design inspiration from our studio</p>
            </div>
          </Reveal>
          <div className="insta-grid">
            {INSTA_IMGS.map((img, i) => <InstaCard key={i} img={img} index={i} />)}
          </div>
          <Reveal>
            <div style={{ textAlign: 'center', marginTop: 40 }}>
              <a href="https://www.instagram.com/atticarch2020/" target="_blank" rel="noopener noreferrer"
                className="btn btn-outline" style={{ borderColor: 'rgba(255,255,255,0.18)', color: 'var(--warm-white)' }}>
                <IconInstagram size={16} /> Follow on Instagram
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          BLOG — MAGAZINE LAYOUT
      ══════════════════════════════════════════ */}
      <section className="section blog-section">
        <div className="container">
          <Reveal>
            <div className="section-header-row" style={{ marginBottom: 48 }}>
              <div>
                <span className="section-label">Design Journal</span>
                <h2 className="section-title" style={{ marginBottom: 0 }}>Latest Insights</h2>
              </div>
              <Link to="/blog" className="btn btn-outline">All Articles <ArrowRight size={16} /></Link>
            </div>
          </Reveal>
          <div className="blog-magazine">
            {blogPosts[0] && (
              <Reveal className="blog-featured-wrap">
                <Link to={`/blog/${blogPosts[0].slug}`} className="blog-featured">
                  <img src={blogPosts[0].image} alt={blogPosts[0].title} />
                  <div className="blog-featured__overlay" />
                  <div className="blog-featured__content">
                    <span className="blog-tag">{blogPosts[0].category}</span>
                    <h2 className="blog-featured__title">{blogPosts[0].title}</h2>
                    <p className="blog-featured__exc">{blogPosts[0].excerpt}</p>
                    <span className="blog-read-more">Read Article <ArrowRight size={14} /></span>
                  </div>
                </Link>
              </Reveal>
            )}
            <div className="blog-sidebar">
              {blogPosts.slice(1).map((post, i) => (
                <Reveal key={post.id} delay={i * 0.1}>
                  <Link to={`/blog/${post.slug}`} className="blog-side-card">
                    <div className="blog-side-img">
                      <img src={post.image} alt={post.title} loading="lazy" />
                    </div>
                    <div className="blog-side-content">
                      <span className="blog-tag">{post.category}</span>
                      <h3>{post.title}</h3>
                      <p>{post.excerpt}</p>
                      <span className="blog-read-more">Read Article <ArrowRight size={14} /></span>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          MARQUEE BAND
      ══════════════════════════════════════════ */}
      <div className="marquee-band">
        <div className="marquee-track">
          {[0, 1, 2].map(j => (
            <span key={j} style={{ display: 'flex', gap: 56 }}>
              {['Luxury Interiors', '✦', 'Residential', '✦', 'Commercial', '✦', 'Villas', '✦', 'Award Winning', '✦', 'Since 2002', '✦', 'Bangalore', '✦'].map((item, k) => (
                <span key={k} className="marquee-item">{item}</span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          LIGHTBOX
      ══════════════════════════════════════════ */}
      <AnimatePresence>
        {lightbox && (
          <motion.div className="lightbox" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setLightbox(null)}>
            <motion.div className="lightbox__inner"
              initial={{ scale: 0.88, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.88, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              onClick={e => e.stopPropagation()}>
              <img src={lightbox.image} alt={lightbox.title} className="lightbox__img" />
              <div className="lightbox__info">
                <h3>{lightbox.title}</h3>
                <p>{lightbox.location} · {lightbox.size} · {lightbox.year}</p>
              </div>
              <button className="lightbox__close" onClick={() => setLightbox(null)}>×</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.main>
  )
}
