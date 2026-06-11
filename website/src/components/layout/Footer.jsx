import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Phone, Mail, MapPin, ArrowUpRight } from 'lucide-react'
import { FaInstagram, FaYoutube, FaFacebook, FaLinkedin, FaTwitter } from 'react-icons/fa'
import logoSrc from '../../assets/logo.png'
import './Footer.css'

export default function Footer() {
  return (
    <motion.footer 
      className="footer"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.05 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      style={{ willChange: 'transform, opacity' }}
    >
      <div className="footer__waves">
        <svg className="waves" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 24 150 28" preserveAspectRatio="none" shapeRendering="auto">
          <defs>
            <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
          </defs>
          <g className="parallax">
            <use xlinkHref="#gentle-wave" x="48" y="0" fill="rgba(201, 169, 110, 0.7)" />
            <use xlinkHref="#gentle-wave" x="48" y="3" fill="rgba(201, 169, 110, 0.5)" />
            <use xlinkHref="#gentle-wave" x="48" y="5" fill="rgba(201, 169, 110, 0.3)" />
            <use xlinkHref="#gentle-wave" x="48" y="7" fill="var(--gold-dark)" />
          </g>
        </svg>
      </div>

      <div className="footer__cta-band">
        <div className="container">
          <div className="footer__cta-inner">
            <div>
              <h2 className="text-display" style={{ fontSize: 'var(--text-4xl)', color: 'var(--charcoal)' }}>
                Transform Your Space Today
              </h2>
              <p style={{ color: 'rgba(26,26,26,0.8)', marginTop: 8, fontSize: '15px', fontWeight: 500 }}>Book your free design consultation with our experts</p>
            </div>
            <Link to="/contact-us" className="btn btn-dark" style={{ background: 'var(--charcoal)', color: 'var(--gold)' }}>
              Get Free Consultation <ArrowUpRight size={18} />
            </Link>
          </div>
        </div>
      </div>

      <div className="footer__main">
        <div className="container">
          <div className="footer__grid">
            <div className="footer__brand">
              <img src={logoSrc} alt="AtticArch" style={{ height: 44, marginBottom: 16, display: 'block' }} />
              <p className="footer__desc">
                ATTICARCH is Bangalore's trusted interior design studio since 2002 — crafting homes,
                workspaces and renovations through an in-house atelier built around considered detail
                and slow, supervised craft.
              </p>
              <div className="footer__social">
                <a href="https://www.facebook.com/atticarch" target="_blank" rel="noopener noreferrer"><FaFacebook size={18} /></a>
                <a href="https://www.instagram.com/atticarch2020/" target="_blank" rel="noopener noreferrer"><FaInstagram size={18} /></a>
                <a href="https://www.youtube.com/channel/UCYGM6iXNjQVNfW8Klw_oRWA" target="_blank" rel="noopener noreferrer"><FaYoutube size={18} /></a>
                <a href="https://www.linkedin.com/company/atticarch/" target="_blank" rel="noopener noreferrer"><FaLinkedin size={18} /></a>
                <a href="https://twitter.com/ATTICARCH1" target="_blank" rel="noopener noreferrer"><FaTwitter size={18} /></a>
              </div>
            </div>

            <div className="footer__col">
              <h4 className="footer__heading">Services</h4>
              <Link to="/services">Residential Interiors</Link>
              <Link to="/services">Commercial Spaces</Link>
              <Link to="/services">Renovation & Refurbishment</Link>
              <Link to="/services">Modular Kitchens</Link>
              <Link to="/services">Wardrobes & Storage</Link>
              <Link to="/services">False Ceiling & Lighting</Link>
            </div>

            <div className="footer__col">
              <h4 className="footer__heading">Quick Links</h4>
              <Link to="/about-us">About Us</Link>
              <Link to="/how-we-work">How We Work</Link>
              <Link to="/blog">Blog</Link>
              <Link to="/contact-us">Free Consultation</Link>
              <Link to="/contact-us">Contact Us</Link>
              <Link to="/sitemap">Sitemap</Link>
            </div>

            <div className="footer__col">
              <h4 className="footer__heading">Interiors</h4>
              <Link to="/kitchen-interior-designers">Kitchen</Link>
              <Link to="/living-room">Living Room</Link>
              <Link to="/bedrooms">Bedrooms</Link>
              <Link to="/foyer">Foyer</Link>
              <Link to="/dining-room">Dining Room</Link>
              <Link to="/bathrooms">Bathrooms</Link>
              <Link to="/balcony">Balcony</Link>
            </div>

            <div className="footer__col">
              <h4 className="footer__heading">Contact</h4>
              <a href="tel:09845013138" className="footer__contact-item"><Phone size={14} /> 98450 13138</a>
              <a href="mailto:sales@atticarch.com" className="footer__contact-item"><Mail size={14} /> sales@atticarch.com</a>
              <div className="footer__contact-item"><MapPin size={14} /> #12, 3rd Floor, 10th Main, Outer Ring Rd, Banaswadi, Bengaluru, Karnataka 560043</div>
            </div>
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        <div className="container">
          <div className="footer__bottom-inner">
            <p>&copy; {new Date().getFullYear()} ATTICARCH. All rights reserved.</p>
            <div className="footer__legal">
              <Link to="/privacy-policy">Privacy Policy</Link>
              <Link to="/terms-of-use">Terms of Use</Link>
            </div>
          </div>
        </div>
      </div>
    </motion.footer>
  )
}
