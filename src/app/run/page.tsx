'use client';

import { useState, useEffect, useCallback } from 'react';
import { DirectiveForm } from '@/components/DirectiveForm';
import { RunViewer } from '@/components/RunViewer';
import type { Run } from '@/lib/oaxe/types';

export default function RunPage() {
  const [run, setRun] = useState<Run | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pollRun = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/runs/${id}`);
      if (!res.ok) throw new Error('Failed to fetch run');
      const data = await res.json();
      setRun(data);
      return data.status;
    } catch (err) {
      console.error('Poll error:', err);
      return 'error';
    }
  }, []);

  useEffect(() => {
    if (!run || run.status === 'completed' || run.status === 'error') {
      return;
    }

    const interval = setInterval(async () => {
      const status = await pollRun(run.id);
      if (status === 'completed' || status === 'error') {
        clearInterval(interval);
        setIsLoading(false);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [run, pollRun]);

  const handleSubmit = async (directive: string) => {
    setIsLoading(true);
    setError(null);
    setRun(null);

    try {
      const res = await fetch('/api/runs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ directive }),
      });

      if (!res.ok) {
        throw new Error('Failed to create run');
      }

      const data = await res.json();
      setRun(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">New Run</h1>
        <p className="text-zinc-400">
          Enter a product directive to generate a complete product specification.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-950/50 border border-red-900 rounded-lg text-red-300">
          {error}
        </div>
      )}

      <div className="space-y-8">
        <DirectiveForm onSubmit={handleSubmit} isLoading={isLoading} />

        {run && (
          <div className="pt-8 border-t border-zinc-800">
            <RunViewer run={run} />
          </div>
        )}
      </div>
    </div>
  );
}
