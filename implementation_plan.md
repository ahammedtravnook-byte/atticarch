# 🏛️ ATTICARCH — Premium Interior Design Website
## Complete Implementation Plan

> **Brand:** ATTICARCH — Transforming Spaces, Transforming Lives
> **Location:** Bangalore, India | **Since:** 2002
> **Services:** Architectural Consultation, Interior Designing, Project Management

---

## 🎨 Design Philosophy & Color System

### Color Palette (NO blue/violet/pink — warm luxury tones only)

| Token | Hex | Usage |
|-------|-----|-------|
| `--gold` | `#C9A96E` | Primary accent, CTAs, highlights |
| `--gold-light` | `#D4B883` | Hover states, secondary accents |
| `--gold-dark` | `#A68B4B` | Active states |
| `--champagne` | `#F5E6C8` | Soft backgrounds, cards |
| `--cream` | `#FAF6F0` | Page backgrounds |
| `--ivory` | `#FFFFF0` | Light sections |
| `--charcoal` | `#1A1A1A` | Primary dark, hero sections |
| `--graphite` | `#2D2D2D` | Secondary dark |
| `--smoke` | `#3A3A3A` | Body text |
| `--ash` | `#6B6B6B` | Secondary text |
| `--mist` | `#B0B0B0` | Muted text |
| `--pearl` | `#E8E4DF` | Borders, dividers |
| `--warm-white` | `#FEFCF9` | Cards on cream bg |
| `--brand-orange` | `#E8700A` | Accent from existing brand |

### Typography

| Style | Font | Weight | Usage |
|-------|------|--------|-------|
| Display | **Playfair Display** | 700 | Hero headlines, section titles |
| Heading | **Cormorant Garamond** | 500-600 | Sub-headings, card titles |
| Body | **Inter** | 300-500 | Body text, navigation |
| Accent | **Outfit** | 400-600 | Labels, CTAs, badges |
| Mono | **Space Mono** | 400 | Numbers, stats |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | React 18 + Vite |
| **Routing** | React Router v6 |
| **Animations** | GSAP (ScrollTrigger, SplitText) + Framer Motion |
| **3D/WebGL** | Three.js + React Three Fiber (hero sections) |
| **Icons** | Lucide React |
| **Styling** | Vanilla CSS with CSS Custom Properties |
| **State** | React Context + useReducer |
| **Admin** | Dedicated /admin route with localStorage + JSON export |
| **Forms** | Custom form handling |
| **SEO** | React Helmet Async |
| **Image Optimization** | lazy loading + IntersectionObserver |

---

## 📄 Complete Page Architecture (26 Pages)

### Phase 1: Core Foundation (Pages 1-4)
| # | Page | Route | Priority |
|---|------|-------|----------|
| 01 | **Home Page** | `/` | 🔴 Critical |
| 02 | **About Us** | `/about-us` | 🔴 Critical |
| 03 | **How We Work** | `/how-we-work` | 🟡 High |
| 04 | **Contact Us** | `/contact-us` | 🔴 Critical |

### Phase 2: Services & Projects (Pages 5-12)
| # | Page | Route | Priority |
|---|------|-------|----------|
| 05 | **Services Hub** | `/services` | 🔴 Critical |
| 06 | **Home Interior** | `/services/home-interior-designers` | 🟡 High |
| 07 | **Luxury Interior** | `/services/luxury-interior-designers` | 🟡 High |
| 08 | **Residential Projects** | `/project-category/projects-residential` | 🔴 Critical |
| 09 | **Apartments Projects** | `/project-category/projects-apartments` | 🟡 High |
| 10 | **Villas Projects** | `/project-category/projects-villas` | 🟡 High |
| 11 | **Commercial Projects** | `/project-category/projects-commercial` | 🟡 High |
| 12 | **Renovation Projects** | `/project-category/projects-renovation` | 🟡 High |

### Phase 3: SEO Room Pages (Pages 13-20)
| # | Page | Route | Priority |
|---|------|-------|----------|
| 13 | **Kitchen Interior** | `/kitchen-interior-designers` | 🟢 Medium |
| 14 | **Living Room** | `/living-room` | 🟢 Medium |
| 15 | **Bedrooms** | `/bedrooms` | 🟢 Medium |
| 16 | **Foyer** | `/foyer` | 🟢 Medium |
| 17 | **Dining Room** | `/dining-room` | 🟢 Medium |
| 18 | **Kids Bedroom** | `/kids-bedroom` | 🟢 Medium |
| 19 | **Bathrooms** | `/bathrooms` | 🟢 Medium |
| 20 | **Balcony** | `/balcony` | 🟢 Medium |

### Phase 4: Blog & Templates (Pages 21-23)
| # | Page | Route | Priority |
|---|------|-------|----------|
| 21 | **Blog Listing** | `/blog` | 🟡 High |
| 22 | **Blog Post** | `/blog/:slug` | 🟡 High |
| 23 | **Project Detail** | `/project/:slug` | 🔴 Critical |

### Phase 5: Legal & Utility (Pages 24-26)
| # | Page | Route | Priority |
|---|------|-------|----------|
| 24 | **Sitemap** | `/sitemap` | 🟢 Medium |
| 25 | **Privacy Policy** | `/privacy-policy` | 🟢 Medium |
| 26 | **Terms of Use** | `/terms-of-use` | 🟢 Medium |

### Special Pages
| Page | Route | Purpose |
|------|-------|---------|
| **Google Ads Landing** | `/get-free-consultation` | Conversion-focused landing |
| **Admin Panel** | `/admin` | Dynamic content management |
| **Estimate Calculator** | `/estimate` (also embedded in Home) | Interactive cost estimator |

---

## 🏠 Page-by-Page Design & Animation Breakdown

### 01. HOME PAGE — The Showstopper

**Sections (in scroll order):**

1. **Hero Section** — Full-viewport cinematic hero
   - WebGL particle background with subtle golden shimmer
   - GSAP SplitText reveal on headline: "Transforming Spaces, Transforming Lives"
   - Parallax interior image with depth layers
   - Floating CTA with magnetic hover effect
   - Stats counter animating on view (22+ Years, 500+ Projects, 100% Satisfaction)
   
2. **Video Reel Section** — YouTube/Instagram embed carousel
   - Horizontal scroll carousel with GSAP snap
   - Video thumbnails with play overlay
   - Smooth modal video player
   
3. **Room Categories** — Interactive room explorer
   - 8 room types in a masonry/bento grid
   - Hover: image zoom + overlay text slide-in
   - Click navigates to room detail page
   - GSAP stagger reveal on scroll
   
4. **About Teaser** — Brand story snippet
   - Split layout: text left, image right
   - Image reveal with clip-path animation
   - Text lines animate in with GSAP SplitText
   
5. **How We Work** — Process timeline
   - 6 steps: Get Acquainted → Concept → Design Development → Register → Execution → Delivery
   - Horizontal scroll with pin effect (GSAP ScrollTrigger)
   - SVG path drawing connecting steps
   
6. **Services Showcase** — 3 pillars
   - Architectural, Interior Design, Project Management
   - Full-width cards with parallax images
   - Hover: card lifts with shadow + content reveals
   
7. **Estimate Calculator** (embedded mini version)
   - Room type selector, size input, style level
   - Animated price output
   - CTA to full calculator page
   
8. **Past Projects Gallery** — Featured works
   - Horizontal infinite scroll carousel
   - Categories: Villas, Apartments, Commercial, Renovation
   - Image hover: scale + golden border glow
   - GSAP-powered smooth drag
   
9. **Upcoming Projects** — Coming soon showcase
   - Timeline layout with progress bars
   - Animated countdown or "Coming Soon" badges
   
10. **Testimonials** — Client reviews
    - Auto-playing carousel with fade transitions
    - Star ratings, client photos, project photos
    
11. **Blog Preview** — Latest 3 posts
    - Card grid with image, title, excerpt
    - Stagger animation on scroll
    
12. **Instagram/Social Feed** — Dynamic embed
    - Grid of latest Instagram posts/reels
    - Admin-manageable links
    
13. **Contact CTA** — Full-width conversion section
    - Dark background with golden gradient text
    - Embedded quick form
    - Phone + WhatsApp floating buttons

**Animation Techniques:**
- Smooth locomotive scroll
- Parallax depth on all images (3+ layers)
- Custom cursor with magnetic effect on CTAs
- Page transition with clip-path wipe
- Loading screen with logo animation

---

### 02. ABOUT US — Our Story

**Sections:**
1. Hero with timeline counter (Since 2002 → 22+ years)
2. Mission & Vision with animated icons
3. Team section with hover flip cards
4. Company milestones timeline (vertical, scroll-animated)
5. Awards & certifications
6. Why choose us — animated stat cards

**Key Animations:**
- Text mask reveal on scroll
- Counter animations for stats
- Parallax image gallery
- SVG line drawing for timeline

---

### 03. HOW WE WORK — The Process

**Sections:**
1. Full-screen hero with process overview
2. 6-step interactive journey (horizontally pinned scroll)
3. Each step: icon + title + description + image
4. FAQ accordion at bottom

**Key Animations:**
- GSAP horizontal scroll pin
- Step indicator progress bar
- Icon morph transitions
- Clip-path image reveals

---

### 04. SERVICES — What We Do

**Sections:**
1. Hero with 3 service pillars
2. Interior Design deep-dive
3. Project Management deep-dive
4. Architectural Consultation deep-dive
5. Pricing tiers / engagement models

**Key Animations:**
- Tabbed interface with slide transitions
- Image comparison slider (before/after)
- Animated infographics

---

### 05-07. SERVICE SUB-PAGES (Home Interior / Luxury Interior)

**Sections:**
1. Service-specific hero
2. What's included grid
3. Before/after gallery
4. Room-by-room breakdown
5. Pricing guide
6. Related projects carousel

---

### 08-12. PROJECT CATEGORY PAGES

**Common Layout:**
1. Category hero with filter tabs
2. Masonry grid of projects
3. Filter by: type, location, size
4. Infinite scroll or pagination
5. CTA section

**Key Animations:**
- Filter with layout animation (Framer Motion)
- Image lazy loading with blur-up
- Hover: parallax tilt effect

---

### 13-20. ROOM TYPE SEO PAGES

**Template:**
1. Room-specific hero image
2. Design philosophy for that room
3. Inspiration gallery (generated images)
4. Tips & best practices
5. Related projects
6. CTA for consultation

---

### 21-22. BLOG PAGES

**Listing:** Card grid, category filter, search
**Post:** Clean reading layout, table of contents, related posts

---

### 23. PROJECT DETAIL TEMPLATE

1. Full-width hero image
2. Project info (location, size, type, year)
3. Full image gallery with lightbox
4. Design narrative
5. Before/after comparisons
6. Related projects

---

### ESTIMATE CALCULATOR (Special Page)

**Interactive multi-step form:**
1. **Step 1:** Property type (Apartment/Villa/Commercial)
2. **Step 2:** Number of rooms (BHK selection or custom)
3. **Step 3:** Room-by-room customization
   - Kitchen, Bedrooms, Living, Bathrooms, Balcony, Foyer
4. **Step 4:** Design style (Essential/Premium/Luxury)
5. **Step 5:** Results with animated breakdown
   - Per-room cost breakdown
   - Total estimate with range
   - PDF download option
   - Book consultation CTA

**Animation:** Step transitions with slide/scale, progress bar, animated counters

---

### GOOGLE ADS LANDING PAGE

**Single-page conversion focus:**
1. Hero with strong headline + form
2. Trust badges (22+ years, 500+ projects)
3. Before/after gallery (3 projects)
4. 3-step process
5. Testimonials (3)
6. Sticky form / floating CTA
7. No navigation — focused on conversion

---

### ADMIN PANEL (`/admin`)

**Sections:**
1. Login screen
2. Dashboard
3. **Media Manager** — Upload YouTube/Instagram links
4. **Projects Manager** — Add/edit/delete projects
5. **Blog Manager** — Add/edit/delete posts
6. **Testimonials Manager** — Manage reviews
7. **Settings** — Company info, phone, social links

> [!NOTE]
> Admin uses localStorage for MVP, with JSON import/export capability for data persistence.

---

## 🎭 Global Animation Strategy

### Scroll Animations (GSAP ScrollTrigger)
- **Text Reveals:** SplitText with stagger (word/char level)
- **Image Reveals:** clipPath wipe from bottom/left
- **Section Transitions:** Opacity + Y translate with scrub
- **Parallax:** Multi-layer depth on all hero images
- **Number Counters:** Animated counting on scroll entry
- **Progress Indicators:** SVG stroke-dashoffset animations

### Page Transitions (Framer Motion + GSAP)
- **Enter:** Clip-path circle expand from center
- **Exit:** Fade + scale down
- **Route change:** Smooth overlay slide

### Micro-Interactions
- **Custom cursor:** Blend mode difference, scales on hover
- **Magnetic buttons:** CTAs attract cursor
- **Hover cards:** 3D tilt with perspective
- **Loading states:** Skeleton screens with shimmer

### WebGL Effects (Three.js)
- **Home Hero:** Particle mesh forming interior shapes
- **Background:** Subtle noise grain texture
- **Image distortion:** On hover, images get slight WebGL distortion

---

## 📁 Project File Structure

```
atticarch/
├── public/
│   ├── fonts/
│   ├── images/
│   │   ├── hero/
│   │   ├── projects/
│   │   ├── rooms/
│   │   ├── team/
│   │   └── blog/
│   └── favicon.ico
├── src/
│   ├── assets/
│   │   └── Logo-org.png
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── CustomCursor.jsx
│   │   │   ├── PageTransition.jsx
│   │   │   ├── SmoothScroll.jsx
│   │   │   └── Preloader.jsx
│   │   ├── ui/
│   │   │   ├── Button.jsx
│   │   │   ├── SplitText.jsx
│   │   │   ├── ParallaxImage.jsx
│   │   │   ├── MagneticElement.jsx
│   │   │   ├── AnimatedCounter.jsx
│   │   │   ├── ImageReveal.jsx
│   │   │   ├── VideoModal.jsx
│   │   │   └── Carousel.jsx
│   │   ├── sections/
│   │   │   ├── Hero.jsx
│   │   │   ├── ServicesShowcase.jsx
│   │   │   ├── ProjectsGallery.jsx
│   │   │   ├── Testimonials.jsx
│   │   │   ├── EstimateCalcMini.jsx
│   │   │   ├── RoomExplorer.jsx
│   │   │   ├── ProcessTimeline.jsx
│   │   │   ├── BlogPreview.jsx
│   │   │   ├── SocialFeed.jsx
│   │   │   ├── ContactCTA.jsx
│   │   │   └── UpcomingProjects.jsx
│   │   └── admin/
│   │       ├── AdminLayout.jsx
│   │       ├── MediaManager.jsx
│   │       ├── ProjectsManager.jsx
│   │       ├── BlogManager.jsx
│   │       └── TestimonialsManager.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── About.jsx
│   │   ├── HowWeWork.jsx
│   │   ├── Services.jsx
│   │   ├── ServiceDetail.jsx
│   │   ├── ProjectCategory.jsx
│   │   ├── ProjectDetail.jsx
│   │   ├── RoomType.jsx
│   │   ├── Blog.jsx
│   │   ├── BlogPost.jsx
│   │   ├── Contact.jsx
│   │   ├── EstimateCalculator.jsx
│   │   ├── LandingPage.jsx
│   │   ├── Sitemap.jsx
│   │   ├── PrivacyPolicy.jsx
│   │   ├── TermsOfUse.jsx
│   │   └── admin/
│   │       ├── Login.jsx
│   │       ├── Dashboard.jsx
│   │       └── index.jsx
│   ├── data/
│   │   ├── projects.js
│   │   ├── services.js
│   │   ├── rooms.js
│   │   ├── testimonials.js
│   │   └── blog.js
│   ├── hooks/
│   │   ├── useGSAP.js
│   │   ├── useInView.js
│   │   ├── useMediaQuery.js
│   │   └── useSmoothScroll.js
│   ├── context/
│   │   ├── AdminContext.jsx
│   │   └── ThemeContext.jsx
│   ├── utils/
│   │   ├── animations.js
│   │   └── helpers.js
│   ├── styles/
│   │   ├── index.css
│   │   ├── variables.css
│   │   ├── reset.css
│   │   ├── typography.css
│   │   ├── animations.css
│   │   └── pages/
│   │       ├── home.css
│   │       ├── about.css
│   │       ├── services.css
│   │       ├── projects.css
│   │       ├── contact.css
│   │       ├── calculator.css
│   │       ├── admin.css
│   │       └── landing.css
│   ├── App.jsx
│   └── main.jsx
├── package.json
├── vite.config.js
└── index.html
```

---

## 🚀 Implementation Phases

### Phase 1 — Foundation & Home Page (Current Sprint)
- [x] Create implementation plan
- [x] Initialize Vite + React project
- [x] Set up design system (CSS variables, typography, reset)
- [x] Build global components (Header, Footer, CustomCursor, Preloader)
- [x] Build animation utility components (SplitText, ParallaxImage, etc.)
- [x] Generate all HD images for the website
- [x] **Build complete Home Page with all 13 sections**
- [x] Implement estimate calculator (mini + full page)
- [x] Set up React Router with all routes

### Phase 2 — Core Pages
- [x] About Us page
- [x] How We Work page
- [x] Services hub page
- [x] Service sub-pages (Home Interior, Luxury Interior)
- [x] Contact Us page

### Phase 3 — Projects & Portfolio
- [x] Project category pages (5 categories)
- [x] Project detail template
- [x] Past projects data population
- [x] Upcoming projects section

### Phase 4 — SEO & Content Pages
- [x] 8 Room type SEO pages
- [x] Blog listing + post template
- [x] Legal pages (Privacy, Terms, Sitemap)

### Phase 5 — Admin Panel & Landing Page
- [x] Admin authentication
- [x] Media manager (YouTube/Instagram links)
- [x] Projects CRUD
- [x] Blog CRUD
- [x] Google Ads landing page
- [x] Final polish & performance optimization

---

> [!IMPORTANT]
> **Starting Phase 1 now.** This plan covers all 26 pages + admin + calculator + landing page. Each page will have unique scroll animations and transitions, creating a truly premium experience.
