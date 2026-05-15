import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, Check, ShieldCheck, Wallet, Package } from 'lucide-react'
import { services, workTypes, pickImages } from '../data/siteData'
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
  /* Non-overlapping offsets for Services page — every image on screen is unique.
       svc[0].image=3, extras 13-14
       svc[1].image=Post & Toast folder (separate pool), extras 22-23
       svc[2].image=17, extras 31-32
       heroImgs 86-88  (moved from 2 — was clashing with svc[0].image=3)
       showcase  46-57
       ctaImg    89    (moved from 31 — was clashing with svc[2].gallery[1]=31) */
  const svc = services.map((s, i) => ({
    ...s,
    gallery: [s.image, ...pickImages(2, 13 + i * 9)],
  }))
  const heroImgs = pickImages(3, 86)
  const showcase = pickImages(12, 46)
  const ctaImg = pickImages(1, 89)[0]

  return (
    <motion.main className="svc-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <Helmet>
        <title>Our Services — ATTICARCH | Residential, Commercial & Renovation Interiors</title>
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
              Turnkey Interior <em>Solutions</em>
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="svc-hero__sub">
              From concept to keys — ATTICARCH delivers residential, commercial and renovation
              interiors under one roof. Backed by a 10-Year Workmanship Warranty, with bespoke
              interiors starting from ₹10 Lacs.
            </p>
          </Reveal>
          <Reveal delay={0.25}>
            <div className="svc-hero__badges">
              <div className="svc-hero-badge">
                <ShieldCheck size={16} />
                <span><strong>10-Year</strong> Workmanship Warranty</span>
              </div>
              <div className="svc-hero-badge">
                <Wallet size={16} />
                <span>Starting from <strong>₹10 Lacs</strong></span>
              </div>
              <div className="svc-hero-badge">
                <Package size={16} />
                <span><strong>Turnkey</strong> End-to-End Execution</span>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.35}>
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

      {/* ── SCOPE OF WORK ── */}
      <section className="svc-scope">
        <div className="container">
          <Reveal>
            <div className="svc-scope__head">
              <span className="svc-eyebrow svc-eyebrow--dark">Everything Under One Roof</span>
              <h2 className="svc-scope__title">Complete Scope of Work</h2>
              <p className="svc-scope__sub">
                A single accountable team for every trade — civil, electrical, plumbing, joinery,
                lighting and finishes. No coordination headaches, no scope gaps.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="svc-scope__grid">
              {workTypes.map((w, i) => (
                <div className="svc-scope__chip" key={w}>
                  <span className="svc-scope__chip-num">{String(i + 1).padStart(2, '0')}</span>
                  <span className="svc-scope__chip-name">{w}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

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
            <h2 className="svc-cta__title">Let’s Design Your Space</h2>
            <p className="svc-cta__sub">
              Tell us about your home or office — we’ll turn it into something extraordinary.
            </p>
            <div className="svc-cta__actions">
              <Link to="/contact-us" className="btn btn-primary">
                Free Consultation <ArrowRight size={16} />
              </Link>
              <a href="tel:09845013138" className="btn btn-outline svc-cta__outline">
                Call 98450 13138
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </motion.main>
  )
}
