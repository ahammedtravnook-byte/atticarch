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
import { ArrowRight, ArrowLeft, Clock, ArrowUpRight, Sparkles } from 'lucide-react'
import { useData } from '../context/DataContext'
import './Blog.css'

gsap.registerPlugin(ScrollTrigger)

/* ═════════════════════════════════════════
   MARQUEE RIBBON — kinetic editorial ticker
   ═════════════════════════════════════════ */
function MarqueeRibbon({ words, reverse = false }) {
  const row = (
    <div className="blg-marquee__row" aria-hidden="true">
      {words.map((w, i) => (
        <span className="blg-marquee__item" key={i}>
          {w}
          <span className="blg-marquee__star">✦</span>
        </span>
      ))}
    </div>
  )
  return (
    <div className={`blg-marquee ${reverse ? 'blg-marquee--rev' : ''}`}>
      <div className="blg-marquee__track">
        {row}{row}
      </div>
    </div>
  )
}

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
          <span className="cover-story__ghost">01</span>
          <span className="cover-story__kicker">Featured Dispatch</span>
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
  const heroImgScale = useTransform(scrollYProgress, [0, 0.3], [1, 1.15])
  const heroImgOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0.3])
  const [activeSection, setActiveSection] = useState('')

  const relatedPosts = allPosts.filter(p => p.id !== post.id).slice(0, 3)
  const nextPost = allPosts[(allPosts.findIndex(p => p.id === post.id) + 1) % allPosts.length]

  const tocItems = [
    { id: 'sec-intro', label: 'Introduction' },
    { id: 'sec-philosophy', label: 'Philosophy' },
    { id: 'sec-approach', label: 'Approach' },
    { id: 'sec-highlights', label: 'Highlights' },
  ]

  // When the post has CMS-authored body content, render it; otherwise fall back
  // to the editorial boilerplate so legacy posts still look complete.
  const hasContent = !!(post.content && String(post.content).trim())

  useGSAP(() => {
    tocItems.forEach(s => {
      const el = document.getElementById(s.id)
      if (el) {
        ScrollTrigger.create({
          trigger: el,
          start: 'top center',
          end: 'bottom center',
          onEnter: () => setActiveSection(s.id),
          onEnterBack: () => setActiveSection(s.id),
        })
      }
    })

    gsap.utils.toArray('.bp-reveal').forEach(el => {
      gsap.from(el, {
        y: 40, opacity: 0, duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%', once: true }
      })
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

      {/* ── SPLIT HERO — image left, text right ── */}
      <section className="bp2-hero">
        <motion.div className="bp2-hero__img-col" style={{ scale: heroImgScale, opacity: heroImgOpacity }}>
          <img src={post.image} alt={post.title} />
          <div className="bp2-hero__img-overlay" />
        </motion.div>

        <div className="bp2-hero__text-col">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
          >
            <Link to="/blog" className="bp2-hero__back"><ArrowLeft size={15} /> Journal</Link>
          </motion.div>

          <motion.div
            className="bp2-hero__tags"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <span className="bp2-hero__cat">{post.category}</span>
            <span className="bp2-hero__dot" />
            <span className="bp2-hero__read"><Clock size={12} /> 5 min</span>
          </motion.div>

          <div style={{ overflow: 'hidden' }}>
            <motion.h1
              className="bp2-hero__title"
              initial={{ y: '110%' }}
              animate={{ y: 0 }}
              transition={{ delay: 0.35, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            >
              {post.title}
            </motion.h1>
          </div>

          <motion.p
            className="bp2-hero__excerpt"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65 }}
          >
            {post.excerpt}
          </motion.p>

          <motion.div
            className="bp2-hero__author"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.85 }}
          >
            <div className="bp2-hero__avatar">A</div>
            <div>
              <span className="bp2-hero__author-name">ATTICARCH Team</span>
              <span className="bp2-hero__author-date">{post.date}</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── ARTICLE BODY ── */}
      <section className="bp2-article">
        <div className="container">
          <div className="bp2-layout">

            {/* Sticky sidebar */}
            <aside className="bp2-side">
              {!hasContent && (
                <div className="bp2-toc">
                  <span className="bp2-toc__heading">On this page</span>
                  {tocItems.map(t => (
                    <a
                      key={t.id}
                      href={`#${t.id}`}
                      className={`bp2-toc__item ${activeSection === t.id ? 'bp2-toc__item--on' : ''}`}
                      onClick={e => { e.preventDefault(); document.getElementById(t.id)?.scrollIntoView({ behavior: 'smooth' }) }}
                    >
                      <span className="bp2-toc__bar" />
                      {t.label}
                    </a>
                  ))}
                </div>
              )}

              {/* Share */}
              <div className="bp2-side-share">
                <span className="bp2-side-share__label">Share</span>
                {['Tw', 'Li', 'Fb'].map(p => (
                  <button key={p} className="bp2-side-share__btn">{p}</button>
                ))}
              </div>
            </aside>

            {/* Content */}
            <article className="bp2-content">
              <div id="sec-intro" className="bp-reveal">
                <p className="bp2-dropcap">
                  {post.excerpt} The way we shape our interiors speaks volumes about who we are — our values,
                  our aspirations, and the stories we want our homes to tell. At ATTICARCH, every project
                  begins with listening. Before a single sketch is drawn, we sit down with you to truly
                  understand the life you want to live in your space.
                </p>
              </div>

              {/* CMS-authored body (HTML from the admin editor) */}
              {hasContent && (
                <div
                  className="bp2-richtext bp-reveal"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              )}

              {!hasContent && (<>
              <div className="bp2-divider bp-reveal">
                <span /><span className="bp2-divider__diamond" /><span />
              </div>

              <div id="sec-philosophy" className="bp-reveal">
                <h2 className="bp2-h2">The Design Philosophy</h2>
                <p>
                  Interior design is an art that requires a deep understanding of space, light, and human psychology.
                  At ATTICARCH, we approach every project with fresh eyes and creative energy. Our team of experienced
                  designers works tirelessly to create spaces that not only look stunning but also enhance the quality
                  of life for the people who inhabit them.
                </p>
                <p>
                  We draw inspiration from both the natural beauty of Bangalore and global design movements,
                  weaving together local craftsmanship with contemporary sensibility. The result is a home that
                  feels both timeless and intimately personal.
                </p>
              </div>

              <div className="bp2-pullquote bp-reveal">
                <span className="bp2-pullquote__mark">&ldquo;</span>
                <blockquote>Good design is not about trends. It's about creating timeless spaces that tell your story.</blockquote>
                <cite>— ATTICARCH Design Team</cite>
              </div>

              <div id="sec-approach" className="bp-reveal">
                <h2 className="bp2-h2">Our Approach</h2>
                <p>
                  Whether you're redesigning your living room or planning a complete home renovation, the key is to
                  start with a clear vision and work with professionals who understand your needs. Our consultation
                  process is designed to uncover your unique preferences and translate them into tangible design solutions.
                </p>
                <p>
                  We believe that great interior spaces are born from the intersection of form and function. Every material
                  we choose, every colour palette we curate, and every piece of furniture we place has a purpose — to make
                  your home feel uniquely yours while maintaining the highest standards of aesthetic integrity.
                </p>
              </div>

              {/* Highlight strip */}
              <div id="sec-highlights" className="bp2-highlights bp-reveal">
                {[
                  { num: '01', title: 'Personal Consultation', text: 'One-on-one sessions to understand your vision, lifestyle, and spatial requirements.' },
                  { num: '02', title: 'Material Curation', text: 'Hand-picked materials sourced for quality, sustainability, and aesthetic harmony.' },
                  { num: '03', title: 'Spatial Planning', text: 'Optimising every square foot to create flow, balance, and functional beauty.' },
                  { num: '04', title: 'Expert Execution', text: 'Our in-house team ensures every detail is realised to the highest standard.' },
                ].map((h, i) => (
                  <motion.div
                    key={i}
                    className="bp2-hl-card"
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08, duration: 0.55 }}
                  >
                    <span className="bp2-hl-card__num">{h.num}</span>
                    <div>
                      <h4 className="bp2-hl-card__title">{h.title}</h4>
                      <p className="bp2-hl-card__text">{h.text}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              </>)}

              {/* Author sign-off */}
              <div className="bp2-signoff bp-reveal">
                <div className="bp2-signoff__avatar">A</div>
                <div className="bp2-signoff__info">
                  <span className="bp2-signoff__label">Written by</span>
                  <h4 className="bp2-signoff__name">ATTICARCH Design Team</h4>
                  <p className="bp2-signoff__bio">
                    Bangalore's award-winning interior design studio — crafting breathtaking spaces since 2002.
                  </p>
                </div>
                <Link to="/contact-us" className="bp2-signoff__cta">
                  Get in Touch <ArrowRight size={14} />
                </Link>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* ── RELATED ── */}
      <section className="bp2-related">
        <div className="container">
          <motion.h3
            className="bp2-related__title"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Continue Reading
          </motion.h3>
          <div className="bp2-related__grid">
            {relatedPosts.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.55 }}
              >
                <Link to={`/blog/${p.slug}`} className="bp2-rcard">
                  <div className="bp2-rcard__img">
                    <img src={p.image} alt={p.title} loading="lazy" />
                  </div>
                  <div className="bp2-rcard__body">
                    <span className="bp2-rcard__cat">{p.category}</span>
                    <h4 className="bp2-rcard__title">{p.title}</h4>
                    <span className="bp2-rcard__link">Read <ArrowRight size={12} /></span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEXT ── */}
      {nextPost && (
        <Link to={`/blog/${nextPost.slug}`} className="bp2-next">
          <motion.div
            className="bp2-next__wrap"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7 }}
          >
            <img src={nextPost.image} alt="" className="bp2-next__bg" />
            <div className="bp2-next__overlay" />
            <div className="container bp2-next__content">
              <span className="bp2-next__label">Next Article</span>
              <h3 className="bp2-next__title">{nextPost.title}</h3>
              <span className="bp2-next__btn"><ArrowRight size={22} /></span>
            </div>
          </motion.div>
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
          <div className="blg-hero__mesh" />
          <div className="blg-hero__orb blg-hero__orb--1" />
          <div className="blg-hero__orb blg-hero__orb--2" />
          <div className="blg-hero__orb blg-hero__orb--3" />
        </div>
        <div className="blg-hero__grain" />

        {/* Vertical issue rail */}
        <div className="blg-hero__rail">
          <span className="blg-hero__rail-line" />
          <span className="blg-hero__rail-text">Est. 2002 — Bengaluru</span>
        </div>

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

        {/* Kinetic marquee ribbon */}
        <MarqueeRibbon words={['Design', 'Interiors', 'Architecture', 'Craft', 'Living', 'Materials', 'Light', 'Detail']} />
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

      {/* ── CLOSING CTA BAND ── */}
      <section className="blg-cta">
        <div className="blg-cta__grain" />
        <MarqueeRibbon words={['The Journal', 'Design Stories', 'ATTICARCH']} reverse />
        <div className="container blg-cta__inner">
          <motion.div
            className="blg-cta__content"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="blg-cta__eyebrow"><Sparkles size={13} /> From page to space</span>
            <h2 className="blg-cta__title">
              Loved the ideas? <em>Let's build them.</em>
            </h2>
            <p className="blg-cta__sub">
              Turn inspiration into a home that's unmistakably yours. Book a free design
              consultation with Bangalore's award-winning studio.
            </p>
            <Link to="/contact-us" className="blg-cta__btn">
              Book a Consultation <ArrowUpRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>
    </motion.main>
  )
}
