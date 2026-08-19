'use client'

import React, { useEffect, useState } from 'react'

export default function SitesPage() {
  const [sites, setSites] = useState<any[]>([])
  useEffect(() => {
    fetch('/api/website').then(r => r.json()).then(d => setSites(d?.sites || d || []))
  }, [])
  return (
    <div>
      <h2 className="text-2xl font-bold neon">Sites</h2>
      <p className="text-slate-400 mt-2">Your created sites and preview links.</p>
      <div className="mt-4 grid gap-3">
        {sites.length === 0 && <div className="vibe-panel p-4">No sites yet. Create one in the Website editor.</div>}
        {sites.map((s: any) => (
          <div key={s.slug || s} className="vibe-panel p-4 flex justify-between items-center">
            <div>
              <div className="font-semibold">{s.title || s.slug || s}</div>
              <div className="text-sm text-slate-400">{s.updatedAt ? `Updated ${new Date(s.updatedAt).toLocaleString()}` : ''}</div>
            </div>
            <div className="flex gap-2">
              <a className="vibe-btn bg-white/5 text-white" href={`/api/website?path=${encodeURIComponent(s.slug || s)}`} target="_blank">Preview</a>
              <a className="vibe-btn accent-gradient text-white" href={`/website/editor?path=${encodeURIComponent(s.slug || s)}`}>Edit</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
