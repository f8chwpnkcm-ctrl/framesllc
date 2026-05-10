export async function onRequestPost(context: any) {
  const { email } = await context.request.json()

  if (!email || !email.includes('@')) {
    return Response.json({ error: 'Invalid email' }, { status: 400 })
  }

  try {
    const db = context.env.DB
    if (!db) {
      return Response.json({ error: 'DB not found' }, { status: 500 })
    }
    await db.prepare('INSERT INTO waitlist (email) VALUES (?)').bind(email).run()
    return Response.json({ success: true })
  } catch (e: any) {
    if (e.message?.includes('UNIQUE')) {
      return Response.json({ error: 'Already on the waitlist!' }, { status: 409 })
    }
    return Response.json({ error: e.message || 'Unknown error' }, { status: 500 })
  }
}
