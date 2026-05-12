'use client'

import Link from 'next/link'
import { useEffect, useState, useRef } from 'react'

export default function Navbar({ onJoinWaitlist }: { onJoinWaitlist?: () => void }) {
  const [user, setUser] = useState<any>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const profileRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.json()).then(d => setUser(d.user))
    const saved = localStorage.getItem('nodable_theme') as 'dark' | 'light' | null
    if (saved) { setTheme(saved); applyTheme(saved) }
  }, [])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const applyTheme = (t: 'dark' | 'light') => {
    document.documentElement.setAttribute('data-theme', t)
  }

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    applyTheme(next)
    localStorage.setItem('nodable_theme', next)
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    window.location.href = '/'
  }

  const accentColor = '#FFE500'

  return (
    <>
      <style>{`
        [data-theme="light"] {
          --bg: #f5f4f0;
          --bg-card: rgba(0,0,0,0.04);
          --bg-card-border: rgba(0,0,0,0.08);
          --text: #111;
          --text-muted: rgba(0,0,0,0.45);
          --text-faint: rgba(0,0,0,0.25);
          --nav-bg: rgba(245,244,240,0.92);
          --border: rgba(0,0,0,0.08);
          --dropdown-bg: #fff;
          --dropdown-border: rgba(0,0,0,0.1);
          --hover: rgba(0,0,0,0.04);
        }
        [data-theme="dark"], :root {
          --bg: #080808;
          --bg-card: rgba(255,255,255,0.03);
          --bg-card-border: rgba(255,255,255,0.08);
          --text: #fff;
          --text-muted: rgba(255,255,255,0.4);
          --text-faint: rgba(255,255,255,0.2);
          --nav-bg: rgba(10,10,10,0.92);
          --border: rgba(255,255,255,0.08);
          --dropdown-bg: #111;
          --dropdown-border: rgba(255,255,255,0.1);
          --hover: rgba(255,255,255,0.05);
        }
        body {
          background: var(--bg) !important;
          color: var(--text) !important;
          transition: background 0.2s, color 0.2s;
        }
        .desktop-nav { display: flex !important; }
        .mobile-nav { display: none !important; }
        @media (max-width: 640px) {
          .desktop-nav { display: none !important; }
          .mobile-nav { display: flex !important; }
        }
      `}</style>

      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 24px', borderBottom: '0.5px solid var(--border)',
        position: 'sticky', top: 0, background: 'var(--nav-bg)',
        backdropFilter: 'blur(12px)', zIndex: 100,
      }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <svg width="26" height="14" viewBox="0 0 4191.67 2190.15" fill="none">
            <path d="M767.96,1876.06c348.4-78.57,799.8-147.81,1327.87-147.54,525.29,27,974.51,69.24,1321.72,147.54,59.43-520.49,118.85-1040.98,178.28-1561.48-295.08,235.66-590.16,471.31-885.25,706.97-204.92-226.68-409.84-453.35-614.75-680.03-206.97,234.87-413.93,469.75-620.9,704.62-293.03-234.87-586.07-469.75-879.1-704.62,57.38,511.51,114.75,1023.03,172.13,1534.54Z" fill="#FFE500"/>
          </svg>
          <span style={{ background: 'linear-gradient(90deg, #FFE500, #FFC200)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: '15px', fontWeight: '700', letterSpacing: '-0.02em' }}>Nodable.</span>
        </Link>

        {/* Desktop nav */}
        <div className="desktop-nav" style={{ alignItems: 'center', gap: '4px' }}>
          <Link href="/feed" style={{ color: 'var(--text-muted)', fontSize: '13px', textDecoration: 'none', padding: '6px 12px', borderRadius: '8px' }}>Feed</Link>
          <Link href="/creators" style={{ color: 'var(--text-muted)', fontSize: '13px', textDecoration: 'none', padding: '6px 12px', borderRadius: '8px' }}>Creators</Link>
          <Link href="/tools" style={{ color: 'var(--text-muted)', fontSize: '13px', textDecoration: 'none', padding: '6px 12px', borderRadius: '8px' }}>Tools</Link>

          {user ? (
            <div ref={profileRef} style={{ position: 'relative', marginLeft: '8px' }}>
              <button onClick={() => setProfileOpen(v => !v)}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-card)', border: '0.5px solid var(--bg-card-border)', borderRadius: '10px', padding: '6px 12px 6px 6px', cursor: 'pointer', fontFamily: 'var(--font-inter), sans-serif' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(255,229,0,0.15)', border: '1.5px solid #FFE500', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                  {user.profile_picture_url
                    ? <img src={user.profile_picture_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <span style={{ color: '#FFE500', fontSize: '12px', fontWeight: '700' }}>{user.username[0].toUpperCase()}</span>
                  }
                </div>
                <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>@{user.username}</span>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ opacity: 0.4, transform: profileOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                  <path d="M2 4l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              {profileOpen && (
                <div style={{
                  position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                  background: 'var(--dropdown-bg)', border: '0.5px solid var(--dropdown-border)',
                  borderRadius: '14px', padding: '8px', minWidth: '200px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.4)', zIndex: 200,
                }}>
                  {/* User info */}
                  <div style={{ padding: '10px 12px 12px', borderBottom: '0.5px solid var(--border)', marginBottom: '6px' }}>
                    <div style={{ color: 'var(--text)', fontSize: '14px', fontWeight: '700', marginBottom: '2px' }}>@{user.username}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{user.email}</div>
                  </div>

                  {/* Links */}
                  {[
                    { label: 'View profile', href: `/u/${user.username}`, icon: '👤' },
                    { label: 'Edit profile', href: `/u/${user.username}/edit`, icon: '✏️' },
                    { label: 'Shot lists', href: `/u/${user.username}/shot-lists`, icon: '📋' },
                    { label: 'Tools', href: '/tools', icon: '🛠️' },
                  ].map(item => (
                    <Link key={item.href} href={item.href} onClick={() => setProfileOpen(false)}
                      style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 12px', borderRadius: '8px', textDecoration: 'none', color: 'var(--text-muted)', fontSize: '13px', background: 'transparent' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'var(--hover)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                      <span style={{ fontSize: '14px' }}>{item.icon}</span>
                      {item.label}
                    </Link>
                  ))}

                  {/* Divider */}
                  <div style={{ borderTop: '0.5px solid var(--border)', margin: '6px 0' }} />

                  {/* Dark/light toggle */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 12px', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)', fontSize: '13px' }}>
                      <span style={{ fontSize: '14px' }}>{theme === 'dark' ? '🌙' : '☀️'}</span>
                      {theme === 'dark' ? 'Dark mode' : 'Light mode'}
                    </div>
                    <button onClick={toggleTheme}
                      style={{ width: '36px', height: '20px', borderRadius: '10px', border: 'none', cursor: 'pointer', position: 'relative', background: theme === 'dark' ? '#FFE500' : 'rgba(255,255,255,0.15)', transition: 'background 0.2s', padding: 0, flexShrink: 0 }}>
                      <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: theme === 'dark' ? '#000' : '#fff', position: 'absolute', top: '3px', left: theme === 'dark' ? '19px' : '3px', transition: 'left 0.2s' }} />
                    </button>
                  </div>

                  {/* Divider */}
                  <div style={{ borderTop: '0.5px solid var(--border)', margin: '6px 0' }} />

                  {/* Log out */}
                  <button onClick={handleLogout}
                    style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '9px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-inter), sans-serif', color: 'rgba(255,80,80,0.7)', fontSize: '13px', background: 'transparent', textAlign: 'left' as const }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--hover)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    <span style={{ fontSize: '14px' }}>🚪</span>
                    Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" style={{ background: '#FFE500', color: '#000', fontSize: '13px', fontWeight: '700', padding: '8px 18px', borderRadius: '8px', textDecoration: 'none', marginLeft: '8px' }}>
              Log in
            </Link>
          )}
        </div>

        {/* Mobile nav */}
        <div className="mobile-nav" style={{ alignItems: 'center', gap: '10px' }}>
          {user ? (
            <div ref={profileRef} style={{ position: 'relative' }}>
              <button onClick={() => setProfileOpen(v => !v)}
                style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'rgba(255,229,0,0.15)', border: '1.5px solid #FFE500', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', cursor: 'pointer', padding: 0 }}>
                {user.profile_picture_url
                  ? <img src={user.profile_picture_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <span style={{ color: '#FFE500', fontSize: '13px', fontWeight: '700' }}>{user.username[0].toUpperCase()}</span>
                }
              </button>
              {profileOpen && (
                <div style={{
                  position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                  background: 'var(--dropdown-bg)', border: '0.5px solid var(--dropdown-border)',
                  borderRadius: '14px', padding: '8px', minWidth: '200px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.4)', zIndex: 200,
                }}>
                  <div style={{ padding: '10px 12px 12px', borderBottom: '0.5px solid var(--border)', marginBottom: '6px' }}>
                    <div style={{ color: 'var(--text)', fontSize: '14px', fontWeight: '700', marginBottom: '2px' }}>@{user.username}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{user.email}</div>
                  </div>
                  {[
                    { label: 'Feed', href: '/feed', icon: '📡' },
                    { label: 'Creators', href: '/creators', icon: '🎥' },
                    { label: 'Tools', href: '/tools', icon: '🛠️' },
                    { label: 'View profile', href: `/u/${user.username}`, icon: '👤' },
                    { label: 'Edit profile', href: `/u/${user.username}/edit`, icon: '✏️' },
                  ].map(item => (
                    <Link key={item.href} href={item.href} onClick={() => setProfileOpen(false)}
                      style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 12px', borderRadius: '8px', textDecoration: 'none', color: 'var(--text-muted)', fontSize: '13px' }}>
                      <span>{item.icon}</span>{item.label}
                    </Link>
                  ))}
                  <div style={{ borderTop: '0.5px solid var(--border)', margin: '6px 0' }} />
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)', fontSize: '13px' }}>
                      <span>{theme === 'dark' ? '🌙' : '☀️'}</span>
                      {theme === 'dark' ? 'Dark mode' : 'Light mode'}
                    </div>
                    <button onClick={toggleTheme}
                      style={{ width: '36px', height: '20px', borderRadius: '10px', border: 'none', cursor: 'pointer', position: 'relative', background: theme === 'dark' ? '#FFE500' : 'rgba(0,0,0,0.15)', transition: 'background 0.2s', padding: 0 }}>
                      <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: theme === 'dark' ? '#000' : '#fff', position: 'absolute', top: '3px', left: theme === 'dark' ? '19px' : '3px', transition: 'left 0.2s' }} />
                    </button>
                  </div>
                  <div style={{ borderTop: '0.5px solid var(--border)', margin: '6px 0' }} />
                  <button onClick={handleLogout}
                    style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '9px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-inter), sans-serif', color: 'rgba(255,80,80,0.7)', fontSize: '13px', background: 'transparent', textAlign: 'left' as const }}>
                    <span>🚪</span>Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" style={{ background: '#FFE500', color: '#000', fontSize: '12px', fontWeight: '700', padding: '8px 16px', borderRadius: '6px', textDecoration: 'none' }}>
              Log in
            </Link>
          )}

          {/* Hamburger for non-logged-in mobile */}
          {!user && (
            <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex', flexDirection: 'column' as const, gap: '5px' }}>
              <div style={{ width: '22px', height: '2px', background: 'var(--text-muted)', borderRadius: '2px', transition: 'all 0.2s', transform: menuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }} />
              <div style={{ width: '22px', height: '2px', background: 'var(--text-muted)', borderRadius: '2px', opacity: menuOpen ? 0 : 1, transition: 'all 0.2s' }} />
              <div style={{ width: '22px', height: '2px', background: 'var(--text-muted)', borderRadius: '2px', transition: 'all 0.2s', transform: menuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }} />
            </button>
          )}
        </div>

        {/* Mobile menu for logged-out */}
        {menuOpen && !user && (
          <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'var(--dropdown-bg)', borderBottom: '0.5px solid var(--border)', padding: '12px 20px', display: 'flex', flexDirection: 'column' as const, gap: '4px', zIndex: 99 }}>
            {[{ label: 'Feed', href: '/feed' }, { label: 'Creators', href: '/creators' }, { label: 'Tools', href: '/tools' }].map(item => (
              <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)}
                style={{ color: 'var(--text-muted)', fontSize: '15px', textDecoration: 'none', padding: '10px 0' }}>
                {item.label}
              </Link>
            ))}
            <div style={{ borderTop: '0.5px solid var(--border)', paddingTop: '12px', marginTop: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '12px' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>{theme === 'dark' ? '🌙 Dark mode' : '☀️ Light mode'}</span>
                <button onClick={toggleTheme}
                  style={{ width: '36px', height: '20px', borderRadius: '10px', border: 'none', cursor: 'pointer', position: 'relative', background: theme === 'dark' ? '#FFE500' : 'rgba(0,0,0,0.15)', padding: 0 }}>
                  <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: theme === 'dark' ? '#000' : '#fff', position: 'absolute', top: '3px', left: theme === 'dark' ? '19px' : '3px', transition: 'left 0.2s' }} />
                </button>
              </div>
              <Link href="/login" onClick={() => setMenuOpen(false)} style={{ display: 'block', background: '#FFE500', color: '#000', fontSize: '14px', fontWeight: '700', padding: '12px', borderRadius: '10px', textDecoration: 'none', textAlign: 'center' as const }}>
                Log in
              </Link>
            </div>
          </div>
        )}
      </nav>
    </>
  )
}
