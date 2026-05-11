export async function onRequestGet(context: any) {
    const username = context.params.username
    const db = context.env.DB
  
    const user = await db.prepare(`
      SELECT id, username, bio, camera_brand, profile_picture_url, age, location, open_for_work, theme_color, nodes, created_at
      FROM users WHERE username = ?
    `).bind(username).first()
  
    if (!user) {
      return Response.json({ error: 'User not found' }, { status: 404 })
    }
  
    return Response.json({ user })
  }