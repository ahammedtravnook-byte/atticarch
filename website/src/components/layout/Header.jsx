import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Phone, ChevronDown } from 'lucide-react'
import './Header.css'

const navItems = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about-us', children: [
    { label: 'About Us', path: '/about-us' },
    { label: 'How We Work', path: '/how-we-work' },
  ]},
  { label: 'Services', path: '/services', children: [
    { label: 'All Services', path: '/services' },
    { label: 'Home Interior', path: '/services/home-interior-designers' },
    { label: 'Luxury Interior', path: '/services/luxury-interior-designers' },
  ]},
  { label: 'Projects', path: '/project-category/projects-residential', children: [
    { label: 'Residential', path: '/project-category/projects-residential' },
    { label: 'Apartments', path: '/project-category/projects-apartments' },
    { label: 'Villas', path: '/project-category/projects-villas' },
    { label: 'Commercial', path: '/project-category/projects-commercial' },
    { label: 'Renovation', path: '/project-category/projects-renovation' },
  ]},
  { label: 'Blog', path: '/blog' },
  { label: 'Contact', path: '/contact-us' },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState(null)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMobileOpen(false) }, [location])

  return (
    <>
      <motion.header
        className={`header ${scrolled ? 'header--scrolled' : ''}`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="header__inner container">
          <Link to="/" className="header__logo" style={{ textDecoration: 'none' }}>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '24px', fontStyle: 'italic', fontWeight: 600, color: 'var(--gold)', letterSpacing: '0.5px' }}>
              AtticArch
            </span>
          </Link>

          <nav className="header__nav hide-mobile">
            {navItems.map((item) => (
              <div
                key={item.label}
                className="header__nav-item"
                onMouseEnter={() => item.children && setActiveDropdown(item.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link to={item.path} className={`header__nav-link ${location.pathname === item.path ? 'active' : ''}`}>
                  {item.label}
                  {item.children && <ChevronDown size={14} />}
                </Link>
                <AnimatePresence>
                  {item.children && activeDropdown === item.label && (
                    <motion.div
                      className="header__dropdown"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                    >
                      {item.children.map((child) => (
                        <Link key={child.path} to={child.path} className="header__dropdown-link">
                          {child.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </nav>

          <div className="header__actions">
            <a href="tel:09845013138" className="header__phone hide-mobile">
              <Phone size={16} />
              <span>98450 13138</span>
            </a>
            <Link to="/estimate" className="btn btn-primary header__cta hide-mobile">
              Get Estimate
            </Link>
            <button className="header__burger hide-desktop" onClick={() => setMobileOpen(true)}>
              <Menu size={28} />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="mobile-menu"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="mobile-menu__header">
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '24px', fontStyle: 'italic', fontWeight: 600, color: 'var(--gold)' }}>AtticArch</span>
              <button onClick={() => setMobileOpen(false)}><X size={28} /></button>
            </div>
            <nav className="mobile-menu__nav">
              {navItems.map((item) => (
                <div key={item.label} className="mobile-menu__group">
                  <Link to={item.path} className="mobile-menu__link">{item.label}</Link>
                  {item.children && item.children.map((child) => (
                    <Link key={child.path} to={child.path} className="mobile-menu__sublink">{child.label}</Link>
                  ))}
                </div>
              ))}
            </nav>
            <div className="mobile-menu__footer">
              <a href="tel:09845013138" className="btn btn-outline" style={{ width: '100%', justifyContent: 'center' }}>
                <Phone size={16} /> Call Us
              </a>
              <Link to="/estimate" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                Get Estimate
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
