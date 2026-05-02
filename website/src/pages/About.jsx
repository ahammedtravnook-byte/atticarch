import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { ArrowRight, Award, Users, Target, Eye } from 'lucide-react'
import { stats } from '../data/siteData'
import heroImg from '../assets/images/hero-living.png'
import villaImg from '../assets/images/villa.png'

function Reveal({ children, delay = 0 }) {
  return (
    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }} transition={{ duration: 0.7, delay, ease: [0.16,1,0.3,1] }}
      style={{ willChange: 'transform, opacity' }}>
      {children}
    </motion.div>
  )
}

export default function About() {
  const milestones = [
    { year: '2002', title: 'Founded', desc: 'ATTICARCH established as a multi-disciplinary consultancy firm in Bangalore.' },
    { year: '2008', title: 'First 100 Projects', desc: 'Crossed the milestone of 100 completed residential and commercial projects.' },
    { year: '2014', title: 'Luxury Division', desc: 'Launched dedicated luxury interior design vertical for high-end villas and penthouses.' },
    { year: '2019', title: 'Award Recognition', desc: 'Recognized as one of the top interior design firms in Bangalore.' },
    { year: '2024', title: '500+ Projects', desc: 'Surpassed 500 successfully delivered projects across residential, commercial, and villa segments.' },
  ]

  return (
    <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <Helmet><title>About Us — ATTICARCH | Best Interior Design Firm in Bangalore</title></Helmet>

      {/* Hero */}
      <section style={{ background: 'var(--charcoal)', padding: '200px 0 100px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.15 }}>
          <img src={heroImg} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <Reveal>
            <span className="section-label" style={{ color: 'var(--gold-light)' }}>About ATTICARCH</span>
            <h1 className="text-display" style={{ fontSize: 'var(--text-6xl)', color: 'var(--warm-white)' }}>
              Crafting Exceptional <br /><span className="text-gold">Interiors Since 2002</span>
            </h1>
            <p style={{ color: 'var(--silver)', fontSize: 'var(--text-lg)', maxWidth: 600, lineHeight: 1.7, marginTop: 20 }}>
              A multi-disciplinary firm providing Architectural, Interior Designing and Project Management services across Bangalore.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
            <Reveal>
              <div>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16 }}>
                  <Target size={24} color="var(--gold)" />
                  <h2 className="text-heading" style={{ fontSize: 'var(--text-3xl)' }}>Our Mission</h2>
                </div>
                <p style={{ color: 'var(--ash)', lineHeight: 1.8 }}>
                  To transform ordinary spaces into extraordinary living experiences through innovative design, premium materials, 
                  and uncompromising quality. We believe every space tells a story, and we're here to craft yours.
                </p>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16, marginTop: 40 }}>
                  <Eye size={24} color="var(--gold)" />
                  <h2 className="text-heading" style={{ fontSize: 'var(--text-3xl)' }}>Our Vision</h2>
                </div>
                <p style={{ color: 'var(--ash)', lineHeight: 1.8 }}>
                  To be Bangalore's most trusted and creative interior design firm, setting benchmarks in luxury design 
                  and client satisfaction while making premium interiors accessible to every homeowner.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <div style={{ borderRadius: 'var(--radius-xl)', overflow: 'hidden' }}>
                <img src={villaImg} alt="ATTICARCH Vision" style={{ width: '100%', height: 450, objectFit: 'cover' }} />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="section section-dark">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 32, textAlign: 'center' }}>
            {stats.map((s, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div>
                  <span className="text-mono" style={{ fontSize: 'var(--text-5xl)', fontWeight: 700, color: 'var(--gold)' }}>{s.number}</span>
                  <p style={{ color: 'var(--mist)', fontFamily: 'var(--font-accent)', fontSize: 12, letterSpacing: '0.15em', textTransform: 'uppercase', marginTop: 8 }}>{s.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section section-linen">
        <div className="container" style={{ maxWidth: 800 }}>
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: 60 }}>
              <span className="section-label" style={{ justifyContent: 'center' }}>Our Journey</span>
              <h2 className="section-title">Milestones That Define Us</h2>
            </div>
          </Reveal>
          {milestones.map((m, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start', padding: '24px 0', borderBottom: '1px solid var(--pearl)' }}>
                <span className="text-mono" style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--gold)', minWidth: 80 }}>{m.year}</span>
                <div>
                  <h3 className="text-heading" style={{ fontSize: 'var(--text-xl)', marginBottom: 8 }}>{m.title}</h3>
                  <p style={{ color: 'var(--ash)', fontSize: 14, lineHeight: 1.7 }}>{m.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="section" style={{ textAlign: 'center' }}>
        <div className="container">
          <Reveal>
            <h2 className="section-title">Ready to Transform Your Space?</h2>
            <p className="section-subtitle" style={{ margin: '0 auto 32px' }}>Let's discuss your dream project</p>
            <Link to="/contact-us" className="btn btn-primary">Book Consultation <ArrowRight size={16} /></Link>
          </Reveal>
        </div>
      </section>
    </motion.main>
  )
}
