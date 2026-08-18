'use client'

import React, { useState } from 'react'

export default function IntegrationCard({ title, defaultUrl }: { title: string; defaultUrl?: string }) {
  const [url, setUrl] = useState<string | undefined>(defaultUrl)
  const [input, setInput] = useState('')

  return (
    <div className="vibe-panel p-4 relative">
      <div className="flex items-start justify-between">
        <h3 className="text-sm font-semibold">{title}</h3>
        <div className="text-xs text-slate-400">live</div>
      </div>
      <div className="mt-3">
        <input
          placeholder="Paste embed URL (optional)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full px-3 py-2 rounded-md bg-white/5 border border-white/6 text-sm"
        />
        <div className="mt-3 flex gap-2">
          <button onClick={() => setUrl(input || defaultUrl)} className="vibe-btn bg-[#0ea5a3] text-black px-3 py-2 rounded-md">Load</button>
          <button onClick={() => setUrl(undefined)} className="vibe-btn bg-white/5 text-white px-3 py-2 rounded-md">Clear</button>
        </div>
      </div>
      <div className="mt-4 h-56 rounded-md overflow-hidden bg-black/30 flex items-center justify-center">
        {url ? (
          // note: external sites may block embedding; this is a preview-friendly placeholder
          // eslint-disable-next-line jsx-a11y/iframe-has-title
          <iframe src={url} className="w-full h-full border-0" />
        ) : (
          <div className="text-slate-400 text-center p-4">
            <div className="text-sm">{title} preview</div>
            <div className="text-xs mt-2">Paste a public embed URL above to preview here</div>
          </div>
        )}
      </div>
    </div>
  )
}
