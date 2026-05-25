import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, MapPin, Maximize2, Calendar, Layers, Plus } from 'lucide-react'
import { useData } from '../context/DataContext'
import SmartImage from '../components/ui/SmartImage'
import ProjectLightbox from '../components/ui/ProjectLightbox'
import './ProjectDetail.css'

const fade = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0 },
}

export default function ProjectDetail() {
  const { projects, loading } = useData()
  const { slug } = useParams()

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--cream)' }}>
        <p style={{ color: 'var(--ash)', fontSize: 14 }}>Loading Project Details…</p>
      </div>
    )
  }

  const project = projects.find((p) => String(p.id) === slug) || projects[0]
  if (!project) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--cream)' }}>
        <p style={{ color: 'var(--ash)', fontSize: 14 }}>Project not found.</p>
      </div>
    )
  }

  const idx = projects.findIndex((p) => p.id === project.id)
  const nextProject = projects[(idx + 1) % projects.length]

  const gallery = project.images?.length ? project.images : [project.image]
  const [lightbox, setLightbox] = useState(null) // start index or null

  return (
    <motion.main
      className="pd"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Helmet><title>{project.title} — ATTICARCH Project</title></Helmet>

      {/* ── EDITORIAL SPLIT HERO — no full-bleed image ── */}
      <section className="pd-hero">
        <div className="pd-hero__glow" />
        <div className="container pd-hero__inner">
          <motion.div
            className="pd-hero__top"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link to="/" className="pd-back">
              <ArrowLeft size={15} /> Back to Home
            </Link>
            <span className="pd-hero__index text-mono">
              Project {String(idx + 1).padStart(2, '0')}
              <span> / {String(projects.length).padStart(2, '0')}</span>
            </span>
          </motion.div>

          <div className="pd-hero__grid">
            {/* LEFT — editorial text column */}
            <motion.div
              className="pd-hero__text"
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="pd-hero__cat">{project.category}</span>
              <h1 className="pd-hero__title">{project.title}</h1>
              <p className="pd-hero__desc">{project.description}</p>

              <div className="pd-hero__meta">
                {[
                  { k: 'Location', v: project.location, icon: MapPin },
                  { k: 'Scope', v: project.size, icon: Maximize2 },
                  { k: 'Year', v: project.year, icon: Calendar },
                  { k: 'Gallery', v: `${gallery.length} Photos`, icon: Layers },
                ].map((s) => (
                  <div className="pd-hero__meta-cell" key={s.k}>
                    <s.icon size={15} />
                    <div>
                      <span className="pd-hero__meta-k">{s.k}</span>
                      <span className="pd-hero__meta-v">{s.v}</span>
                    </div>
                  </div>
                ))}
              </div>

              <Link to="/contact-us" className="btn btn-primary pd-hero__cta">
                Start a Similar Project <ArrowRight size={16} />
              </Link>
            </motion.div>

            {/* RIGHT — contained image + thumb strip */}
            <motion.div
              className="pd-hero__media"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            >
              <button className="pd-hero__cover" onClick={() => setLightbox(0)}>
                <SmartImage src={gallery[0]} alt={project.title} tone="dark" eager />
                <span className="pd-hero__cover-frame" />
                <span className="pd-hero__cover-badge">
                  <Plus size={13} /> View Gallery
                </span>
              </button>

              {gallery.length > 1 && (
                <div className="pd-hero__thumbs">
                  {gallery.slice(1, 5).map((img, i) => (
                    <button
                      key={i}
                      className="pd-hero__thumb"
                      onClick={() => setLightbox(i + 1)}
                    >
                      <SmartImage src={img} alt={`${project.title} — ${i + 2}`} tone="dark" />
                      {i === 3 && gallery.length > 5 && (
                        <span className="pd-hero__thumb-more">+{gallery.length - 5}</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── GALLERY ── */}
      <section className="section section-linen pd-gallery-section">
        <div className="container">
          <motion.div
            className="pd-gallery-head"
            variants={fade}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div>
              <span className="pd-label">Visual Tour</span>
              <h2 className="pd-gallery-head__title">The Full Gallery</h2>
            </div>
            <span className="pd-gallery-head__hint">Click any image to expand</span>
          </motion.div>

          <div className="pd-gallery">
            {gallery.map((img, i) => (
              <motion.button
                key={i}
                className={`pd-gallery__item ${i % 7 === 0 ? 'pd-gallery__item--wide' : ''} ${i % 5 === 2 ? 'pd-gallery__item--tall' : ''}`}
                onClick={() => setLightbox(i)}
                initial={{ opacity: 0, scale: 0.94 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.6, delay: (i % 4) * 0.06, ease: [0.16, 1, 0.3, 1] }}
              >
                <SmartImage src={img} alt={`${project.title} — view ${i + 1}`} />
                <span className="pd-gallery__num text-mono">{String(i + 1).padStart(2, '0')}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEXT PROJECT ── */}
      <Link to={`/project/${nextProject.id}`} className="pd-next">
        <SmartImage src={nextProject.image} alt={nextProject.title} tone="dark" className="pd-next__bg" />
        <div className="pd-next__grad" />
        <div className="container pd-next__content">
          <span className="pd-label">Next Project</span>
          <h2 className="pd-next__title">{nextProject.title}</h2>
          <span className="pd-next__cta">View Project <ArrowRight size={18} /></span>
        </div>
      </Link>

      {/* ── CTA ── */}
      <section className="section section-dark pd-cta">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="pd-cta__title">Want Something Like This?</h2>
            <p className="pd-cta__sub">Let’s craft a space that tells your story.</p>
            <Link to="/contact-us" className="btn btn-primary">Book a Consultation <ArrowRight size={16} /></Link>
          </motion.div>
        </div>
      </section>

      <AnimatePresence>
        {lightbox !== null && (
          <ProjectLightbox project={project} startIndex={lightbox} onClose={() => setLightbox(null)} />
        )}
      </AnimatePresence>
    </motion.main>
  )
}
