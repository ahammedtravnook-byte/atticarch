import { useState, useEffect } from 'react'
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom'
import { LayoutDashboard, Image as ImageIcon, Briefcase, FileText, Settings, LogOut, Plus, Trash2, Edit } from 'lucide-react'
import { Helmet } from 'react-helmet-async'

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  
  const navigate = useNavigate()
  const location = useLocation()

  // Simple auth using localStorage for MVP
  useEffect(() => {
    const auth = localStorage.getItem('atticarch_admin_auth')
    if (auth === 'true') {
      setIsAuthenticated(true)
    } else if (location.pathname !== '/admin') {
      navigate('/admin')
    }
  }, [location, navigate])

  const handleLogin = (e) => {
    e.preventDefault()
    // Hardcoded credentials for MVP
    if (username === 'admin' && password === 'atticarch@2024') {
      localStorage.setItem('atticarch_admin_auth', 'true')
      setIsAuthenticated(true)
      navigate('/admin/dashboard')
    } else {
      alert('Invalid credentials')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('atticarch_admin_auth')
    setIsAuthenticated(false)
    navigate('/admin')
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
              type="text" 
              placeholder="Username" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)}
              style={{ width: '100%', padding: '14px 16px', border: '1px solid var(--pearl)', borderRadius: 'var(--radius-md)', background: 'var(--cream)' }}
              required 
            />
            <input 
              type="password" 
              placeholder="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '14px 16px', border: '1px solid var(--pearl)', borderRadius: 'var(--radius-md)', background: 'var(--cream)' }}
              required 
            />
            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}>
              Login
            </button>
          </form>
        </div>
      </div>
    )
  }

  const menuItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Media Links', path: '/admin/media', icon: ImageIcon },
    { label: 'Projects', path: '/admin/projects', icon: Briefcase },
    { label: 'Blog Posts', path: '/admin/blog', icon: FileText },
    { label: 'Settings', path: '/admin/settings', icon: Settings },
  ]

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--cream)' }}>
      <Helmet><title>Admin Dashboard — ATTICARCH</title></Helmet>
      
      {/* Sidebar */}
      <aside style={{ width: 280, background: 'var(--charcoal)', color: 'var(--warm-white)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '32px 24px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <h2 className="text-heading" style={{ fontSize: 'var(--text-xl)', color: 'var(--gold)' }}>ATTICARCH Admin</h2>
        </div>
        <nav style={{ padding: '24px 16px', flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {menuItems.map(item => {
            const isActive = location.pathname === item.path
            return (
              <Link key={item.path} to={item.path} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', 
                borderRadius: 'var(--radius-md)', transition: 'all 0.2s',
                background: isActive ? 'rgba(201,169,110,0.15)' : 'transparent',
                color: isActive ? 'var(--gold)' : 'var(--mist)'
              }}>
                <item.icon size={18} />
                <span style={{ fontSize: 14, fontWeight: isActive ? 600 : 400 }}>{item.label}</span>
              </Link>
            )
          })}
        </nav>
        <div style={{ padding: '24px 16px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <button onClick={handleLogout} style={{
            display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', 
            width: '100%', color: 'var(--mist)', transition: 'color 0.2s'
          }}>
            <LogOut size={18} />
            <span style={{ fontSize: 14 }}>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: 40, overflowY: 'auto' }}>
        <Routes>
          <Route path="dashboard" element={<DashboardView />} />
          <Route path="media" element={<MediaManager />} />
          <Route path="projects" element={<PlaceholderView title="Projects Manager" desc="Add, edit, or remove portfolio projects." />} />
          <Route path="blog" element={<PlaceholderView title="Blog Manager" desc="Manage your blog posts and categories." />} />
          <Route path="settings" element={<PlaceholderView title="Website Settings" desc="Update contact info, social links, and SEO defaults." />} />
        </Routes>
      </main>
    </div>
  )
}

function DashboardView() {
  const stats = [
    { label: 'Total Projects', value: 12, icon: Briefcase },
    { label: 'Blog Posts', value: 8, icon: FileText },
    { label: 'Media Links', value: 5, icon: ImageIcon },
  ]
  return (
    <div>
      <h2 className="text-display" style={{ fontSize: 'var(--text-4xl)', marginBottom: 8 }}>Welcome Back, Admin</h2>
      <p style={{ color: 'var(--ash)', marginBottom: 40 }}>Here is an overview of your website content.</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
        {stats.map((s, i) => (
          <div key={i} style={{ background: 'var(--warm-white)', padding: 24, borderRadius: 'var(--radius-lg)', border: '1px solid var(--pearl)', display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{ width: 56, height: 56, borderRadius: 'var(--radius-md)', background: 'var(--gold-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <s.icon size={24} color="var(--gold)" />
            </div>
            <div>
              <span className="text-mono" style={{ fontSize: 'var(--text-3xl)', fontWeight: 700, color: 'var(--charcoal)', lineHeight: 1 }}>{s.value}</span>
              <p style={{ color: 'var(--ash)', fontSize: 13, marginTop: 4 }}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div style={{ marginTop: 40, background: 'var(--warm-white)', padding: 32, borderRadius: 'var(--radius-lg)', border: '1px solid var(--pearl)' }}>
        <h3 className="text-heading" style={{ fontSize: 'var(--text-2xl)', marginBottom: 16 }}>Quick Actions</h3>
        <div style={{ display: 'flex', gap: 16 }}>
          <button className="btn btn-primary"><Plus size={16} /> Add Project</button>
          <button className="btn btn-outline"><Plus size={16} /> Add Blog Post</button>
        </div>
      </div>
    </div>
  )
}

function MediaManager() {
  const [links, setLinks] = useState(() => {
    const saved = localStorage.getItem('atticarch_media_links')
    return saved ? JSON.parse(saved) : [
      { id: 1, type: 'youtube', title: 'Luxury Villa Tour', url: 'https://youtube.com/watch?v=example' }
    ]
  })
  const [newLink, setNewLink] = useState({ type: 'youtube', title: '', url: '' })

  const handleAdd = (e) => {
    e.preventDefault()
    if (!newLink.title || !newLink.url) return
    const updated = [...links, { ...newLink, id: Date.now() }]
    setLinks(updated)
    localStorage.setItem('atticarch_media_links', JSON.stringify(updated))
    setNewLink({ type: 'youtube', title: '', url: '' })
  }

  const handleDelete = (id) => {
    const updated = links.filter(l => l.id !== id)
    setLinks(updated)
    localStorage.setItem('atticarch_media_links', JSON.stringify(updated))
  }

  return (
    <div>
      <h2 className="text-display" style={{ fontSize: 'var(--text-4xl)', marginBottom: 8 }}>Media Links</h2>
      <p style={{ color: 'var(--ash)', marginBottom: 40 }}>Manage YouTube and Instagram embeds for the homepage reel.</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: 32 }}>
        <div style={{ background: 'var(--warm-white)', padding: 32, borderRadius: 'var(--radius-lg)', border: '1px solid var(--pearl)' }}>
          <h3 className="text-heading" style={{ fontSize: 'var(--text-xl)', marginBottom: 24 }}>Active Links</h3>
          {links.length === 0 ? (
            <p style={{ color: 'var(--mist)', fontStyle: 'italic' }}>No media links added yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {links.map(l => (
                <div key={l.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', background: 'var(--cream)', border: '1px solid var(--pearl)', borderRadius: 'var(--radius-md)' }}>
                  <div>
                    <span style={{ fontSize: 10, background: 'var(--gold-glow)', color: 'var(--gold-dark)', padding: '4px 8px', borderRadius: 4, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>{l.type}</span>
                    <h4 style={{ fontSize: 15, fontWeight: 500, color: 'var(--charcoal)', marginTop: 8 }}>{l.title}</h4>
                    <a href={l.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: 'var(--ash)', display: 'block', marginTop: 4 }}>{l.url}</a>
                  </div>
                  <button onClick={() => handleDelete(l.id)} style={{ color: 'red', padding: 8, background: 'rgba(255,0,0,0.1)', borderRadius: 'var(--radius-sm)' }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div style={{ background: 'var(--warm-white)', padding: 32, borderRadius: 'var(--radius-lg)', border: '1px solid var(--pearl)', height: 'max-content' }}>
          <h3 className="text-heading" style={{ fontSize: 'var(--text-xl)', marginBottom: 24 }}>Add New Link</h3>
          <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: 'var(--ash)', marginBottom: 6 }}>Platform</label>
              <select value={newLink.type} onChange={e => setNewLink({...newLink, type: e.target.value})} style={{ width: '100%', padding: 12, border: '1px solid var(--pearl)', borderRadius: 'var(--radius-md)', background: 'var(--cream)' }}>
                <option value="youtube">YouTube</option>
                <option value="instagram">Instagram Reel</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: 'var(--ash)', marginBottom: 6 }}>Title</label>
              <input type="text" placeholder="e.g. 4BHK Villa Tour" value={newLink.title} onChange={e => setNewLink({...newLink, title: e.target.value})} style={{ width: '100%', padding: 12, border: '1px solid var(--pearl)', borderRadius: 'var(--radius-md)', background: 'var(--cream)' }} required />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: 'var(--ash)', marginBottom: 6 }}>URL</label>
              <input type="url" placeholder="https://..." value={newLink.url} onChange={e => setNewLink({...newLink, url: e.target.value})} style={{ width: '100%', padding: 12, border: '1px solid var(--pearl)', borderRadius: 'var(--radius-md)', background: 'var(--cream)' }} required />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}>
              <Plus size={16} /> Add Link
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

function PlaceholderView({ title, desc }) {
  return (
    <div>
      <h2 className="text-display" style={{ fontSize: 'var(--text-4xl)', marginBottom: 8 }}>{title}</h2>
      <p style={{ color: 'var(--ash)', marginBottom: 40 }}>{desc}</p>
      <div style={{ background: 'var(--warm-white)', padding: 60, borderRadius: 'var(--radius-lg)', border: '1px solid var(--pearl)', textAlign: 'center' }}>
        <h3 className="text-heading" style={{ fontSize: 'var(--text-2xl)', color: 'var(--charcoal)', marginBottom: 8 }}>Coming Soon</h3>
        <p style={{ color: 'var(--ash)' }}>This feature will be available in the next phase of development.</p>
      </div>
    </div>
  )
}
