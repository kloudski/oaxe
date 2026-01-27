'use client';

import { Tabs } from './Tabs';
import { JsonView } from './JsonView';
import { LogConsole } from './LogConsole';
import { GeneratedAppView } from './GeneratedAppView';
import type { Run } from '@/lib/oaxe/types';

interface RunViewerProps {
  run: Run;
}

export function RunViewer({ run }: RunViewerProps) {
  const tabs = [
    { id: 'spec', label: 'Spec' },
    { id: 'architecture', label: 'Architecture' },
    { id: 'brand', label: 'Brand' },
    { id: 'roadmap', label: 'Roadmap' },
    { id: 'generated', label: 'Generated App' },
    { id: 'logs', label: 'Logs' },
  ];

  const statusColors = {
    pending: 'bg-zinc-500',
    running: 'bg-yellow-500',
    completed: 'bg-emerald-500',
    error: 'bg-red-500',
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">
            {run.output?.appName || 'Generating...'}
          </h2>
          <p className="text-sm text-zinc-400 mt-1">
            {run.output?.elevatorPitch || run.directive}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${statusColors[run.status]} ${
              run.status === 'running' ? 'animate-pulse' : ''
            }`}
          />
          <span className="text-sm text-zinc-400 capitalize">{run.status}</span>
        </div>
      </div>

      {run.error && (
        <div className="p-4 bg-red-950/50 border border-red-900 rounded-lg text-red-300">
          {run.error}
        </div>
      )}

      <Tabs tabs={tabs}>
        {/* Spec Tab */}
        <div className="space-y-4">
          {run.output ? (
            <>
              <JsonView data={run.output.productSpec} title="Product Specification" />
              <JsonView data={run.output.entities} title="Entities" />
              <JsonView data={run.output.apis} title="APIs" />
              <JsonView data={run.output.pages} title="Pages" />
            </>
          ) : (
            <div className="text-zinc-500">Waiting for generation...</div>
          )}
        </div>

        {/* Architecture Tab */}
        <div>
          {run.output ? (
            <JsonView data={run.output.architecture} title="Architecture" />
          ) : (
            <div className="text-zinc-500">Waiting for generation...</div>
          )}
        </div>

        {/* Brand Tab */}
        <div className="space-y-4">
          {run.output ? (
            <>
              <JsonView data={run.output.brandDNA} title="Brand DNA" />
              <JsonView data={run.output.designTokens} title="Design Tokens" />
              <div>
                <h3 className="text-sm font-medium text-zinc-400 mb-2">Founder Tweets</h3>
                <div className="space-y-2">
                  {run.output.founderTweets.map((tweet, i) => (
                    <div
                      key={i}
                      className="p-4 bg-zinc-950 rounded-lg text-zinc-200 text-sm"
                    >
                      {tweet}
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="text-zinc-500">Waiting for generation...</div>
          )}
        </div>

        {/* Roadmap Tab */}
        <div>
          {run.output ? (
            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-4 bg-zinc-950 rounded-lg">
                <h4 className="text-sm font-medium text-oaxe-400 mb-2">v1</h4>
                <ul className="space-y-1">
                  {run.output.roadmap.v1.map((item, i) => (
                    <li key={i} className="text-sm text-zinc-300 flex gap-2">
                      <span className="text-zinc-600">-</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-4 bg-zinc-950 rounded-lg">
                <h4 className="text-sm font-medium text-oaxe-400 mb-2">v2</h4>
                <ul className="space-y-1">
                  {run.output.roadmap.v2.map((item, i) => (
                    <li key={i} className="text-sm text-zinc-300 flex gap-2">
                      <span className="text-zinc-600">-</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-4 bg-zinc-950 rounded-lg">
                <h4 className="text-sm font-medium text-oaxe-400 mb-2">v3</h4>
                <ul className="space-y-1">
                  {run.output.roadmap.v3.map((item, i) => (
                    <li key={i} className="text-sm text-zinc-300 flex gap-2">
                      <span className="text-zinc-600">-</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="text-zinc-500">Waiting for generation...</div>
          )}
        </div>

        {/* Generated App Tab */}
        <div>
          {run.generatedApp ? (
            <GeneratedAppView generatedApp={run.generatedApp} />
          ) : run.status === 'completed' ? (
            <div className="text-zinc-500">No app was generated for this run.</div>
          ) : (
            <div className="text-zinc-500">Waiting for app generation...</div>
          )}
        </div>

        {/* Logs Tab */}
        <LogConsole logs={run.logs} />
      </Tabs>
    </div>
  );
}
