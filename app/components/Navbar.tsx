'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Navbar({ onJoinWaitlist }: { onJoinWaitlist?: () => void }) {
  const [user, setUser] = useState<any>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.json()).then(d => setUser(d.user))
  }, [])

  return (
    <nav style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px 20px',
      borderBottom: '0.5px solid rgba(255,255,255,0.08)',
      position: 'sticky',
      top: 0,
      background: 'rgba(10,10,10,0.92)',
      backdropFilter: 'blur(12px)',
      zIndex: 100,
    }}>
      {/* Logo */}
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
        <svg width="26" height="14" viewBox="0 0 4191.67 2190.15" fill="none">
          <path d="M767.96,1876.06c348.4-78.57,799.8-147.81,1327.87-147.54,525.29,27,974.51,69.24,1321.72,147.54,59.43-520.49,118.85-1040.98,178.28-1561.48-295.08,235.66-590.16,471.31-885.25,706.97-204.92-226.68-409.84-453.35-614.75-680.03-206.97,234.87-413.93,469.75-620.9,704.62-293.03-234.87-586.07-469.75-879.1-704.62,57.38,511.51,114.75,1023.03,172.13,1534.54Z" fill="#FFE500"/>
        </svg>
        <span style={{ background: 'linear-gradient(90deg, #FFE500, #FFC200)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: '15px', fontWeight: '700', letterSpacing: '-0.02em' }}>Nodable.</span>
      </Link>

      {/* Desktop links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }} className="desktop-nav">
        <Link href="/marketplace" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', textDecoration: 'none' }}>Marketplace</Link>
        <Link href="/creators" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', textDecoration: 'none' }}>Creators</Link>
        <Link href="/tools" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', textDecoration: 'none' }}>Tools</Link>
        {user ? (
          <Link href={`/u/${user.username}`} style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
            <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'rgba(255,229,0,0.15)', border: '1.5px solid #FFE500', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              {user.profile_picture_url ? (
                <img src={user.profile_picture_url} alt={user.username} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span style={{ color: '#FFE500', fontSize: '12px', fontWeight: '700' }}>{user.username[0].toUpperCase()}</span>
              )}
            </div>
            <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px' }}>@{user.username}</span>
          </Link>
        ) : (
          <Link href="/login" style={{ background: '#FFE500', color: '#000', fontSize: '12px', fontWeight: '700', padding: '8px 18px', borderRadius: '6px', textDecoration: 'none' }}>
            Log in
          </Link>
        )}
      </div>

      {/* Mobile right side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }} className="mobile-nav">
        {user ? (
          <Link href={`/u/${user.username}`} style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,229,0,0.15)', border: '1.5px solid #FFE500', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              {user.profile_picture_url ? (
                <img src={user.profile_picture_url} alt={user.username} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span style={{ color: '#FFE500', fontSize: '13px', fontWeight: '700' }}>{user.username[0].toUpperCase()}</span>
              )}
            </div>
          </Link>
        ) : (
          <Link href="/login" style={{ background: '#FFE500', color: '#000', fontSize: '12px', fontWeight: '700', padding: '8px 16px', borderRadius: '6px', textDecoration: 'none' }}>
            Log in
          </Link>
        )}
        {/* Hamburger */}
        <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <div style={{ width: '22px', height: '2px', background: 'rgba(255,255,255,0.6)', borderRadius: '2px', transition: 'all 0.2s', transform: menuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }} />
          <div style={{ width: '22px', height: '2px', background: 'rgba(255,255,255,0.6)', borderRadius: '2px', opacity: menuOpen ? 0 : 1, transition: 'all 0.2s' }} />
          <div style={{ width: '22px', height: '2px', background: 'rgba(255,255,255,0.6)', borderRadius: '2px', transition: 'all 0.2s', transform: menuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }} />
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#0a0a0a', borderBottom: '0.5px solid rgba(255,255,255,0.08)', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '16px', zIndex: 99 }} className="mobile-menu">
          <Link href="/marketplace" onClick={() => setMenuOpen(false)} style={{ color: 'rgba(255,255,255,0.5)', fontSize: '15px', textDecoration: 'none' }}>Marketplace</Link>
          <Link href="/creators" onClick={() => setMenuOpen(false)} style={{ color: 'rgba(255,255,255,0.5)', fontSize: '15px', textDecoration: 'none' }}>Creators</Link>
          <Link href="/tools" onClick={() => setMenuOpen(false)} style={{ color: 'rgba(255,255,255,0.5)', fontSize: '15px', textDecoration: 'none' }}>Tools</Link>
          {user && (
            <Link href={`/u/${user.username}`} onClick={() => setMenuOpen(false)} style={{ color: 'rgba(255,255,255,0.5)', fontSize: '15px', textDecoration: 'none' }}>My profile</Link>
          )}
        </div>
      )}

      <style>{`
        .desktop-nav { display: flex !important; }
        .mobile-nav { display: none !important; }
        .mobile-menu { display: flex !important; }
        @media (max-width: 640px) {
          .desktop-nav { display: none !important; }
          .mobile-nav { display: flex !important; }
        }
      `}</style>
    </nav>
  )
}
