import { sql } from '@vercel/postgres'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET() {
  const cookieStore = cookies()
  const sessionId = cookieStore.get('nodable_session')?.value
  if (!sessionId) return NextResponse.json({ user: null })
  const session = await sql`SELECT * FROM sessions WHERE id = ${sessionId} AND expires_at > NOW()`
  if (session.rows.length === 0) return NextResponse.json({ user: null })
  const result = await sql`SELECT id, email, username, bio, camera_brand, profile_picture_url, age, location, open_for_work, theme_color, crowns, nodes, created_at FROM users WHERE id = ${session.rows[0].user_id}`
  return NextResponse.json({ user: result.rows[0] || null })
}
