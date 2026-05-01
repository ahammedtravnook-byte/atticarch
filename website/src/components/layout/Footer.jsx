import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Phone, Mail, MapPin, ArrowUpRight } from 'lucide-react'
import { FaInstagram, FaYoutube, FaFacebook, FaLinkedin, FaTwitter } from 'react-icons/fa'
import './Footer.css'

export default function Footer() {
  return (
    <motion.footer 
      className="footer"
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
    >
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
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '28px', fontStyle: 'italic', fontWeight: 600, color: 'var(--gold)', marginBottom: 16, letterSpacing: '0.5px' }}>AtticArch</div>
              <p className="footer__desc">
                ATTICARCH is a multi-disciplinary Consultancy Firm providing Architectural, Interior Designing and Project Management services since 2002.
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
              <Link to="/services">Interior Design</Link>
              <Link to="/services">Project Management</Link>
              <Link to="/services">Architectural Consultation</Link>
              <Link to="/services/home-interior-designers">Home Interior</Link>
              <Link to="/services/luxury-interior-designers">Luxury Interior</Link>
            </div>

            <div className="footer__col">
              <h4 className="footer__heading">Quick Links</h4>
              <Link to="/about-us">About Us</Link>
              <Link to="/how-we-work">How We Work</Link>
              <Link to="/blog">Blog</Link>
              <Link to="/estimate">Estimate Calculator</Link>
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
              <a href="mailto:info@atticarch.com" className="footer__contact-item"><Mail size={14} /> info@atticarch.com</a>
              <div className="footer__contact-item"><MapPin size={14} /> Bangalore, Karnataka, India</div>
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
