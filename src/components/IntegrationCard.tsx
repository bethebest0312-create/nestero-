'use client'

import React, { useState } from 'react'

export default function IntegrationCard({ title, defaultUrl }: { title: string; defaultUrl?: string }) {
  const [url, setUrl] = useState<string | undefined>(defaultUrl)
  const [input, setInput] = useState('')

  return (
    <div style={{border:'1px solid #e5e7eb',borderRadius:8,padding:12}}>
      <h3 style={{margin:0,fontSize:16}}>{title}</h3>
      <div style={{marginTop:8}}>
        <input
          placeholder="Paste embed URL (optional)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{width:'100%',padding:8,borderRadius:6,border:'1px solid #cbd5e1'}}
        />
        <div style={{marginTop:8,display:'flex',gap:8}}>
          <button onClick={() => setUrl(input || defaultUrl)} style={{padding:'8px 12px',borderRadius:6}}>Load</button>
          <button onClick={() => setUrl(undefined)} style={{padding:'8px 12px',borderRadius:6}}>Clear</button>
        </div>
      </div>
      <div style={{marginTop:12,background:'#f9fafb',height:220,display:'flex',alignItems:'center',justifyContent:'center',borderRadius:6,overflow:'hidden'}}>
        {url ? (
          // note: external sites may block embedding; this is a preview-friendly placeholder
          // eslint-disable-next-line jsx-a11y/iframe-has-title
          <iframe src={url} style={{width:'100%',height:'100%',border:0}} />
        ) : (
          <div style={{color:'#6b7280',padding:12,textAlign:'center'}}>
            <div style={{fontSize:14}}>{title} preview</div>
            <div style={{fontSize:12,marginTop:6}}>Paste a public embed URL above to preview here</div>
          </div>
        )}
      </div>
    </div>
  )
}
