import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const cursorRef = useRef(null)
  const followerRef = useRef(null)

  useEffect(() => {
    const cursor = cursorRef.current
    const follower = followerRef.current
    if (!cursor || !follower) return
    if (window.matchMedia('(pointer: coarse)').matches) {
      cursor.style.display = 'none'
      follower.style.display = 'none'
      return
    }

    let mouseX = 0, mouseY = 0, posX = 0, posY = 0

    const onMouseMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
      cursor.style.left = mouseX + 'px'
      cursor.style.top = mouseY + 'px'
    }

    const animate = () => {
      posX += (mouseX - posX) * 0.1
      posY += (mouseY - posY) * 0.1
      follower.style.left = posX + 'px'
      follower.style.top = posY + 'px'
      requestAnimationFrame(animate)
    }

    const onHoverIn = () => {
      cursor.classList.add('cursor--hover')
      follower.classList.add('cursor-follower--hover')
    }
    const onHoverOut = () => {
      cursor.classList.remove('cursor--hover')
      follower.classList.remove('cursor-follower--hover')
    }

    document.addEventListener('mousemove', onMouseMove)
    animate()

    const hoverEls = document.querySelectorAll('a, button, .card, [data-cursor]')
    hoverEls.forEach(el => {
      el.addEventListener('mouseenter', onHoverIn)
      el.addEventListener('mouseleave', onHoverOut)
    })

    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      hoverEls.forEach(el => {
        el.removeEventListener('mouseenter', onHoverIn)
        el.removeEventListener('mouseleave', onHoverOut)
      })
    }
  }, [])

  const baseStyle = {
    position: 'fixed', pointerEvents: 'none', zIndex: 'var(--z-cursor)',
    borderRadius: '50%', transform: 'translate(-50%, -50%)', transition: 'width 0.3s, height 0.3s, background 0.3s',
  }

  return (
    <>
      <div ref={cursorRef} className="cursor" style={{ ...baseStyle, width: 8, height: 8, background: 'var(--gold)' }} />
      <div ref={followerRef} className="cursor-follower" style={{ ...baseStyle, width: 36, height: 36, border: '1px solid var(--gold)', opacity: 0.4 }} />
      <style>{`
        .cursor--hover { width: 16px !important; height: 16px !important; background: var(--gold-light) !important; mix-blend-mode: difference; }
        .cursor-follower--hover { width: 52px !important; height: 52px !important; border-color: var(--gold-light) !important; opacity: 0.6 !important; }
        @media (pointer: coarse) { .cursor, .cursor-follower { display: none !important; } }
      `}</style>
    </>
  )
}
