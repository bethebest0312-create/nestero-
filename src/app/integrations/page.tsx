import React from 'react'
import IntegrationCard from '@/components/IntegrationCard'

export default function IntegrationsPage() {
  return (
    <main style={{padding:24}}>
      <h1>Integrations</h1>
      <p>Embed or preview external editors and studios (Replit, Canva, Kimi, Deepsee). Paste a public URL into a card to preview.</p>
      <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:16,marginTop:16}}>
        <IntegrationCard title="Replit" defaultUrl={undefined} />
        <IntegrationCard title="Canva" defaultUrl={undefined} />
        <IntegrationCard title="Kimi" defaultUrl={undefined} />
        <IntegrationCard title="Deepsee" defaultUrl={undefined} />
      </div>
    </main>
  )
}
