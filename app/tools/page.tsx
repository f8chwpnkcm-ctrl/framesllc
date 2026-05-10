import Navbar from '../components/Navbar'

export default function Tools() {
  return (
    <main style={{ background: '#0a0a0a', minHeight: '100vh' }}>
      <Navbar />

      <div style={{ padding: '64px 40px' }}>

        {/* Header */}
        <div style={{ marginBottom: '48px' }}>
          <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase' as const, marginBottom: '10px' }}>Creator tools</div>
          <h1 style={{ color: '#fff', fontSize: '40px', fontWeight: '700', letterSpacing: '-0.03em', margin: '0 0 12px' }}>Everything you need<br />on set and off.</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '15px', lineHeight: '1.7', maxWidth: '440px', margin: 0 }}>Free tools built specifically for creatives. No account required to get started.</p>
        </div>

        {/* Tools grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>

          {/* Shot list */}
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '28px', cursor: 'pointer' }}>
            <div style={{ width: '40px', height: '40px', background: 'rgba(255,229,0,0.1)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <rect x="2" y="2" width="14" height="2" rx="1" fill="#FFE500"/>
                <rect x="2" y="7" width="10" height="2" rx="1" fill="#FFE500"/>
                <rect x="2" y="12" width="12" height="2" rx="1" fill="#FFE500"/>
              </svg>
            </div>
            <div style={{ color: '#fff', fontSize: '16px', fontWeight: '700', marginBottom: '8px' }}>Shot list creator</div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', lineHeight: '1.6', marginBottom: '20px' }}>Pick your shoot type, and get a ready-to-use shot list built for your day.</div>
            <span style={{ fontSize: '11px', fontWeight: '600', color: '#FFE500', background: 'rgba(255,229,0,0.1)', padding: '4px 10px', borderRadius: '4px' }}>Free</span>
          </div>

          {/* Invoice */}
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '28px', cursor: 'pointer' }}>
            <div style={{ width: '40px', height: '40px', background: 'rgba(255,229,0,0.1)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <rect x="3" y="1" width="12" height="16" rx="2" stroke="#FFE500" strokeWidth="1.5"/>
                <rect x="6" y="5" width="6" height="1.5" rx="0.75" fill="#FFE500"/>
                <rect x="6" y="8" width="4" height="1.5" rx="0.75" fill="#FFE500"/>
                <rect x="6" y="11" width="5" height="1.5" rx="0.75" fill="#FFE500"/>
              </svg>
            </div>
            <div style={{ color: '#fff', fontSize: '16px', fontWeight: '700', marginBottom: '8px' }}>Invoice generator</div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', lineHeight: '1.6', marginBottom: '20px' }}>Create clean, professional invoices for clients in seconds. Fill in your details and download as a PDF.</div>
            <span style={{ fontSize: '11px', fontWeight: '600', color: '#FFE500', background: 'rgba(255,229,0,0.1)', padding: '4px 10px', borderRadius: '4px' }}>Free</span>
          </div>

          {/* Coming soon */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '0.5px solid rgba(255,255,255,0.05)', borderRadius: '14px', padding: '28px', opacity: 0.5 }}>
            <div style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', marginBottom: '18px' }}></div>
            <div style={{ color: '#fff', fontSize: '16px', fontWeight: '700', marginBottom: '8px' }}>More coming soon</div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', lineHeight: '1.6', marginBottom: '20px' }}>More tools are in the works. Join the waitlist to get notified when they drop.</div>
            <span style={{ fontSize: '11px', fontWeight: '600', color: 'rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.05)', padding: '4px 10px', borderRadius: '4px' }}>Soon</span>
          </div>

        </div>
      </div>
    </main>
  )
}