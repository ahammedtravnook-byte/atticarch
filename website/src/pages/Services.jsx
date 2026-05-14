import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, Check } from 'lucide-react'
import { services, pickImages } from '../data/siteData'
import SmartImage from '../components/ui/SmartImage'
import './Services.css'

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

export default function Services() {
  const svc = services.map((s, i) => ({
    ...s,
    gallery: [s.image, ...pickImages(2, 13 + i * 9)],
  }))
  const heroImgs = pickImages(3, 2)
  const showcase = pickImages(12, 46)
  const ctaImg = pickImages(1, 31)[0]

  return (
    <motion.main className="svc-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <Helmet>
        <title>Our Services — ATTICARCH Interior Design, Architecture & Project Management</title>
      </Helmet>

      {/* ── HERO ── */}
      <section className="svc-hero">
        <div className="svc-hero__bg">
          {heroImgs.map((img, i) => (
            <div className="svc-hero__bg-cell" key={i}>
              <SmartImage src={img} alt="" tone="dark" eager />
            </div>
          ))}
          <div className="svc-hero__bg-grad" />
        </div>

        <div className="container svc-hero__inner">
          <Reveal>
            <span className="svc-eyebrow">What We Do</span>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="svc-hero__title">
              Comprehensive Design <em>Solutions</em>
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="svc-hero__sub">
              From the first sketch to the final handover — ATTICARCH delivers turnkey interiors,
              architecture and project management under one roof, crafted for the way you live.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="svc-hero__tags">
              {services.map((s) => (
                <a href={`#${s.id}`} className="svc-hero__tag" key={s.id}>
                  {s.title} <ArrowUpRight size={14} />
                </a>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── SERVICE BLOCKS ── */}
      {svc.map((service, i) => (
        <section
          key={service.id}
          id={service.id}
          className={`svc-block ${i % 2 === 1 ? 'svc-block--alt' : ''}`}
        >
          <div className="container">
            <div className="svc-block__grid">
              {/* text */}
              <div className="svc-block__text">
                <span className="svc-block__index">{String(i + 1).padStart(2, '0')}</span>
                <Reveal>
                  <span className="svc-eyebrow svc-eyebrow--dark">{service.subtitle}</span>
                  <h2 className="svc-block__title">{service.title}</h2>
                  <p className="svc-block__desc">{service.description}</p>
                </Reveal>
                <Reveal delay={0.1}>
                  <div className="svc-block__features">
                    {service.features.map((f, j) => (
                      <div className="svc-feature" key={j}>
                        <span className="svc-feature__ic"><Check size={12} /></span>
                        {f}
                      </div>
                    ))}
                  </div>
                </Reveal>
                <Reveal delay={0.15}>
                  <Link to="/contact-us" className="btn btn-primary svc-block__cta">
                    Get Started <ArrowRight size={16} />
                  </Link>
                </Reveal>
              </div>

              {/* layered media */}
              <Reveal delay={0.1} className="svc-block__media">
                <div className="svc-block__img svc-block__img--main">
                  <SmartImage src={service.gallery[0]} alt={service.title} />
                </div>
                <div className="svc-block__img svc-block__img--float">
                  <SmartImage src={service.gallery[1]} alt="" />
                </div>
                <div className="svc-block__badge">
                  <span className="svc-block__badge-num">{String(i + 1).padStart(2, '0')}</span>
                  <span className="svc-block__badge-label">Service</span>
                </div>
              </Reveal>
            </div>
          </div>
        </section>
      ))}

      {/* ── WORK SHOWCASE MARQUEE ── */}
      <section className="svc-showcase">
        <div className="container">
          <Reveal>
            <div className="svc-showcase__head">
              <span className="svc-eyebrow svc-eyebrow--dark">Our Work</span>
              <h2 className="svc-showcase__title">A Glimpse of Our Craft</h2>
            </div>
          </Reveal>
        </div>
        <div className="svc-marquee">
          <div className="svc-marquee__track">
            {[...showcase, ...showcase].map((img, k) => (
              <div className="svc-marquee__item" key={k}>
                <SmartImage src={img} alt="" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="svc-cta">
        <SmartImage src={ctaImg} alt="" className="svc-cta__bg" tone="dark" />
        <div className="svc-cta__grad" />
        <div className="container svc-cta__inner">
          <Reveal>
            <span className="svc-eyebrow">Start Today</span>
            <h2 className="svc-cta__title">Let’s Discuss Your Project</h2>
            <p className="svc-cta__sub">
              Tell us about your space — we’ll turn it into something extraordinary.
            </p>
            <div className="svc-cta__actions">
              <Link to="/estimate" className="btn btn-primary">
                Get Estimate <ArrowRight size={16} />
              </Link>
              <Link to="/contact-us" className="btn btn-outline svc-cta__outline">
                Book a Consultation
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </motion.main>
  )
}
