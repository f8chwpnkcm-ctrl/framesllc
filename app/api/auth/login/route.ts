import { sql } from '@vercel/postgres'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { email, password } = await request.json()
  if (!email || !password) return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
  const result = await sql`SELECT * FROM users WHERE email = ${email}`
  if (result.rows.length === 0) return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
  const user = result.rows[0]
  const encoder = new TextEncoder()
  const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(password))
  const password_hash = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('')
  if (password_hash !== user.password_hash) return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
  const lastDrop = new Date(user.last_crown_drop).getTime()
  if (Date.now() - lastDrop >= 24 * 60 * 60 * 1000) {
    await sql`UPDATE users SET crowns = crowns + 10, last_crown_drop = NOW() WHERE id = ${user.id}`
  }
  const sessionId = crypto.randomUUID()
  const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
  await sql`INSERT INTO sessions (id, user_id, expires_at) VALUES (${sessionId}, ${user.id}, ${expires})`
  const response = NextResponse.json({ success: true, username: user.username })
  response.cookies.set('nodable_session', sessionId, { httpOnly: true, secure: true, sameSite: 'lax', maxAge: 30 * 24 * 60 * 60, path: '/' })
  return response
}
