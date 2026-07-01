import { useCallback, useEffect, useRef, useState } from 'react'
import { RefreshCw } from 'lucide-react'
import './Captcha.css'

// Self-contained CAPTCHA — a distorted alphanumeric code drawn on a canvas.
// No external service, no API keys, no cost. The visitor retypes the code to
// prove they're human. Backed on the server by honeypot + IP rate-limiting.

// Ambiguous characters (0/O, 1/I/L) are excluded so it stays easy to read.
const CHARS = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'
const LENGTH = 5

function randomCode() {
  let s = ''
  for (let i = 0; i < LENGTH; i++) s += CHARS[Math.floor(Math.random() * CHARS.length)]
  return s
}

export default function Captcha({ onValidChange }) {
  const [code, setCode] = useState(randomCode)
  const [value, setValue] = useState('')
  const canvasRef = useRef(null)

  const draw = useCallback((text) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const w = canvas.width
    const h = canvas.height
    ctx.clearRect(0, 0, w, h)

    ctx.fillStyle = '#f4efe6'
    ctx.fillRect(0, 0, w, h)

    // distraction lines
    for (let i = 0; i < 5; i++) {
      ctx.strokeStyle = `rgba(160,127,69,${0.15 + Math.random() * 0.25})`
      ctx.beginPath()
      ctx.moveTo(Math.random() * w, Math.random() * h)
      ctx.lineTo(Math.random() * w, Math.random() * h)
      ctx.stroke()
    }

    // characters, each jittered + rotated
    const colors = ['#3c2e16', '#7a5c2e', '#5a4a2a', '#2c2c2c']
    for (let i = 0; i < text.length; i++) {
      const fs = 26 + Math.random() * 8
      ctx.font = `700 ${fs}px Georgia, serif`
      ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)]
      const x = 16 + i * ((w - 24) / text.length)
      const y = h / 2 + 10 + (Math.random() * 8 - 4)
      const angle = Math.random() * 0.5 - 0.25
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(angle)
      ctx.fillText(text[i], 0, 0)
      ctx.restore()
    }

    // speckle noise
    for (let i = 0; i < 28; i++) {
      ctx.fillStyle = `rgba(60,46,22,${Math.random() * 0.4})`
      ctx.fillRect(Math.random() * w, Math.random() * h, 2, 2)
    }
  }, [])

  useEffect(() => {
    draw(code)
  }, [code, draw])

  const refresh = () => {
    setCode(randomCode())
    setValue('')
    if (onValidChange) onValidChange(false)
  }

  const onInput = (e) => {
    const v = e.target.value.toUpperCase().slice(0, LENGTH)
    setValue(v)
    if (onValidChange) onValidChange(v === code)
  }

  return (
    <div className="captcha">
      <div className="captcha__challenge">
        <canvas ref={canvasRef} width={150} height={54} className="captcha__canvas" aria-hidden="true" />
        <button type="button" className="captcha__refresh" onClick={refresh} aria-label="Get a new code" title="New code">
          <RefreshCw size={15} />
        </button>
      </div>
      <input
        type="text"
        inputMode="text"
        className="captcha__input"
        placeholder="Type the code shown"
        value={value}
        onChange={onInput}
        autoComplete="off"
        aria-label="Type the characters shown in the image"
      />
    </div>
  )
}
