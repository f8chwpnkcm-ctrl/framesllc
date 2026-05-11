export async function onRequestPost(context: any) {
    const cookie = context.request.headers.get('Cookie') || ''
    const sessionId = cookie.split(';').find((c: string) => c.trim().startsWith('nodable_session='))?.split('=')[1]
  
    if (sessionId) {
      await context.env.DB.prepare('DELETE FROM sessions WHERE id = ?').bind(sessionId).run()
    }
  
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': 'nodable_session=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0'
      }
    })
  }