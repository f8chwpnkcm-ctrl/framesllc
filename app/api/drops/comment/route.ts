import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const drop_id = searchParams.get('drop_id')
  if (!drop_id) return NextResponse.json({ error: 'drop_id required' }, { status: 400 })
  const { data: comments } = await supabase.from('drop_comments').select(`
    id, content, is_collab_interest, created_at,
    users!drop_comments_user_id_fkey(username, real_name, profile_picture_url, theme_color, is_verified)
  `).eq('drop_id', drop_id).order('created_at', { ascending: true })
  return NextResponse.json({ comments: comments || [] })
}

export async function POST(request: Request) {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get('nodable_session')?.value
  if (!sessionId) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  const { data: session } = await supabase.from('sessions').select('*').eq('id', sessionId).gt('expires_at', new Date().toISOString()).single()
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  const { drop_id, content, is_collab_interest } = await request.json()
  if (!content?.trim()) return NextResponse.json({ error: 'Content required' }, { status: 400 })
  const { data: comment, error } = await supabase.from('drop_comments').insert({ drop_id, user_id: session.user_id, content: content.trim(), is_collab_interest: is_collab_interest || false }).select(`
    id, content, is_collab_interest, created_at,
    users!drop_comments_user_id_fkey(username, real_name, profile_picture_url, theme_color, is_verified)
  `).single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (is_collab_interest) {
    const { data: drop } = await supabase.from('drops').select('user_id').eq('id', drop_id).single()
    if (drop && drop.user_id !== session.user_id) {
      const { data: owner } = await supabase.from('users').select('nodes').eq('id', drop.user_id).single()
      if (owner) await supabase.from('users').update({ nodes: owner.nodes + 2 }).eq('id', drop.user_id)
    }
  }
  return NextResponse.json({ comment })
}
