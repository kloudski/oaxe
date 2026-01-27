'use client';

import { useEffect, useRef } from 'react';
import type { LogEntry } from '@/lib/oaxe/types';

interface LogConsoleProps {
  logs: LogEntry[];
}

export function LogConsole({ logs }: LogConsoleProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs]);

  const getLevelColor = (level: LogEntry['level']) => {
    switch (level) {
      case 'error':
        return 'text-red-400';
      case 'warn':
        return 'text-yellow-400';
      default:
        return 'text-emerald-400';
    }
  };

  return (
    <div
      ref={containerRef}
      className="bg-zinc-950 text-zinc-100 p-4 rounded-lg font-mono text-sm h-[300px] overflow-y-auto"
    >
      {logs.length === 0 ? (
        <div className="text-zinc-500">Waiting for logs...</div>
      ) : (
        logs.map((log, index) => (
          <div key={index} className="flex gap-2 py-0.5">
            <span className="text-zinc-600 shrink-0">
              {new Date(log.timestamp).toLocaleTimeString()}
            </span>
            <span className={`shrink-0 uppercase text-xs ${getLevelColor(log.level)}`}>
              [{log.level}]
            </span>
            <span className="text-zinc-300">{log.message}</span>
          </div>
        ))
      )}
    </div>
  );
}
