import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { job_description, rate_type, rate_amount, extras, media_type, event_type } = await request.json()

  const gearParts = [media_type, event_type].filter(Boolean)
  const prompt = `You are a professional photographer/videographer creating invoice line items.

Job: ${event_type || ''} ${media_type || ''} shoot
Description: ${job_description}
Rate: ${rate_type === 'hourly' ? `$${rate_amount}/hour` : `$${rate_amount} flat rate`}
${extras ? `Extras mentioned: ${extras}` : ''}

Generate professional invoice line items. Return ONLY a JSON array like this:
[
  { "description": "Line item description", "quantity": 1, "rate": 500, "amount": 500 },
  { "description": "Another item", "quantity": 2, "rate": 50, "amount": 100 }
]

Rules:
- Base the main line item on the rate provided
- Add any extras as separate line items with reasonable rates
- quantity x rate must equal amount
- All amounts in dollars as numbers only
- 2-6 line items total
- Return only valid JSON array, no markdown, no explanation`

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
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }]
      })
    })

    const data = await res.json()
    if (!res.ok) return NextResponse.json({ error: data.error?.message }, { status: 500 })

    const text = data.content?.[0]?.text || ''
    const clean = text.replace(/```json|```/g, '').trim()
    const parsed = JSON.parse(clean)
    return NextResponse.json({ line_items: parsed })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
