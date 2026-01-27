import Link from 'next/link';

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <div className="text-center space-y-6">
        <h1 className="text-5xl font-bold tracking-tight">
          <span className="text-oaxe-500">O</span>axe
        </h1>
        <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
          Product Replication, Invention, Branding, and Evolution Engine
        </p>
        <p className="text-zinc-500 max-w-xl mx-auto">
          Generate production-grade software products from a single prompt.
          Replicate existing products, invent new categories, and evolve through milestones.
        </p>
        <div className="pt-8">
          <Link
            href="/run"
            className="inline-flex items-center gap-2 px-6 py-3 bg-oaxe-500 text-white font-medium rounded-lg hover:bg-oaxe-600 transition-colors"
          >
            Start a Run
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Link>
        </div>
      </div>

      <div className="mt-24 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="p-6 bg-zinc-900/50 rounded-lg border border-zinc-800">
          <h3 className="text-lg font-medium text-white mb-2">Product Cloning</h3>
          <p className="text-sm text-zinc-400">
            Infer full feature sets from product names. Generate faithful replicas
            with architecture, schemas, and UI flows.
          </p>
        </div>
        <div className="p-6 bg-zinc-900/50 rounded-lg border border-zinc-800">
          <h3 className="text-lg font-medium text-white mb-2">Brand Identity</h3>
          <p className="text-sm text-zinc-400">
            Generate ownable visual identities, verbal tone, and Brand DNA that
            compounds over time.
          </p>
        </div>
        <div className="p-6 bg-zinc-900/50 rounded-lg border border-zinc-800">
          <h3 className="text-lg font-medium text-white mb-2">Product Evolution</h3>
          <p className="text-sm text-zinc-400">
            Generate v1 to v3 roadmaps with feature progression, architecture
            scaling, and monetization paths.
          </p>
        </div>
      </div>
    </div>
  );
}
