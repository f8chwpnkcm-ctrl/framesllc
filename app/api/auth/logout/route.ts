import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST() {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get('nodable_session')?.value
  if (sessionId) await supabase.from('sessions').delete().eq('id', sessionId)
  const response = NextResponse.json({ success: true })
  response.cookies.set('nodable_session', '', { maxAge: 0, path: '/' })
  return response
}
