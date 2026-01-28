import { promises as fs } from 'fs';
import path from 'path';
import type { Run, LogEntry, GeneratedApp, BrandDNA, LaunchAssets, EvolutionRoadmap, LayoutGrammar, VisualEmphasis } from './types';
import { generateRunFilename } from './slug';

const DATA_DIR = path.join(process.cwd(), 'data', 'runs');
const BRAND_DIR = path.join(process.cwd(), 'brand');
const DOCS_DIR = path.join(process.cwd(), 'docs');

async function ensureDataDir(): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

export async function createRun(id: string, directive: string): Promise<Run> {
  await ensureDataDir();

  const now = new Date().toISOString();
  const run: Run = {
    id,
    directive,
    status: 'pending',
    createdAt: now,
    updatedAt: now,
    logs: [],
  };

  await saveRun(run);
  return run;
}

export async function getRun(id: string): Promise<Run | null> {
  await ensureDataDir();

  const files = await fs.readdir(DATA_DIR);
  for (const file of files) {
    if (file.endsWith('.json')) {
      const content = await fs.readFile(path.join(DATA_DIR, file), 'utf-8');
      const run = JSON.parse(content) as Run;
      if (run.id === id) {
        return run;
      }
    }
  }
  return null;
}

export async function saveRun(run: Run): Promise<void> {
  await ensureDataDir();

  const filename = generateRunFilename(run.id, run.directive);
  const existingFile = await findRunFile(run.id);

  const filepath = existingFile
    ? path.join(DATA_DIR, existingFile)
    : path.join(DATA_DIR, filename);

  run.updatedAt = new Date().toISOString();
  await fs.writeFile(filepath, JSON.stringify(run, null, 2));
}

async function findRunFile(id: string): Promise<string | null> {
  try {
    const files = await fs.readdir(DATA_DIR);
    for (const file of files) {
      if (file.endsWith('.json')) {
        const content = await fs.readFile(path.join(DATA_DIR, file), 'utf-8');
        const run = JSON.parse(content) as Run;
        if (run.id === id) {
          return file;
        }
      }
    }
  } catch {
    return null;
  }
  return null;
}

export async function appendLog(id: string, level: LogEntry['level'], message: string): Promise<void> {
  const run = await getRun(id);
  if (!run) return;

  run.logs.push({
    timestamp: new Date().toISOString(),
    level,
    message,
  });

  await saveRun(run);
}

export async function updateRunStatus(
  id: string,
  status: Run['status'],
  output?: Run['output'],
  error?: string
): Promise<void> {
  const run = await getRun(id);
  if (!run) return;

  run.status = status;
  if (output) run.output = output;
  if (error) run.error = error;

  await saveRun(run);
}

export async function listRuns(): Promise<Run[]> {
  await ensureDataDir();

  const files = await fs.readdir(DATA_DIR);
  const runs: Run[] = [];

  for (const file of files) {
    if (file.endsWith('.json')) {
      const content = await fs.readFile(path.join(DATA_DIR, file), 'utf-8');
      runs.push(JSON.parse(content) as Run);
    }
  }

  return runs.sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function setGeneratedApp(id: string, generatedApp: GeneratedApp): Promise<void> {
  const run = await getRun(id);
  if (!run) return;

  run.generatedApp = generatedApp;
  await saveRun(run);
}

/**
 * M4A: Set Brand DNA for a run
 * - Embeds in run.brandDNA
 * - Also persists to brand/dna.json (repo-level latest)
 */
export async function setBrandDNA(id: string, brandDNA: BrandDNA): Promise<void> {
  const run = await getRun(id);
  if (!run) return;

  // Embed in run
  run.brandDNA = brandDNA;
  await saveRun(run);

  // Also persist to brand/dna.json (repo-level latest)
  await saveBrandDNA(brandDNA);
}

/**
 * M4A: Save Brand DNA to brand/dna.json
 */
async function saveBrandDNA(brandDNA: BrandDNA): Promise<void> {
  await fs.mkdir(BRAND_DIR, { recursive: true });
  const filepath = path.join(BRAND_DIR, 'dna.json');
  await fs.writeFile(filepath, JSON.stringify(brandDNA, null, 2), 'utf-8');
}

/**
 * M4A: Get latest Brand DNA from brand/dna.json
 */
export async function getLatestBrandDNA(): Promise<BrandDNA | null> {
  try {
    const filepath = path.join(BRAND_DIR, 'dna.json');
    const content = await fs.readFile(filepath, 'utf-8');
    return JSON.parse(content) as BrandDNA;
  } catch {
    return null;
  }
}

/**
 * M6: Set Launch Assets for a run
 * - Embeds in run.launchAssets
 * - Also persists to docs/launch-playbook.md
 */
export async function setLaunchAssets(
  id: string,
  launchAssets: LaunchAssets,
  playbookMarkdown: string
): Promise<void> {
  const run = await getRun(id);
  if (!run) return;

  // Embed in run
  run.launchAssets = launchAssets;
  await saveRun(run);

  // Also persist to docs/launch-playbook.md
  await saveLaunchPlaybook(playbookMarkdown);
}

/**
 * M6: Save launch playbook to docs/launch-playbook.md
 */
async function saveLaunchPlaybook(content: string): Promise<void> {
  await fs.mkdir(DOCS_DIR, { recursive: true });
  const filepath = path.join(DOCS_DIR, 'launch-playbook.md');
  await fs.writeFile(filepath, content, 'utf-8');
}

/**
 * M6: Get latest launch assets from a completed run
 */
export async function getLatestLaunchAssets(): Promise<LaunchAssets | null> {
  const runs = await listRuns();
  for (const run of runs) {
    if (run.launchAssets) {
      return run.launchAssets;
    }
  }
  return null;
}

/**
 * M8: Set Evolution Roadmap for a run
 * - Embeds in run.evolution
 * - Also persists to docs/evolution.md
 */
export async function setEvolution(
  id: string,
  evolution: EvolutionRoadmap,
  evolutionMarkdown: string
): Promise<void> {
  const run = await getRun(id);
  if (!run) return;

  // Embed in run
  run.evolution = evolution;
  await saveRun(run);

  // Also persist to docs/evolution.md
  await saveEvolutionMarkdown(evolutionMarkdown);
}

/**
 * M8: Save evolution roadmap to docs/evolution.md
 */
async function saveEvolutionMarkdown(content: string): Promise<void> {
  await fs.mkdir(DOCS_DIR, { recursive: true });
  const filepath = path.join(DOCS_DIR, 'evolution.md');
  await fs.writeFile(filepath, content, 'utf-8');
}

/**
 * M8: Get latest evolution roadmap from a completed run
 */
export async function getLatestEvolution(): Promise<EvolutionRoadmap | null> {
  const runs = await listRuns();
  for (const run of runs) {
    if (run.evolution) {
      return run.evolution;
    }
  }
  return null;
}

/**
 * M5B: Set Layout Grammar for a run
 * - Embeds in run.layoutGrammar
 * - Also persists to docs/layout-grammar.md
 */
export async function setLayoutGrammar(
  id: string,
  layoutGrammar: LayoutGrammar,
  grammarMarkdown: string
): Promise<void> {
  const run = await getRun(id);
  if (!run) return;

  // Embed in run
  run.layoutGrammar = layoutGrammar;
  await saveRun(run);

  // Also persist to docs/layout-grammar.md
  await saveLayoutGrammarMarkdown(grammarMarkdown);
}

/**
 * M5B: Save layout grammar to docs/layout-grammar.md
 */
async function saveLayoutGrammarMarkdown(content: string): Promise<void> {
  await fs.mkdir(DOCS_DIR, { recursive: true });
  const filepath = path.join(DOCS_DIR, 'layout-grammar.md');
  await fs.writeFile(filepath, content, 'utf-8');
}

/**
 * M5B: Get latest layout grammar from a completed run
 */
export async function getLatestLayoutGrammar(): Promise<LayoutGrammar | null> {
  const runs = await listRuns();
  for (const run of runs) {
    if (run.layoutGrammar) {
      return run.layoutGrammar;
    }
  }
  return null;
}

/**
 * M5C: Set Visual Emphasis for a run
 * - Embeds in run.visualEmphasis
 */
export async function setVisualEmphasis(id: string, visualEmphasis: VisualEmphasis): Promise<void> {
  const run = await getRun(id);
  if (!run) return;

  // Embed in run
  run.visualEmphasis = visualEmphasis;
  await saveRun(run);
}

/**
 * M5C: Get latest visual emphasis from a completed run
 */
export async function getLatestVisualEmphasis(): Promise<VisualEmphasis | null> {
  const runs = await listRuns();
  for (const run of runs) {
    if (run.visualEmphasis) {
      return run.visualEmphasis;
    }
  }
  return null;
}
