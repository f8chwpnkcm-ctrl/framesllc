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
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}>
      <div onClick={e => e.stopPropagation()} style={{ background: '#0f0f0f', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '48px', width: '100%', maxWidth: '440px', margin: '0 20px', position: 'relative' as const }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.3)', fontSize: '20px', cursor: 'pointer' }}>✕</button>
        {status === 'success' ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: '56px', marginBottom: '20px' }}>👑</div>
            <div style={{ color: '#fff', fontSize: '22px', fontWeight: '700', letterSpacing: '-0.02em', marginBottom: '10px' }}>You're on the list.</div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', lineHeight: '1.6' }}>We'll reach out when your spot opens up.</div>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: '32px' }}>
              <div style={{ color: '#fff', fontSize: '24px', fontWeight: '700', letterSpacing: '-0.02em', marginBottom: '10px' }}>Claim your spot.</div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', lineHeight: '1.6' }}>Early access is limited. Be among the first creators on Nodable.</div>
            </div>
            <input type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '0.5px solid rgba(255,255,255,0.12)', borderRadius: '10px', padding: '16px', fontSize: '15px', color: '#fff', outline: 'none', fontFamily: 'var(--font-inter), sans-serif', boxSizing: 'border-box' as const, marginBottom: '12px' }} />
            {message && <div style={{ color: status === 'error' ? 'rgba(255,100,100,0.8)' : '#22C55E', fontSize: '13px', marginBottom: '12px' }}>{message}</div>}
            <button onClick={handleSubmit} disabled={status === 'loading'}
              style={{ width: '100%', background: '#FFE500', color: '#000', fontSize: '15px', fontWeight: '700', padding: '15px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-inter), sans-serif', letterSpacing: '-0.01em' }}>
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
    if (m < 60) return `${m}m ago`
    const h = Math.floor(m / 60)
    if (h < 24) return `${h}h ago`
    return `${Math.floor(h / 24)}d ago`
  }

  return (
    <main style={{ minHeight: '100vh', background: '#080808', fontFamily: 'var(--font-inter), sans-serif', overscrollBehavior: 'none' }}>
      {showModal && <WaitlistModal onClose={() => setShowModal(false)} />}
      <Navbar onJoinWaitlist={() => setShowModal(true)} />

      {/* ── HERO ── */}
      <section style={{ maxWidth: '1000px', margin: '0 auto', padding: '120px 24px 100px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,229,0,0.08)', border: '0.5px solid rgba(255,229,0,0.2)', padding: '6px 16px', borderRadius: '20px', marginBottom: '48px' }}>
          <div style={{ width: '6px', height: '6px', background: '#FFE500', borderRadius: '50%', animation: 'pulse 2s infinite' }} />
          <span style={{ color: '#FFE500', fontSize: '12px', fontWeight: '600', letterSpacing: '0.04em' }}>EARLY ACCESS OPEN</span>
        </div>

        <h1 style={{ color: '#fff', fontSize: 'clamp(52px, 9vw, 96px)', fontWeight: '700', letterSpacing: '-0.04em', lineHeight: '0.95', margin: '0 0 0', maxWidth: '800px' }}>
          Where the
        </h1>
        <h1 style={{ fontSize: 'clamp(52px, 9vw, 96px)', fontWeight: '700', letterSpacing: '-0.04em', lineHeight: '0.95', margin: '0 0 40px', background: 'linear-gradient(90deg, #FFE500, #FFC200)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          standards are set.
        </h1>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '48px', flexWrap: 'wrap' as const }}>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '18px', lineHeight: '1.75', maxWidth: '460px', margin: 0, flex: '1 1 300px' }}>
            Nodable is a platform built for creators who take their craft seriously — tools that save time, a community that raises the bar, and a reputation system built around real work.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: '0 0 auto' }}>
            {currentUser ? (
              <a href={`/u/${currentUser.username}`} style={{ background: '#FFE500', color: '#000', fontSize: '15px', fontWeight: '700', padding: '16px 36px', borderRadius: '10px', textDecoration: 'none', letterSpacing: '-0.01em', display: 'inline-block' }}>
                My profile →
              </a>
            ) : (
              <>
                <button onClick={() => setShowModal(true)} style={{ background: '#FFE500', color: '#000', fontSize: '15px', fontWeight: '700', padding: '16px 36px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-inter), sans-serif', letterSpacing: '-0.01em' }}>
                  Join the waitlist
                </button>
                <a href="/login" style={{ color: 'rgba(255,255,255,0.3)', fontSize: '14px', textDecoration: 'none', textAlign: 'center' }}>
                  Already have an account? Log in →
                </a>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ── MARQUEE STRIP ── */}
      <div style={{ borderTop: '0.5px solid rgba(255,255,255,0.06)', borderBottom: '0.5px solid rgba(255,255,255,0.06)', padding: '14px 0', overflow: 'hidden', marginBottom: '0' }}>
        <div style={{ display: 'flex', gap: '48px', animation: 'marquee 20s linear infinite', width: 'max-content' }}>
          {['Tools built for creators', 'Shot list generator', 'Invoice builder', 'Mood board creator', 'Drops feed', 'Creator network', 'Verified profiles', 'Earn your reputation', 'Tools built for creators', 'Shot list generator', 'Invoice builder', 'Mood board creator', 'Drops feed', 'Creator network'].map((item, i) => (
            <span key={i} style={{ color: 'rgba(255,255,255,0.2)', fontSize: '12px', fontWeight: '600', letterSpacing: '0.08em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
              {item} <span style={{ color: '#FFE500', marginLeft: '24px' }}>✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── WHAT IS NODABLE ── */}
      <section style={{ maxWidth: '1000px', margin: '0 auto', padding: '120px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
          <div>
            <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '20px' }}>What is Nodable</div>
            <h2 style={{ color: '#fff', fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: '700', letterSpacing: '-0.03em', lineHeight: '1.08', margin: '0 0 28px' }}>
              A platform that actually<br />
              <span style={{ color: '#FFE500' }}>gets it.</span>
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '16px', lineHeight: '1.8', margin: '0 0 24px' }}>
              Most platforms weren't built with creators in mind. Nodable was. Everything here — the tools, the community, the economy — was designed around how you actually work.
            </p>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '16px', lineHeight: '1.8', margin: 0 }}>
              No algorithm deciding your worth. No ads in your face. Just a space where the standard is high and the tools are real.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {[
              { label: 'AI-powered creator tools', sub: 'Shot lists, invoices, mood boards — built for your workflow' },
              { label: 'A feed built for craft', sub: 'Share what you\'re shooting. React. Connect. No noise.' },
              { label: 'Reputation that means something', sub: 'Earn Nodes for real contributions. Can\'t be bought.' },
              { label: 'Verified creator profiles', sub: 'Your profile is your portfolio. Make it count.' },
            ].map((item, i) => (
              <div key={i} style={{ padding: '20px 0', borderBottom: '0.5px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                <div style={{ width: '6px', height: '6px', background: '#FFE500', borderRadius: '50%', marginTop: '8px', flexShrink: 0 }} />
                <div>
                  <div style={{ color: '#fff', fontSize: '15px', fontWeight: '700', marginBottom: '4px', letterSpacing: '-0.01em' }}>{item.label}</div>
                  <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '13px', lineHeight: '1.5' }}>{item.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NODES & CROWNS ── */}
      <section style={{ background: '#0d0d0d', borderTop: '0.5px solid rgba(255,255,255,0.06)', borderBottom: '0.5px solid rgba(255,255,255,0.06)', padding: '120px 24px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '72px' }}>
            <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '20px' }}>The economy</div>
            <h2 style={{ color: '#fff', fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: '700', letterSpacing: '-0.03em', lineHeight: '1.08', margin: '0 auto 20px', maxWidth: '600px' }}>
              Earn your place<br />in the network.
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '16px', lineHeight: '1.7', maxWidth: '480px', margin: '0 auto' }}>
              On Nodable, reputation is earned — not bought. Two currencies power the platform.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div style={{ background: '#111', border: '0.5px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '48px' }}>
              <div style={{ fontSize: '40px', fontWeight: '700', letterSpacing: '-0.03em', color: '#fff', marginBottom: '8px' }}>Nodes</div>
              <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px', marginBottom: '28px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Your reputation score</div>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '15px', lineHeight: '1.8', marginBottom: '32px' }}>
                Nodes represent your standing in the Nodable community. You can't buy them — you earn them through real contributions. Posts, reactions, collabs.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[['Post a Drop', '+2'], ['Someone Fires your Drop', '+1'], ['Someone Crowns your Drop', '+5'], ['Collab interest signal', '+2'], ['Complete your profile', 'up to +50']].map(([action, nodes]) => (
                  <div key={action} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                    <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>{action}</span>
                    <span style={{ color: '#FFE500', fontSize: '13px', fontWeight: '700' }}>{nodes} Nodes</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: 'rgba(255,229,0,0.04)', border: '0.5px solid rgba(255,229,0,0.15)', borderRadius: '20px', padding: '48px' }}>
              <div style={{ fontSize: '40px', fontWeight: '700', letterSpacing: '-0.03em', background: 'linear-gradient(90deg, #FFE500, #FFC200)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '8px' }}>Crowns</div>
              <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px', marginBottom: '28px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>The Nodable currency</div>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '15px', lineHeight: '1.8', marginBottom: '32px' }}>
                Crowns are how you show real appreciation. Free to earn daily. Limited to spend. When you Crown someone's Drop, you're saying this is elite — and they earn Nodes for it.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[['+10 free on login daily', 'Just show up'], ['Crown Drops you love', '3 per day max'], ['Unlock platform features', 'Coming soon'], ['Support other creators', 'Always free']].map(([action, note]) => (
                  <div key={action} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'rgba(255,229,0,0.04)', borderRadius: '8px', border: '0.5px solid rgba(255,229,0,0.08)' }}>
                    <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>{action}</span>
                    <span style={{ color: 'rgba(255,229,0,0.6)', fontSize: '12px', fontWeight: '600' }}>{note}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── LIVE DROPS ── */}
      {drops.length > 0 && (
        <section style={{ maxWidth: '1000px', margin: '0 auto', padding: '120px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '56px', gap: '24px', flexWrap: 'wrap' as const }}>
            <div>
              <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '16px' }}>Live from the community</div>
              <h2 style={{ color: '#fff', fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: '700', letterSpacing: '-0.03em', lineHeight: '1.08', margin: 0 }}>
                What creators<br />are dropping.
              </h2>
            </div>
            <a href="/feed" style={{ color: '#FFE500', fontSize: '14px', fontWeight: '600', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
              See the full feed →
            </a>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {drops.map((drop: any, i: number) => {
              const author = drop.users
              const accent = themeColors[author?.theme_color] || '#FFE500'
              const fireCount = drop.drop_reactions?.filter((r: any) => r.reaction === 'fire').length || 0
              const crownCount = drop.drop_reactions?.filter((r: any) => r.reaction === 'crown').length || 0
              return (
                <a key={drop.id} href="/feed" style={{ textDecoration: 'none' }}>
                  <div style={{ padding: '28px 0', borderBottom: '0.5px solid rgba(255,255,255,0.06)', display: 'grid', gridTemplateColumns: '1fr auto', gap: '24px', alignItems: 'start' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)', border: `1.5px solid ${accent}`, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                          {author?.profile_picture_url ? <img src={author.profile_picture_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" /> : <span style={{ color: accent, fontSize: '12px', fontWeight: '700' }}>{author?.username?.[0]?.toUpperCase()}</span>}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ color: '#fff', fontSize: '13px', fontWeight: '700' }}>@{author?.username}</span>
                          {author?.is_verified && <span style={{ background: accent, borderRadius: '50%', width: '14px', height: '14px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><svg width="7" height="7" viewBox="0 0 10 10" fill="none"><path d="M2 5l2 2 4-4" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></span>}
                          {drop.shoot_type && <span style={{ background: `${accent}12`, color: accent, fontSize: '10px', fontWeight: '600', padding: '2px 8px', borderRadius: '20px' }}>{drop.shoot_type}</span>}
                        </div>
                      </div>
                      <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '16px', lineHeight: '1.65', margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' } as any}>{drop.caption}</p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px', flexShrink: 0 }}>
                      <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '12px' }}>{timeAgo(drop.created_at)}</span>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        {fireCount > 0 && <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px' }}>🔥 {fireCount}</span>}
                        {crownCount > 0 && <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px' }}>👑 {crownCount}</span>}
                      </div>
                    </div>
                  </div>
                </a>
              )
            })}
          </div>
        </section>
      )}

      {/* ── CREATORS ── */}
      {creators.length > 0 && (
        <section style={{ background: '#0d0d0d', borderTop: '0.5px solid rgba(255,255,255,0.06)', padding: '120px 24px' }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '56px', gap: '24px', flexWrap: 'wrap' as const }}>
              <div>
                <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '16px' }}>The network</div>
                <h2 style={{ color: '#fff', fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: '700', letterSpacing: '-0.03em', lineHeight: '1.08', margin: 0 }}>
                  Creators already<br />on Nodable.
                </h2>
              </div>
              <a href="/creators" style={{ color: '#FFE500', fontSize: '14px', fontWeight: '600', textDecoration: 'none', flexShrink: 0 }}>Browse all creators →</a>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
              {creators.map((creator: any) => {
                const accent = themeColors[creator.theme_color] || '#FFE500'
                return (
                  <a key={creator.id} href={`/u/${creator.username}`} style={{ textDecoration: 'none' }}>
                    <div style={{ background: '#111', border: '0.5px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '28px 20px', textAlign: 'center' }}>
                      <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)', border: `2px solid ${accent}`, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', margin: '0 auto 16px' }}>
                        {creator.profile_picture_url ? <img src={creator.profile_picture_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" /> : <span style={{ color: accent, fontSize: '24px', fontWeight: '700' }}>{creator.username[0].toUpperCase()}</span>}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', marginBottom: '6px' }}>
                        <span style={{ color: '#fff', fontSize: '14px', fontWeight: '700', letterSpacing: '-0.01em' }}>@{creator.username}</span>
                        {creator.is_verified && <span style={{ background: accent, borderRadius: '50%', width: '15px', height: '15px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><svg width="7" height="7" viewBox="0 0 10 10" fill="none"><path d="M2 5l2 2 4-4" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></span>}
                      </div>
                      {creator.real_name && <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '12px', marginBottom: '4px' }}>{creator.real_name}</div>}
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
      <section style={{ maxWidth: '1000px', margin: '0 auto', padding: '120px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'start' }}>
          <div style={{ position: 'sticky' as const, top: '100px' }}>
            <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '20px' }}>The toolkit</div>
            <h2 style={{ color: '#fff', fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: '700', letterSpacing: '-0.03em', lineHeight: '1.08', margin: '0 0 24px' }}>
              Tools that do<br />
              <span style={{ color: '#FFE500' }}>the heavy lifting.</span>
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '15px', lineHeight: '1.8', margin: '0 0 32px' }}>
              Every tool on Nodable was built to solve a real problem creators face. AI-powered, fast, and designed to get out of your way.
            </p>
            <a href="/tools" style={{ color: '#FFE500', fontSize: '14px', fontWeight: '600', textDecoration: 'none' }}>Explore all tools →</a>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {[
              { href: '/tools/shot-list', num: '01', title: 'Shot list creator', desc: 'Describe your shoot and get a full, professional shot list in seconds. Paced by duration, tailored to your gear.' },
              { href: '/tools/invoice', num: '02', title: 'Invoice generator', desc: 'Describe the job, set your rate, and get a clean invoice with AI-generated line items. Print or save as PDF.' },
              { href: '/tools/mood-board', num: '03', title: 'Mood board generator', desc: 'Turn a feeling into a full creative brief. Color palette, lighting style, camera settings, LUT recommendations.' },
              { href: '/tools', num: '04', title: 'More coming', desc: 'Contracts, shoot planners, cinematic settings advisor, and more. Built around how you actually work.' },
            ].map(tool => (
              <a key={tool.num} href={tool.href} style={{ textDecoration: 'none' }}>
                <div style={{ padding: '28px 0', borderBottom: '0.5px solid rgba(255,255,255,0.06)', display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '24px', alignItems: 'start' }}>
                  <div style={{ color: 'rgba(255,255,255,0.15)', fontSize: '13px', fontWeight: '700', fontFamily: 'monospace', paddingTop: '3px' }}>{tool.num}</div>
                  <div>
                    <div style={{ color: '#fff', fontSize: '17px', fontWeight: '700', letterSpacing: '-0.01em', marginBottom: '8px' }}>{tool.title}</div>
                    <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '14px', lineHeight: '1.6' }}>{tool.desc}</div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section style={{ background: '#FFE500', padding: '120px 24px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ color: '#000', fontSize: 'clamp(40px, 6vw, 72px)', fontWeight: '700', letterSpacing: '-0.04em', lineHeight: '1.0', margin: '0 0 24px' }}>
            Your work belongs here.
          </h2>
          <p style={{ color: 'rgba(0,0,0,0.55)', fontSize: '18px', lineHeight: '1.7', maxWidth: '480px', margin: '0 auto 48px' }}>
            Early access is open. Join the waitlist and be among the first creators to set the standard on Nodable.
          </p>
          {!currentUser ? (
            <button onClick={() => setShowModal(true)}
              style={{ background: '#000', color: '#FFE500', fontSize: '16px', fontWeight: '700', padding: '18px 48px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-inter), sans-serif', letterSpacing: '-0.01em' }}>
              Join the waitlist
            </button>
          ) : (
            <a href={`/u/${currentUser.username}`}
              style={{ background: '#000', color: '#FFE500', fontSize: '16px', fontWeight: '700', padding: '18px 48px', borderRadius: '12px', textDecoration: 'none', display: 'inline-block', letterSpacing: '-0.01em' }}>
              Go to my profile →
            </a>
          )}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: '#000', padding: '48px 24px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' as const, gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <svg width="22" height="12" viewBox="0 0 4191.67 2190.15" fill="none">
              <path d="M767.96,1876.06c348.4-78.57,799.8-147.81,1327.87-147.54,525.29,27,974.51,69.24,1321.72,147.54,59.43-520.49,118.85-1040.98,178.28-1561.48-295.08,235.66-590.16,471.31-885.25,706.97-204.92-226.68-409.84-453.35-614.75-680.03-206.97,234.87-413.93,469.75-620.9,704.62-293.03-234.87-586.07-469.75-879.1-704.62,57.38,511.51,114.75,1023.03,172.13,1534.54Z" fill="#FFE500"/>
            </svg>
            <span style={{ background: 'linear-gradient(90deg, #FFE500, #FFC200)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: '15px', fontWeight: '700', letterSpacing: '-0.02em' }}>Nodable.</span>
          </div>
          <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
            <a href="/feed" style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px', textDecoration: 'none' }}>Feed</a>
            <a href="/creators" style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px', textDecoration: 'none' }}>Creators</a>
            <a href="/tools" style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px', textDecoration: 'none' }}>Tools</a>
          </div>
          <div style={{ color: 'rgba(255,255,255,0.15)', fontSize: '12px' }}>© 2026 Nodable</div>
        </div>
      </footer>

      <style>{`
        @keyframes marquee { 0% { transform: translateX(0) } 100% { transform: translateX(-50%) } }
        @keyframes pulse { 0%, 100% { opacity: 1 } 50% { opacity: 0.4 } }
      `}</style>
    </main>
  )
}
