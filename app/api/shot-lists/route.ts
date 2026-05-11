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
  const { data: lists } = await supabase.from('shot_lists').select('*').eq('user_id', session.user_id).order('created_at', { ascending: false })
  return NextResponse.json({ lists: lists || [] })
}

export async function POST(request: Request) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  const { title, media_type, event_type, details, gear, duration, content } = await request.json()
  const { data: list, error } = await supabase.from('shot_lists').insert({
    user_id: session.user_id, title, media_type, event_type, details, gear, duration, content
  }).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ list })
}

export async function DELETE(request: Request) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  const { id } = await request.json()
  await supabase.from('shot_lists').delete().eq('id', id).eq('user_id', session.user_id)
  return NextResponse.json({ success: true })
}
