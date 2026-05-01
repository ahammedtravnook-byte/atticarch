import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { ArrowRight, ArrowLeft, Home, Building2, Store, Paintbrush, Crown, Sparkles, Calculator, Download, Phone } from 'lucide-react'

function Reveal({ children, delay = 0 }) {
  return (
    <motion.div initial={{ opacity: 0, y: 60 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.8, delay, ease: [0.16,1,0.3,1] }}>
      {children}
    </motion.div>
  )
}

const propertyTypes = [
  { id: 'apartment', label: 'Apartment', icon: Building2, desc: '1-5 BHK flats' },
  { id: 'villa', label: 'Villa / Independent House', icon: Home, desc: 'Bungalows, villas, row houses' },
  { id: 'commercial', label: 'Commercial Space', icon: Store, desc: 'Office, showroom, retail' },
]

const bhkOptions = ['1 BHK', '2 BHK', '3 BHK', '4 BHK', '5 BHK', 'Penthouse']
const areaRanges = ['< 800 sq.ft', '800 - 1200 sq.ft', '1200 - 1800 sq.ft', '1800 - 2500 sq.ft', '2500 - 3500 sq.ft', '3500+ sq.ft']

const styleOptions = [
  { id: 'essential', label: 'Essential', icon: Paintbrush, desc: 'Clean, functional & budget-friendly', pricePerSqft: [800, 1200] },
  { id: 'premium', label: 'Premium', icon: Sparkles, desc: 'Designer finishes & curated materials', pricePerSqft: [1200, 2000] },
  { id: 'luxury', label: 'Luxury', icon: Crown, desc: 'Bespoke design, imported materials', pricePerSqft: [2000, 3500] },
]

const roomBreakdown = {
  'Living & Dining': 25,
  'Master Bedroom': 18,
  'Kitchen': 20,
  'Other Bedrooms': 15,
  'Bathrooms': 10,
  'Foyer & Balcony': 7,
  'Electrical & Plumbing': 5,
}

const areaMap = { '< 800 sq.ft': 700, '800 - 1200 sq.ft': 1000, '1200 - 1800 sq.ft': 1500, '1800 - 2500 sq.ft': 2150, '2500 - 3500 sq.ft': 3000, '3500+ sq.ft': 4000 }

export default function EstimateCalculator() {
  const [step, setStep] = useState(0)
  const [data, setData] = useState({ type: '', bhk: '', area: '', style: '' })

  const canProceed = [
    !!data.type,
    !!data.bhk,
    !!data.area,
    !!data.style,
  ]

  const getEstimate = () => {
    const sqft = areaMap[data.area] || 1500
    const style = styleOptions.find(s => s.id === data.style)
    if (!style) return { min: 0, max: 0 }
    return { min: Math.round(sqft * style.pricePerSqft[0] / 100000), max: Math.round(sqft * style.pricePerSqft[1] / 100000) }
  }

  const estimate = getEstimate()

  const steps = [
    // Step 0: Property Type
    <div key="type">
      <h2 className="text-heading" style={{ fontSize: 'var(--text-3xl)', marginBottom: 8 }}>What type of property?</h2>
      <p style={{ color: 'var(--ash)', marginBottom: 32 }}>Select your property type to get started</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {propertyTypes.map(t => (
          <button key={t.id} onClick={() => setData({ ...data, type: t.id })}
            style={{
              padding: 32, borderRadius: 'var(--radius-lg)', border: `2px solid ${data.type === t.id ? 'var(--gold)' : 'var(--pearl)'}`,
              background: data.type === t.id ? 'var(--gold-glow)' : 'var(--warm-white)', textAlign: 'center',
              cursor: 'pointer', transition: 'all 0.3s'
            }}>
            <t.icon size={32} color={data.type === t.id ? 'var(--gold)' : 'var(--ash)'} />
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-lg)', marginTop: 12 }}>{t.label}</h3>
            <p style={{ fontSize: 12, color: 'var(--ash)', marginTop: 4 }}>{t.desc}</p>
          </button>
        ))}
      </div>
    </div>,

    // Step 1: BHK
    <div key="bhk">
      <h2 className="text-heading" style={{ fontSize: 'var(--text-3xl)', marginBottom: 8 }}>Number of rooms?</h2>
      <p style={{ color: 'var(--ash)', marginBottom: 32 }}>Select your BHK configuration</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        {bhkOptions.map(b => (
          <button key={b} onClick={() => setData({ ...data, bhk: b })}
            style={{
              padding: '20px 24px', borderRadius: 'var(--radius-md)', border: `2px solid ${data.bhk === b ? 'var(--gold)' : 'var(--pearl)'}`,
              background: data.bhk === b ? 'var(--gold-glow)' : 'var(--warm-white)', cursor: 'pointer',
              fontFamily: 'var(--font-heading)', fontSize: 'var(--text-lg)', transition: 'all 0.3s',
              color: data.bhk === b ? 'var(--gold-dark)' : 'var(--smoke)',
            }}>
            {b}
          </button>
        ))}
      </div>
    </div>,

    // Step 2: Area
    <div key="area">
      <h2 className="text-heading" style={{ fontSize: 'var(--text-3xl)', marginBottom: 8 }}>Carpet area?</h2>
      <p style={{ color: 'var(--ash)', marginBottom: 32 }}>Select approximate carpet area</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        {areaRanges.map(a => (
          <button key={a} onClick={() => setData({ ...data, area: a })}
            style={{
              padding: '20px 24px', borderRadius: 'var(--radius-md)', border: `2px solid ${data.area === a ? 'var(--gold)' : 'var(--pearl)'}`,
              background: data.area === a ? 'var(--gold-glow)' : 'var(--warm-white)', cursor: 'pointer',
              fontFamily: 'var(--font-accent)', fontSize: 14, transition: 'all 0.3s',
              color: data.area === a ? 'var(--gold-dark)' : 'var(--smoke)',
            }}>
            {a}
          </button>
        ))}
      </div>
    </div>,

    // Step 3: Style
    <div key="style">
      <h2 className="text-heading" style={{ fontSize: 'var(--text-3xl)', marginBottom: 8 }}>Design style?</h2>
      <p style={{ color: 'var(--ash)', marginBottom: 32 }}>Choose your desired quality level</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {styleOptions.map(s => (
          <button key={s.id} onClick={() => setData({ ...data, style: s.id })}
            style={{
              padding: 32, borderRadius: 'var(--radius-lg)', border: `2px solid ${data.style === s.id ? 'var(--gold)' : 'var(--pearl)'}`,
              background: data.style === s.id ? 'var(--gold-glow)' : 'var(--warm-white)', textAlign: 'center',
              cursor: 'pointer', transition: 'all 0.3s'
            }}>
            <s.icon size={32} color={data.style === s.id ? 'var(--gold)' : 'var(--ash)'} />
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-lg)', marginTop: 12 }}>{s.label}</h3>
            <p style={{ fontSize: 12, color: 'var(--ash)', marginTop: 4 }}>{s.desc}</p>
            <p className="text-mono" style={{ fontSize: 12, color: 'var(--gold)', marginTop: 8 }}>₹{s.pricePerSqft[0]} - ₹{s.pricePerSqft[1]}/sq.ft</p>
          </button>
        ))}
      </div>
    </div>,

    // Step 4: Results
    <div key="results">
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <h2 className="text-heading" style={{ fontSize: 'var(--text-3xl)', marginBottom: 8 }}>Your Estimate</h2>
        <p style={{ color: 'var(--ash)' }}>Based on your selections, here's a rough estimate</p>
      </div>

      <div style={{ background: 'var(--charcoal)', borderRadius: 'var(--radius-xl)', padding: 40, textAlign: 'center', marginBottom: 32 }}>
        <p style={{ color: 'var(--mist)', fontFamily: 'var(--font-accent)', fontSize: 12, letterSpacing: '0.15em', textTransform: 'uppercase' }}>Estimated Cost Range</p>
        <motion.p className="text-mono" style={{ fontSize: 'var(--text-6xl)', fontWeight: 700, color: 'var(--gold)', marginTop: 8 }}
          initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.6, ease: [0.16,1,0.3,1] }}>
          ₹{estimate.min}L — ₹{estimate.max}L
        </motion.p>
        <p style={{ color: 'var(--ash)', fontSize: 13, marginTop: 8 }}>*Approximate estimate. Final cost may vary based on materials and scope.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 32 }}>
        <div style={{ background: 'var(--linen)', borderRadius: 'var(--radius-lg)', padding: 24 }}>
          <p style={{ fontSize: 12, color: 'var(--ash)', fontFamily: 'var(--font-accent)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Your Selections</p>
          <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8, fontSize: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--ash)' }}>Type</span><strong>{data.type}</strong></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--ash)' }}>Config</span><strong>{data.bhk}</strong></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--ash)' }}>Area</span><strong>{data.area}</strong></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--ash)' }}>Style</span><strong>{data.style}</strong></div>
          </div>
        </div>
        <div style={{ background: 'var(--linen)', borderRadius: 'var(--radius-lg)', padding: 24 }}>
          <p style={{ fontSize: 12, color: 'var(--ash)', fontFamily: 'var(--font-accent)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Cost Breakdown</p>
          <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13 }}>
            {Object.entries(roomBreakdown).map(([room, pct]) => (
              <div key={room} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--ash)' }}>{room}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 60, height: 4, background: 'var(--pearl)', borderRadius: 4, overflow: 'hidden' }}>
                    <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                      transition={{ duration: 1, delay: 0.3 }}
                      style={{ height: '100%', background: 'var(--gold)', borderRadius: 4 }} />
                  </div>
                  <span className="text-mono" style={{ fontSize: 11, color: 'var(--gold)' }}>{pct}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 16 }}>
        <Link to="/contact-us" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
          <Phone size={16} /> Book Free Consultation
        </Link>
        <button className="btn btn-outline" style={{ flex: 1, justifyContent: 'center' }} onClick={() => { setStep(0); setData({ type: '', bhk: '', area: '', style: '' }) }}>
          Recalculate
        </button>
      </div>
    </div>,
  ]

  return (
    <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <Helmet><title>Estimate Calculator — ATTICARCH Interior Design Cost Estimator</title></Helmet>

      <section style={{ background: 'var(--charcoal)', padding: '180px 0 60px' }}>
        <div className="container">
          <Reveal>
            <span className="section-label" style={{ color: 'var(--gold-light)' }}><Calculator size={14} /> Estimate Calculator</span>
            <h1 className="text-display" style={{ fontSize: 'var(--text-5xl)', color: 'var(--warm-white)' }}>
              Get Your Interior Design <span className="text-gold">Estimate</span>
            </h1>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 900 }}>
          {/* Progress */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 48 }}>
            {['Property', 'Rooms', 'Area', 'Style', 'Estimate'].map((s, i) => (
              <div key={i} style={{ flex: 1 }}>
                <div style={{ height: 4, borderRadius: 4, background: i <= step ? 'var(--gold)' : 'var(--pearl)', transition: 'background 0.4s' }} />
                <p style={{ fontSize: 10, marginTop: 6, fontFamily: 'var(--font-accent)', letterSpacing: '0.1em', textTransform: 'uppercase', color: i <= step ? 'var(--gold)' : 'var(--mist)' }}>{s}</p>
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={step}
              initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4, ease: [0.16,1,0.3,1] }}>
              {steps[step]}
            </motion.div>
          </AnimatePresence>

          {step < 4 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 40 }}>
              <button className="btn btn-outline" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}
                style={{ opacity: step === 0 ? 0.3 : 1 }}>
                <ArrowLeft size={16} /> Back
              </button>
              <button className="btn btn-primary" onClick={() => setStep(step + 1)} disabled={!canProceed[step]}
                style={{ opacity: canProceed[step] ? 1 : 0.4 }}>
                {step === 3 ? 'Get Estimate' : 'Next'} <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>
      </section>
    </motion.main>
  )
}
