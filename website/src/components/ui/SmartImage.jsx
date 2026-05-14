import { useState } from 'react'
import './SmartImage.css'

/**
 * Image with a shimmer skeleton placeholder.
 * Fades the photo in once decoded. Use `tone="dark"` on dark backgrounds.
 */
export default function SmartImage({
  src,
  alt = '',
  className = '',
  tone = 'light',
  eager = false,
  style,
  ...rest
}) {
  const [loaded, setLoaded] = useState(false)

  return (
    <span
      className={`smart-img smart-img--${tone} ${loaded ? 'is-loaded' : ''} ${className}`}
      style={style}
    >
      <span className="smart-img__skeleton" aria-hidden="true" />
      <img
        src={src}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
        {...rest}
      />
    </span>
  )
}
