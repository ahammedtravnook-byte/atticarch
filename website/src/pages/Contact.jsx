import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import {
  Phone, Mail, MapPin, Send, MessageCircle, Check,
  ChevronRight, ChevronLeft, AlertCircle,
  Shield, Star, Home, Loader2
} from 'lucide-react'
import { submitLead } from '../lib/submitLead'
import Captcha from '../components/Captcha'
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

export default function Contact() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    projectType: '', size: '', possession: '', location: '', budget: '', message: ''
  })
  const [errors, setErrors] = useState({})

  // Anti-spam: built-in CAPTCHA (solved flag) + hidden honeypot field
  const [captchaOk, setCaptchaOk] = useState(false)
  const [honeypot, setHoneypot] = useState('')
  const [formError, setFormError] = useState('')

  // Submit states
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

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

  // ── Final submit → guarded Netlify function (CAPTCHA + IP rate-limit) ──
  const handleSubmit = async (e) => {
    e.preventDefault()
    const cleanPhone = form.phone.replace(/\D/g, '')
    if (cleanPhone.length !== 10) {
      setErrors(er => ({ ...er, phone: 'Please enter a valid 10-digit mobile number' }))
      return
    }
    if (!captchaOk) {
      setFormError('Please enter the verification code shown below to continue.')
      return
    }

    setSubmitting(true)
    setSubmitError('')
    setFormError('')

    try {
      await submitLead({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: cleanPhone,
        projectType: form.projectType,
        size: form.size || '',
        possession: form.possession || '',
        location: form.location || '',
        budget: form.budget || '',
        message: form.message || '',
        source: 'contact-page',
        company: honeypot,
      })
      setSubmitted(true)
    } catch (err) {
      console.error('Submit error:', err)
      if (err.code === 'rate-limited') {
        setSubmitError(err.message || 'Too many submissions. Please try again later.')
      } else {
        setSubmitError('Failed to submit. Please try again or call us directly.')
      }
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
                { icon: <Star size={16} />, text: '4.5★ Google Rating' },
                { icon: <Home size={16} />, text: '1000+ Homes Delivered' },
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
                    <span className={step >= 2 ? 'active' : ''}>Confirm &amp; Book</span>
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
                        <p>We've recorded your project details. Our team will reach out to confirm.</p>

                        <div className="ct-receipt">
                          <div className="ct-receipt__row"><span>Name</span><strong>{form.name}</strong></div>
                          <div className="ct-receipt__row"><span>Mobile</span><strong>+91 {form.phone}</strong></div>
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
                                  <option value="20 - 30 Lakhs">20 - 30 Lakhs</option>
                                  <option value="Over 30 Lakhs">Over 30 Lakhs</option>
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
                              Next: Contact Number <ChevronRight size={15} />
                            </button>
                          </motion.div>
                        )}

                        {/* STEP 2 — Contact number + CAPTCHA */}
                        {step === 2 && (
                          <motion.div key="s2" className="ct-step-content" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                            <h4 className="ct-step-heading">Your Contact Number</h4>
                            <p className="ct-step-sub">Add your mobile number and confirm you're human — our team will call you back to confirm.</p>

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
                                      if (errors.phone) setErrors(er => ({ ...er, phone: null }))
                                    }}
                                  />
                                </div>
                                {errors.phone && <span className="ct-err">{errors.phone}</span>}
                              </div>

                              {/* Honeypot — hidden from humans; bots that fill it are dropped */}
                              <input
                                type="text" tabIndex={-1} autoComplete="off" aria-hidden="true"
                                value={honeypot}
                                onChange={e => setHoneypot(e.target.value)}
                                style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }}
                              />

                              <div className="ct-field ct-captcha">
                                <label>Verification <span>*</span></label>
                                <Captcha onValidChange={setCaptchaOk} />
                              </div>

                              <div className="ct-trust-note">
                                <Shield size={14} /> <span>Protected against spam. We never share your details.</span>
                              </div>
                            </div>

                            {formError && <div className="ct-otp-err" style={{ marginTop: 12 }}><AlertCircle size={13} /> {formError}</div>}
                            {submitError && <div className="ct-otp-err" style={{ marginTop: 12 }}><AlertCircle size={13} /> {submitError}</div>}

                            <div className="ct-nav-row">
                              <button type="button" className="ct-back" onClick={() => setStep(1)}>
                                <ChevronLeft size={14} /> Back
                              </button>
                              <button type="submit" className="ct-btn ct-btn--primary" disabled={submitting || !captchaOk}>
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
