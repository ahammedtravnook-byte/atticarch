import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { Link, useParams } from 'react-router-dom'
import { ArrowRight, Check } from 'lucide-react'
import { services } from '../data/siteData'

function Reveal({ children, delay = 0 }) {
  return (
    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }} transition={{ duration: 0.7, delay, ease: [0.16,1,0.3,1] }}
      style={{ willChange: 'transform, opacity' }}>
      {children}
    </motion.div>
  )
}

export default function Services() {
  const { slug } = useParams()

  return (
    <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <Helmet><title>Our Services — ATTICARCH Interior Design, Architecture & Project Management</title></Helmet>

      <section style={{ background: 'var(--charcoal)', padding: '180px 0 100px' }}>
        <div className="container">
          <Reveal>
            <span className="section-label" style={{ color: 'var(--gold-light)' }}>Our Services</span>
            <h1 className="text-display" style={{ fontSize: 'var(--text-6xl)', color: 'var(--warm-white)' }}>
              Comprehensive Design <span className="text-gold">Solutions</span>
            </h1>
          </Reveal>
        </div>
      </section>

      {services.map((service, i) => (
        <section key={service.id} className={i % 2 === 1 ? 'section section-linen' : 'section'}>
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: i % 2 === 0 ? '1fr 1fr' : '1fr 1fr', gap: 60, alignItems: 'center' }}>
              <Reveal>
                <div style={{ order: i % 2 === 0 ? 0 : 1 }}>
                  <span className="text-accent" style={{ fontSize: 10, color: 'var(--gold)' }}>{service.subtitle}</span>
                  <h2 className="text-display" style={{ fontSize: 'var(--text-4xl)', marginTop: 8, marginBottom: 16 }}>{service.title}</h2>
                  <p style={{ color: 'var(--ash)', lineHeight: 1.8, marginBottom: 24 }}>{service.description}</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    {service.features.map((f, j) => (
                      <div key={j} style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 14, color: 'var(--smoke)' }}>
                        <Check size={14} color="var(--gold)" /> {f}
                      </div>
                    ))}
                  </div>
                  <Link to="/contact-us" className="btn btn-primary" style={{ marginTop: 32 }}>
                    Get Started <ArrowRight size={16} />
                  </Link>
                </div>
              </Reveal>
              <Reveal delay={0.2}>
                <div style={{ borderRadius: 'var(--radius-xl)', overflow: 'hidden', order: i % 2 === 0 ? 1 : 0 }}>
                  <img src={service.image} alt={service.title} style={{ width: '100%', height: 420, objectFit: 'cover' }} />
                </div>
              </Reveal>
            </div>
          </div>
        </section>
      ))}

      <section className="section section-dark" style={{ textAlign: 'center' }}>
        <div className="container">
          <Reveal>
            <h2 className="section-title" style={{ color: 'var(--warm-white)' }}>Let's Discuss Your Project</h2>
            <Link to="/estimate" className="btn btn-primary" style={{ marginTop: 24 }}>
              Get Estimate <ArrowRight size={16} />
            </Link>
          </Reveal>
        </div>
      </section>
    </motion.main>
  )
}
