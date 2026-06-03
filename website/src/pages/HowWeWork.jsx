import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { ArrowRight, Check, ShieldCheck, Clock, Award } from 'lucide-react'
import { processSteps } from '../data/siteData'
import SmartImage from '../components/ui/SmartImage'
import './HowWeWork.css'

/* Hero stays a real interior photo; the step media are custom line-art
   illustrations (below) drawn in the brand gold palette. */
const HERO_IMAGE = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80'

/* ── Animated SVG illustrations, one per process step ──
   Gold gradient fills + CSS-driven motion (classes defined in HowWeWork.css). */
const G = 'var(--gold)'
const GD = 'var(--gold-dark)'
const SOFT = 'rgba(201,169,110,0.10)'
const SW = { fill: 'none', strokeWidth: 4, strokeLinecap: 'round', strokeLinejoin: 'round' }

function GoldDefs({ id }) {
  return (
    <defs>
      <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#E8D5A8" />
        <stop offset="0.55" stopColor="#C9A96E" />
        <stop offset="1" stopColor="#A68B4B" />
      </linearGradient>
    </defs>
  )
}

function StepIllustration({ index }) {
  const common = { viewBox: '0 0 480 360', className: 'hww-illus', xmlns: 'http://www.w3.org/2000/svg' }
  const gid = `hwgrad${index}`
  const grad = `url(#${gid})`

  switch (index) {
    case 0: // Get Acquainted — chat with animated typing dots
      return (
        <svg {...common}>
          <GoldDefs id={gid} />
          <circle className="il-breathe" cx="240" cy="180" r="132" fill={SOFT} />
          <g className="il-float">
            <rect x="92" y="92" width="190" height="118" rx="24" fill="#fff" stroke={G} {...SW} />
            <path d="M138 210 v36 l42 -36" fill="#fff" stroke={G} {...SW} />
            <circle className="il-dot il-dot1" cx="150" cy="151" r="11" fill={G} />
            <circle className="il-dot il-dot2" cx="190" cy="151" r="11" fill={G} />
            <circle className="il-dot il-dot3" cx="230" cy="151" r="11" fill={G} />
          </g>
          <g className="il-float-b">
            <rect x="228" y="150" width="166" height="108" rx="22" fill={grad} stroke={GD} {...SW} />
            <path d="M352 258 v30 l-38 -30" fill={grad} stroke={GD} {...SW} />
            <line x1="254" y1="186" x2="368" y2="186" stroke="#fff" {...SW} />
            <line x1="254" y1="212" x2="344" y2="212" stroke="#fff" {...SW} opacity="0.85" />
          </g>
          <g className="il-twinkle">
            <path d="M398 92 l5 14 14 5 -14 5 -5 14 -5 -14 -14 -5 14 -5 z" fill={G} />
          </g>
        </svg>
      )
    case 1: // Concept Creation — palette + a pencil that draws a line
      return (
        <svg {...common}>
          <GoldDefs id={gid} />
          <circle className="il-breathe" cx="240" cy="180" r="132" fill={SOFT} />
          <rect x="116" y="74" width="248" height="212" rx="18" fill="#fff" stroke={G} {...SW} />
          <rect x="142" y="100" width="104" height="78" rx="10" fill={SOFT} stroke={G} {...SW} />
          {/* animated sketch stroke */}
          <path className="il-draw" d="M150 150 q24 -34 52 -4 t52 -2" stroke={GD} strokeWidth="4" fill="none" strokeLinecap="round" />
          {/* palette swatches pulsing in */}
          <circle className="il-pop il-pop1" cx="292" cy="120" r="16" fill={grad} />
          <circle className="il-pop il-pop2" cx="330" cy="120" r="16" fill={G} opacity="0.6" />
          <circle className="il-pop il-pop3" cx="311" cy="152" r="16" fill={GD} opacity="0.5" />
          <rect x="142" y="206" width="186" height="14" rx="7" fill={G} opacity="0.45" />
          <rect x="142" y="232" width="132" height="14" rx="7" fill={G} opacity="0.28" />
          {/* pencil */}
          <g className="il-pencil">
            <line x1="300" y1="196" x2="352" y2="252" stroke={GD} strokeWidth="7" strokeLinecap="round" />
            <path d="M352 252 l12 22 -22 -12 z" fill={GD} />
            <line x1="300" y1="196" x2="312" y2="184" stroke={G} strokeWidth="7" strokeLinecap="round" />
          </g>
        </svg>
      )
    case 2: // Design Development — floor plan + a spinning compass
      return (
        <svg {...common}>
          <GoldDefs id={gid} />
          <circle className="il-breathe" cx="240" cy="180" r="132" fill={SOFT} />
          <rect x="96" y="84" width="208" height="196" rx="12" fill="#fff" stroke={G} {...SW} />
          <path d="M124 128 h150 v120 h-150 z" stroke={G} {...SW} opacity="0.6" />
          <path d="M124 184 h70 v64" stroke={G} {...SW} opacity="0.6" />
          <path d="M194 128 v34 h80" stroke={G} {...SW} opacity="0.6" />
          {/* compass that rotates */}
          <g className="il-spin" style={{ transformOrigin: '330px 150px' }}>
            <circle cx="330" cy="150" r="8" fill={GD} />
            <line x1="330" y1="150" x2="306" y2="214" stroke={GD} strokeWidth="6" strokeLinecap="round" />
            <line x1="330" y1="150" x2="356" y2="214" stroke={GD} strokeWidth="6" strokeLinecap="round" />
            <circle cx="356" cy="214" r="6" fill={G} />
          </g>
          <circle className="il-trace" cx="330" cy="150" r="64" stroke={grad} strokeWidth="4" fill="none" />
        </svg>
      )
    case 3: // Registration — document + a pen drawing a signature + pulsing seal
      return (
        <svg {...common}>
          <GoldDefs id={gid} />
          <circle className="il-breathe" cx="240" cy="180" r="132" fill={SOFT} />
          <rect x="118" y="70" width="190" height="220" rx="14" fill="#fff" stroke={G} {...SW} />
          <line x1="144" y1="108" x2="282" y2="108" stroke={G} {...SW} />
          <line x1="144" y1="138" x2="282" y2="138" stroke={G} {...SW} opacity="0.35" />
          <line x1="144" y1="166" x2="248" y2="166" stroke={G} {...SW} opacity="0.35" />
          {/* signature being drawn */}
          <path className="il-draw" d="M150 212 q14 -26 28 0 t30 -2 q10 18 26 -4" stroke={GD} strokeWidth="4" fill="none" strokeLinecap="round" />
          {/* seal */}
          <g className="il-pulse" style={{ transformOrigin: '320px 252px' }}>
            <circle cx="320" cy="252" r="46" fill={grad} stroke={GD} {...SW} />
            <path d="M299 252 l15 17 27 -34" stroke="#fff" strokeWidth="7" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </svg>
      )
    case 4: // Execution — wall + a roller sweeping paint across
      return (
        <svg {...common}>
          <GoldDefs id={gid} />
          <circle className="il-breathe" cx="240" cy="180" r="132" fill={SOFT} />
          <rect x="108" y="150" width="264" height="130" rx="10" fill="#fff" stroke={G} {...SW} />
          {/* painted gradient band that grows */}
          <clipPath id={`wall${index}`}><rect x="110" y="152" width="260" height="126" rx="9" /></clipPath>
          <g clipPath={`url(#wall${index})`}>
            <rect className="il-paint" x="108" y="150" width="120" height="130" fill={grad} opacity="0.9" />
          </g>
          <line x1="108" y1="194" x2="372" y2="194" stroke={G} {...SW} opacity="0.35" />
          <line x1="108" y1="238" x2="372" y2="238" stroke={G} {...SW} opacity="0.35" />
          <line x1="184" y1="150" x2="184" y2="194" stroke={G} {...SW} opacity="0.35" />
          <line x1="268" y1="194" x2="268" y2="238" stroke={G} {...SW} opacity="0.35" />
          {/* roller that sweeps left↔right */}
          <g className="il-roll">
            <rect x="150" y="92" width="96" height="40" rx="10" fill={grad} stroke={GD} {...SW} />
            <line x1="198" y1="132" x2="198" y2="156" stroke={GD} strokeWidth="7" strokeLinecap="round" />
            <path d="M198 156 q0 22 -28 22 l0 40" stroke={GD} strokeWidth="7" fill="none" strokeLinecap="round" />
          </g>
        </svg>
      )
    case 5: // Delivery — house + a key that turns
    default:
      return (
        <svg {...common}>
          <GoldDefs id={gid} />
          <circle className="il-breathe" cx="240" cy="180" r="132" fill={SOFT} />
          <path d="M138 198 L236 120 L334 198" stroke={G} {...SW} />
          <path d="M236 120 l0 -22" stroke={G} {...SW} opacity="0.5" />
          <rect x="166" y="198" width="140" height="118" rx="6" fill="#fff" stroke={G} {...SW} />
          <rect x="214" y="250" width="48" height="66" rx="4" fill={grad} stroke={GD} {...SW} />
          <circle cx="252" cy="284" r="4" fill="#fff" />
          {/* key that turns */}
          <g className="il-key" style={{ transformOrigin: '348px 244px' }}>
            <circle cx="348" cy="244" r="22" fill="none" stroke={GD} strokeWidth="7" />
            <line x1="366" y1="258" x2="404" y2="298" stroke={GD} strokeWidth="7" strokeLinecap="round" />
            <line x1="392" y1="288" x2="383" y2="298" stroke={GD} strokeWidth="7" strokeLinecap="round" />
          </g>
          <g className="il-twinkle">
            <path d="M120 120 l4 12 12 4 -12 4 -4 12 -4 -12 -12 -4 12 -4 z" fill={G} />
          </g>
        </svg>
      )
  }
}

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
  const heroImg = HERO_IMAGE

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
                <div className="hww-step__img hww-step__img--illus">
                  <span className="hww-illus__ghost" aria-hidden="true">{String(step.step).padStart(2, '0')}</span>
                  <StepIllustration index={i} />
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
            <h2 className="hww-cta__title">Transform Your Space Today</h2>
            <p className="hww-cta__sub">
              Ready to transform your space? Book a free consultation with our design experts.
            </p>
            <div className="hww-cta__actions">
              <Link to="/contact-us" className="btn btn-primary">
                Book Consultation <ArrowRight size={16} />
              </Link>
              <Link to="/services" className="btn btn-outline hww-cta__outline">
                Explore Services
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </motion.main>
  )
}
