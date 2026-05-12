'use client'

import { useEffect, useState } from 'react'

const themeColors: Record<string, string> = {
  yellow: '#FFE500',
  blue: '#3B82F6',
  red: '#EF4444',
  green: '#22C55E',
  purple: '#A855F7',
  white: '#FFFFFF',
}

export default function CreatorsPage() {
  const [creators, setCreators] = useState<any[]>([])
  const [filtered, setFiltered] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [openForWork, setOpenForWork] = useState(false)

  useEffect(() => {
    fetch('/api/creators').then(r => r.json()).then(d => {
      if (d.creators) {
        setCreators(d.creators)
        setFiltered(d.creators)
      }
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    let results = [...creators]
    if (search) {
      const q = search.toLowerCase()
      results = results.filter(c =>
        c.username?.toLowerCase().includes(q) ||
        c.real_name?.toLowerCase().includes(q) ||
        c.location?.toLowerCase().includes(q) ||
        c.camera_brand?.toLowerCase().includes(q) ||
        c.bio?.toLowerCase().includes(q)
      )
    }
    if (verifiedOnly) results = results.filter(c => c.is_verified)
    if (openForWork) results = results.filter(c => c.open_for_work)
    setFiltered(results)
  }, [search, verifiedOnly, openForWork, creators])

  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(to bottom, #0a0a0a, #111827)', fontFamily: 'var(--font-inter), sans-serif' }}>
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 40px', borderBottom: '0.5px solid rgba(255,255,255,0.08)', position: 'sticky', top: 0, background: 'rgba(10,10,10,0.85)', backdropFilter: 'blur(12px)', zIndex: 100 }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <svg width="26" height="14" viewBox="0 0 4191.67 2190.15" fill="none">
            <path d="M767.96,1876.06c348.4-78.57,799.8-147.81,1327.87-147.54,525.29,27,974.51,69.24,1321.72,147.54,59.43-520.49,118.85-1040.98,178.28-1561.48-295.08,235.66-590.16,471.31-885.25,706.97-204.92-226.68-409.84-453.35-614.75-680.03-206.97,234.87-413.93,469.75-620.9,704.62-293.03-234.87-586.07-469.75-879.1-704.62,57.38,511.51,114.75,1023.03,172.13,1534.54Z" fill="#FFE500"/>
          </svg>
          <span style={{ background: 'linear-gradient(90deg, #FFE500, #FFC200)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: '15px', fontWeight: '700', letterSpacing: '-0.02em' }}>Nodable.</span>
        </a>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <a href="/tools" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', textDecoration: 'none' }}>Tools</a>
          <a href="/marketplace" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', textDecoration: 'none' }}>Marketplace</a>
        </div>
      </nav>

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '60px 24px' }}>

        {/* Header */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '12px' }}>The network</div>
          <h1 style={{ color: '#fff', fontSize: '36px', fontWeight: '700', letterSpacing: '-0.03em', margin: '0 0 12px' }}>Creators</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '15px', margin: 0 }}>The people setting the standard.</p>
        </div>

        {/* Search + filters */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '40px', flexWrap: 'wrap' as const }}>
          <div style={{ flex: 1, minWidth: '200px', position: 'relative' as const }}>
            <input
              type="text"
              placeholder="Search by name, location, camera..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: '0.5px solid rgba(255,255,255,0.12)', borderRadius: '10px', padding: '12px 16px 12px 40px', fontSize: '14px', color: '#fff', outline: 'none', fontFamily: 'var(--font-inter), sans-serif', boxSizing: 'border-box' as const }}
            />
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }}>
              <circle cx="11" cy="11" r="8" stroke="white" strokeWidth="2"/>
              <path d="m21 21-4.35-4.35" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <button onClick={() => setVerifiedOnly(v => !v)}
            style={{ padding: '12px 20px', borderRadius: '10px', border: `0.5px solid ${verifiedOnly ? '#FFE500' : 'rgba(255,255,255,0.12)'}`, background: verifiedOnly ? 'rgba(255,229,0,0.1)' : 'transparent', color: verifiedOnly ? '#FFE500' : 'rgba(255,255,255,0.5)', fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: 'var(--font-inter), sans-serif', display: 'flex', alignItems: 'center', gap: '6px' }}>
            {verifiedOnly && <span style={{ background: '#FFE500', borderRadius: '50%', width: '16px', height: '16px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><svg width="8" height="8" viewBox="0 0 10 10" fill="none"><path d="M2 5l2 2 4-4" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></span>}
            Verified only
          </button>
          <button onClick={() => setOpenForWork(v => !v)}
            style={{ padding: '12px 20px', borderRadius: '10px', border: `0.5px solid ${openForWork ? '#22C55E' : 'rgba(255,255,255,0.12)'}`, background: openForWork ? 'rgba(34,197,94,0.08)' : 'transparent', color: openForWork ? '#22C55E' : 'rgba(255,255,255,0.5)', fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: 'var(--font-inter), sans-serif' }}>
            Open for work
          </button>
        </div>

        {/* Results count */}
        <div style={{ color: 'rgba(255,255,255,0.25)', fontSize: '12px', marginBottom: '24px' }}>
          {loading ? 'Loading...' : `${filtered.length} creator${filtered.length !== 1 ? 's' : ''}`}
          {(verifiedOnly || openForWork || search) && ' matching your filters'}
        </div>

        {/* Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'rgba(255,255,255,0.3)' }}>Loading creators...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '15px', marginBottom: '8px' }}>No creators found</div>
            <div style={{ color: 'rgba(255,255,255,0.15)', fontSize: '13px' }}>Try adjusting your filters</div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
            {filtered.map((creator: any) => {
              const accent = themeColors[creator.theme_color] || '#FFE500'
              return (
                <a key={creator.id} href={`/u/${creator.username}`} style={{ textDecoration: 'none' }}>
                  <div style={{ background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '24px', transition: 'border-color 0.2s', cursor: 'pointer' }}>

                    {/* Avatar + name */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                      <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)', border: `2px solid ${accent}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
                        {creator.profile_picture_url ? (
                          <img src={creator.profile_picture_url} alt={creator.username} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <span style={{ color: accent, fontSize: '22px', fontWeight: '700' }}>{creator.username[0].toUpperCase()}</span>
                        )}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                          <span style={{ color: '#fff', fontSize: '15px', fontWeight: '700', letterSpacing: '-0.01em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>@{creator.username}</span>
                          {creator.is_verified && (
                            <span style={{ background: accent, borderRadius: '50%', width: '16px', height: '16px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
                                <path d="M2 5l2 2 4-4" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </span>
                          )}
                        </div>
                        {creator.real_name && <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{creator.real_name}</div>}
                      </div>
                    </div>

                    {/* Bio */}
                    {creator.bio && (
                      <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', lineHeight: '1.6', marginBottom: '16px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' } as any}>{creator.bio}</p>
                    )}

                    {/* Tags */}
                    <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '6px', marginBottom: '16px' }}>
                      {creator.location && (
                        <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '11px', background: 'rgba(255,255,255,0.04)', padding: '3px 8px', borderRadius: '4px' }}>📍 {creator.location}</span>
                      )}
                      {creator.camera_brand && (
                        <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '11px', background: 'rgba(255,255,255,0.04)', padding: '3px 8px', borderRadius: '4px' }}>📷 {creator.camera_brand.charAt(0).toUpperCase() + creator.camera_brand.slice(1)}</span>
                      )}
                      {creator.open_for_work && (
                        <span style={{ color: '#22C55E', fontSize: '11px', background: 'rgba(34,197,94,0.08)', padding: '3px 8px', borderRadius: '4px', border: '0.5px solid rgba(34,197,94,0.2)' }}>Open for work</span>
                      )}
                    </div>

                    {/* Nodes */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '14px', borderTop: '0.5px solid rgba(255,255,255,0.06)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ color: accent, fontSize: '16px', fontWeight: '700' }}>{creator.nodes}</span>
                        <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px' }}>Nodes</span>
                      </div>
                      <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '12px' }}>
                        Joined {new Date(creator.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  </div>
                </a>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
