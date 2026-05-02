import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { useParams, Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { projects } from '../data/siteData'

function Reveal({ children, delay = 0 }) {
  return (
    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }} transition={{ duration: 0.7, delay, ease: [0.16,1,0.3,1] }}
      style={{ willChange: 'transform, opacity' }}>
      {children}
    </motion.div>
  )
}

const categoryMap = {
  'projects-residential': { title: 'Residential Projects', filter: ['apartments', 'villas'] },
  'projects-apartments': { title: 'Apartment Projects', filter: ['apartments'] },
  'projects-villas': { title: 'Villa Projects', filter: ['villas'] },
  'projects-commercial': { title: 'Commercial Projects', filter: ['commercial'] },
  'projects-renovation': { title: 'Renovation Projects', filter: ['renovation'] },
}

export default function ProjectCategory() {
  const { category } = useParams()
  const cat = categoryMap[category] || { title: 'All Projects', filter: [] }
  const filtered = cat.filter.length ? projects.filter(p => cat.filter.includes(p.category)) : projects

  return (
    <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <Helmet><title>{cat.title} — ATTICARCH Portfolio</title></Helmet>

      <section style={{ background: 'var(--charcoal)', padding: '180px 0 100px' }}>
        <div className="container">
          <Reveal>
            <span className="section-label" style={{ color: 'var(--gold-light)' }}>Our Portfolio</span>
            <h1 className="text-display" style={{ fontSize: 'var(--text-6xl)', color: 'var(--warm-white)' }}>
              {cat.title.split(' ')[0]} <span className="text-gold">{cat.title.split(' ').slice(1).join(' ')}</span>
            </h1>
          </Reveal>

          <Reveal delay={0.1}>
            <div style={{ display: 'flex', gap: 8, marginTop: 32, flexWrap: 'wrap' }}>
              {Object.entries(categoryMap).map(([key, val]) => (
                <Link key={key} to={`/project-category/${key}`}
                  className="btn" style={{
                    padding: '10px 20px', fontSize: 12,
                    background: category === key ? 'var(--gold)' : 'transparent',
                    color: category === key ? 'var(--charcoal)' : 'var(--mist)',
                    border: `1px solid ${category === key ? 'var(--gold)' : 'rgba(255,255,255,0.15)'}`,
                  }}>
                  {val.title.replace(' Projects', '')}
                </Link>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 28 }}>
            {filtered.map((project, i) => (
              <Reveal key={project.id} delay={i * 0.08}>
                <Link to={`/project/${project.id}`} className="project-card card" data-cursor
                  style={{ display: 'block', borderRadius: 'var(--radius-lg)', overflow: 'hidden', background: 'var(--warm-white)', transition: 'all 0.5s var(--ease-out)' }}>
                  <div style={{ aspectRatio: '4/3', overflow: 'hidden', position: 'relative' }}>
                    <img src={project.image} alt={project.title} loading="lazy"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.8s var(--ease-out)' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 50%, rgba(26,26,26,0.6) 100%)' }} />
                    <div style={{ position: 'absolute', bottom: 16, right: 16, color: 'var(--gold)' }}><ArrowUpRight size={24} /></div>
                  </div>
                  <div style={{ padding: '20px 24px' }}>
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-xl)', fontWeight: 600 }}>{project.title}</h3>
                    <p style={{ fontSize: 13, color: 'var(--ash)', marginTop: 6 }}>{project.location} • {project.size} • {project.year}</p>
                    <p style={{ fontSize: 13, color: 'var(--ash)', marginTop: 8, lineHeight: 1.6 }}>{project.description}</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <p style={{ color: 'var(--ash)', fontSize: 'var(--text-lg)' }}>No projects in this category yet. Check back soon!</p>
            </div>
          )}
        </div>
      </section>
    </motion.main>
  )
}
