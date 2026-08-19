'use client'

import React, { useEffect, useState } from 'react'

export default function EditorPage({ searchParams }: { searchParams?: { path?: string } }) {
  const [html, setHtml] = useState('<h1>New site</h1>')
  const [pathKey, setPathKey] = useState(searchParams?.path || '')
  const [saved, setSaved] = useState<string | null>(null)

  useEffect(() => {
    if (searchParams?.path) setPathKey(searchParams.path)
  }, [searchParams])

  async function onSave() {
    const res = await fetch('/api/website', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ path: pathKey || undefined, html }) })
    const data = await res.json()
    if (data?.ok) setSaved(data.path)
  }

  return (
    <div>
      <h2 className="text-2xl font-bold neon">Website Editor</h2>
      <p className="text-slate-400 mt-2">Edit raw HTML and save a preview to the local store or DB (if configured).</p>
      <div className="mt-4 grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-slate-400">Slug / path (optional)</label>
          <input className="w-full p-2 rounded-md bg-white/5" value={pathKey} onChange={(e)=>setPathKey(e.target.value)} placeholder="demo" />
          <textarea className="w-full mt-3 p-3 rounded-md bg-white/5" rows={12} value={html} onChange={(e)=>setHtml(e.target.value)} />
          <div className="mt-3 flex gap-3">
            <button className="vibe-btn accent-gradient text-white" onClick={onSave}>Save & Publish</button>
            <button className="vibe-btn bg-white/5 text-white" onClick={()=>{ setHtml('<h1>New site</h1>'); setSaved(null) }}>Reset</button>
          </div>
          {saved && <div className="mt-3 text-sm text-slate-300">Saved as: <strong>{saved}</strong> — Preview: <a href={`/api/website?path=${encodeURIComponent(saved)}`} className="underline">Open</a></div>}
        </div>
        <div>
          <div className="text-sm text-slate-400">Live Preview</div>
          <iframe title="preview" srcDoc={html} className="w-full h-[480px] mt-2 border border-white/5 rounded-md bg-white/2" />
        </div>
      </div>
    </div>
  )
}
