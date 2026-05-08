import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { Phone, Send, Star, Check, Shield, Clock, Award, MessageCircle, ArrowRight, Play } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { stats } from '../data/siteData'
import heroImg from '../assets/images/hero-living.png'
import kitchenImg from '../assets/images/kitchen.png'
import villaImg from '../assets/images/villa.png'
import bedroomImg from '../assets/images/bedroom.png'
import apartmentImg from '../assets/images/apartment.png'
import commercialImg from '../assets/images/commercial.png'
import './LandingPage.css'

gsap.registerPlugin(ScrollTrigger)

const HERO_IMAGES = [heroImg, villaImg, kitchenImg, bedroomImg]

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

export default function LandingPage() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', type: '' })
  const [submitted, setSubmitted] = useState(false)
  const [heroIdx, setHeroIdx] = useState(0)
  const [stickyVisible, setStickyVisible] = useState(false)

  const handleSubmit = (e) => { e.preventDefault(); setSubmitted(true) }

  /* Hero image cycle */
  useEffect(() => {
    const t = setInterval(() => setHeroIdx(i => (i + 1) % HERO_IMAGES.length), 4500)
    return () => clearInterval(t)
  }, [])

  /* Show sticky CTA after scroll */
  useEffect(() => {
    const onScroll = () => setStickyVisible(window.scrollY > 400)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const benefits = [
    { icon: Award, text: '22+ Years of Experience', desc: 'Trusted expertise since 2002' },
    { icon: Shield, text: '500+ Projects Delivered', desc: 'Across Bangalore & beyond' },
    { icon: Clock, text: '3-Month Post-Delivery Warranty', desc: 'Complete peace of mind' },
    { icon: Star, text: '100% Client Satisfaction', desc: 'Rated 5-star by homeowners' },
  ]

  const projects = [
    { img: heroImg, title: '4BHK @ SNN Clermont', type: 'Apartment' },
    { img: kitchenImg, title: 'Premium Kitchen Design', type: 'Kitchen' },
    { img: villaImg, title: 'Luxury Villa Interiors', type: 'Villa' },
    { img: bedroomImg, title: 'Master Suite Design', type: 'Bedroom' },
    { img: apartmentImg, title: '3BHK @ Prestige Lakeside', type: 'Apartment' },
    { img: commercialImg, title: 'Corporate Office', type: 'Commercial' },
  ]

  return (
    <motion.main className="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Helmet><title>Free Interior Design Consultation — ATTICARCH Bangalore</title></Helmet>

      {/* ═══════════════════════════════════════
          HERO — PARALLAX + FORM
      ═══════════════════════════════════════ */}
      <section className="landing-hero">
        {/* Animated Background */}
        <div className="landing-hero__bg">
          <AnimatePresence mode="sync">
            <motion.img
              key={heroIdx}
              src={HERO_IMAGES[heroIdx]}
              alt="ATTICARCH interiors"
              className="landing-hero__bg-img"
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1.02 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.8, ease: 'easeInOut' }}
            />
          </AnimatePresence>
          <div className="landing-hero__overlay" />
          <div className="landing-hero__grain" />
        </div>

        {/* Floating orbs */}
        <motion.div className="landing-hero__orb landing-hero__orb--1"
          animate={{ y: [0, -30, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }} />
        <motion.div className="landing-hero__orb landing-hero__orb--2"
          animate={{ y: [0, 40, 0], x: [0, -20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }} />

        <div className="container landing-hero__inner">
          <motion.div className="landing-hero__left"
            initial={{ x: -60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}>

            <div className="landing-hero__badge">
              <span className="landing-hero__badge-dot" />
              Free Consultation Available
            </div>

            <h1 className="landing-hero__title">
              Experience <span className="text-gradient">Luxury</span><br />
              Interior Design
            </h1>

            <p className="landing-hero__desc">
              Book a <strong style={{ color: 'var(--gold)' }}>FREE design consultation</strong> with Bangalore's most trusted interior design firm. Transform your space today.
            </p>

            <div className="landing-hero__benefits">
              {benefits.map((b, i) => (
                <motion.div key={i} className="landing-benefit"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 + i * 0.1 }}
                  whileHover={{ x: 5 }}>
                  <div className="landing-benefit__icon">
                    <b.icon size={16} color="var(--gold)" />
                  </div>
                  <div>
                    <strong>{b.text}</strong>
                    <span>{b.desc}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Stats row */}
            <div className="landing-hero__stats">
              {stats.map((s, i) => (
                <div key={i} className="landing-stat">
                  <span className="landing-stat__num text-mono">
                    <Counter end={s.number.replace(/\D/g, '')} suffix={s.number.replace(/\d/g, '')} />
                  </span>
                  <span className="landing-stat__label">{s.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Consultation Form */}
          <motion.div className="landing-hero__right"
            initial={{ x: 60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}>

            <div className="landing-form-card">
              <div className="landing-form-card__header">
                <h2>Book Free Consultation</h2>
                <p>Our expert will call you within 30 minutes</p>
              </div>

              {submitted ? (
                <motion.div className="landing-form-success"
                  initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                  <div className="landing-form-success__icon">
                    <Check size={28} color="var(--gold)" />
                  </div>
                  <h3>Thank You!</h3>
                  <p>We'll call you within 30 minutes.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="landing-form">
                  <div className="landing-input-group">
                    <input type="text" placeholder="Your Name *" required
                      value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                  </div>
                  <div className="landing-input-group">
                    <input type="tel" placeholder="Phone Number *" required
                      value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
                  </div>
                  <div className="landing-input-group">
                    <input type="email" placeholder="Email Address"
                      value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                  </div>
                  <div className="landing-input-group">
                    <select value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
                      <option value="">Select Project Type</option>
                      <option>Apartment Interior</option>
                      <option>Villa Interior</option>
                      <option>Commercial Space</option>
                      <option>Renovation</option>
                    </select>
                  </div>
                  <button type="submit" className="landing-form__submit">
                    <Send size={16} /> Get Free Consultation
                  </button>
                  <p className="landing-form__secure">🔒 Your information is 100% secure</p>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          RECENT TRANSFORMATIONS
      ═══════════════════════════════════════ */}
      <section className="landing-projects">
        <div className="container">
          <motion.div className="landing-section-header"
            initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <span className="section-label" style={{ justifyContent: 'center' }}>Our Portfolio</span>
            <h2 className="section-title" style={{ textAlign: 'center' }}>Recent Transformations</h2>
          </motion.div>

          <div className="landing-projects__grid">
            {projects.map((proj, i) => (
              <motion.div key={i} className="landing-proj-card"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.1 }}
                whileHover={{ y: -6 }}>
                <div className="landing-proj-card__img">
                  <img src={proj.img} alt={proj.title} loading="lazy" />
                  <div className="landing-proj-card__overlay">
                    <span className="landing-proj-card__type">{proj.type}</span>
                  </div>
                </div>
                <div className="landing-proj-card__info">
                  <h3>{proj.title}</h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          VIDEO SHOWCASE
      ═══════════════════════════════════════ */}
      <section className="landing-video">
        <div className="container">
          <motion.div className="landing-section-header"
            initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <span className="section-label" style={{ justifyContent: 'center', color: 'var(--gold-light)' }}>Watch Our Work</span>
            <h2 className="section-title" style={{ textAlign: 'center', color: 'var(--warm-white)' }}>See the Transformation</h2>
          </motion.div>
          <div className="landing-video__grid">
            {[
              { id: 'vcUMkExgiCw', title: 'Luxury Interior Design' },
              { id: 'N2QJ6ETLnaQ', title: 'Residential Transformation' },
              { id: 'XzEPJfpn4FI', title: 'Premium Villa Interiors' },
            ].map((v, i) => (
              <motion.a key={v.id}
                href={`https://www.youtube.com/watch?v=${v.id}`}
                target="_blank" rel="noopener noreferrer"
                className="landing-yt-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.12 }}
                whileHover={{ y: -6 }}>
                <div className="landing-yt-card__thumb">
                  <img src={`https://img.youtube.com/vi/${v.id}/maxresdefault.jpg`} alt={v.title}
                    onError={e => { e.target.src = heroImg }} loading="lazy" />
                  <div className="landing-yt-card__play">
                    <Play size={24} fill="white" />
                  </div>
                </div>
                <h3>{v.title}</h3>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          STICKY CTA
      ═══════════════════════════════════════ */}
      <AnimatePresence>
        {stickyVisible && (
          <motion.div className="landing-sticky"
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}>
            <div className="container landing-sticky__inner">
              <span className="landing-sticky__text">
                📞 Get your <strong style={{ color: 'var(--gold)' }}>FREE</strong> consultation today!
              </span>
              <div className="landing-sticky__actions">
                <a href="tel:09845013138" className="btn btn-primary landing-sticky__btn">
                  <Phone size={14} /> Call Now
                </a>
                <a href="https://api.whatsapp.com/send?phone=919845013138" className="btn btn-outline landing-sticky__btn"
                  target="_blank" rel="noopener noreferrer">
                  <MessageCircle size={14} /> WhatsApp
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.main>
  )
}
