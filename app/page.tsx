'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Navbar from './components/Navbar'
import ScrollObserver from './components/ScrollObserver'

function WaitlistModal({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async () => {
    if (!email) return
    setStatus('loading')
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (res.ok) {
        setStatus('success')
        setMessage("You're on the list!")
      } else {
        setStatus('error')
        setMessage(data.error || 'Something went wrong')
      }
    } catch {
      setStatus('error')
      setMessage('Something went wrong')
    }
  }

  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ background: '#111827', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '40px', width: '100%', maxWidth: '440px', margin: '0 20px', position: 'relative' }}
      >
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: '20px', cursor: 'pointer', lineHeight: 1 }}
        >
          ✕
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,229,0,0.1)', border: '0.5px solid rgba(255,229,0,0.25)', padding: '5px 12px', borderRadius: '20px', marginBottom: '24px', width: 'fit-content' }}>
          <div style={{ width: '5px', height: '5px', background: '#FFE500', borderRadius: '50%' }}></div>
          <span className="gradient-text" style={{ fontSize: '11px', fontWeight: '600' }}>Now in beta</span>
        </div>
        <h2 style={{ color: '#fff', fontSize: '28px', fontWeight: '700', letterSpacing: '-0.02em', margin: '0 0 8px' }}>
          Your work belongs here.
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', lineHeight: '1.6', margin: '0 0 28px' }}>
          Join the waitlist and get early access when we launch.
        </p>
        {status === 'success' ? (
          <div style={{ background: 'rgba(255,229,0,0.1)', border: '0.5px solid rgba(255,229,0,0.3)', borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>👑</div>
            <div style={{ color: '#FFE500', fontWeight: '700', fontSize: '16px' }}>{message}</div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', marginTop: '4px' }}>We'll be in touch soon.</div>
          </div>
        ) : (
          <>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: '0.5px solid rgba(255,255,255,0.12)', borderRadius: '10px', padding: '14px 16px', fontSize: '14px', color: '#fff', outline: 'none', marginBottom: '12px', boxSizing: 'border-box' as const, fontFamily: 'var(--font-inter), sans-serif' }}
            />
            {status === 'error' && (
              <div style={{ color: 'rgba(255,100,100,0.8)', fontSize: '12px', marginBottom: '10px' }}>{message}</div>
            )}
            <button
              onClick={handleSubmit}
              disabled={status === 'loading'}
              style={{ width: '100%', background: '#FFE500', color: '#000', fontSize: '14px', fontWeight: '700', padding: '14px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-inter), sans-serif' }}
            >
              {status === 'loading' ? '...' : 'Join the waitlist'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const bgRef = useRef<SVGSVGElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsMobile(window.innerWidth < 768)
    if (window.innerWidth >= 768) {
      const handleScroll = () => {
        if (bgRef.current) {
          const scrollY = window.scrollY
          bgRef.current.style.transform = `translate(-50%, calc(-50% + ${scrollY * 0.15}px)) scale(${1 + scrollY * 0.0003})`
        }
      }
      window.addEventListener('scroll', handleScroll, { passive: true })
      return () => window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const marqueeItems = [
    'LUTs', 'Shot List Creator', 'Invoice Generator',
    'Built For Creators', 'Creator Verified', 'Where Standards Are Set',
    'Verified', 'Shot List Creator', 'Invoice Generator',
    'Built By Creatives', 'Creative Centered', 'Where Standards Are Set',
  ]

  const features = [
    {
      title: 'LUT marketplace',
      desc: 'Browse and download verified LUTs with real proof of use attached.',
      href: '/marketplace',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="12 4 9.22 9.27 3 10.11 7.5 14.21 6.44 20 12 17.27 17.56 20 16.5 14.21 21 10.11 14.78 9.27 12 4" stroke="#FFE500" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
        </svg>
      ),
    },
    {
      title: 'Shot list creator',
      desc: 'Generate a shoot-specific shot list for sports, events, and more.',
      href: '/tools',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8.707 6.707a1 1 0 0 0-1.414-1.414L4 8.586 2.707 7.293a1 1 0 0 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4ZM12 7a1 1 0 1 0 0 2h10a1 1 0 1 0 0-2H12ZM8.707 13.293a1 1 0 0 1 0 1.414l-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 1 1 1.414-1.414L4 16.586l3.293-3.293a1 1 0 0 1 1.414 0ZM12 15a1 1 0 1 0 0 2h10a1 1 0 1 0 0-2H12Z" fill="#FFE500"/>
        </svg>
      ),
    },
    {
      title: 'Invoice generator',
      desc: 'Create clean client invoices in seconds. No templates needed.',
      href: '/tools',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16,3 C17.597725,3 18.903664,4.24892392 18.9949075,5.82372764 L19,6 L19,16 L19.75,16 C20.39725,16 20.9295391,16.4918359 20.9935469,17.1221875 L21,17.25 L21,19 C21,20.597725 19.7511226,21.903664 18.1762773,21.9949075 L18,22 L8,22 C6.40232321,22 5.09633941,20.7511226 5.00509271,19.1762773 L5,19 L5,9 L3.25,9 C2.6027875,9 2.07046563,8.50812891 2.00645356,7.87780591 L2,7.75 L2,6 C2,4.40232321 3.24892392,3.09633941 4.82372764,3.00509271 L5,3 L16,3 Z M16,5 L7,5 L7,19 C7,19.5523 7.44772,20 8,20 C8.55228,20 9,19.5523 9,19 L9,17.25 C9,16.5596 9.55964,16 10.25,16 L17,16 L17,6 C17,5.44772 16.5523,5 16,5 Z M19,18 L11,18 L11,19 C11,19.3506 10.9398,19.6872 10.8293,20 L18,20 C18.5523,20 19,19.5523 19,19 L19,18 Z M12,12 C12.5523,12 13,12.4477 13,13 C13,13.5523 12.5523,14 12,14 L10,14 C9.44772,14 9,13.5523 9,13 C9,12.4477 9.44772,12 10,12 L12,12 Z M14,8 C14.5523,8 15,8.44772 15,9 C15,9.55228 14.5523,10 14,10 L10,10 C9.44772,10 9,9.55228 9,9 C9,8.44772 9.44772,8 10,8 L14,8 Z" fill="#FFE500"/>
        </svg>
      ),
    },
  ]

  const crownPackages = [
    {
      name: 'Starter',
      crowns: 500,
      price: '$4.99',
      desc: 'Perfect for trying out the marketplace.',
      perks: ['500 Crowns', 'Unlock Node tier LUTs', 'Send Crowns to creators', 'Never expires'],
      featured: false,
    },
    {
      name: 'Creator',
      crowns: 1200,
      price: '$9.99',
      desc: 'The sweet spot for active creators.',
      perks: ['1,200 Crowns', 'Unlock Verified tier LUTs or Assets', 'Send Crowns to creators', 'Never expires', 'Early access to new features', '20% bonus Crowns'],
      featured: true,
    },
    {
      name: 'Studio',
      crowns: 2500,
      price: '$19.99',
      desc: 'For creators who go all in.',
      perks: ['2,500 Crowns', 'Unlock all tiers', 'Send Crowns to creators', 'Never expires', 'Early access to new features', '25% bonus Crowns'],
      featured: false,
    },
  ]

  return (
    <main style={{ minHeight: '100vh', fontFamily: 'var(--font-inter), sans-serif', position: 'relative' }}>

      {modalOpen && <WaitlistModal onClose={() => setModalOpen(false)} />}

      <style>{`
        @keyframes pulse-node { 0%,100%{opacity:.5} 50%{opacity:1} }
        @keyframes pulse-node-sm { 0%,100%{opacity:.2} 50%{opacity:.6} }
        @keyframes glow-line { 0%,100%{opacity:.08} 50%{opacity:.2} }
        @keyframes marquee { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        @keyframes float { 0%,100%{transform:translateY(0) rotate(-6deg)} 50%{transform:translateY(-6px) rotate(-4deg)} }
        .marquee-track { display:flex; width:max-content; animation:marquee 20s linear infinite; }
        .feature-link { text-decoration: none; display: block; }
        .pricing-card { transition: transform 0.2s ease, border-color 0.2s ease; }
        .pricing-card:hover { transform: translateY(-4px); }
        .crown-slap { animation: float 4s ease-in-out infinite; }
        @media (max-width: 768px) {
          .desktop-only { display: none !important; }
        }
      `}</style>

      {/* Hero background - desktop only */}
      {!isMobile && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '100vh', zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -55%)', width: '700px', height: '700px', opacity: 0.04 }}>
            <Image src="/CROWN-TRANSPARENT.png" alt="" fill style={{ objectFit: 'contain' }} />
          </div>
          <svg ref={bgRef} width="1600" height="1600" viewBox="0 0 1600 1600" fill="none"
            style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', transformOrigin: 'center', willChange: 'transform' }}>
            <circle cx="800" cy="800" r="4" fill="#FFE500" style={{ animation: 'pulse-node 2.5s ease-in-out infinite' }}/>
            <circle cx="300" cy="300" r="3" fill="#FFE500" style={{ animation: 'pulse-node-sm 4s ease-in-out infinite 0.5s' }}/>
            <circle cx="1300" cy="250" r="3" fill="#FFE500" style={{ animation: 'pulse-node-sm 3.5s ease-in-out infinite 1s' }}/>
            <circle cx="200" cy="900" r="2.5" fill="#FFE500" style={{ animation: 'pulse-node-sm 4.5s ease-in-out infinite 0.2s' }}/>
            <circle cx="1400" cy="950" r="3" fill="#FFE500" style={{ animation: 'pulse-node-sm 3s ease-in-out infinite 1.5s' }}/>
            <circle cx="700" cy="150" r="2" fill="#FFE500" style={{ animation: 'pulse-node-sm 5s ease-in-out infinite 0.8s' }}/>
            <circle cx="1450" cy="600" r="2.5" fill="#FFE500" style={{ animation: 'pulse-node-sm 3.8s ease-in-out infinite 0.3s' }}/>
            <circle cx="150" cy="600" r="2" fill="#FFE500" style={{ animation: 'pulse-node-sm 4.2s ease-in-out infinite 1.2s' }}/>
            <circle cx="900" cy="1400" r="2.5" fill="#FFE500" style={{ animation: 'pulse-node-sm 3.3s ease-in-out infinite 0.7s' }}/>
            <circle cx="500" cy="1300" r="2" fill="#FFE500" style={{ animation: 'pulse-node-sm 4.8s ease-in-out infinite 0.4s' }}/>
            <circle cx="1100" cy="400" r="2.5" fill="#FFE500" style={{ animation: 'pulse-node-sm 3.6s ease-in-out infinite 1.8s' }}/>
            <circle cx="450" cy="700" r="2" fill="#FFE500" style={{ animation: 'pulse-node-sm 4s ease-in-out infinite 0.9s' }}/>
            <circle cx="1150" cy="1100" r="2.5" fill="#FFE500" style={{ animation: 'pulse-node-sm 3.2s ease-in-out infinite 1.1s' }}/>
            <circle cx="600" cy="1050" r="2" fill="#FFE500" style={{ animation: 'pulse-node-sm 4.4s ease-in-out infinite 0.6s' }}/>
            <circle cx="1050" cy="700" r="2" fill="#FFE500" style={{ animation: 'pulse-node-sm 3.9s ease-in-out infinite 1.3s' }}/>
            <line x1="800" y1="800" x2="300" y2="300" stroke="#FFE500" strokeWidth="0.5" style={{ animation: 'glow-line 4s ease-in-out infinite' }}/>
            <line x1="800" y1="800" x2="1300" y2="250" stroke="#FFE500" strokeWidth="0.5" style={{ animation: 'glow-line 3.5s ease-in-out infinite 0.5s' }}/>
            <line x1="800" y1="800" x2="200" y2="900" stroke="#FFE500" strokeWidth="0.5" style={{ animation: 'glow-line 4.5s ease-in-out infinite 1s' }}/>
            <line x1="800" y1="800" x2="1400" y2="950" stroke="#FFE500" strokeWidth="0.5" style={{ animation: 'glow-line 3s ease-in-out infinite 0.3s' }}/>
            <line x1="800" y1="800" x2="700" y2="150" stroke="#FFE500" strokeWidth="0.5" style={{ animation: 'glow-line 4.2s ease-in-out infinite 1.5s' }}/>
            <line x1="800" y1="800" x2="1450" y2="600" stroke="#FFE500" strokeWidth="0.5" style={{ animation: 'glow-line 3.8s ease-in-out infinite 0.8s' }}/>
            <line x1="800" y1="800" x2="150" y2="600" stroke="#FFE500" strokeWidth="0.5" style={{ animation: 'glow-line 4.8s ease-in-out infinite 0.2s' }}/>
            <line x1="800" y1="800" x2="900" y2="1400" stroke="#FFE500" strokeWidth="0.5" style={{ animation: 'glow-line 3.6s ease-in-out infinite 1.2s' }}/>
            <line x1="800" y1="800" x2="500" y2="1300" stroke="#FFE500" strokeWidth="0.5" style={{ animation: 'glow-line 4s ease-in-out infinite 0.6s' }}/>
            <line x1="800" y1="800" x2="1100" y2="400" stroke="#FFE500" strokeWidth="0.5" style={{ animation: 'glow-line 3.4s ease-in-out infinite 1.4s' }}/>
            <line x1="800" y1="800" x2="450" y2="700" stroke="#FFE500" strokeWidth="0.5" style={{ animation: 'glow-line 4.6s ease-in-out infinite 0.1s' }}/>
            <line x1="800" y1="800" x2="1150" y2="1100" stroke="#FFE500" strokeWidth="0.5" style={{ animation: 'glow-line 3.2s ease-in-out infinite 1.8s' }}/>
            <line x1="800" y1="800" x2="600" y2="1050" stroke="#FFE500" strokeWidth="0.5" style={{ animation: 'glow-line 4.4s ease-in-out infinite 0.4s' }}/>
            <line x1="800" y1="800" x2="1050" y2="700" stroke="#FFE500" strokeWidth="0.5" style={{ animation: 'glow-line 3.9s ease-in-out infinite 1.1s' }}/>
            <line x1="300" y1="300" x2="700" y2="150" stroke="#FFE500" strokeWidth="0.3" opacity="0.06"/>
            <line x1="1300" y1="250" x2="1450" y2="600" stroke="#FFE500" strokeWidth="0.3" opacity="0.06"/>
            <line x1="200" y1="900" x2="500" y2="1300" stroke="#FFE500" strokeWidth="0.3" opacity="0.06"/>
            <line x1="1400" y1="950" x2="1150" y2="1100" stroke="#FFE500" strokeWidth="0.3" opacity="0.06"/>
            <line x1="450" y1="700" x2="150" y2="600" stroke="#FFE500" strokeWidth="0.3" opacity="0.06"/>
            <line x1="1050" y1="700" x2="1100" y2="400" stroke="#FFE500" strokeWidth="0.3" opacity="0.06"/>
            <line x1="600" y1="1050" x2="900" y2="1400" stroke="#FFE500" strokeWidth="0.3" opacity="0.06"/>
          </svg>
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '250px', background: 'linear-gradient(to bottom, transparent, #0a0a0a)', pointerEvents: 'none' }}/>
        </div>
      )}

      <div style={{ position: 'relative', zIndex: 1 }}>
        <ScrollObserver />
        <Navbar onJoinWaitlist={() => setModalOpen(true)} />

        {/* Hero */}
        <section style={{ padding: isMobile ? '60px 24px 40px' : '90px 40px 60px', maxWidth: '680px', margin: '0 auto', textAlign: 'center' }}>
          <div className="hero-animate-0" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,229,0,0.1)', border: '0.5px solid rgba(255,229,0,0.25)', padding: '5px 12px', borderRadius: '20px', marginBottom: '28px' }}>
            <div style={{ width: '5px', height: '5px', background: '#FFE500', borderRadius: '50%' }}></div>
            <span className="gradient-text" style={{ fontSize: '11px', fontWeight: '600' }}>Now in beta</span>
          </div>
          <h1 className="hero-animate-1" style={{ color: '#fff', fontSize: isMobile ? '36px' : '56px', fontWeight: '700', letterSpacing: '-0.03em', lineHeight: '1.04', margin: '0 0 20px' }}>
            Where the<br /><span className="gradient-text">standards are set.</span>
          </h1>
          <p className="hero-animate-2" style={{ color: 'rgba(255,255,255,0.45)', fontSize: '16px', lineHeight: '1.7', margin: '0 auto 36px', maxWidth: '420px' }}>
            Built by creators, for creators. From tools to assets, we've got you covered.
          </p>
          <div className="hero-animate-3" style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' as const }}>
            <button onClick={() => setModalOpen(true)} className="btn-primary" style={{ background: '#FFE500', color: '#000', fontSize: '14px', fontWeight: '700', padding: '13px 26px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>
              Join the waitlist
            </button>
            <a href="/tools" className="btn-ghost" style={{ background: 'transparent', color: 'rgba(255,255,255,0.5)', fontSize: '14px', fontWeight: '500', padding: '13px 26px', borderRadius: '8px', border: '0.5px solid rgba(255,255,255,0.15)', textDecoration: 'none' }}>
              Browse Tools
            </a>
          </div>
        </section>

        {/* Marquee */}
        <div style={{ background: '#FFE500', overflow: 'hidden', padding: '8px 0' }}>
          <div className="marquee-track">
            {marqueeItems.map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                <span style={{ color: '#000', fontSize: '12px', fontWeight: '700', letterSpacing: '0.04em', whiteSpace: 'nowrap', padding: '0 20px' }}>
                  {item.toUpperCase()}
                </span>
                <span style={{ color: '#000', fontSize: '10px', opacity: 0.4 }}>✦</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: '40px', padding: '24px 40px', borderBottom: '0.5px solid rgba(255,255,255,0.06)', justifyContent: 'center' }}>
          {[['Free', 'To get started'], ['Verified', 'By creators'], ['Standards', 'Are set']].map(([val, label], i) => (
            <div key={val} className={`fade-up fade-up-delay-${i + 1}`}>
              <div className="gradient-text" style={{ fontSize: '20px', fontWeight: '700', letterSpacing: '-0.02em' }}>{val}</div>
              <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px', marginTop: '2px' }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Features */}
        <section style={{ padding: isMobile ? '40px 24px' : '64px 40px', textAlign: 'center' }}>
          <div className="fade-up" style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase' as const, marginBottom: '10px' }}>What's on Nodable</div>
          <h2 className="fade-up fade-up-delay-1" style={{ color: '#fff', fontSize: isMobile ? '24px' : '32px', fontWeight: '700', letterSpacing: '-0.02em', margin: '0 0 32px' }}>Every tool you need.<br />Nothing you don't.</h2>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '12px', textAlign: 'left' }}>
            {features.map((f, i) => (
              <a key={f.title} href={f.href} className={`feature-link card-hover fade-up fade-up-delay-${i + 1}`} style={{ background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '24px' }}>
                <div style={{ width: '40px', height: '40px', background: 'rgba(255,229,0,0.08)', borderRadius: '10px', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {f.icon}
                </div>
                <div style={{ color: '#fff', fontSize: '15px', fontWeight: '700', marginBottom: '8px' }}>{f.title}</div>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', lineHeight: '1.6' }}>{f.desc}</div>
              </a>
            ))}
          </div>
        </section>

        {/* Verified strip */}
        <div className="fade-up" style={{ margin: isMobile ? '0 24px 40px' : '0 40px 56px', background: 'rgba(255,229,0,0.05)', border: '0.5px solid rgba(255,229,0,0.15)', borderRadius: '12px', padding: '24px 28px' }}>
          <div style={{ color: '#fff', fontSize: '15px', fontWeight: '700', marginBottom: '6px' }}>Creator verified.</div>
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', lineHeight: '1.6' }}>Every LUT requires a clip/photo showing real use, a before/after image, or manual review. No filler packs.</div>
        </div>

        {/* CTA */}
        <div ref={ctaRef} className="fade-up" style={{ margin: isMobile ? '0 24px' : '0 40px 0', background: '#FFE500', borderRadius: '14px', padding: isMobile ? '32px 24px' : '40px', display: 'flex', alignItems: isMobile ? 'flex-start' : 'center', justifyContent: 'space-between', gap: '24px', flexDirection: isMobile ? 'column' as const : 'row' as const }}>
          <div>
            <h3 style={{ color: '#000', fontSize: isMobile ? '22px' : '26px', fontWeight: '700', letterSpacing: '-0.02em', margin: '0 0 6px' }}>Your work belongs here.</h3>
            <p style={{ color: 'rgba(0,0,0,0.55)', fontSize: '14px', margin: 0 }}>Join the waitlist and get early access when we launch.</p>
          </div>
          <button onClick={() => setModalOpen(true)} className="btn-primary" style={{ background: '#000', color: '#FFE500', fontSize: '14px', fontWeight: '700', padding: '13px 26px', borderRadius: '8px', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap' as const, fontFamily: 'var(--font-inter), sans-serif' }}>
            Join the waitlist
          </button>
        </div>

        {/* Nodes & Crowns */}
        <section style={{ padding: isMobile ? '60px 24px 40px' : '100px 40px 80px' }}>
          <div className="fade-up" style={{ textAlign: 'center', marginBottom: '64px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
              <Image
                src="/CROWN-PFP.png"
                alt="Nodable"
                width={72}
                height={72}
                className="crown-slap"
                style={{ borderRadius: '16px', boxShadow: '0 8px 32px rgba(255,229,0,0.2)' }}
              />
            </div>
            <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase' as const, marginBottom: '12px' }}>The Nodable network</div>
            <h2 style={{ color: '#fff', fontSize: isMobile ? '30px' : '40px', fontWeight: '700', letterSpacing: '-0.03em', lineHeight: '1.06', margin: '0 0 16px' }}>
              Earn your place<br />in the <span className="gradient-text">network.</span>
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '15px', lineHeight: '1.7', maxWidth: '460px', margin: '0 auto' }}>
              Nodable isn't just a marketplace. It's a living network where your reputation and contributions actually mean something.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px' }}>
            <div className="fade-up fade-up-delay-1" style={{ background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '40px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(255,229,0,0.06) 0%, transparent 70%)', pointerEvents: 'none' }}/>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <div style={{ width: '44px', height: '44px', background: 'rgba(255,229,0,0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="3" fill="#FFE500"/>
                    <circle cx="4" cy="6" r="2" fill="#FFE500" opacity="0.5"/>
                    <circle cx="20" cy="6" r="2" fill="#FFE500" opacity="0.5"/>
                    <circle cx="4" cy="18" r="2" fill="#FFE500" opacity="0.5"/>
                    <circle cx="20" cy="18" r="2" fill="#FFE500" opacity="0.5"/>
                    <line x1="12" y1="12" x2="4" y2="6" stroke="#FFE500" strokeWidth="1" opacity="0.3"/>
                    <line x1="12" y1="12" x2="20" y2="6" stroke="#FFE500" strokeWidth="1" opacity="0.3"/>
                    <line x1="12" y1="12" x2="4" y2="18" stroke="#FFE500" strokeWidth="1" opacity="0.3"/>
                    <line x1="12" y1="12" x2="20" y2="18" stroke="#FFE500" strokeWidth="1" opacity="0.3"/>
                  </svg>
                </div>
                <div>
                  <div style={{ color: '#fff', fontSize: '18px', fontWeight: '700', letterSpacing: '-0.02em' }}>Nodes</div>
                  <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px' }}>Your reputation score</div>
                </div>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '14px', lineHeight: '1.7', marginBottom: '28px' }}>
                Nodes represent your standing in the Nodable network. They grow every time you upload a verified LUT or asset, earn downloads, or connect with other creators. <br /><br />You can't buy Nodes — you earn them.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '10px' }}>
                {['Upload a verified LUT or Asset', 'Earn downloads on your work', 'Connect with other creators', 'Get Crowned by the community'].map((item) => (
                  <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'linear-gradient(135deg, #FFE500, #FF8C00)', flexShrink: 0 }}/>
                    <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>{item}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: '32px', padding: '16px 20px', background: 'rgba(255,229,0,0.06)', borderRadius: '10px', border: '0.5px solid rgba(255,229,0,0.12)' }}>
                <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px', marginBottom: '4px' }}>Example profile</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}>@framesbymatt</span>
                  <span style={{ background: 'rgba(255,229,0,0.15)', color: '#FFE500', fontSize: '11px', fontWeight: '600', padding: '2px 8px', borderRadius: '4px' }}>847 Nodes</span>
                </div>
              </div>
            </div>

            <div className="fade-up fade-up-delay-2" style={{ background: 'rgba(255,229,0,0.04)', border: '0.5px solid rgba(255,229,0,0.15)', borderRadius: '20px', padding: '40px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(255,229,0,0.1) 0%, transparent 70%)', pointerEvents: 'none' }}/>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <div style={{ width: '44px', height: '44px', background: 'rgba(255,229,0,0.15)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="22" height="16" viewBox="0 0 4191.67 2190.15" fill="none">
                    <path d="M767.96,1876.06c348.4-78.57,799.8-147.81,1327.87-147.54,525.29,27,974.51,69.24,1321.72,147.54,59.43-520.49,118.85-1040.98,178.28-1561.48-295.08,235.66-590.16,471.31-885.25,706.97-204.92-226.68-409.84-453.35-614.75-680.03-206.97,234.87-413.93,469.75-620.9,704.62-293.03-234.87-586.07-469.75-879.1-704.62,57.38,511.51,114.75,1023.03,172.13,1534.54Z" fill="#FFE500"/>
                  </svg>
                </div>
                <div>
                  <div className="gradient-text" style={{ fontSize: '18px', fontWeight: '700', letterSpacing: '-0.02em' }}>Crowns</div>
                  <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px' }}>The Nodable currency</div>
                </div>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '14px', lineHeight: '1.7', marginBottom: '28px' }}>
                Crowns are the currency of Nodable. Earn them by contributing to the community. Spend them to unlock premium LUTs or Assets without paying cash. Send them to creators whose work you respect.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '10px' }}>
                {['Earn by uploading & contributing', 'Spend to unlock premium LUTs or Assets', 'Send to creators you respect', 'Boost their Node score when you do'].map((item) => (
                  <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'linear-gradient(135deg, #FFE500, #FF8C00)', flexShrink: 0 }}/>
                    <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>{item}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: '32px', padding: '16px 20px', background: 'rgba(255,229,0,0.06)', borderRadius: '10px', border: '0.5px solid rgba(255,229,0,0.12)' }}>
                <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px', marginBottom: '4px' }}>Example profile</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}>@framesbymatt</span>
                  <span style={{ background: 'rgba(255,229,0,0.15)', color: '#FFE500', fontSize: '11px', fontWeight: '600', padding: '2px 8px', borderRadius: '4px' }}>240 Crowns 👑</span>
                </div>
              </div>
            </div>
          </div>

          <div className="fade-up" style={{ textAlign: 'center', marginTop: '56px' }}>
            <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '13px', letterSpacing: '0.04em' }}>
              Where standards are set — <span className="gradient-text" style={{ fontWeight: '700' }}>crowns are earned.</span>
            </p>
          </div>
        </section>

        {/* Crown pricing */}
        <section style={{ padding: isMobile ? '0 24px 60px' : '0 40px 100px' }}>
          <div className="fade-up" style={{ textAlign: 'center', marginBottom: '56px' }}>
            <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase' as const, marginBottom: '12px' }}>Crown packages</div>
            <h2 style={{ color: '#fff', fontSize: isMobile ? '30px' : '40px', fontWeight: '700', letterSpacing: '-0.03em', lineHeight: '1.06', margin: '0 0 16px' }}>
              Get Crowns.<br /><span className="gradient-text">Unlock everything.</span>
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '15px', lineHeight: '1.7', maxWidth: '400px', margin: '0 auto' }}>
              Buy Crowns to unlock premium content. Or earn them free by contributing — uploading LUTs, getting downloads, supporting other creators.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '16px', marginBottom: '40px' }}>
            {crownPackages.map((pkg, i) => (
              <div key={pkg.name} className={`pricing-card fade-up fade-up-delay-${i + 1}`} style={{
                background: pkg.featured ? 'rgba(255,229,0,0.06)' : 'rgba(255,255,255,0.03)',
                border: pkg.featured ? '1.5px solid rgba(255,229,0,0.4)' : '0.5px solid rgba(255,255,255,0.08)',
                borderRadius: '20px',
                padding: '36px',
                position: 'relative',
                overflow: 'hidden',
              }}>
                {pkg.featured && (
                  <div style={{ position: 'absolute', top: '16px', right: '16px', background: '#FFE500', color: '#000', fontSize: '10px', fontWeight: '700', padding: '3px 10px', borderRadius: '20px', letterSpacing: '0.04em' }}>
                    BEST VALUE
                  </div>
                )}
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', fontWeight: '600', letterSpacing: '0.08em', textTransform: 'uppercase' as const, marginBottom: '8px' }}>{pkg.name}</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '6px' }}>
                    <span style={{ fontSize: '40px', fontWeight: '700', letterSpacing: '-0.03em', background: 'linear-gradient(90deg, #FFE500, #FFC200)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{pkg.crowns.toLocaleString()}</span>
                    <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '14px' }}>Crowns</span>
                  </div>
                  <div style={{ color: '#fff', fontSize: '22px', fontWeight: '700', letterSpacing: '-0.02em', marginBottom: '6px' }}>{pkg.price}</div>
                  <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '13px' }}>{pkg.desc}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '10px', marginBottom: '28px' }}>
                  {pkg.perks.map((perk) => (
                    <div key={perk} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: 'rgba(255,229,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
                          <path d="M2 5l2.5 2.5L8 3" stroke="#FFE500" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: '13px' }}>{perk}</span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setModalOpen(true)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    border: 'none',
                    background: pkg.featured ? '#FFE500' : 'rgba(255,255,255,0.06)',
                    color: pkg.featured ? '#000' : 'rgba(255,255,255,0.6)',
                    fontSize: '13px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-inter), sans-serif',
                  }}>
                  Join the waitlist
                </button>
              </div>
            ))}
          </div>

          <div className="fade-up" style={{ background: 'rgba(255,255,255,0.02)', border: '0.5px solid rgba(255,255,255,0.06)', borderRadius: '14px', padding: '24px 32px', display: 'flex', alignItems: isMobile ? 'flex-start' : 'center', justifyContent: 'space-between', flexDirection: isMobile ? 'column' as const : 'row' as const, gap: '16px' }}>
            <div>
              <div style={{ color: '#fff', fontSize: '14px', fontWeight: '700', marginBottom: '4px' }}>Don't want to spend? You don't have to.</div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px' }}>Upload a verified LUT and earn 50 Crowns. Get downloads, earn more. The network that rewards contributors.</div>
            </div>
            <button onClick={() => setModalOpen(true)} style={{ background: 'transparent', border: '0.5px solid rgba(255,229,0,0.3)', color: '#FFE500', fontSize: '12px', fontWeight: '700', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', whiteSpace: 'nowrap' as const, fontFamily: 'var(--font-inter), sans-serif' }}>
              Join the waitlist
            </button>
          </div>
        </section>

        {/* Bottom marquee */}
        <div style={{ background: '#FFE500', overflow: 'hidden', padding: '8px 0' }}>
          <div className="marquee-track" style={{ animationDirection: 'reverse' }}>
            {marqueeItems.map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                <span style={{ color: '#000', fontSize: '12px', fontWeight: '700', letterSpacing: '0.04em', whiteSpace: 'nowrap', padding: '0 20px' }}>
                  {item.toUpperCase()}
                </span>
                <span style={{ color: '#000', fontSize: '10px', opacity: 0.4 }}>✦</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  )
}