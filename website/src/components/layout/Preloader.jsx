import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Preloader() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          className="preloader"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: 'fixed', inset: 0, zIndex: 'var(--z-preloader)',
            background: '#1A1A1A', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 24
          }}
        >
          <motion.div
            style={{ fontFamily: 'var(--font-heading)', fontSize: '36px', fontStyle: 'italic', fontWeight: 600, color: 'var(--gold)' }}
            initial={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            AtticArch
          </motion.div>
          <motion.div
            style={{ width: 120, height: 2, background: 'rgba(201,169,110,0.2)', borderRadius: 4, overflow: 'hidden' }}
          >
            <motion.div
              style={{ height: '100%', background: '#C9A96E', borderRadius: 4 }}
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 2, ease: 'easeInOut' }}
            />
          </motion.div>
          <motion.p
            style={{ fontFamily: 'var(--font-accent)', fontSize: 10, letterSpacing: '0.3em', color: '#6B6B6B', textTransform: 'uppercase' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Transforming Spaces
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
