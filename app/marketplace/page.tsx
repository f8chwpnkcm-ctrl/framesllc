import Navbar from '../components/Navbar'

export default function Marketplace() {
  return (
    <main style={{ minHeight: '100vh', fontFamily: 'var(--font-inter), sans-serif' }}>
      <Navbar />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 57px)', textAlign: 'center', padding: '40px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,229,0,0.1)', border: '0.5px solid rgba(255,229,0,0.25)', padding: '5px 12px', borderRadius: '20px', marginBottom: '24px' }}>
          <div style={{ width: '5px', height: '5px', background: '#FFE500', borderRadius: '50%' }}></div>
          <span style={{ fontSize: '11px', fontWeight: '600', color: '#FFE500' }}>Coming soon</span>
        </div>
        <h1 style={{ color: '#fff', fontSize: '48px', fontWeight: '700', letterSpacing: '-0.03em', lineHeight: '1.06', margin: '0 0 16px' }}>
          The marketplace<br />is almost here.
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '15px', lineHeight: '1.7', maxWidth: '400px', margin: '0 0 36px' }}>
          Verified LUTs from real creators are coming. Join the waitlist to get notified when we launch.
        </p>
        <div style={{ display: 'flex', gap: '12px' }}>
          <a href="/" style={{ background: '#FFE500', color: '#000', fontSize: '13px', fontWeight: '700', padding: '12px 24px', borderRadius: '8px', textDecoration: 'none' }}>
            Join the waitlist
          </a>
          <a href="/" style={{ background: 'transparent', color: 'rgba(255,255,255,0.5)', fontSize: '13px', fontWeight: '500', padding: '12px 24px', borderRadius: '8px', textDecoration: 'none', border: '0.5px solid rgba(255,255,255,0.15)' }}>
            Back to home
          </a>
        </div>
      </div>
    </main>
  )
}