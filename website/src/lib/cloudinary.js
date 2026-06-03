/**
 * Cloudinary URL builder + uploader.
 * No SDK needed — Cloudinary URLs follow a predictable shape.
 */

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

const BASE = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload`

/**
 * Build a transformed Cloudinary URL.
 *   cld('atticarch/projects/villa-1', { w: 1920, q: 'auto', f: 'auto' })
 *   → https://res.cloudinary.com/dwuagshuj/image/upload/f_auto,q_auto,w_1920/atticarch/projects/villa-1
 *
 * Accepts either a public_id ("atticarch/projects/villa-1") OR a full URL
 * (returns it as-is if it isn't a Cloudinary URL — so legacy local imports
 *  keep working during migration).
 */
export function cld(publicIdOrUrl, opts = {}) {
  if (!publicIdOrUrl) return ''

  // If it's a non-cloudinary URL or local import, return as-is
  if (
    typeof publicIdOrUrl === 'string' &&
    (publicIdOrUrl.startsWith('http') || publicIdOrUrl.startsWith('/') || publicIdOrUrl.startsWith('data:')) &&
    !publicIdOrUrl.includes('res.cloudinary.com')
  ) {
    return publicIdOrUrl
  }

  // If it's already a full Cloudinary URL, extract the public_id
  let publicId = publicIdOrUrl
  if (publicId.includes('res.cloudinary.com')) {
    const m = publicId.match(/\/upload\/(?:[^/]+\/)*v?\d*\/?(.+)$/)
    publicId = m ? m[1].replace(/\.[a-z0-9]+$/i, '') : publicId
  }

  const {
    w,
    h,
    q = 'auto',
    f = 'auto',
    c = 'fill',
    g = 'auto',
    dpr,
    blur,
  } = opts

  const tx = []
  tx.push(`f_${f}`)
  tx.push(`q_${q}`)
  if (w) tx.push(`w_${w}`)
  if (h) tx.push(`h_${h}`)
  if (w || h) {
    tx.push(`c_${c}`)
    if (c === 'fill' || c === 'fill_pad' || c === 'lfill') tx.push(`g_${g}`)
  }
  if (dpr) tx.push(`dpr_${dpr}`)
  if (blur) tx.push(`e_blur:${blur}`)

  return `${BASE}/${tx.join(',')}/${publicId}`
}

/** Tiny base64 blur placeholder URL — perfect for LQIP. */
export function cldBlur(publicId, w = 40) {
  return cld(publicId, { w, q: 1, blur: 1000 })
}

/**
 * Build a responsive srcSet string covering common breakpoints.
 *   srcSet('atticarch/projects/villa-1', [400, 800, 1200, 1920])
 */
export function cldSrcSet(publicId, widths = [400, 800, 1200, 1600, 2000]) {
  return widths
    .map((w) => `${cld(publicId, { w })} ${w}w`)
    .join(', ')
}

/**
 * Compress + resize an image in the browser before upload — mirrors what
 * scripts/optimize-images.js does on the server (max 1920px wide, WebP ~0.82),
 * so admin uploads never push huge originals to Cloudinary.
 *
 * Falls back to the original File for non-images, GIF/SVG (animation/vector),
 * any decode error, or if compression wouldn't actually shrink the file.
 */
export async function compressImage(file, { maxWidth = 1920, quality = 0.82 } = {}) {
  if (!file || !file.type?.startsWith('image/')) return file
  if (file.type === 'image/gif' || file.type === 'image/svg+xml') return file

  try {
    const bitmap = await createImageBitmap(file)
    const scale = Math.min(1, maxWidth / bitmap.width)
    const w = Math.max(1, Math.round(bitmap.width * scale))
    const h = Math.max(1, Math.round(bitmap.height * scale))

    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')
    ctx.drawImage(bitmap, 0, 0, w, h)
    bitmap.close?.()

    const blob = await new Promise((res) => canvas.toBlob(res, 'image/webp', quality))
    if (!blob || blob.size >= file.size) return file // no gain — keep original

    const name = file.name.replace(/\.[^.]+$/, '') + '.webp'
    return new File([blob], name, { type: 'image/webp', lastModified: Date.now() })
  } catch {
    return file
  }
}

/**
 * Upload a File to Cloudinary using the unsigned preset.
 * Used by admin UI image upload zones. The image is auto-compressed first.
 *
 *   const { secure_url, public_id } = await uploadToCloudinary(file, 'atticarch/projects')
 */
export async function uploadToCloudinary(file, folder = 'atticarch/misc', onProgress) {
  file = await compressImage(file)
  const form = new FormData()
  form.append('file', file)
  form.append('upload_preset', UPLOAD_PRESET)
  form.append('folder', folder)

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`)

    if (onProgress) {
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100))
      })
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const res = JSON.parse(xhr.responseText)
        resolve({
          url: res.secure_url,
          publicId: res.public_id,
          width: res.width,
          height: res.height,
          format: res.format,
          bytes: res.bytes,
        })
      } else {
        reject(new Error(`Upload failed: ${xhr.statusText}`))
      }
    }
    xhr.onerror = () => reject(new Error('Upload network error'))
    xhr.send(form)
  })
}

export const CLOUDINARY_FOLDERS = {
  projects: 'atticarch/projects',
  hero: 'atticarch/hero',
  rooms: 'atticarch/rooms',
  blog: 'atticarch/blog',
  misc: 'atticarch/misc',
}
