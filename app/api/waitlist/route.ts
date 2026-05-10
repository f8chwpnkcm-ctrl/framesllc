import { getRequestContext } from '@cloudflare/next-on-pages'

export const runtime = 'edge'

export async function POST(request: Request) {
  const { email } = await request.json()

  if (!email || !email.includes('@')) {
    return Response.json({ error: 'Invalid email' }, { status: 400 })
  }

  try {
    const { env } = getRequestContext()
    const db = env.DB
    await db.prepare('INSERT INTO waitlist (email) VALUES (?)').bind(email).run()
    return Response.json({ success: true })
  } catch (e: any) {
    if (e.message?.includes('UNIQUE')) {
      return Response.json({ error: 'Already on the waitlist!' }, { status: 409 })
    }
    return Response.json({ error: 'Something went wrong' }, { status: 500 })
  }
}