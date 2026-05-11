import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET(request: Request, { params }: { params: Promise<{ username: string }> }) {
  const { username } = await params
  const { data: user } = await supabase.from('users').select('id, username, bio, camera_brand, profile_picture_url, age, location, open_for_work, theme_color, nodes, created_at').eq('username', username).single()
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })
  return NextResponse.json({ user })
}
