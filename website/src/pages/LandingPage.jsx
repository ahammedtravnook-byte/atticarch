import { useState } from 'react'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { Phone, Send, Star, Check, Shield, Clock, Award, MessageCircle } from 'lucide-react'
import { stats } from '../data/siteData'
import heroImg from '../assets/images/hero-living.png'
import kitchenImg from '../assets/images/kitchen.png'
import villaImg from '../assets/images/villa.png'

export default function LandingPage() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', type: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => { e.preventDefault(); setSubmitted(true) }

  const benefits = [
    { icon: Award, text: '22+ Years of Experience' },
    { icon: Shield, text: '500+ Projects Delivered' },
    { icon: Clock, text: '3-Month Warranty After Handover' },
    { icon: Star, text: '100% Client Satisfaction' },
  ]

  return (
    <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Helmet><title>Free Interior Design Consultation — ATTICARCH Bangalore</title></Helmet>

      {/* Advanced Floating Hero + Form */}
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', padding: '160px 0 80px', overflow: 'hidden', background: 'var(--charcoal)' }}>
        {/* Animated Background Image */}
        <motion.div 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.6 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          style={{ position: 'absolute', inset: 0, zIndex: 0 }}
        >
          <img src={heroImg} alt="Luxury Interior" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(26,26,26,0.95) 0%, rgba(26,26,26,0.7) 100%)' }} />
        </motion.div>

        {/* Floating Decorative Elements */}
        <motion.div
          animate={{ y: [0, -30, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          style={{ position: 'absolute', top: '10%', right: '5%', width: 300, height: 300, background: 'var(--gold-glow)', borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%', filter: 'blur(40px)', zIndex: 1 }}
        />
        <motion.div
          animate={{ y: [0, 40, 0], x: [0, -20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          style={{ position: 'absolute', bottom: '10%', left: '10%', width: 200, height: 200, background: 'rgba(201, 169, 110, 0.1)', borderRadius: '50%', filter: 'blur(30px)', zIndex: 1 }}
        />

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 60, alignItems: 'center' }}>
            <motion.div
              initial={{ x: -60, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h1 className="text-display" style={{ fontSize: 'var(--text-6xl)', color: 'var(--warm-white)', marginBottom: 16, lineHeight: 1.1, textShadow: '0 4px 32px rgba(0,0,0,0.5)' }}>
                Experience <span className="text-gradient">Luxury</span><br />
                Interior Design
              </h1>
              <p style={{ color: 'var(--silver)', fontSize: 'var(--text-lg)', lineHeight: 1.7, marginBottom: 32, maxWidth: 500, textShadow: '0 2px 16px rgba(0,0,0,0.5)' }}>
                Book a <strong style={{ color: 'var(--gold)' }}>FREE design consultation</strong> with Bangalore's most trusted interior design firm. Transform your space today.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                {benefits.map((b, i) => (
                  <motion.div key={i} whileHover={{ x: 5 }} style={{ display: 'flex', gap: 12, alignItems: 'center', background: 'rgba(255,255,255,0.03)', padding: '12px 16px', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ background: 'var(--gold-glow)', padding: 8, borderRadius: 'var(--radius-full)' }}>
                      <b.icon size={16} color="var(--gold)" />
                    </div>
                    <span style={{ color: 'var(--silver)', fontSize: 13, fontWeight: 500 }}>{b.text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ x: 60, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              style={{ background: 'rgba(254, 252, 249, 0.95)', backdropFilter: 'blur(20px)', borderRadius: 'var(--radius-xl)', padding: 40, boxShadow: 'var(--shadow-xl)', border: '1px solid var(--pearl)' }}
            >
              <h2 className="text-heading" style={{ fontSize: 'var(--text-3xl)', marginBottom: 8, color: 'var(--charcoal)' }}>
                Book Free Consultation
              </h2>
              <p style={{ color: 'var(--ash)', fontSize: 13, marginBottom: 32 }}>Our expert will call you within 30 minutes to discuss your dream space.</p>

              {submitted ? (
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ textAlign: 'center', padding: '40px 0' }}>
                  <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--gold-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                    <Check size={28} color="var(--gold)" />
                  </div>
                  <h3 className="text-heading" style={{ fontSize: 'var(--text-2xl)' }}>Thank You!</h3>
                  <p style={{ color: 'var(--ash)', marginTop: 8, fontSize: 15 }}>We'll call you within 30 minutes.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <input type="text" placeholder="Your Name *" required value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                    style={{ width: '100%', padding: '16px 20px', border: '1px solid var(--pearl)', borderRadius: 'var(--radius-full)', background: 'var(--cream)', fontSize: 14, outline: 'none', transition: 'border 0.3s' }} 
                    onFocus={(e) => e.target.style.borderColor = 'var(--gold)'} onBlur={(e) => e.target.style.borderColor = 'var(--pearl)'} />
                  <input type="tel" placeholder="Phone Number *" required value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
                    style={{ width: '100%', padding: '16px 20px', border: '1px solid var(--pearl)', borderRadius: 'var(--radius-full)', background: 'var(--cream)', fontSize: 14, outline: 'none', transition: 'border 0.3s' }} 
                    onFocus={(e) => e.target.style.borderColor = 'var(--gold)'} onBlur={(e) => e.target.style.borderColor = 'var(--pearl)'} />
                  <input type="email" placeholder="Email Address" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                    style={{ width: '100%', padding: '16px 20px', border: '1px solid var(--pearl)', borderRadius: 'var(--radius-full)', background: 'var(--cream)', fontSize: 14, outline: 'none', transition: 'border 0.3s' }} 
                    onFocus={(e) => e.target.style.borderColor = 'var(--gold)'} onBlur={(e) => e.target.style.borderColor = 'var(--pearl)'} />
                  <select value={form.type} onChange={e => setForm({...form, type: e.target.value})}
                    style={{ width: '100%', padding: '16px 20px', border: '1px solid var(--pearl)', borderRadius: 'var(--radius-full)', background: 'var(--cream)', fontSize: 14, color: 'var(--smoke)', outline: 'none', transition: 'border 0.3s' }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--gold)'} onBlur={(e) => e.target.style.borderColor = 'var(--pearl)'}>
                    <option value="">Select Project Type</option>
                    <option>Apartment Interior</option>
                    <option>Villa Interior</option>
                    <option>Commercial Space</option>
                    <option>Renovation</option>
                  </select>
                  <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '18px', borderRadius: 'var(--radius-full)', marginTop: 8 }}>
                    <Send size={16} /> Get Free Consultation
                  </button>
                  <p style={{ fontSize: 11, color: 'var(--mist)', textAlign: 'center', marginTop: 4 }}>🔒 Your information is 100% secure with us</p>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Before/After */}
      <section className="section" style={{ textAlign: 'center' }}>
        <div className="container">
          <h2 className="section-title">Our Recent Transformations</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginTop: 40 }}>
            {[heroImg, kitchenImg, villaImg].map((img, i) => (
              <motion.div key={i} style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', aspectRatio: '4/3' }}
                initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.8, delay: i * 0.15 }}>
                <img src={img} alt={`Project ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sticky CTA */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'var(--charcoal)', padding: '12px 0', zIndex: 100, borderTop: '1px solid rgba(201,169,110,0.2)' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: 'var(--warm-white)', fontSize: 14 }}>📞 Get your <strong style={{ color: 'var(--gold)' }}>FREE</strong> consultation today!</span>
          <div style={{ display: 'flex', gap: 12 }}>
            <a href="tel:09845013138" className="btn btn-primary" style={{ padding: '10px 20px', fontSize: 12 }}>
              <Phone size={14} /> Call Now
            </a>
            <a href="https://api.whatsapp.com/send?phone=919845013138" className="btn btn-outline" style={{ padding: '10px 20px', fontSize: 12 }} target="_blank" rel="noopener noreferrer">
              <MessageCircle size={14} /> WhatsApp
            </a>
          </div>
        </div>
      </div>
    </motion.main>
  )
}
