import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { useParams, Link } from 'react-router-dom'
import { ArrowUpRight, ArrowRight, MapPin, Maximize2, Calendar, Layers } from 'lucide-react'
import { projects } from '../data/siteData'
import SmartImage from '../components/ui/SmartImage'
import './ProjectCategory.css'

function Reveal({ children, delay = 0, className = '' }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      style={{ willChange: 'transform, opacity' }}
    >
      {children}
    </motion.div>
  )
}

const categoryMap = {
  'projects-residential': { title: 'Residential Projects', short: 'Residential', filter: ['apartments', 'villas'] },
  'projects-apartments':  { title: 'Apartment Projects',   short: 'Apartments',   filter: ['apartments'] },
  'projects-villas':      { title: 'Villa Projects',       short: 'Villas',       filter: ['villas'] },
  'projects-commercial':  { title: 'Commercial Projects',  short: 'Commercial',   filter: ['commercial'] },
  'projects-renovation':  { title: 'Renovation Projects',  short: 'Renovation',   filter: ['renovation'] },
}

/* Tilt-on-hover card that follows the cursor */
function ProjectCard({ project, index }) {
  const ref = useRef(null)
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 })

  const handleMove = (e) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const x = ((e.clientX - r.left) / r.width) - 0.5
    const y = ((e.clientY - r.top) / r.height) - 0.5
    setTilt({ rx: -y * 6, ry: x * 6 })
  }
  const reset = () => setTilt({ rx: 0, ry: 0 })

  const isFeatured = index === 0

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.6, delay: Math.min(index * 0.05, 0.4), ease: [0.16, 1, 0.3, 1] }}
      className={`pc-card ${isFeatured ? 'pc-card--featured' : ''}`}
    >
      <Link
        ref={ref}
        to={`/project/${project.id}`}
        className="pc-card__link"
        onMouseMove={handleMove}
        onMouseLeave={reset}
        style={{
          transform: `perspective(1200px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
          transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <div className="pc-card__media">
          <SmartImage src={project.image} alt={project.title} />
          <div className="pc-card__media-grad" />

          {/* Floating chips */}
          <span className="pc-card__cat">{project.category}</span>
          <span className="pc-card__year text-mono">{project.year}</span>

          {/* Photo count badge */}
          <span className="pc-card__photos">
            <Layers size={11} /> {project.images.length} photos
          </span>

          {/* Hover-reveal overlay */}
          <div className="pc-card__overlay">
            <span className="pc-card__cta">
              View Project <ArrowUpRight size={18} />
            </span>
          </div>
        </div>

        <div className="pc-card__body">
          <span className="pc-card__index text-mono">{String(index + 1).padStart(2, '0')}</span>
          <div className="pc-card__head">
            <h3 className="pc-card__title">{project.title}</h3>
            <div className="pc-card__meta">
              <span className="pc-card__meta-item"><MapPin size={12} /> {project.location}</span>
              <span className="pc-card__meta-divider" />
              <span className="pc-card__meta-item"><Maximize2 size={12} /> {project.size}</span>
            </div>
          </div>
          <p className="pc-card__desc">{project.description}</p>
          <span className="pc-card__view">
            View Details
            <span className="pc-card__view-arrow"><ArrowRight size={14} /></span>
          </span>
        </div>

        <div className="pc-card__accent" />
      </Link>
    </motion.div>
  )
}

export default function ProjectCategory() {
  const { category } = useParams()
  const cat = categoryMap[category] || { title: 'All Projects', short: 'All', filter: [] }
  const filtered = cat.filter.length ? projects.filter((p) => cat.filter.includes(p.category)) : projects

  /* Stats */
  const uniqueLocations = new Set(filtered.map((p) => p.location.split(',')[0].trim())).size || filtered.length
  const totalPhotos = filtered.reduce((s, p) => s + (p.images?.length || 0), 0)

  const heroRef = useRef(null)

  /* Preview thumbnails for hero (3 from this category) */
  const previewProjects = filtered.slice(0, 3)
  const titleAccent = cat.title.split(' ').slice(-1)[0]
  const titleMain = cat.title.split(' ').slice(0, -1).join(' ')

  return (
    <motion.main
      className="pc-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Helmet>
        <title>{cat.title} — ATTICARCH Portfolio | Interior Design Bangalore</title>
      </Helmet>

      {/* ── HERO ── */}
      <section className="pc-hero" ref={heroRef}>
        <div className="pc-hero__decor" aria-hidden="true">
          <div className="pc-hero__orb pc-hero__orb--1" />
          <div className="pc-hero__orb pc-hero__orb--2" />
          <div className="pc-hero__grid-lines" />
        </div>

        <div className="container">
          <Reveal>
            <nav className="pc-crumb">
              <Link to="/">Home</Link>
              <span>/</span>
              <Link to="/">Portfolio</Link>
              <span>/</span>
              <span className="pc-crumb__current">{cat.short}</span>
            </nav>
          </Reveal>

          <div className="pc-hero__grid">
            <div className="pc-hero__left">
              <Reveal delay={0.05}>
                <div className="pc-hero__eyebrow">
                  <span className="pc-hero__eyebrow-dot" />
                  <span>Our Portfolio</span>
                </div>
              </Reveal>

              <Reveal delay={0.15}>
                <h1 className="pc-hero__title">
                  {titleMain && <span className="pc-hero__title-line">{titleMain}</span>}
                  <span className="pc-hero__title-accent">
                    <em>{titleAccent}</em>
                  </span>
                </h1>
              </Reveal>

              <Reveal delay={0.25}>
                <p className="pc-hero__sub">
                  Real projects, real homes, real stories. Browse our completed work — each one designed,
                  detailed and delivered by the ATTICARCH studio.
                </p>
              </Reveal>

              <Reveal delay={0.35}>
                <div className="pc-hero__cta-row">
                  <Link to="/contact-us" className="btn btn-primary pc-hero__cta">
                    Free Consultation <ArrowUpRight size={16} />
                  </Link>
                  <a href="#grid" className="pc-hero__scroll">
                    <span>Browse {filtered.length} {filtered.length === 1 ? 'project' : 'projects'}</span>
                    <ArrowRight size={14} />
                  </a>
                </div>
              </Reveal>
            </div>

            <Reveal delay={0.3} className="pc-hero__right">
              <div className="pc-hero__stack">
                {previewProjects.map((p, i) => (
                  <motion.div
                    key={p.id}
                    className={`pc-hero__preview pc-hero__preview--${i + 1}`}
                    initial={{ opacity: 0, scale: 0.85, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.9, delay: 0.5 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                    whileHover={{ y: -8, transition: { duration: 0.4 } }}
                  >
                    <SmartImage src={p.image} alt={p.title} />
                    <div className="pc-hero__preview-label">
                      <span className="pc-hero__preview-cat">{p.category}</span>
                      <span className="pc-hero__preview-title">{p.title}</span>
                    </div>
                  </motion.div>
                ))}
                <div className="pc-hero__stack-badge">
                  <span className="pc-hero__stack-num text-mono">{String(filtered.length).padStart(2, '0')}</span>
                  <span className="pc-hero__stack-label">Projects</span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        <div className="pc-hero__scroll-cue" aria-hidden="true">
          <span className="pc-hero__scroll-line" />
          <span className="pc-hero__scroll-text">Scroll to explore</span>
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <section className="pc-stats">
        <div className="container">
          <div className="pc-stats__grid">
            {[
              { num: String(filtered.length).padStart(2, '0'), label: 'Showcased Projects' },
              { num: String(uniqueLocations).padStart(2, '0'), label: 'Bangalore Locations' },
              { num: '20+', label: 'Years of Craft' },
              { num: String(totalPhotos), label: 'Project Photos' },
            ].map((s, i) => (
              <Reveal key={s.label} delay={i * 0.08} className="pc-stat">
                <span className="pc-stat__num">{s.num}</span>
                <span className="pc-stat__label">{s.label}</span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── INLINE FILTER BAR (in flow, no sticky overlay) ── */}
      <section className="pc-filter-inline">
        <div className="container">
          <div className="pc-filter">
            <span className="pc-filter__label">Filter by:</span>
            <div className="pc-filter__pills">
              <Link
                to="/project-category/projects-residential"
                className={`pc-pill ${!category || category === 'projects-residential' ? 'is-active' : ''}`}
              >
                <span>All</span>
                <span className="pc-pill__count">{projects.length}</span>
              </Link>
              {Object.entries(categoryMap).filter(([k]) => k !== 'projects-residential').map(([key, val]) => {
                const count = projects.filter((p) => val.filter.includes(p.category)).length
                return (
                  <Link
                    key={key}
                    to={`/project-category/${key}`}
                    className={`pc-pill ${category === key ? 'is-active' : ''}`}
                  >
                    <span>{val.short}</span>
                    <span className="pc-pill__count">{count}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── PROJECTS GRID ── */}
      <section className="pc-grid-section" id="grid">
        <div className="container">
          {filtered.length > 0 && (
            <Reveal>
              <div className="pc-grid-head">
                <div>
                  <span className="pc-eyebrow">Browse the Collection</span>
                  <h2 className="pc-grid-head__title">
                    {filtered.length} {cat.short.toLowerCase()} {filtered.length === 1 ? 'project' : 'projects'}
                  </h2>
                </div>
                <div className="pc-grid-head__sort">
                  <Calendar size={14} />
                  <span>Sorted by latest</span>
                </div>
              </div>
            </Reveal>
          )}

          {filtered.length > 0 ? (
            <div className="pc-grid">
              <AnimatePresence mode="popLayout">
                {filtered.map((project, i) => (
                  <ProjectCard key={project.id} project={project} index={i} />
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="pc-empty">
              <div className="pc-empty__icon">
                <Layers size={36} />
              </div>
              <h3 className="pc-empty__title">No projects in this category yet</h3>
              <p className="pc-empty__desc">
                We're constantly adding new work to our portfolio. Check back soon — or get in touch
                to discuss your own home, office or space.
              </p>
              <div className="pc-empty__actions">
                <Link to="/project-category/projects-residential" className="btn btn-outline">
                  See All Projects
                </Link>
                <Link to="/contact-us" className="btn btn-primary">
                  Free Consultation <ArrowUpRight size={16} />
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section className="pc-cta">
        <div className="pc-cta__bg-decor" aria-hidden="true">
          <div className="pc-cta__orb" />
        </div>
        <div className="container">
          <Reveal>
            <div className="pc-cta__inner">
              <div className="pc-cta__text">
                <span className="pc-eyebrow pc-eyebrow--gold">Your Space, Next</span>
                <h2 className="pc-cta__title">
                  Don't see your style?<br />
                  <em>Let's design something just for you.</em>
                </h2>
                <p className="pc-cta__sub">
                  Every project starts with a conversation. Tell us about your space — we'll show you what's possible.
                </p>
              </div>
              <div className="pc-cta__actions">
                <Link to="/contact-us" className="btn btn-primary pc-cta__btn">
                  Free Consultation <ArrowUpRight size={18} />
                </Link>
                <a href="tel:09845013138" className="pc-cta__phone">
                  <span className="pc-cta__phone-label">Or call us at</span>
                  <span className="pc-cta__phone-num">98450 13138</span>
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </motion.main>
  )
}
