import SubscribeForm from '@/components/SubscribeForm'

export default function HomePage() {
  return (
    <section className="relative overflow-hidden py-16">
      <img src="/blob.svg" alt="blob" className="blob-bg" />
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-5xl font-extrabold neon">Nestero — Create. Generate. Publish.</h1>
            <p className="mt-4 text-slate-300 max-w-2xl">A creator studio combining AI content, site builder, media studios and team workflows. Free API keys for dev/testing.</p>
            <div className="mt-6 flex gap-3">
              <a href="/integrations" className="vibe-btn accent-gradient text-white">Open Integrations</a>
              <a href="/dashboard" className="vibe-btn bg-white/5 text-white">Go to Dashboard</a>
            </div>
          </div>
          <div className="hidden md:block p-6">
            <div className="w-56 h-56 vibe-panel flex items-center justify-center floaty">
              <div className="text-center">
                <div className="text-2xl font-bold neon">AI</div>
                <div className="text-sm text-slate-400 mt-1">Studio</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="vibe-panel p-6"> <div className="text-lg font-semibold">AI Studio</div><div className="text-sm text-slate-400 mt-2">Generate content, images and more</div></div>
          <div className="vibe-panel p-6"> <div className="text-lg font-semibold">Site Builder</div><div className="text-sm text-slate-400 mt-2">Drag & drop blocks, publish previews</div></div>
          <div className="vibe-panel p-6"> <div className="text-lg font-semibold">Media Studio</div><div className="text-sm text-slate-400 mt-2">Edit images and videos with external tools</div></div>
        </div>

        <div className="mt-12">
          <SubscribeForm />
        </div>
      </div>
    </section>
  )
}
