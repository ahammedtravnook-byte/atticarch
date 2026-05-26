import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Phone, ChevronDown } from 'lucide-react'
import { useData } from '../../context/DataContext'
import './Header.css'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState(null)
  const location = useLocation()
  const { categories } = useData()

  const dynamicNavItems = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about-us', children: [
      { label: 'About Us', path: '/about-us' },
      { label: 'Our Services', path: '/services' },
      { label: 'How We Work', path: '/how-we-work' },
    ]},
    {
      label: 'Portfolio',
      path: categories.length ? `/project-category/${categories[0].slug}` : '/project-category/projects-apartments',
      children: categories.map(cat => ({
        label: cat.short,
        path: `/project-category/${cat.slug}`
      }))
    },
    { label: 'Blog', path: '/blog' },
    { label: 'Contact', path: '/contact-us' },
  ]

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
            {dynamicNavItems.map((item) => (
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
            <Link to="/contact-us" className="btn btn-primary header__cta hide-mobile">
              Free Consultation
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
              {dynamicNavItems.map((item) => (
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
              <Link to="/contact-us" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                Free Consultation
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
