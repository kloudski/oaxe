'use client';

import { FileTree } from './FileTree';
import type { GeneratedApp } from '@/lib/oaxe/types';

interface GeneratedAppViewProps {
  generatedApp: GeneratedApp;
}

export function GeneratedAppView({ generatedApp }: GeneratedAppViewProps) {
  const commands = [
    `cd ${generatedApp.path}`,
    'pnpm install',
    'pnpm dev',
  ];

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-zinc-900 rounded-lg border border-zinc-800">
          <div className="text-sm text-zinc-500 mb-1">Output Path</div>
          <div className="text-zinc-200 font-mono text-sm">{generatedApp.path}</div>
        </div>
        <div className="p-4 bg-zinc-900 rounded-lg border border-zinc-800">
          <div className="text-sm text-zinc-500 mb-1">Files Generated</div>
          <div className="text-zinc-200 font-mono text-sm">{generatedApp.fileCount} files</div>
        </div>
      </div>

      {/* Quick Start */}
      <div className="p-4 bg-zinc-900 rounded-lg border border-zinc-800">
        <h3 className="text-sm font-medium text-zinc-300 mb-3">Quick Start</h3>
        <div className="space-y-2">
          {commands.map((cmd, i) => (
            <div
              key={i}
              className="flex items-center gap-2 p-2 bg-zinc-950 rounded font-mono text-sm"
            >
              <span className="text-zinc-500">$</span>
              <code className="text-emerald-400">{cmd}</code>
              <button
                onClick={() => navigator.clipboard.writeText(cmd)}
                className="ml-auto p-1 text-zinc-500 hover:text-zinc-300 transition-colors"
                title="Copy to clipboard"
              >
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
                    d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-zinc-500">
          Run these commands from the oaxe root directory to start your generated app.
        </p>
      </div>

      {/* File Tree */}
      <div className="p-4 bg-zinc-900 rounded-lg border border-zinc-800">
        <h3 className="text-sm font-medium text-zinc-300 mb-3">File Structure</h3>
        <div className="max-h-96 overflow-y-auto">
          <FileTree tree={generatedApp.fileTree} />
        </div>
      </div>

      {/* Notes */}
      <div className="p-4 bg-zinc-900/50 rounded-lg border border-zinc-800">
        <h3 className="text-sm font-medium text-zinc-400 mb-2">Notes</h3>
        <ul className="space-y-1 text-sm text-zinc-500">
          <li>- Generated app is a minimal scaffold with placeholder UI</li>
          <li>- API routes return stub JSON responses</li>
          <li>- Entity types are TypeScript-only (no database)</li>
          <li>- Customize the generated files to match your requirements</li>
        </ul>
      </div>
    </div>
  );
}
