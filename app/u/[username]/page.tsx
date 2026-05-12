'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

const themeColors: Record<string, string> = {
  yellow: '#FFE500', blue: '#3B82F6', red: '#EF4444',
  green: '#22C55E', purple: '#A855F7', white: '#FFFFFF',
}

function getCompletionScore(user: any) {
  const fields = [
    { key: 'profile_picture_url', label: 'Profile photo', nodes: 10 },
    { key: 'real_name', label: 'Real name', nodes: 5 },
    { key: 'bio', label: 'Bio', nodes: 10 },
    { key: 'location', label: 'Location', nodes: 5 },
    { key: 'camera_brand', label: 'Camera brand', nodes: 5 },
    { key: 'instagram', label: 'Instagram', nodes: 5 },
    { key: 'specialties', label: 'Specialties', nodes: 10, check: (v: any) => v && v.length > 0 },
  ]
  const completed = fields.filter(f => f.check ? f.check(user[f.key]) : !!user[f.key])
  const total = fields.reduce((sum, f) => sum + f.nodes, 0)
  const earned = completed.reduce((sum, f) => sum + f.nodes, 0)
  const missing = fields.filter(f => !(f.check ? f.check(user[f.key]) : !!user[f.key]))
  return { percent: Math.round((completed.length / fields.length) * 100), earned, total, missing }
}

export default function ProfilePage() {
  const params = useParams()
  const username = params.username as string
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [shotLists, setShotLists] = useState<any[]>([])
  const [invoices, setInvoices] = useState<any[]>([])
  const [moodBoards, setMoodBoards] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showCompletion, setShowCompletion] = useState(false)

  useEffect(() => {
    const load = async () => {
      const [meRes, profileRes] = await Promise.all([fetch('/api/auth/me'), fetch(`/api/users/${username}`)])
      const meData = await meRes.json()
      setCurrentUser(meData.user)
      if (profileRes.ok) { const d = await profileRes.json(); setUser(d.user) }
      setLoading(false)
    }
    load()
  }, [username])

  useEffect(() => {
    if (currentUser?.username === username) {
      fetch('/api/shot-lists').then(r => r.json()).then(d => { if (d.lists) setShotLists(d.lists) })
      fetch('/api/invoices').then(r => r.json()).then(d => { if (d.invoices) setInvoices(d.invoices) })
      fetch('/api/mood-boards').then(r => r.json()).then(d => { if (d.boards) setMoodBoards(d.boards) })
    }
  }, [currentUser, username])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/')
  }

  if (loading) return (
    <main style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-inter), sans-serif' }}>
      <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '14px' }}>Loading...</div>
    </main>
  )

  if (!user) return (
    <main style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-inter), sans-serif' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ color: '#fff', fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>Profile not found</div>
        <a href="/" style={{ color: '#FFE500', fontSize: '14px' }}>Go home</a>
      </div>
    </main>
  )

  const isOwner = currentUser?.username === username
  const accent = themeColors[user.theme_color] || '#FFE500'
  const completion = isOwner ? getCompletionScore(user) : null

  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(to bottom, #0a0a0a, #0f1318)', fontFamily: 'var(--font-inter), sans-serif' }}>

      {/* Nav */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px', borderBottom: '0.5px solid rgba(255,255,255,0.08)', position: 'sticky', top: 0, background: 'rgba(10,10,10,0.9)', backdropFilter: 'blur(12px)', zIndex: 100 }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
          <svg width="24" height="13" viewBox="0 0 4191.67 2190.15" fill="none">
            <path d="M767.96,1876.06c348.4-78.57,799.8-147.81,1327.87-147.54,525.29,27,974.51,69.24,1321.72,147.54,59.43-520.49,118.85-1040.98,178.28-1561.48-295.08,235.66-590.16,471.31-885.25,706.97-204.92-226.68-409.84-453.35-614.75-680.03-206.97,234.87-413.93,469.75-620.9,704.62-293.03-234.87-586.07-469.75-879.1-704.62,57.38,511.51,114.75,1023.03,172.13,1534.54Z" fill="#FFE500"/>
          </svg>
          <span style={{ background: 'linear-gradient(90deg, #FFE500, #FFC200)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: '15px', fontWeight: '700', letterSpacing: '-0.02em' }}>Nodable.</span>
        </a>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <a href="/feed" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', textDecoration: 'none', padding: '6px 12px' }}>Feed</a>
          <a href="/tools" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', textDecoration: 'none', padding: '6px 12px' }}>Tools</a>
          {isOwner && (
            <>
              <a href={`/u/${username}/edit`} style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', textDecoration: 'none', padding: '7px 14px', border: '0.5px solid rgba(255,255,255,0.12)', borderRadius: '8px' }}>Edit</a>
              <button onClick={handleLogout} style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-inter), sans-serif', padding: '6px 10px' }}>Log out</button>
            </>
          )}
          {!currentUser && <a href="/login" style={{ background: accent, color: '#000', fontSize: '13px', fontWeight: '700', padding: '8px 18px', borderRadius: '8px', textDecoration: 'none' }}>Log in</a>}
        </div>
      </nav>

      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '48px 24px 80px' }}>

        {/* ── HEADER BLOCK ── */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px', marginBottom: '20px' }}>
            {/* Avatar */}
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)', border: `2px solid ${accent}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
              {user.profile_picture_url
                ? <img src={user.profile_picture_url} alt={user.username} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <span style={{ color: accent, fontSize: '28px', fontWeight: '700' }}>{user.username[0].toUpperCase()}</span>
              }
            </div>
            {/* Name + meta */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' as const, marginBottom: '4px' }}>
                <h1 style={{ color: '#fff', fontSize: '20px', fontWeight: '700', letterSpacing: '-0.02em', margin: 0 }}>@{user.username}</h1>
                {user.is_verified && (
                  <span title="Verified" style={{ background: accent, borderRadius: '50%', width: '18px', height: '18px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="9" height="9" viewBox="0 0 10 10" fill="none"><path d="M2 5l2 2 4-4" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </span>
                )}
                {user.open_for_work && (
                  <span style={{ background: 'rgba(34,197,94,0.1)', color: '#22C55E', fontSize: '10px', fontWeight: '600', padding: '2px 8px', borderRadius: '20px', border: '0.5px solid rgba(34,197,94,0.25)' }}>Open for work</span>
                )}
              </div>
              {user.real_name && <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', marginBottom: '6px' }}>{user.real_name}</div>}
              {user.member_number && <div style={{ color: 'rgba(255,255,255,0.18)', fontSize: '11px', fontFamily: 'monospace', marginBottom: '8px' }}>Nodable #{user.member_number}</div>}
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' as const, alignItems: 'center' }}>
                {user.location && <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '12px' }}>📍 {user.location}</span>}
                {user.camera_brand && <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '12px' }}>📷 {user.camera_brand.charAt(0).toUpperCase() + user.camera_brand.slice(1)}</span>}
                {user.instagram && (
                  <a href={`https://instagram.com/${user.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(255,255,255,0.06)', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '4px 10px', textDecoration: 'none', color: 'rgba(255,255,255,0.55)', fontSize: '12px', fontWeight: '600' }}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="5" stroke="rgba(255,255,255,0.55)" strokeWidth="2"/><circle cx="12" cy="12" r="4" stroke="rgba(255,255,255,0.55)" strokeWidth="2"/><circle cx="17.5" cy="6.5" r="1" fill="rgba(255,255,255,0.55)"/></svg>
                    @{user.instagram.replace('@', '')}
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Bio */}
          {user.bio && <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '14px', lineHeight: '1.7', margin: '0 0 16px' }}>{user.bio}</p>}

          {/* Specialties */}
          {user.specialties && user.specialties.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '6px' }}>
              {user.specialties.map((s: string) => (
                <span key={s} style={{ background: `${accent}12`, color: accent, fontSize: '11px', fontWeight: '600', padding: '3px 10px', borderRadius: '20px', border: `0.5px solid ${accent}25` }}>{s}</span>
              ))}
            </div>
          )}
        </div>

        {/* ── STATS ROW ── */}
        <div style={{ display: 'grid', gridTemplateColumns: isOwner ? 'repeat(3, 1fr)' : 'repeat(2, 1fr)', gap: '10px', marginBottom: '32px' }}>
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '16px', textAlign: 'center' as const }}>
            <div style={{ color: accent, fontSize: '22px', fontWeight: '700', letterSpacing: '-0.02em' }}>{user.nodes}</div>
            <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px', marginTop: '2px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Nodes</div>
          </div>
          {isOwner && (
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '16px', textAlign: 'center' as const }}>
              <div style={{ color: accent, fontSize: '22px', fontWeight: '700', letterSpacing: '-0.02em' }}>{user.crowns}</div>
              <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px', marginTop: '2px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Crowns 👑</div>
            </div>
          )}
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '16px', textAlign: 'center' as const }}>
            <div style={{ color: '#fff', fontSize: '16px', fontWeight: '700' }}>{new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</div>
            <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px', marginTop: '2px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Joined</div>
          </div>
        </div>

        {/* ── PROFILE COMPLETION (owner only) ── */}
        {isOwner && completion && completion.percent < 100 && (
          <div onClick={() => setShowCompletion(v => !v)}
            style={{ background: `${accent}08`, border: `0.5px solid ${accent}20`, borderRadius: '12px', padding: '14px 18px', marginBottom: '32px', cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: '#fff', fontSize: '13px', fontWeight: '600' }}>Profile {completion.percent}% complete</span>
              <span style={{ color: accent, fontSize: '12px', fontWeight: '600' }}>+{completion.total - completion.earned} Nodes available</span>
            </div>
            <div style={{ height: '3px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px' }}>
              <div style={{ height: '100%', background: accent, borderRadius: '2px', width: `${completion.percent}%`, transition: 'width 0.3s' }} />
            </div>
            {showCompletion && (
              <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column' as const, gap: '6px' }}>
                {completion.missing.map((f: any) => (
                  <div key={f.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px' }}>Add {f.label}</span>
                    <span style={{ color: accent, fontSize: '11px', fontWeight: '600' }}>+{f.nodes} Nodes</span>
                  </div>
                ))}
                <a href={`/u/${username}/edit`} style={{ color: accent, fontSize: '12px', fontWeight: '700', textDecoration: 'none', marginTop: '4px' }}>Complete your profile →</a>
              </div>
            )}
          </div>
        )}

        {/* ── OWNER SECTIONS ── */}
        {isOwner && (
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '0' }}>

            {[
              {
                title: 'Shot lists',
                count: shotLists.length,
                newHref: '/tools/shot-list',
                viewHref: `/u/${username}/shot-lists`,
                items: shotLists.slice(0, 3).map((l: any) => ({
                  id: l.id,
                  title: l.title,
                  sub: `${l.media_type} · ${l.event_type} · ${new Date(l.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`,
                  href: `/u/${username}/shot-lists`,
                })),
                emptyLabel: 'Generate your first one',
                moreHref: `/u/${username}/shot-lists`,
              },
              {
                title: 'Mood boards',
                count: moodBoards.length,
                newHref: '/tools/mood-board',
                viewHref: undefined,
                items: moodBoards.slice(0, 3).map((b: any) => ({
                  id: b.id,
                  title: b.title,
                  sub: b.vibe.length > 64 ? b.vibe.slice(0, 64) + '...' : b.vibe,
                  href: '/tools/mood-board',
                })),
                emptyLabel: 'Create your first mood board',
                moreHref: '/tools/mood-board',
              },
              {
                title: 'Invoices',
                count: invoices.length,
                newHref: '/tools/invoice',
                viewHref: undefined,
                items: invoices.slice(0, 3).map((i: any) => ({
                  id: i.id,
                  title: `${i.invoice_number} — ${i.client_name}`,
                  sub: `$${i.total?.toFixed(2)} · ${new Date(i.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`,
                  href: '/tools/invoice',
                })),
                emptyLabel: 'Create your first invoice',
                moreHref: '/tools/invoice',
              },
            ].map((section, si) => (
              <div key={section.title} style={{ paddingTop: '28px', marginTop: si > 0 ? '0' : '0', borderTop: '0.5px solid rgba(255,255,255,0.07)', paddingBottom: '28px' }}>
                {/* Section header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h2 style={{ color: '#fff', fontSize: '15px', fontWeight: '700', margin: 0 }}>{section.title}</h2>
                    {section.count > 0 && <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '13px' }}>{section.count}</span>}
                  </div>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    {section.viewHref && section.count > 0 && (
                      <a href={section.viewHref} style={{ color: 'rgba(255,255,255,0.35)', fontSize: '12px', textDecoration: 'none' }}>View all →</a>
                    )}
                    <a href={section.newHref} style={{ color: accent, fontSize: '12px', fontWeight: '600', textDecoration: 'none' }}>+ New</a>
                  </div>
                </div>

                {/* Content */}
                {section.count === 0 ? (
                  <div style={{ background: 'rgba(255,255,255,0.02)', border: '0.5px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '24px', textAlign: 'center' as const }}>
                    <div style={{ color: 'rgba(255,255,255,0.25)', fontSize: '13px', marginBottom: '10px' }}>Nothing saved yet</div>
                    <a href={section.newHref} style={{ color: accent, fontSize: '12px', fontWeight: '700', textDecoration: 'none', background: `${accent}12`, padding: '7px 16px', borderRadius: '8px', border: `0.5px solid ${accent}25` }}>{section.emptyLabel}</a>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '6px' }}>
                    {section.items.map((item: any) => (
                      <a key={item.id} href={item.href} style={{ textDecoration: 'none' }}>
                        <div style={{ background: 'rgba(255,255,255,0.025)', border: '0.5px solid rgba(255,255,255,0.07)', borderRadius: '10px', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                          <div style={{ minWidth: 0 }}>
                            <div style={{ color: '#fff', fontSize: '13px', fontWeight: '600', marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{item.title}</div>
                            <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px' }}>{item.sub}</div>
                          </div>
                          <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: '14px', flexShrink: 0 }}>→</span>
                        </div>
                      </a>
                    ))}
                    {section.count > 3 && (
                      <a href={section.moreHref} style={{ textAlign: 'center', color: 'rgba(255,255,255,0.25)', fontSize: '12px', textDecoration: 'none', padding: '8px' }}>
                        +{section.count - 3} more
                      </a>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
