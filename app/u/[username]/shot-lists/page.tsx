'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'

export default function ShotListsPage() {
  const params = useParams()
  const username = params.username as string
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [lists, setLists] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editingTitle, setEditingTitle] = useState('')
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [selectedList, setSelectedList] = useState<any>(null)
  const dragItem = useRef<number | null>(null)
  const dragOverItem = useRef<number | null>(null)

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.json()).then(d => {
      if (!d.user || d.user.username !== username) {
        router.push(`/u/${username}`)
        return
      }
      setUser(d.user)
      fetch('/api/shot-lists').then(r => r.json()).then(data => {
        if (data.lists) setLists(data.lists.sort((a: any, b: any) => (a.position || 0) - (b.position || 0)))
        setLoading(false)
      })
    })
  }, [username])

  const handleRename = async (id: number) => {
    if (!editingTitle.trim()) return
    const res = await fetch('/api/shot-lists/rename', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, title: editingTitle.trim() })
    })
    if (res.ok) {
      setLists(prev => prev.map(l => l.id === id ? { ...l, title: editingTitle.trim() } : l))
    }
    setEditingId(null)
  }

  const handleDelete = async (id: number) => {
    const res = await fetch('/api/shot-lists', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    })
    if (res.ok) {
      setLists(prev => prev.filter(l => l.id !== id))
      if (selectedList?.id === id) setSelectedList(null)
    }
    setDeletingId(null)
  }

  const handleDragStart = (index: number) => {
    dragItem.current = index
  }

  const handleDragEnter = (index: number) => {
    dragOverItem.current = index
    if (dragItem.current === null || dragItem.current === index) return
    const newLists = [...lists]
    const dragged = newLists.splice(dragItem.current, 1)[0]
    newLists.splice(index, 0, dragged)
    dragItem.current = index
    setLists(newLists)
  }

  const handleDragEnd = async () => {
    const ids = lists.map(l => l.id)
    await fetch('/api/shot-lists/reorder', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids })
    })
    dragItem.current = null
    dragOverItem.current = null
  }

  if (loading) return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(to bottom, #0a0a0a, #111827)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-inter), sans-serif' }}>
      <div style={{ color: 'rgba(255,255,255,0.3)' }}>Loading...</div>
    </main>
  )

  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(to bottom, #0a0a0a, #111827)', fontFamily: 'var(--font-inter), sans-serif' }}>
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 40px', borderBottom: '0.5px solid rgba(255,255,255,0.08)', position: 'sticky', top: 0, background: 'rgba(10,10,10,0.85)', backdropFilter: 'blur(12px)', zIndex: 100 }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <svg width="26" height="14" viewBox="0 0 4191.67 2190.15" fill="none">
            <path d="M767.96,1876.06c348.4-78.57,799.8-147.81,1327.87-147.54,525.29,27,974.51,69.24,1321.72,147.54,59.43-520.49,118.85-1040.98,178.28-1561.48-295.08,235.66-590.16,471.31-885.25,706.97-204.92-226.68-409.84-453.35-614.75-680.03-206.97,234.87-413.93,469.75-620.9,704.62-293.03-234.87-586.07-469.75-879.1-704.62,57.38,511.51,114.75,1023.03,172.13,1534.54Z" fill="#FFE500"/>
          </svg>
          <span style={{ background: 'linear-gradient(90deg, #FFE500, #FFC200)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: '15px', fontWeight: '700', letterSpacing: '-0.02em' }}>Nodable.</span>
        </a>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <a href={`/u/${username}`} style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', textDecoration: 'none' }}>← Profile</a>
          <a href="/tools/shot-list" style={{ background: '#FFE500', color: '#000', fontSize: '12px', fontWeight: '700', padding: '8px 18px', borderRadius: '6px', textDecoration: 'none' }}>+ New list</a>
        </div>
      </nav>

      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '60px 24px', display: 'flex', gap: '32px' }}>

        {/* Left: list of shot lists */}
        <div style={{ width: '320px', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h1 style={{ color: '#fff', fontSize: '22px', fontWeight: '700', letterSpacing: '-0.02em', margin: 0 }}>Shot lists</h1>
            <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px' }}>{lists.length} saved</span>
          </div>

          {lists.length === 0 ? (
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '0.5px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '32px', textAlign: 'center' }}>
              <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '14px', marginBottom: '12px' }}>No saved shot lists yet</div>
              <a href="/tools/shot-list" style={{ color: '#FFE500', fontSize: '13px', fontWeight: '700', textDecoration: 'none' }}>Generate your first one →</a>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {lists.map((list, index) => (
                <div key={list.id}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragEnter={() => handleDragEnter(index)}
                  onDragEnd={handleDragEnd}
                  onDragOver={e => e.preventDefault()}
                  style={{ background: selectedList?.id === list.id ? 'rgba(255,229,0,0.06)' : 'rgba(255,255,255,0.03)', border: `0.5px solid ${selectedList?.id === list.id ? 'rgba(255,229,0,0.3)' : 'rgba(255,255,255,0.08)'}`, borderRadius: '12px', padding: '14px 16px', cursor: 'grab', userSelect: 'none' as const }}>

                  {editingId === list.id ? (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input
                        autoFocus
                        value={editingTitle}
                        onChange={e => setEditingTitle(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') handleRename(list.id); if (e.key === 'Escape') setEditingId(null) }}
                        style={{ flex: 1, background: 'rgba(255,255,255,0.08)', border: '0.5px solid rgba(255,255,255,0.2)', borderRadius: '6px', padding: '6px 10px', color: '#fff', fontSize: '13px', outline: 'none', fontFamily: 'var(--font-inter), sans-serif' }}
                      />
                      <button onClick={() => handleRename(list.id)} style={{ background: '#FFE500', color: '#000', border: 'none', borderRadius: '6px', padding: '6px 12px', fontSize: '12px', fontWeight: '700', cursor: 'pointer', fontFamily: 'var(--font-inter), sans-serif' }}>Save</button>
                    </div>
                  ) : (
                    <div onClick={() => setSelectedList(list)}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ color: '#fff', fontSize: '13px', fontWeight: '700', marginBottom: '4px', lineHeight: '1.4' }}>{list.title}</div>
                          <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px' }}>{list.media_type} · {list.event_type}</div>
                          <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: '11px', marginTop: '2px' }}>{new Date(list.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                        </div>
                        <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
                          <button onClick={e => { e.stopPropagation(); setEditingId(list.id); setEditingTitle(list.title) }}
                            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.3)', fontSize: '13px', padding: '4px', borderRadius: '4px' }} title="Rename">✏️</button>
                          <button onClick={e => { e.stopPropagation(); setDeletingId(list.id) }}
                            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'rgba(255,100,100,0.4)', fontSize: '13px', padding: '4px', borderRadius: '4px' }} title="Delete">🗑️</button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Delete confirm */}
                  {deletingId === list.id && (
                    <div style={{ marginTop: '10px', padding: '10px', background: 'rgba(255,50,50,0.08)', borderRadius: '8px', border: '0.5px solid rgba(255,50,50,0.2)' }}>
                      <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', marginBottom: '8px' }}>Delete this shot list?</div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => handleDelete(list.id)}
                          style={{ flex: 1, background: 'rgba(255,50,50,0.2)', border: '0.5px solid rgba(255,50,50,0.3)', color: 'rgba(255,100,100,0.9)', fontSize: '12px', fontWeight: '700', padding: '6px', borderRadius: '6px', cursor: 'pointer', fontFamily: 'var(--font-inter), sans-serif' }}>
                          Delete
                        </button>
                        <button onClick={() => setDeletingId(null)}
                          style={{ flex: 1, background: 'transparent', border: '0.5px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.4)', fontSize: '12px', padding: '6px', borderRadius: '6px', cursor: 'pointer', fontFamily: 'var(--font-inter), sans-serif' }}>
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: '11px', textAlign: 'center', marginTop: '8px' }}>Drag to reorder</div>
            </div>
          )}
        </div>

        {/* Right: selected shot list content */}
        <div style={{ flex: 1 }}>
          {!selectedList ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '400px', background: 'rgba(255,255,255,0.02)', border: '0.5px solid rgba(255,255,255,0.06)', borderRadius: '16px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: '14px' }}>Select a shot list to view it</div>
              </div>
            </div>
          ) : (
            <div>
              <div style={{ marginBottom: '32px' }}>
                <h2 style={{ color: '#fff', fontSize: '24px', fontWeight: '700', letterSpacing: '-0.02em', margin: '0 0 10px' }}>{selectedList.title}</h2>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' as const }}>
                  <span style={{ background: 'rgba(255,229,0,0.1)', color: '#FFE500', fontSize: '11px', fontWeight: '600', padding: '3px 10px', borderRadius: '20px', border: '0.5px solid rgba(255,229,0,0.25)', textTransform: 'capitalize' as const }}>{selectedList.media_type}</span>
                  <span style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)', fontSize: '11px', padding: '3px 10px', borderRadius: '20px' }}>{selectedList.event_type}</span>
                  {selectedList.duration && <span style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)', fontSize: '11px', padding: '3px 10px', borderRadius: '20px' }}>{selectedList.duration}</span>}
                  {selectedList.gear && <span style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)', fontSize: '11px', padding: '3px 10px', borderRadius: '20px' }}>{selectedList.gear}</span>}
                </div>
              </div>

              {selectedList.content?.categories?.map((cat: any, ci: number) => (
                <div key={ci} style={{ marginBottom: '32px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                    <div style={{ width: '24px', height: '24px', background: 'rgba(255,229,0,0.1)', border: '0.5px solid rgba(255,229,0,0.25)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ color: '#FFE500', fontSize: '11px', fontWeight: '700' }}>{ci + 1}</span>
                    </div>
                    <h3 style={{ color: '#fff', fontSize: '15px', fontWeight: '700', margin: 0 }}>{cat.name}</h3>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {cat.shots?.map((shot: any, si: number) => (
                      <div key={si} style={{ background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '6px' }}>
                          <div style={{ color: '#fff', fontSize: '13px', fontWeight: '700' }}>{shot.name}</div>
                          {shot.timing && <span style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)', fontSize: '10px', padding: '2px 8px', borderRadius: '20px', whiteSpace: 'nowrap' as const, flexShrink: 0 }}>{shot.timing}</span>}
                        </div>
                        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', lineHeight: '1.6', marginBottom: shot.tip ? '8px' : 0 }}>{shot.description}</div>
                        {shot.tip && (
                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                            <span style={{ color: '#FFE500', fontSize: '10px', marginTop: '1px', flexShrink: 0 }}>✦</span>
                            <div style={{ color: 'rgba(255,229,0,0.6)', fontSize: '11px', lineHeight: '1.5' }}>{shot.tip}</div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
