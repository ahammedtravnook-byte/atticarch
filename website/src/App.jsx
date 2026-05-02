import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import Preloader from './components/layout/Preloader'
import SmoothScroll from './components/layout/SmoothScroll'
import Home from './pages/Home'
import About from './pages/About'
import HowWeWork from './pages/HowWeWork'
import Services from './pages/Services'
import Contact from './pages/Contact'
import EstimateCalculator from './pages/EstimateCalculator'
import ProjectCategory from './pages/ProjectCategory'
import ProjectDetail from './pages/ProjectDetail'
import RoomType from './pages/RoomType'
import Blog from './pages/Blog'
import LandingPage from './pages/LandingPage'
import PrivacyPolicy from './pages/PrivacyPolicy'
import AdminPanel from './pages/admin/AdminPanel'
import './App.css'



export default function App() {
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')
  const isLanding = location.pathname === '/get-free-consultation'

  return (
    <div className="app grain-overlay">
      <Preloader />
      <SmoothScroll />
      {!isAdmin && !isLanding && <Header />}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/about-us" element={<About />} />
          <Route path="/how-we-work" element={<HowWeWork />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:slug" element={<Services />} />
          <Route path="/contact-us" element={<Contact />} />
          <Route path="/estimate" element={<EstimateCalculator />} />
          <Route path="/project-category/:category" element={<ProjectCategory />} />
          <Route path="/project/:slug" element={<ProjectDetail />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<Blog />} />
          <Route path="/get-free-consultation" element={<LandingPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-use" element={<PrivacyPolicy />} />
          <Route path="/sitemap" element={<PrivacyPolicy />} />
          <Route path="/admin/*" element={<AdminPanel />} />
          {/* SEO Room Pages */}
          <Route path="/kitchen-interior-designers" element={<RoomType />} />
          <Route path="/living-room" element={<RoomType />} />
          <Route path="/bedrooms" element={<RoomType />} />
          <Route path="/foyer" element={<RoomType />} />
          <Route path="/dining-room" element={<RoomType />} />
          <Route path="/kids-bedroom" element={<RoomType />} />
          <Route path="/bathrooms" element={<RoomType />} />
          <Route path="/balcony" element={<RoomType />} />
        </Routes>
      </AnimatePresence>
      {!isAdmin && !isLanding && <Footer />}
    </div>
  )
}
