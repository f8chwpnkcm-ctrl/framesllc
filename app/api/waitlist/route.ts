import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { email } = await request.json()
  if (!email || !email.includes('@')) return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
  const { error } = await supabase.from('waitlist').insert({ email })
  if (error) {
    if (error.code === '23505') return NextResponse.json({ error: 'Already on the waitlist!' }, { status: 409 })
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ success: true })
}
