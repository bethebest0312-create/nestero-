export default function HomePage() {
  return (
    <section className="py-16">
      <div className="max-w-3xl">
        <h1 className="text-4xl font-extrabold neon">Nestero — Create. Generate. Publish.</h1>
        <p className="mt-4 text-slate-300">A creator studio combining AI content, site builder, editors and integrations. Free API keys available for authenticated users.</p>
        <div className="mt-6 flex gap-3">
          <a href="/integrations" className="vibe-btn accent-gradient text-white px-4 py-2 rounded-md">Open Integrations</a>
          <a href="/dashboard" className="vibe-btn bg-white/5 text-white px-4 py-2 rounded-md">Go to Dashboard</a>
        </div>
      </div>
      <div className="mt-10 grid grid-cols-3 gap-4">
        <div className="vibe-panel p-4"> <div className="text-lg font-semibold">AI Studio</div><div className="text-sm text-slate-400 mt-2">Generate content, images and more</div></div>
        <div className="vibe-panel p-4"> <div className="text-lg font-semibold">Site Builder</div><div className="text-sm text-slate-400 mt-2">Drag & drop blocks, publish previews</div></div>
        <div className="vibe-panel p-4"> <div className="text-lg font-semibold">Media Studio</div><div className="text-sm text-slate-400 mt-2">Edit images and videos with external tools</div></div>
      </div>
    </section>
  )
}
