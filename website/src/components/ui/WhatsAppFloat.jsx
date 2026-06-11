import { useEffect, useState } from 'react'
import './WhatsAppFloat.css'

const WHATSAPP_NUM = '919845013138'
const WHATSAPP_MSG = "Hi ATTICARCH, I'd like a free interior design consultation."

export default function WhatsAppFloat() {
  const [visible, setVisible] = useState(false)
  const [showBubble, setShowBubble] = useState(false)

  useEffect(() => {
    const showTimer = setTimeout(() => setVisible(true), 1200)
    const bubbleTimer = setTimeout(() => setShowBubble(true), 3200)
    const hideBubbleTimer = setTimeout(() => setShowBubble(false), 11000)
    return () => {
      clearTimeout(showTimer)
      clearTimeout(bubbleTimer)
      clearTimeout(hideBubbleTimer)
    }
  }, [])

  return (
    <div className={`wa-float ${visible ? 'wa-float--in' : ''}`}>
      <div className={`wa-float__bubble ${showBubble ? 'wa-float__bubble--show' : ''}`}>
        <button
          type="button"
          className="wa-float__bubble-close"
          aria-label="Dismiss"
          onClick={() => setShowBubble(false)}
        >
          ×
        </button>
        <strong>ATTICARCH</strong>
        <span>Hi there 👋 Planning your interiors? Chat with us on WhatsApp.</span>
      </div>

      <a
        href={`https://wa.me/${WHATSAPP_NUM}?text=${encodeURIComponent(WHATSAPP_MSG)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="wa-float__btn"
        aria-label="Chat with ATTICARCH on WhatsApp"
      >
        <span className="wa-float__ring" />
        <span className="wa-float__label">Chat with us</span>
        <span className="wa-float__icon">
          <svg viewBox="0 0 32 32" width="28" height="28" fill="currentColor" aria-hidden="true">
            <path d="M16.04 3C9.4 3 4 8.36 4 14.95c0 2.1.56 4.16 1.62 5.97L4 27l6.26-1.63a12.1 12.1 0 0 0 5.77 1.46h.01c6.63 0 12.03-5.36 12.03-11.95C28.07 8.36 22.67 3 16.04 3Zm0 21.82h-.01a10.1 10.1 0 0 1-5.12-1.4l-.37-.22-3.71.97.99-3.6-.24-.37a9.85 9.85 0 0 1-1.53-5.25c0-5.48 4.49-9.94 10-9.94 2.67 0 5.18 1.03 7.07 2.91a9.82 9.82 0 0 1 2.93 7.04c0 5.48-4.5 9.86-10.01 9.86Zm5.49-7.4c-.3-.15-1.78-.87-2.05-.97-.28-.1-.48-.15-.68.15-.2.3-.78.97-.95 1.17-.18.2-.35.22-.65.07-.3-.15-1.27-.46-2.42-1.48-.9-.79-1.5-1.77-1.67-2.07-.18-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.68-1.62-.93-2.22-.24-.58-.49-.5-.68-.51l-.58-.01c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48 0 1.47 1.07 2.88 1.22 3.08.15.2 2.11 3.2 5.1 4.49.71.3 1.27.49 1.7.63.72.23 1.37.2 1.88.12.58-.09 1.78-.72 2.03-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35Z" />
          </svg>
        </span>
      </a>
    </div>
  )
}
