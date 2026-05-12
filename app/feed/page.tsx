'use client'

import { useEffect, useState, useRef } from 'react'

const themeColors: Record<string, string> = {
  yellow: '#FFE500', blue: '#3B82F6', red: '#EF4444',
  green: '#22C55E', purple: '#A855F7', white: '#FFFFFF',
}

const REACTIONS = [
  { key: 'fire', emoji: '🔥', label: 'Fire', desc: 'Clean work' },
  { key: 'charged', emoji: '⚡', label: 'Charged', desc: 'Inspired me' },
  { key: 'crown', emoji: '👑', label: 'Crown', desc: 'Elite (3/day)' },
  { key: 'seen', emoji: '👁️', label: 'Seen', desc: 'Acknowledged' },
]

const SHOOT_TYPES = ['Wedding', 'Sports', 'Concert', 'Corporate', 'Portrait', 'Fashion', 'Real Estate', 'Documentary', 'Street', 'Nature', 'Events', 'Music Video', 'Aerial', 'Other']

export default function FeedPage() {
  const [user, setUser] = useState<any>(null)
  const [drops, setDrops] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [composing, setComposing] = useState(false)
  const [posting, setPosting] = useState(false)
  const [expandedDrop, setExpandedDrop] = useState<number | null>(null)
  const [comments, setComments] = useState<Record<number, any[]>>({})
  const [commentInput, setCommentInput] = useState<Record<number, string>>({})
  const [collabInterest, setCollabInterest] = useState<Record<number, boolean>>({})
  const [submittingComment, setSubmittingComment] = useState<number | null>(null)
  const [form, setForm] = useState({ caption: '', shoot_type: '', gear_used: '', location_tag: '' })

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.json()).then(d => setUser(d.user))
    loadDrops()
  }, [])

  const loadDrops = async () => {
    const res = await fetch('/api/drops')
    const data = await res.json()
    if (data.drops) setDrops(data.drops)
    setLoading(false)
  }

  const handlePost = async () => {
    if (!form.caption.trim()) return
    setPosting(true)
    const res = await fetch('/api/drops', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    const data = await res.json()
    if (data.drop) {
      setDrops(prev => [data.drop, ...prev])
      setForm({ caption: '', shoot_type: '', gear_used: '', location_tag: '' })
      setComposing(false)
    }
    setPosting(false)
  }

  const handleReact = async (drop_id: number, reaction: string) => {
    if (!user) { window.location.href = '/login'; return }
    const res = await fetch('/api/drops/react', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ drop_id, reaction })
    })
    const data = await res.json()
    if (data.error) { alert(data.error); return }
    setDrops(prev => prev.map(d => {
      if (d.id !== drop_id) return d
      const existing = d.drop_reactions.find((r: any) => r.reaction === reaction && r.user_id === user.id)
      if (existing) {
        return { ...d, drop_reactions: d.drop_reactions.filter((r: any) => !(r.reaction === reaction && r.user_id === user.id)) }
      } else {
        return { ...d, drop_reactions: [...d.drop_reactions, { reaction, user_id: user.id }] }
      }
    }))
  }

  const loadComments = async (drop_id: number) => {
    if (comments[drop_id]) { setExpandedDrop(expandedDrop === drop_id ? null : drop_id); return }
    const res = await fetch(`/api/drops/comment?drop_id=${drop_id}`)
    const data = await res.json()
    if (data.comments) setComments(prev => ({ ...prev, [drop_id]: data.comments }))
    setExpandedDrop(drop_id)
  }

  const handleComment = async (drop_id: number) => {
    if (!user || !commentInput[drop_id]?.trim()) return
    setSubmittingComment(drop_id)
    const res = await fetch('/api/drops/comment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ drop_id, content: commentInput[drop_id], is_collab_interest: collabInterest[drop_id] || false })
    })
    const data = await res.json()
    if (data.comment) {
      setComments(prev => ({ ...prev, [drop_id]: [...(prev[drop_id] || []), data.comment] }))
      setCommentInput(prev => ({ ...prev, [drop_id]: '' }))
      setCollabInterest(prev => ({ ...prev, [drop_id]: false }))
      setDrops(prev => prev.map(d => d.id === drop_id ? { ...d, drop_comments: [...d.drop_comments, data.comment] } : d))
    }
    setSubmittingComment(null)
  }

  const handleDelete = async (drop_id: number) => {
    await fetch('/api/drops', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: drop_id }) })
    setDrops(prev => prev.filter(d => d.id !== drop_id))
  }

  const getReactionCount = (drop: any, reaction: string) => drop.drop_reactions.filter((r: any) => r.reaction === reaction).length
  const hasReacted = (drop: any, reaction: string) => user && drop.drop_reactions.some((r: any) => r.reaction === reaction && r.user_id === user.id)

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime()
    const m = Math.floor(diff / 60000)
    if (m < 1) return 'just now'
    if (m < 60) return `${m}m ago`
    const h = Math.floor(m / 60)
    if (h < 24) return `${h}h ago`
    return `${Math.floor(h / 24)}d ago`
  }

  const inputStyle = { width: '100%', background: 'rgba(255,255,255,0.06)', border: '0.5px solid rgba(255,255,255,0.12)', borderRadius: '10px', padding: '12px 16px', fontSize: '14px', color: '#fff', outline: 'none', fontFamily: 'var(--font-inter), sans-serif', boxSizing: 'border-box' as const }

  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(to bottom, #0a0a0a, #111827)', fontFamily: 'var(--font-inter), sans-serif' }}>
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 40px', borderBottom: '0.5px solid rgba(255,255,255,0.08)', position: 'sticky', top: 0, background: 'rgba(10,10,10,0.92)', backdropFilter: 'blur(12px)', zIndex: 100 }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <svg width="26" height="14" viewBox="0 0 4191.67 2190.15" fill="none">
            <path d="M767.96,1876.06c348.4-78.57,799.8-147.81,1327.87-147.54,525.29,27,974.51,69.24,1321.72,147.54,59.43-520.49,118.85-1040.98,178.28-1561.48-295.08,235.66-590.16,471.31-885.25,706.97-204.92-226.68-409.84-453.35-614.75-680.03-206.97,234.87-413.93,469.75-620.9,704.62-293.03-234.87-586.07-469.75-879.1-704.62,57.38,511.51,114.75,1023.03,172.13,1534.54Z" fill="#FFE500"/>
          </svg>
          <span style={{ background: 'linear-gradient(90deg, #FFE500, #FFC200)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: '15px', fontWeight: '700', letterSpacing: '-0.02em' }}>Nodable.</span>
        </a>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <a href="/creators" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', textDecoration: 'none' }}>Creators</a>
          <a href="/tools" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', textDecoration: 'none' }}>Tools</a>
          {user ? (
            <a href={`/u/${user.username}`} style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
              <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'rgba(255,229,0,0.15)', border: '1.5px solid #FFE500', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                {user.profile_picture_url ? <img src={user.profile_picture_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" /> : <span style={{ color: '#FFE500', fontSize: '12px', fontWeight: '700' }}>{user.username[0].toUpperCase()}</span>}
              </div>
            </a>
          ) : (
            <a href="/login" style={{ background: '#FFE500', color: '#000', fontSize: '12px', fontWeight: '700', padding: '8px 18px', borderRadius: '6px', textDecoration: 'none' }}>Log in</a>
          )}
        </div>
      </nav>

      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '40px 24px' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
          <div>
            <h1 style={{ color: '#fff', fontSize: '24px', fontWeight: '700', letterSpacing: '-0.02em', margin: '0 0 4px' }}>Drops</h1>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px', margin: 0 }}>What the community is shooting</p>
          </div>
          {user && (
            <button onClick={() => setComposing(v => !v)}
              style={{ background: composing ? 'rgba(255,255,255,0.06)' : '#FFE500', color: composing ? 'rgba(255,255,255,0.5)' : '#000', fontSize: '13px', fontWeight: '700', padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-inter), sans-serif' }}>
              {composing ? 'Cancel' : '+ Drop'}
            </button>
          )}
        </div>

        {/* Composer */}
        {composing && user && (
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '24px', marginBottom: '32px' }}>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,229,0,0.15)', border: '1.5px solid #FFE500', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                {user.profile_picture_url ? <img src={user.profile_picture_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" /> : <span style={{ color: '#FFE500', fontSize: '13px', fontWeight: '700' }}>{user.username[0].toUpperCase()}</span>}
              </div>
              <textarea
                placeholder="What did you shoot? Share a thought, a lesson, a moment..."
                value={form.caption}
                onChange={e => setForm(f => ({ ...f, caption: e.target.value }))}
                style={{ ...inputStyle, resize: 'none', height: '80px', lineHeight: '1.6', padding: '10px 14px' }}
                autoFocus
              />
            </div>

            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' as const }}>
              {SHOOT_TYPES.map(t => (
                <button key={t} onClick={() => setForm(f => ({ ...f, shoot_type: f.shoot_type === t ? '' : t }))}
                  style={{ padding: '5px 12px', borderRadius: '20px', border: `0.5px solid ${form.shoot_type === t ? '#FFE500' : 'rgba(255,255,255,0.1)'}`, background: form.shoot_type === t ? 'rgba(255,229,0,0.1)' : 'transparent', color: form.shoot_type === t ? '#FFE500' : 'rgba(255,255,255,0.4)', fontSize: '12px', cursor: 'pointer', fontFamily: 'var(--font-inter), sans-serif' }}>
                  {t}
                </button>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '16px' }}>
              <input style={{ ...inputStyle, fontSize: '13px', padding: '10px 14px' }} placeholder="📷 Gear used" value={form.gear_used} onChange={e => setForm(f => ({ ...f, gear_used: e.target.value }))} />
              <input style={{ ...inputStyle, fontSize: '13px', padding: '10px 14px' }} placeholder="📍 Location" value={form.location_tag} onChange={e => setForm(f => ({ ...f, location_tag: e.target.value }))} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={handlePost} disabled={posting || !form.caption.trim()}
                style={{ background: form.caption.trim() ? '#FFE500' : 'rgba(255,255,255,0.08)', color: form.caption.trim() ? '#000' : 'rgba(255,255,255,0.3)', fontSize: '13px', fontWeight: '700', padding: '10px 24px', borderRadius: '8px', border: 'none', cursor: form.caption.trim() ? 'pointer' : 'default', fontFamily: 'var(--font-inter), sans-serif' }}>
                {posting ? 'Posting...' : 'Drop it'}
              </button>
            </div>
          </div>
        )}

        {/* Feed */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'rgba(255,255,255,0.3)' }}>Loading drops...</div>
        ) : drops.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '15px', marginBottom: '8px' }}>No drops yet</div>
            <div style={{ color: 'rgba(255,255,255,0.15)', fontSize: '13px' }}>Be the first to drop something.</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {drops.map((drop: any) => {
              const author = drop.users
              const accent = themeColors[author?.theme_color] || '#FFE500'
              const isOwner = user?.id === author?.id
              const commentList = comments[drop.id] || []
              const isExpanded = expandedDrop === drop.id

              return (
                <div key={drop.id} style={{ background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '20px' }}>

                  {/* Author */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                    <a href={`/u/${author?.username}`} style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)', border: `1.5px solid ${accent}`, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                        {author?.profile_picture_url ? <img src={author.profile_picture_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" /> : <span style={{ color: accent, fontSize: '14px', fontWeight: '700' }}>{author?.username?.[0]?.toUpperCase()}</span>}
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <span style={{ color: '#fff', fontSize: '14px', fontWeight: '700' }}>@{author?.username}</span>
                          {author?.is_verified && (
                            <span style={{ background: accent, borderRadius: '50%', width: '14px', height: '14px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                              <svg width="7" height="7" viewBox="0 0 10 10" fill="none"><path d="M2 5l2 2 4-4" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            </span>
                          )}
                        </div>
                        <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px' }}>{timeAgo(drop.created_at)}</span>
                      </div>
                    </a>
                    {isOwner && (
                      <button onClick={() => handleDelete(drop.id)} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.2)', cursor: 'pointer', fontSize: '16px', padding: '4px' }}>×</button>
                    )}
                  </div>

                  {/* Caption */}
                  <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '15px', lineHeight: '1.7', margin: '0 0 12px' }}>{drop.caption}</p>

                  {/* Tags */}
                  {(drop.shoot_type || drop.gear_used || drop.location_tag) && (
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' as const, marginBottom: '16px' }}>
                      {drop.shoot_type && <span style={{ background: `${accent}12`, color: accent, fontSize: '11px', padding: '3px 10px', borderRadius: '20px', border: `0.5px solid ${accent}25`, fontWeight: '600' }}>{drop.shoot_type}</span>}
                      {drop.gear_used && <span style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)', fontSize: '11px', padding: '3px 10px', borderRadius: '20px' }}>📷 {drop.gear_used}</span>}
                      {drop.location_tag && <span style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)', fontSize: '11px', padding: '3px 10px', borderRadius: '20px' }}>📍 {drop.location_tag}</span>}
                    </div>
                  )}

                  {/* Reactions */}
                  <div style={{ display: 'flex', gap: '6px', marginBottom: '12px', flexWrap: 'wrap' as const }}>
                    {REACTIONS.map(r => {
                      const count = getReactionCount(drop, r.key)
                      const reacted = hasReacted(drop, r.key)
                      return (
                        <button key={r.key} onClick={() => handleReact(drop.id, r.key)} title={`${r.label} — ${r.desc}`}
                          style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 12px', borderRadius: '20px', border: `0.5px solid ${reacted ? accent : 'rgba(255,255,255,0.1)'}`, background: reacted ? `${accent}15` : 'transparent', cursor: 'pointer', fontFamily: 'var(--font-inter), sans-serif', transition: 'all 0.15s' }}>
                          <span style={{ fontSize: '14px' }}>{r.emoji}</span>
                          {count > 0 && <span style={{ color: reacted ? accent : 'rgba(255,255,255,0.4)', fontSize: '12px', fontWeight: '600' }}>{count}</span>}
                        </button>
                      )
                    })}
                    <button onClick={() => loadComments(drop.id)}
                      style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 12px', borderRadius: '20px', border: '0.5px solid rgba(255,255,255,0.1)', background: 'transparent', cursor: 'pointer', fontFamily: 'var(--font-inter), sans-serif', marginLeft: 'auto' }}>
                      <span style={{ fontSize: '14px' }}>💬</span>
                      {drop.drop_comments.length > 0 && <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px' }}>{drop.drop_comments.length}</span>}
                    </button>
                  </div>

                  {/* Comments */}
                  {isExpanded && (
                    <div style={{ borderTop: '0.5px solid rgba(255,255,255,0.06)', paddingTop: '16px' }}>
                      {commentList.length > 0 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
                          {commentList.map((c: any) => (
                            <div key={c.id} style={{ display: 'flex', gap: '10px' }}>
                              <a href={`/u/${c.users?.username}`} style={{ textDecoration: 'none' }}>
                                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)', border: `1px solid ${themeColors[c.users?.theme_color] || '#FFE500'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                                  {c.users?.profile_picture_url ? <img src={c.users.profile_picture_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" /> : <span style={{ color: themeColors[c.users?.theme_color] || '#FFE500', fontSize: '11px', fontWeight: '700' }}>{c.users?.username?.[0]?.toUpperCase()}</span>}
                                </div>
                              </a>
                              <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
                                  <span style={{ color: '#fff', fontSize: '12px', fontWeight: '700' }}>@{c.users?.username}</span>
                                  {c.is_collab_interest && <span style={{ background: 'rgba(255,229,0,0.1)', color: '#FFE500', fontSize: '10px', fontWeight: '600', padding: '2px 7px', borderRadius: '10px', border: '0.5px solid rgba(255,229,0,0.25)' }}>Collab interest</span>}
                                  <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '11px' }}>{timeAgo(c.created_at)}</span>
                                </div>
                                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', lineHeight: '1.5', margin: 0 }}>{c.content}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {user ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <input
                              placeholder="Leave a comment..."
                              value={commentInput[drop.id] || ''}
                              onChange={e => setCommentInput(prev => ({ ...prev, [drop.id]: e.target.value }))}
                              onKeyDown={e => e.key === 'Enter' && handleComment(drop.id)}
                              style={{ ...inputStyle, flex: 1, fontSize: '13px', padding: '10px 14px' }}
                            />
                            <button onClick={() => handleComment(drop.id)} disabled={submittingComment === drop.id || !commentInput[drop.id]?.trim()}
                              style={{ background: commentInput[drop.id]?.trim() ? '#FFE500' : 'rgba(255,255,255,0.06)', color: commentInput[drop.id]?.trim() ? '#000' : 'rgba(255,255,255,0.3)', fontSize: '13px', fontWeight: '700', padding: '10px 18px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-inter), sans-serif', flexShrink: 0 }}>
                              {submittingComment === drop.id ? '...' : 'Post'}
                            </button>
                          </div>
                          <button onClick={() => setCollabInterest(prev => ({ ...prev, [drop.id]: !prev[drop.id] }))}
                            style={{ alignSelf: 'flex-start', padding: '5px 12px', borderRadius: '20px', border: `0.5px solid ${collabInterest[drop.id] ? '#FFE500' : 'rgba(255,255,255,0.1)'}`, background: collabInterest[drop.id] ? 'rgba(255,229,0,0.1)' : 'transparent', color: collabInterest[drop.id] ? '#FFE500' : 'rgba(255,255,255,0.3)', fontSize: '11px', fontWeight: '600', cursor: 'pointer', fontFamily: 'var(--font-inter), sans-serif' }}>
                            {collabInterest[drop.id] ? '✓ ' : ''}Tag as collab interest
                          </button>
                        </div>
                      ) : (
                        <a href="/login" style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px', textDecoration: 'none' }}>Log in to comment →</a>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
