import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { media_type, event_type, details, camera_body, lenses, other_gear, duration } = await request.json()

  const gearParts = [camera_body, lenses, other_gear].filter(Boolean)
  const gearStr = gearParts.join(', ')

  const prompt = `You are a professional ${media_type === 'photo' ? 'photographer' : 'videographer'} creating a shot list.

Event: ${event_type}
${details ? `Details: ${details}` : ''}
${gearStr ? `Gear: ${gearStr}` : ''}
${duration ? `Duration: ${duration}` : ''}

Return ONLY a valid JSON object. No markdown, no backticks, no explanation. Just the raw JSON:
{"title":"...","categories":[{"name":"...","shots":[{"name":"...","description":"...","tip":"...","timing":"..."}]}]}

Include exactly 4 categories with exactly 4 shots each. Keep descriptions under 100 characters. Keep tips under 80 characters.`

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 3000,
        messages: [{ role: 'user', content: prompt }]
      })
    })

    const data = await res.json()
    if (!res.ok) return NextResponse.json({ error: data.error?.message || 'API error' }, { status: 500 })

    const text = data.content?.[0]?.text || ''
    const clean = text.replace(/```json|```/g, '').trim()
    const parsed = JSON.parse(clean)
    return NextResponse.json({ result: parsed })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
