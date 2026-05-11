import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function PATCH(request: Request) {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get('nodable_session')?.value
  if (!sessionId) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

  const { data: session } = await supabase.from('sessions').select('*').eq('id', sessionId).gt('expires_at', new Date().toISOString()).single()
  if (!session) return NextResponse.json({ error: 'Invalid session' }, { status: 401 })

  const { real_name, bio, camera_brand, age, location, open_for_work, theme_color, instagram } = await request.json()

  const { data, error } = await supabase.from('users')
    .update({ real_name: real_name || null, bio: bio || null, camera_brand: camera_brand || null, age: age || null, location: location || null, open_for_work: open_for_work || false, theme_color: theme_color || 'yellow', instagram: instagram || null })
    .eq('id', session.user_id)
    .select('username')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true, username: data.username })
}
