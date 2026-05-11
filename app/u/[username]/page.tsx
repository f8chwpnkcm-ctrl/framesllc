'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

const themeColors: Record<string, string> = {
  yellow: '#FFE500',
  blue: '#3B82F6',
  red: '#EF4444',
  green: '#22C55E',
  purple: '#A855F7',
  white: '#FFFFFF',
}

export default function ProfilePage() {
  const params = useParams()
  const username = params.username as string
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [shotLists, setShotLists] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const [meRes, profileRes] = await Promise.all([
        fetch('/api/auth/me'),
        fetch(`/api/users/${username}`)
      ])
      const meData = await meRes.json()
      setCurrentUser(meData.user)
      if (profileRes.ok) {
        const profileData = await profileRes.json()
        setUser(profileData.user)
      }
      setLoading(false)
    }
    load()
  }, [username])

  useEffect(() => {
    if (currentUser?.username === username) {
      fetch('/api/shot-lists').then(r => r.json()).then(d => {
        if (d.lists) setShotLists(d.lists)
      })
    }
  }, [currentUser, username])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/')
  }

  if (loading) return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(to bottom, #0a0a0a, #111827)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-inter), sans-serif' }}>
      <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '14px' }}>Loading...</div>
    </main>
  )

  if (!user) return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(to bottom, #0a0a0a, #111827)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-inter), sans-serif' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ color: '#fff', fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>Profile not found</div>
        <a href="/" style={{ color: '#FFE500', fontSize: '14px' }}>Go home</a>
      </div>
    </main>
  )

  const isOwner = currentUser?.username === username
  const accent = themeColors[user.theme_color] || '#FFE500'

  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(to bottom, #0a0a0a, #111827)', fontFamily: 'var(--font-inter), sans-serif' }}>

      {/* Nav */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 40px', borderBottom: '0.5px solid rgba(255,255,255,0.08)', position: 'sticky', top: 0, background: 'rgba(10,10,10,0.85)', backdropFilter: 'blur(12px)', zIndex: 100 }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <svg width="26" height="14" viewBox="0 0 4191.67 2190.15" fill="none">
            <path d="M767.96,1876.06c348.4-78.57,799.8-147.81,1327.87-147.54,525.29,27,974.51,69.24,1321.72,147.54,59.43-520.49,118.85-1040.98,178.28-1561.48-295.08,235.66-590.16,471.31-885.25,706.97-204.92-226.68-409.84-453.35-614.75-680.03-206.97,234.87-413.93,469.75-620.9,704.62-293.03-234.87-586.07-469.75-879.1-704.62,57.38,511.51,114.75,1023.03,172.13,1534.54Z" fill="#FFE500"/>
          </svg>
          <span style={{ background: 'linear-gradient(90deg, #FFE500, #FFC200)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: '15px', fontWeight: '700', letterSpacing: '-0.02em' }}>Nodable.</span>
        </a>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <a href="/marketplace" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', textDecoration: 'none' }}>Marketplace</a>
          <a href="/tools" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', textDecoration: 'none' }}>Tools</a>
          {isOwner && (
            <button onClick={handleLogout} style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-inter), sans-serif' }}>Log out</button>
          )}
          {!currentUser && (
            <a href="/login" style={{ background: accent, color: '#000', fontSize: '13px', fontWeight: '700', padding: '8px 18px', borderRadius: '8px', textDecoration: 'none' }}>Log in</a>
          )}
        </div>
      </nav>

      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '60px 24px' }}>

        {/* Avatar + info */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '24px', marginBottom: '24px' }}>
          <div style={{ width: '88px', height: '88px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)', border: `2px solid ${accent}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
            {user.profile_picture_url ? (
              <img src={user.profile_picture_url} alt={user.username} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <span style={{ color: accent, fontSize: '32px', fontWeight: '700' }}>{user.username[0].toUpperCase()}</span>
            )}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' as const }}>
              <h1 style={{ color: '#fff', fontSize: '22px', fontWeight: '700', letterSpacing: '-0.02em', margin: 0 }}>@{user.username}</h1>
              {user.is_verified && (
                <span title="Verified" style={{ background: accent, borderRadius: '50%', width: '20px', height: '20px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M2 5l2 2 4-4" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              )}
              {user.open_for_work && (
                <span style={{ background: `${accent}20`, color: accent, fontSize: '11px', fontWeight: '600', padding: '3px 10px', borderRadius: '20px', border: `0.5px solid ${accent}40` }}>Open for work</span>
              )}
            </div>
            {user.real_name && (
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', marginBottom: '8px' }}>{user.real_name}</div>
            )}
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' as const, alignItems: 'center' }}>
              {user.location && <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '13px' }}>📍 {user.location}</span>}
              {user.camera_brand && <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '13px' }}>📷 {user.camera_brand.charAt(0).toUpperCase() + user.camera_brand.slice(1)}</span>}
              {user.instagram && (
                <a href={`https://instagram.com/${user.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: 'rgba(255,255,255,0.06)', border: '0.5px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '5px 12px', textDecoration: 'none', color: 'rgba(255,255,255,0.6)', fontSize: '12px', fontWeight: '600' }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                    <rect x="2" y="2" width="20" height="20" rx="5" stroke="rgba(255,255,255,0.6)" strokeWidth="2"/>
                    <circle cx="12" cy="12" r="4" stroke="rgba(255,255,255,0.6)" strokeWidth="2"/>
                    <circle cx="17.5" cy="6.5" r="1" fill="rgba(255,255,255,0.6)"/>
                  </svg>
                  @{user.instagram.replace('@', '')}
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Edit profile button */}
        {isOwner && (
          <div style={{ marginBottom: '28px' }}>
            <a href={`/u/${username}/edit`}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '9px 18px', textDecoration: 'none', color: 'rgba(255,255,255,0.5)', fontSize: '13px', fontWeight: '600' }}>
              ✏️ Edit profile
            </a>
          </div>
        )}

        {/* Bio */}
        {user.bio && (
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '15px', lineHeight: '1.7', marginBottom: '32px' }}>{user.bio}</p>
        )}

        {/* Stats */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '40px' }}>
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '20px 24px', flex: 1, textAlign: 'center' }}>
            <div style={{ color: accent, fontSize: '24px', fontWeight: '700', letterSpacing: '-0.02em' }}>{user.nodes}</div>
            <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px', marginTop: '2px' }}>Nodes</div>
          </div>
          {isOwner && (
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '20px 24px', flex: 1, textAlign: 'center' }}>
              <div style={{ color: accent, fontSize: '24px', fontWeight: '700', letterSpacing: '-0.02em' }}>{user.crowns} 👑</div>
              <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px', marginTop: '2px' }}>Crowns</div>
            </div>
          )}
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '20px 24px', flex: 1, textAlign: 'center' }}>
            <div style={{ color: accent, fontSize: '18px', fontWeight: '700', letterSpacing: '-0.02em' }}>
              {new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
            </div>
            <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px', marginTop: '2px' }}>Joined</div>
          </div>
        </div>

        {/* Shot lists — owner only */}
        {isOwner && (
          <div style={{ marginTop: '48px', paddingTop: '40px', borderTop: '0.5px solid rgba(255,255,255,0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2 style={{ color: '#fff', fontSize: '18px', fontWeight: '700', margin: 0 }}>Shot lists</h2>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                {shotLists.length > 0 && (
                  <a href={`/u/${username}/shot-lists`} style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', textDecoration: 'none' }}>View all →</a>
                )}
                <a href="/tools/shot-list" style={{ color: accent, fontSize: '13px', textDecoration: 'none', fontWeight: '600' }}>+ New</a>
              </div>
            </div>
            {shotLists.length === 0 ? (
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '0.5px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '32px', textAlign: 'center' }}>
                <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '14px', marginBottom: '12px' }}>No saved shot lists yet</div>
                <a href="/tools/shot-list" style={{ color: accent, fontSize: '13px', fontWeight: '700', textDecoration: 'none', background: `${accent}15`, padding: '8px 18px', borderRadius: '8px', border: `0.5px solid ${accent}30` }}>Generate your first one</a>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {shotLists.slice(0, 3).map((list: any) => (
                  <a key={list.id} href={`/u/${username}/shot-lists`} style={{ textDecoration: 'none' }}>
                    <div style={{ background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ color: '#fff', fontSize: '14px', fontWeight: '700', marginBottom: '4px' }}>{list.title}</div>
                        <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px' }}>{list.media_type} · {list.event_type} · {new Date(list.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                      </div>
                      <span style={{ color: 'rgba(255,255,255,0.2)' }}>→</span>
                    </div>
                  </a>
                ))}
                {shotLists.length > 3 && (
                  <a href={`/u/${username}/shot-lists`} style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '13px', textDecoration: 'none', padding: '12px' }}>
                    +{shotLists.length - 3} more
                  </a>
                )}
              </div>
            )}
          </div>
        )}

      </div>
    </main>
  )
}
