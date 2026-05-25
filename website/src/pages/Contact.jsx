import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { 
  Phone, Mail, MapPin, Send, MessageCircle, Check, 
  ChevronRight, ChevronLeft, ShieldCheck, Clock, Award, Sparkles, AlertCircle
} from 'lucide-react'
import './Contact.css'

function Reveal({ children, delay = 0 }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }} 
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }} 
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      style={{ willChange: 'transform, opacity' }}
    >
      {children}
    </motion.div>
  )
}

export default function Contact() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({ 
    name: '', 
    email: '', 
    phone: '', 
    projectType: '', 
    size: '', 
    budget: '', 
    timeline: '', 
    message: '' 
  })
  
  const [errors, setErrors] = useState({})
  
  // OTP States
  const [otpCode, setOtpCode] = useState('')
  const [generatedOtp, setGeneratedOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [otpVerified, setOtpVerified] = useState(false)
  const [smsNotification, setSmsNotification] = useState(null)
  const [timer, setTimer] = useState(60)
  const [otpError, setOtpError] = useState('')
  
  // Final Submitted state
  const [submitted, setSubmitted] = useState(false)

  // OTP Countdown timer
  useEffect(() => {
    let interval = null
    if (otpSent && timer > 0 && !otpVerified) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1)
      }, 1000)
    } else if (timer === 0) {
      clearInterval(interval)
    }
    return () => clearInterval(interval)
  }, [otpSent, timer, otpVerified])

  const sendOtp = () => {
    if (!form.phone || !/^\d{10}$/.test(form.phone.replace(/\D/g, ''))) {
      setErrors({ ...errors, phone: 'Please enter a valid 10-digit phone number' })
      return
    }
    setErrors({ ...errors, phone: null })
    
    // Generate 4 digit code
    const code = Math.floor(1000 + Math.random() * 9000).toString()
    setGeneratedOtp(code)
    setOtpSent(true)
    setTimer(60)
    setOtpError('')
    setOtpCode('')
    
    // Show simulated SMS notification
    setSmsNotification(`💬 SMS Received: Your ATTICARCH verification code is ${code}. Valid for 10 minutes.`)
    
    // Auto-hide SMS banner after 8 seconds
    setTimeout(() => {
      setSmsNotification(null)
    }, 8500)
  }

  const verifyOtp = () => {
    if (otpCode === generatedOtp) {
      setOtpVerified(true)
      setOtpError('')
      // Automatically advance to step 3 after a brief delay
      setTimeout(() => {
        setStep(3)
      }, 800)
    } else {
      setOtpError('Invalid OTP code. Please try again.')
    }
  }

  const handleNextStep = () => {
    const errs = {}
    if (step === 1) {
      if (!form.name.trim()) errs.name = 'Full name is required'
      if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Valid email is required'
      if (!form.projectType) errs.projectType = 'Please select a project type'
      
      if (Object.keys(errs).length > 0) {
        setErrors(errs)
        return
      }
      setErrors({})
      setStep(2)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!otpVerified) {
      setStep(2)
      setOtpError('Please verify your mobile number first.')
      return
    }
    
    // Final submit logic
    setSubmitted(true)
    // Save to local storage mock leads
    try {
      const saved = JSON.parse(localStorage.getItem('atticarch_leads') || '[]')
      saved.push({ ...form, verified: true, at: new Date().toISOString(), source: 'contact-page' })
      localStorage.setItem('atticarch_leads', JSON.stringify(saved))
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <motion.main className="contact-page-wrapper" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
      <Helmet>
        <title>Book Design Consultation — ATTICARCH Bangalore</title>
        <meta name="description" content="Talk to AtticArch's senior architects. Book a free 3D design consultation, select materials, and receive a complete itemized budget estimate." />
      </Helmet>

      {/* Simulated SMS Notification Popup */}
      <AnimatePresence>
        {smsNotification && (
          <motion.div 
            className="sms-toast-notification"
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            <div className="sms-toast-content">
              <Sparkles size={16} color="var(--gold)" />
              <span>{smsNotification}</span>
              <button className="sms-toast-close" onClick={() => setSmsNotification(null)}>&times;</button>
            </div>
            <div className="sms-toast-progress" />
          </motion.div>
        )}
      </AnimatePresence>

      <section className="contact-hero">
        <div className="contact-hero__bg">
          <div className="contact-hero__orb-1" />
          <div className="contact-hero__orb-2" />
        </div>
        <div className="container contact-hero__inner">
          <Reveal>
            <span className="contact-hero__label">AtticArch Design Studio</span>
            <h1 className="contact-hero__title">
              Let's Create <span className="text-gold">Together</span>
            </h1>
            <p className="contact-hero__subtitle">
              Have a villa, apartment, or commercial space in mind? Step through our interactive planner to request your free 3D layout consultation.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="contact-body-section">
        <div className="container">
          <div className="contact-grid">
            
            {/* Left: Detailed Information & Process Highlights */}
            <div className="contact-info-col">
              <Reveal>
                <div className="contact-info-card">
                  <h2 className="info-title">Why Consult With Us?</h2>
                  <p className="info-desc">
                    Every AtticArch space starts with a collaborative brief. Over a cup of tea, we will map out your functional requirements, layout possibilities, and material choices.
                  </p>
                  
                  <div className="consultation-framework">
                    <div className="framework-item">
                      <div className="framework-icon"><Check size={14} /></div>
                      <div>
                        <h4>1. Detailed Style Assessment</h4>
                        <p>We review your design preferences, color palettes, and family requirements to draft a bespoke aesthetic profile.</p>
                      </div>
                    </div>
                    <div className="framework-item">
                      <div className="framework-icon"><Check size={14} /></div>
                      <div>
                        <h4>2. Free 3D Layout Blueprint</h4>
                        <p>Get photo-real, multi-view 3D layouts showing exactly how your cabinetry, ceilings, and lights will sit.</p>
                      </div>
                    </div>
                    <div className="framework-item">
                      <div className="framework-icon"><Check size={14} /></div>
                      <div>
                        <h4>3. Material Sampling Session</h4>
                        <p>Feel physical samples of Hettich sliding sets, CenturyPly panels, Blum hinges, and premium finishes in our meeting.</p>
                      </div>
                    </div>
                    <div className="framework-item">
                      <div className="framework-icon"><Check size={14} /></div>
                      <div>
                        <h4>4. Fully Itemized BOQ Quote</h4>
                        <p>Receive a completely transparent billing sheet with zero hidden margins. What we quote is what you pay.</p>
                      </div>
                    </div>
                  </div>

                  <div className="quick-contacts-row">
                    <a href="tel:09845013138" className="quick-contact-link">
                      <Phone size={16} />
                      <div>
                        <span className="label">Call Studio</span>
                        <span className="val">98450 13138</span>
                      </div>
                    </a>
                    <a href="mailto:info@atticarch.com" className="quick-contact-link">
                      <Mail size={16} />
                      <div>
                        <span className="label">Email Enquiries</span>
                        <span className="val">info@atticarch.com</span>
                      </div>
                    </a>
                  </div>

                  <div className="map-embed-wrapper">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d248849.84916296526!2d77.6309395!3d12.9539974!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1670c9b44e6d%3A0xf8dfc3e8517e4fe0!2sBengaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1"
                      width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"
                      title="ATTICARCH Location map"
                    />
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Right: Premium Multi-step Form Card */}
            <div className="contact-form-col">
              <Reveal delay={0.15}>
                <div className="contact-form-card glass-panel">
                  
                  {/* Step Indicators */}
                  <div className="form-steps-header">
                    <div className="steps-progress-track">
                      <div className="steps-progress-fill" style={{ width: `${((step - 1) / 2) * 100}%` }} />
                    </div>
                    {[1, 2, 3].map((s) => (
                      <button 
                        key={s} 
                        className={`step-dot ${s === step ? 'active' : ''} ${s < step || submitted ? 'completed' : ''}`}
                        onClick={() => {
                          if (submitted) return
                          if (s < step) setStep(s)
                        }}
                        disabled={s > step || submitted}
                        aria-label={`Go to step ${s}`}
                      >
                        {s < step || submitted ? <Check size={12} /> : s}
                      </button>
                    ))}
                  </div>

                  <div className="step-labels-row">
                    <span>1. Basic Info</span>
                    <span>2. OTP Verify</span>
                    <span>3. Project Details</span>
                  </div>

                  <AnimatePresence mode="wait">
                    {submitted ? (
                      <motion.div 
                        key="success-state"
                        className="form-success-wrapper"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <div className="success-icon-badge"><Check size={36} /></div>
                        <h3>Consultation Booked!</h3>
                        <p>We've successfully verified your phone number and recorded your project details.</p>
                        
                        <div className="receipt-box">
                          <div className="receipt-line"><span>Name:</span> <strong>{form.name}</strong></div>
                          <div className="receipt-line"><span>Verified Mobile:</span> <strong>{form.phone}</strong></div>
                          <div className="receipt-line"><span>Space Type:</span> <strong>{form.projectType}</strong></div>
                          {form.size && <div className="receipt-line"><span>Approx. Size:</span> <strong>{form.size} sq.ft</strong></div>}
                        </div>
                        
                        <p className="success-hint">Our senior designer will contact you within 2 hours to confirm your meeting slot.</p>
                        
                        <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 24 }}>
                          <MessageCircle size={16} /> Continue on WhatsApp
                        </a>
                      </motion.div>
                    ) : (
                      <form onSubmit={handleSubmit} className="planner-form">
                        
                        {/* STEP 1: Basic Info */}
                        {step === 1 && (
                          <motion.div 
                            key="step1" 
                            className="form-step-content"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.35 }}
                          >
                            <h3 className="step-title">Let's start with the basics</h3>
                            <p className="step-subtitle">Introduce yourself and tell us what type of space you are planning.</p>

                            <div className="form-group-wrap">
                              <div className="form-group">
                                <label>Your Full Name <span>*</span></label>
                                <input 
                                  type="text" 
                                  placeholder="Enter your name" 
                                  value={form.name} 
                                  onChange={e => setForm({ ...form, name: e.target.value })} 
                                  required 
                                />
                                {errors.name && <span className="error-text">{errors.name}</span>}
                              </div>

                              <div className="form-group">
                                <label>Email Address <span>*</span></label>
                                <input 
                                  type="email" 
                                  placeholder="name@example.com" 
                                  value={form.email} 
                                  onChange={e => setForm({ ...form, email: e.target.value })} 
                                  required 
                                />
                                {errors.email && <span className="error-text">{errors.email}</span>}
                              </div>

                              <div className="form-group">
                                <label>Property / Project Type <span>*</span></label>
                                <select 
                                  value={form.projectType} 
                                  onChange={e => setForm({ ...form, projectType: e.target.value })}
                                  required
                                >
                                  <option value="">Select type...</option>
                                  <option value="Apartment Interior">Apartment Interior</option>
                                  <option value="Villa Interior">Villa Interior</option>
                                  <option value="Commercial Interior">Commercial Interior</option>
                                  <option value="Renovation & Refurbishment">Renovation & Refurbishment</option>
                                  <option value="Modular Kitchen / Wardrobes">Modular Kitchen / Wardrobes</option>
                                  <option value="Other">Other</option>
                                </select>
                                {errors.projectType && <span className="error-text">{errors.projectType}</span>}
                              </div>

                              <div className="form-group">
                                <label>Approximate Area Size (Optional)</label>
                                <input 
                                  type="text" 
                                  placeholder="e.g. 1800 sq.ft" 
                                  value={form.size} 
                                  onChange={e => setForm({ ...form, size: e.target.value })} 
                                />
                              </div>
                            </div>

                            <button type="button" onClick={handleNextStep} className="btn btn-primary step-next-btn">
                              Next: Verify Mobile <ChevronRight size={16} />
                            </button>
                          </motion.div>
                        )}

                        {/* STEP 2: Mobile OTP Verification */}
                        {step === 2 && (
                          <motion.div 
                            key="step2" 
                            className="form-step-content"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.35 }}
                          >
                            <h3 className="step-title">Verify Phone Number</h3>
                            <p className="step-subtitle">To prevent spam bookings, we verify your phone number via a quick OTP.</p>

                            <div className="form-group-wrap">
                              <div className="form-group">
                                <label>10-Digit Mobile Number <span>*</span></label>
                                <div className="phone-input-row">
                                  <div className="prefix">+91</div>
                                  <input 
                                    type="tel" 
                                    placeholder="Enter mobile number" 
                                    value={form.phone} 
                                    onChange={e => setForm({ ...form, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })} 
                                    disabled={otpVerified || otpSent}
                                    required 
                                  />
                                  {!otpVerified && (
                                    <button 
                                      type="button" 
                                      className="btn-otp-action"
                                      onClick={sendOtp}
                                      disabled={form.phone.length !== 10}
                                    >
                                      {otpSent ? 'Resend' : 'Send Code'}
                                    </button>
                                  )}
                                </div>
                                {errors.phone && <span className="error-text">{errors.phone}</span>}
                              </div>

                              {otpSent && !otpVerified && (
                                <motion.div 
                                  className="otp-entry-box"
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                >
                                  <label>Enter 4-Digit Verification Code</label>
                                  <div className="otp-verify-row">
                                    <input 
                                      type="text" 
                                      placeholder="0 0 0 0" 
                                      maxLength={4}
                                      value={otpCode}
                                      onChange={e => setOtpCode(e.target.value.replace(/\D/g, ''))}
                                      className="otp-code-input text-mono"
                                    />
                                    <button 
                                      type="button" 
                                      className="btn-verify-submit"
                                      onClick={verifyOtp}
                                      disabled={otpCode.length !== 4}
                                    >
                                      Verify Code
                                    </button>
                                  </div>
                                  
                                  {otpError && (
                                    <div className="otp-alert-message text-red">
                                      <AlertCircle size={14} /> <span>{otpError}</span>
                                    </div>
                                  )}

                                  <div className="otp-timer-row">
                                    {timer > 0 ? (
                                      <span>Resend code in <strong>{timer}s</strong></span>
                                    ) : (
                                      <button type="button" className="lnk-resend" onClick={sendOtp}>Resend code now</button>
                                    )}
                                  </div>
                                </motion.div>
                              )}

                              {otpVerified && (
                                <motion.div 
                                  className="otp-verified-badge"
                                  initial={{ scale: 0.9, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                >
                                  <div className="icon-wrap"><Check size={16} /></div>
                                  <span>Mobile Verified Successfully</span>
                                </motion.div>
                              )}
                            </div>

                            <div className="step-navigation-row">
                              <button type="button" onClick={() => setStep(1)} className="btn-back">
                                <ChevronLeft size={14} /> Back
                              </button>
                              
                              <button 
                                type="button" 
                                onClick={() => setStep(3)} 
                                className="btn btn-primary"
                                disabled={!otpVerified}
                              >
                                Next Step <ChevronRight size={16} />
                              </button>
                            </div>
                          </motion.div>
                        )}

                        {/* STEP 3: Budget & Preferences */}
                        {step === 3 && (
                          <motion.div 
                            key="step3" 
                            className="form-step-content"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.35 }}
                          >
                            <h3 className="step-title">Budget & Timeline</h3>
                            <p className="step-subtitle">Help us align with your parameters to prepare options beforehand.</p>

                            <div className="form-group-wrap">
                              <div className="form-group">
                                <label>Expected Budget Range</label>
                                <select 
                                  value={form.budget} 
                                  onChange={e => setForm({ ...form, budget: e.target.value })}
                                >
                                  <option value="">Select range...</option>
                                  <option value="Under 4 Lacs">Under 4 Lacs</option>
                                  <option value="4-6 Lacs">4-6 Lacs</option>
                                  <option value="6-10 Lacs">6-10 Lacs</option>
                                  <option value="10-18 Lacs">10-18 Lacs</option>
                                  <option value="18 Lacs+">18 Lacs+</option>
                                </select>
                              </div>

                              <div className="form-group">
                                <label>Required Timeline</label>
                                <select 
                                  value={form.timeline} 
                                  onChange={e => setForm({ ...form, timeline: e.target.value })}
                                >
                                  <option value="">Select timeline...</option>
                                  <option value="Immediate (Within 30 days)">Immediate (Within 30 days)</option>
                                  <option value="1 to 3 Months">1 to 3 Months</option>
                                  <option value="3+ Months out">3+ Months out</option>
                                </select>
                              </div>

                              <div className="form-group">
                                <label>Message / Special Requirements</label>
                                <textarea 
                                  placeholder="Tell us details about your project, styling preferences, or configurations..." 
                                  rows={4}
                                  value={form.message} 
                                  onChange={e => setForm({ ...form, message: e.target.value })}
                                />
                              </div>
                            </div>

                            <div className="step-navigation-row">
                              <button type="button" onClick={() => setStep(2)} className="btn-back">
                                <ChevronLeft size={14} /> Back
                              </button>
                              
                              <button 
                                type="submit" 
                                className="btn btn-primary submit-finish-btn"
                                disabled={!otpVerified}
                              >
                                Book Consultation <Send size={15} />
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
