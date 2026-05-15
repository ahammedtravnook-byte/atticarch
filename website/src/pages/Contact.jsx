import { useState } from 'react'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { Phone, Mail, MapPin, Send, MessageCircle } from 'lucide-react'

function Reveal({ children, delay = 0 }) {
  return (
    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }} transition={{ duration: 0.7, delay, ease: [0.16,1,0.3,1] }}
      style={{ willChange: 'transform, opacity' }}>
      {children}
    </motion.div>
  )
}

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '', projectType: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 4000)
  }

  return (
    <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <Helmet><title>Contact Us — ATTICARCH | Book Free Design Consultation</title></Helmet>

      <section style={{ background: 'var(--charcoal)', padding: '180px 0 100px' }}>
        <div className="container">
          <Reveal>
            <span className="section-label" style={{ color: 'var(--gold-light)' }}>Get In Touch</span>
            <h1 className="text-display" style={{ fontSize: 'var(--text-6xl)', color: 'var(--warm-white)' }}>
              Let's Create <span className="text-gold">Together</span>
            </h1>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 80 }}>
            <Reveal>
              <div>
                <h2 className="text-heading" style={{ fontSize: 'var(--text-3xl)', marginBottom: 24 }}>Contact Information</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 40 }}>
                  <a href="tel:09845013138" style={{ display: 'flex', gap: 16, alignItems: 'center', fontSize: 16, color: 'var(--smoke)' }}>
                    <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--gold-glow)', border: '1px solid var(--gold-lighter)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Phone size={18} color="var(--gold)" />
                    </div>
                    <div><span style={{ fontSize: 12, color: 'var(--ash)' }}>Call Us</span><br /><strong>98450 13138</strong></div>
                  </a>
                  <a href="mailto:info@atticarch.com" style={{ display: 'flex', gap: 16, alignItems: 'center', fontSize: 16, color: 'var(--smoke)' }}>
                    <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--gold-glow)', border: '1px solid var(--gold-lighter)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Mail size={18} color="var(--gold)" />
                    </div>
                    <div><span style={{ fontSize: 12, color: 'var(--ash)' }}>Email Us</span><br /><strong>info@atticarch.com</strong></div>
                  </a>
                  <div style={{ display: 'flex', gap: 16, alignItems: 'center', fontSize: 16, color: 'var(--smoke)' }}>
                    <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--gold-glow)', border: '1px solid var(--gold-lighter)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <MapPin size={18} color="var(--gold)" />
                    </div>
                    <div><span style={{ fontSize: 12, color: 'var(--ash)' }}>Visit Us</span><br /><strong>Bangalore, Karnataka</strong></div>
                  </div>
                </div>

                <a href="https://api.whatsapp.com/send?phone=919845013138" target="_blank" rel="noopener noreferrer"
                  className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  <MessageCircle size={18} /> Chat on WhatsApp
                </a>

                <div style={{ marginTop: 40, borderRadius: 'var(--radius-lg)', overflow: 'hidden', height: 250 }}>
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d248849.84916296526!2d77.6309395!3d12.9539974!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1670c9b44e6d%3A0xf8dfc3e8517e4fe0!2sBengaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1"
                    width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"
                    title="ATTICARCH Location"
                  />
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <div style={{ background: 'var(--warm-white)', borderRadius: 'var(--radius-xl)', padding: 40, border: '1px solid var(--pearl)' }}>
                <h2 className="text-heading" style={{ fontSize: 'var(--text-3xl)', marginBottom: 8 }}>Book Free Consultation</h2>
                <p style={{ color: 'var(--ash)', fontSize: 14, marginBottom: 32 }}>Fill the form below and our design expert will get back to you within 24 hours.</p>

                {submitted ? (
                  <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    style={{ textAlign: 'center', padding: 48 }}>
                    <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--gold-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                      <Send size={24} color="var(--gold)" />
                    </div>
                    <h3 className="text-heading" style={{ fontSize: 'var(--text-xl)' }}>Thank You!</h3>
                    <p style={{ color: 'var(--ash)', marginTop: 8 }}>Our team will get back to you soon.</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    {[
                      { key: 'name', label: 'Full Name', type: 'text', placeholder: 'Enter your name' },
                      { key: 'email', label: 'Email', type: 'email', placeholder: 'your@email.com' },
                      { key: 'phone', label: 'Phone', type: 'tel', placeholder: '+91 XXXXX XXXXX' },
                    ].map(field => (
                      <div key={field.key}>
                        <label style={{ display: 'block', fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ash)', marginBottom: 6, fontFamily: 'var(--font-accent)' }}>{field.label}</label>
                        <input type={field.type} placeholder={field.placeholder} required
                          value={form[field.key]} onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                          style={{ width: '100%', padding: '14px 16px', border: '1px solid var(--pearl)', borderRadius: 'var(--radius-md)', background: 'var(--cream)', fontSize: 14, transition: 'border-color 0.3s' }}
                        />
                      </div>
                    ))}
                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ash)', marginBottom: 6, fontFamily: 'var(--font-accent)' }}>Project Type</label>
                      <select value={form.projectType} onChange={(e) => setForm({ ...form, projectType: e.target.value })}
                        style={{ width: '100%', padding: '14px 16px', border: '1px solid var(--pearl)', borderRadius: 'var(--radius-md)', background: 'var(--cream)', fontSize: 14, color: 'var(--smoke)' }}>
                        <option value="">Select type</option>
                        <option>Apartment Interior</option>
                        <option>Villa Interior</option>
                        <option>Commercial Interior</option>
                        <option>Renovation & Refurbishment</option>
                        <option>Modular Kitchen / Wardrobes</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ash)', marginBottom: 6, fontFamily: 'var(--font-accent)' }}>Message</label>
                      <textarea placeholder="Tell us about your project..." rows={4}
                        value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                        style={{ width: '100%', padding: '14px 16px', border: '1px solid var(--pearl)', borderRadius: 'var(--radius-md)', background: 'var(--cream)', fontSize: 14, resize: 'vertical' }}
                      />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                      Send Enquiry <Send size={16} />
                    </button>
                  </form>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </motion.main>
  )
}
