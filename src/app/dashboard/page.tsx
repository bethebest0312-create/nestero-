export default function DashboardPage() {
  return (
    <div className="py-6">
      <h2 className="text-2xl font-bold neon">Dashboard</h2>
      <p className="mt-2 text-slate-300">Welcome to your workspace. Use the left navigation to access builders, analytics, and team settings.</p>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="vibe-panel p-4"> <div className="font-semibold">Recent Projects</div></div>
        <div className="vibe-panel p-4"> <div className="font-semibold">API Keys</div></div>
      </div>
    </div>
  )
}
