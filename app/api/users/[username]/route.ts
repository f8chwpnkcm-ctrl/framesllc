import { sql } from '@vercel/postgres'
import { NextResponse } from 'next/server'

export async function GET(request: Request, { params }: { params: { username: string } }) {
  const result = await sql`
    SELECT id, username, bio, camera_brand, profile_picture_url, age, location, open_for_work, theme_color, nodes, created_at
    FROM users WHERE username = ${params.username}
  `

  if (result.rows.length === 0) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  return NextResponse.json({ user: result.rows[0] })
}