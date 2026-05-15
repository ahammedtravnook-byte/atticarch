import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { useLocation, Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, Check, Ruler, Lightbulb, Sparkles, Layers } from 'lucide-react'
import { rooms, pickImages } from '../data/siteData'
import SmartImage from '../components/ui/SmartImage'
import ProjectLightbox from '../components/ui/ProjectLightbox'
import './RoomType.css'

function Reveal({ children, delay = 0, className = '' }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      style={{ willChange: 'transform, opacity' }}
    >
      {children}
    </motion.div>
  )
}

const ROOM_PERKS = [
  { icon: Ruler, label: 'Space Planning' },
  { icon: Layers, label: 'Custom Storage' },
  { icon: Lightbulb, label: 'Lighting Design' },
  { icon: Sparkles, label: 'Premium Finishes' },
]

const INCLUDED = [
  'Bespoke layout & space planning',
  '3D visualisation & mood boards',
  'Custom storage & joinery',
  'False ceiling & lighting design',
  'Premium materials & finishes',
  'Turnkey execution & handover',
]

export default function RoomType() {
  const location = useLocation()
  const slug = location.pathname.replace('/', '')
  const roomIndex = Math.max(0, rooms.findIndex((r) => r.slug === slug))
  const room = rooms[roomIndex] || rooms[0]
  const otherRooms = rooms.filter((r) => r.slug !== room.slug).slice(0, 4)

  /* Gallery offsets sit in 56+ range so they never collide with any
     room.image static offset (0, 6, 13, 20, 27, 34, 48, 55) — that
     means neither the hero image nor the "other rooms" thumbnails
     can duplicate a gallery image on the same page. */
  const gallery = pickImages(9, 56 + roomIndex * 5)
  const [lightbox, setLightbox] = useState(null)

  const lightboxProject = {
    title: `${room.title} Design`,
    location: 'ATTICARCH',
    year: 'Bangalore',
    images: gallery,
  }

  return (
    <motion.main className="rt-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <Helmet>
        <title>{room.title} Interior Designers in Bangalore — ATTICARCH</title>
      </Helmet>

      {/* ── HERO ── */}
      <section className="rt-hero">
        <div className="rt-hero__glow" />
        <div className="container">
          <Reveal>
            <nav className="rt-crumb">
              <Link to="/">Home</Link>
              <span>/</span>
              <Link to="/services">Rooms</Link>
              <span>/</span>
              <span className="rt-crumb__current">{room.title}</span>
            </nav>
          </Reveal>
          <Reveal delay={0.05}>
            <span className="rt-eyebrow">{room.subtitle}</span>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="rt-hero__title">
              {room.title} <em>Interior Design</em>
            </h1>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="rt-hero__sub">{room.description}</p>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="rt-hero__visual">
              <SmartImage src={room.image} alt={`${room.title} interior design`} tone="dark" eager />
              <span className="rt-hero__visual-frame" />
              <div className="rt-hero__perks">
                {ROOM_PERKS.map((p) => (
                  <div className="rt-perk" key={p.label}>
                    <p.icon size={16} />
                    <span>{p.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── OVERVIEW ── */}
      <section className="section rt-overview">
        <div className="container">
          <div className="rt-overview__grid">
            <Reveal className="rt-overview__intro">
              <span className="rt-label">The Approach</span>
              <h2 className="rt-overview__heading">
                Premium {room.title} design, crafted around you
              </h2>
              <p>{room.description}</p>
              <p>
                At ATTICARCH, every {room.title.toLowerCase()} is treated as a one-of-a-kind brief. Our
                designers blend functionality with atmosphere — premium materials, considered lighting and
                bespoke joinery — to create a space that feels effortless and unmistakably yours.
              </p>
              <Link to="/contact-us" className="btn btn-primary rt-overview__cta">
                Design My {room.title} <ArrowRight size={16} />
              </Link>
            </Reveal>

            <Reveal delay={0.15} className="rt-included">
              <span className="rt-included__label">What’s Included</span>
              <ul className="rt-included__list">
                {INCLUDED.map((item) => (
                  <li key={item}>
                    <span className="rt-included__ic"><Check size={12} /></span>
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── INSPIRATION GALLERY ── */}
      <section className="section section-linen rt-gallery-section">
        <div className="container">
          <Reveal>
            <div className="rt-gallery-head">
              <div>
                <span className="rt-label">Inspiration Gallery</span>
                <h2 className="rt-gallery-head__title">{room.title} Design Ideas</h2>
              </div>
              <span className="rt-gallery-head__hint">Click any image to expand</span>
            </div>
          </Reveal>

          <div className="rt-gallery">
            {gallery.map((img, i) => (
              <motion.button
                key={i}
                className={`rt-gallery__item ${i % 6 === 0 ? 'rt-gallery__item--wide' : ''} ${i % 4 === 1 ? 'rt-gallery__item--tall' : ''}`}
                onClick={() => setLightbox(i)}
                initial={{ opacity: 0, scale: 0.94 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.6, delay: (i % 4) * 0.06, ease: [0.16, 1, 0.3, 1] }}
              >
                <SmartImage src={img} alt={`${room.title} idea ${i + 1}`} />
                <span className="rt-gallery__num text-mono">{String(i + 1).padStart(2, '0')}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* ── OTHER ROOMS ── */}
      <section className="section rt-other">
        <div className="container">
          <Reveal>
            <div className="rt-other__head">
              <span className="rt-label">Explore More</span>
              <h2 className="rt-other__title">Other Spaces We Design</h2>
            </div>
          </Reveal>
          <div className="rt-other__grid">
            {otherRooms.map((r, i) => (
              <Reveal key={r.slug} delay={i * 0.08}>
                <Link to={`/${r.slug}`} className="rt-other__card">
                  <div className="rt-other__card-img">
                    <SmartImage src={r.image} alt={r.title} />
                  </div>
                  <div className="rt-other__card-body">
                    <span className="rt-other__card-sub">{r.subtitle}</span>
                    <h3 className="rt-other__card-title">{r.title}</h3>
                    <span className="rt-other__card-link">
                      Explore <ArrowUpRight size={14} />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="rt-cta">
        <SmartImage src={gallery[3] || room.image} alt="" className="rt-cta__bg" tone="dark" />
        <div className="rt-cta__grad" />
        <div className="container rt-cta__inner">
          <Reveal>
            <span className="rt-eyebrow">Let’s Begin</span>
            <h2 className="rt-cta__title">Ready to Design Your {room.title}?</h2>
            <p className="rt-cta__sub">Book a free consultation — no obligation, just expert guidance.</p>
            <div className="rt-cta__actions">
              <Link to="/contact-us" className="btn btn-primary">
                Book Free Consultation <ArrowRight size={16} />
              </Link>
              <Link to="/services" className="btn btn-outline rt-cta__outline">
                Explore Services
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <AnimatePresence>
        {lightbox !== null && (
          <ProjectLightbox project={lightboxProject} startIndex={lightbox} onClose={() => setLightbox(null)} />
        )}
      </AnimatePresence>
    </motion.main>
  )
}
