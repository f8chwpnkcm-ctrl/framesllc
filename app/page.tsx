'use client'

import { useEffect, useState, useRef } from 'react'
import Navbar from './components/Navbar'

const themeColors: Record<string, string> = {
  yellow: '#FFE500', blue: '#3B82F6', red: '#EF4444',
  green: '#22C55E', purple: '#A855F7', white: '#FFFFFF',
}

const CROWN_PATH = "M767.96,1876.06c348.4-78.57,799.8-147.81,1327.87-147.54,525.29,27,974.51,69.24,1321.72,147.54,59.43-520.49,118.85-1040.98,178.28-1561.48-295.08,235.66-590.16,471.31-885.25,706.97-204.92-226.68-409.84-453.35-614.75-680.03-206.97,234.87-413.93,469.75-620.9,704.62-293.03-234.87-586.07-469.75-879.1-704.62,57.38,511.51,114.75,1023.03,172.13,1534.54Z"

function NodeNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    let animFrame: number
    let nodes: { x: number; y: number; vx: number; vy: number; pulse: number; pulseSpeed: number }[] = []
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    const initNodes = () => {
      const count = Math.min(Math.floor((window.innerWidth * window.innerHeight) / 22000), 60)
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25,
        pulse: Math.random() * Math.PI * 2, pulseSpeed: 0.015 + Math.random() * 0.02,
      }))
    }
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      nodes.forEach(n => {
        n.x += n.vx; n.y += n.vy; n.pulse += n.pulseSpeed
        if (n.x < 0 || n.x > canvas.width) n.vx *= -1
        if (n.y < 0 || n.y > canvas.height) n.vy *= -1
      })
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 160) {
            ctx.beginPath()
            ctx.strokeStyle = `rgba(255,229,0,${(1 - dist / 160) * 0.08})`
            ctx.lineWidth = 0.5
            ctx.moveTo(nodes[i].x, nodes[i].y)
            ctx.lineTo(nodes[j].x, nodes[j].y)
            ctx.stroke()
          }
        }
      }
      nodes.forEach(n => {
        ctx.beginPath()
        ctx.arc(n.x, n.y, 1.8, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,229,0,${0.12 + Math.sin(n.pulse) * 0.08})`
        ctx.fill()
      })
      animFrame = requestAnimationFrame(draw)
    }
    resize(); initNodes(); draw()
    const onResize = () => { resize(); initNodes() }
    window.addEventListener('resize', onResize)
    return () => { cancelAnimationFrame(animFrame); window.removeEventListener('resize', onResize) }
  }, [])
  return <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }} />
}

function CrownPattern() {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <pattern id="crownBg" x="0" y="0" width="120" height="70" patternUnits="userSpaceOnUse">
            <svg x="10" y="8" width="80" height="44" viewBox="0 0 4191.67 2190.15">
              <path d={CROWN_PATH} fill="#FFE500" opacity="0.028" />
            </svg>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#crownBg)" />
      </svg>
    </div>
  )
}

function WaitlistModal({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const handleSubmit = async () => {
    if (!email) return
    setStatus('loading')
    try {
      const res = await fetch('/api/waitlist', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) })
      const data = await res.json()
      if (res.ok) setStatus('success')
      else { setStatus('error'); setMessage(data.error || 'Something went wrong') }
    } catch { setStatus('error'); setMessage('Something went wrong') }
  }
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)', padding: '20px' }}>
      <div onClick={e => e.stopPropagation()} style={{ background: '#0f0f0f', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '40px', width: '100%', maxWidth: '440px', position: 'relative' as const }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.3)', fontSize: '20px', cursor: 'pointer' }}>✕</button>
        {status === 'success' ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>👑</div>
            <div style={{ color: '#fff', fontSize: '22px', fontWeight: '700', letterSpacing: '-0.02em', marginBottom: '8px' }}>You're on the list.</div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', lineHeight: '1.6' }}>We'll reach out when your spot opens up.</div>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: '28px' }}>
              <div style={{ color: '#fff', fontSize: '22px', fontWeight: '700', letterSpacing: '-0.02em', marginBottom: '8px' }}>Claim your spot.</div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', lineHeight: '1.6' }}>Early access is limited. Be among the first creators on Nodable.</div>
            </div>
            <input type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '0.5px solid rgba(255,255,255,0.12)', borderRadius: '10px', padding: '14px 16px', fontSize: '15px', color: '#fff', outline: 'none', fontFamily: 'var(--font-inter), sans-serif', boxSizing: 'border-box' as const, marginBottom: '12px' }} />
            {message && <div style={{ color: 'rgba(255,100,100,0.8)', fontSize: '13px', marginBottom: '12px' }}>{message}</div>}
            <button onClick={handleSubmit} disabled={status === 'loading'}
              style={{ width: '100%', background: '#FFE500', color: '#000', fontSize: '15px', fontWeight: '700', padding: '15px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-inter), sans-serif' }}>
              {status === 'loading' ? '...' : 'Join the waitlist'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default function HomePage() {
  const [showModal, setShowModal] = useState(false)
  const [drops, setDrops] = useState<any[]>([])
  const [creators, setCreators] = useState<any[]>([])
  const [currentUser, setCurrentUser] = useState<any>(null)

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.json()).then(d => setCurrentUser(d.user))
    fetch('/api/drops').then(r => r.json()).then(d => { if (d.drops) setDrops(d.drops.slice(0, 3)) })
    fetch('/api/creators').then(r => r.json()).then(d => { if (d.creators) setCreators(d.creators.slice(0, 4)) })
  }, [])

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime()
    const m = Math.floor(diff / 60000)
    if (m < 1) return 'just now'
    if (m < 60) return `${m}m`
    const h = Math.floor(m / 60)
    if (h < 24) return `${h}h`
    return `${Math.floor(h / 24)}d`
  }

  const NodeRow = ({ action, value, yellow }: { action: string; value: string; yellow?: boolean }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: yellow ? 'rgba(255,229,0,0.04)' : 'rgba(255,255,255,0.03)', borderRadius: '8px', border: yellow ? '0.5px solid rgba(255,229,0,0.08)' : 'none', gap: '12px' }}>
      <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', flex: 1 }}>{action}</span>
      <span style={{ color: yellow ? 'rgba(255,229,0,0.7)' : '#FFE500', fontSize: '12px', fontWeight: '700', flexShrink: 0 }}>{value}</span>
    </div>
  )

  return (
    <main style={{ minHeight: '100vh', background: '#080808', fontFamily: 'var(--font-inter), sans-serif', overscrollBehavior: 'none', position: 'relative' as const }}>
      <CrownPattern />
      <NodeNetwork />
      {showModal && <WaitlistModal onClose={() => setShowModal(false)} />}

      <div style={{ position: 'relative', zIndex: 1 }}>
        <Navbar onJoinWaitlist={() => setShowModal(true)} />

        {/* ── HERO ── */}
        <section style={{ maxWidth: '1000px', margin: '0 auto', padding: '100px 24px 80px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,229,0,0.08)', border: '0.5px solid rgba(255,229,0,0.2)', padding: '6px 16px', borderRadius: '20px', marginBottom: '40px' }}>
            <div style={{ width: '6px', height: '6px', background: '#FFE500', borderRadius: '50%', animation: 'pulse 2s infinite' }} />
            <span style={{ color: '#FFE500', fontSize: '11px', fontWeight: '600', letterSpacing: '0.06em' }}>EARLY ACCESS OPEN</span>
          </div>
          <h1 style={{ color: '#fff', fontSize: 'clamp(44px, 9vw, 96px)', fontWeight: '700', letterSpacing: '-0.04em', lineHeight: '0.95', marginBottom: '8px' }}>Where the</h1>
          <h1 style={{ fontSize: 'clamp(44px, 9vw, 96px)', fontWeight: '700', letterSpacing: '-0.04em', lineHeight: '0.95', marginBottom: '40px', background: 'linear-gradient(90deg, #FFE500, #FFC200)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>standards are set.</h1>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '40px', flexWrap: 'wrap' as const }}>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 'clamp(15px, 2vw, 18px)', lineHeight: '1.75', maxWidth: '460px', margin: 0, flex: '1 1 260px' }}>
              Nodable is a platform built for creators who take their craft seriously — tools that save time, a community that raises the bar, and a reputation system built around real work.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '12px', flex: '1 1 200px', minWidth: '200px' }}>
              {currentUser ? (
                <a href={`/u/${currentUser.username}`} style={{ background: '#FFE500', color: '#000', fontSize: '15px', fontWeight: '700', padding: '16px 32px', borderRadius: '10px', textDecoration: 'none', textAlign: 'center' as const, display: 'block' }}>My profile →</a>
              ) : (
                <>
                  <button onClick={() => setShowModal(true)} style={{ background: '#FFE500', color: '#000', fontSize: '15px', fontWeight: '700', padding: '16px 32px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-inter), sans-serif', width: '100%' }}>
                    Join the waitlist
                  </button>
                  <a href="/login" style={{ color: 'rgba(255,255,255,0.3)', fontSize: '14px', textDecoration: 'none', textAlign: 'center' as const }}>
                    Have an account? Log in →
                  </a>
                </>
              )}
            </div>
          </div>
        </section>

        {/* ── MARQUEE ── */}
        <div style={{ borderTop: '0.5px solid rgba(255,255,255,0.06)', borderBottom: '0.5px solid rgba(255,255,255,0.06)', padding: '14px 0', overflow: 'hidden' }}>
          <div style={{ display: 'flex', gap: '48px', animation: 'marquee 20s linear infinite', width: 'max-content' }}>
            {['Tools built for creators', 'Shot list generator', 'Invoice builder', 'Mood board creator', 'Drops feed', 'Creator network', 'Verified profiles', 'Earn your reputation', 'Tools built for creators', 'Shot list generator', 'Invoice builder', 'Mood board creator', 'Drops feed', 'Creator network'].map((item, i) => (
              <span key={i} style={{ color: 'rgba(255,255,255,0.2)', fontSize: '11px', fontWeight: '600', letterSpacing: '0.08em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                {item} <span style={{ color: '#FFE500', marginLeft: '24px' }}>✦</span>
              </span>
            ))}
          </div>
        </div>

        {/* ── WHAT IS NODABLE ── */}
        <section style={{ maxWidth: '1000px', margin: '0 auto', padding: '100px 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '64px', alignItems: 'center' }}>
            <div>
              <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '20px' }}>What is Nodable</div>
              <h2 style={{ color: '#fff', fontSize: 'clamp(28px, 4vw, 52px)', fontWeight: '700', letterSpacing: '-0.03em', lineHeight: '1.08', marginBottom: '24px' }}>
                A platform that actually <span style={{ color: '#FFE500' }}>gets it.</span>
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '16px', lineHeight: '1.8', marginBottom: '20px' }}>
                Most platforms weren't built with creators in mind. Nodable was. Everything here — the tools, the community, the economy — was designed around how you actually work.
              </p>
              <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '16px', lineHeight: '1.8', margin: 0 }}>
                No algorithm deciding your worth. No ads in your face. Just a space where the standard is high and the tools are real.
              </p>
            </div>
            <div>
              {[
                { label: 'AI-powered creator tools', sub: 'Shot lists, invoices, mood boards — built for your workflow' },
                { label: 'A feed built for craft', sub: "Share what you're shooting. React. Connect. No noise." },
                { label: 'Reputation that means something', sub: "Earn Nodes for real contributions. Can't be bought." },
                { label: 'Verified creator profiles', sub: 'Your profile is your portfolio. Make it count.' },
              ].map((item, i) => (
                <div key={i} style={{ padding: '18px 0', borderBottom: '0.5px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                  <div style={{ width: '6px', height: '6px', background: '#FFE500', borderRadius: '50%', marginTop: '7px', flexShrink: 0 }} />
                  <div>
                    <div style={{ color: '#fff', fontSize: '15px', fontWeight: '700', marginBottom: '4px' }}>{item.label}</div>
                    <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '13px', lineHeight: '1.5' }}>{item.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── NODES & CROWNS ── */}
        <section style={{ background: 'rgba(13,13,13,0.92)', borderTop: '0.5px solid rgba(255,255,255,0.06)', borderBottom: '0.5px solid rgba(255,255,255,0.06)', padding: '100px 24px' }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '60px' }}>
              <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '16px' }}>The economy</div>
              <h2 style={{ color: '#fff', fontSize: 'clamp(28px, 4vw, 52px)', fontWeight: '700', letterSpacing: '-0.03em', lineHeight: '1.08', marginBottom: '16px' }}>
                Earn your place in the network.
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '16px', lineHeight: '1.7', maxWidth: '440px', margin: '0 auto' }}>
                On Nodable, reputation is earned — not bought.
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              {/* Nodes card */}
              <div style={{ background: 'rgba(17,17,17,0.95)', border: '0.5px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '36px' }}>
                <div style={{ fontSize: '36px', fontWeight: '700', letterSpacing: '-0.02em', color: '#fff', marginBottom: '6px' }}>Nodes</div>
                <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px', marginBottom: '20px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Your reputation score</div>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', lineHeight: '1.8', marginBottom: '24px' }}>
                  Nodes represent your standing in the community. You can't buy them — you earn them through real contributions.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '8px' }}>
                  <NodeRow action="Post a Drop" value="+2 Nodes" />
                  <NodeRow action="Fire reaction received" value="+1 Node" />
                  <NodeRow action="Crown reaction received" value="+5 Nodes" />
                  <NodeRow action="Collab interest signal" value="+2 Nodes" />
                  <NodeRow action="Complete your profile" value="up to +50" />
                </div>
              </div>
              {/* Crowns card */}
              <div style={{ background: 'rgba(255,229,0,0.04)', border: '0.5px solid rgba(255,229,0,0.15)', borderRadius: '20px', padding: '36px' }}>
                <div style={{ fontSize: '36px', fontWeight: '700', letterSpacing: '-0.02em', background: 'linear-gradient(90deg, #FFE500, #FFC200)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '6px' }}>Crowns</div>
                <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px', marginBottom: '20px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>The Nodable currency</div>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', lineHeight: '1.8', marginBottom: '24px' }}>
                  Crowns are how you show real appreciation. Free to earn daily. When you Crown a Drop, you're saying it's elite — and they earn Nodes for it.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '8px' }}>
                  <NodeRow action="+10 free on login daily" value="Just show up" yellow />
                  <NodeRow action="Crown Drops you love" value="3 per day max" yellow />
                  <NodeRow action="Unlock platform features" value="Coming soon" yellow />
                  <NodeRow action="Support other creators" value="Always free" yellow />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── LIVE DROPS ── */}
        {drops.length > 0 && (
          <section style={{ maxWidth: '1000px', margin: '0 auto', padding: '100px 24px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '48px', gap: '20px', flexWrap: 'wrap' as const }}>
              <div>
                <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>Live from the community</div>
                <h2 style={{ color: '#fff', fontSize: 'clamp(28px, 4vw, 52px)', fontWeight: '700', letterSpacing: '-0.03em', lineHeight: '1.08', margin: 0 }}>
                  What creators are dropping.
                </h2>
              </div>
              <a href="/feed" style={{ color: '#FFE500', fontSize: '14px', fontWeight: '600', textDecoration: 'none', flexShrink: 0 }}>See the full feed →</a>
            </div>
            <div>
              {drops.map((drop: any) => {
                const author = drop.users
                const accent = themeColors[author?.theme_color] || '#FFE500'
                const fireCount = drop.drop_reactions?.filter((r: any) => r.reaction === 'fire').length || 0
                const crownCount = drop.drop_reactions?.filter((r: any) => r.reaction === 'crown').length || 0
                return (
                  <a key={drop.id} href="/feed" style={{ textDecoration: 'none' }}>
                    <div style={{ padding: '24px 0', borderBottom: '0.5px solid rgba(255,255,255,0.06)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)', border: `1.5px solid ${accent}`, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                            {author?.profile_picture_url ? <img src={author.profile_picture_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" /> : <span style={{ color: accent, fontSize: '12px', fontWeight: '700' }}>{author?.username?.[0]?.toUpperCase()}</span>}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' as const }}>
                            <span style={{ color: '#fff', fontSize: '13px', fontWeight: '700' }}>@{author?.username}</span>
                            {author?.is_verified && <span style={{ background: accent, borderRadius: '50%', width: '14px', height: '14px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><svg width="7" height="7" viewBox="0 0 10 10" fill="none"><path d="M2 5l2 2 4-4" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></span>}
                            {drop.shoot_type && <span style={{ background: `${accent}12`, color: accent, fontSize: '10px', fontWeight: '600', padding: '2px 8px', borderRadius: '20px' }}>{drop.shoot_type}</span>}
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                          {fireCount > 0 && <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px' }}>🔥 {fireCount}</span>}
                          {crownCount > 0 && <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px' }}>👑 {crownCount}</span>}
                          <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '12px' }}>{timeAgo(drop.created_at)}</span>
                        </div>
                      </div>
                      <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '15px', lineHeight: '1.65', margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' } as any}>{drop.caption}</p>
                    </div>
                  </a>
                )
              })}
            </div>
          </section>
        )}

        {/* ── CREATORS ── */}
        {creators.length > 0 && (
          <section style={{ background: 'rgba(13,13,13,0.92)', borderTop: '0.5px solid rgba(255,255,255,0.06)', padding: '100px 24px' }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '48px', gap: '20px', flexWrap: 'wrap' as const }}>
                <div>
                  <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>The network</div>
                  <h2 style={{ color: '#fff', fontSize: 'clamp(28px, 4vw, 52px)', fontWeight: '700', letterSpacing: '-0.03em', lineHeight: '1.08', margin: 0 }}>
                    Creators already on Nodable.
                  </h2>
                </div>
                <a href="/creators" style={{ color: '#FFE500', fontSize: '14px', fontWeight: '600', textDecoration: 'none', flexShrink: 0 }}>Browse all →</a>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px' }}>
                {creators.map((creator: any) => {
                  const accent = themeColors[creator.theme_color] || '#FFE500'
                  return (
                    <a key={creator.id} href={`/u/${creator.username}`} style={{ textDecoration: 'none' }}>
                      <div style={{ background: 'rgba(17,17,17,0.95)', border: '0.5px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '24px 16px', textAlign: 'center' as const }}>
                        <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)', border: `2px solid ${accent}`, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', margin: '0 auto 12px' }}>
                          {creator.profile_picture_url ? <img src={creator.profile_picture_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" /> : <span style={{ color: accent, fontSize: '20px', fontWeight: '700' }}>{creator.username[0].toUpperCase()}</span>}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', marginBottom: '4px' }}>
                          <span style={{ color: '#fff', fontSize: '13px', fontWeight: '700' }}>@{creator.username}</span>
                          {creator.is_verified && <span style={{ background: accent, borderRadius: '50%', width: '14px', height: '14px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><svg width="7" height="7" viewBox="0 0 10 10" fill="none"><path d="M2 5l2 2 4-4" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></span>}
                        </div>
                        {creator.real_name && <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '11px', marginBottom: '3px' }}>{creator.real_name}</div>}
                        {creator.location && <div style={{ color: 'rgba(255,255,255,0.25)', fontSize: '11px' }}>📍 {creator.location}</div>}
                      </div>
                    </a>
                  )
                })}
              </div>
            </div>
          </section>
        )}

        {/* ── TOOLS ── */}
        <section style={{ maxWidth: '1000px', margin: '0 auto', padding: '100px 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '64px', alignItems: 'start' }}>
            <div>
              <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '20px' }}>The toolkit</div>
              <h2 style={{ color: '#fff', fontSize: 'clamp(28px, 4vw, 52px)', fontWeight: '700', letterSpacing: '-0.03em', lineHeight: '1.08', marginBottom: '20px' }}>
                Tools that do <span style={{ color: '#FFE500' }}>the heavy lifting.</span>
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '15px', lineHeight: '1.8', marginBottom: '28px' }}>
                Every tool on Nodable was built to solve a real problem creators face. AI-powered, fast, and designed to get out of your way.
              </p>
              <a href="/tools" style={{ color: '#FFE500', fontSize: '14px', fontWeight: '600', textDecoration: 'none' }}>Explore all tools →</a>
            </div>
            <div>
              {[
                { href: '/tools/shot-list', num: '01', title: 'Shot list creator', desc: 'Describe your shoot and get a full professional shot list in seconds. Paced by duration, tailored to your gear.' },
                { href: '/tools/invoice', num: '02', title: 'Invoice generator', desc: 'Describe the job, set your rate, get a clean invoice with AI-generated line items. Print or save as PDF.' },
                { href: '/tools/mood-board', num: '03', title: 'Mood board generator', desc: 'Turn a feeling into a full creative brief. Color palette, lighting style, camera settings, LUT recommendations.' },
                { href: '/tools', num: '04', title: 'More coming', desc: 'Contracts, shoot planners, cinematic settings advisor. Built around how you actually work.' },
              ].map(tool => (
                <a key={tool.num} href={tool.href} style={{ textDecoration: 'none' }}>
                  <div style={{ padding: '24px 0', borderBottom: '0.5px solid rgba(255,255,255,0.06)', display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '20px', alignItems: 'start' }}>
                    <div style={{ color: 'rgba(255,255,255,0.15)', fontSize: '12px', fontWeight: '700', fontFamily: 'monospace', paddingTop: '3px' }}>{tool.num}</div>
                    <div>
                      <div style={{ color: '#fff', fontSize: '16px', fontWeight: '700', marginBottom: '6px' }}>{tool.title}</div>
                      <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '13px', lineHeight: '1.6' }}>{tool.desc}</div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ── FINAL CTA ── */}
        <section style={{ background: '#FFE500', padding: '100px 24px', position: 'relative' as const, overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0 }}>
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="crownCta" x="0" y="0" width="120" height="70" patternUnits="userSpaceOnUse">
                  <svg x="10" y="8" width="80" height="44" viewBox="0 0 4191.67 2190.15">
                    <path d={CROWN_PATH} fill="#000" opacity="0.06" />
                  </svg>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#crownCta)" />
            </svg>
          </div>
          <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
            <h2 style={{ color: '#000', fontSize: 'clamp(36px, 6vw, 72px)', fontWeight: '700', letterSpacing: '-0.04em', lineHeight: '1.0', marginBottom: '20px' }}>
              Your work belongs here.
            </h2>
            <p style={{ color: 'rgba(0,0,0,0.55)', fontSize: 'clamp(15px, 2vw, 18px)', lineHeight: '1.7', maxWidth: '440px', margin: '0 auto 40px' }}>
              Early access is open. Join the waitlist and be among the first creators to set the standard on Nodable.
            </p>
            {!currentUser ? (
              <button onClick={() => setShowModal(true)}
                style={{ background: '#000', color: '#FFE500', fontSize: '16px', fontWeight: '700', padding: '18px 48px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-inter), sans-serif' }}>
                Join the waitlist
              </button>
            ) : (
              <a href={`/u/${currentUser.username}`}
                style={{ background: '#000', color: '#FFE500', fontSize: '16px', fontWeight: '700', padding: '18px 48px', borderRadius: '12px', textDecoration: 'none', display: 'inline-block' }}>
                Go to my profile →
              </a>
            )}
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer style={{ background: '#000', padding: '40px 24px' }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' as const, gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <svg width="22" height="12" viewBox="0 0 4191.67 2190.15" fill="none">
                <path d={CROWN_PATH} fill="#FFE500" />
              </svg>
              <span style={{ background: 'linear-gradient(90deg, #FFE500, #FFC200)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: '15px', fontWeight: '700', letterSpacing: '-0.02em' }}>Nodable.</span>
            </div>
            <div style={{ display: 'flex', gap: '28px', alignItems: 'center', flexWrap: 'wrap' as const }}>
              <a href="/feed" style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px', textDecoration: 'none' }}>Feed</a>
              <a href="/creators" style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px', textDecoration: 'none' }}>Creators</a>
              <a href="/tools" style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px', textDecoration: 'none' }}>Tools</a>
            </div>
            <div style={{ color: 'rgba(255,255,255,0.15)', fontSize: '12px' }}>© 2026 Nodable</div>
          </div>
        </footer>
      </div>

      <style>{`
        @keyframes marquee { 0% { transform: translateX(0) } 100% { transform: translateX(-50%) } }
        @keyframes pulse { 0%, 100% { opacity: 1 } 50% { opacity: 0.4 } }
      `}</style>
    </main>
  )
}
