import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Phone, ChevronDown, ArrowRight } from 'lucide-react'
import { useData } from '../../context/DataContext'
import './Header.css'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState(null)
  const location = useLocation()
  const { categories } = useData()
  const dropdownTimeout = useRef(null)

  const dynamicNavItems = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about-us', children: [
      { label: 'About Us', desc: 'Our story & vision', path: '/about-us' },
      { label: 'Our Services', desc: 'What we offer', path: '/services' },
      { label: 'How We Work', desc: 'Our design process', path: '/how-we-work' },
    ]},
    {
      label: 'Portfolio',
      path: categories.length ? `/project-category/${categories[0].slug}` : '/project-category/projects-apartments',
      children: categories.map(cat => ({
        label: cat.short,
        desc: `View ${cat.short.toLowerCase()} work`,
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

  const handleDropdownEnter = (label) => {
    clearTimeout(dropdownTimeout.current)
    setActiveDropdown(label)
  }

  const handleDropdownLeave = () => {
    dropdownTimeout.current = setTimeout(() => setActiveDropdown(null), 150)
  }

  return (
    <>
      <motion.header
        className={`hdr ${scrolled ? 'hdr--scrolled' : ''}`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="hdr__inner container">
          {/* Logo */}
          <Link to="/" className="hdr__logo">
            <span className="hdr__logo-mark">A</span>
            <div className="hdr__logo-text">
              <span className="hdr__logo-name">AtticArch</span>
              <span className="hdr__logo-tag">Interiors</span>
            </div>
          </Link>

          {/* Center Nav */}
          <nav className="hdr__nav hide-mobile">
            <div className="hdr__nav-track">
              {dynamicNavItems.map((item) => {
                const isActive = location.pathname === item.path ||
                  (item.children && item.children.some(c => location.pathname === c.path))
                return (
                  <div
                    key={item.label}
                    className="hdr__nav-item"
                    onMouseEnter={() => item.children && handleDropdownEnter(item.label)}
                    onMouseLeave={handleDropdownLeave}
                  >
                    <Link
                      to={item.path}
                      className={`hdr__nav-link ${isActive ? 'hdr__nav-link--active' : ''}`}
                    >
                      {item.label}
                      {item.children && <ChevronDown size={12} className="hdr__nav-chevron" />}
                    </Link>

                    <AnimatePresence>
                      {item.children && activeDropdown === item.label && (
                        <motion.div
                          className="hdr__dropdown"
                          initial={{ opacity: 0, y: 8, scale: 0.97 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.97 }}
                          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                          onMouseEnter={() => handleDropdownEnter(item.label)}
                          onMouseLeave={handleDropdownLeave}
                        >
                          <div className="hdr__dropdown-inner">
                            {item.children.map((child) => (
                              <Link
                                key={child.path}
                                to={child.path}
                                className={`hdr__dropdown-link ${location.pathname === child.path ? 'hdr__dropdown-link--active' : ''}`}
                              >
                                <span className="hdr__dropdown-label">{child.label}</span>
                                <span className="hdr__dropdown-desc">{child.desc}</span>
                                <ArrowRight size={12} className="hdr__dropdown-arrow" />
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )
              })}
            </div>
          </nav>

          {/* Right Actions */}
          <div className="hdr__actions">
            <a href="tel:09845013138" className="hdr__phone hide-mobile">
              <span className="hdr__phone-icon"><Phone size={14} /></span>
              <span className="hdr__phone-num">98450 13138</span>
            </a>
            <Link to="/contact-us" className="hdr__cta hide-mobile">
              <span>Get Started</span>
              <ArrowRight size={14} />
            </Link>
            <button className="hdr__burger hide-desktop" onClick={() => setMobileOpen(true)}>
              <Menu size={26} />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="mob-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              className="mob-menu"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="mob-menu__header">
                <Link to="/" className="hdr__logo">
                  <span className="hdr__logo-mark">A</span>
                  <div className="hdr__logo-text">
                    <span className="hdr__logo-name">AtticArch</span>
                    <span className="hdr__logo-tag">Interiors</span>
                  </div>
                </Link>
                <button className="mob-menu__close" onClick={() => setMobileOpen(false)}>
                  <X size={24} />
                </button>
              </div>

              <nav className="mob-menu__nav">
                {dynamicNavItems.map((item, i) => (
                  <motion.div
                    key={item.label}
                    className="mob-menu__group"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.06 }}
                  >
                    <Link to={item.path} className="mob-menu__link">
                      <span className="mob-menu__link-idx">{String(i + 1).padStart(2, '0')}</span>
                      {item.label}
                    </Link>
                    {item.children && item.children.map((child) => (
                      <Link key={child.path} to={child.path} className="mob-menu__sublink">
                        {child.label}
                      </Link>
                    ))}
                  </motion.div>
                ))}
              </nav>

              <div className="mob-menu__footer">
                <a href="tel:09845013138" className="mob-menu__phone">
                  <Phone size={16} /> 98450 13138
                </a>
                <Link to="/contact-us" className="mob-menu__cta">
                  Free Consultation <ArrowRight size={16} />
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
