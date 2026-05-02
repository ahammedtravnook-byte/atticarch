import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { useLocation, Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { rooms, projects } from '../data/siteData'

function Reveal({ children, delay = 0 }) {
  return (
    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }} transition={{ duration: 0.7, delay, ease: [0.16,1,0.3,1] }}
      style={{ willChange: 'transform, opacity' }}>
      {children}
    </motion.div>
  )
}

export default function RoomType() {
  const location = useLocation()
  const slug = location.pathname.replace('/', '')
  const room = rooms.find(r => r.slug === slug) || rooms[0]

  return (
    <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <Helmet><title>{room.title} Interior Designers in Bangalore — ATTICARCH</title></Helmet>

      <section style={{ background: 'var(--charcoal)', padding: '140px 0 0', position: 'relative' }}>
        <div className="container" style={{ paddingBottom: 40, position: 'relative', zIndex: 2 }}>
          <Reveal>
            <span className="section-label" style={{ color: 'var(--gold-light)' }}>{room.subtitle}</span>
            <h1 className="text-display" style={{ fontSize: 'var(--text-6xl)', color: 'var(--warm-white)' }}>
              {room.title} <span className="text-gold">Interior Design</span>
            </h1>
          </Reveal>
        </div>
        <div style={{ height: 400, overflow: 'hidden' }}>
          <img src={room.image} alt={room.title} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.7)' }} />
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 800 }}>
          <Reveal>
            <h2 className="text-heading" style={{ fontSize: 'var(--text-3xl)', marginBottom: 16 }}>
              Premium {room.title} Design in Bangalore
            </h2>
            <p style={{ color: 'var(--ash)', lineHeight: 1.8 }}>{room.description}</p>
            <p style={{ color: 'var(--ash)', lineHeight: 1.8, marginTop: 16 }}>
              At ATTICARCH, we understand that every {room.title.toLowerCase()} is unique. Our designers work closely with you to 
              create spaces that perfectly blend functionality with aesthetics. Using premium materials and innovative 
              design techniques, we transform your {room.title.toLowerCase()} into a masterpiece that reflects your personal style.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section section-linen">
        <div className="container">
          <Reveal>
            <span className="section-label">Inspiration Gallery</span>
            <h2 className="section-title">{room.title} Design Ideas</h2>
          </Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginTop: 32 }}>
            {projects.slice(0, 6).map((p, i) => (
              <Reveal key={p.id} delay={i * 0.08}>
                <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', aspectRatio: '4/3' }}>
                  <img src={p.image} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-dark" style={{ textAlign: 'center' }}>
        <div className="container">
          <Reveal>
            <h2 className="section-title" style={{ color: 'var(--warm-white)' }}>
              Ready to Design Your {room.title}?
            </h2>
            <Link to="/contact-us" className="btn btn-primary" style={{ marginTop: 24 }}>
              Book Free Consultation <ArrowRight size={16} />
            </Link>
          </Reveal>
        </div>
      </section>
    </motion.main>
  )
}
