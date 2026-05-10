export const runtime = 'edge'

export async function POST(request: Request) {
  const { email } = await request.json()

  if (!email || !email.includes('@')) {
    return Response.json({ error: 'Invalid email' }, { status: 400 })
  }

  try {
    const db = (process.env as any).DB
    await db.prepare('INSERT INTO waitlist (email) VALUES (?)').bind(email).run()
    return Response.json({ success: true })
  } catch (e: any) {
    return Response.json({ error: e.message || 'Unknown error' }, { status: 500 })
  }
}