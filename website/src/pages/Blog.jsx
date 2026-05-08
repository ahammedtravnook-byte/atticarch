import { useRef, useState } from 'react'
import { motion, AnimatePresence, useScroll, useTransform, LayoutGroup } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { Link, useParams } from 'react-router-dom'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight, ArrowLeft, Clock } from 'lucide-react'
import { blogPosts } from '../data/siteData'
import './Blog.css'

gsap.registerPlugin(ScrollTrigger)

function BlogPost({ post }) {
  const { scrollYProgress } = useScroll()
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1])
  const imageRef = useRef(null)

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
  })

  return (
    <motion.main
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <Helmet><title>{post.title} — ATTICARCH Blog</title></Helmet>

      <motion.div className="blog-progress" style={{ scaleX }} />

      <section className="blog-post-hero">
        <div className="container" style={{ maxWidth: 800 }}>
          <Link to="/blog" className="blog-post-hero__back">
            <ArrowLeft size={14} /> Back to Blog
          </Link>
          <motion.span
            className="blog-post-hero__category"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {post.category}
          </motion.span>
          <motion.h1
            className="blog-post-hero__title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            {post.title}
          </motion.h1>
          <motion.p
            className="blog-post-hero__meta"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Clock size={14} /> {post.date}
          </motion.p>
        </div>
      </section>

      <div className="blog-post__image">
        <img ref={imageRef} src={post.image} alt={post.title} style={{ transform: 'translateY(0)' }} />
      </div>

      <section className="blog-post__content">
        <div className="container">
          <div className="blog-post__body">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {post.excerpt}
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Interior design is an art that requires a deep understanding of space, light, and human psychology.
              At ATTICARCH, we approach every project with fresh eyes and creative energy. Our team of experienced
              designers works tirelessly to create spaces that not only look stunning but also enhance the quality
              of life for the people who inhabit them.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Whether you're redesigning your living room or planning a complete home renovation, the key is to
              start with a clear vision and work with professionals who understand your needs. Our consultation
              process is designed to uncover your unique preferences and translate them into tangible design solutions.
            </motion.p>

            <motion.div
              className="blog-post__quote"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <p>"Good design is not about trends. It's about creating timeless spaces that tell your story."</p>
              <cite>— ATTICARCH Design Team</cite>
            </motion.div>
          </div>
        </div>
      </section>
    </motion.main>
  )
}

export default function Blog() {
  const { slug } = useParams()
  const [activeCategory, setActiveCategory] = useState('All')
  const heroRef = useRef(null)

  const categories = ['All', ...new Set(blogPosts.map(p => p.category))]
  const filteredPosts = activeCategory === 'All'
    ? blogPosts
    : blogPosts.filter(p => p.category === activeCategory)

  useGSAP(() => {
    if (heroRef.current && !slug) {
      gsap.from(heroRef.current, {
        y: '20%',
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current?.parentElement,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        }
      })
    }
  }, [slug])

  if (slug) {
    const post = blogPosts.find(p => p.slug === slug) || blogPosts[0]
    return <BlogPost post={post} />
  }

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Helmet><title>Blog — ATTICARCH Interior Design Insights</title></Helmet>

      <section className="blog-hero">
        <div className="blog-hero__bg" ref={heroRef} />
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <motion.span
            className="about-hero__label"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Our Blog
          </motion.span>
          <motion.h1
            className="blog-hero__title"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            Design <span className="shimmer">Insights</span>
          </motion.h1>
        </div>
      </section>

      <section style={{ padding: '80px 0' }}>
        <div className="container">
          <LayoutGroup>
            <div className="blog-filter">
              {categories.map(cat => (
                <button
                  key={cat}
                  className={`blog-filter__btn ${activeCategory === cat ? 'blog-filter__btn--active' : ''}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {activeCategory === cat && (
                    <motion.div
                      className="blog-filter__pill"
                      layoutId="filterPill"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span style={{ position: 'relative', zIndex: 1 }}>{cat}</span>
                </button>
              ))}
            </div>
          </LayoutGroup>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              className="blog-grid"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
            >
              {filteredPosts.map((post, i) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link to={`/blog/${post.slug}`} className="blog-card">
                    <div className="blog-card__image">
                      <img src={post.image} alt={post.title} loading="lazy" />
                      <span className="blog-card__badge">{post.category}</span>
                    </div>
                    <div className="blog-card__body">
                      <span className="blog-card__date">{post.date}</span>
                      <h3 className="blog-card__title">{post.title}</h3>
                      <p className="blog-card__excerpt">{post.excerpt}</p>
                      <span className="blog-card__link">
                        Read More <ArrowRight size={14} />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </motion.main>
  )
}
