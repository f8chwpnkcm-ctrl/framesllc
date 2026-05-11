'use client'

import { useEffect, useState } from 'react'

export default function ShotListPage() {
  const [user, setUser] = useState<any>(null)
  const [step, setStep] = useState<'form' | 'generating' | 'result'>('form')
  const [savedLists, setSavedLists] = useState<any[]>([])
  const [currentList, setCurrentList] = useState<any>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({
    media_type: 'video',
    event_type: '',
    custom_event: '',
    details: '',
    gear: '',
    duration: '',
  })

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.json()).then(d => {
      setUser(d.user)
      if (d.user) {
        fetch('/api/shot-lists').then(r => r.json()).then(data => {
          if (data.lists) setSavedLists(data.lists)
        })
      }
    })
  }, [])

  const update = (key: string, value: string) => setForm(f => ({ ...f, [key]: value }))

  const eventTypes = ['Wedding', 'Sports', 'Concert', 'Corporate', 'Birthday', 'Graduation', 'Fashion', 'Real Estate', 'Documentary', 'Other']

  const handleGenerate = async () => {
    const eventLabel = form.event_type === 'Other' ? form.custom_event : form.event_type
    if (!eventLabel) return
    setStep('generating')

    const prompt = `You are a professional ${form.media_type === 'photo' ? 'photographer' : 'videographer'} creating a detailed shot list.

Event: ${eventLabel}
${form.details ? `Details: ${form.details}` : ''}
${form.gear ? `Gear: ${form.gear}` : ''}
${form.duration ? `Duration: ${form.duration}` : ''}

Create a comprehensive, professional shot list. Return ONLY a JSON object with this exact structure:
{
  "title": "Shot List title based on event",
  "categories": [
    {
      "name": "Category name (e.g. Opening & Establishing)",
      "shots": [
        {
          "name": "Shot name",
          "description": "What to capture and why",
          "tip": "Technical tip (angle, lens, settings)",
          "timing": "When to capture this"
        }
      ]
    }
  ]
}

Include 4-6 categories with 3-6 shots each. Make it specific to the event type and details provided. Return only valid JSON, no markdown, no explanation.`

    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 2000,
          messages: [{ role: 'user', content: prompt }]
        })
      })
      const data = await res.json()
      const text = data.content?.[0]?.text || ''
      const clean = text.replace(/```json|```/g, '').trim()
      const parsed = JSON.parse(clean)
      setCurrentList({ ...parsed, form })
      setStep('result')
      setSaved(false)
    } catch (e) {
      setStep('form')
      alert('Something went wrong. Try again.')
    }
  }

  const handleSave = async () => {
    if (!user || !currentList) return
    setSaving(true)
    const eventLabel = form.event_type === 'Other' ? form.custom_event : form.event_type
    const res = await fetch('/api/shot-lists', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: currentList.title,
        media_type: form.media_type,
        event_type: eventLabel,
        details: form.details,
        gear: form.gear,
        duration: form.duration,
        content: currentList,
      })
    })
    if (res.ok) {
      setSaved(true)
      const data = await res.json()
      setSavedLists(prev => [data.list, ...prev])
    }
    setSaving(false)
  }

  const inputStyle = {
    width: '100%', background: 'rgba(255,255,255,0.06)', border: '0.5px solid rgba(255,255,255,0.12)',
    borderRadius: '10px', padding: '14px 16px', fontSize: '14px', color: '#fff', outline: 'none',
    fontFamily: 'var(--font-inter), sans-serif', boxSizing: 'border-box' as const,
  }
  const labelStyle = {
    color: 'rgba(255,255,255,0.5)', fontSize: '12px', fontWeight: '600' as const,
    letterSpacing: '0.04em', textTransform: 'uppercase' as const, marginBottom: '8px', display: 'block',
  }

  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(to bottom, #0a0a0a, #111827)', fontFamily: 'var(--font-inter), sans-serif' }}>
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 40px', borderBottom: '0.5px solid rgba(255,255,255,0.08)', position: 'sticky', top: 0, background: 'rgba(10,10,10,0.85)', backdropFilter: 'blur(12px)', zIndex: 100 }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <svg width="26" height="14" viewBox="0 0 4191.67 2190.15" fill="none">
            <path d="M767.96,1876.06c348.4-78.57,799.8-147.81,1327.87-147.54,525.29,27,974.51,69.24,1321.72,147.54,59.43-520.49,118.85-1040.98,178.28-1561.48-295.08,235.66-590.16,471.31-885.25,706.97-204.92-226.68-409.84-453.35-614.75-680.03-206.97,234.87-413.93,469.75-620.9,704.62-293.03-234.87-586.07-469.75-879.1-704.62,57.38,511.51,114.75,1023.03,172.13,1534.54Z" fill="#FFE500"/>
          </svg>
          <span style={{ background: 'linear-gradient(90deg, #FFE500, #FFC200)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: '15px', fontWeight: '700', letterSpacing: '-0.02em' }}>Nodable.</span>
        </a>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <a href="/tools" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', textDecoration: 'none' }}>← Tools</a>
          {user ? (
            <a href={`/u/${user.username}`} style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', textDecoration: 'none' }}>@{user.username}</a>
          ) : (
            <a href="/login" style={{ background: '#FFE500', color: '#000', fontSize: '12px', fontWeight: '700', padding: '8px 18px', borderRadius: '6px', textDecoration: 'none' }}>Log in</a>
          )}
        </div>
      </nav>

      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '60px 24px' }}>
        <div style={{ marginBottom: '48px' }}>
          <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '12px' }}>Nodable Tools</div>
          <h1 style={{ color: '#fff', fontSize: '36px', fontWeight: '700', letterSpacing: '-0.03em', margin: '0 0 12px' }}>Shot List Generator</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '15px', lineHeight: '1.6', margin: 0 }}>Fill in your shoot details and get a professional shot list in seconds.</p>
        </div>

        {step === 'form' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            <div>
              <label style={labelStyle}>Media type</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {['photo', 'video'].map(t => (
                  <button key={t} onClick={() => update('media_type', t)}
                    style={{ padding: '10px 24px', borderRadius: '8px', border: `0.5px solid ${form.media_type === t ? '#FFE500' : 'rgba(255,255,255,0.12)'}`, background: form.media_type === t ? 'rgba(255,229,0,0.1)' : 'transparent', color: form.media_type === t ? '#FFE500' : 'rgba(255,255,255,0.5)', fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: 'var(--font-inter), sans-serif' }}>
                    {t === 'photo' ? '📷 Photo' : '🎥 Video'}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={labelStyle}>Event type</label>
              <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '8px' }}>
                {eventTypes.map(e => (
                  <button key={e} onClick={() => update('event_type', e)}
                    style={{ padding: '8px 16px', borderRadius: '8px', border: `0.5px solid ${form.event_type === e ? '#FFE500' : 'rgba(255,255,255,0.12)'}`, background: form.event_type === e ? 'rgba(255,229,0,0.1)' : 'transparent', color: form.event_type === e ? '#FFE500' : 'rgba(255,255,255,0.5)', fontSize: '13px', cursor: 'pointer', fontFamily: 'var(--font-inter), sans-serif' }}>
                    {e}
                  </button>
                ))}
              </div>
              {form.event_type === 'Other' && (
                <input style={{ ...inputStyle, marginTop: '12px' }} type="text" placeholder="Describe the event type..." value={form.custom_event} onChange={e => update('custom_event', e.target.value)} />
              )}
            </div>

            <div>
              <label style={labelStyle}>Specific details</label>
              <textarea style={{ ...inputStyle, resize: 'none', height: '100px' }}
                placeholder="e.g. Outdoor soccer game at sunset, need to capture goals, celebrations, team huddles."
                value={form.details} onChange={e => update('details', e.target.value)} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={labelStyle}>Gear</label>
                <input style={inputStyle} type="text" placeholder="Sony A7IV, 70-200mm" value={form.gear} onChange={e => update('gear', e.target.value)} />
              </div>
              <div>
                <label style={labelStyle}>Duration</label>
                <input style={inputStyle} type="text" placeholder="3 hours, full day" value={form.duration} onChange={e => update('duration', e.target.value)} />
              </div>
            </div>

            <button onClick={handleGenerate}
              disabled={!form.event_type || (form.event_type === 'Other' && !form.custom_event)}
              style={{ width: '100%', background: '#FFE500', color: '#000', fontSize: '15px', fontWeight: '700', padding: '16px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-inter), sans-serif', opacity: !form.event_type ? 0.5 : 1 }}>
              Generate shot list ✦
            </button>

            {user && savedLists.length > 0 && (
              <div style={{ marginTop: '40px', paddingTop: '40px', borderTop: '0.5px solid rgba(255,255,255,0.08)' }}>
                <h2 style={{ color: '#fff', fontSize: '18px', fontWeight: '700', margin: '0 0 20px' }}>Your saved shot lists</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {savedLists.map((list: any) => (
                    <div key={list.id} onClick={() => { setCurrentList(list.content); setForm({ media_type: list.media_type, event_type: list.event_type, custom_event: '', details: list.details || '', gear: list.gear || '', duration: list.duration || '' }); setStep('result'); setSaved(true) }}
                      style={{ background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                      <div>
                        <div style={{ color: '#fff', fontSize: '14px', fontWeight: '700', marginBottom: '4px' }}>{list.title}</div>
                        <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px' }}>{list.media_type} · {list.event_type} · {new Date(list.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                      </div>
                      <span style={{ color: 'rgba(255,255,255,0.2)' }}>→</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {step === 'generating' && (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ width: '48px', height: '48px', border: '3px solid rgba(255,229,0,0.2)', borderTop: '3px solid #FFE500', borderRadius: '50%', margin: '0 auto 24px', animation: 'spin 1s linear infinite' }} />
            <div style={{ color: '#fff', fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>Building your shot list...</div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>This takes a few seconds</div>
            <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
          </div>
        )}

        {step === 'result' && currentList && (
          <div>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '40px', gap: '16px', flexWrap: 'wrap' as const }}>
              <div>
                <h2 style={{ color: '#fff', fontSize: '26px', fontWeight: '700', letterSpacing: '-0.02em', margin: '0 0 8px' }}>{currentList.title}</h2>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' as const }}>
                  <span style={{ background: 'rgba(255,229,0,0.1)', color: '#FFE500', fontSize: '11px', fontWeight: '600', padding: '3px 10px', borderRadius: '20px', border: '0.5px solid rgba(255,229,0,0.25)', textTransform: 'capitalize' as const }}>{form.media_type}</span>
                  <span style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)', fontSize: '11px', padding: '3px 10px', borderRadius: '20px' }}>{form.event_type === 'Other' ? form.custom_event : form.event_type}</span>
                  {form.duration && <span style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)', fontSize: '11px', padding: '3px 10px', borderRadius: '20px' }}>{form.duration}</span>}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => { setStep('form'); setSaved(false) }}
                  style={{ padding: '10px 18px', borderRadius: '8px', border: '0.5px solid rgba(255,255,255,0.12)', background: 'transparent', color: 'rgba(255,255,255,0.5)', fontSize: '13px', cursor: 'pointer', fontFamily: 'var(--font-inter), sans-serif' }}>
                  New list
                </button>
                {user ? (
                  <button onClick={handleSave} disabled={saving || saved}
                    style={{ padding: '10px 18px', borderRadius: '8px', border: saved ? '0.5px solid rgba(34,197,94,0.3)' : 'none', background: saved ? 'rgba(34,197,94,0.15)' : '#FFE500', color: saved ? '#22C55E' : '#000', fontSize: '13px', fontWeight: '700', cursor: saved ? 'default' : 'pointer', fontFamily: 'var(--font-inter), sans-serif' }}>
                    {saving ? 'Saving...' : saved ? '✓ Saved' : 'Save to profile'}
                  </button>
                ) : (
                  <a href="/login" style={{ padding: '10px 18px', borderRadius: '8px', background: '#FFE500', color: '#000', fontSize: '13px', fontWeight: '700', textDecoration: 'none' }}>Log in to save</a>
                )}
              </div>
            </div>

            {currentList.categories?.map((cat: any, ci: number) => (
              <div key={ci} style={{ marginBottom: '40px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <div style={{ width: '28px', height: '28px', background: 'rgba(255,229,0,0.1)', border: '0.5px solid rgba(255,229,0,0.25)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ color: '#FFE500', fontSize: '12px', fontWeight: '700' }}>{ci + 1}</span>
                  </div>
                  <h3 style={{ color: '#fff', fontSize: '16px', fontWeight: '700', margin: 0 }}>{cat.name}</h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {cat.shots?.map((shot: any, si: number) => (
                    <div key={si} style={{ background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '20px' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', marginBottom: '8px' }}>
                        <div style={{ color: '#fff', fontSize: '14px', fontWeight: '700' }}>{shot.name}</div>
                        {shot.timing && <span style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)', fontSize: '11px', padding: '3px 10px', borderRadius: '20px', whiteSpace: 'nowrap' as const, flexShrink: 0 }}>{shot.timing}</span>}
                      </div>
                      <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: '13px', lineHeight: '1.6', marginBottom: shot.tip ? '10px' : 0 }}>{shot.description}</div>
                      {shot.tip && (
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                          <span style={{ color: '#FFE500', fontSize: '11px', marginTop: '1px' }}>✦</span>
                          <div style={{ color: 'rgba(255,229,0,0.7)', fontSize: '12px', lineHeight: '1.5' }}>{shot.tip}</div>
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
    </main>
  )
}
