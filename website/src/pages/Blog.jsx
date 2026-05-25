import { useRef, useState, useCallback } from 'react'
import {
  motion, AnimatePresence, useScroll, useTransform,
  useMotionValue, useSpring, LayoutGroup
} from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { Link, useParams } from 'react-router-dom'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight, ArrowLeft, Clock, ArrowUpRight } from 'lucide-react'
import { useData } from '../context/DataContext'
import './Blog.css'

gsap.registerPlugin(ScrollTrigger)

/* ═════════════════════════════════════════
   3D TILT CARD — perspective mouse-follow
   ═════════════════════════════════════════ */
function TiltCard({ children, className, tiltStrength = 8 }) {
  const ref = useRef(null)
  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)
  const smoothX = useSpring(rotateX, { stiffness: 120, damping: 20 })
  const smoothY = useSpring(rotateY, { stiffness: 120, damping: 20 })

  const handleMove = useCallback((e) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const rx = (e.clientY - rect.top) / rect.height - 0.5
    const ry = (e.clientX - rect.left) / rect.width - 0.5
    rotateX.set(-rx * tiltStrength)
    rotateY.set(ry * tiltStrength)
  }, [rotateX, rotateY, tiltStrength])

  const handleLeave = useCallback(() => {
    rotateX.set(0)
    rotateY.set(0)
  }, [rotateX, rotateY])

  return (
    <motion.div
      ref={ref}
      className={className}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{
        rotateX: smoothX,
        rotateY: smoothY,
        transformPerspective: 800,
        transformStyle: 'preserve-3d',
      }}
    >
      {children}
    </motion.div>
  )
}

/* ═════════════════════════════════════════
   SPOTLIGHT — cursor-following glow
   ═════════════════════════════════════════ */
function Spotlight({ className }) {
  const ref = useRef(null)
  const x = useMotionValue(-200)
  const y = useMotionValue(-200)

  const handleMove = useCallback((e) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    x.set(e.clientX - rect.left)
    y.set(e.clientY - rect.top)
  }, [x, y])

  return (
    <div ref={ref} className={className} onMouseMove={handleMove}>
      <motion.div
        className="spotlight-glow"
        style={{ x, y }}
      />
    </div>
  )
}

/* ═════════════════════════════════════════
   COVER STORY — full-width cinematic hero card
   ═════════════════════════════════════════ */
function CoverStory({ post }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  })
  const imgY = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])

  return (
    <motion.div
      ref={ref}
      className="cover-story"
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link to={`/blog/${post.slug}`} className="cover-story__link">
        <div className="cover-story__media">
          <motion.img
            src={post.image}
            alt={post.title}
            style={{ y: imgY }}
          />
          <div className="cover-story__gradient" />
          <Spotlight className="cover-story__spotlight-area" />
        </div>

        <div className="cover-story__content">
          <div className="cover-story__left">
            <motion.div
              className="cover-story__badge"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <span className="cover-story__badge-dot" />
              Cover Story
            </motion.div>
            <h2 className="cover-story__title">{post.title}</h2>
            <p className="cover-story__excerpt">{post.excerpt}</p>
          </div>

          <div className="cover-story__right">
            <div className="cover-story__meta">
              <span className="cover-story__cat">{post.category}</span>
              <span className="cover-story__date"><Clock size={13} /> {post.date}</span>
            </div>
            <motion.div
              className="cover-story__arrow"
              whileHover={{ scale: 1.15, rotate: -15 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <ArrowUpRight size={22} />
            </motion.div>
          </div>
        </div>

        <div className="cover-story__accent" />
      </Link>
    </motion.div>
  )
}

/* ═════════════════════════════════════════
   EDITORIAL CARD — "lift to read" hover
   ═════════════════════════════════════════ */
function EditorialCard({ post, index, variant = 'default' }) {
  const isLarge = variant === 'large'
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ delay: index * 0.08, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <TiltCard className={`ed-card ${isLarge ? 'ed-card--large' : ''}`} tiltStrength={isLarge ? 5 : 8}>
        <Link to={`/blog/${post.slug}`} className="ed-card__link">
          <div className="ed-card__media">
            <img src={post.image} alt={post.title} loading="lazy" />
            <div className="ed-card__media-overlay" />

            <span className="ed-card__num">{String(index + 1).padStart(2, '0')}</span>

            <div className="ed-card__float-info">
              <span className="ed-card__float-cat">{post.category}</span>
              <span className="ed-card__float-date">{post.date}</span>
            </div>
          </div>

          <div className="ed-card__body">
            <div className="ed-card__body-top">
              <div className="ed-card__index-line">
                <span className="ed-card__idx">{String(index + 1).padStart(2, '0')}</span>
                <span className="ed-card__idx-bar" />
                <span className="ed-card__cat">{post.category}</span>
              </div>
              <h3 className="ed-card__title">{post.title}</h3>
              {isLarge && <p className="ed-card__excerpt">{post.excerpt}</p>}
            </div>

            <div className="ed-card__foot">
              <span className="ed-card__date"><Clock size={12} /> {post.date}</span>
              <span className="ed-card__cta">
                Read <ArrowRight size={13} />
              </span>
            </div>
          </div>

          <div className="ed-card__accent-bar" />
        </Link>
      </TiltCard>
    </motion.div>
  )
}

/* ═════════════════════════════════════════
   BLOG POST DETAIL — IMMERSIVE READER
   ═════════════════════════════════════════ */
function BlogPost({ post, allPosts }) {
  const { scrollYProgress } = useScroll()
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0])
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 1.15])
  const heroTextY = useTransform(scrollYProgress, [0, 0.2], [0, 80])
  const imageRef = useRef(null)
  const [activeSection, setActiveSection] = useState('')

  const relatedPosts = allPosts
    .filter(p => p.id !== post.id)
    .slice(0, 3)

  const nextPost = allPosts[(allPosts.findIndex(p => p.id === post.id) + 1) % allPosts.length]

  const tocSections = [
    { id: 'overview', label: 'Overview' },
    { id: 'philosophy', label: 'Design Philosophy' },
    { id: 'approach', label: 'Our Approach' },
    { id: 'details', label: 'Key Details' },
    { id: 'gallery', label: 'Visual Inspiration' },
  ]

  useGSAP(() => {
    if (imageRef.current) {
      gsap.from(imageRef.current, {
        y: '-15%',
        ease: 'none',
        scrollTrigger: {
          trigger: imageRef.current?.parentElement,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        }
      })
    }

    tocSections.forEach(section => {
      const el = document.getElementById(section.id)
      if (el) {
        ScrollTrigger.create({
          trigger: el,
          start: 'top center',
          end: 'bottom center',
          onEnter: () => setActiveSection(section.id),
          onEnterBack: () => setActiveSection(section.id),
        })
      }
    })
  })

  return (
    <motion.main
      className="bp-main"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Helmet><title>{post.title} — ATTICARCH Blog</title></Helmet>
      <motion.div className="blog-progress" style={{ scaleX }} />

      {/* ── CINEMATIC HERO ── */}
      <section className="bp-hero">
        <motion.div className="bp-hero__bg" style={{ opacity: heroOpacity, scale: heroScale }}>
          <img src={post.image} alt="" />
          <div className="bp-hero__bg-overlay" />
        </motion.div>

        <div className="bp-hero__particles">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="bp-hero__particle"
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 0.6, 0.2],
              }}
              transition={{
                duration: 4 + i * 0.8,
                repeat: Infinity,
                delay: i * 0.5,
                ease: 'easeInOut',
              }}
              style={{
                left: `${15 + i * 14}%`,
                bottom: `${10 + (i % 3) * 20}%`,
              }}
            />
          ))}
        </div>

        <motion.div className="container bp-hero__inner" style={{ y: heroTextY }}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Link to="/blog" className="bp-hero__back"><ArrowLeft size={16} /> Back to Journal</Link>
          </motion.div>

          <motion.div
            className="bp-hero__cat-row"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <span className="bp-hero__cat">{post.category}</span>
            <span className="bp-hero__reading-time"><Clock size={13} /> 5 min read</span>
          </motion.div>

          <div style={{ overflow: 'hidden' }}>
            <motion.h1
              className="bp-hero__title"
              initial={{ y: '120%', rotate: 2 }}
              animate={{ y: 0, rotate: 0 }}
              transition={{ delay: 0.4, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              {post.title}
            </motion.h1>
          </div>

          <motion.p
            className="bp-hero__excerpt"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            {post.excerpt}
          </motion.p>

          <motion.div
            className="bp-hero__meta"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <div className="bp-hero__author">
              <div className="bp-hero__author-avatar">AA</div>
              <div className="bp-hero__author-info">
                <span className="bp-hero__author-name">ATTICARCH Team</span>
                <span className="bp-hero__author-date">{post.date}</span>
              </div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className="bp-hero__scroll-hint"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ArrowRight size={16} style={{ transform: 'rotate(90deg)' }} />
          </motion.div>
        </motion.div>
      </section>

      {/* ── FEATURED IMAGE ── */}
      <motion.div
        className="bp-image"
        initial={{ opacity: 0, y: 40, clipPath: 'inset(8% 4% 8% 4% round 24px)' }}
        animate={{ opacity: 1, y: 0, clipPath: 'inset(0% 0% 0% 0% round 0px)' }}
        transition={{ delay: 0.5, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <img ref={imageRef} src={post.image} alt={post.title} style={{ transform: 'translateY(0)' }} />
        <div className="bp-image__vignette" />
      </motion.div>

      {/* ── BODY WITH SIDEBAR ── */}
      <section className="bp-body-section">
        <div className="container">
          <div className="bp-layout">

            {/* Sticky TOC Sidebar */}
            <aside className="bp-sidebar">
              <motion.div
                className="bp-toc"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <span className="bp-toc__label">Contents</span>
                <nav className="bp-toc__nav">
                  {tocSections.map(s => (
                    <a
                      key={s.id}
                      href={`#${s.id}`}
                      className={`bp-toc__link ${activeSection === s.id ? 'bp-toc__link--active' : ''}`}
                      onClick={(e) => {
                        e.preventDefault()
                        document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth' })
                      }}
                    >
                      <span className="bp-toc__dot" />
                      {s.label}
                    </a>
                  ))}
                </nav>
              </motion.div>
            </aside>

            {/* Main Content */}
            <div className="bp-body">
              <div id="overview">
                <motion.p
                  className="bp-lead"
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7 }}
                >
                  {post.excerpt}
                </motion.p>
              </div>

              <motion.div
                className="bp-ornament"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className="bp-ornament__line" />
                <span className="bp-ornament__diamond" />
                <span className="bp-ornament__line" />
              </motion.div>

              <div id="philosophy">
                <motion.h2
                  className="bp-section-title"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  The Design Philosophy
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  Interior design is an art that requires a deep understanding of space, light, and human psychology.
                  At ATTICARCH, we approach every project with fresh eyes and creative energy. Our team of experienced
                  designers works tirelessly to create spaces that not only look stunning but also enhance the quality
                  of life for the people who inhabit them.
                </motion.p>
              </div>

              <motion.div
                className="bp-quote"
                initial={{ opacity: 0, clipPath: 'inset(0 100% 0 0)' }}
                whileInView={{ opacity: 1, clipPath: 'inset(0 0% 0 0)' }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className="bp-quote__mark">&ldquo;</span>
                <p>Good design is not about trends. It's about creating timeless spaces that tell your story.</p>
                <cite>— ATTICARCH Design Team</cite>
              </motion.div>

              <div id="approach">
                <motion.h2
                  className="bp-section-title"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  Our Approach
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  Whether you're redesigning your living room or planning a complete home renovation, the key is to
                  start with a clear vision and work with professionals who understand your needs. Our consultation
                  process is designed to uncover your unique preferences and translate them into tangible design solutions.
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  We believe that great interior spaces are born from the intersection of form and function. Every material
                  we choose, every colour palette we curate, and every piece of furniture we place has a purpose — to make
                  your home feel uniquely yours while maintaining the highest standards of aesthetic integrity.
                </motion.p>
              </div>

              {/* Key Details Cards */}
              <div id="details">
                <motion.h2
                  className="bp-section-title"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  Key Details
                </motion.h2>
                <div className="bp-details-grid">
                  {[
                    { icon: '01', title: 'Personal Consultation', desc: 'One-on-one sessions to understand your vision, lifestyle, and spatial requirements.' },
                    { icon: '02', title: 'Material Curation', desc: 'Hand-picked materials sourced for quality, sustainability, and aesthetic harmony.' },
                    { icon: '03', title: 'Spatial Planning', desc: 'Optimising every square foot to create flow, balance, and functional beauty.' },
                    { icon: '04', title: 'Expert Execution', desc: 'Our in-house team ensures every detail is realised to the highest standard.' },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      className="bp-detail-card"
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1, duration: 0.6 }}
                    >
                      <span className="bp-detail-card__icon">{item.icon}</span>
                      <h4 className="bp-detail-card__title">{item.title}</h4>
                      <p className="bp-detail-card__desc">{item.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Gallery Section */}
              <div id="gallery">
                <motion.h2
                  className="bp-section-title"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  Visual Inspiration
                </motion.h2>
                <div className="bp-gallery">
                  {relatedPosts.map((p, i) => (
                    <motion.div
                      key={p.id}
                      className={`bp-gallery__item ${i === 0 ? 'bp-gallery__item--wide' : ''}`}
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.12, duration: 0.7 }}
                    >
                      <img src={p.image} alt={p.title} loading="lazy" />
                      <div className="bp-gallery__overlay" />
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Author Card */}
              <motion.div
                className="bp-author-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              >
                <div className="bp-author-card__avatar">AA</div>
                <div className="bp-author-card__info">
                  <span className="bp-author-card__label">Written by</span>
                  <h4 className="bp-author-card__name">ATTICARCH Design Team</h4>
                  <p className="bp-author-card__bio">
                    Bangalore's award-winning interior design studio, crafting breathtaking spaces since 2002.
                    We bring together art, architecture, and soul to create homes that inspire.
                  </p>
                </div>
              </motion.div>

              {/* Share Section */}
              <motion.div
                className="bp-share"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <span className="bp-share__label">Share this article</span>
                <div className="bp-share__buttons">
                  {['Twitter', 'LinkedIn', 'Facebook'].map(platform => (
                    <button key={platform} className="bp-share__btn">{platform}</button>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ── RELATED POSTS ── */}
      <section className="bp-related">
        <div className="container">
          <motion.div
            className="bp-related__header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="bp-related__header-line" />
            <span>More to Read</span>
            <div className="bp-related__header-line" />
          </motion.div>

          <div className="bp-related__grid">
            {relatedPosts.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
              >
                <Link to={`/blog/${p.slug}`} className="bp-related__card">
                  <div className="bp-related__card-img">
                    <img src={p.image} alt={p.title} loading="lazy" />
                    <div className="bp-related__card-overlay" />
                  </div>
                  <div className="bp-related__card-body">
                    <span className="bp-related__card-cat">{p.category}</span>
                    <h4 className="bp-related__card-title">{p.title}</h4>
                    <span className="bp-related__card-cta">Read Article <ArrowRight size={13} /></span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEXT ARTICLE TEASER ── */}
      {nextPost && (
        <Link to={`/blog/${nextPost.slug}`} className="bp-next">
          <motion.section
            className="bp-next__inner"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
          >
            <img src={nextPost.image} alt="" className="bp-next__bg" />
            <div className="bp-next__overlay" />
            <div className="container bp-next__content">
              <span className="bp-next__label">Next Article</span>
              <h3 className="bp-next__title">{nextPost.title}</h3>
              <motion.div
                className="bp-next__arrow"
                whileHover={{ x: 10 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <ArrowRight size={28} />
              </motion.div>
            </div>
          </motion.section>
        </Link>
      )}
    </motion.main>
  )
}

/* ═════════════════════════════════════════════════════
   MAIN EXPORT — BLOG LISTING
   ═════════════════════════════════════════════════════ */
export default function Blog() {
  const { blogPosts } = useData()
  const { slug } = useParams()
  const [activeCategory, setActiveCategory] = useState('All')
  const heroRef = useRef(null)
  const lineRef = useRef(null)

  const categories = ['All', ...new Set(blogPosts.map(p => p.category))]
  const filtered = activeCategory === 'All'
    ? blogPosts
    : blogPosts.filter(p => p.category === activeCategory)

  useGSAP(() => {
    if (!slug && heroRef.current) {
      gsap.from(heroRef.current, {
        y: '20%', ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current?.parentElement,
          start: 'top top', end: 'bottom top', scrub: true,
        }
      })
    }
  }, [slug])

  useGSAP(() => {
    if (!slug && lineRef.current) {
      gsap.fromTo(lineRef.current,
        { width: '0%' },
        { width: '100%', duration: 1.2, ease: 'power2.out', delay: 0.8 }
      )
    }
  }, [slug])

  if (slug) {
    const post = blogPosts.find(p => p.slug === slug) || blogPosts[0]
    return <BlogPost post={post} allPosts={blogPosts} />
  }

  const coverPost = filtered[0]
  const editorialPosts = filtered.slice(1)

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Helmet><title>Blog — ATTICARCH Interior Design Insights</title></Helmet>

      {/* ── HERO ── */}
      <section className="blg-hero">
        <div className="blg-hero__bg" ref={heroRef}>
          <div className="blg-hero__orb blg-hero__orb--1" />
          <div className="blg-hero__orb blg-hero__orb--2" />
          <div className="blg-hero__orb blg-hero__orb--3" />
        </div>
        <div className="blg-hero__grain" />

        <div className="container blg-hero__content">
          <div className="blg-hero__left">
            <motion.div
              className="blg-hero__eyebrow"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.6 }}
            >
              <span className="blg-hero__eyebrow-dot" />
              <span>Journal</span>
            </motion.div>

            <div className="blg-hero__title-wrap">
              <div style={{ overflow: 'hidden' }}>
                <motion.span
                  className="blg-hero__title-line"
                  initial={{ y: '120%', rotate: 3 }}
                  animate={{ y: 0, rotate: 0 }}
                  transition={{ delay: 0.2, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                >
                  Design
                </motion.span>
              </div>
              <div style={{ overflow: 'hidden' }}>
                <motion.span
                  className="blg-hero__title-line blg-hero__title-accent"
                  initial={{ y: '120%', rotate: 3 }}
                  animate={{ y: 0, rotate: 0 }}
                  transition={{ delay: 0.35, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                >
                  <em>Stories</em>
                </motion.span>
              </div>
            </div>

            <div className="blg-hero__line-wrap">
              <div className="blg-hero__line" ref={lineRef} />
            </div>

            <motion.p
              className="blg-hero__sub"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              Curated thoughts on architecture, interiors, and the art of living beautifully.
            </motion.p>

            <motion.div
              className="blg-hero__stats"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              {[
                { num: blogPosts.length, label: 'Articles' },
                { num: categories.length - 1, label: 'Topics' },
              ].map((s, i) => (
                <div key={i} className="blg-hero__stat">
                  <span className="blg-hero__stat-num">{s.num}</span>
                  <span className="blg-hero__stat-lbl">{s.label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Hero preview card */}
          {coverPost && (
            <motion.div
              className="blg-hero__preview"
              initial={{ opacity: 0, x: 60, rotateY: -8 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              transition={{ delay: 0.6, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              <TiltCard className="blg-hero__preview-card" tiltStrength={6}>
                <Link to={`/blog/${coverPost.slug}`}>
                  <img src={coverPost.image} alt={coverPost.title} />
                  <div className="blg-hero__preview-overlay" />
                  <div className="blg-hero__preview-content">
                    <span className="blg-hero__preview-badge">Latest</span>
                    <h3>{coverPost.title}</h3>
                    <span className="blg-hero__preview-cta">
                      Read <ArrowUpRight size={14} />
                    </span>
                  </div>
                </Link>
              </TiltCard>
            </motion.div>
          )}
        </div>

        <motion.div
          className="blg-hero__scroll"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <span>Scroll</span>
          <motion.div
            className="blg-hero__scroll-line"
            animate={{ scaleY: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
      </section>

      {/* ── FILTER + COVER STORY + EDITORIAL GRID ── */}
      <section className="blg-main">
        <div className="container">

          <LayoutGroup>
            <motion.div
              className="blg-filter"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {categories.map(cat => (
                <button
                  key={cat}
                  className={`blg-filter__btn ${activeCategory === cat ? 'blg-filter__btn--active' : ''}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {activeCategory === cat && (
                    <motion.div
                      className="blg-filter__pill"
                      layoutId="blogFilterPill"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span style={{ position: 'relative', zIndex: 1 }}>{cat}</span>
                </button>
              ))}
            </motion.div>
          </LayoutGroup>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35 }}
            >
              {filtered.length === 0 ? (
                <div className="blg-empty">
                  <p>No articles in this category yet.</p>
                </div>
              ) : (
                <>
                  {coverPost && <CoverStory post={coverPost} />}

                  {editorialPosts.length > 0 && (
                    <>
                      <motion.div
                        className="blg-section-header"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                      >
                        <div className="blg-section-header__line" />
                        <span>More Articles</span>
                        <div className="blg-section-header__line" />
                      </motion.div>

                      <div className="blg-editorial-grid">
                        {editorialPosts.map((post, i) => (
                          <EditorialCard
                            key={post.id}
                            post={post}
                            index={i + 1}
                            variant={i === 0 ? 'large' : 'default'}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </motion.main>
  )
}
