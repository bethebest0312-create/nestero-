import React from 'react'
import Button from '@/components/Button'
import Card from '@/components/Card'
import CanvasBackground from '@/components/CanvasBackground'

export default function DesignPage() {
  return (
    <section className="py-10">
      <CanvasBackground />
      <h2 className="text-2xl font-bold neon">Design System</h2>
      <p className="mt-2 text-slate-300">Buttons, cards, and typography used across the product.</p>
      <div className="mt-6 grid grid-cols-3 gap-4">
        <Card>
          <div className="mb-4">Buttons</div>
          <div className="flex gap-2">
            <Button variant="primary">Primary</Button>
            <Button variant="ghost">Ghost</Button>
          </div>
        </Card>
        <Card>
          <div className="mb-4">Cards</div>
          <Card className="p-3">Inner card example</Card>
        </Card>
        <Card>
          <div className="mb-4">Typography</div>
          <div className="text-xl font-semibold neon">Display headline</div>
          <div className="mt-2 text-slate-300">Body text / caption</div>
        </Card>
      </div>
    </section>
  )
}
