import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

async function getSession() {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get('nodable_session')?.value
  if (!sessionId) return null
  const { data: session } = await supabase.from('sessions').select('*').eq('id', sessionId).gt('expires_at', new Date().toISOString()).single()
  return session
}

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  const { data: boards } = await supabase.from('mood_boards').select('*').eq('user_id', session.user_id).order('created_at', { ascending: false })
  return NextResponse.json({ boards: boards || [] })
}

export async function POST(request: Request) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  const { title, vibe, content } = await request.json()
  const { data: board, error } = await supabase.from('mood_boards').insert({ user_id: session.user_id, title, vibe, content }).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ board })
}

export async function DELETE(request: Request) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  const { id } = await request.json()
  await supabase.from('mood_boards').delete().eq('id', id).eq('user_id', session.user_id)
  return NextResponse.json({ success: true })
}
