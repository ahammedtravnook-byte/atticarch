import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { useLocation } from 'react-router-dom'

export default function PrivacyPolicy() {
  const location = useLocation()
  const isTerms = location.pathname.includes('terms')
  const isSitemap = location.pathname.includes('sitemap')
  const title = isSitemap ? 'Sitemap' : isTerms ? 'Terms of Use' : 'Privacy Policy'

  return (
    <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <Helmet><title>{title} — ATTICARCH</title></Helmet>
      <section style={{ background: 'var(--charcoal)', padding: '180px 0 80px' }}>
        <div className="container">
          <h1 className="text-display" style={{ fontSize: 'var(--text-5xl)', color: 'var(--warm-white)' }}>{title}</h1>
        </div>
      </section>
      <section className="section">
        <div className="container" style={{ maxWidth: 800 }}>
          <div style={{ color: 'var(--ash)', lineHeight: 1.9 }}>
            <h2 className="text-heading" style={{ fontSize: 'var(--text-2xl)', color: 'var(--charcoal)', marginBottom: 16 }}>
              {isSitemap ? 'Site Structure' : 'Information We Collect'}
            </h2>
            <p>ATTICARCH ("we," "us," or "our") operates the website atticarch.com. This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service.</p>
            <p style={{ marginTop: 16 }}>We collect information you provide directly to us, such as when you fill out a contact form, request a consultation, or communicate with us. This may include your name, email address, phone number, and project details.</p>
            <h2 className="text-heading" style={{ fontSize: 'var(--text-2xl)', color: 'var(--charcoal)', margin: '32px 0 16px' }}>How We Use Your Information</h2>
            <p>We use the information we collect to provide, maintain, and improve our services, to communicate with you about projects and consultations, and to send you updates about our services (with your consent).</p>
            <h2 className="text-heading" style={{ fontSize: 'var(--text-2xl)', color: 'var(--charcoal)', margin: '32px 0 16px' }}>Contact Us</h2>
            <p>If you have any questions about this {title}, please contact us at info@atticarch.com or call 98450 13138.</p>
            <p style={{ marginTop: 32, fontSize: 13, color: 'var(--mist)' }}>Last updated: January 2024</p>
          </div>
        </div>
      </section>
    </motion.main>
  )
}
