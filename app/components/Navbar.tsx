'use client'

import Link from 'next/link'

export default function Navbar({ onJoinWaitlist }: { onJoinWaitlist?: () => void }) {
  return (
    <nav style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '18px 40px',
      borderBottom: '0.5px solid rgba(255,255,255,0.08)',
      position: 'sticky',
      top: 0,
      background: 'rgba(10,10,10,0.85)',
      backdropFilter: 'blur(12px)',
      zIndex: 100,
    }}>
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
        <svg width="26" height="14" viewBox="0 0 4191.67 2190.15" fill="none">
          <path d="M767.96,1876.06c348.4-78.57,799.8-147.81,1327.87-147.54,525.29,27,974.51,69.24,1321.72,147.54,59.43-520.49,118.85-1040.98,178.28-1561.48-295.08,235.66-590.16,471.31-885.25,706.97-204.92-226.68-409.84-453.35-614.75-680.03-206.97,234.87-413.93,469.75-620.9,704.62-293.03-234.87-586.07-469.75-879.1-704.62,57.38,511.51,114.75,1023.03,172.13,1534.54Z" fill="#FFE500"/>
        </svg>
        <span className="gradient-text" style={{ fontSize: '15px', fontWeight: '700', letterSpacing: '-0.02em' }}>Nodable.</span>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
        <Link href="/marketplace" className="nav-link" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px' }}>Marketplace</Link>
        <Link href="/creators" className="nav-link" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px' }}>Creators</Link>
        <Link href="/tools" className="nav-link" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px' }}>Tools</Link>
        <button
          onClick={onJoinWaitlist}
          className="btn-primary"
          style={{
            background: '#FFE500',
            color: '#000',
            fontSize: '12px',
            fontWeight: '700',
            padding: '8px 18px',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer',
          }}>
          Join waitlist
        </button>
      </div>
    </nav>
  )
}