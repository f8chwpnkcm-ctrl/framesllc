'use client'

import { useEffect, useState, useRef } from 'react'

const STEPS = ['client', 'job', 'rate', 'extras', 'payment']

export default function InvoicePage() {
  const [user, setUser] = useState<any>(null)
  const [stepIndex, setStepIndex] = useState(0)
  const [mode, setMode] = useState<'form' | 'generating' | 'result'>('form')
  const [savedInvoices, setSavedInvoices] = useState<any[]>([])
  const [invoice, setInvoice] = useState<any>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [taxRate, setTaxRate] = useState(0)
  const [form, setForm] = useState({
    client_name: '',
    client_email: '',
    job_description: '',
    media_type: '',
    event_type: '',
    rate_type: 'flat',
    rate_amount: '',
    extras: '',
    due_date: '',
    payment_notes: '',
  })

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.json()).then(d => {
      setUser(d.user)
      if (d.user) {
        fetch('/api/invoices').then(r => r.json()).then(data => {
          if (data.invoices) setSavedInvoices(data.invoices)
        })
      }
    })
  }, [])

  const update = (key: string, value: string) => setForm(f => ({ ...f, [key]: value }))

  const canAdvance = () => {
    if (STEPS[stepIndex] === 'client') return !!form.client_name
    if (STEPS[stepIndex] === 'job') return !!form.job_description
    if (STEPS[stepIndex] === 'rate') return !!form.rate_amount
    return true
  }

  const generateInvoiceNumber = () => {
    const date = new Date()
    return `INV-${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}-${Math.floor(Math.random() * 900 + 100)}`
  }

  const handleGenerate = async () => {
    setMode('generating')
    try {
      const res = await fetch('/api/generate-invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          job_description: form.job_description,
          rate_type: form.rate_type,
          rate_amount: form.rate_amount,
          extras: form.extras,
          media_type: form.media_type,
          event_type: form.event_type,
        })
      })
      const data = await res.json()
      if (!data.line_items) throw new Error('No line items')

      const subtotal = data.line_items.reduce((sum: number, item: any) => sum + item.amount, 0)
      const tax = subtotal * (taxRate / 100)
      const total = subtotal + tax

      setInvoice({
        invoice_number: generateInvoiceNumber(),
        client_name: form.client_name,
        client_email: form.client_email,
        job_description: form.job_description,
        line_items: data.line_items,
        subtotal,
        tax_rate: taxRate,
        total,
        due_date: form.due_date,
        payment_notes: form.payment_notes,
        created_at: new Date().toISOString(),
      })
      setMode('result')
      setSaved(false)
    } catch {
      setMode('form')
      alert('Something went wrong. Try again.')
    }
  }

  const handleSave = async () => {
    if (!user || !invoice) return
    setSaving(true)
    const res = await fetch('/api/invoices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invoice)
    })
    if (res.ok) {
      setSaved(true)
      const data = await res.json()
      setSavedInvoices(prev => [data.invoice, ...prev])
    }
    setSaving(false)
  }

  const handlePrint = () => window.print()

  const inputStyle = {
    width: '100%', background: 'rgba(255,255,255,0.06)', border: '0.5px solid rgba(255,255,255,0.12)',
    borderRadius: '10px', padding: '14px 16px', fontSize: '15px', color: '#fff', outline: 'none',
    fontFamily: 'var(--font-inter), sans-serif', boxSizing: 'border-box' as const,
  }

  const progress = (stepIndex / STEPS.length) * 100

  const mediaTypes = ['Photo', 'Video', 'Both']
  const eventTypes = ['Wedding', 'Sports', 'Concert', 'Corporate', 'Birthday', 'Graduation', 'Fashion', 'Real Estate', 'Documentary', 'Other']
  const dueDates = ['Due on receipt', 'Net 7', 'Net 14', 'Net 30', 'Net 60']

  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(to bottom, #0a0a0a, #111827)', fontFamily: 'var(--font-inter), sans-serif' }}>
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 40px', borderBottom: '0.5px solid rgba(255,255,255,0.08)', position: 'sticky', top: 0, background: 'rgba(10,10,10,0.85)', backdropFilter: 'blur(12px)', zIndex: 100 }} className="no-print">
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <svg width="26" height="14" viewBox="0 0 4191.67 2190.15" fill="none">
            <path d="M767.96,1876.06c348.4-78.57,799.8-147.81,1327.87-147.54,525.29,27,974.51,69.24,1321.72,147.54,59.43-520.49,118.85-1040.98,178.28-1561.48-295.08,235.66-590.16,471.31-885.25,706.97-204.92-226.68-409.84-453.35-614.75-680.03-206.97,234.87-413.93,469.75-620.9,704.62-293.03-234.87-586.07-469.75-879.1-704.62,57.38,511.51,114.75,1023.03,172.13,1534.54Z" fill="#FFE500"/>
          </svg>
          <span style={{ background: 'linear-gradient(90deg, #FFE500, #FFC200)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: '15px', fontWeight: '700', letterSpacing: '-0.02em' }}>Nodable.</span>
        </a>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <a href="/tools" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', textDecoration: 'none' }}>← Tools</a>
          {user ? (
            <a href={`/u/${user.username}`} style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', textDecoration: 'none' }}>@{user.username}</a>
          ) : (
            <a href="/login" style={{ background: '#FFE500', color: '#000', fontSize: '12px', fontWeight: '700', padding: '8px 18px', borderRadius: '6px', textDecoration: 'none' }}>Log in</a>
          )}
        </div>
      </nav>

      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '60px 24px' }} className="no-print">

        {mode === 'form' && (
          <>
            <div style={{ marginBottom: '48px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px' }}>Step {stepIndex + 1} of {STEPS.length}</span>
                <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px' }}>{Math.round(progress)}%</span>
              </div>
              <div style={{ height: '3px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px' }}>
                <div style={{ height: '100%', background: 'linear-gradient(90deg, #FFE500, #FFC200)', borderRadius: '2px', width: `${progress}%`, transition: 'width 0.3s ease' }} />
              </div>
            </div>

            {STEPS[stepIndex] === 'client' && (
              <div>
                <h2 style={{ color: '#fff', fontSize: '28px', fontWeight: '700', letterSpacing: '-0.02em', margin: '0 0 8px' }}>Who is this invoice for?</h2>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '15px', margin: '0 0 40px' }}>Enter your client's details.</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div>
                    <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', fontWeight: '600', letterSpacing: '0.04em', textTransform: 'uppercase' as const, marginBottom: '8px', display: 'block' }}>Client name *</label>
                    <input style={inputStyle} type="text" placeholder="John Smith or Acme Corp" value={form.client_name} onChange={e => update('client_name', e.target.value)} autoFocus />
                  </div>
                  <div>
                    <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', fontWeight: '600', letterSpacing: '0.04em', textTransform: 'uppercase' as const, marginBottom: '8px', display: 'block' }}>Client email</label>
                    <input style={inputStyle} type="email" placeholder="client@email.com" value={form.client_email} onChange={e => update('client_email', e.target.value)} />
                  </div>
                </div>
              </div>
            )}

            {STEPS[stepIndex] === 'job' && (
              <div>
                <h2 style={{ color: '#fff', fontSize: '28px', fontWeight: '700', letterSpacing: '-0.02em', margin: '0 0 8px' }}>What did you shoot?</h2>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '15px', margin: '0 0 40px' }}>Describe the job — the AI will turn this into invoice line items.</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' as const }}>
                    {mediaTypes.map(t => (
                      <button key={t} onClick={() => update('media_type', t.toLowerCase())}
                        style={{ padding: '8px 16px', borderRadius: '8px', border: `0.5px solid ${form.media_type === t.toLowerCase() ? '#FFE500' : 'rgba(255,255,255,0.12)'}`, background: form.media_type === t.toLowerCase() ? 'rgba(255,229,0,0.1)' : 'transparent', color: form.media_type === t.toLowerCase() ? '#FFE500' : 'rgba(255,255,255,0.5)', fontSize: '13px', cursor: 'pointer', fontFamily: 'var(--font-inter), sans-serif' }}>
                        {t}
                      </button>
                    ))}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    {eventTypes.map(e => (
                      <button key={e} onClick={() => update('event_type', e.toLowerCase())}
                        style={{ padding: '10px 16px', borderRadius: '8px', border: `0.5px solid ${form.event_type === e.toLowerCase() ? '#FFE500' : 'rgba(255,255,255,0.08)'}`, background: form.event_type === e.toLowerCase() ? 'rgba(255,229,0,0.06)' : 'rgba(255,255,255,0.02)', color: form.event_type === e.toLowerCase() ? '#FFE500' : 'rgba(255,255,255,0.5)', fontSize: '13px', cursor: 'pointer', fontFamily: 'var(--font-inter), sans-serif', textAlign: 'left' as const }}>
                        {e}
                      </button>
                    ))}
                  </div>
                  <div>
                    <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', fontWeight: '600', letterSpacing: '0.04em', textTransform: 'uppercase' as const, marginBottom: '8px', display: 'block' }}>Describe the job *</label>
                    <textarea style={{ ...inputStyle, resize: 'none', height: '120px', lineHeight: '1.6' }}
                      placeholder="e.g. 4 hour wedding coverage at The Lace Factory, New London CT. Shot ceremony and reception. Delivered 600 edited photos within 2 weeks."
                      value={form.job_description} onChange={e => update('job_description', e.target.value)} />
                  </div>
                </div>
              </div>
            )}

            {STEPS[stepIndex] === 'rate' && (
              <div>
                <h2 style={{ color: '#fff', fontSize: '28px', fontWeight: '700', letterSpacing: '-0.02em', margin: '0 0 8px' }}>What's your rate?</h2>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '15px', margin: '0 0 40px' }}>This becomes the base line item on your invoice.</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {[{ value: 'flat', label: 'Flat rate' }, { value: 'hourly', label: 'Hourly' }].map(t => (
                      <button key={t.value} onClick={() => update('rate_type', t.value)}
                        style={{ flex: 1, padding: '12px', borderRadius: '10px', border: `1.5px solid ${form.rate_type === t.value ? '#FFE500' : 'rgba(255,255,255,0.08)'}`, background: form.rate_type === t.value ? 'rgba(255,229,0,0.06)' : 'rgba(255,255,255,0.02)', color: form.rate_type === t.value ? '#FFE500' : 'rgba(255,255,255,0.5)', fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: 'var(--font-inter), sans-serif' }}>
                        {t.label}
                      </button>
                    ))}
                  </div>
                  <div>
                    <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', fontWeight: '600', letterSpacing: '0.04em', textTransform: 'uppercase' as const, marginBottom: '8px', display: 'block' }}>
                      {form.rate_type === 'hourly' ? 'Hourly rate ($)' : 'Total amount ($)'}
                    </label>
                    <input style={inputStyle} type="number" placeholder="500" value={form.rate_amount} onChange={e => update('rate_amount', e.target.value)} />
                  </div>
                  <div>
                    <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', fontWeight: '600', letterSpacing: '0.04em', textTransform: 'uppercase' as const, marginBottom: '8px', display: 'block' }}>Tax rate (%) — optional</label>
                    <input style={inputStyle} type="number" placeholder="0" value={taxRate || ''} onChange={e => setTaxRate(parseFloat(e.target.value) || 0)} />
                  </div>
                </div>
              </div>
            )}

            {STEPS[stepIndex] === 'extras' && (
              <div>
                <h2 style={{ color: '#fff', fontSize: '28px', fontWeight: '700', letterSpacing: '-0.02em', margin: '0 0 8px' }}>Any extras to add?</h2>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '15px', margin: '0 0 40px' }}>Travel, editing, equipment rental, rush fees — anything else to bill for.</p>
                <textarea style={{ ...inputStyle, resize: 'none', height: '140px', lineHeight: '1.6' }}
                  placeholder="e.g. 45 min travel each way, 2 hours of editing, drone rental $150, rush delivery fee"
                  value={form.extras} onChange={e => update('extras', e.target.value)} />
                <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: '12px', marginTop: '8px' }}>Optional — skip if nothing extra to add.</div>
              </div>
            )}

            {STEPS[stepIndex] === 'payment' && (
              <div>
                <h2 style={{ color: '#fff', fontSize: '28px', fontWeight: '700', letterSpacing: '-0.02em', margin: '0 0 8px' }}>Payment details</h2>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '15px', margin: '0 0 40px' }}>When is payment due and how should the client pay?</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div>
                    <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', fontWeight: '600', letterSpacing: '0.04em', textTransform: 'uppercase' as const, marginBottom: '8px', display: 'block' }}>Due date</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
                      {dueDates.map(d => (
                        <button key={d} onClick={() => update('due_date', d)}
                          style={{ padding: '12px 16px', borderRadius: '10px', border: `1.5px solid ${form.due_date === d ? '#FFE500' : 'rgba(255,255,255,0.08)'}`, background: form.due_date === d ? 'rgba(255,229,0,0.06)' : 'rgba(255,255,255,0.02)', color: form.due_date === d ? '#FFE500' : 'rgba(255,255,255,0.5)', fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: 'var(--font-inter), sans-serif' }}>
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', fontWeight: '600', letterSpacing: '0.04em', textTransform: 'uppercase' as const, marginBottom: '8px', display: 'block' }}>Payment instructions</label>
                    <textarea style={{ ...inputStyle, resize: 'none', height: '100px', lineHeight: '1.6' }}
                      placeholder="e.g. Venmo @framesbymatt, PayPal framesbymatt@gmail.com, or check payable to Frames LLC"
                      value={form.payment_notes} onChange={e => update('payment_notes', e.target.value)} />
                  </div>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px', marginTop: '40px' }}>
              {stepIndex > 0 && (
                <button onClick={() => setStepIndex(i => i - 1)}
                  style={{ padding: '14px 24px', borderRadius: '10px', border: '0.5px solid rgba(255,255,255,0.12)', background: 'transparent', color: 'rgba(255,255,255,0.5)', fontSize: '14px', cursor: 'pointer', fontFamily: 'var(--font-inter), sans-serif' }}>
                  ← Back
                </button>
              )}
              {stepIndex < STEPS.length - 1 ? (
                <button onClick={() => setStepIndex(i => i + 1)} disabled={!canAdvance()}
                  style={{ flex: 1, padding: '14px', borderRadius: '10px', border: 'none', background: canAdvance() ? '#FFE500' : 'rgba(255,255,255,0.08)', color: canAdvance() ? '#000' : 'rgba(255,255,255,0.3)', fontSize: '15px', fontWeight: '700', cursor: canAdvance() ? 'pointer' : 'default', fontFamily: 'var(--font-inter), sans-serif' }}>
                  Continue →
                </button>
              ) : (
                <button onClick={handleGenerate}
                  style={{ flex: 1, padding: '14px', borderRadius: '10px', border: 'none', background: '#FFE500', color: '#000', fontSize: '15px', fontWeight: '700', cursor: 'pointer', fontFamily: 'var(--font-inter), sans-serif' }}>
                  Generate invoice ✦
                </button>
              )}
            </div>

            {user && savedInvoices.length > 0 && stepIndex === 0 && (
              <div style={{ marginTop: '64px', paddingTop: '48px', borderTop: '0.5px solid rgba(255,255,255,0.08)' }}>
                <h2 style={{ color: '#fff', fontSize: '18px', fontWeight: '700', margin: '0 0 20px' }}>Saved invoices</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {savedInvoices.map((inv: any) => (
                    <div key={inv.id} onClick={() => { setInvoice(inv); setTaxRate(inv.tax_rate || 0); setMode('result'); setSaved(true) }}
                      style={{ background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                      <div>
                        <div style={{ color: '#fff', fontSize: '14px', fontWeight: '700', marginBottom: '4px' }}>{inv.invoice_number} — {inv.client_name}</div>
                        <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px' }}>${inv.total?.toFixed(2)} · {new Date(inv.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                      </div>
                      <span style={{ color: 'rgba(255,255,255,0.2)' }}>→</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {mode === 'generating' && (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ width: '48px', height: '48px', border: '3px solid rgba(255,229,0,0.2)', borderTop: '3px solid #FFE500', borderRadius: '50%', margin: '0 auto 24px', animation: 'spin 1s linear infinite' }} />
            <div style={{ color: '#fff', fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}>Building your invoice...</div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>This takes a few seconds</div>
            <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
          </div>
        )}
      </div>

      {mode === 'result' && invoice && (
        <div>
          {/* Action bar */}
          <div className="no-print" style={{ maxWidth: '760px', margin: '0 auto', padding: '0 24px 24px', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button onClick={() => { setMode('form'); setStepIndex(0); setSaved(false) }}
              style={{ padding: '10px 18px', borderRadius: '8px', border: '0.5px solid rgba(255,255,255,0.12)', background: 'transparent', color: 'rgba(255,255,255,0.5)', fontSize: '13px', cursor: 'pointer', fontFamily: 'var(--font-inter), sans-serif' }}>
              New invoice
            </button>
            <button onClick={handlePrint}
              style={{ padding: '10px 18px', borderRadius: '8px', border: '0.5px solid rgba(255,255,255,0.12)', background: 'transparent', color: 'rgba(255,255,255,0.5)', fontSize: '13px', cursor: 'pointer', fontFamily: 'var(--font-inter), sans-serif' }}>
              🖨️ Print / Save PDF
            </button>
            {user ? (
              <button onClick={handleSave} disabled={saving || saved}
                style={{ padding: '10px 18px', borderRadius: '8px', border: saved ? '0.5px solid rgba(34,197,94,0.3)' : 'none', background: saved ? 'rgba(34,197,94,0.15)' : '#FFE500', color: saved ? '#22C55E' : '#000', fontSize: '13px', fontWeight: '700', cursor: saved ? 'default' : 'pointer', fontFamily: 'var(--font-inter), sans-serif' }}>
                {saving ? 'Saving...' : saved ? '✓ Saved' : 'Save to profile'}
              </button>
            ) : (
              <a href="/login" style={{ padding: '10px 18px', borderRadius: '8px', background: '#FFE500', color: '#000', fontSize: '13px', fontWeight: '700', textDecoration: 'none' }}>Log in to save</a>
            )}
          </div>

          {/* Invoice document */}
          <div id="invoice-doc" style={{ maxWidth: '760px', margin: '0 auto', padding: '0 24px 60px' }}>
            <div style={{ background: '#fff', borderRadius: '16px', padding: '60px', color: '#111' }} className="invoice-paper">

              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '48px' }}>
                <div>
                  <div style={{ fontSize: '28px', fontWeight: '800', letterSpacing: '-0.03em', color: '#000', marginBottom: '4px' }}>{user?.business_name || user?.real_name || `@${user?.username}` || 'Your Name'}</div>
                  {user?.email && <div style={{ color: '#666', fontSize: '13px' }}>{user.email}</div>}
                  {user?.phone && <div style={{ color: '#666', fontSize: '13px' }}>{user.phone}</div>}
                  {user?.address && <div style={{ color: '#666', fontSize: '13px' }}>{user.address}</div>}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '32px', fontWeight: '800', color: '#FFE500', letterSpacing: '-0.02em' }}>INVOICE</div>
                  <div style={{ color: '#999', fontSize: '13px', marginTop: '4px' }}>{invoice.invoice_number}</div>
                  <div style={{ color: '#999', fontSize: '13px' }}>{new Date(invoice.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
                  {invoice.due_date && <div style={{ color: '#333', fontSize: '13px', fontWeight: '600', marginTop: '4px' }}>Due: {invoice.due_date}</div>}
                </div>
              </div>

              {/* Bill to */}
              <div style={{ marginBottom: '40px' }}>
                <div style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: '#999', marginBottom: '8px' }}>Bill to</div>
                <div style={{ fontSize: '16px', fontWeight: '700', color: '#000' }}>{invoice.client_name}</div>
                {invoice.client_email && <div style={{ color: '#666', fontSize: '13px' }}>{invoice.client_email}</div>}
              </div>

              {/* Job description */}
              {invoice.job_description && (
                <div style={{ marginBottom: '32px', padding: '16px', background: '#f9f9f9', borderRadius: '8px' }}>
                  <div style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: '#999', marginBottom: '6px' }}>Project description</div>
                  <div style={{ color: '#444', fontSize: '13px', lineHeight: '1.6' }}>{invoice.job_description}</div>
                </div>
              )}

              {/* Line items */}
              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '32px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #000' }}>
                    <th style={{ textAlign: 'left', padding: '10px 0', fontSize: '11px', fontWeight: '700', letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: '#999' }}>Description</th>
                    <th style={{ textAlign: 'center', padding: '10px 0', fontSize: '11px', fontWeight: '700', letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: '#999', width: '80px' }}>Qty</th>
                    <th style={{ textAlign: 'right', padding: '10px 0', fontSize: '11px', fontWeight: '700', letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: '#999', width: '100px' }}>Rate</th>
                    <th style={{ textAlign: 'right', padding: '10px 0', fontSize: '11px', fontWeight: '700', letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: '#999', width: '100px' }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.line_items?.map((item: any, i: number) => (
                    <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '14px 0', fontSize: '14px', color: '#333' }}>{item.description}</td>
                      <td style={{ padding: '14px 0', fontSize: '14px', color: '#333', textAlign: 'center' }}>{item.quantity}</td>
                      <td style={{ padding: '14px 0', fontSize: '14px', color: '#333', textAlign: 'right' }}>${item.rate.toFixed(2)}</td>
                      <td style={{ padding: '14px 0', fontSize: '14px', color: '#333', textAlign: 'right', fontWeight: '600' }}>${item.amount.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totals */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '40px' }}>
                <div style={{ width: '240px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee' }}>
                    <span style={{ color: '#666', fontSize: '13px' }}>Subtotal</span>
                    <span style={{ color: '#333', fontSize: '13px', fontWeight: '600' }}>${invoice.subtotal?.toFixed(2)}</span>
                  </div>
                  {invoice.tax_rate > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee' }}>
                      <span style={{ color: '#666', fontSize: '13px' }}>Tax ({invoice.tax_rate}%)</span>
                      <span style={{ color: '#333', fontSize: '13px', fontWeight: '600' }}>${(invoice.subtotal * invoice.tax_rate / 100).toFixed(2)}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderTop: '2px solid #000', marginTop: '4px' }}>
                    <span style={{ color: '#000', fontSize: '16px', fontWeight: '700' }}>Total</span>
                    <span style={{ color: '#000', fontSize: '20px', fontWeight: '800' }}>${invoice.total?.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Payment instructions */}
              {invoice.payment_notes && (
                <div style={{ borderTop: '1px solid #eee', paddingTop: '24px' }}>
                  <div style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: '#999', marginBottom: '8px' }}>Payment instructions</div>
                  <div style={{ color: '#444', fontSize: '13px', lineHeight: '1.6' }}>{invoice.payment_notes}</div>
                </div>
              )}

              {/* Footer */}
              <div style={{ marginTop: '48px', paddingTop: '24px', borderTop: '1px solid #eee', textAlign: 'center' }}>
                <div style={{ color: '#ccc', fontSize: '11px' }}>Generated with Nodable · trynodable.com</div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          .invoice-paper { box-shadow: none !important; border-radius: 0 !important; }
        }
      `}</style>
    </main>
  )
}
