import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { vibe, shoot_type, time_of_day, location_type, media_type, reference } = await request.json()

  const prompt = `You are a creative director for photographers and videographers. Generate a detailed mood board brief.

Shoot type: ${shoot_type || 'general'}
Media: ${media_type || 'photo/video'}
Vibe/description: ${vibe}
${time_of_day ? `Time of day: ${time_of_day}` : ''}
${location_type ? `Location: ${location_type}` : ''}
${reference ? `Reference/inspiration: ${reference}` : ''}

Return ONLY a valid JSON object with this exact structure, no markdown, no explanation:
{
  "title": "Creative title for this mood board",
  "tagline": "One evocative sentence that captures the feeling",
  "color_palette": [
    { "hex": "#hexcode", "name": "Color name", "role": "How to use this color" },
    { "hex": "#hexcode", "name": "Color name", "role": "How to use this color" },
    { "hex": "#hexcode", "name": "Color name", "role": "How to use this color" },
    { "hex": "#hexcode", "name": "Color name", "role": "How to use this color" },
    { "hex": "#hexcode", "name": "Color name", "role": "How to use this color" }
  ],
  "lighting": {
    "style": "Lighting style name",
    "description": "How to achieve this lighting",
    "direction": "Where light comes from",
    "quality": "Hard/soft/diffused etc"
  },
  "camera_settings": {
    "aperture": "f/1.8 - f/2.8",
    "shutter_speed": "1/500s",
    "iso": "400-800",
    "focal_length": "35mm - 85mm",
    "notes": "Any special technique notes"
  },
  "lut_style": {
    "name": "LUT style name",
    "description": "What this grade looks like",
    "keywords": ["keyword1", "keyword2", "keyword3"]
  },
  "composition": {
    "framing": "How to frame shots",
    "movement": "Camera or subject movement style",
    "depth": "Use of depth and layers"
  },
  "keywords": ["mood keyword 1", "mood keyword 2", "mood keyword 3", "mood keyword 4", "mood keyword 5", "mood keyword 6"],
  "do": ["Creative direction tip 1", "Creative direction tip 2", "Creative direction tip 3"],
  "dont": ["What to avoid 1", "What to avoid 2", "What to avoid 3"]
}`

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
    if (!res.ok) return NextResponse.json({ error: data.error?.message }, { status: 500 })

    const text = data.content?.[0]?.text || ''
    const clean = text.replace(/```json|```/g, '').trim()
    const parsed = JSON.parse(clean)
    return NextResponse.json({ result: parsed })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
