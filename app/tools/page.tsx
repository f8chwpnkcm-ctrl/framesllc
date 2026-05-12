import Link from 'next/link'
import Navbar from '../components/Navbar'

export default function Tools() {
  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(to bottom, #0a0a0a, #111827)', fontFamily: 'var(--font-inter), sans-serif' }}>
      <Navbar />
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '64px 24px' }}>
        <div style={{ marginBottom: '56px' }}>
          <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase' as const, marginBottom: '12px' }}>Creator tools</div>
          <h1 style={{ color: '#fff', fontSize: '40px', fontWeight: '700', letterSpacing: '-0.03em', margin: '0 0 12px', lineHeight: '1.1' }}>Everything you need<br />on set and off.</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '15px', lineHeight: '1.7', maxWidth: '440px', margin: 0 }}>Professional tools built for creators. An account is required to get started.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
          <Link href="/tools/shot-list" style={{ textDecoration: 'none' }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '32px', height: '100%' }}>
              <div style={{ width: '44px', height: '44px', background: 'rgba(255,229,0,0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <rect x="2" y="3" width="16" height="2" rx="1" fill="#FFE500"/>
                  <rect x="2" y="9" width="11" height="2" rx="1" fill="#FFE500"/>
                  <rect x="2" y="15" width="13" height="2" rx="1" fill="#FFE500"/>
                </svg>
              </div>
              <div style={{ color: '#fff', fontSize: '17px', fontWeight: '700', marginBottom: '10px' }}>Shot list creator</div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', lineHeight: '1.7', marginBottom: '24px' }}>Answer a few questions and get a professional AI-generated shot list tailored to your shoot.</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '11px', fontWeight: '600', color: '#FFE500', background: 'rgba(255,229,0,0.1)', padding: '4px 10px', borderRadius: '4px' }}>Included</span>
                <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '18px' }}>→</span>
              </div>
            </div>
          </Link>
          <Link href="/tools/invoice" style={{ textDecoration: 'none' }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '32px', height: '100%' }}>
              <div style={{ width: '44px', height: '44px', background: 'rgba(255,229,0,0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <rect x="3" y="1" width="14" height="18" rx="2" stroke="#FFE500" strokeWidth="1.5"/>
                  <rect x="7" y="6" width="6" height="1.5" rx="0.75" fill="#FFE500"/>
                  <rect x="7" y="9.5" width="4" height="1.5" rx="0.75" fill="#FFE500"/>
                  <rect x="7" y="13" width="5" height="1.5" rx="0.75" fill="#FFE500"/>
                </svg>
              </div>
              <div style={{ color: '#fff', fontSize: '17px', fontWeight: '700', marginBottom: '10px' }}>Invoice generator</div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', lineHeight: '1.7', marginBottom: '24px' }}>Describe the job and get a clean professional invoice with AI-generated line items. Print or save as PDF.</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '11px', fontWeight: '600', color: '#FFE500', background: 'rgba(255,229,0,0.1)', padding: '4px 10px', borderRadius: '4px' }}>Included</span>
                <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '18px' }}>→</span>
              </div>
            </div>
          </Link>
          <Link href="/tools/mood-board" style={{ textDecoration: 'none' }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '32px', height: '100%' }}>
              <div style={{ width: '44px', height: '44px', background: 'rgba(255,229,0,0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <circle cx="6" cy="6" r="3" fill="#FFE500" opacity="0.8"/>
                  <circle cx="14" cy="6" r="3" fill="#FFE500" opacity="0.5"/>
                  <circle cx="6" cy="14" r="3" fill="#FFE500" opacity="0.5"/>
                  <circle cx="14" cy="14" r="3" fill="#FFE500" opacity="0.9"/>
                </svg>
              </div>
              <div style={{ color: '#fff', fontSize: '17px', fontWeight: '700', marginBottom: '10px' }}>Mood board generator</div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', lineHeight: '1.7', marginBottom: '24px' }}>Describe a vibe and get a full creative brief — color palette, lighting, camera settings, and LUT style.</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '11px', fontWeight: '600', color: '#FFE500', background: 'rgba(255,229,0,0.1)', padding: '4px 10px', borderRadius: '4px' }}>Included</span>
                <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '18px' }}>→</span>
              </div>
            </div>
          </Link>
          <div style={{ background: 'rgba(255,255,255,0.015)', border: '0.5px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '32px', opacity: 0.5 }}>
            <div style={{ width: '44px', height: '44px', background: 'rgba(255,255,255,0.04)', borderRadius: '12px', marginBottom: '20px' }} />
            <div style={{ color: '#fff', fontSize: '17px', fontWeight: '700', marginBottom: '10px' }}>More coming soon</div>
            <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '14px', lineHeight: '1.7', marginBottom: '24px' }}>More tools are in the works.</div>
            <span style={{ fontSize: '11px', fontWeight: '600', color: 'rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.05)', padding: '4px 10px', borderRadius: '4px' }}>Soon</span>
          </div>
        </div>
      </div>
    </main>
  )
}
