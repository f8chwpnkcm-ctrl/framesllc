import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET() {
  const { data: creators } = await supabase
    .from('users')
    .select('id, username, real_name, bio, profile_picture_url, location, camera_brand, open_for_work, theme_color, nodes, is_verified, created_at')
    .order('nodes', { ascending: false })

  return NextResponse.json({ creators: creators || [] })
}
