import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import 'lenis/dist/lenis.css'

gsap.registerPlugin(ScrollTrigger)

export default function SmoothScroll() {
  const { pathname } = useLocation()
  const lenisRef = useRef(null)

  // Initialize Lenis ONCE for the lifetime of the app
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      smoothTouch: false,
      touchMultiplier: 1.5,
    })
    lenisRef.current = lenis

    lenis.on('scroll', ScrollTrigger.update)

    const updateLenis = (time) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(updateLenis)
    gsap.ticker.lagSmoothing(0)

    // Refresh ScrollTrigger once everything settles (images, fonts)
    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener('load', refresh)
    const t = setTimeout(refresh, 600)
    if (document.fonts?.ready) document.fonts.ready.then(refresh)

    return () => {
      window.removeEventListener('load', refresh)
      clearTimeout(t)
      gsap.ticker.remove(updateLenis)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  // Handle scroll-to-top + ScrollTrigger refresh on route change
  useEffect(() => {
    const lenis = lenisRef.current
    if (!lenis) return
    lenis.scrollTo(0, { immediate: true })
    // After the new page mounts, ScrollTriggers need to be recalculated
    const t = setTimeout(() => ScrollTrigger.refresh(), 100)
    return () => clearTimeout(t)
  }, [pathname])

  return null
}
