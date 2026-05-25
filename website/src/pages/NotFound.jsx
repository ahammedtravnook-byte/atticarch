import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import {
  Home as HomeIcon, Briefcase, Users, BookOpen, Phone, Sparkles,
  ArrowRight, Search, MapPin, MessageCircle, Mail
} from 'lucide-react'
import { projects } from '../data/siteData'
import './NotFound.css'

const QUICK_LINKS = [
  { to: '/', icon: HomeIcon, title: 'Home', desc: 'Back to where it all begins' },
  { to: '/project-category/projects-apartments', icon: Briefcase, title: 'Our Projects', desc: 'Explore our portfolio' },
  { to: '/services', icon: Sparkles, title: 'Services', desc: 'What we design & build' },
  { to: '/about-us', icon: Users, title: 'About Us', desc: 'The team since 2002' },
  { to: '/blog', icon: BookOpen, title: 'Blog', desc: 'Design insights & ideas' },
  { to: '/contact-us', icon: Phone, title: 'Contact', desc: 'Talk to a designer' },
]

const FEATURED = projects.slice(0, 3)

export default function NotFound() {
  return (
    <motion.main className="nf" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <Helmet>
        <title>Page Not Found — ATTICARCH</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      {/* ─── Hero band ─── */}
      <section className="nf-hero">
        <div className="nf-hero__bg">
          <div className="nf-hero__orb nf-hero__orb--1" />
          <div className="nf-hero__orb nf-hero__orb--2" />
          <div className="nf-hero__grid-bg" />
        </div>

        <div className="nf-hero__inner">
          <motion.div className="nf-hero__num"
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}>
            <span>4</span>
            <motion.span
              animate={{ rotate: [0, 8, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}>0</motion.span>
            <span>4</span>
          </motion.div>

          <motion.h1 className="nf-hero__title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}>
            This page took the <em>day off</em>.
          </motion.h1>

          <motion.p className="nf-hero__desc"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}>
            But our designers haven't. Let's get you somewhere useful.
          </motion.p>

          <motion.div className="nf-hero__ctas"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}>
            <Link to="/" className="nf-btn nf-btn--primary">
              <HomeIcon size={16} /> Back to Home
            </Link>
            <Link to="/landing-page" className="nf-btn nf-btn--outline">
              <Sparkles size={16} /> Free Consultation
            </Link>
          </motion.div>

          <motion.div className="nf-hero__searchhint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.85 }}>
            <Search size={14} /> Lost? Try one of the links below.
          </motion.div>
        </div>
      </section>

      {/* ─── Quick links grid ─── */}
      <section className="nf-section">
        <div className="nf-section__head">
          <span className="nf-eyebrow">Popular Destinations</span>
          <h2 className="nf-h2">Where Would You Like to Go?</h2>
        </div>
        <div className="nf-links-grid">
          {QUICK_LINKS.map((l, i) => (
            <motion.div key={l.to}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.07 }}>
              <Link to={l.to} className="nf-link-card">
                <div className="nf-link-card__icon"><l.icon size={22} /></div>
                <div className="nf-link-card__body">
                  <h3>{l.title}</h3>
                  <p>{l.desc}</p>
                </div>
                <ArrowRight size={18} className="nf-link-card__arrow" />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── Featured projects ─── */}
      <section className="nf-section nf-featured">
        <div className="nf-section__head">
          <span className="nf-eyebrow">While You're Here</span>
          <h2 className="nf-h2">Recent <em>Transformations</em></h2>
        </div>
        <div className="nf-feat-grid">
          {FEATURED.map((p, i) => (
            <motion.div key={p.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}>
              <Link to={`/project/${p.id}`} className="nf-feat-card">
                <div className="nf-feat-card__media">
                  <img src={p.image} alt={p.title} loading="lazy" />
                </div>
                <div className="nf-feat-card__body">
                  <span>{p.category}</span>
                  <h3>{p.title}</h3>
                  <p><MapPin size={12} /> {p.location}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── Contact band ─── */}
      <section className="nf-contact-band">
        <div className="nf-contact-band__inner">
          <motion.div className="nf-contact-band__left"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}>
            <h2>Looking for something <em>specific</em>?</h2>
            <p>Tell us what you need and we'll point you the right way — or just say hi.</p>
          </motion.div>
          <motion.div className="nf-contact-band__right"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}>
            <a href="tel:+919916666222" className="nf-contact-btn">
              <Phone size={18} />
              <div>
                <small>Call us</small>
                <strong>+91 99166 66222</strong>
              </div>
            </a>
            <a href="https://wa.me/919916666222" target="_blank" rel="noopener noreferrer" className="nf-contact-btn nf-contact-btn--wa">
              <MessageCircle size={18} />
              <div>
                <small>WhatsApp</small>
                <strong>Message us</strong>
              </div>
            </a>
            <a href="mailto:info@atticarch.com" className="nf-contact-btn">
              <Mail size={18} />
              <div>
                <small>Email</small>
                <strong>info@atticarch.com</strong>
              </div>
            </a>
          </motion.div>
        </div>
      </section>
    </motion.main>
  )
}
