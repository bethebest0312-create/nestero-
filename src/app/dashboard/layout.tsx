import React from 'react'
import Link from 'next/link'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-[radial-gradient(ellipse_at_top_left,_var(--bg-1),_#02101a)]">
      <aside className="w-64 p-6 border-r border-white/5 flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full accent-gradient flex items-center justify-center text-white font-bold">N</div>
          <div>
            <div className="text-lg font-semibold neon">Nestero</div>
            <div className="text-xs text-slate-400">Creator Studio</div>
          </div>
        </div>
        <nav className="flex-1 flex flex-col gap-2">
          <Link href="/dashboard" className="vibe-panel p-2">Overview</Link>
          <Link href="/dashboard/sites" className="vibe-panel p-2">Sites</Link>
          <Link href="/dashboard/studio" className="vibe-panel p-2">AI Studio</Link>
          <Link href="/dashboard/media" className="vibe-panel p-2">Media Studio</Link>
          <Link href="/admin/subscribers" className="vibe-panel p-2">Subscribers</Link>
        </nav>
        <div>
          <a href="/settings" className="vibe-btn bg-white/5 text-white w-full text-center">Settings</a>
        </div>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  )
}
