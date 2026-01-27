import { promises as fs } from 'fs';
import path from 'path';
import type { Run, LogEntry, GeneratedApp } from './types';
import { generateRunFilename } from './slug';

const DATA_DIR = path.join(process.cwd(), 'data', 'runs');

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
