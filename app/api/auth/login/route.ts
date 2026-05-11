import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { email, password } = await request.json()
  if (!email || !password) return NextResponse.json({ error: 'Email and password required' }, { status: 400 })

  const { data: user } = await supabase.from('users').select('*').eq('email', email).single()
  if (!user) return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })

  const encoder = new TextEncoder()
  const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(password))
  const password_hash = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('')
  if (password_hash !== user.password_hash) return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })

  const lastDrop = new Date(user.last_crown_drop).getTime()
  if (Date.now() - lastDrop >= 24 * 60 * 60 * 1000) {
    await supabase.from('users').update({ crowns: user.crowns + 10, last_crown_drop: new Date().toISOString() }).eq('id', user.id)
  }

  const sessionId = crypto.randomUUID()
  const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
  await supabase.from('sessions').insert({ id: sessionId, user_id: user.id, expires_at: expires })

  const response = NextResponse.json({ success: true, username: user.username })
  response.cookies.set('nodable_session', sessionId, { httpOnly: true, secure: true, sameSite: 'lax', maxAge: 30 * 24 * 60 * 60, path: '/' })
  return response
}
