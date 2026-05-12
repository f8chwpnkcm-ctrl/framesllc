'use client'

import { useEffect, useState } from 'react'
import { useRequireAuth } from '../../hooks/useRequireAuth'

const STEPS = ['vibe', 'shoot', 'details', 'reference']

export default function MoodBoardPage() {
  const { user, loading: authLoading } = useRequireAuth()
  const [stepIndex, setStepIndex] = useState(0)
  const [mode, setMode] = useState<'form' | 'generating' | 'result'>('form')
  const [savedBoards, setSavedBoards] = useState<any[]>([])
  const [board, setBoard] = useState<any>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({
    vibe: '', media_type: '', shoot_type: '', time_of_day: '', location_type: '', reference: '',
  })

  useEffect(() => {
    if (user) {
      fetch('/api/mood-boards').then(r => r.json()).then(data => {
        if (data.boards) setSavedBoards(data.boards)
      })
    }
  }, [user])

  const update = (key: string, value: string) => setForm(f => ({ ...f, [key]: value }))
  const canAdvance = () => STEPS[stepIndex] === 'vibe' ? form.vibe.length >= 3 : true

  const handleGenerate = async () => {
    setMode('generating')
    try {
      const res = await fetch('/api/generate-mood-board', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      const data = await res.json()
      if (!data.result) throw new Error('No result')
      setBoard(data.result)
      setMode('result')
      setSaved(false)
    } catch {
      setMode('form')
      alert('Something went wrong. Try again.')
    }
  }

  const handleSave = async () => {
    if (!user || !board) return
    setSaving(true)
    const res = await fetch('/api/mood-boards', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: board.title, vibe: form.vibe, content: board }) })
    if (res.ok) { setSaved(true); const data = await res.json(); setSavedBoards(prev => [data.board, ...prev]) }
    setSaving(false)
  }

  const inputStyle = { width: '100%', background: 'rgba(255,255,255,0.06)', border: '0.5px solid rgba(255,255,255,0.12)', borderRadius: '10px', padding: '14px 16px', fontSize: '15px', color: '#fff', outline: 'none', fontFamily: 'var(--font-inter), sans-serif', boxSizing: 'border-box' as const }
  const progress = (stepIndex / STEPS.length) * 100
  const shootTypes = [{ label: 'Wedding', emoji: '💍' }, { label: 'Sports', emoji: '⚽' }, { label: 'Concert', emoji: '🎸' }, { label: 'Portrait', emoji: '🎭' }, { label: 'Editorial', emoji: '📰' }, { label: 'Documentary', emoji: '🎬' }, { label: 'Real Estate', emoji: '🏠' }, { label: 'Fashion', emoji: '👗' }, { label: 'Street', emoji: '🌆' }, { label: 'Nature', emoji: '🌿' }]
  const timeOptions = ['Golden hour', 'Blue hour', 'Midday', 'Overcast', 'Night', 'Indoor']
  const locationOptions = ['Outdoor natural', 'Urban/city', 'Indoor studio', 'Indoor venue', 'Beach/water', 'Forest/nature', 'Rooftop', 'Warehouse']

  if (authLoading) return (
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <a href="/tools" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', textDecoration: 'none' }}>← Tools</a>
          {user && <a href={`/u/${user.username}`} style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', textDecoration: 'none' }}>@{user.username}</a>}
        </div>
      </nav>

      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '60px 24px' }}>
        {mode === 'form' && (
          <>
            <div style={{ marginBottom: '48px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px' }}>Step {stepIndex + 1} of {STEPS.length}</span>
                <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px' }}>{Math.round(progress)}%</span>
              </div>
              <div style={{ height: '3px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px' }}>
                <div style={{ height: '100%', background: 'linear-gradient(90deg, #FFE500, #FFC200)', borderRadius: '2px', width: `${progress}%`, transition: 'width 0.3s ease' }} />
              </div>
            </div>

            {STEPS[stepIndex] === 'vibe' && (
              <div>
                <h2 style={{ color: '#fff', fontSize: '28px', fontWeight: '700', letterSpacing: '-0.02em', margin: '0 0 8px' }}>Describe the vibe.</h2>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '15px', margin: '0 0 40px' }}>Don't overthink it. Write how it feels, not what it is.</p>
                <textarea style={{ ...inputStyle, resize: 'none', height: '140px', lineHeight: '1.7', fontSize: '16px' }}
                  placeholder="e.g. Golden hour on a rooftop, feels like the last summer night before everything changes. Warm, a little melancholy, cinematic."
                  value={form.vibe} onChange={e => update('vibe', e.target.value)} autoFocus />
                <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: '12px', marginTop: '8px' }}>The more feeling you put in, the better the output.</div>
              </div>
            )}

            {STEPS[stepIndex] === 'shoot' && (
              <div>
                <h2 style={{ color: '#fff', fontSize: '28px', fontWeight: '700', letterSpacing: '-0.02em', margin: '0 0 8px' }}>What are you shooting?</h2>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '15px', margin: '0 0 40px' }}>Pick what fits best.</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {['Photo', 'Video', 'Both'].map(t => (
                      <button key={t} onClick={() => update('media_type', t.toLowerCase())}
                        style={{ flex: 1, padding: '12px', borderRadius: '10px', border: `1.5px solid ${form.media_type === t.toLowerCase() ? '#FFE500' : 'rgba(255,255,255,0.08)'}`, background: form.media_type === t.toLowerCase() ? 'rgba(255,229,0,0.06)' : 'rgba(255,255,255,0.02)', color: form.media_type === t.toLowerCase() ? '#FFE500' : 'rgba(255,255,255,0.5)', fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: 'var(--font-inter), sans-serif' }}>
                        {t}
                      </button>
                    ))}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    {shootTypes.map(s => (
                      <button key={s.label} onClick={() => update('shoot_type', s.label.toLowerCase())}
                        style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', borderRadius: '10px', border: `1.5px solid ${form.shoot_type === s.label.toLowerCase() ? '#FFE500' : 'rgba(255,255,255,0.08)'}`, background: form.shoot_type === s.label.toLowerCase() ? 'rgba(255,229,0,0.06)' : 'rgba(255,255,255,0.02)', cursor: 'pointer', fontFamily: 'var(--font-inter), sans-serif', textAlign: 'left' as const }}>
                        <span style={{ fontSize: '18px' }}>{s.emoji}</span>
                        <span style={{ color: form.shoot_type === s.label.toLowerCase() ? '#FFE500' : 'rgba(255,255,255,0.6)', fontSize: '13px', fontWeight: '600' }}>{s.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {STEPS[stepIndex] === 'details' && (
              <div>
                <h2 style={{ color: '#fff', fontSize: '28px', fontWeight: '700', letterSpacing: '-0.02em', margin: '0 0 8px' }}>Set the scene.</h2>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '15px', margin: '0 0 40px' }}>Time of day and location help nail the lighting and color palette.</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div>
                    <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', fontWeight: '600', letterSpacing: '0.04em', textTransform: 'uppercase' as const, marginBottom: '10px', display: 'block' }}>Time of day</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '8px' }}>
                      {timeOptions.map(t => (
                        <button key={t} onClick={() => update('time_of_day', t.toLowerCase())}
                          style={{ padding: '8px 16px', borderRadius: '8px', border: `0.5px solid ${form.time_of_day === t.toLowerCase() ? '#FFE500' : 'rgba(255,255,255,0.08)'}`, background: form.time_of_day === t.toLowerCase() ? 'rgba(255,229,0,0.06)' : 'rgba(255,255,255,0.02)', color: form.time_of_day === t.toLowerCase() ? '#FFE500' : 'rgba(255,255,255,0.5)', fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: 'var(--font-inter), sans-serif' }}>
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', fontWeight: '600', letterSpacing: '0.04em', textTransform: 'uppercase' as const, marginBottom: '10px', display: 'block' }}>Location type</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '8px' }}>
                      {locationOptions.map(l => (
                        <button key={l} onClick={() => update('location_type', l.toLowerCase())}
                          style={{ padding: '8px 16px', borderRadius: '8px', border: `0.5px solid ${form.location_type === l.toLowerCase() ? '#FFE500' : 'rgba(255,255,255,0.08)'}`, background: form.location_type === l.toLowerCase() ? 'rgba(255,229,0,0.06)' : 'rgba(255,255,255,0.02)', color: form.location_type === l.toLowerCase() ? '#FFE500' : 'rgba(255,255,255,0.5)', fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: 'var(--font-inter), sans-serif' }}>
                          {l}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {STEPS[stepIndex] === 'reference' && (
              <div>
                <h2 style={{ color: '#fff', fontSize: '28px', fontWeight: '700', letterSpacing: '-0.02em', margin: '0 0 8px' }}>Any references?</h2>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '15px', margin: '0 0 40px' }}>Directors, films, photographers, albums — anything that captures the energy you're going for.</p>
                <textarea style={{ ...inputStyle, resize: 'none', height: '120px', lineHeight: '1.7' }}
                  placeholder="e.g. Roger Deakins lighting, Lana Del Rey Ultraviolence era, Christopher Doyle color grading, early 2000s film grain"
                  value={form.reference} onChange={e => update('reference', e.target.value)} />
                <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: '12px', marginTop: '8px' }}>Optional but makes the output much richer.</div>
              </div>
            )}

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
                <button onClick={handleGenerate}
                  style={{ flex: 1, padding: '14px', borderRadius: '10px', border: 'none', background: '#FFE500', color: '#000', fontSize: '15px', fontWeight: '700', cursor: 'pointer', fontFamily: 'var(--font-inter), sans-serif' }}>
                  Generate mood board ✦
                </button>
              )}
            </div>

            {savedBoards.length > 0 && stepIndex === 0 && (
              <div style={{ marginTop: '64px', paddingTop: '48px', borderTop: '0.5px solid rgba(255,255,255,0.08)' }}>
                <h2 style={{ color: '#fff', fontSize: '18px', fontWeight: '700', margin: '0 0 20px' }}>Your saved mood boards</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {savedBoards.map((b: any) => (
                    <div key={b.id} onClick={() => { setBoard(b.content); setMode('result'); setSaved(true) }}
                      style={{ background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                      <div>
                        <div style={{ color: '#fff', fontSize: '14px', fontWeight: '700', marginBottom: '4px' }}>{b.title}</div>
                        <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px' }}>{b.vibe.slice(0, 60)}...</div>
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
            <div style={{ color: '#fff', fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}>Building your mood board...</div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>Translating your vibe into a creative brief</div>
            <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
          </div>
        )}

        {mode === 'result' && board && (
          <div>
            <div style={{ marginBottom: '40px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' as const, marginBottom: '16px' }}>
                <div>
                  <h2 style={{ color: '#fff', fontSize: '28px', fontWeight: '700', letterSpacing: '-0.02em', margin: '0 0 8px' }}>{board.title}</h2>
                  <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '15px', fontStyle: 'italic', margin: 0 }}>{board.tagline}</p>
                </div>
                <div style={{ display: 'flex', gap: '10px', flexShrink: 0 }}>
                  <button onClick={() => { setMode('form'); setStepIndex(0); setSaved(false) }}
                    style={{ padding: '10px 18px', borderRadius: '8px', border: '0.5px solid rgba(255,255,255,0.12)', background: 'transparent', color: 'rgba(255,255,255,0.5)', fontSize: '13px', cursor: 'pointer', fontFamily: 'var(--font-inter), sans-serif' }}>
                    New board
                  </button>
                  <button onClick={handleSave} disabled={saving || saved}
                    style={{ padding: '10px 18px', borderRadius: '8px', border: saved ? '0.5px solid rgba(34,197,94,0.3)' : 'none', background: saved ? 'rgba(34,197,94,0.15)' : '#FFE500', color: saved ? '#22C55E' : '#000', fontSize: '13px', fontWeight: '700', cursor: saved ? 'default' : 'pointer', fontFamily: 'var(--font-inter), sans-serif' }}>
                    {saving ? 'Saving...' : saved ? '✓ Saved' : 'Save to profile'}
                  </button>
                </div>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '8px' }}>
                {board.keywords?.map((k: string, i: number) => (
                  <span key={i} style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)', fontSize: '12px', padding: '4px 12px', borderRadius: '20px', border: '0.5px solid rgba(255,255,255,0.08)' }}>{k}</span>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '32px' }}>
              <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase' as const, marginBottom: '16px' }}>Color palette</div>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                {board.color_palette?.map((c: any, i: number) => (
                  <div key={i} style={{ flex: 1, aspectRatio: '1', borderRadius: '12px', background: c.hex, minHeight: '60px' }} title={`${c.name} — ${c.hex}`} />
                ))}
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                {board.color_palette?.map((c: any, i: number) => (
                  <div key={i} style={{ flex: 1, textAlign: 'center' }}>
                    <div style={{ color: '#fff', fontSize: '11px', fontWeight: '600', marginBottom: '2px' }}>{c.name}</div>
                    <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '10px', fontFamily: 'monospace' }}>{c.hex}</div>
                    <div style={{ color: 'rgba(255,255,255,0.25)', fontSize: '10px', marginTop: '2px', lineHeight: '1.4' }}>{c.role}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '24px' }}>
                <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase' as const, marginBottom: '14px' }}>Lighting</div>
                <div style={{ color: '#fff', fontSize: '15px', fontWeight: '700', marginBottom: '8px' }}>{board.lighting?.style}</div>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', lineHeight: '1.6', marginBottom: '12px' }}>{board.lighting?.description}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}><span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px', width: '64px', flexShrink: 0 }}>Direction</span><span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px' }}>{board.lighting?.direction}</span></div>
                  <div style={{ display: 'flex', gap: '8px' }}><span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px', width: '64px', flexShrink: 0 }}>Quality</span><span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px' }}>{board.lighting?.quality}</span></div>
                </div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '24px' }}>
                <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase' as const, marginBottom: '14px' }}>Camera settings</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {[{ label: 'Aperture', value: board.camera_settings?.aperture }, { label: 'Shutter', value: board.camera_settings?.shutter_speed }, { label: 'ISO', value: board.camera_settings?.iso }, { label: 'Focal length', value: board.camera_settings?.focal_length }].map((s, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '8px', borderBottom: i < 3 ? '0.5px solid rgba(255,255,255,0.06)' : 'none' }}>
                      <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px' }}>{s.label}</span>
                      <span style={{ color: '#fff', fontSize: '13px', fontWeight: '600', fontFamily: 'monospace' }}>{s.value}</span>
                    </div>
                  ))}
                </div>
                {board.camera_settings?.notes && <div style={{ color: 'rgba(255,229,0,0.6)', fontSize: '11px', marginTop: '10px', lineHeight: '1.5' }}>✦ {board.camera_settings.notes}</div>}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '24px' }}>
                <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase' as const, marginBottom: '14px' }}>LUT / Color grade</div>
                <div style={{ color: '#fff', fontSize: '15px', fontWeight: '700', marginBottom: '8px' }}>{board.lut_style?.name}</div>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', lineHeight: '1.6', marginBottom: '12px' }}>{board.lut_style?.description}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '6px' }}>
                  {board.lut_style?.keywords?.map((k: string, i: number) => (
                    <span key={i} style={{ background: 'rgba(255,229,0,0.08)', color: 'rgba(255,229,0,0.7)', fontSize: '11px', padding: '3px 8px', borderRadius: '4px' }}>{k}</span>
                  ))}
                </div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '24px' }}>
                <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase' as const, marginBottom: '14px' }}>Composition</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {[{ label: 'Framing', value: board.composition?.framing }, { label: 'Movement', value: board.composition?.movement }, { label: 'Depth', value: board.composition?.depth }].map((s, i) => (
                    <div key={i}>
                      <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px', marginBottom: '3px' }}>{s.label}</div>
                      <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', lineHeight: '1.5' }}>{s.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ background: 'rgba(34,197,94,0.04)', border: '0.5px solid rgba(34,197,94,0.15)', borderRadius: '14px', padding: '24px' }}>
                <div style={{ color: 'rgba(34,197,94,0.7)', fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase' as const, marginBottom: '14px', fontWeight: '700' }}>Do</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {board.do?.map((tip: string, i: number) => (
                    <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                      <span style={{ color: 'rgba(34,197,94,0.6)', fontSize: '12px', marginTop: '1px', flexShrink: 0 }}>✓</span>
                      <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', lineHeight: '1.5' }}>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ background: 'rgba(255,50,50,0.04)', border: '0.5px solid rgba(255,50,50,0.12)', borderRadius: '14px', padding: '24px' }}>
                <div style={{ color: 'rgba(255,100,100,0.7)', fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase' as const, marginBottom: '14px', fontWeight: '700' }}>Don't</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {board.dont?.map((tip: string, i: number) => (
                    <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                      <span style={{ color: 'rgba(255,100,100,0.6)', fontSize: '12px', marginTop: '1px', flexShrink: 0 }}>✕</span>
                      <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', lineHeight: '1.5' }}>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
