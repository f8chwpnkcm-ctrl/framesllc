import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const REACTION_NODES: Record<string, number> = { fire: 1, charged: 2, crown: 5, seen: 0 }
const CROWN_DAILY_LIMIT = 3

export async function POST(request: Request) {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get('nodable_session')?.value
  if (!sessionId) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  const { data: session } = await supabase.from('sessions').select('*').eq('id', sessionId).gt('expires_at', new Date().toISOString()).single()
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

  const { drop_id, reaction } = await request.json()
  if (!['fire', 'charged', 'crown', 'seen'].includes(reaction)) return NextResponse.json({ error: 'Invalid reaction' }, { status: 400 })

  // Check crown daily limit
  if (reaction === 'crown') {
    const today = new Date(); today.setHours(0, 0, 0, 0)
    const { count } = await supabase.from('drop_reactions').select('*', { count: 'exact', head: true })
      .eq('user_id', session.user_id).eq('reaction', 'crown').gte('created_at', today.toISOString())
    if ((count || 0) >= CROWN_DAILY_LIMIT) return NextResponse.json({ error: 'Crown limit reached for today (3/day)' }, { status: 429 })
  }

  // Toggle reaction
  const { data: existing } = await supabase.from('drop_reactions').select('id').eq('drop_id', drop_id).eq('user_id', session.user_id).eq('reaction', reaction).single()

  if (existing) {
    await supabase.from('drop_reactions').delete().eq('id', existing.id)
    return NextResponse.json({ action: 'removed' })
  } else {
    await supabase.from('drop_reactions').insert({ drop_id, user_id: session.user_id, reaction })
    // Award nodes to drop owner
    const nodes = REACTION_NODES[reaction]
    if (nodes > 0) {
      const { data: drop } = await supabase.from('drops').select('user_id').eq('id', drop_id).single()
      if (drop && drop.user_id !== session.user_id) {
        const { data: owner } = await supabase.from('users').select('nodes').eq('id', drop.user_id).single()
        if (owner) await supabase.from('users').update({ nodes: owner.nodes + nodes }).eq('id', drop.user_id)
      }
    }
    return NextResponse.json({ action: 'added' })
  }
}
