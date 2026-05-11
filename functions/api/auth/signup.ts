export async function onRequestPost(context: any) {
    const { email, username, password, bio, camera_brand, age, location, open_for_work, theme_color } = await context.request.json()
  
    if (!email || !username || !password) {
      return Response.json({ error: 'Email, username and password required' }, { status: 400 })
    }
  
    if (username.length < 3 || username.length > 20) {
      return Response.json({ error: 'Username must be 3-20 characters' }, { status: 400 })
    }
  
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return Response.json({ error: 'Username can only contain letters, numbers and underscores' }, { status: 400 })
    }
  
    if (password.length < 8) {
      return Response.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
    }
  
    const db = context.env.DB
  
    // Check if email exists in waitlist
    const waitlistEntry = await db.prepare('SELECT * FROM waitlist WHERE email = ?').bind(email).first()
    if (!waitlistEntry) {
      return Response.json({ error: 'Email not on waitlist' }, { status: 403 })
    }
  
    // Check username taken
    const existing = await db.prepare('SELECT id FROM users WHERE username = ?').bind(username).first()
    if (existing) {
      return Response.json({ error: 'Username already taken' }, { status: 409 })
    }
  
    // Hash password using Web Crypto API
    const encoder = new TextEncoder()
    const data = encoder.encode(password)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const password_hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  
    // Create user
    try {
      await db.prepare(`
        INSERT INTO users (email, username, password_hash, bio, camera_brand, age, location, open_for_work, theme_color)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        email, username, password_hash,
        bio || null, camera_brand || null,
        age || null, location || null,
        open_for_work ? 1 : 0,
        theme_color || 'yellow'
      ).run()
  
      const user = await db.prepare('SELECT * FROM users WHERE username = ?').bind(username).first()
  
      // Create session
      const sessionId = crypto.randomUUID()
      const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      await db.prepare('INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)').bind(sessionId, user.id, expires).run()
  
      return new Response(JSON.stringify({ success: true, username }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Set-Cookie': `nodable_session=${sessionId}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${30 * 24 * 60 * 60}`
        }
      })
    } catch (e: any) {
      if (e.message?.includes('UNIQUE')) {
        return Response.json({ error: 'Email already has an account' }, { status: 409 })
      }
      return Response.json({ error: e.message }, { status: 500 })
    }
  }