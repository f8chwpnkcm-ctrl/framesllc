import { sql } from '@vercel/postgres'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST() {
  const cookieStore = cookies()
  const sessionId = cookieStore.get('nodable_session')?.value
  if (sessionId) await sql`DELETE FROM sessions WHERE id = ${sessionId}`
  const response = NextResponse.json({ success: true })
  response.cookies.set('nodable_session', '', { maxAge: 0, path: '/' })
  return response
}
