'use client'

import { useEffect, useState } from 'react'

const STEPS = ['media', 'event', 'details', 'gear', 'duration']

export default function ShotListPage() {
  const [user, setUser] = useState<any>(null)
  const [stepIndex, setStepIndex] = useState(0)
  const [mode, setMode] = useState<'form' | 'generating' | 'result'>('form')
  const [savedLists, setSavedLists] = useState<any[]>([])
  const [currentList, setCurrentList] = useState<any>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({
    media_type: '',
    event_type: '',
    custom_event: '',
    details: '',
    camera_body: '',
    lenses: '',
    other_gear: '',
    duration: '',
    custom_duration: '',
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

  const eventTypes = [
    { label: 'Wedding', emoji: '💍' },
    { label: 'Sports', emoji: '⚽' },
    { label: 'Concert', emoji: '🎸' },
    { label: 'Corporate', emoji: '💼' },
    { label: 'Birthday', emoji: '🎂' },
    { label: 'Graduation', emoji: '🎓' },
    { label: 'Fashion', emoji: '👗' },
    { label: 'Real Estate', emoji: '🏠' },
    { label: 'Documentary', emoji: '🎬' },
    { label: 'Other', emoji: '✦' },
  ]

  const durations = ['Under 1 hour', '1–2 hours', '2–4 hours', 'Half day', 'Full day', 'Multi-day']

  const canAdvance = () => {
    const step = STEPS[stepIndex]
    if (step === 'media') return !!form.media_type
    if (step === 'event') return !!form.event_type && (form.event_type !== 'Other' || !!form.custom_event)
    if (step === 'details') return true
    if (step === 'gear') return true
    if (step === 'duration') return !!form.duration && (form.duration !== 'custom' || !!form.custom_duration)
    return true
  }

  const handleGenerate = async () => {
    setMode('generating')
    const eventLabel = form.event_type === 'Other' ? form.custom_event : form.event_type
    const gearParts = [form.camera_body, form.lenses, form.other_gear].filter(Boolean)
    const gearStr = gearParts.join(', ')
    const durationStr = form.duration === 'custom' ? form.custom_duration : form.duration

    const prompt = `You are a professional ${form.media_type === 'photo' ? 'photographer' : 'videographer'} creating a detailed shot list.

Event: ${eventLabel}
${form.details ? `Details: ${form.details}` : ''}
${gearStr ? `Gear: ${gearStr}` : ''}
${durationStr ? `Duration: ${durationStr}` : ''}

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
      setMode('result')
      setSaved(false)
    } catch {
      setMode('form')
      alert('Something went wrong. Try again.')
    }
  }

  const handleSave = async () => {
    if (!user || !currentList) return
    setSaving(true)
    const eventLabel = form.event_type === 'Other' ? form.custom_event : form.event_type
    const durationStr = form.duration === 'custom' ? form.custom_duration : form.duration
    const gearParts = [form.camera_body, form.lenses, form.other_gear].filter(Boolean)
    const res = await fetch('/api/shot-lists', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: currentList.title,
        media_type: form.media_type,
        event_type: eventLabel,
        details: form.details,
        gear: gearParts.join(', '),
        duration: durationStr,
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
    borderRadius: '10px', padding: '14px 16px', fontSize: '15px', color: '#fff', outline: 'none',
    fontFamily: 'var(--font-inter), sans-serif', boxSizing: 'border-box' as const,
  }

  const progress = ((stepIndex) / STEPS.length) * 100

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

      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '60px 24px' }}>

        {mode === 'form' && (
          <>
            {/* Progress bar */}
            <div style={{ marginBottom: '48px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px' }}>Step {stepIndex + 1} of {STEPS.length}</span>
                <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px' }}>{Math.round(progress)}%</span>
              </div>
              <div style={{ height: '3px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px' }}>
                <div style={{ height: '100%', background: 'linear-gradient(90deg, #FFE500, #FFC200)', borderRadius: '2px', width: `${progress}%`, transition: 'width 0.3s ease' }} />
              </div>
            </div>

            {/* Step: media type */}
            {STEPS[stepIndex] === 'media' && (
              <div>
                <h2 style={{ color: '#fff', fontSize: '28px', fontWeight: '700', letterSpacing: '-0.02em', margin: '0 0 8px' }}>Are you shooting photo or video?</h2>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '15px', margin: '0 0 40px' }}>This helps tailor your shot list to the right format.</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {[{ value: 'photo', emoji: '📷', label: 'Photo', desc: 'Stills, portraits, editorial' }, { value: 'video', emoji: '🎥', label: 'Video', desc: 'Films, reels, coverage' }].map(opt => (
                    <button key={opt.value} onClick={() => update('media_type', opt.value)}
                      style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px 24px', borderRadius: '12px', border: `1.5px solid ${form.media_type === opt.value ? '#FFE500' : 'rgba(255,255,255,0.08)'}`, background: form.media_type === opt.value ? 'rgba(255,229,0,0.06)' : 'rgba(255,255,255,0.02)', cursor: 'pointer', fontFamily: 'var(--font-inter), sans-serif', textAlign: 'left' as const, width: '100%' }}>
                      <span style={{ fontSize: '28px' }}>{opt.emoji}</span>
                      <div>
                        <div style={{ color: form.media_type === opt.value ? '#FFE500' : '#fff', fontSize: '16px', fontWeight: '700' }}>{opt.label}</div>
                        <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '13px' }}>{opt.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step: event type */}
            {STEPS[stepIndex] === 'event' && (
              <div>
                <h2 style={{ color: '#fff', fontSize: '28px', fontWeight: '700', letterSpacing: '-0.02em', margin: '0 0 8px' }}>What kind of event is it?</h2>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '15px', margin: '0 0 40px' }}>Pick the one that best describes your shoot.</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  {eventTypes.map(e => (
                    <button key={e.label} onClick={() => update('event_type', e.label)}
                      style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 20px', borderRadius: '12px', border: `1.5px solid ${form.event_type === e.label ? '#FFE500' : 'rgba(255,255,255,0.08)'}`, background: form.event_type === e.label ? 'rgba(255,229,0,0.06)' : 'rgba(255,255,255,0.02)', cursor: 'pointer', fontFamily: 'var(--font-inter), sans-serif', textAlign: 'left' as const }}>
                      <span style={{ fontSize: '22px' }}>{e.emoji}</span>
                      <span style={{ color: form.event_type === e.label ? '#FFE500' : 'rgba(255,255,255,0.7)', fontSize: '14px', fontWeight: '600' }}>{e.label}</span>
                    </button>
                  ))}
                </div>
                {form.event_type === 'Other' && (
                  <input style={{ ...inputStyle, marginTop: '16px' }} type="text" placeholder="What kind of shoot is it?" value={form.custom_event} onChange={e => update('custom_event', e.target.value)} autoFocus />
                )}
              </div>
            )}

            {/* Step: details */}
            {STEPS[stepIndex] === 'details' && (
              <div>
                <h2 style={{ color: '#fff', fontSize: '28px', fontWeight: '700', letterSpacing: '-0.02em', margin: '0 0 8px' }}>Tell us about the shoot.</h2>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '15px', margin: '0 0 40px' }}>Include things like time of day, venue, weather, key moments, or anything specific you want captured.</p>
                <textarea style={{ ...inputStyle, resize: 'none', height: '160px', lineHeight: '1.6' }}
                  placeholder={`e.g. Outdoor soccer game at golden hour. Home team in yellow jerseys. Need to capture goals, saves, celebrations, and team huddles. Sideline access only.`}
                  value={form.details} onChange={e => update('details', e.target.value)} autoFocus />
                <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: '12px', marginTop: '8px' }}>Optional but the more detail, the better your shot list.</div>
              </div>
            )}

            {/* Step: gear */}
            {STEPS[stepIndex] === 'gear' && (
              <div>
                <h2 style={{ color: '#fff', fontSize: '28px', fontWeight: '700', letterSpacing: '-0.02em', margin: '0 0 8px' }}>What gear are you bringing?</h2>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '15px', margin: '0 0 40px' }}>This helps tailor lens recommendations and shot techniques to your setup.</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div>
                    <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', fontWeight: '600', letterSpacing: '0.04em', textTransform: 'uppercase' as const, marginBottom: '8px', display: 'block' }}>Camera body</label>
                    <input style={inputStyle} type="text" placeholder="e.g. Sony A7IV, Canon R5" value={form.camera_body} onChange={e => update('camera_body', e.target.value)} />
                  </div>
                  <div>
                    <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', fontWeight: '600', letterSpacing: '0.04em', textTransform: 'uppercase' as const, marginBottom: '8px', display: 'block' }}>Lenses</label>
                    <input style={inputStyle} type="text" placeholder="e.g. 24mm f/1.4, 70-200mm f/2.8" value={form.lenses} onChange={e => update('lenses', e.target.value)} />
                  </div>
                  <div>
                    <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', fontWeight: '600', letterSpacing: '0.04em', textTransform: 'uppercase' as const, marginBottom: '8px', display: 'block' }}>Other gear</label>
                    <input style={inputStyle} type="text" placeholder="e.g. Gimbal, drone, flash, ND filters" value={form.other_gear} onChange={e => update('other_gear', e.target.value)} />
                  </div>
                </div>
                <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: '12px', marginTop: '12px' }}>All optional — skip if you're not sure yet.</div>
              </div>
            )}

            {/* Step: duration */}
            {STEPS[stepIndex] === 'duration' && (
              <div>
                <h2 style={{ color: '#fff', fontSize: '28px', fontWeight: '700', letterSpacing: '-0.02em', margin: '0 0 8px' }}>How long is the shoot?</h2>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '15px', margin: '0 0 40px' }}>This helps pace your shot list and prioritize what matters most.</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                  {durations.map(d => (
                    <button key={d} onClick={() => update('duration', d)}
                      style={{ padding: '16px 20px', borderRadius: '12px', border: `1.5px solid ${form.duration === d ? '#FFE500' : 'rgba(255,255,255,0.08)'}`, background: form.duration === d ? 'rgba(255,229,0,0.06)' : 'rgba(255,255,255,0.02)', color: form.duration === d ? '#FFE500' : 'rgba(255,255,255,0.7)', fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: 'var(--font-inter), sans-serif' }}>
                      {d}
                    </button>
                  ))}
                  <button onClick={() => update('duration', 'custom')}
                    style={{ padding: '16px 20px', borderRadius: '12px', border: `1.5px solid ${form.duration === 'custom' ? '#FFE500' : 'rgba(255,255,255,0.08)'}`, background: form.duration === 'custom' ? 'rgba(255,229,0,0.06)' : 'rgba(255,255,255,0.02)', color: form.duration === 'custom' ? '#FFE500' : 'rgba(255,255,255,0.7)', fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: 'var(--font-inter), sans-serif' }}>
                    Custom
                  </button>
                </div>
                {form.duration === 'custom' && (
                  <input style={inputStyle} type="text" placeholder="e.g. 5 hours, 3 days" value={form.custom_duration} onChange={e => update('custom_duration', e.target.value)} autoFocus />
                )}
              </div>
            )}

            {/* Navigation buttons */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '40px' }}>
              {stepIndex > 0 && (
                <button onClick={() => setStepIndex(i => i - 1)}
                  style={{ padding: '14px 24px', borderRadius: '10px', border: '0.5px solid rgba(255,255,255,0.12)', background: 'transparent', color: 'rgba(255,255,255,0.5)', fontSize: '14px', cursor: 'pointer', fontFamily: 'var(--font-inter), sans-serif' }}>
                  ← Back
                </button>
              )}
              {stepIndex < STEPS.length - 1 ? (
                <button onClick={() => setStepIndex(i => i + 1)} disabled={!canAdvance()}
                  style={{ flex: 1, padding: '14px', borderRadius: '10px', border: 'none', background: canAdvance() ? '#FFE500' : 'rgba(255,255,255,0.08)', color: canAdvance() ? '#000' : 'rgba(255,255,255,0.3)', fontSize: '15px', fontWeight: '700', cursor: canAdvance() ? 'pointer' : 'default', fontFamily: 'var(--font-inter), sans-serif' }}>
                  Continue →
                </button>
              ) : (
                <button onClick={handleGenerate} disabled={!canAdvance()}
                  style={{ flex: 1, padding: '14px', borderRadius: '10px', border: 'none', background: canAdvance() ? '#FFE500' : 'rgba(255,255,255,0.08)', color: canAdvance() ? '#000' : 'rgba(255,255,255,0.3)', fontSize: '15px', fontWeight: '700', cursor: canAdvance() ? 'pointer' : 'default', fontFamily: 'var(--font-inter), sans-serif' }}>
                  Generate shot list ✦
                </button>
              )}
            </div>

            {/* Saved lists */}
            {user && savedLists.length > 0 && stepIndex === 0 && (
              <div style={{ marginTop: '64px', paddingTop: '48px', borderTop: '0.5px solid rgba(255,255,255,0.08)' }}>
                <h2 style={{ color: '#fff', fontSize: '18px', fontWeight: '700', margin: '0 0 20px' }}>Your saved shot lists</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {savedLists.map((list: any) => (
                    <div key={list.id} onClick={() => { setCurrentList(list.content); setForm(f => ({ ...f, media_type: list.media_type, event_type: list.event_type, details: list.details || '', duration: list.duration || '' })); setMode('result'); setSaved(true) }}
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
          </>
        )}

        {mode === 'generating' && (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ width: '48px', height: '48px', border: '3px solid rgba(255,229,0,0.2)', borderTop: '3px solid #FFE500', borderRadius: '50%', margin: '0 auto 24px', animation: 'spin 1s linear infinite' }} />
            <div style={{ color: '#fff', fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}>Building your shot list...</div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>This takes a few seconds</div>
            <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
          </div>
        )}

        {mode === 'result' && currentList && (
          <div>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '40px', gap: '16px', flexWrap: 'wrap' as const }}>
              <div>
                <h2 style={{ color: '#fff', fontSize: '26px', fontWeight: '700', letterSpacing: '-0.02em', margin: '0 0 10px' }}>{currentList.title}</h2>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' as const }}>
                  <span style={{ background: 'rgba(255,229,0,0.1)', color: '#FFE500', fontSize: '11px', fontWeight: '600', padding: '3px 10px', borderRadius: '20px', border: '0.5px solid rgba(255,229,0,0.25)', textTransform: 'capitalize' as const }}>{form.media_type}</span>
                  <span style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)', fontSize: '11px', padding: '3px 10px', borderRadius: '20px' }}>{form.event_type === 'Other' ? form.custom_event : form.event_type}</span>
                  {form.duration && form.duration !== 'custom' && <span style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)', fontSize: '11px', padding: '3px 10px', borderRadius: '20px' }}>{form.duration}</span>}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' as const }}>
                <button onClick={() => { setMode('form'); setStepIndex(0); setSaved(false) }}
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
                  <div style={{ width: '28px', height: '28px', background: 'rgba(255,229,0,0.1)', border: '0.5px solid rgba(255,229,0,0.25)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
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
                          <span style={{ color: '#FFE500', fontSize: '11px', marginTop: '1px', flexShrink: 0 }}>✦</span>
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
