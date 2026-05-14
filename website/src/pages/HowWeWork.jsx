import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { ArrowRight, Check, ShieldCheck, Clock, Award } from 'lucide-react'
import { processSteps, pickImages } from '../data/siteData'
import SmartImage from '../components/ui/SmartImage'
import './HowWeWork.css'

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

const STEP_PERKS = [
  ['Vision & lifestyle discovery', 'Budget framework', 'Site measurement'],
  ['3D visualisations & mood boards', 'Material & finish palette', 'Client approval session'],
  ['Technical drawings & BOQ', 'Vendor & product selection', 'Detailed cost estimation'],
  ['Contract & timeline sign-off', 'Team briefing & kickoff', 'Procurement begins'],
  ['Premium on-site craftsmanship', 'Weekly progress reports', 'Quality checkpoints'],
  ['Final client walkthrough', 'Snag rectification', 'Post-delivery warranty'],
]

const PROMISES = [
  { icon: Clock, title: 'On-Time Delivery', desc: 'Milestone-tracked timelines with weekly progress reports.' },
  { icon: ShieldCheck, title: '10-Year Warranty', desc: 'Workmanship guaranteed long after handover.' },
  { icon: Award, title: 'Turnkey Execution', desc: 'One accountable team from concept to keys.' },
]

export default function HowWeWork() {
  const stepImgs = pickImages(6, 8)
  const heroImg = pickImages(1, 50)[0]

  return (
    <motion.main className="hww-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <Helmet><title>How We Work — ATTICARCH Interior Design Process</title></Helmet>

      {/* ── HERO ── */}
      <section className="hww-hero">
        <SmartImage src={heroImg} alt="" className="hww-hero__bg" tone="dark" eager />
        <div className="hww-hero__grad" />
        <div className="container hww-hero__inner">
          <Reveal>
            <span className="hww-eyebrow">Our Process</span>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="hww-hero__title">
              How We <em>Work</em>
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="hww-hero__sub">
              A proven 6-step journey — every project delivered with precision, creativity and
              uncompromising craftsmanship, on time.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="hww-hero__rail">
              {processSteps.map((s) => (
                <a href={`#step-${s.step}`} className="hww-hero__rail-item" key={s.step}>
                  <span className="hww-hero__rail-num text-mono">{String(s.step).padStart(2, '0')}</span>
                  <span className="hww-hero__rail-name">{s.title}</span>
                </a>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── TIMELINE ── */}
      <section className="section hww-timeline">
        <div className="container">
          <div className="hww-line" aria-hidden="true" />
          {processSteps.map((step, i) => (
            <div key={step.step} id={`step-${step.step}`} className={`hww-step ${i % 2 === 1 ? 'hww-step--alt' : ''}`}>
              <Reveal className="hww-step__text">
                <span className="hww-step__num">{String(step.step).padStart(2, '0')}</span>
                <h2 className="hww-step__title">{step.title}</h2>
                <p className="hww-step__desc">{step.description}</p>
                <ul className="hww-step__perks">
                  {STEP_PERKS[i].map((perk) => (
                    <li key={perk}>
                      <span className="hww-step__perk-ic"><Check size={11} /></span>
                      {perk}
                    </li>
                  ))}
                </ul>
              </Reveal>

              <div className="hww-step__node">
                <span className="text-mono">{String(step.step).padStart(2, '0')}</span>
              </div>

              <Reveal delay={0.12} className="hww-step__media">
                <div className="hww-step__img">
                  <SmartImage src={stepImgs[i]} alt={step.title} />
                  <span className="hww-step__img-tag">Step {step.step}</span>
                </div>
              </Reveal>
            </div>
          ))}
        </div>
      </section>

      {/* ── PROMISES ── */}
      <section className="section section-linen hww-promises">
        <div className="container">
          <Reveal>
            <div className="hww-promises__head">
              <span className="hww-label">The ATTICARCH Promise</span>
              <h2 className="hww-promises__title">What Every Project Comes With</h2>
            </div>
          </Reveal>
          <div className="hww-promises__grid">
            {PROMISES.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.1}>
                <div className="hww-promise">
                  <div className="hww-promise__ic"><p.icon size={22} /></div>
                  <h3 className="hww-promise__title">{p.title}</h3>
                  <p className="hww-promise__desc">{p.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="section section-dark hww-cta">
        <div className="container">
          <Reveal>
            <h2 className="hww-cta__title">Start Your Project Today</h2>
            <p className="hww-cta__sub">
              Ready to transform your space? Book a free consultation with our design experts.
            </p>
            <div className="hww-cta__actions">
              <Link to="/contact-us" className="btn btn-primary">
                Book Consultation <ArrowRight size={16} />
              </Link>
              <Link to="/estimate" className="btn btn-outline hww-cta__outline">
                Get an Estimate
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </motion.main>
  )
}
