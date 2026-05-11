import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET() {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get('nodable_session')?.value
  if (!sessionId) return NextResponse.json({ user: null })

  const { data: session } = await supabase.from('sessions').select('*').eq('id', sessionId).gt('expires_at', new Date().toISOString()).single()
  if (!session) return NextResponse.json({ user: null })

  const { data: user } = await supabase.from('users').select('id, email, username, bio, camera_brand, profile_picture_url, age, location, open_for_work, theme_color, crowns, nodes, created_at').eq('id', session.user_id).single()
  return NextResponse.json({ user: user || null })
}
