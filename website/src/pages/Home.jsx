import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { ArrowUpRight, ArrowRight, Star, Play, Calculator, ChevronRight } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { projects, upcomingProjects, services, rooms, testimonials, stats, processSteps, blogPosts } from '../data/siteData'
import './Home.css'

gsap.registerPlugin(ScrollTrigger)

/* ── Animated Counter ── */
function Counter({ end, suffix = '', duration = 2 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  useEffect(() => {
    if (!inView || !ref.current) return
    const num = parseFloat(end)
    gsap.fromTo(ref.current, { innerText: 0 }, {
      innerText: num, duration, snap: { innerText: 1 }, ease: 'power2.out',
      onUpdate() { ref.current.textContent = Math.floor(ref.current.innerText || 0) + suffix }
    })
  }, [inView, end, suffix, duration])
  return <span ref={ref}>0{suffix}</span>
}

/* ── Section Reveal Wrapper ── */
function Reveal({ children, className = '', delay = 0 }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      style={{ willChange: 'transform, opacity' }}
    >
      {children}
    </motion.div>
  )
}

export default function Home() {
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 300])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.15])
  const heroRadius = useTransform(scrollYProgress, [0, 0.3], ['0px', '80px'])
  const heroWidth = useTransform(scrollYProgress, [0, 0.3], ['100%', '90%'])

  useEffect(() => {
    // Refresh ScrollTrigger when images load to ensure correct positions
    const timer = setTimeout(() => {
      ScrollTrigger.refresh()
    }, 1000)

    return () => {
      clearTimeout(timer)
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [])


  return (
    <motion.main
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Helmet>
        <title>ATTICARCH — Best Interior Designers in Bangalore | Luxury Interior Design</title>
        <meta name="description" content="ATTICARCH: Bangalore's premier interior design firm since 2002. Luxury residential, commercial & villa interiors. 500+ projects delivered. Get your free consultation today." />
      </Helmet>

      {/* ═══ ADVANCED HERO ═══ */}
      <section className="hero" ref={heroRef} style={{ display: 'flex', justifyContent: 'center', background: 'var(--charcoal)' }}>
        <motion.div 
          className="hero__bg" 
          style={{ 
            y: heroY, 
            width: heroWidth, 
            borderRadius: heroRadius, 
            overflow: 'hidden', 
            scale: heroScale,
            transformOrigin: 'top center'
          }}
        >
          <div className="hero__bg-image" />
          <div className="hero__overlay" />
        </motion.div>
        <motion.div className="hero__content container" style={{ opacity: heroOpacity, position: 'relative' }}>
          
          {/* Floating Glow Orbs - Optimized blur for performance */}
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            style={{ position: 'absolute', top: '10%', right: '5%', width: 250, height: 250, background: 'var(--gold-glow)', borderRadius: '50%', filter: 'blur(60px)', opacity: 0.3, pointerEvents: 'none', zIndex: -1 }}
          />
          <motion.div
            animate={{ y: [0, 20, 0], x: [0, -15, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            style={{ position: 'absolute', bottom: '20%', left: '-5%', width: 350, height: 350, background: 'rgba(255, 255, 255, 0.03)', borderRadius: '50%', filter: 'blur(80px)', opacity: 0.2, pointerEvents: 'none', zIndex: -1 }}
          />


          <motion.div
            className="hero__text"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <span className="section-label" style={{ color: 'var(--gold-light)', margin: 0 }}>Since 2002 • Bangalore</span>
              <motion.div 
                initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                style={{ padding: '6px 12px', background: 'rgba(201, 169, 110, 0.1)', border: '1px solid rgba(201, 169, 110, 0.2)', borderRadius: 'var(--radius-full)', fontSize: 11, color: 'var(--gold)', letterSpacing: '0.1em', textTransform: 'uppercase' }}
              >
                Award Winning
              </motion.div>
            </div>
            <h1 className="hero__title text-display" style={{ overflow: 'hidden' }}>
              <motion.div initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}>Transforming</motion.div>
              <motion.div initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}>
                <span className="text-gradient">Spaces</span>, Transforming
              </motion.div>
              <motion.div initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}>
                <span className="text-gradient">Lives</span>
              </motion.div>
            </h1>
            <motion.p 
              className="hero__subtitle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.8 }}
            >
              Bangalore's premier interior design firm crafting luxurious living spaces 
              for discerning homeowners for over two decades.
            </motion.p>
            <div className="hero__actions">
              <Link to="/contact-us" className="btn btn-primary">
                Book Free Consultation <ArrowUpRight size={18} />
              </Link>
              <Link to="/project-category/projects-residential" className="btn btn-outline" style={{ borderColor: 'var(--gold-light)', color: 'var(--gold-light)' }}>
                View Projects
              </Link>
            </div>
          </motion.div>
          <motion.div
            className="hero__stats"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {stats.map((stat, i) => (
              <div key={i} className="hero__stat">
                <span className="hero__stat-number text-mono">
                  <Counter end={stat.number.replace(/\D/g, '')} suffix={stat.number.replace(/\d/g, '')} />
                </span>
                <span className="hero__stat-label">{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
        <div className="hero__scroll-indicator">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{ width: 1, height: 40, background: 'var(--gold)', opacity: 0.5 }}
          />
        </div>
      </section>

      {/* ═══ ROOM EXPLORER ═══ */}
      <section className="section rooms-section">
        <div className="container">
          <Reveal>
            <span className="section-label">Explore by Room</span>
            <h2 className="section-title">Design Every Corner<br />of Your Dream Home</h2>
          </Reveal>
          <div className="rooms-grid">
            {rooms.map((room, i) => (
              <Reveal key={room.slug} delay={i * 0.08}>
                <Link to={`/${room.slug}`} className="room-card" data-cursor>
                  <div className="room-card__image">
                    <img src={room.image} alt={room.title} loading="lazy" />
                    <div className="room-card__overlay">
                      <ArrowUpRight size={24} />
                    </div>
                  </div>
                  <div className="room-card__info">
                    <h3>{room.title}</h3>
                    <p>{room.subtitle}</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ ABOUT TEASER ═══ */}
      <section className="section section-dark about-teaser">
        <div className="container">
          <div className="about-teaser__grid">
            <Reveal className="about-teaser__text">
              <span className="section-label">About ATTICARCH</span>
              <h2 className="section-title" style={{ color: 'var(--warm-white)' }}>
                Crafting Luxury Interiors <br />Since <span className="text-gold">2002</span>
              </h2>
              <p className="about-teaser__desc">
                ATTICARCH is a multi-disciplinary consultancy firm providing Architectural, Interior Designing 
                and Project Management services to domestic and corporate clients across Bangalore. With over 
                22 years of expertise, we transform ordinary spaces into extraordinary living experiences.
              </p>
              <div className="about-teaser__highlights">
                <div className="highlight-item">
                  <span className="highlight-number text-mono"><Counter end="500" suffix="+" /></span>
                  <span>Projects Completed</span>
                </div>
                <div className="highlight-item">
                  <span className="highlight-number text-mono"><Counter end="22" suffix="+" /></span>
                  <span>Years of Excellence</span>
                </div>
              </div>
              <Link to="/about-us" className="btn btn-outline" style={{ marginTop: 32 }}>
                Know More About Us <ArrowRight size={16} />
              </Link>
            </Reveal>
            <Reveal className="about-teaser__image" delay={0.2}>
              <div className="about-teaser__img-wrap">
                <img src={rooms[0].image} alt="ATTICARCH Interior" loading="lazy" />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══ SERVICES ═══ */}
      <section className="section services-section">
        <div className="container">
          <Reveal>
            <span className="section-label">What We Do</span>
            <h2 className="section-title">Our Core Services</h2>
          </Reveal>
          <div className="services-grid">
            {services.map((service, i) => (
              <Reveal key={service.id} delay={i * 0.15}>
                <div className="service-card" data-cursor>
                  <div className="service-card__image">
                    <img src={service.image} alt={service.title} loading="lazy" />
                  </div>
                  <div className="service-card__content">
                    <span className="text-accent" style={{ fontSize: 10, color: 'var(--gold)' }}>{service.subtitle}</span>
                    <h3 className="text-heading" style={{ fontSize: 'var(--text-2xl)', marginTop: 8 }}>{service.title}</h3>
                    <p style={{ color: 'var(--ash)', fontSize: 14, lineHeight: 1.7, marginTop: 12 }}>{service.description}</p>
                    <Link to="/services" className="service-card__link">
                      Learn More <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PROCESS ═══ */}
      <section className="section section-linen process-section">
        <div className="container">
          <Reveal>
            <div style={{ textAlign: 'center' }}>
              <span className="section-label" style={{ justifyContent: 'center' }}>How We Work</span>
              <h2 className="section-title">Our Proven 6-Step Process</h2>
              <p className="section-subtitle" style={{ margin: '0 auto' }}>From first meeting to final handover, every step is designed for excellence</p>
            </div>
          </Reveal>
          <div className="process-grid">
            {processSteps.map((step, i) => (
              <Reveal key={step.step} delay={i * 0.1}>
                <div className="process-card">
                  <span className="process-card__number text-mono">{String(step.step).padStart(2, '0')}</span>
                  <h3 className="text-heading" style={{ fontSize: 'var(--text-xl)', margin: '12px 0 8px' }}>{step.title}</h3>
                  <p style={{ fontSize: 13, color: 'var(--ash)', lineHeight: 1.7 }}>{step.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <div style={{ textAlign: 'center', marginTop: 48 }}>
              <Link to="/how-we-work" className="btn btn-dark">See Full Process <ArrowRight size={16} /></Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ ESTIMATE CALCULATOR MINI ═══ */}
      <section className="section section-dark estimate-mini">
        <div className="container">
          <div className="estimate-mini__grid">
            <Reveal>
              <span className="section-label" style={{ color: 'var(--gold-light)' }}>Estimate Calculator</span>
              <h2 className="section-title" style={{ color: 'var(--warm-white)' }}>
                Get an Instant <span className="text-gold">Cost Estimate</span>
              </h2>
              <p style={{ color: 'var(--mist)', lineHeight: 1.7, marginBottom: 32 }}>
                Use our smart calculator to get a rough estimate for your interior design project. 
                Select your property type, size, and design style to get started.
              </p>
              <Link to="/estimate" className="btn btn-primary">
                <Calculator size={18} /> Open Full Calculator
              </Link>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="estimate-mini__card">
                <div className="estimate-mini__row">
                  <span>Property Type</span>
                  <strong>2/3 BHK Apartment</strong>
                </div>
                <div className="estimate-mini__row">
                  <span>Interior Style</span>
                  <strong>Premium</strong>
                </div>
                <div className="estimate-mini__row">
                  <span>Carpet Area</span>
                  <strong>1,200 - 1,800 sq.ft</strong>
                </div>
                <div className="estimate-mini__divider" />
                <div className="estimate-mini__total">
                  <span>Estimated Range</span>
                  <strong className="text-gold text-mono" style={{ fontSize: 'var(--text-3xl)' }}>₹12L — ₹22L</strong>
                </div>
                <Link to="/estimate" className="btn btn-outline" style={{ width: '100%', justifyContent: 'center', marginTop: 16 }}>
                  Customize Your Estimate <ArrowRight size={16} />
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══ PROJECTS GALLERY ═══ */}
      <section className="section projects-section">
        <div className="container">
          <Reveal>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 20 }}>
              <div>
                <span className="section-label">Our Portfolio</span>
                <h2 className="section-title">Recently Completed Projects</h2>
              </div>
              <Link to="/project-category/projects-residential" className="btn btn-outline" style={{ marginBottom: 'var(--space-lg)' }}>
                View All Projects <ArrowRight size={16} />
              </Link>
            </div>
          </Reveal>
          <div className="projects-grid">
            {projects.slice(0, 6).map((project, i) => (
              <Reveal key={project.id} delay={i * 0.1}>
                <Link to={`/project/${project.id}`} className="project-card" data-cursor>
                  <div className="project-card__image">
                    <img src={project.image} alt={project.title} loading="lazy" />
                    <div className="project-card__overlay">
                      <span className="project-card__category text-accent">{project.category}</span>
                      <ArrowUpRight size={24} />
                    </div>
                  </div>
                  <div className="project-card__info">
                    <h3>{project.title}</h3>
                    <p>{project.location} • {project.size}</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ UPCOMING PROJECTS ═══ */}
      <section className="section section-linen upcoming-section">
        <div className="container">
          <Reveal>
            <span className="section-label">Coming Soon</span>
            <h2 className="section-title">Upcoming Projects</h2>
          </Reveal>
          <div className="upcoming-grid">
            {upcomingProjects.map((project, i) => (
              <Reveal key={project.id} delay={i * 0.15}>
                <div className="upcoming-card">
                  <div className="upcoming-card__image">
                    <img src={project.image} alt={project.title} loading="lazy" />
                    <span className="upcoming-card__badge text-accent">{project.status}</span>
                  </div>
                  <div className="upcoming-card__content">
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-xl)' }}>{project.title}</h3>
                    <p style={{ color: 'var(--ash)', fontSize: 13 }}>{project.location} • {project.size}</p>
                    <div className="upcoming-card__progress">
                      <div className="upcoming-card__progress-bar">
                        <motion.div
                          className="upcoming-card__progress-fill"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${project.progress}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        />
                      </div>
                      <span className="text-mono" style={{ fontSize: 12, color: 'var(--gold)' }}>{project.progress}%</span>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TESTIMONIALS ═══ */}
      <section className="section section-dark testimonials-section">
        <div className="container">
          <Reveal>
            <div style={{ textAlign: 'center' }}>
              <span className="section-label" style={{ justifyContent: 'center', color: 'var(--gold-light)' }}>Client Testimonials</span>
              <h2 className="section-title" style={{ color: 'var(--warm-white)' }}>What Our Clients Say</h2>
            </div>
          </Reveal>
          <div className="testimonials-grid">
            {testimonials.map((t, i) => (
              <Reveal key={t.id} delay={i * 0.1}>
                <div className="testimonial-card">
                  <div className="testimonial-card__stars">
                    {Array.from({ length: t.rating }).map((_, j) => <Star key={j} size={14} fill="var(--gold)" color="var(--gold)" />)}
                  </div>
                  <p className="testimonial-card__text">"{t.text}"</p>
                  <div className="testimonial-card__author">
                    <div className="testimonial-card__avatar">{t.name.charAt(0)}</div>
                    <div>
                      <strong>{t.name}</strong>
                      <span>{t.project}</span>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ BLOG PREVIEW ═══ */}
      <section className="section blog-section">
        <div className="container">
          <Reveal>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 20 }}>
              <div>
                <span className="section-label">From Our Blog</span>
                <h2 className="section-title">Latest Design Insights</h2>
              </div>
              <Link to="/blog" className="btn btn-outline" style={{ marginBottom: 'var(--space-lg)' }}>
                Read All Posts <ArrowRight size={16} />
              </Link>
            </div>
          </Reveal>
          <div className="blog-grid">
            {blogPosts.map((post, i) => (
              <Reveal key={post.id} delay={i * 0.15}>
                <Link to={`/blog/${post.slug}`} className="blog-card card" data-cursor>
                  <div className="card-image">
                    <img src={post.image} alt={post.title} loading="lazy" />
                    <span className="blog-card__tag text-accent">{post.category}</span>
                  </div>
                  <div className="blog-card__content">
                    <span style={{ fontSize: 12, color: 'var(--mist)' }}>{post.date}</span>
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-xl)', margin: '8px 0' }}>{post.title}</h3>
                    <p style={{ fontSize: 13, color: 'var(--ash)', lineHeight: 1.6 }}>{post.excerpt}</p>
                    <span className="blog-card__readmore">Read More <ChevronRight size={14} /></span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ MARQUEE BAND ═══ */}
      <div className="marquee-band">
        <div className="marquee-track">
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i} className="marquee-item text-display">
              Interior Design <span className="text-gold">✦</span> Architecture <span className="text-gold">✦</span> Project Management <span className="text-gold">✦</span>
            </span>
          ))}
        </div>
      </div>
    </motion.main>
  )
}
