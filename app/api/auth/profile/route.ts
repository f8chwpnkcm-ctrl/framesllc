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

  const fields: string[] = []
  const values: any[] = []
  let idx = 1

  if ('profile_picture_url' in body) { fields.push(`profile_picture_url = $${idx++}`); values.push(body.profile_picture_url) }
  if ('real_name' in body) { fields.push(`real_name = $${idx++}`); values.push(body.real_name || null) }
  if ('bio' in body) { fields.push(`bio = $${idx++}`); values.push(body.bio || null) }
  if ('camera_brand' in body) { fields.push(`camera_brand = $${idx++}`); values.push(body.camera_brand || null) }
  if ('age' in body) { fields.push(`age = $${idx++}`); values.push(body.age || null) }
  if ('location' in body) { fields.push(`location = $${idx++}`); values.push(body.location || null) }
  if ('open_for_work' in body) { fields.push(`open_for_work = $${idx++}`); values.push(body.open_for_work || false) }
  if ('theme_color' in body) { fields.push(`theme_color = $${idx++}`); values.push(body.theme_color || 'yellow') }
  if ('instagram' in body) { fields.push(`instagram = $${idx++}`); values.push(body.instagram || null) }

  if (fields.length === 0) return NextResponse.json({ error: 'No fields to update' }, { status: 400 })

  values.push(session.user_id)

  const { data, error } = await supabase.rpc('update_user_profile', {
    p_user_id: session.user_id,
    p_fields: JSON.stringify(body)
  })

  // Fallback: direct update
  const updateObj: any = {}
  for (const key of Object.keys(body)) {
    updateObj[key] = body[key]
  }

  const { data: updated, error: updateError } = await supabase
    .from('users')
    .update(updateObj)
    .eq('id', session.user_id)
    .select('username')
    .single()

  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 })
  return NextResponse.json({ success: true, username: updated.username })
}
