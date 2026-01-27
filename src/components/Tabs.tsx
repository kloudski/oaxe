'use client';

import { useState } from 'react';

interface Tab {
  id: string;
  label: string;
}

interface TabsProps {
  tabs: Tab[];
  children: React.ReactNode[];
}

export function Tabs({ tabs, children }: TabsProps) {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id || '');

  return (
    <div className="w-full">
      <div className="border-b border-zinc-800">
        <nav className="flex gap-1 px-1" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium transition-colors rounded-t-lg ${
                activeTab === tab.id
                  ? 'bg-zinc-800 text-white border-b-2 border-oaxe-500'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
      <div className="p-4 bg-zinc-900/50 rounded-b-lg">
        {children.map((child, index) => (
          <div
            key={tabs[index]?.id}
            className={activeTab === tabs[index]?.id ? 'block' : 'hidden'}
          >
            {child}
          </div>
        ))}
      </div>
    </div>
  );
}
