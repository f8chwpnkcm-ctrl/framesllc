'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div style={{ color: '#fff', padding: '40px', background: '#000', minHeight: '100vh' }}>
      <h2>Something went wrong</h2>
      <p style={{ color: 'rgba(255,255,255,0.5)' }}>{error.message}</p>
      <button onClick={reset} style={{ background: '#FFE500', color: '#000', padding: '10px 20px', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
        Try again
      </button>
    </div>
  )
}