import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { media_type, event_type, details, camera_body, lenses, other_gear, duration } = await request.json()

  const gearParts = [camera_body, lenses, other_gear].filter(Boolean)
  const gearStr = gearParts.join(', ')

  const prompt = `You are a professional ${media_type === 'photo' ? 'photographer' : 'videographer'} creating a detailed shot list.

Event: ${event_type}
${details ? `Details: ${details}` : ''}
${gearStr ? `Gear: ${gearStr}` : ''}
${duration ? `Duration: ${duration}` : ''}

Create a comprehensive, professional shot list. Return ONLY a JSON object with this exact structure:
{
  "title": "Shot List title based on event",
  "categories": [
    {
      "name": "Category name",
      "shots": [
        {
          "name": "Shot name",
          "description": "What to capture and why",
          "tip": "Technical tip",
          "timing": "When to capture this"
        }
      ]
    }
  ]
}

Include 4-6 categories with 3-6 shots each. Return only valid JSON, no markdown, no explanation.`

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
        max_tokens: 2000,
        messages: [{ role: 'user', content: prompt }]
      })
    })

    const data = await res.json()
    console.log('Status:', res.status, 'Content:', JSON.stringify(data).slice(0, 500))
    
    if (!res.ok) {
      return NextResponse.json({ error: data.error?.message || 'API error' }, { status: 500 })
    }

    const text = data.content?.[0]?.text || ''
    const clean = text.replace(/```json|```/g, '').trim()
    const parsed = JSON.parse(clean)
    return NextResponse.json({ result: parsed })
  } catch (e: any) {
    console.error('Error:', e.message)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
