'use client';

import { useState } from 'react';

interface DirectiveFormProps {
  onSubmit: (directive: string) => void;
  isLoading: boolean;
}

export function DirectiveForm({ onSubmit, isLoading }: DirectiveFormProps) {
  const [directive, setDirective] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (directive.trim() && !isLoading) {
      onSubmit(directive.trim());
    }
  };

  const examples = [
    'Build Facebook',
    'Build a Stripe-level billing dashboard',
    'Build Linear but for legal case management',
    'Invent a tool for async team rituals',
  ];

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4">
      <div>
        <label
          htmlFor="directive"
          className="block text-sm font-medium text-zinc-300 mb-2"
        >
          Product Directive
        </label>
        <textarea
          id="directive"
          value={directive}
          onChange={(e) => setDirective(e.target.value)}
          placeholder="Build a [product] for [audience] that [value prop]..."
          className="w-full h-32 px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-oaxe-500 focus:border-transparent resize-none"
          disabled={isLoading}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {examples.map((example) => (
          <button
            key={example}
            type="button"
            onClick={() => setDirective(example)}
            className="px-3 py-1 text-xs bg-zinc-800 text-zinc-400 rounded-full hover:bg-zinc-700 hover:text-white transition-colors"
            disabled={isLoading}
          >
            {example}
          </button>
        ))}
      </div>

      <button
        type="submit"
        disabled={!directive.trim() || isLoading}
        className="w-full py-3 px-6 bg-oaxe-500 text-white font-medium rounded-lg hover:bg-oaxe-600 focus:outline-none focus:ring-2 focus:ring-oaxe-500 focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Generating...
          </span>
        ) : (
          'Initialize'
        )}
      </button>
    </form>
  );
}
