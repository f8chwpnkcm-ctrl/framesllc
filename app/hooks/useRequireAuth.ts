'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export function useRequireAuth() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.json()).then(d => {
      if (!d.user) {
        router.push('/login?next=' + encodeURIComponent(window.location.pathname))
      } else {
        setUser(d.user)
      }
      setLoading(false)
    })
  }, [])

  return { user, loading }
}
