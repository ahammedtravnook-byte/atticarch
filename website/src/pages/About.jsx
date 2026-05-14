import { useRef } from 'react'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight, Target, Eye } from 'lucide-react'
import { valueProps, pickImages } from '../data/siteData'
import './About.css'

const heroImg = pickImages(1, 0)[0]
const villaImg = pickImages(1, 25)[0]

gsap.registerPlugin(ScrollTrigger)

export default function About() {
  const heroRef = useRef(null)
  const heroBgRef = useRef(null)
  const heroTitleRef = useRef(null)
  const heroLineRef = useRef(null)
  const statsRef = useRef(null)
  const timelineSectionRef = useRef(null)
  const timelineTrackRef = useRef(null)
  const timelineProgressRef = useRef(null)
  const missionImageRef = useRef(null)

  const milestones = [
    { year: '2002', title: 'Founded', desc: 'ATTICARCH established as a multi-disciplinary consultancy firm in Bangalore.' },
    { year: '2008', title: 'Growth & Expansion', desc: 'Expanded our portfolio across residential and commercial interior projects.' },
    { year: '2014', title: 'Luxury Division', desc: 'Launched dedicated luxury interior design vertical for high-end villas and penthouses.' },
    { year: '2019', title: 'Studio Recognition', desc: 'Established as a trusted interior design studio across Bangalore.' },
    { year: '2024', title: 'Two Decades Strong', desc: 'Continuing to deliver turnkey interiors with a 10-Year Workmanship Warranty.' },
  ]

  useGSAP(() => {
    // Hero parallax
    gsap.to(heroBgRef.current, {
      y: '30%',
      ease: 'none',
      scrollTrigger: {
        trigger: heroRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      }
    })

    // Hero title word reveal
    const words = heroTitleRef.current?.querySelectorAll('.word-inner')
    if (words?.length) {
      gsap.from(words, {
        y: 80,
        opacity: 0,
        duration: 1,
        stagger: 0.06,
        ease: 'power4.out',
        delay: 0.3,
      })
    }

    // Hero line
    gsap.to(heroLineRef.current, {
      width: 80,
      duration: 1,
      ease: 'power2.out',
      delay: 0.8,
    })

    // Mission image clip-path reveal
    if (missionImageRef.current) {
      gsap.from(missionImageRef.current, {
        clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)',
        duration: 1.2,
        ease: 'power3.inOut',
        scrollTrigger: {
          trigger: missionImageRef.current,
          start: 'top 75%',
          once: true,
        }
      })
    }

    // Value prop underlines
    ScrollTrigger.create({
      trigger: statsRef.current,
      start: 'top 80%',
      once: true,
      onEnter: () => {
        gsap.to('.about-stats__underline', {
          scaleX: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power2.out',
          delay: 0.3,
        })
      }
    })

    // Horizontal timeline (desktop)
    const mm = gsap.matchMedia()
    mm.add('(min-width: 769px)', () => {
      const track = timelineTrackRef.current
      const section = timelineSectionRef.current
      if (!track || !section) return

      const totalScroll = track.scrollWidth - window.innerWidth + 200

      const tl = gsap.to(track, {
        x: -totalScroll,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          pin: true,
          scrub: 1,
          end: () => `+=${totalScroll}`,
          onUpdate: (self) => {
            if (timelineProgressRef.current) {
              timelineProgressRef.current.style.width = `${self.progress * 100}%`
            }
          }
        }
      })

      return () => tl.scrollTrigger?.kill()
    })
  }, { scope: heroRef })

  const splitTitle = (text) => {
    return text.split(' ').map((word, i) => (
      <span key={i} style={{ overflow: 'hidden', display: 'inline-block' }}>
        <span className="word-inner" style={{ display: 'inline-block' }}>
          {word}&nbsp;
        </span>
      </span>
    ))
  }

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      ref={heroRef}
    >
      <Helmet><title>About Us — ATTICARCH | Best Interior Design Firm in Bangalore</title></Helmet>

      {/* Hero */}
      <section className="about-hero">
        <div className="about-hero__bg" ref={heroBgRef}>
          <img src={heroImg} alt="" />
        </div>
        <div className="container about-hero__content">
          <span className="about-hero__label">About ATTICARCH</span>
          <h1 className="about-hero__title" ref={heroTitleRef}>
            {splitTitle('Crafting Exceptional')}
            <br />
            <span style={{ color: 'var(--gold)' }}>
              {splitTitle('Interiors Since 2002')}
            </span>
          </h1>
          <div className="about-hero__line" ref={heroLineRef} />
          <p className="about-hero__subtitle">
            A multi-disciplinary firm providing Architectural, Interior Designing and Project Management services across Bangalore.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="about-mission">
        <div className="container">
          <div className="about-mission__grid">
            <div>
              <motion.div
                className="about-mission__card"
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="about-mission__card-header">
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                  >
                    <Target size={26} color="var(--gold)" />
                  </motion.div>
                  <h3>Our Mission</h3>
                </div>
                <p>
                  To transform ordinary spaces into extraordinary living experiences through innovative design, premium materials,
                  and uncompromising quality. We believe every space tells a story, and we're here to craft yours.
                </p>
              </motion.div>

              <motion.div
                className="about-mission__card"
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="about-mission__card-header">
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: 'spring', stiffness: 200, delay: 0.35 }}
                  >
                    <Eye size={26} color="var(--gold)" />
                  </motion.div>
                  <h3>Our Vision</h3>
                </div>
                <p>
                  To be Bangalore's most trusted and creative interior design firm, setting benchmarks in luxury design
                  and client satisfaction while making premium interiors accessible to every homeowner.
                </p>
              </motion.div>
            </div>

            <motion.div
              className="about-mission__image"
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
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

      {/* Stats */}
      <section className="about-stats" ref={statsRef}>
        <div className="container">
          <div className="about-stats__grid">
            {valueProps.map((s, i) => (
              <motion.div
                className="about-stats__item"
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
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

      {/* Timeline */}
      <section className="about-timeline" ref={timelineSectionRef}>
        <div className="container">
          <motion.div
            className="about-timeline__header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="section-label" style={{ justifyContent: 'center' }}>Our Journey</span>
            <h2 className="section-title">Milestones That Define Us</h2>
          </motion.div>
        </div>

        {/* Desktop horizontal */}
        <div className="about-timeline__track-wrapper">
          <div className="container">
            <div className="about-timeline__progress">
              <div className="about-timeline__progress-bar" ref={timelineProgressRef} />
            </div>
          </div>
          <div className="about-timeline__track" ref={timelineTrackRef} style={{ paddingLeft: 'calc((100vw - 1200px) / 2 + 20px)' }}>
            {milestones.map((m, i) => (
              <div className="about-timeline__card" key={i}>
                <span className="about-timeline__year">{m.year}</span>
                <h3>{m.title}</h3>
                <p>{m.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile vertical */}
        <div className="container">
          <div className="about-timeline__vertical">
            {milestones.map((m, i) => (
              <motion.div
                className="about-timeline__vertical-item"
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              >
                <span className="about-timeline__vertical-year">{m.year}</span>
                <h3>{m.title}</h3>
                <p>{m.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="about-cta">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="about-cta__title">Ready to Transform Your Space?</h2>
            <p className="about-cta__subtitle">Let's discuss your dream project</p>
            <Link to="/contact-us" className="btn btn-primary">
              Book Consultation <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>
    </motion.main>
  )
}
