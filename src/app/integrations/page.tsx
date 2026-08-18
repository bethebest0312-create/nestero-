import React from 'react'
import IntegrationCard from '@/components/IntegrationCard'

export default function IntegrationsPage() {
  return (
    <section className="py-6">
      <h2 className="text-2xl font-bold neon">Integrations</h2>
      <p className="mt-2 text-slate-300">Embed or preview external editors and studios (Replit, Canva, Kimi, Deepsee). Paste a public URL into a card to preview.</p>
      <div className="mt-6 grid grid-cols-2 gap-4">
        <IntegrationCard title="Replit" defaultUrl={undefined} />
        <IntegrationCard title="Canva" defaultUrl={undefined} />
        <IntegrationCard title="Kimi" defaultUrl={undefined} />
        <IntegrationCard title="Deepsee" defaultUrl={undefined} />
      </div>
    </section>
  )
}
