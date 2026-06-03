import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Phone, ChevronDown } from 'lucide-react'
import { useData } from '../../context/DataContext'
import logoSrc from '../../assets/logo.png'
import './Header.css'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState(null)
  const location = useLocation()
  const { categories, navSettings } = useData()

  const aboutChildren = [
    { label: 'About Us', path: '/about-us' },
    { label: 'Our Services', path: '/services' },
    { label: 'How We Work', path: '/how-we-work' },
  ]

  const portfolioBase = categories.length ? `/project-category/${categories[0].slug}` : '/project-category/projects-apartments'
  // Each category becomes a group; its subcategories nest beneath it
  const portfolioGroups = categories.map((cat) => ({
    label: cat.short,
    path: `/project-category/${cat.slug}`,
    subItems: (cat.subcategories || []).map((sc) => ({
      label: sc.short || sc.title,
      path: `/project-category/${cat.slug}?sub=${sc.slug}`,
    })),
  }))

  const dynamicNavItems = (navSettings?.items || [])
    .filter((i) => i.visible !== false)
    .slice()
    .sort((a, b) => (a.order || 0) - (b.order || 0))
    .map((i) => {
      if (i.key === 'about') return { ...i, children: aboutChildren }
      if (i.key === 'portfolio') return { ...i, path: portfolioBase, groups: portfolioGroups }
      return i
    })

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
          <Link to="/" className="header__logo">
            <img src={logoSrc} alt="AtticArch" className="header__logo-img" />
          </Link>

          <nav className="header__nav hide-mobile">
            {dynamicNavItems.map((item) => {
              const hasMenu = item.children || (item.groups && item.groups.length)
              return (
                <div
                  key={item.key || item.label}
                  className="header__nav-item"
                  onMouseEnter={() => hasMenu && setActiveDropdown(item.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link to={item.path} className={`header__nav-link ${location.pathname === item.path ? 'active' : ''}`}>
                    {item.label}
                    {hasMenu && <ChevronDown size={14} />}
                  </Link>
                  <AnimatePresence>
                    {hasMenu && activeDropdown === item.label && (
                      <motion.div
                        className="header__dropdown"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                      >
                        {item.groups
                          ? item.groups.map((g) => (
                              <div key={g.path} className="header__dropdown-cat">
                                <Link to={g.path} className="header__dropdown-link header__dropdown-catlink">
                                  <span>{g.label}</span>
                                  {g.subItems.length > 0 && <ChevronDown size={13} className="header__dropdown-caret" />}
                                </Link>
                                {g.subItems.length > 0 && (
                                  <div className="header__flyout">
                                    {g.subItems.map((s) => (
                                      <Link key={s.path} to={s.path} className="header__dropdown-link">{s.label}</Link>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))
                          : item.children.map((child) => (
                              <Link key={child.path} to={child.path} className="header__dropdown-link">
                                {child.label}
                              </Link>
                            ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
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
              <img src={logoSrc} alt="AtticArch" style={{ height: 36 }} />
              <button onClick={() => setMobileOpen(false)}><X size={28} /></button>
            </div>
            <nav className="mobile-menu__nav">
              {dynamicNavItems.map((item) => (
                <div key={item.key || item.label} className="mobile-menu__group">
                  <Link to={item.path} className="mobile-menu__link">{item.label}</Link>
                  {item.children && item.children.map((child) => (
                    <Link key={child.path} to={child.path} className="mobile-menu__sublink">{child.label}</Link>
                  ))}
                  {item.groups && item.groups.map((g) => (
                    <div key={g.path}>
                      <Link to={g.path} className="mobile-menu__sublink" style={{ fontWeight: 700 }}>{g.label}</Link>
                      {g.subItems.map((s) => (
                        <Link key={s.path} to={s.path} className="mobile-menu__sublink" style={{ paddingLeft: 28, opacity: 0.8 }}>{s.label}</Link>
                      ))}
                    </div>
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
