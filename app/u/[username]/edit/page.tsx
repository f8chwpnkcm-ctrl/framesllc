'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const ALL_SPECIALTIES = [
  'Weddings', 'Sports', 'Concerts', 'Corporate', 'Portrait',
  'Fashion', 'Real Estate', 'Documentary', 'Street', 'Nature',
  'Events', 'Music Videos', 'Aerial/Drone', 'Automotive', 'Food'
]

export default function EditProfilePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [userId, setUserId] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [form, setForm] = useState({
    real_name: '', bio: '', camera_brand: '', age: '', location: '',
    open_for_work: false, theme_color: 'yellow', instagram: '',
    specialties: [] as string[],
  })

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.json()).then(d => {
      if (!d.user) { router.push('/login'); return }
      setUserId(d.user.id)
      setAvatarUrl(d.user.profile_picture_url || null)
      setForm({
        real_name: d.user.real_name || '',
        bio: d.user.bio || '',
        camera_brand: d.user.camera_brand || '',
        age: d.user.age ? String(d.user.age) : '',
        location: d.user.location || '',
        open_for_work: d.user.open_for_work || false,
        theme_color: d.user.theme_color || 'yellow',
        instagram: d.user.instagram || '',
        specialties: d.user.specialties || [],
      })
      setLoading(false)
    })
  }, [])

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !userId) return
    if (file.size > 5 * 1024 * 1024) { setError('Image must be under 5MB'); return }
    setUploading(true)
    setError('')
    const ext = file.name.split('.').pop()
    const path = `${userId}/avatar.${ext}`
    const { error: uploadError } = await supabase.storage.from('avatars').upload(path, file, { upsert: true })
    if (uploadError) { setError(uploadError.message); setUploading(false); return }
    const { data } = supabase.storage.from('avatars').getPublicUrl(path)
    const url = `${data.publicUrl}?t=${Date.now()}`
    await fetch('/api/auth/profile', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ profile_picture_url: url }) })
    setAvatarUrl(url)
    setUploading(false)
  }

  const toggleSpecialty = (s: string) => {
    setForm(f => ({
      ...f,
      specialties: f.specialties.includes(s)
        ? f.specialties.filter(x => x !== s)
        : [...f.specialties, s]
    }))
  }

  const update = (key: string, value: any) => setForm(f => ({ ...f, [key]: value }))

  const handleSave = async () => {
    setSaving(true)
    setError('')
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, age: form.age ? parseInt(form.age) : null }),
      })
      const data = await res.json()
      if (res.ok) { setSuccess(true); setTimeout(() => router.push(`/u/${data.username}`), 1000) }
      else { setError(data.error || 'Something went wrong') }
    } catch { setError('Something went wrong') }
    setSaving(false)
  }

  const themes = [
    { id: 'yellow', color: '#FFE500' }, { id: 'blue', color: '#3B82F6' },
    { id: 'red', color: '#EF4444' }, { id: 'green', color: '#22C55E' },
    { id: 'purple', color: '#A855F7' }, { id: 'white', color: '#FFFFFF' },
  ]
  const cameras = ['Sony', 'Canon', 'Nikon', 'Fuji', 'Panasonic', 'Blackmagic', 'DJI', 'Other']

  const inputStyle = { width: '100%', background: 'rgba(255,255,255,0.06)', border: '0.5px solid rgba(255,255,255,0.12)', borderRadius: '10px', padding: '14px 16px', fontSize: '14px', color: '#fff', outline: 'none', fontFamily: 'var(--font-inter), sans-serif', boxSizing: 'border-box' as const }
  const labelStyle = { color: 'rgba(255,255,255,0.5)', fontSize: '12px', fontWeight: '600' as const, letterSpacing: '0.04em', textTransform: 'uppercase' as const, marginBottom: '8px', display: 'block' }

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
        <button onClick={() => router.back()} style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-inter), sans-serif' }}>← Back</button>
      </nav>

      <div style={{ maxWidth: '560px', margin: '0 auto', padding: '60px 24px' }}>
        <h1 style={{ color: '#fff', fontSize: '28px', fontWeight: '700', letterSpacing: '-0.02em', margin: '0 0 8px' }}>Edit profile</h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', margin: '0 0 40px' }}>Update your public profile information.</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          <div>
            <label style={labelStyle}>Profile picture</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)', border: '2px solid rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                {avatarUrl ? <img src={avatarUrl} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '24px', fontWeight: '700' }}>?</span>}
              </div>
              <div>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarUpload} style={{ display: 'none' }} />
                <button onClick={() => fileInputRef.current?.click()} disabled={uploading}
                  style={{ background: 'rgba(255,255,255,0.06)', border: '0.5px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '10px 18px', color: 'rgba(255,255,255,0.6)', fontSize: '13px', cursor: 'pointer', fontFamily: 'var(--font-inter), sans-serif' }}>
                  {uploading ? 'Uploading...' : 'Upload photo'}
                </button>
                <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: '11px', marginTop: '6px' }}>JPG, PNG or WebP. Max 5MB.</div>
              </div>
            </div>
          </div>

          <div>
            <label style={labelStyle}>Real name</label>
            <input style={inputStyle} type="text" placeholder="Matthew Ory" value={form.real_name} onChange={e => update('real_name', e.target.value)} />
          </div>

          <div>
            <label style={labelStyle}>Instagram</label>
            <input style={inputStyle} type="text" placeholder="@framesbymatt" value={form.instagram} onChange={e => update('instagram', e.target.value)} />
          </div>

          <div>
            <label style={labelStyle}>Bio <span style={{ color: 'rgba(255,255,255,0.2)', fontWeight: '400', textTransform: 'none', letterSpacing: 0 }}>{form.bio.length}/300</span></label>
            <textarea style={{ ...inputStyle, resize: 'none', height: '80px' }} placeholder="Sports & events videographer..." value={form.bio} maxLength={300} onChange={e => update('bio', e.target.value)} />
          </div>

          <div>
            <label style={labelStyle}>Specialties <span style={{ color: 'rgba(255,255,255,0.2)', fontWeight: '400', textTransform: 'none', letterSpacing: 0 }}>{form.specialties.length} selected</span></label>
            <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '8px' }}>
              {ALL_SPECIALTIES.map(s => (
                <button key={s} onClick={() => toggleSpecialty(s)}
                  style={{ padding: '7px 14px', borderRadius: '8px', border: `0.5px solid ${form.specialties.includes(s) ? '#FFE500' : 'rgba(255,255,255,0.12)'}`, background: form.specialties.includes(s) ? 'rgba(255,229,0,0.1)' : 'transparent', color: form.specialties.includes(s) ? '#FFE500' : 'rgba(255,255,255,0.5)', fontSize: '13px', cursor: 'pointer', fontFamily: 'var(--font-inter), sans-serif' }}>
                  {s}
                </button>
              ))}
            </div>
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
                <button key={t.id} onClick={() => update('theme_color', t.id)}
                  style={{ width: '32px', height: '32px', borderRadius: '50%', background: t.color, border: form.theme_color === t.id ? '3px solid #fff' : '3px solid transparent', cursor: 'pointer', outline: 'none' }} />
              ))}
            </div>
          </div>

          {error && <div style={{ color: 'rgba(255,100,100,0.8)', fontSize: '13px' }}>{error}</div>}
          {success && <div style={{ color: '#22C55E', fontSize: '13px' }}>Saved! Redirecting...</div>}

          <button onClick={handleSave} disabled={saving}
            style={{ width: '100%', background: '#FFE500', color: '#000', fontSize: '14px', fontWeight: '700', padding: '14px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-inter), sans-serif' }}>
            {saving ? 'Saving...' : 'Save changes'}
          </button>
        </div>
      </div>
    </main>
  )
}
