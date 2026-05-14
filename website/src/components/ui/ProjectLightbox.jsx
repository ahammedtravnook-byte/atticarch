import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { allImages } from '../../data/siteData'
import './ProjectLightbox.css'

/* Full-screen project gallery viewer — arrows, keyboard nav, thumbnails. */
export default function ProjectLightbox({ project, onClose, startIndex = 0 }) {
  const [idx, setIdx] = useState(startIndex)
  const imgs = project.images?.length ? project.images : [allImages[0]]
  const go = (n) => setIdx((i) => (i + n + imgs.length) % imgs.length)

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <motion.div className="lightbox" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div
        className="lightbox__inner"
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="lightbox__stage">
          <AnimatePresence mode="wait">
            <motion.img
              key={idx}
              src={imgs[idx]}
              alt={`${project.title} — ${idx + 1}`}
              className="lightbox__img"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
          </AnimatePresence>
          {imgs.length > 1 && (
            <>
              <button className="lightbox__arrow lightbox__arrow--prev" onClick={() => go(-1)} aria-label="Previous">
                <ChevronLeft size={22} />
              </button>
              <button className="lightbox__arrow lightbox__arrow--next" onClick={() => go(1)} aria-label="Next">
                <ChevronRight size={22} />
              </button>
            </>
          )}
        </div>

        <div className="lightbox__info">
          <div>
            <h3>{project.title}</h3>
            <p>{project.location} · {project.year}</p>
          </div>
          <span className="lightbox__count text-mono">{idx + 1} / {imgs.length}</span>
        </div>

        {imgs.length > 1 && (
          <div className="lightbox__thumbs">
            {imgs.map((im, i) => (
              <button key={i} className={`lightbox__thumb ${i === idx ? 'active' : ''}`} onClick={() => setIdx(i)}>
                <img src={im} alt="" loading="lazy" />
              </button>
            ))}
          </div>
        )}

        <button className="lightbox__close" onClick={onClose} aria-label="Close">×</button>
      </motion.div>
    </motion.div>
  )
}
