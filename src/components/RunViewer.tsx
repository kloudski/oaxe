'use client';

import { useState } from 'react';
import { Tabs } from './Tabs';
import { JsonView } from './JsonView';
import { LogConsole } from './LogConsole';
import { GeneratedAppView } from './GeneratedAppView';
import type { Run, BrandDNA, LaunchAssets } from '@/lib/oaxe/types';

interface RunViewerProps {
  run: Run;
}

/**
 * M4A: Brand Moment Card Component
 */
function BrandMomentCard({ moment }: { moment: BrandDNA['productBrandMoments'][0] }) {
  return (
    <div className="p-4 bg-zinc-950 rounded-lg border border-zinc-800 hover:border-zinc-700 transition-colors">
      <h4 className="font-medium text-white mb-2">{moment.moment}</h4>
      <p className="text-sm text-zinc-400 mb-3">{moment.description}</p>
      <div className="flex items-center gap-2">
        <span className="text-xs px-2 py-1 rounded-full bg-oaxe-500/20 text-oaxe-400">
          {moment.emotion}
        </span>
      </div>
    </div>
  );
}

/**
 * M4A: Brand DNA Section Component
 */
function BrandDNASection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wide">{title}</h3>
      {children}
    </div>
  );
}

/**
 * M4A: Brand Value Chip
 */
function ValueChip({ value }: { value: string }) {
  return (
    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-zinc-800 text-zinc-300 border border-zinc-700">
      {value}
    </span>
  );
}

export function RunViewer({ run }: RunViewerProps) {
  const [showBrandJSON, setShowBrandJSON] = useState(false);

  const tabs = [
    { id: 'spec', label: 'Spec' },
    { id: 'architecture', label: 'Architecture' },
    { id: 'brand-dna', label: 'Brand DNA' },
    { id: 'launch-assets', label: 'Launch Assets' },
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

        {/* Brand DNA Tab (M4A) */}
        <div className="space-y-6">
          {run.brandDNA ? (
            <>
              {/* Toggle between readable and JSON view */}
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">
                  {run.brandDNA.name}
                  <span className="ml-2 text-sm font-normal text-oaxe-400">
                    {run.brandDNA.archetype} Archetype
                  </span>
                </h3>
                <button
                  onClick={() => setShowBrandJSON(!showBrandJSON)}
                  className="text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  {showBrandJSON ? 'Show Readable' : 'Show JSON'}
                </button>
              </div>

              {showBrandJSON ? (
                <JsonView data={run.brandDNA} title="Brand DNA (JSON)" />
              ) : (
                <>
                  {/* Tagline */}
                  <p className="text-lg text-zinc-300 italic">"{run.brandDNA.tagline}"</p>

                  {/* Core Identity */}
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="p-4 bg-zinc-950 rounded-lg">
                      <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Category</p>
                      <p className="text-white font-medium capitalize">{run.brandDNA.category}</p>
                    </div>
                    <div className="p-4 bg-zinc-950 rounded-lg">
                      <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Mood</p>
                      <p className="text-white font-medium capitalize">{run.brandDNA.mood}</p>
                    </div>
                    <div className="p-4 bg-zinc-950 rounded-lg">
                      <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Archetype</p>
                      <p className="text-white font-medium">{run.brandDNA.archetype}</p>
                    </div>
                  </div>

                  {/* Positioning */}
                  <BrandDNASection title="Positioning">
                    <div className="p-4 bg-zinc-950 rounded-lg space-y-3">
                      <div>
                        <p className="text-xs text-zinc-500 mb-1">Statement</p>
                        <p className="text-zinc-200">{run.brandDNA.positioning.statement}</p>
                      </div>
                      <div>
                        <p className="text-xs text-zinc-500 mb-1">Target Audience</p>
                        <p className="text-zinc-300">{run.brandDNA.positioning.targetAudience}</p>
                      </div>
                      <div>
                        <p className="text-xs text-zinc-500 mb-1">Differentiator</p>
                        <p className="text-zinc-300">{run.brandDNA.positioning.differentiator}</p>
                      </div>
                    </div>
                  </BrandDNASection>

                  {/* Voice */}
                  <BrandDNASection title="Voice & Tone">
                    <div className="p-4 bg-zinc-950 rounded-lg space-y-3">
                      <div className="flex gap-4">
                        <div>
                          <p className="text-xs text-zinc-500 mb-1">Tone</p>
                          <p className="text-zinc-200 capitalize">{run.brandDNA.voice.tone}</p>
                        </div>
                        <div>
                          <p className="text-xs text-zinc-500 mb-1">Style</p>
                          <p className="text-zinc-200">{run.brandDNA.voice.style}</p>
                        </div>
                      </div>
                      {run.brandDNA.voice.keywords.length > 0 && (
                        <div>
                          <p className="text-xs text-zinc-500 mb-2">Keywords</p>
                          <div className="flex flex-wrap gap-2">
                            {run.brandDNA.voice.keywords.map((kw, i) => (
                              <ValueChip key={i} value={kw} />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </BrandDNASection>

                  {/* Visual */}
                  <BrandDNASection title="Visual Identity">
                    <div className="p-4 bg-zinc-950 rounded-lg space-y-3">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <p className="text-xs text-zinc-500 mb-1">Primary Color</p>
                          <div className="flex items-center gap-2">
                            <div
                              className="w-6 h-6 rounded border border-zinc-700"
                              style={{ background: run.brandDNA.visual.primaryColor }}
                            />
                            <code className="text-xs text-zinc-400">{run.brandDNA.visual.primaryColor}</code>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-zinc-500 mb-1">Aesthetic</p>
                          <p className="text-zinc-200 capitalize">{run.brandDNA.visual.aesthetic}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-zinc-500 mb-1">Icon Style</p>
                        <p className="text-zinc-300">{run.brandDNA.visual.iconStyle}</p>
                      </div>
                      <div>
                        <p className="text-xs text-zinc-500 mb-2">Color Palette</p>
                        <div className="flex flex-wrap gap-2">
                          {run.brandDNA.visual.colorPalette.map((color, i) => (
                            <ValueChip key={i} value={color} />
                          ))}
                        </div>
                      </div>
                    </div>
                  </BrandDNASection>

                  {/* Brand Moments */}
                  <BrandDNASection title="Brand Moments">
                    <div className="grid gap-4 md:grid-cols-3">
                      {run.brandDNA.productBrandMoments.map((moment, i) => (
                        <BrandMomentCard key={i} moment={moment} />
                      ))}
                    </div>
                  </BrandDNASection>

                  {/* Values */}
                  <BrandDNASection title="Core Values">
                    <div className="flex flex-wrap gap-2">
                      {run.brandDNA.values.map((value, i) => (
                        <ValueChip key={i} value={value} />
                      ))}
                    </div>
                  </BrandDNASection>

                  {/* Guardrails */}
                  <BrandDNASection title="Brand Guardrails">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="p-4 bg-zinc-950 rounded-lg">
                        <p className="text-xs text-green-400 uppercase tracking-wide mb-2">Do Say</p>
                        <ul className="space-y-1">
                          {run.brandDNA.guardrails.doSay.map((item, i) => (
                            <li key={i} className="text-sm text-zinc-300">✓ {item}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="p-4 bg-zinc-950 rounded-lg">
                        <p className="text-xs text-red-400 uppercase tracking-wide mb-2">Don't Say</p>
                        <ul className="space-y-1">
                          {run.brandDNA.guardrails.dontSay.map((item, i) => (
                            <li key={i} className="text-sm text-zinc-300">✗ {item}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="p-4 bg-zinc-950 rounded-lg">
                        <p className="text-xs text-green-400 uppercase tracking-wide mb-2">Visual Do</p>
                        <ul className="space-y-1">
                          {run.brandDNA.guardrails.visualDo.map((item, i) => (
                            <li key={i} className="text-sm text-zinc-300">✓ {item}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="p-4 bg-zinc-950 rounded-lg">
                        <p className="text-xs text-red-400 uppercase tracking-wide mb-2">Visual Don't</p>
                        <ul className="space-y-1">
                          {run.brandDNA.guardrails.visualDont.map((item, i) => (
                            <li key={i} className="text-sm text-zinc-300">✗ {item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </BrandDNASection>
                </>
              )}

              {/* Design Tokens & Founder Tweets */}
              <div className="border-t border-zinc-800 pt-6 space-y-4">
                <JsonView data={run.output?.designTokens} title="Design Tokens" />
                {run.output?.founderTweets && (
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
                )}
              </div>
            </>
          ) : run.output ? (
            /* Fallback to legacy brandDNA if enhanced version not available */
            <>
              <JsonView data={run.output.brandDNA} title="Brand DNA (Legacy)" />
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

        {/* Launch Assets Tab (M6) */}
        <div className="space-y-6">
          {run.launchAssets ? (
            <>
              {/* Pinned Tweet */}
              <BrandDNASection title="Pinned Tweet">
                <div className="p-4 bg-zinc-950 rounded-lg border border-oaxe-500/30">
                  <p className="text-zinc-200 text-lg italic">"{run.launchAssets.pinnedTweet}"</p>
                </div>
              </BrandDNASection>

              {/* Hero Copy */}
              <BrandDNASection title="Hero Copy">
                <div className="p-4 bg-zinc-950 rounded-lg space-y-4">
                  <div>
                    <p className="text-xs text-zinc-500 mb-1">Headline</p>
                    <p className="text-xl font-semibold text-white">{run.launchAssets.heroCopy.headline}</p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 mb-1">Subheadline</p>
                    <p className="text-zinc-300">{run.launchAssets.heroCopy.subheadline}</p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 mb-2">Key Benefits</p>
                    <ul className="space-y-1">
                      {run.launchAssets.heroCopy.bullets.map((bullet, i) => (
                        <li key={i} className="text-sm text-zinc-300 flex gap-2">
                          <span className="text-oaxe-400">•</span>
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </BrandDNASection>

              {/* Founder Tweets */}
              <BrandDNASection title="Founder Tweets">
                <div className="space-y-3">
                  {run.launchAssets.founderTweets.map((tweet, i) => (
                    <div key={i} className="p-4 bg-zinc-950 rounded-lg">
                      <p className="text-sm text-zinc-400 mb-1">Tweet {i + 1}</p>
                      <p className="text-zinc-200">{tweet}</p>
                    </div>
                  ))}
                </div>
              </BrandDNASection>

              {/* Product Hunt Tagline */}
              <BrandDNASection title="Product Hunt Tagline">
                <div className="p-4 bg-zinc-950 rounded-lg">
                  <p className="text-zinc-200">"{run.launchAssets.productHuntTagline}"</p>
                  <p className="text-xs text-zinc-500 mt-2">
                    {run.launchAssets.productHuntTagline.length}/60 characters
                  </p>
                </div>
              </BrandDNASection>

              {/* Screenshot Spec */}
              <BrandDNASection title="Screenshot Specification">
                <div className="space-y-4">
                  {/* Hero Screenshot */}
                  <div className="p-4 bg-zinc-950 rounded-lg border border-oaxe-500/20">
                    <p className="text-xs text-oaxe-400 uppercase tracking-wide mb-2">Hero Screenshot</p>
                    <div className="space-y-2">
                      <p className="text-zinc-200"><span className="text-zinc-500">Screen:</span> {run.launchAssets.screenshotSpec.heroScreenshot.screen}</p>
                      <p className="text-zinc-300 text-sm"><span className="text-zinc-500">Rationale:</span> {run.launchAssets.screenshotSpec.heroScreenshot.rationale}</p>
                      {run.launchAssets.screenshotSpec.heroScreenshot.copyOverlay && (
                        <p className="text-zinc-300 text-sm"><span className="text-zinc-500">Overlay:</span> "{run.launchAssets.screenshotSpec.heroScreenshot.copyOverlay}"</p>
                      )}
                    </div>
                  </div>

                  {/* Supporting Screenshots */}
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {run.launchAssets.screenshotSpec.supportingScreenshots.map((ss, i) => (
                      <div key={i} className="p-4 bg-zinc-950 rounded-lg">
                        <p className="text-xs text-zinc-500 uppercase tracking-wide mb-2">Screenshot {i + 2}</p>
                        <p className="text-zinc-200 text-sm mb-1">{ss.screen}</p>
                        <p className="text-zinc-400 text-xs">{ss.communicates}</p>
                        {ss.copyOverlay && (
                          <p className="text-zinc-400 text-xs mt-1">Overlay: "{ss.copyOverlay}"</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </BrandDNASection>

              {/* Generated timestamp */}
              <p className="text-xs text-zinc-600">
                Generated: {new Date(run.launchAssets.generatedAt).toLocaleString()}
              </p>
            </>
          ) : run.status === 'completed' ? (
            <div className="text-zinc-500">No launch assets were generated for this run.</div>
          ) : (
            <div className="text-zinc-500">Waiting for launch assets generation...</div>
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
