import { sql } from '@vercel/postgres'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { email, username, password, bio, camera_brand, age, location, open_for_work, theme_color } = await request.json()
  if (!email || !username || !password) return NextResponse.json({ error: 'Email, username and password required' }, { status: 400 })
  if (username.length < 3 || username.length > 20) return NextResponse.json({ error: 'Username must be 3-20 characters' }, { status: 400 })
  if (!/^[a-zA-Z0-9_]+$/.test(username)) return NextResponse.json({ error: 'Username can only contain letters, numbers and underscores' }, { status: 400 })
  if (password.length < 8) return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
  const waitlist = await sql`SELECT * FROM waitlist WHERE email = ${email}`
  if (waitlist.rows.length === 0) return NextResponse.json({ error: 'Email not on waitlist' }, { status: 403 })
  const existing = await sql`SELECT id FROM users WHERE username = ${username}`
  if (existing.rows.length > 0) return NextResponse.json({ error: 'Username already taken' }, { status: 409 })
  const encoder = new TextEncoder()
  const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(password))
  const password_hash = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('')
  try {
    await sql`INSERT INTO users (email, username, password_hash, bio, camera_brand, age, location, open_for_work, theme_color) VALUES (${email}, ${username}, ${password_hash}, ${bio || null}, ${camera_brand || null}, ${age || null}, ${location || null}, ${open_for_work || false}, ${theme_color || 'yellow'})`
    const user = await sql`SELECT * FROM users WHERE username = ${username}`
    const sessionId = crypto.randomUUID()
    const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    await sql`INSERT INTO sessions (id, user_id, expires_at) VALUES (${sessionId}, ${user.rows[0].id}, ${expires})`
    const response = NextResponse.json({ success: true, username })
    response.cookies.set('nodable_session', sessionId, { httpOnly: true, secure: true, sameSite: 'lax', maxAge: 30 * 24 * 60 * 60, path: '/' })
    return response
  } catch (e: any) {
    if (e.message?.includes('unique') || e.message?.includes('duplicate')) return NextResponse.json({ error: 'Email already has an account' }, { status: 409 })
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
