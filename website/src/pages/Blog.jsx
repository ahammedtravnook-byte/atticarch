import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { Link, useParams } from 'react-router-dom'
import { ArrowRight, Clock } from 'lucide-react'
import { blogPosts } from '../data/siteData'

function Reveal({ children, delay = 0 }) {
  return (
    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }} transition={{ duration: 0.7, delay, ease: [0.16,1,0.3,1] }}
      style={{ willChange: 'transform, opacity' }}>
      {children}
    </motion.div>
  )
}

export default function Blog() {
  const { slug } = useParams()

  if (slug) {
    const post = blogPosts.find(p => p.slug === slug) || blogPosts[0]
    return (
      <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <Helmet><title>{post.title} — ATTICARCH Blog</title></Helmet>
        <section style={{ background: 'var(--charcoal)', padding: '180px 0 40px' }}>
          <div className="container" style={{ maxWidth: 800 }}>
            <Link to="/blog" style={{ color: 'var(--mist)', fontSize: 14, marginBottom: 20, display: 'inline-block' }}>← Back to Blog</Link>
            <span className="text-accent" style={{ display: 'block', fontSize: 10, color: 'var(--gold)', marginBottom: 12 }}>{post.category}</span>
            <h1 className="text-display" style={{ fontSize: 'var(--text-5xl)', color: 'var(--warm-white)' }}>{post.title}</h1>
            <p style={{ color: 'var(--mist)', display: 'flex', alignItems: 'center', gap: 8, marginTop: 16 }}><Clock size={14} /> {post.date}</p>
          </div>
        </section>
        <section style={{ maxHeight: 450, overflow: 'hidden' }}>
          <img src={post.image} alt={post.title} style={{ width: '100%', height: 450, objectFit: 'cover' }} />
        </section>
        <section className="section">
          <div className="container" style={{ maxWidth: 800 }}>
            <p style={{ color: 'var(--smoke)', lineHeight: 1.9, fontSize: 'var(--text-lg)' }}>{post.excerpt}</p>
            <p style={{ color: 'var(--ash)', lineHeight: 1.9, marginTop: 24 }}>
              Interior design is an art that requires a deep understanding of space, light, and human psychology. 
              At ATTICARCH, we approach every project with fresh eyes and creative energy. Our team of experienced 
              designers works tirelessly to create spaces that not only look stunning but also enhance the quality 
              of life for the people who inhabit them.
            </p>
            <p style={{ color: 'var(--ash)', lineHeight: 1.9, marginTop: 24 }}>
              Whether you're redesigning your living room or planning a complete home renovation, the key is to 
              start with a clear vision and work with professionals who understand your needs. Our consultation 
              process is designed to uncover your unique preferences and translate them into tangible design solutions.
            </p>
            <div style={{ background: 'var(--linen)', borderRadius: 'var(--radius-lg)', padding: 32, marginTop: 40, borderLeft: '4px solid var(--gold)' }}>
              <p style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-xl)', fontStyle: 'italic', color: 'var(--smoke)' }}>
                "Good design is not about trends. It's about creating timeless spaces that tell your story."
              </p>
              <p style={{ color: 'var(--gold)', marginTop: 8, fontSize: 13, fontFamily: 'var(--font-accent)', letterSpacing: '0.1em' }}>— ATTICARCH Design Team</p>
            </div>
          </div>
        </section>
      </motion.main>
    )
  }

  return (
    <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <Helmet><title>Blog — ATTICARCH Interior Design Insights</title></Helmet>
      <section style={{ background: 'var(--charcoal)', padding: '200px 0 100px' }}>
        <div className="container">
          <Reveal>
            <span className="section-label" style={{ color: 'var(--gold-light)' }}>Our Blog</span>
            <h1 className="text-display" style={{ fontSize: 'var(--text-6xl)', color: 'var(--warm-white)' }}>
              Design <span className="text-gold">Insights</span>
            </h1>
          </Reveal>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 28 }}>
            {blogPosts.map((post, i) => (
              <Reveal key={post.id} delay={i * 0.1}>
                <Link to={`/blog/${post.slug}`} className="card" style={{ display: 'block' }}>
                  <div className="card-image" style={{ position: 'relative' }}>
                    <img src={post.image} alt={post.title} loading="lazy" />
                    <span style={{ position: 'absolute', top: 12, left: 12, background: 'var(--charcoal)', color: 'var(--gold)', padding: '5px 12px', borderRadius: 'var(--radius-full)', fontSize: 10, fontFamily: 'var(--font-accent)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{post.category}</span>
                  </div>
                  <div style={{ padding: 24 }}>
                    <span style={{ fontSize: 12, color: 'var(--mist)' }}>{post.date}</span>
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-xl)', margin: '8px 0' }}>{post.title}</h3>
                    <p style={{ fontSize: 13, color: 'var(--ash)', lineHeight: 1.6 }}>{post.excerpt}</p>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 16, fontFamily: 'var(--font-accent)', fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gold)' }}>
                      Read More <ArrowRight size={14} />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </motion.main>
  )
}
