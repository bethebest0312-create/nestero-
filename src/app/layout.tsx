import './globals.css'
import React from 'react'
import { ToastProvider } from '@/components/ToastProvider'

export const metadata = {
  title: 'Nestero',
  description: 'Scaffolded app'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-[#071025] via-[#041226] to-[#02101a]">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <header className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-md accent-gradient flex items-center justify-center text-sm font-bold">N</div>
              <div>
                <div className="text-lg font-bold neon">Nestero</div>
                <div className="text-xs text-slate-400">Creator studio & AI toolkit</div>
              </div>
            </div>
            <nav className="flex items-center gap-3">
              <a href="/integrations" className="vibe-btn bg-white/5 text-white/90 px-3 py-2 rounded-md">Integrations</a>
              <a href="/dashboard" className="vibe-btn accent-gradient text-white px-3 py-2 rounded-md">Dashboard</a>
            </nav>
          </header>
          <ToastProvider>
            <main>
              {children}
            </main>
          </ToastProvider>
        </div>
      </body>
    </html>
  )
}
