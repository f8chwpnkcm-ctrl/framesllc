export async function onRequestPost(context: any) {
    const { email, password } = await context.request.json()
  
    if (!email || !password) {
      return Response.json({ error: 'Email and password required' }, { status: 400 })
    }
  
    const db = context.env.DB
    const user = await db.prepare('SELECT * FROM users WHERE email = ?').bind(email).first()
  
    if (!user) {
      return Response.json({ error: 'Invalid email or password' }, { status: 401 })
    }
  
    const encoder = new TextEncoder()
    const data = encoder.encode(password)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const password_hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  
    if (password_hash !== user.password_hash) {
      return Response.json({ error: 'Invalid email or password' }, { status: 401 })
    }
  
    // Check daily crown drop
    const lastDrop = new Date(user.last_crown_drop).getTime()
    const now = Date.now()
    const oneDayMs = 24 * 60 * 60 * 1000
    if (now - lastDrop >= oneDayMs) {
      await db.prepare('UPDATE users SET crowns = crowns + 10, last_crown_drop = CURRENT_TIMESTAMP WHERE id = ?').bind(user.id).run()
    }
  
    const sessionId = crypto.randomUUID()
    const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    await db.prepare('INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)').bind(sessionId, user.id, expires).run()
  
    return new Response(JSON.stringify({ success: true, username: user.username }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': `nodable_session=${sessionId}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${30 * 24 * 60 * 60}`
      }
    })
  }