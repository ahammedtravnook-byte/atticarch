import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { processSteps } from '../data/siteData'

function Reveal({ children, delay = 0 }) {
  return (
    <motion.div initial={{ opacity: 0, y: 60 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.8, delay, ease: [0.16,1,0.3,1] }}>
      {children}
    </motion.div>
  )
}

export default function HowWeWork() {
  return (
    <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <Helmet><title>How We Work — ATTICARCH Interior Design Process</title></Helmet>

      <section style={{ background: 'var(--charcoal)', padding: '180px 0 100px' }}>
        <div className="container">
          <Reveal>
            <span className="section-label" style={{ color: 'var(--gold-light)' }}>Our Process</span>
            <h1 className="text-display" style={{ fontSize: 'var(--text-6xl)', color: 'var(--warm-white)' }}>
              How We <span className="text-gold">Work</span>
            </h1>
            <p style={{ color: 'var(--silver)', maxWidth: 600, lineHeight: 1.7, marginTop: 16 }}>
              Our proven 6-step process ensures every project is delivered with precision, creativity, and on time.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 900 }}>
          {processSteps.map((step, i) => (
            <Reveal key={step.step} delay={i * 0.1}>
              <div style={{
                display: 'grid', gridTemplateColumns: '100px 1fr', gap: 32, padding: '40px 0',
                borderBottom: i < processSteps.length - 1 ? '1px solid var(--pearl)' : 'none'
              }}>
                <div>
                  <span className="text-mono" style={{ fontSize: 'var(--text-5xl)', fontWeight: 700, color: 'var(--gold)', opacity: 0.4 }}>
                    {String(step.step).padStart(2, '0')}
                  </span>
                </div>
                <div>
                  <h2 className="text-heading" style={{ fontSize: 'var(--text-3xl)', marginBottom: 12 }}>{step.title}</h2>
                  <p style={{ color: 'var(--ash)', lineHeight: 1.8, fontSize: 'var(--text-base)' }}>{step.description}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section section-dark" style={{ textAlign: 'center' }}>
        <div className="container">
          <Reveal>
            <h2 className="section-title" style={{ color: 'var(--warm-white)' }}>Start Your Project Today</h2>
            <p style={{ color: 'var(--mist)', maxWidth: 500, margin: '0 auto 32px', lineHeight: 1.7 }}>
              Ready to transform your space? Book a free consultation with our design experts.
            </p>
            <Link to="/contact-us" className="btn btn-primary">Book Consultation <ArrowRight size={16} /></Link>
          </Reveal>
        </div>
      </section>
    </motion.main>
  )
}
