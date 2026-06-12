import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { useLocation, Link } from 'react-router-dom'

const h2 = { fontSize: 'var(--text-2xl)', color: 'var(--charcoal)', margin: '32px 0 16px' }
const h2First = { fontSize: 'var(--text-2xl)', color: 'var(--charcoal)', marginBottom: 16 }

function PrivacyBody() {
  return (
    <>
      <h2 className="text-heading" style={h2First}>Information We Collect</h2>
      <p>ATTICARCH ("we," "us," or "our") operates the website atticarch.com. This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service.</p>
      <p style={{ marginTop: 16 }}>We collect information you provide directly to us, such as when you fill out a contact form, request a consultation, or communicate with us. This may include your name, email address, phone number, and project details.</p>
      <h2 className="text-heading" style={h2}>How We Use Your Information</h2>
      <p>We use the information we collect to provide, maintain, and improve our services, to communicate with you about projects and consultations, and to send you updates about our services (with your consent).</p>
      <h2 className="text-heading" style={h2}>Contact Us</h2>
      <p>If you have any questions about this Privacy Policy, please contact us at sales@atticarch.com or call 98450 13138.</p>
    </>
  )
}

function TermsBody() {
  return (
    <>
      <h2 className="text-heading" style={h2First}>Acceptance of Terms</h2>
      <p>By accessing or using atticarch.com, you agree to be bound by these Terms of Use. If you do not agree with any part of these terms, please do not use our website.</p>
      <h2 className="text-heading" style={h2}>Use of the Website</h2>
      <p>The content on this website — including project imagery, designs, text, and branding — is the property of ATTICARCH and is provided for your personal, non-commercial reference only. You may not reproduce, distribute, or use any material without our prior written consent.</p>
      <h2 className="text-heading" style={h2}>Consultations & Quotes</h2>
      <p>Any estimates, timelines, or quotes shared via this website or a consultation are indicative and subject to a final scope of work. Pricing ranges shown are starting points and may vary based on site conditions, material selections, and customization.</p>
      <h2 className="text-heading" style={h2}>Limitation of Liability</h2>
      <p>ATTICARCH is not liable for any indirect or consequential loss arising from the use of this website. We strive for accuracy but do not warrant that all content is error-free or current at all times.</p>
      <h2 className="text-heading" style={h2}>Contact Us</h2>
      <p>Questions about these Terms? Email sales@atticarch.com or call 98450 13138.</p>
    </>
  )
}

function SitemapBody() {
  const groups = [
    {
      heading: 'Main Pages',
      links: [
        { to: '/', label: 'Home' },
        { to: '/about-us', label: 'About Us' },
        { to: '/how-we-work', label: 'How We Work' },
        { to: '/services', label: 'Services' },
        { to: '/blog', label: 'Blog' },
        { to: '/contact-us', label: 'Contact Us' },
      ],
    },
    {
      heading: 'Portfolio',
      links: [
        { to: '/project-category/projects-apartments', label: 'Apartment Projects' },
        { to: '/project-category/projects-apartments?sub=villas', label: 'Villa Projects' },
        { to: '/project-category/projects-commercial', label: 'Commercial Projects' },
        { to: '/project-category/projects-renovation', label: 'Renovation Projects' },
      ],
    },
    {
      heading: 'Room Interiors',
      links: [
        { to: '/kitchen-interior-designers', label: 'Kitchen' },
        { to: '/living-room', label: 'Living Room' },
        { to: '/bedrooms', label: 'Bedrooms' },
        { to: '/foyer', label: 'Foyer' },
        { to: '/dining-room', label: 'Dining Room' },
        { to: '/kids-bedroom', label: 'Kids Bedroom' },
        { to: '/bathrooms', label: 'Bathrooms' },
        { to: '/balcony', label: 'Balcony' },
      ],
    },
    {
      heading: 'Legal',
      links: [
        { to: '/privacy-policy', label: 'Privacy Policy' },
        { to: '/terms-of-use', label: 'Terms of Use' },
      ],
    },
  ]

  return (
    <>
      <h2 className="text-heading" style={h2First}>Site Structure</h2>
      <p>Explore everything on atticarch.com. Use the links below to jump straight to any section of the site.</p>
      {groups.map((g) => (
        <div key={g.heading} style={{ marginTop: 28 }}>
          <h3 className="text-heading" style={{ fontSize: 'var(--text-xl)', color: 'var(--charcoal)', marginBottom: 10 }}>{g.heading}</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexWrap: 'wrap', gap: '8px 24px' }}>
            {g.links.map((l) => (
              <li key={l.to}>
                <Link to={l.to} style={{ color: 'var(--gold-dark)', textDecoration: 'none' }}>{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </>
  )
}

export default function PrivacyPolicy() {
  const location = useLocation()
  const isTerms = location.pathname.includes('terms')
  const isSitemap = location.pathname.includes('sitemap')
  const title = isSitemap ? 'Sitemap' : isTerms ? 'Terms of Use' : 'Privacy Policy'

  return (
    <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <Helmet>
        <title>{title} — ATTICARCH</title>
        <meta name="description" content={`${title} — ATTICARCH Bangalore interior design studio.`} />
      </Helmet>
      <section style={{ background: 'var(--charcoal)', padding: '180px 0 80px' }}>
        <div className="container">
          <h1 className="text-display" style={{ fontSize: 'var(--text-5xl)', color: 'var(--warm-white)' }}>{title}</h1>
        </div>
      </section>
      <section className="section">
        <div className="container" style={{ maxWidth: 800 }}>
          <div style={{ color: 'var(--ash)', lineHeight: 1.9 }}>
            {isSitemap ? <SitemapBody /> : isTerms ? <TermsBody /> : <PrivacyBody />}
            {!isSitemap && (
              <p style={{ marginTop: 32, fontSize: 13, color: 'var(--mist)' }}>Last updated: January 2024</p>
            )}
          </div>
        </div>
      </section>
    </motion.main>
  )
}
