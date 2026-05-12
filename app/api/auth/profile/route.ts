import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function PATCH(request: Request) {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get('nodable_session')?.value
  if (!sessionId) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  const { data: session } = await supabase.from('sessions').select('*').eq('id', sessionId).gt('expires_at', new Date().toISOString()).single()
  if (!session) return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
  const body = await request.json()
  const allowed = ['real_name', 'bio', 'camera_brand', 'age', 'location', 'open_for_work', 'theme_color', 'instagram', 'profile_picture_url', 'specialties', 'business_name', 'phone', 'address', 'payment_info']
  const updateObj: any = {}
  for (const key of allowed) {
    if (key in body) updateObj[key] = body[key]
  }
  const { data, error } = await supabase.from('users').update(updateObj).eq('id', session.user_id).select('username').single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true, username: data.username })
}
