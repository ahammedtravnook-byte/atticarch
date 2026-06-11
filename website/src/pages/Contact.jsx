import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import {
  Phone, Mail, MapPin, Send, MessageCircle, Check,
  ChevronRight, ChevronLeft, Sparkles, AlertCircle,
  Shield, Star, Home, Loader2
} from 'lucide-react'
import {
  auth, db, doc, setDoc,
  RecaptchaVerifier, signInWithPhoneNumber, signOut as fbSignOut
} from '../lib/firebase'
import './Contact.css'

function Reveal({ children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}

const WHATSAPP_NUM = '919845013138'
const WHATSAPP_MSG = encodeURIComponent("Hi ATTICARCH, I'd like a free interior design consultation.")
const RATE_LIMIT_MAX = 3
const RATE_LIMIT_WINDOW_HRS = 24

export default function Contact() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    projectType: '', size: '', possession: '', location: '', budget: '', message: ''
  })
  const [errors, setErrors] = useState({})

  // OTP states
  const [otpSending, setOtpSending] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [otpVerified, setOtpVerified] = useState(false)
  const [otpCode, setOtpCode] = useState('')
  const [otpError, setOtpError] = useState('')
  const [timer, setTimer] = useState(60)
  const [verifying, setVerifying] = useState(false)
  // True when SMS OTP can't be sent (e.g. Firebase billing not enabled) — we
  // then let the user submit without SMS verification so no lead is lost.
  const [otpUnavailable, setOtpUnavailable] = useState(false)

  // Firebase phone auth
  const confirmationRef = useRef(null)
  const recaptchaRef = useRef(null)

  // Submit states
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  // OTP countdown — keyed off `timer` itself so it re-arms on every resend
  // (a [otpSent]-keyed interval never restarts when sendOtp() resets the timer)
  useEffect(() => {
    if (!otpSent || otpVerified || timer <= 0) return
    const t = setTimeout(() => setTimer(p => p - 1), 1000)
    return () => clearTimeout(t)
  }, [otpSent, otpVerified, timer])

  // Init invisible reCAPTCHA once
  const setupRecaptcha = useCallback(() => {
    if (recaptchaRef.current) return
    recaptchaRef.current = new RecaptchaVerifier(auth, 'recaptcha-container', {
      size: 'invisible',
      callback: () => {},
      'expired-callback': () => { recaptchaRef.current = null }
    })
  }, [])

  // ── Rate limit check: max 3 OTP requests per phone per 24h ──
  // Done client-side via localStorage (NOT a Firestore read) — the leads
  // collection holds customer PII and must stay admin-read-only. Firebase
  // Phone Auth enforces its own server-side abuse limits on top of this.
  const RL_KEY = 'atticarch_otp_attempts'

  const recordOtpAttempt = (phone) => {
    try {
      const now = Date.now()
      const cutoff = now - RATE_LIMIT_WINDOW_HRS * 60 * 60 * 1000
      const list = JSON.parse(localStorage.getItem(RL_KEY) || '[]')
        .filter(a => a.ts >= cutoff)
      list.push({ phone, ts: now })
      localStorage.setItem(RL_KEY, JSON.stringify(list))
    } catch { /* localStorage unavailable — skip */ }
  }

  const checkRateLimit = (phone) => {
    try {
      const cutoff = Date.now() - RATE_LIMIT_WINDOW_HRS * 60 * 60 * 1000
      const count = JSON.parse(localStorage.getItem(RL_KEY) || '[]')
        .filter(a => a.ts >= cutoff && a.phone === phone).length
      return count < RATE_LIMIT_MAX
    } catch {
      return true // localStorage unavailable — don't block the user
    }
  }

  // ── Send real OTP via Firebase Phone Auth ──
  const sendOtp = async () => {
    const cleanPhone = form.phone.replace(/\D/g, '')
    if (cleanPhone.length !== 10) {
      setErrors(e => ({ ...e, phone: 'Please enter a valid 10-digit phone number' }))
      return
    }
    setErrors(e => ({ ...e, phone: null }))
    setOtpError('')
    setOtpSending(true)

    try {
      // Rate limit check before sending OTP
      if (!checkRateLimit(cleanPhone)) {
        setOtpError(`Too many submissions from this number. Please try after ${RATE_LIMIT_WINDOW_HRS} hours.`)
        setOtpSending(false)
        return
      }

      setupRecaptcha()
      const phoneNumber = `+91${cleanPhone}`
      const confirmation = await signInWithPhoneNumber(auth, phoneNumber, recaptchaRef.current)
      confirmationRef.current = confirmation
      recordOtpAttempt(cleanPhone)
      setOtpSent(true)
      setTimer(60)
      setOtpCode('')
    } catch (err) {
      console.error('OTP send error:', err)
      const code = err?.code || ''
      // SMS verification not available on this Firebase project (needs the
      // Blaze plan). Don't block the user — let them submit without OTP.
      if (['auth/billing-not-enabled', 'auth/operation-not-allowed', 'auth/admin-restricted-operation', 'auth/quota-exceeded'].includes(code)) {
        setOtpUnavailable(true)
        setOtpError('')
      } else if (code === 'auth/too-many-requests') {
        setOtpError('Too many OTP requests. Please wait a few minutes and try again.')
      } else if (code === 'auth/invalid-phone-number') {
        setOtpError('Invalid phone number. Please check and try again.')
      } else {
        setOtpError('Failed to send OTP. Please try again.')
      }
      // Tear down the reCAPTCHA widget so a retry can render a fresh one
      // (otherwise Firebase throws "reCAPTCHA has already been rendered").
      try { recaptchaRef.current?.clear() } catch { /* ignore */ }
      recaptchaRef.current = null
    } finally {
      setOtpSending(false)
    }
  }

  // ── Verify OTP code ──
  const verifyOtp = async () => {
    if (!confirmationRef.current) {
      setOtpError('Session expired. Please resend OTP.')
      return
    }
    setVerifying(true)
    setOtpError('')

    try {
      await confirmationRef.current.confirm(otpCode)
      setOtpVerified(true)
    } catch (err) {
      console.error('OTP verify error:', err)
      if (err.code === 'auth/invalid-verification-code') {
        setOtpError('Invalid code. Please check and try again.')
      } else if (err.code === 'auth/code-expired') {
        setOtpError('Code expired. Please resend OTP.')
      } else {
        setOtpError('Verification failed. Please try again.')
      }
    } finally {
      setVerifying(false)
    }
  }

  // ── Step 1 validation ──
  const handleNextStep = () => {
    const errs = {}
    if (!form.projectType) errs.projectType = 'Please select an option'
    if (!form.size.trim()) errs.size = 'Please enter the size'
    if (!form.possession) errs.possession = 'Please select an option'
    if (!form.location.trim()) errs.location = 'Please enter the location'
    if (!form.budget) errs.budget = 'Please select an option'
    if (!form.name.trim()) errs.name = 'Please enter your name'
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Valid email is required'
    if (!form.message.trim()) errs.message = 'Please add a short message'
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setErrors({})
    setStep(2)
  }

  // ── Final submit → Firestore ──
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!otpVerified && !otpUnavailable) { setStep(2); setOtpError('Please verify your mobile number first.'); return }
    if (otpUnavailable && form.phone.replace(/\D/g, '').length !== 10) {
      setStep(2); setOtpError('Please enter a valid 10-digit mobile number.'); return
    }

    setSubmitting(true)
    setSubmitError('')

    try {
      const leadId = `lead_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
      await setDoc(doc(db, 'leads', leadId), {
        id: leadId,
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.replace(/\D/g, ''),
        projectType: form.projectType,
        size: form.size || '',
        possession: form.possession || '',
        location: form.location || '',
        budget: form.budget || '',
        message: form.message || '',
        verified: otpVerified,
        source: 'contact-page',
        createdAt: new Date().toISOString(),
      })

      // Sign out the temporary phone auth user
      try { await fbSignOut(auth) } catch (_) {}

      setSubmitted(true)
    } catch (err) {
      console.error('Submit error:', err)
      setSubmitError('Failed to submit. Please try again or call us directly.')
    } finally {
      setSubmitting(false)
    }
  }

  const projectTypes = ['Apartment', 'Villa', 'Commercial', 'Others']

  return (
    <motion.main className="ct" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
      <Helmet>
        <title>Book Design Consultation — ATTICARCH Bangalore</title>
        <meta name="description" content="Talk to AtticArch's senior architects. Book a free 3D design consultation and receive a complete itemized budget estimate." />
      </Helmet>

      {/* Invisible reCAPTCHA container */}
      <div id="recaptcha-container" />

      {/* ── HERO ── */}
      <section className="ct-hero">
        <div className="ct-hero__bg">
          <div className="ct-hero__orb ct-hero__orb--1" />
          <div className="ct-hero__orb ct-hero__orb--2" />
          <div className="ct-hero__grain" />
        </div>
        <div className="container ct-hero__inner">
          <Reveal>
            <div className="ct-hero__badge">
              <span className="ct-hero__badge-dot" />
              <span>Get in Touch</span>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="ct-hero__title">
              Let's Create<br /><em>Together</em>
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="ct-hero__sub">
              Have a villa, apartment, or commercial space in mind? Step through our interactive
              planner to request your free 3D layout consultation.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="ct-hero__stats">
              {[
                { icon: <Shield size={16} />, text: '10-Year Warranty' },
                { icon: <Star size={16} />, text: '4.8★ Google Rating' },
                { icon: <Home size={16} />, text: '200+ Homes Delivered' },
              ].map((s, i) => (
                <div key={i} className="ct-hero__stat">
                  {s.icon} <span>{s.text}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── BODY ── */}
      <section className="ct-body">
        <div className="container">
          <div className="ct-grid">

            {/* LEFT — Info */}
            <div className="ct-info">
              <Reveal>
                <h2 className="ct-info__title">Why Consult With Us?</h2>
                <p className="ct-info__desc">
                  Every AtticArch space starts with a collaborative brief. Over a cup of tea,
                  we map out your functional requirements, layout possibilities, and material choices.
                </p>
              </Reveal>

              <Reveal delay={0.1}>
                <div className="ct-contacts">
                  <a href="tel:09845013138" className="ct-contact">
                    <div className="ct-contact__icon"><Phone size={18} /></div>
                    <div>
                      <span className="ct-contact__label">Call Studio</span>
                      <span className="ct-contact__value">98450 13138</span>
                    </div>
                  </a>
                  <a href="mailto:sales@atticarch.com" className="ct-contact">
                    <div className="ct-contact__icon"><Mail size={18} /></div>
                    <div>
                      <span className="ct-contact__label">Email Enquiries</span>
                      <span className="ct-contact__value">sales@atticarch.com</span>
                    </div>
                  </a>
                  <a
                    href="https://maps.google.com/?q=ATTICARCH,+Outer+Ring+Rd,+Banaswadi,+Bengaluru"
                    target="_blank" rel="noopener noreferrer"
                    className="ct-contact ct-contact--address"
                  >
                    <div className="ct-contact__icon"><MapPin size={18} /></div>
                    <div>
                      <span className="ct-contact__label">Visit Studio</span>
                      <span className="ct-contact__value">#12, 3rd Floor, 10th Main, Outer Ring Rd, Banaswadi, Bengaluru 560043</span>
                    </div>
                  </a>
                </div>
              </Reveal>

              <Reveal delay={0.3}>
                <div className="ct-map">
                  <iframe
                    src="https://maps.google.com/maps?q=ATTICARCH%2C%20Outer%20Ring%20Rd%2C%20Banaswadi%2C%20Bengaluru%20560043&ll=13.0132131,77.6485128&z=16&output=embed"
                    width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"
                    title="ATTICARCH Location"
                  />
                </div>
              </Reveal>
            </div>

            {/* RIGHT — Form */}
            <div className="ct-form-col">
              <Reveal delay={0.15}>
                <div className="ct-card">
                  <div className="ct-card__header">
                    <h3 className="ct-card__title">Book Free Consultation</h3>
                    <p className="ct-card__sub">Takes under 2 minutes</p>
                  </div>

                  {/* Progress */}
                  <div className="ct-progress">
                    <div className="ct-progress__track">
                      <div className="ct-progress__fill" style={{ width: `${(step - 1) * 100}%` }} />
                    </div>
                    {[1, 2].map(s => (
                      <button
                        key={s}
                        className={`ct-progress__dot ${s === step ? 'ct-progress__dot--active' : ''} ${s < step || submitted ? 'ct-progress__dot--done' : ''}`}
                        onClick={() => { if (!submitted && s < step) setStep(s) }}
                        disabled={s > step || submitted}
                      >
                        {s < step || submitted ? <Check size={11} /> : s}
                      </button>
                    ))}
                  </div>
                  <div className="ct-progress__labels">
                    <span className={step >= 1 ? 'active' : ''}>Project Details</span>
                    <span className={step >= 2 ? 'active' : ''}>Verify &amp; Book</span>
                  </div>

                  <AnimatePresence mode="wait">
                    {submitted ? (
                      <motion.div
                        key="success"
                        className="ct-success"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <div className="ct-success__icon"><Check size={32} /></div>
                        <h3>Consultation Booked!</h3>
                        <p>We've verified your phone and recorded your project details.</p>

                        <div className="ct-receipt">
                          <div className="ct-receipt__row"><span>Name</span><strong>{form.name}</strong></div>
                          <div className="ct-receipt__row"><span>Verified Mobile</span><strong>+91 {form.phone}</strong></div>
                          <div className="ct-receipt__row"><span>Space Type</span><strong>{form.projectType}</strong></div>
                          {form.size && <div className="ct-receipt__row"><span>Approx. Size</span><strong>{form.size} sq.ft</strong></div>}
                          {form.budget && <div className="ct-receipt__row"><span>Budget</span><strong>{form.budget}</strong></div>}
                        </div>

                        <p className="ct-success__hint">Our senior designer will contact you within 2 hours.</p>

                        <a
                          href={`https://wa.me/${WHATSAPP_NUM}?text=${WHATSAPP_MSG}`}
                          target="_blank" rel="noopener noreferrer"
                          className="ct-btn ct-btn--whatsapp"
                        >
                          <MessageCircle size={16} /> Continue on WhatsApp
                        </a>
                      </motion.div>
                    ) : (
                      <form onSubmit={handleSubmit}>
                        {/* STEP 1 */}
                        {step === 1 && (
                          <motion.div key="s1" className="ct-step-content" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                            <h4 className="ct-step-heading">Let's start with the basics</h4>
                            <p className="ct-step-sub">Introduce yourself and tell us about your space.</p>

                            <div className="ct-fields">
                              <div className="ct-field">
                                <label>Type of Property <span>*</span></label>
                                <select value={form.projectType} onChange={e => setForm({ ...form, projectType: e.target.value })}>
                                  <option value="">Please select an option</option>
                                  {projectTypes.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                                {errors.projectType && <span className="ct-err">{errors.projectType}</span>}
                              </div>
                              <div className="ct-field">
                                <label>Size of Property in Sq.Ft <span>*</span></label>
                                <input type="text" placeholder="Please enter" value={form.size} onChange={e => setForm({ ...form, size: e.target.value })} />
                                {errors.size && <span className="ct-err">{errors.size}</span>}
                              </div>
                              <div className="ct-field">
                                <label>Expected Possession <span>*</span></label>
                                <select value={form.possession} onChange={e => setForm({ ...form, possession: e.target.value })}>
                                  <option value="">Please select an option</option>
                                  <option value="Already in possession">Already in possession</option>
                                  <option value="Within a Month">Within a Month</option>
                                  <option value="Two months or more">Two months or more</option>
                                </select>
                                {errors.possession && <span className="ct-err">{errors.possession}</span>}
                              </div>
                              <div className="ct-field">
                                <label>Location of Property <span>*</span></label>
                                <input type="text" placeholder="Locality in Bangalore" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
                                {errors.location && <span className="ct-err">{errors.location}</span>}
                              </div>
                              <div className="ct-field">
                                <label>Budget <span>*</span></label>
                                <select value={form.budget} onChange={e => setForm({ ...form, budget: e.target.value })}>
                                  <option value="">Please select an option</option>
                                  <option value="10 - 15 Lakhs">10 - 15 Lakhs</option>
                                  <option value="15 - 20 Lakhs">15 - 20 Lakhs</option>
                                  <option value="Over 20 Lakhs">Over 20 Lakhs</option>
                                </select>
                                {errors.budget && <span className="ct-err">{errors.budget}</span>}
                              </div>
                              <div className="ct-field">
                                <label>Name <span>*</span></label>
                                <input type="text" placeholder="Please enter your name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                                {errors.name && <span className="ct-err">{errors.name}</span>}
                              </div>
                              <div className="ct-field">
                                <label>Email <span>*</span></label>
                                <input type="email" placeholder="Enter your email address" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                                {errors.email && <span className="ct-err">{errors.email}</span>}
                              </div>
                              <div className="ct-field">
                                <label>Message <span>*</span></label>
                                <textarea rows={3} placeholder="Please add any details you think it would be useful for us to make a correct estimation." value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
                                {errors.message && <span className="ct-err">{errors.message}</span>}
                              </div>
                            </div>

                            <button type="button" onClick={handleNextStep} className="ct-btn ct-btn--primary ct-btn--full">
                              Next: Verify Mobile <ChevronRight size={15} />
                            </button>
                          </motion.div>
                        )}

                        {/* STEP 2 — Real Firebase OTP */}
                        {step === 2 && (
                          <motion.div key="s2" className="ct-step-content" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                            <h4 className="ct-step-heading">Verify Phone Number</h4>
                            <p className="ct-step-sub">We'll send a real SMS code to verify your number.</p>

                            <div className="ct-fields">
                              <div className="ct-field">
                                <label>Mobile Number <span>*</span></label>
                                <div className="ct-phone-row">
                                  <div className="ct-phone-prefix">+91</div>
                                  <input
                                    type="tel" placeholder="Please Enter your contact number"
                                    value={form.phone}
                                    onChange={e => {
                                      const phone = e.target.value.replace(/\D/g, '').slice(0, 10)
                                      setForm(f => ({ ...f, phone }))
                                      // Editing the number invalidates any in-flight OTP
                                      if (otpSent) { setOtpSent(false); setOtpCode(''); setOtpError(''); confirmationRef.current = null }
                                    }}
                                    disabled={otpVerified}
                                  />
                                  {!otpVerified && !otpUnavailable && (
                                    <button
                                      type="button" className="ct-otp-send"
                                      onClick={sendOtp}
                                      disabled={form.phone.length !== 10 || otpSending}
                                    >
                                      {otpSending ? <Loader2 size={14} className="ct-spin" /> : otpSent ? 'Resend' : 'Send OTP'}
                                    </button>
                                  )}
                                </div>
                                {errors.phone && <span className="ct-err">{errors.phone}</span>}
                              </div>

                              {otpSent && !otpVerified && (
                                <motion.div className="ct-otp-box" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                                  <label>Enter 6-Digit Verification Code</label>
                                  <div className="ct-otp-row">
                                    <input
                                      type="text" placeholder="• • • • • •" maxLength={6}
                                      value={otpCode}
                                      onChange={e => setOtpCode(e.target.value.replace(/\D/g, ''))}
                                      className="ct-otp-input"
                                    />
                                    <button
                                      type="button" className="ct-btn ct-btn--gold"
                                      onClick={verifyOtp}
                                      disabled={otpCode.length !== 6 || verifying}
                                    >
                                      {verifying ? <Loader2 size={14} className="ct-spin" /> : 'Verify'}
                                    </button>
                                  </div>
                                  {otpError && <div className="ct-otp-err"><AlertCircle size={13} /> {otpError}</div>}
                                  <div className="ct-otp-timer">
                                    {timer > 0
                                      ? <>Resend in <strong>{timer}s</strong></>
                                      : <button type="button" className="ct-link" onClick={sendOtp} disabled={otpSending}>Resend code</button>
                                    }
                                  </div>
                                </motion.div>
                              )}

                              {!otpSent && !otpVerified && otpError && (
                                <div className="ct-otp-err"><AlertCircle size={13} /> {otpError}</div>
                              )}

                              {otpVerified && (
                                <motion.div className="ct-verified" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                                  <Check size={15} /> Mobile Verified Successfully
                                </motion.div>
                              )}

                              {otpUnavailable && !otpVerified && (
                                <motion.div className="ct-otp-box" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13, color: 'var(--ash)', lineHeight: 1.5 }}>
                                    <Shield size={15} style={{ color: 'var(--gold)', flexShrink: 0, marginTop: 1 }} />
                                    <span>SMS verification is momentarily unavailable. No problem — just make sure your number is correct and tap <strong>Book Consultation</strong>; our team will call you back to confirm.</span>
                                  </div>
                                </motion.div>
                              )}
                            </div>

                            {submitError && <div className="ct-otp-err" style={{ marginTop: 16 }}><AlertCircle size={13} /> {submitError}</div>}

                            <div className="ct-nav-row">
                              <button type="button" className="ct-back" onClick={() => setStep(1)}>
                                <ChevronLeft size={14} /> Back
                              </button>
                              <button type="submit" className="ct-btn ct-btn--primary" disabled={(!otpVerified && !otpUnavailable) || submitting}>
                                {submitting ? <><Loader2 size={14} className="ct-spin" /> Submitting...</> : <>Book Consultation <Send size={14} /></>}
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </form>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </motion.main>
  )
}
