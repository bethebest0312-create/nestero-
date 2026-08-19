'use client'

import React, { useState } from 'react'

export default function StudioPage() {
  const [prompt, setPrompt] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  async function onGenerate() {
    setLoading(true)
    try {
      const res = await fetch('/api/generate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt }) })
      const data = await res.json()
      setResult(data?.result?.text || JSON.stringify(data))
    } catch (e) {
      setResult('Generation failed: ' + String(e))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold neon">AI Studio</h2>
      <p className="text-slate-400 mt-2">Try a quick generation with the scaffolded engine or your OpenAI key.</p>
      <div className="mt-4">
        <textarea className="w-full p-3 rounded-md bg-white/5" rows={6} value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Write a prompt..." />
        <div className="mt-3 flex gap-3">
          <button className="vibe-btn accent-gradient text-white" onClick={onGenerate} disabled={loading}>{loading ? 'Generating…' : 'Generate'}</button>
          <button className="vibe-btn bg-white/5 text-white" onClick={() => { setPrompt(''); setResult('') }}>Clear</button>
        </div>
      </div>

      <div className="mt-6 vibe-panel p-4">
        <h3 className="font-semibold">Result</h3>
        <pre className="whitespace-pre-wrap text-sm mt-2">{result}</pre>
      </div>
    </div>
  )
}
