import { useState, useEffect } from 'react'
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Image as ImageIcon,
  Briefcase,
  FileText,
  MessageSquare,
  Sparkles,
  Video,
  LogOut,
  Plus,
  Trash2,
  Edit,
  ArrowUp,
  ArrowDown,
  Upload,
  Check,
  RotateCcw,
  Layers,
  Loader2,
  Users,
  UserPlus,
  ShieldCheck,
  Navigation,
} from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import { auth, onAuthStateChanged, signInWithEmailAndPassword, signOut, createAuthUser } from '../../lib/firebase'
import { fetchAdminEmails, isAllowedAdmin, addAdminEmail, removeAdminEmail, BOOTSTRAP_ADMINS } from '../../lib/admins'
import { useData } from '../../context/DataContext'
import { uploadToCloudinary, CLOUDINARY_FOLDERS } from '../../lib/cloudinary'
import { parseYouTubeId, youTubeThumb } from '../../lib/youtube'
import logoSrc from '../../assets/logo.png'
import './AdminPanel.css'

function Spinner({ size = 14 }) {
  return <Loader2 size={size} className="admin-spin" />
}

function SaveBtn({ saving, children, ...props }) {
  return (
    <button disabled={saving} {...props}>
      {saving ? <><Spinner /> Saving...</> : children}
    </button>
  )
}

function DeleteBtn({ onDelete, label = 'Delete' }) {
  const [deleting, setDeleting] = useState(false)
  const handleClick = async () => {
    if (!window.confirm(`${label}? This cannot be undone.`)) return
    setDeleting(true)
    try { await onDelete() } catch (e) { alert('Delete failed: ' + e.message) }
    finally { setDeleting(false) }
  }
  return (
    <button onClick={handleClick} disabled={deleting} className="crud-btn crud-btn--danger" title={label}>
      {deleting ? <Spinner size={14} /> : <Trash2 size={16} />}
    </button>
  )
}

export default function AdminPanel() {
  const [authReady, setAuthReady] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentEmail, setCurrentEmail] = useState('')
  const [allowedEmails, setAllowedEmails] = useState([])
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [toast, setToast] = useState(null)

  const navigate = useNavigate()
  const location = useLocation()

  const showToast = (message) => {
    setToast(message)
    setTimeout(() => setToast(null), 3000)
  }

  const refreshAdmins = async () => {
    const list = await fetchAdminEmails()
    setAllowedEmails(list)
    return list
  }

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Authenticated — but only allowlisted emails get in.
        const list = await fetchAdminEmails()
        if (isAllowedAdmin(user.email, list)) {
          setAllowedEmails(list)
          setCurrentEmail(user.email)
          setIsAuthenticated(true)
          setAuthReady(true)
          if (location.pathname === '/admin' || location.pathname === '/admin/') {
            navigate('/admin/dashboard')
          }
        } else {
          // Logged in with a non-admin account — reject and sign out.
          setIsAuthenticated(false)
          setCurrentEmail('')
          setAuthReady(true)
          setError('This account is not authorized for admin access.')
          try { await signOut(auth) } catch { /* ignore */ }
          if (location.pathname !== '/admin') navigate('/admin')
        }
      } else {
        setIsAuthenticated(false)
        setCurrentEmail('')
        setAuthReady(true)
        if (location.pathname !== '/admin') navigate('/admin')
      }
    })
    return () => unsub()
  }, [location.pathname])

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password)
      // Navigation + allowlist enforcement is handled by the auth listener above.
    } catch (err) {
      const code = err?.code || ''
      const msg =
        code === 'auth/invalid-credential' || code === 'auth/wrong-password' || code === 'auth/user-not-found'
          ? 'Invalid email or password.'
          : code === 'auth/too-many-requests'
          ? 'Too many attempts. Try again in a few minutes.'
          : code === 'auth/invalid-email'
          ? 'Please enter a valid email address.'
          : err?.message || 'Login failed.'
      setError(msg)
    } finally {
      setSubmitting(false)
    }
  }

  const handleLogout = async () => {
    await signOut(auth)
    navigate('/admin')
  }

  if (!authReady) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--charcoal)' }}>
        <p style={{ color: 'var(--mist)', fontSize: 14 }}>Loading…</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--charcoal)', padding: 20 }}>
        <Helmet><title>Admin Login — ATTICARCH</title></Helmet>
        <div style={{ background: 'var(--warm-white)', padding: 40, borderRadius: 'var(--radius-xl)', width: '100%', maxWidth: 400, textAlign: 'center' }}>
          <h1 className="text-heading" style={{ fontSize: 'var(--text-3xl)', marginBottom: 8, color: 'var(--charcoal)' }}>Admin Login</h1>
          <p style={{ color: 'var(--ash)', fontSize: 14, marginBottom: 32 }}>Sign in to manage website content</p>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              className="admin-input"
              style={{ background: 'var(--cream)' }}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              className="admin-input"
              style={{ background: 'var(--cream)' }}
              required
            />
            {error && (
              <p style={{ color: '#c0392b', fontSize: 13, margin: 0, textAlign: 'left' }}>{error}</p>
            )}
            <button type="submit" disabled={submitting} className="btn-gold" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}>
              {submitting ? 'Signing in…' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  const menuItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Hero Section', path: '/admin/hero', icon: ImageIcon },
    { label: 'Portfolio & Categories', path: '/admin/portfolio', icon: Briefcase },
    { label: 'About Teaser & Tags', path: '/admin/about', icon: Sparkles },
    { label: 'Testimonials', path: '/admin/testimonials', icon: MessageSquare },
    { label: 'Videos & Social', path: '/admin/videos', icon: Video },
    { label: 'Blog Posts', path: '/admin/blog', icon: FileText },
    { label: 'Landing Page', path: '/admin/landing', icon: Layers },
    { label: 'Navigation', path: '/admin/nav', icon: Navigation },
    { label: 'Admin Users', path: '/admin/users', icon: Users },
  ]

  return (
    <div className="admin-layout">
      <Helmet><title>Admin Panel — ATTICARCH</title></Helmet>
      
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar__logo">
          <img src={logoSrc} alt="AtticArch" style={{ height: 32 }} />
          <span style={{ fontSize: 11, color: 'var(--ash)', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 4 }}>Admin</span>
        </div>
        <nav className="admin-sidebar__nav">
          {menuItems.map(item => {
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`admin-sidebar__link ${isActive ? 'active' : ''}`}
              >
                <item.icon size={18} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>
        <div className="admin-sidebar__footer">
          <button onClick={handleLogout} className="admin-sidebar__link" style={{ width: '100%', color: 'var(--mist)' }}>
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        {toast && (
          <div className="admin-toast">
            <Check size={16} color="var(--gold)" />
            <span>{toast}</span>
          </div>
        )}
        <Routes>
          <Route path="dashboard" element={<DashboardView showToast={showToast} />} />
          <Route path="hero" element={<HeroManager showToast={showToast} />} />
          <Route path="portfolio" element={<PortfolioManager showToast={showToast} />} />
          <Route path="about" element={<AboutTeaserManager showToast={showToast} />} />
          <Route path="testimonials" element={<TestimonialsManager showToast={showToast} />} />
          <Route path="videos" element={<VideosSocialManager showToast={showToast} />} />
          <Route path="blog" element={<BlogManager showToast={showToast} />} />
          <Route path="landing" element={<LandingPageManager showToast={showToast} />} />
          <Route path="nav" element={<NavigationManager showToast={showToast} />} />
          <Route path="users" element={
            <UserManager
              showToast={showToast}
              currentEmail={currentEmail}
              allowedEmails={allowedEmails}
              refreshAdmins={refreshAdmins}
            />
          } />
        </Routes>
      </main>
    </div>
  )
}

/* ──────────────────────────────────────────────────────────
   DASHBOARD VIEW
   ────────────────────────────────────────────────────────── */
function DashboardView({ showToast }) {
  const { projects, blogPosts, testimonials, categories, bootstrapDatabase, loading, dbError, refresh } = useData()
  const [bootstrapping, setBootstrapping] = useState(false)
  const [reloading, setReloading] = useState(false)

  const handleSeed = async () => {
    if (!window.confirm('Do you want to seed default static data to Firestore? This will overwrite or initialize collections.')) return
    setBootstrapping(true)
    try {
      await bootstrapDatabase()
      showToast('Database bootstrapped successfully!')
    } catch (err) {
      alert('Bootstrap failed: ' + err.message)
    } finally {
      setBootstrapping(false)
    }
  }

  const handleReload = async () => {
    setReloading(true)
    try {
      await refresh()
      showToast('Connection refreshed!')
    } catch (err) {
      console.error(err)
    } finally {
      setReloading(false)
    }
  }

  const stats = [
    { label: 'Portfolio Projects', value: projects.length, icon: Briefcase },
    { label: 'Active Categories', value: categories.length, icon: LayoutDashboard },
    { label: 'Client Reviews', value: testimonials.length, icon: MessageSquare },
    { label: 'Blog Posts', value: blogPosts.length, icon: FileText },
  ]

  // Detect empty Firestore collections (if they only hold standard default arrays)
  const isEmpty = projects.length === 0 || blogPosts.length === 0

  return (
    <div>
      <h2 className="text-display" style={{ fontSize: '32px', marginBottom: 8 }}>Dashboard Overview</h2>
      <p style={{ color: 'var(--ash)', marginBottom: 32 }}>Manage your dynamic site content and settings.</p>
      
      {dbError && (
        <div className="error-banner">
          <h4>Firestore Permission Error</h4>
          <p>
            A Firestore operation was blocked by security rules: <strong>{dbError}</strong>.
          </p>
          <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--charcoal)', marginBottom: 6 }}>How to resolve:</div>
          <ol className="error-banner__steps">
            <li>Make sure the project's official security rules (the <strong>firestore.rules</strong> file in the website repo) are deployed — run <code>firebase deploy --only firestore:rules</code> from the project folder, or paste that file's contents into the <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" style={{ color: '#c0392b', fontWeight: 'bold' }}>Firebase Console</a> → Firestore Database → Rules.</li>
            <li>Confirm your login email is in the admin allowlist (the bootstrap list inside firestore.rules, or Settings → Admin Users here) and that your email address is <strong>verified</strong> in Firebase Authentication.</li>
            <li>Never use open rules like <code>allow read, write: if true</code> — that would expose customer leads (names, phones, emails) to the entire internet.</li>
          </ol>
          <button
            type="button"
            onClick={handleReload}
            disabled={reloading}
            className="btn-gold"
            style={{ background: '#e74c3c', color: 'white', marginTop: 8 }}
          >
            {reloading ? 'Testing Connection...' : 'Reload & Verify Connection'}
          </button>
        </div>
      )}

      {isEmpty && !dbError && (
        <div className="bootstrap-banner">

          <div className="bootstrap-banner__text">
            <h4>Seeding Recommended</h4>
            <p>Your Firestore collections are currently empty or unseeded. Seed default data to start customizing.</p>
          </div>
          <button onClick={handleSeed} disabled={bootstrapping || loading} className="btn-gold">
            <RotateCcw size={16} /> {bootstrapping ? 'Seeding…' : 'Seed Default Data'}
          </button>
        </div>
      )}

      <div className="admin-stats">
        {stats.map((s, i) => (
          <div key={i} className="admin-stat-card">
            <div className="admin-stat-icon">
              <s.icon size={22} />
            </div>
            <div>
              <span className="admin-stat-val text-mono">{s.value}</span>
              <p className="admin-stat-lbl">{s.label}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="admin-card">
        <h3 className="admin-card__title">Quick Links</h3>
        <p style={{ color: 'var(--ash)', fontSize: 14 }}>Navigate to common sections to start editing:</p>
        <div style={{ display: 'flex', gap: 16, marginTop: 16 }}>
          <Link to="/admin/hero" className="btn-gold" style={{ textDecoration: 'none' }}>Edit Hero slides</Link>
          <Link to="/admin/portfolio" className="btn-gold" style={{ textDecoration: 'none', background: 'var(--graphite)', color: 'white' }}>Manage Projects</Link>
        </div>
      </div>
    </div>
  )
}

/* ──────────────────────────────────────────────────────────
   HERO MANAGER
   ────────────────────────────────────────────────────────── */
function HeroManager({ showToast }) {
  const { heroSettings, saveHomepageSetting } = useData()
  const [formData, setFormData] = useState(heroSettings)
  const [slides, setSlides] = useState(heroSettings.slides || [])
  const [videos, setVideos] = useState(heroSettings.videos || [])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setFormData(heroSettings)
    setSlides(heroSettings.slides || [])
    setVideos(heroSettings.videos || [])
  }, [heroSettings])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  // ── Popup video tour handlers ──
  const addVideo = () => setVideos((v) => [...v, { url: '', title: '' }])
  const removeVideo = (i) => setVideos((v) => v.filter((_, idx) => idx !== i))
  const changeVideo = (i, field, val) => setVideos((v) => v.map((it, idx) => (idx === i ? { ...it, [field]: val } : it)))
  const moveVideo = (i, dir) => setVideos((v) => {
    const j = i + dir
    if (j < 0 || j >= v.length) return v
    const next = [...v]; [next[i], next[j]] = [next[j], next[i]]; return next
  })

  const handleSaveText = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      // keep only videos with a resolvable YouTube id
      const cleanVideos = videos
        .filter((v) => parseYouTubeId(v.url || v.videoId))
        .map((v) => ({ url: (v.url || v.videoId || '').trim(), title: (v.title || '').trim() }))
      await saveHomepageSetting('hero', { ...formData, slides, videos: cleanVideos })
      showToast('Hero settings saved successfully!')
    } catch (err) {
      alert('Save failed: ' + err.message)
    } finally { setSaving(false) }
  }

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (!files.length) return
    setUploading(true)
    setUploadProgress(0)

    try {
      const newSlides = [...slides]
      let count = 0
      for (const file of files) {
        const res = await uploadToCloudinary(file, CLOUDINARY_FOLDERS.hero)
        newSlides.push({
          imageUrl: res.url,
          publicId: res.publicId
        })
        count++
        setUploadProgress(Math.round((count / files.length) * 100))
      }
      setSlides(newSlides)
      showToast('Image uploaded! Click Save to apply.')
    } catch (err) {
      console.error(err)
      alert('Upload failed: ' + err.message)
    } finally {
      setUploading(false)
    }
  }

  const deleteSlide = (idx) => {
    const next = slides.filter((_, i) => i !== idx)
    setSlides(next)
  }

  const moveSlide = (idx, direction) => {
    if (idx + direction < 0 || idx + direction >= slides.length) return
    const next = [...slides]
    const temp = next[idx]
    next[idx] = next[idx + direction]
    next[idx + direction] = temp
    setSlides(next)
  }

  return (
    <div>
      <h2 className="text-display" style={{ fontSize: '32px', marginBottom: 8 }}>Hero Section Manager</h2>
      <p style={{ color: 'var(--ash)', marginBottom: 32 }}>Manage titles, slides, call-to-actions, and background images.</p>

      <form onSubmit={handleSaveText} className="admin-card">
        <h3 className="admin-card__title">Hero Content Texts</h3>
        
        <div className="admin-form-group">
          <label>Eyebrow Label</label>
          <input type="text" name="eyebrow" className="admin-input" value={formData.eyebrow || ''} onChange={handleInputChange} />
        </div>

        <div className="admin-form-row">
          <div className="admin-form-group">
            <label>Title Line 1</label>
            <input type="text" name="titleLine1" className="admin-input" value={formData.titleLine1 || ''} onChange={handleInputChange} />
          </div>
          <div className="admin-form-group">
            <label>Title Line 2 (supports HTML e.g. &lt;em&gt;Your&lt;/em&gt;)</label>
            <input type="text" name="titleLine2" className="admin-input" value={formData.titleLine2 || ''} onChange={handleInputChange} />
          </div>
        </div>

        <div className="admin-form-group">
          <label>Rotating Headline Sentences — one full sentence per line; use "|" to break a sentence across the two display lines (the part after "|" gets the gold accent style). The hero loops through these every 5 seconds.</label>
          <textarea
            rows={4}
            name="rotatingTitles"
            className="admin-textarea"
            value={formData.rotatingTitles || ''}
            onChange={handleInputChange}
            placeholder={'We Design Homes|That Tell Your Story\nHomes Designed by|Expert Architects\nAward-Winning Interiors|Built In-House Since 2002'}
          />
        </div>

        <div className="admin-form-group">
          <label>Subtitle Paragraph</label>
          <textarea rows={3} name="subtitle" className="admin-textarea" value={formData.subtitle || ''} onChange={handleInputChange} />
        </div>

        <h3 className="admin-card__title" style={{ marginTop: 32 }}>Call-to-Action Controls</h3>
        <div className="admin-form-row">
          <div className="admin-form-group">
            <label>Primary Button Label</label>
            <input type="text" name="primaryCtaText" className="admin-input" value={formData.primaryCtaText || ''} onChange={handleInputChange} />
          </div>
          <div className="admin-form-group">
            <label>Primary Path / Route</label>
            <input type="text" name="primaryCtaPath" className="admin-input" value={formData.primaryCtaPath || ''} onChange={handleInputChange} />
          </div>
        </div>

        <div className="admin-form-row">
          <div className="admin-form-group">
            <label>Secondary Button Label</label>
            <input type="text" name="secondaryCtaText" className="admin-input" value={formData.secondaryCtaText || ''} onChange={handleInputChange} />
          </div>
          <div className="admin-form-group">
            <label>Secondary Path / Route</label>
            <input type="text" name="secondaryCtaPath" className="admin-input" value={formData.secondaryCtaPath || ''} onChange={handleInputChange} />
          </div>
        </div>

        <h3 className="admin-card__title" style={{ marginTop: 32 }}>Transformations Video Link</h3>
        <div className="admin-form-row">
          <div className="admin-form-group">
            <label>Link Caption</label>
            <input type="text" name="ytText" className="admin-input" value={formData.ytText || ''} onChange={handleInputChange} />
          </div>
          <div className="admin-form-group">
            <label>YouTube Channel URL (Subscribe button)</label>
            <input type="text" name="ytUrl" className="admin-input" value={formData.ytUrl || ''} onChange={handleInputChange} />
          </div>
        </div>

        {/* Popup video tours — multiple links */}
        <h3 className="admin-card__title" style={{ marginTop: 32 }}>Popup Video Tours ({videos.length})</h3>
        <p style={{ color: 'var(--ash)', fontSize: 13, margin: '0 0 14px' }}>
          These appear in the “{formData.ytText || 'Watch Our Transformations'}” popup. Paste any YouTube link
          (watch, youtu.be, shorts or embed) — the video ID is detected automatically.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {videos.map((v, i) => {
            const id = parseYouTubeId(v.url || v.videoId)
            return (
              <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center', border: '1px solid var(--pearl)', padding: 10, borderRadius: 10, background: 'rgba(0,0,0,0.01)' }}>
                <div style={{ width: 72, height: 48, borderRadius: 6, overflow: 'hidden', flexShrink: 0, background: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {id ? <img src={youTubeThumb(id)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Video size={16} color="var(--ash)" />}
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <input type="text" className="admin-input" placeholder="YouTube link or ID" value={v.url || v.videoId || ''} onChange={(e) => changeVideo(i, 'url', e.target.value)} style={{ fontSize: 13 }} />
                  <input type="text" className="admin-input" placeholder="Title (e.g. 3BHK Tour — Prestige)" value={v.title || ''} onChange={(e) => changeVideo(i, 'title', e.target.value)} style={{ fontSize: 13 }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <button type="button" onClick={() => moveVideo(i, -1)} disabled={i === 0} className="admin-gallery-btn" style={{ width: 26, height: 22 }}><ArrowUp size={11} /></button>
                  <button type="button" onClick={() => moveVideo(i, 1)} disabled={i === videos.length - 1} className="admin-gallery-btn" style={{ width: 26, height: 22 }}><ArrowDown size={11} /></button>
                </div>
                <button type="button" onClick={() => removeVideo(i)} className="admin-gallery-btn admin-gallery-btn--danger" style={{ width: 30, height: 30, flexShrink: 0 }}><Trash2 size={13} /></button>
              </div>
            )
          })}
        </div>
        <button type="button" onClick={addVideo} className="admin-gallery-btn" style={{ marginTop: 10 }}><Plus size={14} /> Add Video</button>

        <h3 className="admin-card__title" style={{ marginTop: 32 }}>Slideshow Images ({slides.length})</h3>
        
        <div className="upload-zone">
          <Upload size={24} color="var(--ash)" />
          <p style={{ margin: 0, fontSize: 14 }}>Click or drag images here to upload slideshow slides</p>
          <input type="file" accept="image/*" multiple onChange={handleImageUpload} disabled={uploading} />
          {uploading && (
            <div className="upload-progress-bar">
              <div className="upload-progress-fill" style={{ width: `${uploadProgress}%` }} />
            </div>
          )}
        </div>

        <div className="admin-gallery-grid">
          {slides.map((img, i) => (
            <div key={i} className="admin-gallery-item">
              <img src={img.imageUrl} alt="" />
              <div className="admin-gallery-controls">
                <button type="button" onClick={() => moveSlide(i, -1)} className="admin-gallery-btn" disabled={i === 0}>
                  <ArrowUp size={14} />
                </button>
                <button type="button" onClick={() => moveSlide(i, 1)} className="admin-gallery-btn" disabled={i === slides.length - 1}>
                  <ArrowDown size={14} />
                </button>
                <button type="button" onClick={() => deleteSlide(i)} className="admin-gallery-btn admin-gallery-btn--danger">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <SaveBtn saving={saving} type="submit" className="btn-gold" style={{ marginTop: 40 }}>
          Save Hero Settings
        </SaveBtn>
      </form>
    </div>
  )
}

/* ──────────────────────────────────────────────────────────
   PORTFOLIO & CATEGORIES MANAGER
   ────────────────────────────────────────────────────────── */
function PortfolioManager({ showToast }) {
  const { projects, categories, saveProject, deleteProject, saveCategory, deleteCategory } = useData()
  const [subTab, setSubTab] = useState('projects') // projects | categories
  
  // Projects form state
  const [editingProject, setEditingProject] = useState(null)
  const [projectForm, setProjectForm] = useState({ id: '', title: '', category: '', subcategory: '', location: '', year: '', size: '', description: '', image: '', images: [] })

  // Category form state
  const [editingCat, setEditingCat] = useState(null)
  const [catForm, setCatForm] = useState({ id: '', title: '', short: '', slug: '', filter: '', order: 0, subcategories: [] })

  const slugify = (s) => String(s || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [savingProject, setSavingProject] = useState(false)
  const [savingCat, setSavingCat] = useState(false)

  // Project select
  const handleEditProject = (p) => {
    setEditingProject(p ? p.id : 'new')
    setProjectForm(p ? {
      ...p,
      subcategory: p.subcategory || '',
      images: p.images || []
    } : {
      id: '',
      title: '',
      category: categories[0]?.id || '',
      subcategory: '',
      location: '',
      year: new Date().getFullYear().toString(),
      size: '',
      description: '',
      image: '',
      images: []
    })
  }

  // Subcategories belong to the category currently selected in the project form.
  // A category's subcats live on its own doc; a category may aggregate several
  // ids via filter[], so gather subcats from every matching category.
  const subcatsForSelectedCategory = () => {
    const sel = projectForm.category
    const out = []
    categories.forEach((c) => {
      const ids = c.filter && c.filter.length ? c.filter : [c.id]
      if (c.id === sel || ids.includes(sel)) {
        (c.subcategories || []).forEach((s) => {
          if (!out.find((o) => o.slug === s.slug)) out.push(s)
        })
      }
    })
    return out
  }

  const handleProjectSubmit = async (e) => {
    e.preventDefault()
    if (!projectForm.title || !projectForm.category) return
    const id = projectForm.id ? String(projectForm.id) : projectForm.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    
    const itemToSave = {
      ...projectForm,
      id,
      image: projectForm.image || projectForm.images[0] || ''
    }

    setSavingProject(true)
    try {
      await saveProject(itemToSave)
      setEditingProject(null)
      showToast('Project saved!')
    } catch (err) {
      alert('Save failed: ' + err.message)
    } finally { setSavingProject(false) }
  }

  const handleProjImagesUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (!files.length) return
    setUploading(true)
    setUploadProgress(0)

    try {
      const urls = []
      let count = 0
      for (const file of files) {
        const res = await uploadToCloudinary(file, CLOUDINARY_FOLDERS.projects)
        urls.push(res.url)
        count++
        setUploadProgress(Math.round((count / files.length) * 100))
      }
      setProjectForm(prev => ({
        ...prev,
        images: [...(prev.images || []), ...urls],
        image: prev.image || urls[0] || ''
      }))
      showToast('Images added!')
    } catch (err) {
      console.error(err)
      alert('Upload failed: ' + err.message)
    } finally {
      setUploading(false)
    }
  }

  // Category select
  const handleEditCat = (c) => {
    setEditingCat(c ? c.id : 'new')
    setCatForm(c ? {
      ...c,
      filter: c.filter ? c.filter.join(', ') : c.id,
      subcategories: c.subcategories || []
    } : {
      id: '',
      title: '',
      short: '',
      slug: '',
      filter: '',
      order: categories.length + 1,
      subcategories: []
    })
  }

  // ── Subcategory handlers (within the category editor) ──
  const addSubcat = () => setCatForm((f) => ({ ...f, subcategories: [...(f.subcategories || []), { title: '', slug: '', _new: true }] }))
  const removeSubcat = (i) => setCatForm((f) => ({ ...f, subcategories: (f.subcategories || []).filter((_, idx) => idx !== i) }))
  const changeSubcatTitle = (i, title) => setCatForm((f) => {
    const next = [...(f.subcategories || [])]
    // Auto-fill the slug from the title only for rows added this session (or
    // with no slug yet). Renaming an already-saved subcategory must keep its
    // slug, otherwise projects tagged with the old slug stop matching.
    const isNew = next[i]._new || !next[i].slug
    const prevAuto = slugify(next[i].title)
    const slug = (isNew && (!next[i].slug || next[i].slug === prevAuto)) ? slugify(title) : next[i].slug
    next[i] = { ...next[i], title, slug }
    return { ...f, subcategories: next }
  })
  const changeSubcatSlug = (i, slug) => setCatForm((f) => {
    const next = [...(f.subcategories || [])]
    next[i] = { ...next[i], slug: slugify(slug) }
    return { ...f, subcategories: next }
  })

  const handleCatSubmit = async (e) => {
    e.preventDefault()
    if (!catForm.title || !catForm.short) return
    const id = catForm.id ? String(catForm.id) : catForm.short.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    const slug = catForm.slug || `projects-${id}`
    const filterArray = catForm.filter ? catForm.filter.split(',').map(s => s.trim()) : [id]

    // Clean subcategories: drop blanks, ensure each has a slug; the chip label
    // always follows the current title (a stale `short` from before a rename
    // would otherwise keep showing the old name on the category page).
    const subcategories = (catForm.subcategories || [])
      .map((s) => ({ title: (s.title || '').trim(), short: (s.title || '').trim(), slug: slugify(s.slug || s.title) }))
      .filter((s) => s.title && s.slug)

    const itemToSave = {
      ...catForm,
      id,
      slug,
      filter: filterArray,
      order: Number(catForm.order || 0),
      subcategories
    }

    setSavingCat(true)
    try {
      await saveCategory(itemToSave)
      setEditingCat(null)
      showToast('Category saved!')
    } catch (err) {
      alert('Save failed: ' + err.message)
    } finally { setSavingCat(false) }
  }

  return (
    <div>
      <h2 className="text-display" style={{ fontSize: '32px', marginBottom: 8 }}>Portfolio & Categories</h2>
      <p style={{ color: 'var(--ash)', marginBottom: 24 }}>Manage your showcased projects (portfolio) and custom navigation filter subheaders.</p>

      {/* Sub Tabs */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 32 }}>
        <button
          onClick={() => setSubTab('projects')}
          className="btn-gold"
          style={{ background: subTab === 'projects' ? 'var(--gold)' : 'var(--warm-white)', color: 'var(--charcoal)', border: '1px solid var(--pearl)' }}
        >
          Manage Projects
        </button>
        <button
          onClick={() => setSubTab('categories')}
          className="btn-gold"
          style={{ background: subTab === 'categories' ? 'var(--gold)' : 'var(--warm-white)', color: 'var(--charcoal)', border: '1px solid var(--pearl)' }}
        >
          Portfolio Categories
        </button>
      </div>

      {subTab === 'projects' && (
        <div className="admin-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h3 className="admin-card__title" style={{ margin: 0 }}>Showcased Projects</h3>
            <button onClick={() => handleEditProject(null)} className="btn-gold">
              <Plus size={16} /> Add Project
            </button>
          </div>

          <table className="crud-table">
            <thead>
              <tr>
                <th>Cover</th>
                <th>Title</th>
                <th>Category</th>
                <th>Location</th>
                <th>Photos</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map(p => (
                <tr key={p.id}>
                  <td>
                    <img src={p.image} alt="" style={{ width: 44, height: 32, objectFit: 'cover', borderRadius: 4 }} />
                  </td>
                  <td style={{ fontWeight: 600 }}>{p.title}</td>
                  <td style={{ textTransform: 'capitalize' }}>{p.category}</td>
                  <td>{p.location}</td>
                  <td>{p.images?.length || 0} images</td>
                  <td>
                    <div className="crud-actions">
                      <button onClick={() => handleEditProject(p)} className="crud-btn" title="Edit">
                        <Edit size={16} />
                      </button>
                      <DeleteBtn onDelete={() => deleteProject(p.id)} label="Delete project" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {subTab === 'categories' && (
        <div className="admin-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h3 className="admin-card__title" style={{ margin: 0 }}>Subheader Categories</h3>
            <button onClick={() => handleEditCat(null)} className="btn-gold">
              <Plus size={16} /> Add Category
            </button>
          </div>

          <table className="crud-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Short Name</th>
                <th>Slug</th>
                <th>Filter Query</th>
                <th>Sort Order</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map(c => (
                <tr key={c.id}>
                  <td style={{ fontWeight: 600 }}>{c.title}</td>
                  <td>{c.short}</td>
                  <td><code>{c.slug}</code></td>
                  <td>{c.filter ? c.filter.join(', ') : c.id}</td>
                  <td className="text-mono">{c.order}</td>
                  <td>
                    <div className="crud-actions">
                      <button onClick={() => handleEditCat(c)} className="crud-btn" title="Edit">
                        <Edit size={16} />
                      </button>
                      <DeleteBtn onDelete={() => deleteCategory(c.id)} label="Delete category" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────
          PROJECT EDITOR DRAWER PANEL
         ────────────────────────────────────────────────────── */}
      {editingProject && (
        <div className="admin-panel-overlay">
          <div className="admin-side-panel">
            <div className="admin-side-panel__header">
              <h3 style={{ margin: 0 }}>{editingProject === 'new' ? 'Create Portfolio Project' : 'Edit Project'}</h3>
              <button onClick={() => setEditingProject(null)} className="crud-btn"><Trash2 size={18} /></button>
            </div>
            <form onSubmit={handleProjectSubmit} className="admin-side-panel__body">
              <div className="admin-form-group">
                <label>Project Title</label>
                <input
                  type="text"
                  className="admin-input"
                  value={projectForm.title}
                  onChange={e => setProjectForm({...projectForm, title: e.target.value})}
                  required
                />
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Category Tag</label>
                  <select
                    className="admin-select"
                    value={projectForm.category}
                    onChange={e => setProjectForm({...projectForm, category: e.target.value, subcategory: ''})}
                  >
                    {categories.filter(c => c.id !== 'residential').map(c => (
                      <option key={c.id} value={c.id}>{c.short}</option>
                    ))}
                  </select>
                </div>
                <div className="admin-form-group">
                  <label>Subcategory {subcatsForSelectedCategory().length === 0 && <span style={{ textTransform: 'none', color: 'var(--mist)' }}>(none defined)</span>}</label>
                  <select
                    className="admin-select"
                    value={projectForm.subcategory || ''}
                    onChange={e => setProjectForm({...projectForm, subcategory: e.target.value})}
                    disabled={subcatsForSelectedCategory().length === 0}
                  >
                    <option value="">— None —</option>
                    {subcatsForSelectedCategory().map(s => (
                      <option key={s.slug} value={s.slug}>{s.short || s.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="admin-form-group">
                <label>Year Built</label>
                <input
                  type="text"
                  className="admin-input"
                  value={projectForm.year}
                  onChange={e => setProjectForm({...projectForm, year: e.target.value})}
                />
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Location (e.g. Bangalore)</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={projectForm.location}
                    onChange={e => setProjectForm({...projectForm, location: e.target.value})}
                  />
                </div>
                <div className="admin-form-group">
                  <label>Scope Size (e.g. 4500 sq.ft)</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={projectForm.size}
                    onChange={e => setProjectForm({...projectForm, size: e.target.value})}
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label>Description Narrative</label>
                <textarea
                  rows={4}
                  className="admin-textarea"
                  value={projectForm.description}
                  onChange={e => setProjectForm({...projectForm, description: e.target.value})}
                />
              </div>

              <div className="admin-form-group" style={{ marginTop: 24 }}>
                <label>Upload Project Photos</label>
                <div className="upload-zone">
                  <Upload size={20} color="var(--ash)" />
                  <p style={{ margin: 0, fontSize: 13 }}>Click to upload multiple images</p>
                  <input type="file" accept="image/*" multiple onChange={handleProjImagesUpload} disabled={uploading} />
                  {uploading && (
                    <div className="upload-progress-bar">
                      <div className="upload-progress-fill" style={{ width: `${uploadProgress}%` }} />
                    </div>
                  )}
                </div>
              </div>

              <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--ash)', textTransform: 'uppercase' }}>Project Gallery ({projectForm.images?.length || 0} images)</label>
              <div className="admin-gallery-grid">
                {(projectForm.images || []).map((img, i) => {
                  const isCover = projectForm.image === img
                  return (
                    <div key={i} className="admin-gallery-item">
                      <img src={img} alt="" />
                      {isCover && <span className="admin-gallery-cover-badge">Cover</span>}
                      <div className="admin-gallery-controls">
                        <button
                          type="button"
                          onClick={() => setProjectForm({...projectForm, image: img})}
                          className="admin-gallery-btn"
                          title="Set Cover"
                        >
                          <Check size={12} />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const next = [...projectForm.images]
                            if (i > 0) {
                              const tmp = next[i]
                              next[i] = next[i - 1]
                              next[i - 1] = tmp
                              setProjectForm({...projectForm, images: next})
                            }
                          }}
                          className="admin-gallery-btn"
                          disabled={i === 0}
                        >
                          <ArrowUp size={12} />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const next = [...projectForm.images]
                            if (i < next.length - 1) {
                              const tmp = next[i]
                              next[i] = next[i + 1]
                              next[i + 1] = tmp
                              setProjectForm({...projectForm, images: next})
                            }
                          }}
                          className="admin-gallery-btn"
                          disabled={i === projectForm.images.length - 1}
                        >
                          <ArrowDown size={12} />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const next = projectForm.images.filter((_, idx) => idx !== i)
                            const cover = isCover ? next[0] || '' : projectForm.image
                            setProjectForm({...projectForm, images: next, image: cover})
                          }}
                          className="admin-gallery-btn admin-gallery-btn--danger"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 40 }}>
                <button type="button" onClick={() => setEditingProject(null)} className="btn-danger-outline">Cancel</button>
                <SaveBtn saving={savingProject} type="submit" className="btn-gold">Save Project</SaveBtn>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────
          CATEGORY EDITOR DRAWER PANEL
         ────────────────────────────────────────────────────── */}
      {editingCat && (
        <div className="admin-panel-overlay">
          <div className="admin-side-panel" style={{ maxWidth: 450 }}>
            <div className="admin-side-panel__header">
              <h3 style={{ margin: 0 }}>{editingCat === 'new' ? 'Add Portfolio Category' : 'Edit Category'}</h3>
              <button onClick={() => setEditingCat(null)} className="crud-btn"><Trash2 size={18} /></button>
            </div>
            <form onSubmit={handleCatSubmit} className="admin-side-panel__body">
              <div className="admin-form-group">
                <label>Category Title (e.g. Apartment Projects)</label>
                <input
                  type="text"
                  className="admin-input"
                  value={catForm.title}
                  onChange={e => setCatForm({...catForm, title: e.target.value})}
                  required
                />
              </div>

              <div className="admin-form-group">
                <label>Short Name (e.g. Apartments)</label>
                <input
                  type="text"
                  className="admin-input"
                  value={catForm.short}
                  onChange={e => setCatForm({...catForm, short: e.target.value})}
                  required
                />
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Slug Identifier</label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="projects-apartments"
                    value={catForm.slug}
                    onChange={e => setCatForm({...catForm, slug: e.target.value})}
                  />
                </div>
                <div className="admin-form-group">
                  <label>Display Sort Order</label>
                  <input
                    type="number"
                    className="admin-input"
                    value={catForm.order}
                    onChange={e => setCatForm({...catForm, order: e.target.value})}
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label>Filters (comma separated IDs showing inside this category)</label>
                <input
                  type="text"
                  className="admin-input"
                  placeholder="e.g. apartments, villas"
                  value={catForm.filter}
                  onChange={e => setCatForm({...catForm, filter: e.target.value})}
                />
              </div>

              {/* Subcategories */}
              <div className="admin-form-group">
                <label>Subcategories <span style={{ textTransform: 'none', color: 'var(--mist)' }}>(shown as filter chips on the category page)</span></label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {(catForm.subcategories || []).map((s, i) => (
                    <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <input
                        type="text"
                        className="admin-input"
                        placeholder="Name (e.g. 2 BHK)"
                        value={s.title}
                        onChange={e => changeSubcatTitle(i, e.target.value)}
                        style={{ flex: 2 }}
                      />
                      <input
                        type="text"
                        className="admin-input"
                        placeholder="slug"
                        value={s.slug}
                        onChange={e => changeSubcatSlug(i, e.target.value)}
                        style={{ flex: 1 }}
                      />
                      <button type="button" onClick={() => removeSubcat(i)} className="admin-gallery-btn admin-gallery-btn--danger" style={{ width: 32, height: 32, flexShrink: 0 }}>
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
                <button type="button" onClick={addSubcat} className="admin-gallery-btn" style={{ marginTop: 8 }}>
                  <Plus size={14} /> Add Subcategory
                </button>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 40 }}>
                <button type="button" onClick={() => setEditingCat(null)} className="btn-danger-outline">Cancel</button>
                <SaveBtn saving={savingCat} type="submit" className="btn-gold">Save Category</SaveBtn>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

/* ──────────────────────────────────────────────────────────
   ABOUT TEASER & WHAT WE BUILD
   ────────────────────────────────────────────────────────── */
function AboutTeaserManager({ showToast }) {
  const { studioSettings, workTypes, saveHomepageSetting, aboutContent, saveAboutContent } = useData()
  const [aboutForm, setAboutForm] = useState(studioSettings)
  const [chips, setChips] = useState(workTypes)
  const [images, setImages] = useState(studioSettings.images || [])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [savingAbout, setSavingAbout] = useState(false)
  const [savingChips, setSavingChips] = useState(false)

  // About-PAGE content (settings/about) — shown on the /about-us page
  const [pageContent, setPageContent] = useState(aboutContent)
  const [savingPage, setSavingPage] = useState(false)

  useEffect(() => {
    setAboutForm(studioSettings)
    setChips(workTypes)
    setImages(studioSettings.images || [])
  }, [studioSettings, workTypes])

  useEffect(() => { setPageContent(aboutContent) }, [aboutContent])

  // ── About-page content handlers ──
  const pcArr = (key) => Array.isArray(pageContent?.[key]) ? pageContent[key] : []
  const setVision = (val) => setPageContent(p => ({ ...p, visionStatement: val }))
  const setPrinciple = (i, field, val) => setPageContent(p => {
    const next = [...pcArr('principles')]; next[i] = { ...next[i], [field]: val }; return { ...p, principles: next }
  })
  const addPrinciple = () => setPageContent(p => ({ ...p, principles: [...pcArr('principles'), { num: String(pcArr('principles').length + 1).padStart(2, '0'), title: '', desc: '' }] }))
  const removePrinciple = (i) => setPageContent(p => ({ ...p, principles: pcArr('principles').filter((_, idx) => idx !== i) }))
  const setApproach = (i, val) => setPageContent(p => { const next = [...pcArr('approachPoints')]; next[i] = val; return { ...p, approachPoints: next } })
  const addApproach = () => setPageContent(p => ({ ...p, approachPoints: [...pcArr('approachPoints'), ''] }))
  const removeApproach = (i) => setPageContent(p => ({ ...p, approachPoints: pcArr('approachPoints').filter((_, idx) => idx !== i) }))
  const setValueProp = (i, field, val) => setPageContent(p => {
    const next = [...pcArr('valueProps')]; next[i] = { ...next[i], [field]: val }; return { ...p, valueProps: next }
  })
  const addValueProp = () => setPageContent(p => ({ ...p, valueProps: [...pcArr('valueProps'), { value: '', label: '' }] }))
  const removeValueProp = (i) => setPageContent(p => ({ ...p, valueProps: pcArr('valueProps').filter((_, idx) => idx !== i) }))

  const handleSavePage = async () => {
    setSavingPage(true)
    try {
      await saveAboutContent({
        visionStatement: pageContent?.visionStatement || '',
        principles: pcArr('principles'),
        approachPoints: pcArr('approachPoints'),
        valueProps: pcArr('valueProps'),
      })
      showToast('About page content saved successfully!')
    } catch (err) {
      alert('Save failed: ' + err.message)
    } finally { setSavingPage(false) }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setAboutForm({ ...aboutForm, [name]: value })
  }

  const handleHighlightChange = (idx, field, value) => {
    const next = [...aboutForm.highlights]
    next[idx] = { ...next[idx], [field]: value }
    setAboutForm({ ...aboutForm, highlights: next })
  }

  const handleSaveAbout = async (e) => {
    e.preventDefault()
    setSavingAbout(true)
    try {
      await saveHomepageSetting('studio', { ...aboutForm, images })
      showToast('About section saved successfully!')
    } catch (err) {
      alert('Save failed: ' + err.message)
    } finally { setSavingAbout(false) }
  }

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (!files.length) return
    
    if (images.length + files.length > 4) {
      alert('You can only upload up to 4 images for the Inside the Studio mosaic.')
      return
    }

    setUploading(true)
    setUploadProgress(0)

    try {
      const newImages = [...images]
      let count = 0
      for (const file of files) {
        const res = await uploadToCloudinary(file, CLOUDINARY_FOLDERS.misc)
        newImages.push({
          imageUrl: res.url,
          publicId: res.publicId
        })
        count++
        setUploadProgress(Math.round((count / files.length) * 100))
      }
      setImages(newImages)
      showToast('Image uploaded! Click Save to apply.')
    } catch (err) {
      console.error(err)
      alert('Upload failed: ' + err.message)
    } finally {
      setUploading(false)
    }
  }

  const deleteImage = (idx) => {
    const next = images.filter((_, i) => i !== idx)
    setImages(next)
  }

  const moveImage = (idx, direction) => {
    if (idx + direction < 0 || idx + direction >= images.length) return
    const next = [...images]
    const temp = next[idx]
    next[idx] = next[idx + direction]
    next[idx + direction] = temp
    setImages(next)
  }

  const [newCardTitle, setNewCardTitle] = useState('')
  const [newCardFile, setNewCardFile] = useState(null)
  const [newCardUploading, setNewCardUploading] = useState(false)

  const handleAddCard = async (e) => {
    e.preventDefault()
    if (!newCardTitle.trim()) {
      alert('Please enter a title.')
      return
    }
    setNewCardUploading(true)
    try {
      let imageUrl = ''
      let publicId = ''
      if (newCardFile) {
        const res = await uploadToCloudinary(newCardFile, CLOUDINARY_FOLDERS.misc)
        imageUrl = res.url
        publicId = res.publicId
      }
      const next = [...chips, { title: newCardTitle.trim(), imageUrl, publicId }]
      setChips(next)
      setNewCardTitle('')
      setNewCardFile(null)
      const fileInput = document.getElementById('new-card-image-input')
      if (fileInput) fileInput.value = ''
      showToast('New card added! Click Save to apply.')
    } catch (err) {
      console.error(err)
      alert('Failed to upload image: ' + err.message)
    } finally {
      setNewCardUploading(false)
    }
  }

  const handleRemoveCard = (idx) => {
    setChips(chips.filter((_, i) => i !== idx))
  }

  const moveCard = (idx, direction) => {
    if (idx + direction < 0 || idx + direction >= chips.length) return
    const next = [...chips]
    const temp = next[idx]
    next[idx] = next[idx + direction]
    next[idx + direction] = temp
    setChips(next)
  }

  const handleCardTitleChange = (idx, val) => {
    const next = [...chips]
    next[idx] = { ...next[idx], title: val }
    setChips(next)
  }

  const handleCardImageUpload = async (e, idx) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    try {
      const res = await uploadToCloudinary(file, CLOUDINARY_FOLDERS.misc)
      const next = [...chips]
      next[idx] = {
        ...next[idx],
        imageUrl: res.url,
        publicId: res.publicId
      }
      setChips(next)
      showToast('Card image updated! Click Save to apply.')
    } catch (err) {
      console.error(err)
      alert('Upload failed: ' + err.message)
    } finally {
      setUploading(false)
    }
  }

  const handleSaveChips = async () => {
    setSavingChips(true)
    try {
      await saveHomepageSetting('workTypes', chips)
      showToast('Building Blocks updated!')
    } catch (err) {
      alert('Save failed: ' + err.message)
    } finally { setSavingChips(false) }
  }

  return (
    <div>
      <h2 className="text-display" style={{ fontSize: '32px', marginBottom: 8 }}>About Teaser & What We Build</h2>
      <p style={{ color: 'var(--ash)', marginBottom: 32 }}>Manage text fields, stats highlight grid, and modular tags on the landing page.</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
        
        {/* Form About Teaser */}
        <form onSubmit={handleSaveAbout} className="admin-card">
          <h3 className="admin-card__title">Little About Section</h3>
          
          <div className="admin-form-group">
            <label>Eyebrow Tagline</label>
            <input type="text" name="eyebrow" className="admin-input" value={aboutForm.eyebrow || ''} onChange={handleInputChange} />
          </div>

          <div className="admin-form-group">
            <label>Title Headline (supports multiple lines with enter)</label>
            <textarea rows={2} name="title" className="admin-textarea" value={aboutForm.title || ''} onChange={handleInputChange} />
          </div>

          <div className="admin-form-group">
            <label>Teaser Paragraph</label>
            <textarea rows={4} name="desc" className="admin-textarea" value={aboutForm.desc || ''} onChange={handleInputChange} />
          </div>

          <h4 style={{ margin: '24px 0 12px 0', fontSize: 13, fontWeight: 700, color: 'var(--ash)', textTransform: 'uppercase' }}>Highlights Grid (4 slots)</h4>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
            {(aboutForm.highlights || []).map((h, i) => (
              <div key={i} style={{ border: '1px solid var(--pearl)', padding: 16, borderRadius: 8, background: 'rgba(0,0,0,0.01)' }}>
                <span className="text-mono" style={{ fontSize: 11, color: 'var(--gold-dark)', fontWeight: 600 }}>Slot {String(i + 1).padStart(2, '0')}</span>
                <div className="admin-form-group" style={{ marginTop: 8 }}>
                  <label>Value (e.g. 200+)</label>
                  <input type="text" className="admin-input" value={h.value} onChange={e => handleHighlightChange(i, 'value', e.target.value)} />
                </div>
                <div className="admin-form-group" style={{ marginBottom: 0 }}>
                  <label>Label</label>
                  <input type="text" className="admin-input" value={h.label} onChange={e => handleHighlightChange(i, 'label', e.target.value)} />
                </div>
              </div>
            ))}
          </div>

          <h4 style={{ margin: '32px 0 12px 0', fontSize: 13, fontWeight: 700, color: 'var(--ash)', textTransform: 'uppercase' }}>Studio Mosaic Images (4 slots)</h4>
          
          <div className="upload-zone" style={{ padding: '24px 16px', marginBottom: 16 }}>
            <Upload size={20} color="var(--ash)" />
            <p style={{ margin: 0, fontSize: 13 }}>Click or drag images here (Max 4)</p>
            <input type="file" accept="image/*" multiple onChange={handleImageUpload} disabled={uploading || images.length >= 4} />
            {uploading && (
              <div className="upload-progress-bar">
                <div className="upload-progress-fill" style={{ width: `${uploadProgress}%` }} />
              </div>
            )}
          </div>

          <div className="admin-gallery-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: 12, marginBottom: 20 }}>
            {images.map((img, i) => (
              <div key={i} className="admin-gallery-item" style={{ aspectRatio: '1/1' }}>
                <img src={img.imageUrl} alt="" />
                <span className="text-mono" style={{ position: 'absolute', top: 4, left: 4, background: 'rgba(0,0,0,0.6)', color: 'white', padding: '2px 6px', borderRadius: 4, fontSize: 9, zIndex: 1 }}>Cell {i+1}</span>
                <div className="admin-gallery-controls">
                  <button type="button" onClick={() => moveImage(i, -1)} className="admin-gallery-btn" disabled={i === 0} style={{ width: 22, height: 22 }}>
                    <ArrowUp size={10} />
                  </button>
                  <button type="button" onClick={() => moveImage(i, 1)} className="admin-gallery-btn" disabled={i === images.length - 1} style={{ width: 22, height: 22 }}>
                    <ArrowDown size={10} />
                  </button>
                  <button type="button" onClick={() => deleteImage(i)} className="admin-gallery-btn admin-gallery-btn--danger" style={{ width: 22, height: 22 }}>
                    <Trash2 size={10} />
                  </button>
                </div>
              </div>
            ))}
            {images.length < 4 && (
              <div style={{ border: '2px dashed var(--pearl)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ash)', fontSize: 11, background: 'rgba(0,0,0,0.01)', textAlign: 'center', padding: 8, aspectRatio: '1/1' }}>
                Placeholder using default fallback {images.length + 1}
              </div>
            )}
          </div>

          <SaveBtn saving={savingAbout} type="submit" className="btn-gold" style={{ marginTop: 16 }}>Save About Teaser</SaveBtn>
        </form>

        {/* What We Build Service Card Editor */}
        <div className="admin-card">
          <h3 className="admin-card__title">What We Build — Service Cards</h3>
          <p style={{ color: 'var(--ash)', fontSize: 13, marginBottom: 20 }}>
            Manage the modular service cards on the home page. Hovering over a card will reveal its full image.
          </p>

          {/* Add New Service Card */}
          <div className="admin-card" style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed var(--pearl)', padding: 20, marginBottom: 24 }}>
            <h4 style={{ margin: '0 0 12px 0', fontSize: 14, color: 'var(--gold)' }}>Add New Service Card</h4>
            <form onSubmit={handleAddCard} style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-end' }}>
              <div className="admin-form-group" style={{ flex: '1 1 250px', marginBottom: 0 }}>
                <label>Service Title (e.g. False Ceiling)</label>
                <input
                  type="text"
                  placeholder="Enter title..."
                  className="admin-input"
                  value={newCardTitle}
                  onChange={e => setNewCardTitle(e.target.value)}
                />
              </div>
              <div className="admin-form-group" style={{ flex: '1 1 200px', marginBottom: 0 }}>
                <label>Card Background Image</label>
                <input
                  id="new-card-image-input"
                  type="file"
                  accept="image/*"
                  className="admin-input"
                  style={{ border: 'none', padding: 0 }}
                  onChange={e => setNewCardFile(e.target.files[0])}
                />
              </div>
              <button type="submit" className="btn-gold" style={{ height: 42, padding: '0 20px' }} disabled={newCardUploading}>
                {newCardUploading ? 'Uploading...' : 'Add Card'}
              </button>
            </form>
          </div>

          {/* Service Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20, marginBottom: 24 }}>
            {chips.map((card, idx) => (
              <div key={idx} className="admin-card" style={{ border: '1px solid var(--pearl)', padding: 12, display: 'flex', flexDirection: 'column', gap: 12, background: 'rgba(0,0,0,0.1)' }}>
                {/* Thumbnail Preview & Upload */}
                <div style={{ position: 'relative', width: '100%', height: 120, background: '#1a1a1a', borderRadius: 6, overflow: 'hidden' }}>
                  {card.imageUrl ? (
                    <img src={card.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--ash)', fontSize: 12 }}>
                      No Image
                    </div>
                  )}
                  <label style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', opacity: 0, transition: 'opacity 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white', fontSize: 12 }} onMouseEnter={e => e.currentTarget.style.opacity = 1} onMouseLeave={e => e.currentTarget.style.opacity = 0}>
                    <Upload size={16} style={{ marginRight: 6 }} /> Change Image
                    <input type="file" accept="image/*" onChange={e => handleCardImageUpload(e, idx)} style={{ display: 'none' }} />
                  </label>
                </div>

                {/* Title Input */}
                <input
                  type="text"
                  className="admin-input"
                  value={card.title}
                  onChange={e => handleCardTitleChange(idx, e.target.value)}
                  style={{ fontSize: 13, padding: '6px 10px' }}
                />

                {/* Controls */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button type="button" onClick={() => moveCard(idx, -1)} className="admin-gallery-btn" disabled={idx === 0} style={{ width: 26, height: 26 }}>
                      <ArrowUp size={12} />
                    </button>
                    <button type="button" onClick={() => moveCard(idx, 1)} className="admin-gallery-btn" disabled={idx === chips.length - 1} style={{ width: 26, height: 26 }}>
                      <ArrowDown size={12} />
                    </button>
                  </div>
                  <button type="button" onClick={() => handleRemoveCard(idx)} className="admin-gallery-btn admin-gallery-btn--danger" style={{ width: 26, height: 26 }}>
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <SaveBtn saving={savingChips} onClick={handleSaveChips} type="button" className="btn-gold" style={{ width: '100%', justifyContent: 'center', height: 48, fontSize: 15 }}>
            Save What We Build Cards
          </SaveBtn>
        </div>

        {/* ── ABOUT PAGE CONTENT (shown on /about-us) ── */}
        <div className="admin-card">
          <h3 className="admin-card__title">About Page Content</h3>
          <p style={{ color: 'var(--ash)', fontSize: 13, margin: '0 0 20px' }}>
            Edits here appear on the public <strong>About Us</strong> page — Vision, Principles, Approach points and the value-prop stats.
          </p>

          {/* Vision */}
          <div className="admin-form-group">
            <label>Vision Statement</label>
            <textarea rows={3} className="admin-textarea" value={pageContent?.visionStatement || ''} onChange={e => setVision(e.target.value)} />
          </div>

          {/* Principles */}
          <h4 style={{ margin: '24px 0 12px', fontSize: 13, fontWeight: 700, color: 'var(--ash)', textTransform: 'uppercase' }}>Principles</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 12 }}>
            {pcArr('principles').map((p, i) => (
              <div key={i} style={{ border: '1px solid var(--pearl)', padding: 14, borderRadius: 8, background: 'rgba(0,0,0,0.01)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span className="text-mono" style={{ fontSize: 11, color: 'var(--gold-dark)', fontWeight: 600 }}>Principle {String(i + 1).padStart(2, '0')}</span>
                  <button type="button" onClick={() => removePrinciple(i)} className="admin-gallery-btn admin-gallery-btn--danger" style={{ width: 26, height: 26 }}><Trash2 size={12} /></button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '90px 1fr', gap: 10 }}>
                  <div className="admin-form-group" style={{ marginBottom: 0 }}>
                    <label>No.</label>
                    <input type="text" className="admin-input" value={p.num || ''} onChange={e => setPrinciple(i, 'num', e.target.value)} />
                  </div>
                  <div className="admin-form-group" style={{ marginBottom: 0 }}>
                    <label>Title</label>
                    <input type="text" className="admin-input" value={p.title || ''} onChange={e => setPrinciple(i, 'title', e.target.value)} />
                  </div>
                </div>
                <div className="admin-form-group" style={{ marginTop: 10, marginBottom: 0 }}>
                  <label>Description</label>
                  <textarea rows={2} className="admin-textarea" value={p.desc || ''} onChange={e => setPrinciple(i, 'desc', e.target.value)} />
                </div>
              </div>
            ))}
          </div>
          <button type="button" onClick={addPrinciple} className="admin-gallery-btn" style={{ marginBottom: 8 }}><Plus size={14} /> Add Principle</button>

          {/* Approach points */}
          <h4 style={{ margin: '24px 0 12px', fontSize: 13, fontWeight: 700, color: 'var(--ash)', textTransform: 'uppercase' }}>Approach Points</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
            {pcArr('approachPoints').map((pt, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <input type="text" className="admin-input" value={pt} onChange={e => setApproach(i, e.target.value)} style={{ flex: 1 }} />
                <button type="button" onClick={() => removeApproach(i)} className="admin-gallery-btn admin-gallery-btn--danger" style={{ width: 30, height: 30, flexShrink: 0 }}><Trash2 size={12} /></button>
              </div>
            ))}
          </div>
          <button type="button" onClick={addApproach} className="admin-gallery-btn" style={{ marginBottom: 8 }}><Plus size={14} /> Add Point</button>

          {/* Value props */}
          <h4 style={{ margin: '24px 0 12px', fontSize: 13, fontWeight: 700, color: 'var(--ash)', textTransform: 'uppercase' }}>Value Prop Stats</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
            {pcArr('valueProps').map((v, i) => (
              <div key={i} style={{ border: '1px solid var(--pearl)', padding: 14, borderRadius: 8, background: 'rgba(0,0,0,0.01)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span className="text-mono" style={{ fontSize: 11, color: 'var(--gold-dark)', fontWeight: 600 }}>Stat {String(i + 1).padStart(2, '0')}</span>
                  <button type="button" onClick={() => removeValueProp(i)} className="admin-gallery-btn admin-gallery-btn--danger" style={{ width: 26, height: 26 }}><Trash2 size={12} /></button>
                </div>
                <div className="admin-form-group" style={{ marginBottom: 8 }}>
                  <label>Value (e.g. 10-Year)</label>
                  <input type="text" className="admin-input" value={v.value || ''} onChange={e => setValueProp(i, 'value', e.target.value)} />
                </div>
                <div className="admin-form-group" style={{ marginBottom: 0 }}>
                  <label>Label</label>
                  <input type="text" className="admin-input" value={v.label || ''} onChange={e => setValueProp(i, 'label', e.target.value)} />
                </div>
              </div>
            ))}
          </div>
          <button type="button" onClick={addValueProp} className="admin-gallery-btn" style={{ marginBottom: 20 }}><Plus size={14} /> Add Stat</button>

          <SaveBtn saving={savingPage} onClick={handleSavePage} type="button" className="btn-gold" style={{ width: '100%', justifyContent: 'center', height: 48, fontSize: 15 }}>
            Save About Page Content
          </SaveBtn>
        </div>
      </div>
    </div>
  )
}

/* ──────────────────────────────────────────────────────────
   TESTIMONIALS MANAGER
   ────────────────────────────────────────────────────────── */
function TestimonialsManager({ showToast }) {
  const { testimonials, saveTestimonial, deleteTestimonial } = useData()
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ id: '', name: '', project: '', text: '', rating: 5, avatar: '', videoId: '' })
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [saving, setSaving] = useState(false)

  const handleEdit = (t) => {
    setEditing(t ? t.id : 'new')
    setForm(t ? { videoId: '', ...t } : {
      id: '',
      name: '',
      project: '',
      text: '',
      rating: 5,
      avatar: '',
      videoId: ''
    })
  }

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    setUploadProgress(0)

    try {
      const res = await uploadToCloudinary(file, CLOUDINARY_FOLDERS.misc)
      setForm({ ...form, avatar: res.url })
      showToast('Avatar photo uploaded!')
    } catch (err) {
      alert('Upload failed: ' + err.message)
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.text) return
    const id = form.id ? String(form.id) : Date.now().toString()

    setSaving(true)
    try {
      await saveTestimonial({ ...form, id })
      setEditing(null)
      showToast('Review saved!')
    } catch (err) {
      alert('Save failed: ' + err.message)
    } finally { setSaving(false) }
  }

  return (
    <div className="admin-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h3 className="admin-card__title" style={{ margin: 0 }}>Client Reviews</h3>
          <p style={{ color: 'var(--ash)', fontSize: 13, margin: '4px 0 0 0' }}>Manage client feedback cards showing in the Testimonials quote stage.</p>
        </div>
        <button onClick={() => handleEdit(null)} className="btn-gold">
          <Plus size={16} /> Add Review
        </button>
      </div>

      <table className="crud-table">
        <thead>
          <tr>
            <th>Client</th>
            <th>Project Name</th>
            <th>Review Body</th>
            <th>Rating</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {testimonials.map(t => (
            <tr key={t.id}>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--pearl)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 }}>
                    {t.avatar ? <img src={t.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : t.name.charAt(0)}
                  </div>
                  <span style={{ fontWeight: 600 }}>{t.name}</span>
                </div>
              </td>
              <td>{t.project}</td>
              <td style={{ maxWidth: 350, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.text}</td>
              <td><span style={{ color: 'var(--gold)', fontWeight: 600 }}>{t.rating} ★</span></td>
              <td>
                <div className="crud-actions">
                  <button onClick={() => handleEdit(t)} className="crud-btn" title="Edit">
                    <Edit size={16} />
                  </button>
                  <DeleteBtn onDelete={() => deleteTestimonial(t.id)} label="Delete review" />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Editor Panel Drawer */}
      {editing && (
        <div className="admin-panel-overlay">
          <div className="admin-side-panel" style={{ maxWidth: 450 }}>
            <div className="admin-side-panel__header">
              <h3 style={{ margin: 0 }}>{editing === 'new' ? 'Add Testimonial' : 'Edit Testimonial'}</h3>
              <button onClick={() => setEditing(null)} className="crud-btn"><Trash2 size={18} /></button>
            </div>
            <form onSubmit={handleSubmit} className="admin-side-panel__body">
              <div className="admin-form-group">
                <label>Client Name</label>
                <input type="text" className="admin-input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
              </div>

              <div className="admin-form-group">
                <label>Project Scope / Subtitle (e.g. SNN Clermont)</label>
                <input type="text" className="admin-input" value={form.project} onChange={e => setForm({...form, project: e.target.value})} />
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Star Rating (1 - 5)</label>
                  <select className="admin-select" value={form.rating} onChange={e => setForm({...form, rating: Number(e.target.value)})}>
                    <option value={5}>5 Stars</option>
                    <option value={4}>4 Stars</option>
                    <option value={3}>3 Stars</option>
                    <option value={2}>2 Stars</option>
                    <option value={1}>1 Star</option>
                  </select>
                </div>
              </div>

              <div className="admin-form-group">
                <label>Client Review Description</label>
                <textarea rows={4} className="admin-textarea" value={form.text} onChange={e => setForm({...form, text: e.target.value})} required />
              </div>

              <div className="admin-form-group">
                <label>YouTube Video Testimonial (optional — paste link or video ID; shows a playable video card instead of a text quote)</label>
                <input
                  type="text"
                  className="admin-input"
                  placeholder="e.g. https://youtu.be/J5x3HquAop0"
                  value={form.videoId || ''}
                  onChange={e => setForm({ ...form, videoId: parseYouTubeId(e.target.value) || e.target.value })}
                />
                {form.videoId && parseYouTubeId(form.videoId) && (
                  <img src={`https://i.ytimg.com/vi/${parseYouTubeId(form.videoId)}/mqdefault.jpg`} alt="Video preview" style={{ width: 160, borderRadius: 8, marginTop: 8 }} />
                )}
              </div>

              <div className="admin-form-group" style={{ marginTop: 20 }}>
                <label>Client Avatar Photo</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 8 }}>
                  <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--pearl)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700 }}>
                    {form.avatar ? <img src={form.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : form.name.charAt(0) || '?'}
                  </div>
                  <div style={{ position: 'relative' }}>
                    <button type="button" className="btn-gold" style={{ display: 'flex', gap: 8, padding: '8px 16px', fontSize: 12 }}>
                      <Upload size={14} /> Upload Avatar
                    </button>
                    <input type="file" accept="image/*" onChange={handleAvatarUpload} disabled={uploading} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} />
                  </div>
                  {form.avatar && (
                    <button type="button" onClick={() => setForm({...form, avatar: ''})} className="crud-btn crud-btn--danger">
                      Remove
                    </button>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 40 }}>
                <button type="button" onClick={() => setEditing(null)} className="btn-danger-outline">Cancel</button>
                <SaveBtn saving={saving} type="submit" className="btn-gold">Save Review</SaveBtn>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

/* ──────────────────────────────────────────────────────────
   VIDEOS & SOCIAL REELS MANAGER
   ────────────────────────────────────────────────────────── */
function VideosSocialManager({ showToast }) {
  const { youtubeVideos, instagramPosts, saveHomepageSetting } = useData()
  
  const [subTab, setSubTab] = useState('youtube') // youtube | instagram
  const [videos, setVideos] = useState(youtubeVideos || [])
  const [instaPosts, setInstaPosts] = useState(instagramPosts || [])

  // Temp form states
  const [newVideo, setNewVideo] = useState({ videoId: '', title: '' })
  const [newInsta, setNewInsta] = useState({ imageUrl: '', link: '' })
  const [uploading, setUploading] = useState(false)
  const [savingVideos, setSavingVideos] = useState(false)
  const [savingInsta, setSavingInsta] = useState(false)

  useEffect(() => {
    setVideos(youtubeVideos || [])
    setInstaPosts(instagramPosts || [])
  }, [youtubeVideos, instagramPosts])

  // YouTube actions
  const handleAddVideo = (e) => {
    e.preventDefault()
    if (!newVideo.videoId || !newVideo.title) return
    setVideos([...videos, newVideo])
    setNewVideo({ videoId: '', title: '' })
  }

  const handleRemoveVideo = (idx) => {
    setVideos(videos.filter((_, i) => i !== idx))
  }

  const handleSaveVideos = async () => {
    setSavingVideos(true)
    try {
      await saveHomepageSetting('youtube', videos)
      showToast('YouTube video list updated!')
    } catch (err) {
      alert('Save failed: ' + err.message)
    } finally { setSavingVideos(false) }
  }

  // Instagram actions
  const handleAddInsta = (e) => {
    e.preventDefault()
    if (!newInsta.imageUrl) return
    setInstaPosts([...instaPosts, {
      imageUrl: newInsta.imageUrl,
      link: newInsta.link || 'https://www.instagram.com/atticarch2020/'
    }])
    setNewInsta({ imageUrl: '', link: '' })
  }

  const handleInstaUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    try {
      const res = await uploadToCloudinary(file, CLOUDINARY_FOLDERS.misc)
      setNewInsta({ ...newInsta, imageUrl: res.url })
      showToast('Photo uploaded!')
    } catch (err) {
      alert('Upload failed: ' + err.message)
    } finally {
      setUploading(false)
    }
  }

  const handleRemoveInsta = (idx) => {
    setInstaPosts(instaPosts.filter((_, i) => i !== idx))
  }

  const handleSaveInsta = async () => {
    setSavingInsta(true)
    try {
      await saveHomepageSetting('instagram', instaPosts)
      showToast('Instagram Feed list updated!')
    } catch (err) {
      alert('Save failed: ' + err.message)
    } finally { setSavingInsta(false) }
  }

  return (
    <div>
      <h2 className="text-display" style={{ fontSize: '32px', marginBottom: 8 }}>Videos & Social Feed</h2>
      <p style={{ color: 'var(--ash)', marginBottom: 24 }}>Manage YouTube Video tours and Instagram feed cards displayed on the landing page.</p>

      {/* Sub Tabs */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 32 }}>
        <button
          onClick={() => setSubTab('youtube')}
          className="btn-gold"
          style={{ background: subTab === 'youtube' ? 'var(--gold)' : 'var(--warm-white)', color: 'var(--charcoal)', border: '1px solid var(--pearl)' }}
        >
          YouTube Video tours
        </button>
        <button
          onClick={() => setSubTab('instagram')}
          className="btn-gold"
          style={{ background: subTab === 'instagram' ? 'var(--gold)' : 'var(--warm-white)', color: 'var(--charcoal)', border: '1px solid var(--pearl)' }}
        >
          Instagram grid
        </button>
      </div>

      {subTab === 'youtube' && (
        <div className="admin-card">
          <h3 className="admin-card__title">Client Videos & Project Tours</h3>
          <p style={{ color: 'var(--ash)', fontSize: 13, marginBottom: 24 }}>Configure YouTube Before & After videos showing under the videoreel section.</p>

          <form onSubmit={handleAddVideo} style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr auto', gap: 16, marginBottom: 32 }}>
            <div className="admin-form-group" style={{ marginBottom: 0 }}>
              <label>YouTube Video Title</label>
              <input
                type="text"
                placeholder="e.g. Modern Luxury 3BHK Tour"
                className="admin-input"
                value={newVideo.title}
                onChange={e => setNewVideo({...newVideo, title: e.target.value})}
                required
              />
            </div>
            <div className="admin-form-group" style={{ marginBottom: 0 }}>
              <label>YouTube Video ID (e.g. vcUMkExgiCw)</label>
              <input
                type="text"
                placeholder="vcUMkExgiCw"
                className="admin-input"
                value={newVideo.videoId}
                onChange={e => setNewVideo({...newVideo, videoId: e.target.value})}
                required
              />
            </div>
            <button type="submit" className="btn-gold" style={{ height: 'max-content', marginTop: 22 }}>
              <Plus size={16} /> Add Video
            </button>
          </form>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {videos.map((v, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 18px', background: 'var(--cream)', border: '1px solid var(--pearl)', borderRadius: 8 }}>
                <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                  <img src={`https://img.youtube.com/vi/${v.videoId}/default.jpg`} alt="" style={{ width: 56, height: 42, objectFit: 'cover', borderRadius: 4 }} />
                  <div>
                    <h5 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>{v.title}</h5>
                    <code style={{ fontSize: 12, color: 'var(--ash)' }}>{v.videoId}</code>
                  </div>
                </div>
                <button type="button" onClick={() => handleRemoveVideo(i)} className="crud-btn crud-btn--danger">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          <SaveBtn saving={savingVideos} onClick={handleSaveVideos} type="button" className="btn-gold" style={{ marginTop: 32 }}>
            Save Video list
          </SaveBtn>
        </div>
      )}

      {subTab === 'instagram' && (
        <div className="admin-card">
          <h3 className="admin-card__title">Instagram grid Feed</h3>
          <p style={{ color: 'var(--ash)', fontSize: 13, marginBottom: 24 }}>Upload images and paste links for your social media feed cards.</p>

          <form onSubmit={handleAddInsta} style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr auto', gap: 16, marginBottom: 32 }}>
            <div className="admin-form-group" style={{ marginBottom: 0 }}>
              <label>Reel URL Link</label>
              <input
                type="text"
                placeholder="https://instagram.com/reel/..."
                className="admin-input"
                value={newInsta.link}
                onChange={e => setNewInsta({...newInsta, link: e.target.value})}
              />
            </div>
            
            <div className="admin-form-group" style={{ marginBottom: 0 }}>
              <label>Reel Thumbnail Image ({newInsta.imageUrl ? 'Uploaded!' : 'Upload'})</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  type="text"
                  placeholder="https://res.cloudinary.com/..."
                  className="admin-input"
                  value={newInsta.imageUrl}
                  onChange={e => setNewInsta({...newInsta, imageUrl: e.target.value})}
                  required
                />
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <button type="button" className="btn-gold" style={{ padding: '0 16px', height: 42 }} disabled={uploading}>
                    <Upload size={16} />
                  </button>
                  <input type="file" accept="image/*" onChange={handleInstaUpload} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} />
                </div>
              </div>
            </div>

            <button type="submit" className="btn-gold" style={{ height: 'max-content', marginTop: 22 }}>
              <Plus size={16} /> Add Post
            </button>
          </form>

          <div className="admin-gallery-grid">
            {instaPosts.map((post, i) => (
              <div key={i} className="admin-gallery-item">
                <img src={post.imageUrl} alt="" />
                <div className="admin-gallery-controls">
                  <a href={post.link} target="_blank" rel="noreferrer" className="admin-gallery-btn">
                    <Check size={12} />
                  </a>
                  <button type="button" onClick={() => handleRemoveInsta(i)} className="admin-gallery-btn admin-gallery-btn--danger">
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <SaveBtn saving={savingInsta} onClick={handleSaveInsta} type="button" className="btn-gold" style={{ marginTop: 32 }}>
            Save Instagram feed
          </SaveBtn>
        </div>
      )}
    </div>
  )
}

/* ──────────────────────────────────────────────────────────
   BLOG MANAGER
   ────────────────────────────────────────────────────────── */
function BlogManager({ showToast }) {
  const { blogPosts, saveBlogPost, deleteBlogPost } = useData()
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ id: '', slug: '', title: '', excerpt: '', date: '', category: '', image: '', content: '' })
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)

  const handleEdit = (post) => {
    setEditing(post ? post.id : 'new')
    setForm(post ? post : {
      id: '',
      slug: '',
      title: '',
      excerpt: '',
      date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      category: 'Tips',
      image: '',
      content: ''
    })
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)

    try {
      const res = await uploadToCloudinary(file, CLOUDINARY_FOLDERS.blog)
      setForm({ ...form, image: res.url })
      showToast('Blog header image uploaded!')
    } catch (err) {
      alert('Upload failed: ' + err.message)
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title || !form.excerpt) return
    const id = form.id ? String(form.id) : Date.now().toString()
    const slug = form.slug || form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')

    setSaving(true)
    try {
      await saveBlogPost({ ...form, id, slug })
      setEditing(null)
      showToast('Blog article saved!')
    } catch (err) {
      alert('Save failed: ' + err.message)
    } finally { setSaving(false) }
  }

  return (
    <div className="admin-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h3 className="admin-card__title" style={{ margin: 0 }}>Blog Posts</h3>
          <p style={{ color: 'var(--ash)', fontSize: 13, margin: '4px 0 0 0' }}>Write articles, tips, and guidelines showing under the Latest Insights grid.</p>
        </div>
        <button onClick={() => handleEdit(null)} className="btn-gold">
          <Plus size={16} /> Add Post
        </button>
      </div>

      <table className="crud-table">
        <thead>
          <tr>
            <th>Header Image</th>
            <th>Title</th>
            <th>Category</th>
            <th>Excerpt</th>
            <th>Publish Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {blogPosts.map(p => (
            <tr key={p.id}>
              <td>
                <img src={p.image} alt="" style={{ width: 48, height: 36, objectFit: 'cover', borderRadius: 4 }} />
              </td>
              <td style={{ fontWeight: 600 }}>{p.title}</td>
              <td><span style={{ background: 'var(--cream)', border: '1px solid var(--pearl)', padding: '4px 8px', borderRadius: 4, fontSize: 11 }}>{p.category}</span></td>
              <td style={{ maxWidth: 260, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.excerpt}</td>
              <td>{p.date}</td>
              <td>
                <div className="crud-actions">
                  <button onClick={() => handleEdit(p)} className="crud-btn" title="Edit">
                    <Edit size={16} />
                  </button>
                  <DeleteBtn onDelete={() => deleteBlogPost(p.id)} label="Delete blog post" />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Slide-out Drawer Form */}
      {editing && (
        <div className="admin-panel-overlay">
          <div className="admin-side-panel">
            <div className="admin-side-panel__header">
              <h3 style={{ margin: 0 }}>{editing === 'new' ? 'Write Blog Post' : 'Edit Post'}</h3>
              <button onClick={() => setEditing(null)} className="crud-btn"><Trash2 size={18} /></button>
            </div>
            <form onSubmit={handleSubmit} className="admin-side-panel__body">
              <div className="admin-form-group">
                <label>Article Title</label>
                <input
                  type="text"
                  className="admin-input"
                  value={form.title}
                  onChange={e => setForm({...form, title: e.target.value, slug: form.id ? form.slug : e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-')})}
                  required
                />
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Url Path Slug (e.g. winter-ready-homes)</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={form.slug}
                    onChange={e => setForm({...form, slug: e.target.value})}
                    required
                  />
                </div>
                <div className="admin-form-group">
                  <label>Category Label (e.g. Tips, Design)</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={form.category}
                    onChange={e => setForm({...form, category: e.target.value})}
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label>Excerpt Summary</label>
                <textarea
                  rows={2}
                  className="admin-textarea"
                  value={form.excerpt}
                  onChange={e => setForm({...form, excerpt: e.target.value})}
                  required
                />
              </div>

              <div className="admin-form-group">
                <label>Publish Date Label</label>
                <input
                  type="text"
                  className="admin-input"
                  value={form.date}
                  onChange={e => setForm({...form, date: e.target.value})}
                />
              </div>

              <div className="admin-form-group">
                <label>Header Image Upload</label>
                <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                  {form.image && (
                    <img src={form.image} alt="" style={{ width: 80, height: 60, objectFit: 'cover', borderRadius: 6, border: '1px solid var(--pearl)' }} />
                  )}
                  <div style={{ position: 'relative' }}>
                    <button type="button" className="btn-gold" style={{ display: 'flex', gap: 8, padding: '8px 16px', fontSize: 12 }}>
                      <Upload size={14} /> {form.image ? 'Change Photo' : 'Upload Photo'}
                    </button>
                    <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} />
                  </div>
                </div>
              </div>

              <div className="admin-form-group">
                <label>Article Content (HTML supported)</label>
                <textarea
                  rows={8}
                  className="admin-textarea"
                  placeholder="<p>Write your detailed article paragraphs here...</p>"
                  value={form.content}
                  onChange={e => setForm({...form, content: e.target.value})}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 40 }}>
                <button type="button" onClick={() => setEditing(null)} className="btn-danger-outline">Cancel</button>
                <SaveBtn saving={saving} type="submit" className="btn-gold">Save Article</SaveBtn>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

/* ──────────────────────────────────────────────────────────
   LANDING PAGE MANAGER
   ────────────────────────────────────────────────────────── */
function LandingPageManager({ showToast }) {
  const { landingSettings, saveLandingSettings } = useData()
  const [form, setForm] = useState(landingSettings)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setForm(landingSettings)
  }, [landingSettings])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const handleBulletChange = (idx, val) => {
    const next = [...form.bullets]
    next[idx] = val
    setForm({ ...form, bullets: next })
  }

  const handleStatChange = (idx, field, val) => {
    const next = [...form.stats]
    next[idx] = { ...next[idx], [field]: field === 'value' ? parseFloat(val) || 0 : val }
    setForm({ ...form, stats: next })
  }

  const handleBenefitChange = (idx, field, val) => {
    const next = [...form.benefits]
    next[idx] = { ...next[idx], [field]: val }
    setForm({ ...form, benefits: next })
  }

  const handlePricingChange = (idx, field, val) => {
    const next = [...form.pricing]
    next[idx] = { ...next[idx], [field]: val }
    setForm({ ...form, pricing: next })
  }

  const handleStepChange = (idx, field, val) => {
    const next = [...form.steps]
    next[idx] = { ...next[idx], [field]: val }
    setForm({ ...form, steps: next })
  }

  const handleFAQChange = (idx, field, val) => {
    const next = [...form.faqs]
    next[idx] = { ...next[idx], [field]: val }
    setForm({ ...form, faqs: next })
  }

  const handleAddFAQ = () => {
    setForm({
      ...form,
      faqs: [...(form.faqs || []), { q: 'New Question', a: 'New Answer' }]
    })
  }

  const handleRemoveFAQ = (idx) => {
    setForm({
      ...form,
      faqs: (form.faqs || []).filter((_, i) => i !== idx)
    })
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await saveLandingSettings(form)
      showToast('Landing Page settings saved successfully!')
    } catch (err) {
      alert('Save failed: ' + err.message)
    } finally { setSaving(false) }
  }

  if (!form) return <div style={{ color: 'white', padding: 20 }}>Loading landing settings...</div>

  return (
    <div>
      <h2 className="text-display" style={{ fontSize: '32px', marginBottom: 8 }}>Landing Page Editor</h2>
      <p style={{ color: 'var(--ash)', marginBottom: 32 }}>Contact details, WhatsApp link and the three hero points shown on the consultation landing page.</p>

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

        {/* Contact & WhatsApp */}
        <div className="admin-card">
          <h3 className="admin-card__title">Contact & WhatsApp</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
            <div className="admin-form-group">
              <label>Phone Number (e.g. +919845013138)</label>
              <input type="text" name="phone" className="admin-input" value={form.phone || ''} onChange={handleChange} />
            </div>
            <div className="admin-form-group">
              <label>WhatsApp Number (Only digits: 919845013138)</label>
              <input type="text" name="whatsapp" className="admin-input" value={form.whatsapp || ''} onChange={handleChange} />
            </div>
            <div className="admin-form-group">
              <label>WhatsApp Prefill Message</label>
              <input type="text" name="whatsappPrefill" className="admin-input" value={form.whatsappPrefill || ''} onChange={handleChange} />
            </div>
          </div>
        </div>

        {/* Hero points */}
        <div className="admin-card">
          <h3 className="admin-card__title">Hero Points (3 slots)</h3>
          <p style={{ color: 'var(--ash)', fontSize: 13, marginBottom: 16 }}>The three check-marked lines under the rotating headline.</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
            {(form.bullets || []).map((bullet, idx) => (
              <div key={idx} className="admin-form-group" style={{ marginBottom: 0 }}>
                <label>Point {idx + 1}</label>
                <input type="text" className="admin-input" value={bullet} onChange={e => handleBulletChange(idx, e.target.value)} />
              </div>
            ))}
          </div>
        </div>

        {/* Where the rest of the landing page is edited */}
        <div className="admin-card">
          <h3 className="admin-card__title">Where the other sections are edited</h3>
          <p style={{ color: 'var(--ash)', fontSize: 13, lineHeight: 1.8, margin: 0 }}>
            The landing page mirrors your homepage content, so it stays in sync automatically:<br />
            • <strong>Rotating headline & eyebrow</strong> — Homepage → Hero Section<br />
            • <strong>Inside the Studio text & highlights</strong> — Homepage → Studio Section<br />
            • <strong>What We Build list</strong> — Homepage → Work Types<br />
            • <strong>Client video walkthroughs</strong> — Client Reviews (testimonials with a YouTube video)<br />
            • <strong>Core Services & stats</strong> — fixed site content
          </p>
        </div>

        {/* Benefits Grid */}
        {false && <>
        <div className="admin-card">
          <h3 className="admin-card__title">Highlight Stats</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            {(form.stats || []).map((stat, idx) => (
              <div key={idx} style={{ border: '1px solid var(--pearl)', padding: 16, borderRadius: 8, background: 'rgba(0,0,0,0.01)' }}>
                <span className="text-mono" style={{ fontSize: 11, color: 'var(--gold-dark)', fontWeight: 600 }}>Stat {idx + 1}</span>
                <div className="admin-form-group" style={{ marginTop: 8 }}>
                  <label>Value (e.g. 1000)</label>
                  <input type="number" step="any" className="admin-input" value={stat.value} onChange={e => handleStatChange(idx, 'value', e.target.value)} />
                </div>
                <div className="admin-form-group">
                  <label>Suffix (e.g. + or ★)</label>
                  <input type="text" className="admin-input" value={stat.suffix} onChange={e => handleStatChange(idx, 'suffix', e.target.value)} />
                </div>
                <div className="admin-form-group" style={{ marginBottom: 8 }}>
                  <label>Label (e.g. Google Rating)</label>
                  <input type="text" className="admin-input" value={stat.label} onChange={e => handleStatChange(idx, 'label', e.target.value)} />
                </div>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--ash)', cursor: 'pointer' }}>
                  <input type="checkbox" checked={!!stat.decimal} onChange={e => handleStatChange(idx, 'decimal', e.target.checked)} />
                  Show one decimal (e.g. 4.8)
                </label>
              </div>
            ))}
          </div>
        </div>
        <div className="admin-card">
          <h3 className="admin-card__title">Benefits Grid</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {(form.benefits || []).map((benefit, idx) => (
              <div key={idx} style={{ border: '1px solid var(--pearl)', padding: 16, borderRadius: 8, background: 'rgba(0,0,0,0.01)' }}>
                <span className="text-mono" style={{ fontSize: 11, color: 'var(--gold-dark)', fontWeight: 600 }}>Benefit {idx + 1}</span>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 12, marginTop: 8 }}>
                  <div className="admin-form-group" style={{ marginBottom: 0 }}>
                    <label>Icon Name</label>
                    <select className="admin-input" value={benefit.iconName} onChange={e => handleBenefitChange(idx, 'iconName', e.target.value)}>
                      <option value="Box">Box (3D)</option>
                      <option value="Palette">Palette (Materials)</option>
                      <option value="FileText">FileText (Quote)</option>
                      <option value="MapPin">MapPin (Survey)</option>
                      <option value="Shield">Shield (Warranty)</option>
                      <option value="Clock">Clock (On-time)</option>
                    </select>
                  </div>
                  <div className="admin-form-group" style={{ marginBottom: 0 }}>
                    <label>Title</label>
                    <input type="text" className="admin-input" value={benefit.title} onChange={e => handleBenefitChange(idx, 'title', e.target.value)} />
                  </div>
                </div>
                <div className="admin-form-group" style={{ marginTop: 12, marginBottom: 0 }}>
                  <label>Description</label>
                  <textarea rows={2} className="admin-textarea" value={benefit.desc} onChange={e => handleBenefitChange(idx, 'desc', e.target.value)} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="admin-card">
          <h3 className="admin-card__title">Pricing Packages</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            {(form.pricing || []).map((p, idx) => (
              <div key={idx} style={{ border: p.featured ? '2px solid var(--gold)' : '1px solid var(--pearl)', padding: 16, borderRadius: 8, background: p.featured ? 'rgba(184,134,11,0.03)' : 'rgba(0,0,0,0.01)', position: 'relative' }}>
                <span className="text-mono" style={{ fontSize: 11, color: p.featured ? 'var(--gold)' : 'var(--gold-dark)', fontWeight: 600 }}>
                  Package {idx + 1} {p.featured && '(Featured/Recommended)'}
                </span>
                
                <div className="admin-form-group" style={{ marginTop: 12 }}>
                  <label>Apartment Type (e.g. 2 BHK)</label>
                  <input type="text" className="admin-input" value={p.type} onChange={e => handlePricingChange(idx, 'type', e.target.value)} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="admin-form-group">
                    <label>Starts (e.g. ₹6 Lacs)</label>
                    <input type="text" className="admin-input" value={p.starts} onChange={e => handlePricingChange(idx, 'starts', e.target.value)} />
                  </div>
                  <div className="admin-form-group">
                    <label>Range (e.g. ₹6L – ₹10L)</label>
                    <input type="text" className="admin-input" value={p.range} onChange={e => handlePricingChange(idx, 'range', e.target.value)} />
                  </div>
                </div>

                <div className="admin-form-group">
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <input type="checkbox" checked={!!p.featured} onChange={e => {
                      const nextPricing = form.pricing.map((item, i) => ({
                        ...item,
                        featured: i === idx ? e.target.checked : false
                      }))
                      setForm({ ...form, pricing: nextPricing })
                    }} />
                    Featured Package
                  </label>
                </div>

                <div className="admin-form-group" style={{ marginBottom: 0 }}>
                  <label>Inclusions (comma separated list)</label>
                  <textarea rows={3} className="admin-textarea" value={p.inclusions} onChange={e => handlePricingChange(idx, 'inclusions', e.target.value)} placeholder="Modular Kitchen, Wardrobes..." />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Steps / Timeline */}
        <div className="admin-card">
          <h3 className="admin-card__title">How it Works (Timeline Steps)</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            {(form.steps || []).map((step, idx) => (
              <div key={idx} style={{ border: '1px solid var(--pearl)', padding: 16, borderRadius: 8, background: 'rgba(0,0,0,0.01)' }}>
                <span className="text-mono" style={{ fontSize: 11, color: 'var(--gold-dark)', fontWeight: 600 }}>Step {step.num}</span>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 12, marginTop: 8 }}>
                  <div className="admin-form-group">
                    <label>Duration (e.g. Day 1)</label>
                    <input type="text" className="admin-input" value={step.day} onChange={e => handleStepChange(idx, 'day', e.target.value)} />
                  </div>
                  <div className="admin-form-group">
                    <label>Title</label>
                    <input type="text" className="admin-input" value={step.title} onChange={e => handleStepChange(idx, 'title', e.target.value)} />
                  </div>
                </div>
                <div className="admin-form-group" style={{ marginBottom: 0 }}>
                  <label>Description</label>
                  <textarea rows={3} className="admin-textarea" value={step.desc} onChange={e => handleStepChange(idx, 'desc', e.target.value)} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQs Section */}
        <div className="admin-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 className="admin-card__title" style={{ margin: 0 }}>Frequently Asked Questions</h3>
            <button type="button" onClick={handleAddFAQ} className="btn-gold" style={{ padding: '6px 12px', fontSize: 12 }}>
              <Plus size={14} style={{ marginRight: 4 }} /> Add FAQ
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {(form.faqs || []).map((faq, idx) => (
              <div key={idx} style={{ border: '1px solid var(--pearl)', padding: 16, borderRadius: 8, background: 'rgba(0,0,0,0.01)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <span className="text-mono" style={{ fontSize: 11, color: 'var(--gold-dark)', fontWeight: 600 }}>FAQ {idx + 1}</span>
                  <button type="button" onClick={() => handleRemoveFAQ(idx)} className="admin-gallery-btn admin-gallery-btn--danger" style={{ width: 26, height: 26 }}>
                    <Trash2 size={12} />
                  </button>
                </div>
                <div className="admin-form-group">
                  <label>Question</label>
                  <input type="text" className="admin-input" value={faq.q} onChange={e => handleFAQChange(idx, 'q', e.target.value)} />
                </div>
                <div className="admin-form-group" style={{ marginBottom: 0 }}>
                  <label>Answer</label>
                  <textarea rows={3} className="admin-textarea" value={faq.a} onChange={e => handleFAQChange(idx, 'a', e.target.value)} />
                </div>
              </div>
            ))}
          </div>
        </div>
        </>}

        {/* Global Save Button */}
        <SaveBtn saving={saving} type="submit" className="btn-gold" style={{ height: 48, fontSize: 15, justifyContent: 'center' }}>
          Save Landing Page Settings
        </SaveBtn>

      </form>
    </div>
  )
}

/* ──────────────────────────────────────────────────────────
   NAVIGATION MANAGER — editable top-nav labels / order / visibility
   ────────────────────────────────────────────────────────── */
function NavigationManager({ showToast }) {
  const { navSettings, saveNavSettings } = useData()
  const [items, setItems] = useState(navSettings?.items || [])
  const [saving, setSaving] = useState(false)

  useEffect(() => { setItems(navSettings?.items || []) }, [navSettings])

  const sorted = [...items].sort((a, b) => (a.order || 0) - (b.order || 0))

  const updateField = (key, field, val) =>
    setItems((prev) => prev.map((i) => (i.key === key ? { ...i, [field]: val } : i)))

  const move = (key, dir) => {
    const arr = [...items].sort((a, b) => (a.order || 0) - (b.order || 0))
    const idx = arr.findIndex((i) => i.key === key)
    const j = idx + dir
    if (j < 0 || j >= arr.length) return
    ;[arr[idx], arr[j]] = [arr[j], arr[idx]]
    setItems(arr.map((i, n) => ({ ...i, order: n + 1 })))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const clean = [...items]
        .sort((a, b) => (a.order || 0) - (b.order || 0))
        .map((i, n) => ({ ...i, label: (i.label || '').trim() || i.key, order: n + 1, visible: i.visible !== false }))
      await saveNavSettings(clean)
      showToast('Navigation saved!')
    } catch (err) {
      alert('Save failed: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <h2 className="text-display" style={{ fontSize: '32px', marginBottom: 8 }}>Navigation</h2>
      <p style={{ color: 'var(--ash)', marginBottom: 32 }}>
        Rename, reorder and show/hide the main menu items. The <strong>Portfolio</strong> menu automatically
        lists your categories &amp; subcategories; <strong>About</strong> keeps its sub-links.
      </p>

      <div className="admin-card">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {sorted.map((item, idx) => (
            <div
              key={item.key}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 14px', border: '1px solid var(--pearl)',
                borderRadius: 10, background: item.visible !== false ? '#fff' : 'rgba(0,0,0,0.03)',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <button type="button" onClick={() => move(item.key, -1)} disabled={idx === 0} className="admin-gallery-btn" style={{ width: 24, height: 22 }}><ArrowUp size={11} /></button>
                <button type="button" onClick={() => move(item.key, 1)} disabled={idx === sorted.length - 1} className="admin-gallery-btn" style={{ width: 24, height: 22 }}><ArrowDown size={11} /></button>
              </div>
              <div className="admin-form-group" style={{ flex: 1, marginBottom: 0 }}>
                <input type="text" className="admin-input" value={item.label} onChange={(e) => updateField(item.key, 'label', e.target.value)} />
              </div>
              <span className="text-mono" style={{ fontSize: 11, color: 'var(--mist)', minWidth: 120 }}>{item.path || '(dynamic)'}</span>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--ash)', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                <input type="checkbox" checked={item.visible !== false} onChange={(e) => updateField(item.key, 'visible', e.target.checked)} />
                Visible
              </label>
            </div>
          ))}
        </div>

        <SaveBtn saving={saving} onClick={handleSave} type="button" className="btn-gold" style={{ width: '100%', justifyContent: 'center', height: 48, fontSize: 15, marginTop: 20 }}>
          Save Navigation
        </SaveBtn>
      </div>
    </div>
  )
}

/* ──────────────────────────────────────────────────────────
   ADMIN USER MANAGER
   ────────────────────────────────────────────────────────── */
function UserManager({ showToast, currentEmail, allowedEmails, refreshAdmins }) {
  const [form, setForm] = useState({ email: '', password: '', confirm: '' })
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')
  const [removing, setRemoving] = useState('')

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleCreate = async (e) => {
    e.preventDefault()
    setError('')

    const email = form.email.trim().toLowerCase()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.')
      return
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    if (form.password !== form.confirm) {
      setError('Passwords do not match.')
      return
    }
    if (allowedEmails.includes(email)) {
      setError('That email is already an admin.')
      return
    }

    setCreating(true)
    try {
      // 1. Create the Firebase Auth account (without disturbing this session).
      await createAuthUser(email, form.password)
      // 2. Add the email to the Firestore allowlist.
      await addAdminEmail(email)
      await refreshAdmins()
      setForm({ email: '', password: '', confirm: '' })
      showToast('Admin user created successfully!')
    } catch (err) {
      const code = err?.code || ''
      setError(
        code === 'auth/email-already-in-use'
          ? 'An account with this email already exists. (If they should be an admin, add them to the allowlist via Firebase console.)'
          : code === 'auth/weak-password'
          ? 'Password is too weak — use at least 6 characters.'
          : code === 'auth/invalid-email'
          ? 'Please enter a valid email address.'
          : err?.message || 'Failed to create user.'
      )
    } finally {
      setCreating(false)
    }
  }

  const handleRemove = async (email) => {
    if (email === currentEmail) {
      alert('You cannot remove your own admin access.')
      return
    }
    if (BOOTSTRAP_ADMINS.includes(email)) {
      alert('This is a bootstrap admin (set via environment) and cannot be removed here.')
      return
    }
    if (!window.confirm(`Revoke admin access for ${email}?\n\nNote: this removes their access to the panel. It does NOT delete their Firebase Auth login — delete that from the Firebase console if needed.`)) return

    setRemoving(email)
    try {
      await removeAdminEmail(email)
      await refreshAdmins()
      showToast('Admin access revoked.')
    } catch (err) {
      alert('Failed to revoke: ' + (err?.message || err))
    } finally {
      setRemoving('')
    }
  }

  return (
    <div>
      <h2 className="text-display" style={{ fontSize: '32px', marginBottom: 8 }}>Admin Users</h2>
      <p style={{ color: 'var(--ash)', marginBottom: 32 }}>
        Create new admin logins and manage who can access this panel.
      </p>

      {/* Create user */}
      <div className="admin-card" style={{ marginBottom: 32 }}>
        <h3 className="admin-card__title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <UserPlus size={18} /> Add New Admin
        </h3>
        <form onSubmit={handleCreate} style={{ marginTop: 16 }}>
          <div className="admin-form-group">
            <label>Email</label>
            <input
              type="email" name="email" className="admin-input"
              placeholder="newadmin@atticarch.com"
              value={form.email} onChange={handleChange} autoComplete="off" required
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="admin-form-group">
              <label>Password</label>
              <input
                type="password" name="password" className="admin-input"
                placeholder="Min. 6 characters"
                value={form.password} onChange={handleChange} autoComplete="new-password" required
              />
            </div>
            <div className="admin-form-group">
              <label>Confirm Password</label>
              <input
                type="password" name="confirm" className="admin-input"
                placeholder="Re-enter password"
                value={form.confirm} onChange={handleChange} autoComplete="new-password" required
              />
            </div>
          </div>
          {error && <p style={{ color: '#c0392b', fontSize: 13, margin: '4px 0 12px' }}>{error}</p>}
          <SaveBtn saving={creating} type="submit" className="btn-gold" style={{ justifyContent: 'center' }}>
            <UserPlus size={16} /> Create Admin User
          </SaveBtn>
        </form>
      </div>

      {/* Existing admins */}
      <div className="admin-card">
        <h3 className="admin-card__title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <ShieldCheck size={18} /> Current Admins ({allowedEmails.length})
        </h3>
        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {allowedEmails.length === 0 && (
            <p style={{ color: 'var(--ash)', fontSize: 14 }}>No admins found.</p>
          )}
          {allowedEmails.map((em) => {
            const isBootstrap = BOOTSTRAP_ADMINS.includes(em)
            const isSelf = em === currentEmail
            return (
              <div
                key={em}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '12px 16px', background: 'var(--cream)', borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--mist-light, #eee)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <ShieldCheck size={16} color="var(--gold)" />
                  <span style={{ fontSize: 14, color: 'var(--charcoal)' }}>{em}</span>
                  {isSelf && <span style={{ fontSize: 11, color: 'var(--gold-dark)', fontWeight: 600 }}>(you)</span>}
                  {isBootstrap && <span style={{ fontSize: 11, color: 'var(--ash)' }}>(env)</span>}
                </div>
                <button
                  type="button"
                  onClick={() => handleRemove(em)}
                  disabled={isSelf || isBootstrap || removing === em}
                  className="admin-gallery-btn admin-gallery-btn--danger"
                  style={{ width: 30, height: 30, opacity: (isSelf || isBootstrap) ? 0.35 : 1 }}
                  title={isSelf ? 'You cannot remove yourself' : isBootstrap ? 'Bootstrap admin (set via env)' : 'Revoke access'}
                >
                  {removing === em ? <Spinner size={12} /> : <Trash2 size={13} />}
                </button>
              </div>
            )
          })}
        </div>
        <p style={{ color: 'var(--ash)', fontSize: 12, marginTop: 16, lineHeight: 1.6 }}>
          Removing an admin revokes their panel access via the Firestore allowlist. It does not delete their
          Firebase Auth login — do that from the Firebase console if you want to fully disable the account.
        </p>
      </div>
    </div>
  )
}
