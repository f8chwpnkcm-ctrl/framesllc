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
  const { data: drops } = await supabase
    .from('drops')
    .select(`
      id, caption, shoot_type, gear_used, location_tag, created_at,
      users!drops_user_id_fkey(id, username, real_name, profile_picture_url, theme_color, is_verified),
      drop_reactions(reaction, user_id),
      drop_comments(id)
    `)
    .order('created_at', { ascending: false })
    .limit(50)

  return NextResponse.json({ drops: drops || [] })
}

export async function POST(request: Request) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  const { caption, shoot_type, gear_used, location_tag } = await request.json()
  if (!caption?.trim()) return NextResponse.json({ error: 'Caption required' }, { status: 400 })
  const { data: drop, error } = await supabase.from('drops').insert({ user_id: session.user_id, caption: caption.trim(), shoot_type, gear_used, location_tag }).select(`
    id, caption, shoot_type, gear_used, location_tag, created_at,
    users!drops_user_id_fkey(id, username, real_name, profile_picture_url, theme_color, is_verified),
    drop_reactions(reaction, user_id),
    drop_comments(id)
  `).single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Award nodes for posting
  await supabase.from('users').update({ nodes: supabase.rpc('increment', { x: 2 }) }).eq('id', session.user_id)

  return NextResponse.json({ drop })
}

export async function DELETE(request: Request) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  const { id } = await request.json()
  await supabase.from('drops').delete().eq('id', id).eq('user_id', session.user_id)
  return NextResponse.json({ success: true })
}
