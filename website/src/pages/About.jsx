import { useRef } from 'react'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight, ArrowUpRight, Target, Eye, Award, Check } from 'lucide-react'
import { FaLinkedin } from 'react-icons/fa'
import { valueProps, principles, approachPoints, team, visionStatement, partners, partnerLogo, pickImages } from '../data/siteData'
import { useData } from '../context/DataContext'
import './About.css'

/* Eagerly import every team headshot from /assets/People so we can map by filename slug */
const peopleMap = import.meta.glob('../assets/People/*.{png,jpg,jpeg,webp}', { eager: true, import: 'default' })
const personImage = (slug) => {
  const entry = Object.entries(peopleMap).find(([k]) => k.toLowerCase().includes(`/${slug}.`))
  return entry ? entry[1] : null
}

const heroImg = pickImages(1, 0)[0]
const villaImg = pickImages(1, 25)[0]
const approachImg = pickImages(1, 33)[0]

gsap.registerPlugin(ScrollTrigger)

export default function About() {
  const { aboutContent } = useData()
  // Prefer CMS-managed content (settings/about), fall back to static defaults
  const vision = aboutContent?.visionStatement || visionStatement
  const principlesList = aboutContent?.principles?.length ? aboutContent.principles : principles
  const approachList = aboutContent?.approachPoints?.length ? aboutContent.approachPoints : approachPoints
  const valuePropsList = aboutContent?.valueProps?.length ? aboutContent.valueProps : valueProps

  const heroRef = useRef(null)
  const heroBgRef = useRef(null)
  const heroTitleRef = useRef(null)
  const heroLineRef = useRef(null)
  const statsRef = useRef(null)
  const missionImageRef = useRef(null)

  const featuredTeam = team.filter((t) => t.featured)
  const supportTeam = team.filter((t) => !t.featured)

  useGSAP(() => {
    gsap.to(heroBgRef.current, {
      y: '30%', ease: 'none',
      scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: true },
    })

    const words = heroTitleRef.current?.querySelectorAll('.word-inner')
    if (words?.length) {
      gsap.from(words, { y: 80, opacity: 0, duration: 1, stagger: 0.06, ease: 'power4.out', delay: 0.3 })
    }
    gsap.to(heroLineRef.current, { width: 80, duration: 1, ease: 'power2.out', delay: 0.8 })

    if (missionImageRef.current) {
      gsap.from(missionImageRef.current, {
        clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)',
        duration: 1.2, ease: 'power3.inOut',
        scrollTrigger: { trigger: missionImageRef.current, start: 'top 75%', once: true },
      })
    }

    ScrollTrigger.create({
      trigger: statsRef.current, start: 'top 80%', once: true,
      onEnter: () => {
        gsap.to('.about-stats__underline', {
          scaleX: 1, duration: 0.8, stagger: 0.15, ease: 'power2.out', delay: 0.3,
        })
      },
    })

    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener('load', refresh)
    const refreshTimeout = setTimeout(refresh, 500)
    if (document.fonts?.ready) document.fonts.ready.then(refresh)

    return () => {
      window.removeEventListener('load', refresh)
      clearTimeout(refreshTimeout)
    }
  }, { scope: heroRef })

  const splitTitle = (text) =>
    text.split(' ').map((word, i) => (
      <span key={i} style={{ overflow: 'hidden', display: 'inline-block' }}>
        <span className="word-inner" style={{ display: 'inline-block' }}>{word}&nbsp;</span>
      </span>
    ))

  return (
    <motion.main
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }} ref={heroRef}
    >
      <Helmet><title>About Us — ATTICARCH | Best Interior Design Firm in Bangalore</title></Helmet>

      {/* ── HERO ── */}
      <section className="about-hero">
        <div className="about-hero__bg" ref={heroBgRef}>
          <img src={heroImg} alt="" />
        </div>
        <div className="container about-hero__content">
          <span className="about-hero__label">About ATTICARCH</span>
          <h1 className="about-hero__title" ref={heroTitleRef}>
            {splitTitle('Crafting Exceptional')}
            <br />
            <span style={{ color: 'var(--gold)' }}>{splitTitle('Interiors Since 2002')}</span>
          </h1>
          <div className="about-hero__line" ref={heroLineRef} />
          <p className="about-hero__subtitle">
            Bangalore's trusted end-to-end interior design studio — delivering residential, commercial and renovation interiors with a 10-Year Workmanship Warranty, starting from ₹10 Lakhs.
          </p>
        </div>
      </section>

      {/* ── INTRO + MISSION/VISION ── */}
      <section className="about-mission">
        <div className="container">
          <motion.div
            className="about-intro"
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="about-intro__eyebrow">Welcome to ATTICARCH</span>
            <h2 className="about-intro__title">
              A one-stop solution for clients seeking <em>thoughtful</em> interior design.
            </h2>
            <p className="about-intro__body">
              Since 2002, ATTICARCH has delivered turnkey interior design to domestic and corporate clients
              across Bangalore. We bring residential, commercial and renovation projects to life — from first
              sketch to final handover — with an in-house team that handles every trade under one roof.
            </p>
          </motion.div>

          <div className="about-mission__grid">
            <div>
              <motion.div
                className="about-mission__card"
                initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="about-mission__card-header">
                  <motion.div
                    initial={{ scale: 0 }} whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                  >
                    <Target size={26} color="var(--gold)" />
                  </motion.div>
                  <h3>Our Mission</h3>
                </div>
                <p>
                  To transform ordinary spaces into extraordinary living experiences through innovative design,
                  premium materials and uncompromising quality. Every space tells a story — we're here to craft yours.
                </p>
              </motion.div>

              <motion.div
                className="about-mission__card"
                initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="about-mission__card-header">
                  <motion.div
                    initial={{ scale: 0 }} whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: 'spring', stiffness: 200, delay: 0.35 }}
                  >
                    <Eye size={26} color="var(--gold)" />
                  </motion.div>
                  <h3>Our Vision</h3>
                </div>
                <p>{vision}</p>
              </motion.div>
            </div>

            <motion.div
              className="about-mission__image"
              initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <div ref={missionImageRef} style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}>
                <img src={villaImg} alt="ATTICARCH Vision" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── PRINCIPLES ── */}
      <section className="about-principles">
        <div className="about-principles__decor" aria-hidden="true">
          <div className="about-principles__orb" />
        </div>
        <div className="container">
          <motion.div
            className="about-section-head"
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7 }}
          >
            <span className="section-label" style={{ justifyContent: 'center', color: 'var(--gold-light)' }}>Principles</span>
            <h2 className="about-section-head__title" style={{ color: 'var(--warm-white)' }}>
              Three Principles. <em>Every Project.</em>
            </h2>
            <p className="about-section-head__sub" style={{ color: 'rgba(255,255,255,0.65)' }}>
              ATTICARCH is built on three non-negotiables. We hold ourselves to them on every single brief.
            </p>
          </motion.div>

          <div className="about-principles__grid">
            {principlesList.map((p, i) => (
              <motion.div
                key={p.num}
                className="about-principle"
                initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.7, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -8 }}
              >
                <span className="about-principle__num">{p.num}</span>
                <h3 className="about-principle__title">{p.title}</h3>
                <p className="about-principle__desc">{p.desc}</p>
                <div className="about-principle__accent" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── OUR APPROACH ── */}
      <section className="about-approach">
        <div className="container">
          <div className="about-approach__grid">
            <motion.div
              className="about-approach__media"
              initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="about-approach__img">
                <img src={approachImg} alt="Our Approach" />
                <div className="about-approach__img-grad" />
              </div>
            </motion.div>

            <motion.div
              className="about-approach__text"
              initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="section-label">The Essence of Design</span>
              <h2 className="about-approach__title">Our Approach</h2>
              <p className="about-approach__lead">
                We offer complete end-to-end interiors for residential and commercial spaces. Beyond key client
                considerations of time, cost and operations — we pay equal attention to creating aesthetically
                pleasant and functionally reliable spaces.
              </p>
              <ul className="about-approach__list">
                {approachList.map((point, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: 16 }} whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 + i * 0.08 }}
                  >
                    <span className="about-approach__check"><Check size={11} /></span>
                    <span>{point}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="about-stats" ref={statsRef}>
        <div className="container">
          <div className="about-stats__grid">
            {valuePropsList.map((s, i) => (
              <motion.div
                className="about-stats__item" key={i}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className="about-stats__number">{s.value}</span>
                <span className="about-stats__label">{s.label}</span>
                <div className="about-stats__underline" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEAM — DRAMATIC LEADERSHIP + STUDIO GRID ── */}
      <section className="about-team">
        <div className="about-team__decor" aria-hidden="true">
          <div className="about-team__orb" />
        </div>

        <div className="container">
          <motion.div
            className="about-section-head"
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7 }}
          >
            <span className="section-label" style={{ justifyContent: 'center' }}>Our Team</span>
            <h2 className="about-section-head__title">
              The People Behind <em>ATTICARCH</em>
            </h2>
            <p className="about-section-head__sub">
              Architects, designers and craftsmen — one accountable team from first sketch to final handover.
            </p>
          </motion.div>

          {/* Featured leadership — bold editorial cards */}
          <div className="about-team__leadership">
            {featuredTeam.map((person, i) => {
              const img = personImage(person.slug)
              const initials = person.name.split(' ').slice(0, 2).map((s) => s.charAt(0)).join('')
              return (
                <motion.article
                  key={person.slug}
                  className="leader-card"
                  initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.9, delay: i * 0.14, ease: [0.16, 1, 0.3, 1] }}
                >
                  {/* Floating index number */}
                  <span className="leader-card__index">{String(i + 1).padStart(2, '0')}</span>

                  {/* Portrait with gradient + initials placeholder */}
                  <div className="leader-card__media">
                    {img ? (
                      <img src={img} alt={person.name} loading="lazy" />
                    ) : (
                      <div className="leader-card__placeholder">{initials}</div>
                    )}
                    <div className="leader-card__media-grad" />
                    <div className="leader-card__media-tint" />

                    {/* Role pill floating over image */}
                    <div className="leader-card__role-pill">
                      <span className="leader-card__role-dot" />
                      {person.role}
                    </div>

                    {/* Social icon top-right */}
                    <a
                      href="https://www.linkedin.com/company/atticarch/"
                      target="_blank" rel="noopener noreferrer"
                      className="leader-card__social"
                      aria-label={`${person.name} on LinkedIn`}
                    >
                      <FaLinkedin size={15} />
                    </a>
                  </div>

                  {/* Body — name + bio with quote mark accent */}
                  <div className="leader-card__body">
                    <h3 className="leader-card__name">{person.name}</h3>
                    <div className="leader-card__bio-wrap">
                      <span className="leader-card__quote" aria-hidden="true">"</span>
                      <p className="leader-card__bio">{person.bio}</p>
                    </div>
                  </div>

                  {/* Bottom gold accent */}
                  <div className="leader-card__accent" />
                </motion.article>
              )
            })}
          </div>

          {/* Divider */}
          <motion.div
            className="about-team__divider"
            initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }}
            viewport={{ once: true }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="about-team__divider-line" />
            <span className="about-team__divider-label">
              <Award size={14} /> Studio Team
            </span>
            <span className="about-team__divider-line" />
          </motion.div>

          {/* Studio team — staggered editorial grid */}
          <div className="about-team__grid">
            {supportTeam.map((person, i) => {
              const img = personImage(person.slug)
              const initials = person.name.split(' ').slice(0, 2).map((s) => s.charAt(0)).join('')
              return (
                <motion.div
                  key={person.slug}
                  className="team-card"
                  initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="team-card__media">
                    {img ? (
                      <img src={img} alt={person.name} loading="lazy" />
                    ) : (
                      <div className="team-card__placeholder">{initials}</div>
                    )}
                    <div className="team-card__overlay" />

                    {/* Floating role chip */}
                    <span className="team-card__role-chip">{person.role}</span>
                  </div>
                  <div className="team-card__body">
                    <h4 className="team-card__name">{person.name}</h4>
                    <span className="team-card__hint">
                      <FaLinkedin size={11} />
                    </span>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── PARTNERS — LOGO WALL SHOWCASE ── */}
      <section className="about-partners">
        <div className="about-partners__bg" aria-hidden="true">
          <div className="about-partners__orb about-partners__orb--1" />
          <div className="about-partners__orb about-partners__orb--2" />
        </div>

        <div className="container">
          <motion.div
            className="about-section-head"
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7 }}
          >
            <span className="section-label" style={{ justifyContent: 'center' }}>What's Next</span>
            <h2 className="about-section-head__title">
              Who We <em>Partner With</em>
            </h2>
            <p className="about-section-head__sub">
              We specify and install hardware, finishes and fixtures only from brands we trust —
              the same names you'd find on the world's most considered interiors.
            </p>
          </motion.div>

          {/* Decorative marquee strip — names scrolling behind the wall */}
          <div className="about-partners__strip" aria-hidden="true">
            <div className="about-partners__strip-track">
              {[...partners, ...partners, ...partners].map((p, i) => (
                <span key={i} className="about-partners__strip-item">
                  <span className="about-partners__strip-dot" />
                  {p.name}
                </span>
              ))}
            </div>
          </div>

          {/* Featured logo wall */}
          <div className="logo-wall">
            {partners.map((p, i) => {
              const logo = partnerLogo(p.slug)
              return (
                <motion.div
                  key={p.slug}
                  className="logo-cell"
                  initial={{ opacity: 0, y: 24, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.6, delay: Math.min(i * 0.06, 0.5), ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ y: -6 }}
                  title={p.name}
                >
                  <span className="logo-cell__num text-mono">{String(i + 1).padStart(2, '0')}</span>
                  <div className="logo-cell__logo">
                    {logo ? (
                      <img src={logo} alt={p.name} loading="lazy" />
                    ) : (
                      <span className="logo-cell__fallback">{p.name}</span>
                    )}
                  </div>
                  <div className="logo-cell__reveal">
                    <span className="logo-cell__name">{p.name}</span>
                    <span className="logo-cell__cat">{p.category}</span>
                  </div>
                  <div className="logo-cell__shine" />
                </motion.div>
              )
            })}
          </div>

          {/* Caption line below the wall */}
          <motion.p
            className="about-partners__caption"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.3 }}
          >
            <span className="about-partners__caption-dot" />
            And many more — every project gets premium hardware backed by manufacturer warranties.
          </motion.p>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="about-cta">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="about-cta__title">Ready to Transform Your Space?</h2>
            <p className="about-cta__subtitle">Let's discuss your home or office — every great interior begins with a conversation.</p>
            <div className="about-cta__actions">
              <Link to="/contact-us" className="btn btn-primary">
                Free Consultation <ArrowUpRight size={16} />
              </Link>
              <Link to="/project-category/projects-apartments" className="btn btn-outline">
                See Our Portfolio <ArrowRight size={16} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </motion.main>
  )
}
