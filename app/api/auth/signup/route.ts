import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { email, username, password, bio, camera_brand, age, location, open_for_work, theme_color } = await request.json()
  if (!email || !username || !password) return NextResponse.json({ error: 'Email, username and password required' }, { status: 400 })
  if (username.length < 3 || username.length > 20) return NextResponse.json({ error: 'Username must be 3-20 characters' }, { status: 400 })
  if (!/^[a-zA-Z0-9_]+$/.test(username)) return NextResponse.json({ error: 'Username can only contain letters, numbers and underscores' }, { status: 400 })
  if (password.length < 8) return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })

  const { data: waitlist } = await supabase.from('waitlist').select('id').eq('email', email).single()
  if (!waitlist) return NextResponse.json({ error: 'Email not on waitlist' }, { status: 403 })

  const { data: existingUser } = await supabase.from('users').select('id').eq('username', username).single()
  if (existingUser) return NextResponse.json({ error: 'Username already taken' }, { status: 409 })

  const encoder = new TextEncoder()
  const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(password))
  const password_hash = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('')

  const { data: user, error } = await supabase.from('users').insert({
    email, username, password_hash, bio: bio || null, camera_brand: camera_brand || null,
    age: age || null, location: location || null, open_for_work: open_for_work || false,
    theme_color: theme_color || 'yellow'
  }).select().single()

  if (error) {
    if (error.code === '23505') return NextResponse.json({ error: 'Email already has an account' }, { status: 409 })
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const sessionId = crypto.randomUUID()
  const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
  await supabase.from('sessions').insert({ id: sessionId, user_id: user.id, expires_at: expires })

  const response = NextResponse.json({ success: true, username })
  response.cookies.set('nodable_session', sessionId, { httpOnly: true, secure: true, sameSite: 'lax', maxAge: 30 * 24 * 60 * 60, path: '/' })
  return response
}
