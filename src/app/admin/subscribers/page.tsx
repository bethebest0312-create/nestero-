'use client'

import React, { useEffect, useState } from 'react'

export default function AdminSubscribersPage() {
  const [subs, setSubs] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    load()
  }, [])
  async function load() {
    setLoading(true)
  const res = await fetch('/api/admin/subscribers')
    if (res.ok) {
      const j = await res.json()
      setSubs(j.subscribers || [])
    }
    setLoading(false)
  }

  return (
    <section className="py-6">
      <h2 className="text-2xl font-bold neon">Subscribers</h2>
      <div className="mt-4">
        <a className="vibe-btn bg-white/5 px-3 py-2 rounded-md" href="/api/admin/subscribers/export" target="_blank" rel="noreferrer">Export CSV</a>
      </div>
      <div className="mt-4 vibe-panel p-4">
        {loading && <div>Loading...</div>}
        {!loading && subs.length === 0 && <div className="text-slate-400">No subscribers yet.</div>}
        <ul className="mt-2">
          {subs.map(s => (
            <li key={s.id} className="py-2 border-b border-white/4 flex justify-between items-center">
              <div>
                <div className="font-semibold">{s.email}</div>
                <div className="text-xs text-slate-400">{s.name || ''}</div>
              </div>
              <div className="text-sm text-slate-300">{s.verified ? 'Verified' : 'Unverified'}</div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
