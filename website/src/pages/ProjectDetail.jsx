import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, MapPin, Maximize2, Calendar } from 'lucide-react'
import { projects } from '../data/siteData'

export default function ProjectDetail() {
  const { slug } = useParams()
  const project = projects.find(p => String(p.id) === slug) || projects[0]

  return (
    <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <Helmet><title>{project.title} — ATTICARCH Project</title></Helmet>

      <section style={{ background: 'var(--charcoal)', padding: '140px 0 0' }}>
        <div className="container" style={{ paddingBottom: 40 }}>
          <Link to="/project-category/projects-residential" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--mist)', fontSize: 14, marginBottom: 24 }}>
            <ArrowLeft size={16} /> Back to Projects
          </Link>
          <h1 className="text-display" style={{ fontSize: 'var(--text-5xl)', color: 'var(--warm-white)' }}>{project.title}</h1>
          <div style={{ display: 'flex', gap: 32, marginTop: 20, flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--mist)', fontSize: 14 }}><MapPin size={14} color="var(--gold)" />{project.location}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--mist)', fontSize: 14 }}><Maximize2 size={14} color="var(--gold)" />{project.size}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--mist)', fontSize: 14 }}><Calendar size={14} color="var(--gold)" />{project.year}</span>
          </div>
        </div>
        <div style={{ maxHeight: 500, overflow: 'hidden' }}>
          <img src={project.image} alt={project.title} style={{ width: '100%', height: 500, objectFit: 'cover' }} />
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 800 }}>
          <h2 className="text-heading" style={{ fontSize: 'var(--text-3xl)', marginBottom: 16 }}>About This Project</h2>
          <p style={{ color: 'var(--ash)', lineHeight: 1.8, fontSize: 'var(--text-base)' }}>{project.description}</p>
          <p style={{ color: 'var(--ash)', lineHeight: 1.8, fontSize: 'var(--text-base)', marginTop: 16 }}>
            This project showcases our commitment to excellence in interior design. Every element was carefully selected 
            to create a harmonious living environment that reflects the client's personality and lifestyle preferences. 
            From the premium materials to the bespoke furniture pieces, each detail contributes to the overall 
            luxury experience that ATTICARCH is known for.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 40 }}>
            {projects.filter(p => p.id !== project.id).slice(0, 4).map(p => (
              <div key={p.id} style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                <img src={p.image} alt={p.title} style={{ width: '100%', height: 250, objectFit: 'cover' }} loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-dark" style={{ textAlign: 'center' }}>
        <div className="container">
          <h2 className="text-display" style={{ fontSize: 'var(--text-4xl)', color: 'var(--warm-white)' }}>
            Want Something Similar?
          </h2>
          <Link to="/contact-us" className="btn btn-primary" style={{ marginTop: 24 }}>Book Consultation</Link>
        </div>
      </section>
    </motion.main>
  )
}
