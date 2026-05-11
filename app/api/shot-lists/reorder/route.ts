import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function PATCH(request: Request) {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get('nodable_session')?.value
  if (!sessionId) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  const { data: session } = await supabase.from('sessions').select('*').eq('id', sessionId).gt('expires_at', new Date().toISOString()).single()
  if (!session) return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
  const { ids } = await request.json()
  await Promise.all(ids.map((id: number, index: number) =>
    supabase.from('shot_lists').update({ position: index }).eq('id', id).eq('user_id', session.user_id)
  ))
  return NextResponse.json({ success: true })
}
