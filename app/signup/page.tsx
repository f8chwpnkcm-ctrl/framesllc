'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SignupPage() {
  const router = useRouter()
  const [step, setStep] = useState<'account' | 'profile'>('account')
  const [form, setForm] = useState({
    email: '',
    username: '',
    password: '',
    bio: '',
    camera_brand: '',
    age: '',
    location: '',
    open_for_work: false,
    theme_color: 'yellow',
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [error, setError] = useState('')

  const update = (key: string, value: any) => setForm(f => ({ ...f, [key]: value }))

  const handleSubmit = async () => {
    setStatus('loading')
    setError('')
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, age: form.age ? parseInt(form.age) : null }),
      })
      const data = await res.json()
      if (res.ok) {
        router.push(`/u/${data.username}`)
      } else {
        setError(data.error || 'Something went wrong')
        setStatus('error')
      }
    } catch {
      setError('Something went wrong')
      setStatus('error')
    }
  }

  const themes = [
    { id: 'yellow', color: '#FFE500', label: 'Gold' },
    { id: 'blue', color: '#3B82F6', label: 'Blue' },
    { id: 'red', color: '#EF4444', label: 'Red' },
    { id: 'green', color: '#22C55E', label: 'Green' },
    { id: 'purple', color: '#A855F7', label: 'Purple' },
    { id: 'white', color: '#FFFFFF', label: 'White' },
  ]

  const cameras = ['Sony', 'Canon', 'Nikon', 'Fuji', 'Panasonic', 'Blackmagic', 'DJI', 'Other']

  const inputStyle = {
    width: '100%',
    background: 'rgba(255,255,255,0.06)',
    border: '0.5px solid rgba(255,255,255,0.12)',
    borderRadius: '10px',
    padding: '14px 16px',
    fontSize: '14px',
    color: '#fff',
    outline: 'none',
    fontFamily: 'var(--font-inter), sans-serif',
    boxSizing: 'border-box' as const,
  }

  const labelStyle = {
    color: 'rgba(255,255,255,0.5)',
    fontSize: '12px',
    fontWeight: '600' as const,
    letterSpacing: '0.04em',
    textTransform: 'uppercase' as const,
    marginBottom: '8px',
    display: 'block',
  }

  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(to bottom, #0a0a0a, #111827)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', fontFamily: 'var(--font-inter), sans-serif' }}>
      <div style={{ width: '100%', maxWidth: '480px' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <svg width="32" height="18" viewBox="0 0 4191.67 2190.15" fill="none" style={{ marginBottom: '12px' }}>
            <path d="M767.96,1876.06c348.4-78.57,799.8-147.81,1327.87-147.54,525.29,27,974.51,69.24,1321.72,147.54,59.43-520.49,118.85-1040.98,178.28-1561.48-295.08,235.66-590.16,471.31-885.25,706.97-204.92-226.68-409.84-453.35-614.75-680.03-206.97,234.87-413.93,469.75-620.9,704.62-293.03-234.87-586.07-469.75-879.1-704.62,57.38,511.51,114.75,1023.03,172.13,1534.54Z" fill="#FFE500"/>
          </svg>
          <div style={{ background: 'linear-gradient(90deg, #FFE500, #FFC200)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: '20px', fontWeight: '700', letterSpacing: '-0.02em' }}>Nodable.</div>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '40px' }}>

          {/* Step indicator */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
            {['Account', 'Profile'].map((s, i) => (
              <div key={s} style={{ flex: 1, height: '3px', borderRadius: '2px', background: i === 0 || step === 'profile' ? '#FFE500' : 'rgba(255,255,255,0.1)' }} />
            ))}
          </div>

          {step === 'account' ? (
            <>
              <h1 style={{ color: '#fff', fontSize: '24px', fontWeight: '700', letterSpacing: '-0.02em', margin: '0 0 8px' }}>Create your account</h1>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', margin: '0 0 32px' }}>You're on the waitlist — now claim your spot.</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={labelStyle}>Email</label>
                  <input style={inputStyle} type="email" placeholder="your@email.com" value={form.email} onChange={e => update('email', e.target.value)} />
                </div>
                <div>
                  <label style={labelStyle}>Username</label>
                  <input style={inputStyle} type="text" placeholder="framesbymatt" value={form.username} onChange={e => update('username', e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))} />
                  <div style={{ color: 'rgba(255,255,255,0.25)', fontSize: '11px', marginTop: '6px' }}>Letters, numbers and underscores only. 3-20 characters.</div>
                </div>
                <div>
                  <label style={labelStyle}>Password</label>
                  <input style={inputStyle} type="password" placeholder="At least 8 characters" value={form.password} onChange={e => update('password', e.target.value)} />
                </div>

                {error && <div style={{ color: 'rgba(255,100,100,0.8)', fontSize: '13px' }}>{error}</div>}

                <button
                  onClick={() => {
                    if (!form.email || !form.username || !form.password) { setError('All fields required'); return }
                    if (form.password.length < 8) { setError('Password must be at least 8 characters'); return }
                    setError('')
                    setStep('profile')
                  }}
                  style={{ width: '100%', background: '#FFE500', color: '#000', fontSize: '14px', fontWeight: '700', padding: '14px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-inter), sans-serif' }}
                >
                  Continue
                </button>

                <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '13px' }}>
                  Already have an account? <a href="/login" style={{ color: '#FFE500', textDecoration: 'none' }}>Log in</a>
                </div>
              </div>
            </>
          ) : (
            <>
              <h1 style={{ color: '#fff', fontSize: '24px', fontWeight: '700', letterSpacing: '-0.02em', margin: '0 0 8px' }}>Set up your profile</h1>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', margin: '0 0 32px' }}>All optional — you can fill this in later.</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={labelStyle}>Bio <span style={{ color: 'rgba(255,255,255,0.2)', fontWeight: '400', textTransform: 'none', letterSpacing: 0 }}>{form.bio.length}/300</span></label>
                  <textarea
                    style={{ ...inputStyle, resize: 'none', height: '80px' }}
                    placeholder="Sports & events videographer based in CT..."
                    value={form.bio}
                    maxLength={300}
                    onChange={e => update('bio', e.target.value)}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Camera brand</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '8px' }}>
                    {cameras.map(c => (
                      <button key={c} onClick={() => update('camera_brand', c.toLowerCase())}
                        style={{ padding: '8px 16px', borderRadius: '8px', border: `0.5px solid ${form.camera_brand === c.toLowerCase() ? '#FFE500' : 'rgba(255,255,255,0.12)'}`, background: form.camera_brand === c.toLowerCase() ? 'rgba(255,229,0,0.1)' : 'transparent', color: form.camera_brand === c.toLowerCase() ? '#FFE500' : 'rgba(255,255,255,0.5)', fontSize: '13px', cursor: 'pointer', fontFamily: 'var(--font-inter), sans-serif' }}>
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={labelStyle}>Age</label>
                    <input style={inputStyle} type="number" placeholder="24" value={form.age} onChange={e => update('age', e.target.value)} min="13" max="99" />
                  </div>
                  <div>
                    <label style={labelStyle}>Location</label>
                    <input style={inputStyle} type="text" placeholder="New Haven, CT" value={form.location} onChange={e => update('location', e.target.value)} />
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Open for work</label>
                  <button onClick={() => update('open_for_work', !form.open_for_work)}
                    style={{ padding: '10px 20px', borderRadius: '8px', border: `0.5px solid ${form.open_for_work ? '#FFE500' : 'rgba(255,255,255,0.12)'}`, background: form.open_for_work ? 'rgba(255,229,0,0.1)' : 'transparent', color: form.open_for_work ? '#FFE500' : 'rgba(255,255,255,0.5)', fontSize: '13px', cursor: 'pointer', fontFamily: 'var(--font-inter), sans-serif' }}>
                    {form.open_for_work ? '✓ Available for hire' : 'Not currently available'}
                  </button>
                </div>

                <div>
                  <label style={labelStyle}>Profile theme</label>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    {themes.map(t => (
                      <button key={t.id} onClick={() => update('theme_color', t.id)} title={t.label}
                        style={{ width: '32px', height: '32px', borderRadius: '50%', background: t.color, border: form.theme_color === t.id ? '3px solid #fff' : '3px solid transparent', cursor: 'pointer', outline: 'none' }} />
                    ))}
                  </div>
                </div>

                {error && <div style={{ color: 'rgba(255,100,100,0.8)', fontSize: '13px' }}>{error}</div>}

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button onClick={() => setStep('account')}
                    style={{ flex: 1, background: 'transparent', color: 'rgba(255,255,255,0.4)', fontSize: '14px', fontWeight: '600', padding: '14px', borderRadius: '10px', border: '0.5px solid rgba(255,255,255,0.12)', cursor: 'pointer', fontFamily: 'var(--font-inter), sans-serif' }}>
                    Back
                  </button>
                  <button onClick={handleSubmit} disabled={status === 'loading'}
                    style={{ flex: 2, background: '#FFE500', color: '#000', fontSize: '14px', fontWeight: '700', padding: '14px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-inter), sans-serif' }}>
                    {status === 'loading' ? '...' : 'Create my profile 👑'}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  )
}