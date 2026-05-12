'use client'

import { useEffect, useState } from 'react'
import Navbar from './components/Navbar'

const themeColors: Record<string, string> = {
  yellow: '#FFE500', blue: '#3B82F6', red: '#EF4444',
  green: '#22C55E', purple: '#A855F7', white: '#FFFFFF',
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
      if (res.ok) { setStatus('success'); setMessage("You're on the list! 👑") }
      else { setStatus('error'); setMessage(data.error || 'Something went wrong') }
    } catch { setStatus('error'); setMessage('Something went wrong') }
  }

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
      <div onClick={e => e.stopPropagation()} style={{ background: '#111827', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '40px', width: '100%', maxWidth: '440px', margin: '0 20px', position: 'relative' as const }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: '20px', cursor: 'pointer' }}>✕</button>
        {status === 'success' ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>👑</div>
            <div style={{ color: '#fff', fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}>You're on the list!</div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>We'll reach out when your spot is ready.</div>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: '24px' }}>
              <div style={{ color: '#fff', fontSize: '22px', fontWeight: '700', letterSpacing: '-0.02em', marginBottom: '8px' }}>Join the waitlist</div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>Be among the first creators on Nodable.</div>
            </div>
            <input type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: '0.5px solid rgba(255,255,255,0.12)', borderRadius: '10px', padding: '14px 16px', fontSize: '14px', color: '#fff', outline: 'none', fontFamily: 'var(--font-inter), sans-serif', boxSizing: 'border-box' as const, marginBottom: '12px' }} />
            {message && <div style={{ color: status === 'error' ? 'rgba(255,100,100,0.8)' : '#22C55E', fontSize: '13px', marginBottom: '12px' }}>{message}</div>}
            <button onClick={handleSubmit} disabled={status === 'loading'}
              style={{ width: '100%', background: '#FFE500', color: '#000', fontSize: '14px', fontWeight: '700', padding: '14px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-inter), sans-serif' }}>
              {status === 'loading' ? '...' : 'Join waitlist'}
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
    if (m < 60) return `${m}m ago`
    const h = Math.floor(m / 60)
    if (h < 24) return `${h}h ago`
    return `${Math.floor(h / 24)}d ago`
  }

  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(to bottom, #0a0a0a, #0f1318)', fontFamily: 'var(--font-inter), sans-serif', overscrollBehavior: 'none' }}>
      {showModal && <WaitlistModal onClose={() => setShowModal(false)} />}
      <Navbar onJoinWaitlist={() => setShowModal(true)} />

      {/* Hero */}
      <section style={{ maxWidth: '800px', margin: '0 auto', padding: '100px 24px 80px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,229,0,0.1)', border: '0.5px solid rgba(255,229,0,0.25)', padding: '5px 14px', borderRadius: '20px', marginBottom: '32px' }}>
          <div style={{ width: '5px', height: '5px', background: '#FFE500', borderRadius: '50%' }} />
          <span style={{ background: 'linear-gradient(90deg, #FFE500, #FFC200)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: '11px', fontWeight: '600' }}>Now in early access</span>
        </div>
        <h1 style={{ color: '#fff', fontSize: 'clamp(40px, 7vw, 72px)', fontWeight: '700', letterSpacing: '-0.04em', lineHeight: '1.04', margin: '0 0 24px' }}>
          Where the<br /><span style={{ background: 'linear-gradient(90deg, #FFE500, #FFC200)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>standards are set.</span>
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '18px', lineHeight: '1.7', maxWidth: '520px', margin: '0 auto 40px' }}>
          Nodable is the creator platform built for sports and events videographers. Tools, community, and a reputation system that rewards real work.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' as const }}>
          {currentUser ? (
            <a href={`/u/${currentUser.username}`} style={{ background: '#FFE500', color: '#000', fontSize: '15px', fontWeight: '700', padding: '14px 32px', borderRadius: '10px', textDecoration: 'none' }}>
              Go to my profile →
            </a>
          ) : (
            <>
              <button onClick={() => setShowModal(true)} style={{ background: '#FFE500', color: '#000', fontSize: '15px', fontWeight: '700', padding: '14px 32px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-inter), sans-serif' }}>
                Join the waitlist
              </button>
              <a href="/login" style={{ background: 'transparent', color: 'rgba(255,255,255,0.5)', fontSize: '15px', fontWeight: '500', padding: '14px 32px', borderRadius: '10px', border: '0.5px solid rgba(255,255,255,0.15)', textDecoration: 'none' }}>
                Log in
              </a>
            </>
          )}
        </div>
      </section>

      {/* Live feed preview */}
      {drops.length > 0 && (
        <section style={{ maxWidth: '680px', margin: '0 auto', padding: '0 24px 80px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <div>
              <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px' }}>Live from the community</div>
              <h2 style={{ color: '#fff', fontSize: '22px', fontWeight: '700', letterSpacing: '-0.02em', margin: 0 }}>Latest drops</h2>
            </div>
            <a href="/feed" style={{ color: '#FFE500', fontSize: '13px', fontWeight: '600', textDecoration: 'none' }}>See all →</a>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {drops.map((drop: any) => {
              const author = drop.users
              const accent = themeColors[author?.theme_color] || '#FFE500'
              const fireCount = drop.drop_reactions?.filter((r: any) => r.reaction === 'fire').length || 0
              const crownCount = drop.drop_reactions?.filter((r: any) => r.reaction === 'crown').length || 0
              return (
                <a key={drop.id} href="/feed" style={{ textDecoration: 'none' }}>
                  <div style={{ background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '18px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)', border: `1.5px solid ${accent}`, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                        {author?.profile_picture_url ? <img src={author.profile_picture_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" /> : <span style={{ color: accent, fontSize: '13px', fontWeight: '700' }}>{author?.username?.[0]?.toUpperCase()}</span>}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <span style={{ color: '#fff', fontSize: '13px', fontWeight: '700' }}>@{author?.username}</span>
                          {author?.is_verified && (
                            <span style={{ background: accent, borderRadius: '50%', width: '14px', height: '14px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                              <svg width="7" height="7" viewBox="0 0 10 10" fill="none"><path d="M2 5l2 2 4-4" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            </span>
                          )}
                        </div>
                        <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px' }}>{timeAgo(drop.created_at)}</span>
                      </div>
                      {drop.shoot_type && <span style={{ background: `${accent}12`, color: accent, fontSize: '10px', fontWeight: '600', padding: '3px 8px', borderRadius: '20px', border: `0.5px solid ${accent}25` }}>{drop.shoot_type}</span>}
                    </div>
                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', lineHeight: '1.6', margin: '0 0 10px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' } as any}>{drop.caption}</p>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      {fireCount > 0 && <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px' }}>🔥 {fireCount}</span>}
                      {crownCount > 0 && <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px' }}>👑 {crownCount}</span>}
                      {drop.drop_comments?.length > 0 && <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px' }}>💬 {drop.drop_comments.length}</span>}
                    </div>
                  </div>
                </a>
              )
            })}
          </div>
        </section>
      )}

      {/* Creators preview */}
      {creators.length > 0 && (
        <section style={{ maxWidth: '680px', margin: '0 auto', padding: '0 24px 80px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <div>
              <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px' }}>The network</div>
              <h2 style={{ color: '#fff', fontSize: '22px', fontWeight: '700', letterSpacing: '-0.02em', margin: 0 }}>Creators on Nodable</h2>
            </div>
            <a href="/creators" style={{ color: '#FFE500', fontSize: '13px', fontWeight: '600', textDecoration: 'none' }}>See all →</a>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '12px' }}>
            {creators.map((creator: any) => {
              const accent = themeColors[creator.theme_color] || '#FFE500'
              return (
                <a key={creator.id} href={`/u/${creator.username}`} style={{ textDecoration: 'none' }}>
                  <div style={{ background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '20px 16px', textAlign: 'center' }}>
                    <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)', border: `2px solid ${accent}`, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', margin: '0 auto 12px' }}>
                      {creator.profile_picture_url ? <img src={creator.profile_picture_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" /> : <span style={{ color: accent, fontSize: '20px', fontWeight: '700' }}>{creator.username[0].toUpperCase()}</span>}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', marginBottom: '4px' }}>
                      <span style={{ color: '#fff', fontSize: '13px', fontWeight: '700' }}>@{creator.username}</span>
                      {creator.is_verified && (
                        <span style={{ background: accent, borderRadius: '50%', width: '14px', height: '14px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <svg width="7" height="7" viewBox="0 0 10 10" fill="none"><path d="M2 5l2 2 4-4" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </span>
                      )}
                    </div>
                    {creator.location && <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px', marginBottom: '4px' }}>📍 {creator.location}</div>}
                    {creator.camera_brand && <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px' }}>📷 {creator.camera_brand.charAt(0).toUpperCase() + creator.camera_brand.slice(1)}</div>}
                  </div>
                </a>
              )
            })}
          </div>
        </section>
      )}

      {/* Tools section */}
      <section style={{ maxWidth: '680px', margin: '0 auto', padding: '0 24px 80px' }}>
        <div style={{ marginBottom: '24px' }}>
          <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px' }}>Built for your workflow</div>
          <h2 style={{ color: '#fff', fontSize: '22px', fontWeight: '700', letterSpacing: '-0.02em', margin: 0 }}>Creator tools</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {[
            { href: '/tools/shot-list', icon: '📋', title: 'Shot list creator', desc: 'AI-generated shot lists for any shoot' },
            { href: '/tools/invoice', icon: '🧾', title: 'Invoice generator', desc: 'Professional invoices in seconds' },
            { href: '/tools/mood-board', icon: '🎨', title: 'Mood board', desc: 'Turn a vibe into a creative brief' },
            { href: '/tools', icon: '✦', title: 'More tools', desc: 'Shot of the day, contracts, and more' },
          ].map(tool => (
            <a key={tool.href} href={tool.href} style={{ textDecoration: 'none' }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '20px' }}>
                <div style={{ fontSize: '24px', marginBottom: '10px' }}>{tool.icon}</div>
                <div style={{ color: '#fff', fontSize: '14px', fontWeight: '700', marginBottom: '4px' }}>{tool.title}</div>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', lineHeight: '1.5' }}>{tool.desc}</div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* What is Nodable */}
      <section style={{ maxWidth: '680px', margin: '0 auto', padding: '0 24px 80px' }}>
        <div style={{ background: 'rgba(255,229,0,0.04)', border: '0.5px solid rgba(255,229,0,0.12)', borderRadius: '20px', padding: '48px 40px', textAlign: 'center' }}>
          <h2 style={{ color: '#fff', fontSize: '28px', fontWeight: '700', letterSpacing: '-0.03em', margin: '0 0 16px' }}>Built by a creator.<br />For creators.</h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '15px', lineHeight: '1.8', maxWidth: '460px', margin: '0 auto 32px' }}>
            Nodable is where sports and events videographers come to sharpen their craft, get paid properly, and build a reputation that actually means something. No fluff. No algorithm. Just standards.
          </p>
          {!currentUser && (
            <button onClick={() => setShowModal(true)}
              style={{ background: '#FFE500', color: '#000', fontSize: '14px', fontWeight: '700', padding: '13px 32px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-inter), sans-serif' }}>
              Join the waitlist
            </button>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '0.5px solid rgba(255,255,255,0.06)', padding: '32px 24px', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '12px' }}>
          <svg width="20" height="11" viewBox="0 0 4191.67 2190.15" fill="none">
            <path d="M767.96,1876.06c348.4-78.57,799.8-147.81,1327.87-147.54,525.29,27,974.51,69.24,1321.72,147.54,59.43-520.49,118.85-1040.98,178.28-1561.48-295.08,235.66-590.16,471.31-885.25,706.97-204.92-226.68-409.84-453.35-614.75-680.03-206.97,234.87-413.93,469.75-620.9,704.62-293.03-234.87-586.07-469.75-879.1-704.62,57.38,511.51,114.75,1023.03,172.13,1534.54Z" fill="#FFE500"/>
          </svg>
          <span style={{ background: 'linear-gradient(90deg, #FFE500, #FFC200)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: '14px', fontWeight: '700' }}>Nodable.</span>
        </div>
        <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: '12px' }}>© 2026 Nodable · trynodable.com · @trynodable</div>
      </footer>
    </main>
  )
}
