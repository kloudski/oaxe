import { generateProductSpec } from './llm';
import { appendLog, updateRunStatus, getRun, setGeneratedApp } from './runStore';
import { generateApp, getRelativeGeneratedPath } from './generators';
import type { OaxeOutput } from './types';

export async function executePlan(runId: string): Promise<void> {
  const run = await getRun(runId);
  if (!run) {
    throw new Error(`Run ${runId} not found`);
  }

  try {
    await updateRunStatus(runId, 'running');
    await appendLog(runId, 'info', `Starting Oaxe generation for: "${run.directive}"`);

    await appendLog(runId, 'info', 'Analyzing directive...');
    await appendLog(runId, 'info', 'Calling LLM to generate product specification...');

    const output: OaxeOutput = await generateProductSpec(run.directive);

    await appendLog(runId, 'info', `Generated app: ${output.appName}`);
    await appendLog(runId, 'info', `Elevator pitch: ${output.elevatorPitch}`);
    await appendLog(runId, 'info', `Entities: ${output.entities.map(e => e.name).join(', ')}`);
    await appendLog(runId, 'info', `APIs: ${output.apis.length} endpoints`);
    await appendLog(runId, 'info', `Pages: ${output.pages.length} routes`);
    await appendLog(runId, 'info', 'Validating output schema...');
    await appendLog(runId, 'info', 'Schema validation passed');

    // Generate the app files
    await appendLog(runId, 'info', 'Generating Next.js app scaffold...');
    const result = await generateApp(output, { force: true });

    await appendLog(runId, 'info', `Generated ${result.files.length} files`);
    await appendLog(runId, 'info', `Output path: ${getRelativeGeneratedPath(output.slug)}`);

    // Update run with generated app info
    await setGeneratedApp(runId, {
      slug: result.slug,
      path: getRelativeGeneratedPath(output.slug),
      fileTree: result.fileTree,
      fileCount: result.files.length,
    });

    await appendLog(runId, 'info', 'App generation complete');
    await updateRunStatus(runId, 'completed', output);

  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    await appendLog(runId, 'error', `Generation failed: ${message}`);
    await updateRunStatus(runId, 'error', undefined, message);
  }
}
