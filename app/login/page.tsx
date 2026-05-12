'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get('next') || ''
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [error, setError] = useState('')

  const handleLogin = async () => {
    if (!email || !password) { setError('Both fields required'); return }
    setStatus('loading')
    setError('')
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (res.ok) {
        router.push(next || `/u/${data.username}`)
      } else {
        setError(data.error || 'Something went wrong')
        setStatus('error')
      }
    } catch {
      setError('Something went wrong')
      setStatus('idle')
    }
  }

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

  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(to bottom, #0a0a0a, #111827)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', fontFamily: 'var(--font-inter), sans-serif' }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <a href="/" style={{ textDecoration: 'none' }}>
            <svg width="32" height="18" viewBox="0 0 4191.67 2190.15" fill="none" style={{ marginBottom: '12px', display: 'block', margin: '0 auto 12px' }}>
              <path d="M767.96,1876.06c348.4-78.57,799.8-147.81,1327.87-147.54,525.29,27,974.51,69.24,1321.72,147.54,59.43-520.49,118.85-1040.98,178.28-1561.48-295.08,235.66-590.16,471.31-885.25,706.97-204.92-226.68-409.84-453.35-614.75-680.03-206.97,234.87-413.93,469.75-620.9,704.62-293.03-234.87-586.07-469.75-879.1-704.62,57.38,511.51,114.75,1023.03,172.13,1534.54Z" fill="#FFE500"/>
            </svg>
            <div style={{ background: 'linear-gradient(90deg, #FFE500, #FFC200)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: '20px', fontWeight: '700', letterSpacing: '-0.02em' }}>Nodable.</div>
          </a>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '40px' }}>
          <h1 style={{ color: '#fff', fontSize: '24px', fontWeight: '700', letterSpacing: '-0.02em', margin: '0 0 8px' }}>Welcome back</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', margin: '0 0 32px' }}>Log in to your Nodable account.</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', fontWeight: '600', letterSpacing: '0.04em', textTransform: 'uppercase' as const, marginBottom: '8px', display: 'block' }}>Email</label>
              <input style={inputStyle} type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleLogin()} />
            </div>
            <div>
              <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', fontWeight: '600', letterSpacing: '0.04em', textTransform: 'uppercase' as const, marginBottom: '8px', display: 'block' }}>Password</label>
              <input style={inputStyle} type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleLogin()} />
            </div>

            {error && <div style={{ color: 'rgba(255,100,100,0.8)', fontSize: '13px' }}>{error}</div>}

            <button onClick={handleLogin} disabled={status === 'loading'}
              style={{ width: '100%', background: '#FFE500', color: '#000', fontSize: '14px', fontWeight: '700', padding: '14px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-inter), sans-serif' }}>
              {status === 'loading' ? '...' : 'Log in'}
            </button>

            <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '13px' }}>
              Don't have an account? <a href="/signup" style={{ color: '#FFE500', textDecoration: 'none' }}>Sign up</a>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
