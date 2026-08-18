'use client'

import React, { useState } from 'react'

export default function SubscribeForm() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [status, setStatus] = useState<'idle'|'loading'|'ok'|'error'>('idle')
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name })
      })
      if (res.ok) {
        setStatus('ok')
        setEmail('')
        setName('')
      } else {
        setStatus('error')
      }
    } catch (err) {
      setStatus('error')
    }
  }

  return (
    <form onSubmit={onSubmit} className="vibe-panel p-4 max-w-md" aria-label="Subscribe to newsletter">
      <div className="text-lg font-semibold neon">Join our newsletter</div>
      <div className="text-sm text-slate-300 mt-2">Get updates, announcements, and offers.</div>
      <div className="mt-3 grid gap-2">
        <input aria-label="Name" value={name} onChange={(e)=>setName(e.target.value)} placeholder="Your name (optional)" className="px-3 py-2 rounded-md bg-white/5 border border-white/6" />
        <input aria-label="Email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email address" required type="email" className="px-3 py-2 rounded-md bg-white/5 border border-white/6" />
        <div className="mt-2 flex items-center gap-2">
          <button type="submit" className="vibe-btn accent-gradient text-white px-4 py-2 rounded-md" disabled={status==='loading'}>{status==='loading' ? 'Sending...' : 'Subscribe'}</button>
          {status==='ok' && <div className="text-sm text-green-300">Subscribed! Check your inbox.</div>}
          {status==='error' && <div className="text-sm text-rose-300">Error. Try again.</div>}
        </div>
      </div>
    </form>
  )
}
