import { createContext, useContext, useState, useEffect } from 'react'
import {
  db,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
} from '../lib/firebase'
import {
  projects as staticProjects,
  blogPosts as staticBlogPosts,
  testimonials as staticTestimonials,
  workTypes as staticWorkTypes,
  pickImages,
} from '../data/siteData'

const DataContext = createContext()

// Predefined categories mapping matching site data
const defaultCategories = [
  { id: 'residential', title: 'Residential Projects', short: 'Residential', slug: 'projects-residential', filter: ['apartments', 'villas'], order: 1 },
  { id: 'apartments', title: 'Apartment Projects', short: 'Apartments', slug: 'projects-apartments', filter: ['apartments'], order: 2 },
  { id: 'villas', title: 'Villa Projects', short: 'Villas', slug: 'projects-villas', filter: ['villas'], order: 3 },
  { id: 'commercial', title: 'Commercial Projects', short: 'Commercial', slug: 'projects-commercial', filter: ['commercial'], order: 4 },
  { id: 'renovation', title: 'Renovation Projects', short: 'Renovation', slug: 'projects-renovation', filter: ['renovation'], order: 5 }
]

const defaultHeroSettings = {
  eyebrow: 'Award-Winning Bangalore Studio',
  titleLine1: 'Designing Homes',
  titleLine2: 'That Tell Your Story',
  subtitle: "Bangalore's award-winning interior design studio, crafting breathtaking spaces since 2002.",
  primaryCtaText: 'Free Consultation',
  primaryCtaPath: '/contact-us',
  secondaryCtaText: 'Explore Portfolio',
  secondaryCtaPath: '/project-category/projects-apartments',
  ytText: 'Watch Our Transformations',
  ytUrl: 'https://www.youtube.com/channel/UCYGM6iXNjQVNfW8Klw_oRWA',
  slides: staticProjects.slice(0, 5).map(p => ({ imageUrl: p.image, publicId: '' }))
}

const defaultStudioSettings = {
  eyebrow: 'Inside the Studio',
  title: 'Built Around You. Made by Hand.',
  desc: 'Every ATTICARCH home starts with a conversation, not a catalogue. Our in-house team of designers and on-site experts work side-by-side under one roof — drawing, picking materials and finishing each room with care, so the work lasts long after we hand over the keys.',
  highlights: [
    { value: '200+', label: 'Homes Finished' },
    { value: 'In-House', label: 'Design & Build Team' },
    { value: '100%', label: 'On-Site Supervision' },
    { value: '48 Hrs', label: 'Quick Quote' }
  ],
  images: pickImages(4, 84).map(url => ({ imageUrl: url, publicId: '' }))
}

const defaultYoutubeVideos = [
  { videoId: 'vcUMkExgiCw', title: 'ATTICARCH — Luxury Interior Design' },
  { videoId: 'N2QJ6ETLnaQ', title: 'ATTICARCH — Residential Transformation' },
  { videoId: 'XzEPJfpn4FI', title: 'ATTICARCH — Premium Villa Interiors' },
  { videoId: 'qRjYhNeu1To', title: 'Step Inside Modern Luxury with ATTICARCH' },
  { videoId: 'zPJQttiz4SQ', title: 'Luxury 4BHK Villa Interiors — Samruddhi Lake Drive' },
  { videoId: 'Kp0BATDxKFI', title: '3BHK Flat Interiors at Prestige Tranquility' },
  { videoId: 'yvptQo71mnw', title: '3BHK Apartment Tour — Prestige Song of the South' }
]

const defaultInstagramPosts = pickImages(12, 61).map((img) => ({
  imageUrl: img,
  link: 'https://www.instagram.com/atticarch2020/'
}))

const defaultWorkTypes = staticWorkTypes.map((title, i) => ({
  title,
  imageUrl: pickImages(16, 10)[i] || '',
  publicId: ''
}))

const defaultLandingSettings = {
  heroTitleLine1: 'Luxury Interiors in',
  heroTitleLine2: 'Bangalore',
  heroSubtitle: 'Free 3D Design + Detailed Quote in 48 Hours',
  bullets: [
    'Free 3D visualization of every room',
    '10-year workmanship warranty',
    'Turnkey execution — starts ₹4 Lacs'
  ],
  phone: '+919916666222',
  whatsapp: '919916666222',
  whatsappPrefill: "Hi ATTICARCH, I'd like a free interior design consultation.",
  benefits: [
    { iconName: 'Box', title: 'Free 3D Visualization', desc: 'See your home before we build it — photo-real renders included.' },
    { iconName: 'Palette', title: 'Material Selection', desc: '500+ finishes from premium brand partners, all visualized for you.' },
    { iconName: 'FileText', title: 'Detailed Quote', desc: 'Itemized BOQ with zero hidden costs — what you see is what you pay.' },
    { iconName: 'MapPin', title: 'On-site Survey', desc: 'Our designer visits your home and measures everything — free.' }
  ],
  stats: [
    { value: 1000, suffix: '+', label: 'Homes Delivered' },
    { value: 22, suffix: ' yrs', label: 'Since 2002' },
    { value: 4.8, suffix: '★', label: 'Google Rating', decimal: true },
    { value: 100, suffix: '%', label: 'On-Time Handover' }
  ],
  pricing: [
    {
      type: '1 BHK',
      starts: '₹4 Lacs',
      range: '₹4L – ₹6L',
      inclusions: 'Modular Kitchen, 1 Wardrobe, False Ceiling (Living), TV Unit, Basic Electrical'
    },
    {
      type: '2 BHK',
      starts: '₹6 Lacs',
      range: '₹6L – ₹10L',
      featured: true,
      inclusions: 'Modular Kitchen, 2 Wardrobes, Full False Ceiling, TV Unit + Crockery, Lighting & Electrical, Painting Included'
    },
    {
      type: '3 BHK +',
      starts: '₹10 Lacs',
      range: '₹10L – ₹18L',
      inclusions: 'Premium Modular Kitchen, 3+ Wardrobes, Full False Ceiling, TV + Crockery + Pooja, Premium Finishes, Bathroom Upgrades'
    }
  ],
  steps: [
    { num: '01', day: 'Day 1', title: 'Free Consultation Call', desc: 'A 20-minute call with our senior designer to understand your style, family needs and budget.' },
    { num: '02', day: 'Days 2-7', title: '3D Design & Quote', desc: 'You receive photo-real 3D renders of every room + a detailed itemized BOQ — completely free.' },
    { num: '03', day: 'Day 8 onwards', title: 'Execute & Move In', desc: 'Sign-off and we begin. Weekly progress photos, on-time handover, 10-year warranty.' }
  ],
  faqs: [
    { q: 'How much does interior design cost in Bangalore?', a: 'Our turnkey interior projects start at ₹4 Lacs for 1BHK, ₹6 Lacs for 2BHK and ₹10 Lacs for 3BHK+. You get an exact quote after the free consultation — no hidden costs, ever.' },
    { q: 'How long does a typical project take?', a: 'A 2BHK takes 45-60 days from sign-off to handover. 3BHK and villas: 60-90 days. We commit to a date in writing and pay you for delays.' },
    { q: 'What does the 10-year warranty cover?', a: 'Full workmanship warranty on all carpentry, modular units, false ceiling, electrical and plumbing work executed by us. We come back and fix anything, free.' },
    { q: 'Do you offer EMI or flexible payment plans?', a: 'Yes. We accept staged payments tied to project milestones and can also help arrange EMI through partner banks.' },
    { q: 'What brands and materials do you use?', a: 'CenturyPly, Kitply, Hettich, Blum, Saint-Gobain, Asian Paints, KAFF, Elica and more — all premium IS-certified brands you can verify.' },
    { q: 'Which areas in Bangalore do you serve?', a: 'All of Bangalore — Whitefield, Sarjapur, Electronic City, North Bangalore, JP Nagar, HSR Layout, Indiranagar and more. We have project teams across the city.' }
  ]
}

export function DataProvider({ children }) {
  const [loading, setLoading] = useState(true)
  const [dbError, setDbError] = useState(null)
  const [isDatabaseEmpty, setIsDatabaseEmpty] = useState(false)
  const [projects, setProjects] = useState(staticProjects)
  const [categories, setCategories] = useState(defaultCategories.filter(c => c.id !== 'residential'))
  const [testimonials, setTestimonials] = useState(staticTestimonials)
  const [blogPosts, setBlogPosts] = useState(staticBlogPosts)
  
  // Single document settings
  const [heroSettings, setHeroSettings] = useState(defaultHeroSettings)
  const [studioSettings, setStudioSettings] = useState(defaultStudioSettings)
  const [workTypes, setWorkTypes] = useState(defaultWorkTypes)
  const [youtubeVideos, setYoutubeVideos] = useState(defaultYoutubeVideos)
  const [instagramPosts, setInstagramPosts] = useState(defaultInstagramPosts)
  const [landingSettings, setLandingSettings] = useState(defaultLandingSettings)

  const fetchData = async () => {
    setLoading(true)
    setDbError(null)
    try {
      // 1. Projects
      const projectsSnap = await getDocs(collection(db, 'projects'))
      // 2. Categories
      const catsSnap = await getDocs(collection(db, 'categories'))

      const emptyDb = projectsSnap.empty && catsSnap.empty
      setIsDatabaseEmpty(emptyDb)

      if (!projectsSnap.empty) {
        const fetchedProjects = projectsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        setProjects(fetchedProjects)
      } else {
        setProjects(staticProjects)
      }

      if (!catsSnap.empty) {
        const fetchedCats = catsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        fetchedCats.sort((a, b) => (a.order || 0) - (b.order || 0))
        setCategories(fetchedCats.filter(c => c.id !== 'residential'))
      } else {
        setCategories(defaultCategories.filter(c => c.id !== 'residential'))
      }

      // 3. Testimonials
      const testSnap = await getDocs(collection(db, 'testimonials'))
      if (!testSnap.empty) {
        const fetchedTest = testSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        setTestimonials(fetchedTest)
      } else {
        setTestimonials(staticTestimonials)
      }

      // 4. Blog Posts
      const blogSnap = await getDocs(collection(db, 'blogPosts'))
      if (!blogSnap.empty) {
        const fetchedBlog = blogSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        setBlogPosts(fetchedBlog)
      } else {
        setBlogPosts(staticBlogPosts)
      }

      // 5. Homepage settings document
      const homeDocRef = doc(db, 'settings', 'homepage')
      const homeDocSnap = await getDoc(homeDocRef)
      if (homeDocSnap.exists()) {
        const data = homeDocSnap.data()
        if (data.hero) setHeroSettings({ ...defaultHeroSettings, ...data.hero })
        if (data.studio) setStudioSettings({ ...defaultStudioSettings, ...data.studio })
        if (data.workTypes) {
          const formatted = data.workTypes.map((item, i) => {
            if (typeof item === 'string') {
              return {
                title: item,
                imageUrl: defaultWorkTypes[i]?.imageUrl || '',
                publicId: ''
              }
            }
            return {
              title: item.title || '',
              imageUrl: item.imageUrl || defaultWorkTypes[i]?.imageUrl || '',
              publicId: item.publicId || ''
            }
          })
          setWorkTypes(formatted)
        } else {
          setWorkTypes(defaultWorkTypes)
        }
        if (data.youtube) setYoutubeVideos(data.youtube)
        if (data.instagram) setInstagramPosts(data.instagram)
      } else {
        setHeroSettings(defaultHeroSettings)
        setStudioSettings(defaultStudioSettings)
        setWorkTypes(defaultWorkTypes)
        setYoutubeVideos(defaultYoutubeVideos)
        setInstagramPosts(defaultInstagramPosts)
      }

      // Fetch landing page settings
      const landingDocRef = doc(db, 'settings', 'landingpage')
      const landingDocSnap = await getDoc(landingDocRef)
      if (landingDocSnap.exists()) {
        setLandingSettings({ ...defaultLandingSettings, ...landingDocSnap.data() })
      } else {
        setLandingSettings(defaultLandingSettings)
      }
    } catch (err) {
      console.error('Error fetching dynamic website data:', err)
      setDbError(err?.message || String(err))
      setIsDatabaseEmpty(false)
      // Fallback in case of absolute network/permission error
      setProjects(staticProjects)
      setCategories(defaultCategories)
      setTestimonials(staticTestimonials)
      setBlogPosts(staticBlogPosts)
      setHeroSettings(defaultHeroSettings)
      setStudioSettings(defaultStudioSettings)
      setWorkTypes(defaultWorkTypes)
      setYoutubeVideos(defaultYoutubeVideos)
      setInstagramPosts(defaultInstagramPosts)
      setLandingSettings(defaultLandingSettings)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Save Operations
  const saveProject = async (project) => {
    const stringId = String(project.id)
    const docRef = doc(db, 'projects', stringId)
    await setDoc(docRef, {
      ...project,
      id: stringId,
      createdAt: project.createdAt || new Date().toISOString()
    })
    await fetchData()
  }

  const deleteProject = async (id) => {
    await deleteDoc(doc(db, 'projects', String(id)))
    await fetchData()
  }

  const saveCategory = async (cat) => {
    const stringId = String(cat.id)
    const docRef = doc(db, 'categories', stringId)
    await setDoc(docRef, { ...cat, id: stringId })
    await fetchData()
  }

  const deleteCategory = async (id) => {
    await deleteDoc(doc(db, 'categories', String(id)))
    await fetchData()
  }

  const saveTestimonial = async (test) => {
    const stringId = String(test.id)
    const docRef = doc(db, 'testimonials', stringId)
    await setDoc(docRef, { ...test, id: stringId })
    await fetchData()
  }

  const deleteTestimonial = async (id) => {
    await deleteDoc(doc(db, 'testimonials', String(id)))
    await fetchData()
  }

  const saveBlogPost = async (post) => {
    const stringId = String(post.id)
    const docRef = doc(db, 'blogPosts', stringId)
    await setDoc(docRef, {
      ...post,
      id: stringId,
      createdAt: post.createdAt || new Date().toISOString()
    })
    await fetchData()
  }

  const deleteBlogPost = async (id) => {
    await deleteDoc(doc(db, 'blogPosts', String(id)))
    await fetchData()
  }

  const saveHomepageSetting = async (section, data) => {
    const docRef = doc(db, 'settings', 'homepage')
    const currentSnap = await getDoc(docRef)
    const currentData = currentSnap.exists() ? currentSnap.data() : {}
    await setDoc(docRef, {
      ...currentData,
      [section]: data
    })
    await fetchData()
  }

  const saveLandingSettings = async (data) => {
    const docRef = doc(db, 'settings', 'landingpage')
    await setDoc(docRef, data)
    await fetchData()
  }

  const bootstrapDatabase = async () => {
    setLoading(true)
    setDbError(null)
    try {
      // 1. Projects
      for (const p of staticProjects) {
        await setDoc(doc(db, 'projects', p.id), {
          ...p,
          createdAt: new Date().toISOString()
        })
      }
      
      // 2. Categories
      for (const c of defaultCategories) {
        await setDoc(doc(db, 'categories', c.id), c)
      }

      // 3. Testimonials
      for (const t of staticTestimonials) {
        // test ids are numbers, cast to string for firestore
        await setDoc(doc(db, 'testimonials', String(t.id)), {
          ...t,
          id: String(t.id),
          avatar: '' // default empty so it draws text initials fallback
        })
      }

      // 4. Blog Posts
      for (const b of staticBlogPosts) {
        await setDoc(doc(db, 'blogPosts', String(b.id)), {
          ...b,
          id: String(b.id)
        })
      }

      // 5. Settings document
      await setDoc(doc(db, 'settings', 'homepage'), {
        hero: defaultHeroSettings,
        studio: defaultStudioSettings,
        workTypes: defaultWorkTypes,
        youtube: defaultYoutubeVideos,
        instagram: defaultInstagramPosts
      })

      // 6. Landing Page Settings
      await setDoc(doc(db, 'settings', 'landingpage'), defaultLandingSettings)

      await fetchData()
      return { success: true }
    } catch (err) {
      console.error('Failed to bootstrap database:', err)
      setDbError(err?.message || String(err))
      throw err
    } finally {
      setLoading(false)
    }
  }

  return (
    <DataContext.Provider value={{
      loading,
      dbError,
      projects,
      categories,
      testimonials,
      blogPosts,
      heroSettings,
      studioSettings,
      workTypes,
      youtubeVideos,
      instagramPosts,
      landingSettings,
      saveProject,
      deleteProject,
      saveCategory,
      deleteCategory,
      saveTestimonial,
      deleteTestimonial,
      saveBlogPost,
      deleteBlogPost,
      saveHomepageSetting,
      saveLandingSettings,
      bootstrapDatabase,
      refresh: fetchData
    }}>
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error('useData must be used within a DataProvider')
  }
  return context
}
