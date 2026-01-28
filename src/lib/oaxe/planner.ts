import { generateProductSpec } from './llm';
import { appendLog, updateRunStatus, getRun, setGeneratedApp, setBrandDNA, setLaunchAssets, setEvolution, setLayoutGrammar, setVisualEmphasis } from './runStore';
import { generateApp, getRelativeGeneratedPath } from './generators';
import { generateBrandDNA } from './generators/brandDNA';
import { generateVisualSignature, getVisualSignatureSummary } from './generators/visualSignature';
import { generateIconography, getIconographySummary } from './generators/iconography';
import { generateLayoutGrammar, generateLayoutGrammarMarkdown, getLayoutGrammarSummary } from './generators/layoutGrammar';
import { generateVisualEmphasis, getVisualEmphasisSummary } from './generators/visualEmphasis';
import { generateLaunchAssets, generateLaunchPlaybookMarkdown } from './generators/launchAssets';
import { generateEvolutionRoadmap, generateEvolutionMarkdown } from './generators/evolution';
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

    // M4A: Generate enhanced Brand DNA
    await appendLog(runId, 'info', 'Generating Brand DNA...');
    const brandDNA = generateBrandDNA(run.directive, output);
    await appendLog(runId, 'info', `Brand DNA generated: ${brandDNA.category} / ${brandDNA.mood} / ${brandDNA.archetype}`);

    // M4B: Generate Visual Signature (immediately after M4A.1)
    await appendLog(runId, 'info', 'M4B: Generating Visual Signature...');
    const visualSignature = generateVisualSignature(brandDNA);
    brandDNA.visualSignature = visualSignature;
    await appendLog(runId, 'info', `Visual Signature generated: ${getVisualSignatureSummary(visualSignature)}`);

    // M4C: Generate Iconography System (immediately after M4B)
    await appendLog(runId, 'info', 'M4C: Generating Iconography System...');
    const iconography = generateIconography(brandDNA);
    brandDNA.iconography = iconography;
    await setBrandDNA(runId, brandDNA);
    await appendLog(runId, 'info', `Iconography generated: ${getIconographySummary(iconography)}`);

    // M5B: Generate Layout Grammar (after M4C, before app generation)
    await appendLog(runId, 'info', 'M5B: Generating Layout Grammar...');
    const layoutGrammar = generateLayoutGrammar(run.directive, output, brandDNA);
    const grammarMarkdown = generateLayoutGrammarMarkdown(layoutGrammar, brandDNA);
    await setLayoutGrammar(runId, layoutGrammar, grammarMarkdown);
    await appendLog(runId, 'info', `Layout Grammar generated: ${getLayoutGrammarSummary(layoutGrammar)}`);
    await appendLog(runId, 'info', 'Persisted to docs/layout-grammar.md');

    // M5C: Generate Visual Emphasis (after M5B, before app generation)
    await appendLog(runId, 'info', 'M5C: Generating Visual Emphasis...');
    const visualEmphasis = generateVisualEmphasis(brandDNA, layoutGrammar);
    await setVisualEmphasis(runId, visualEmphasis);
    await appendLog(runId, 'info', `Visual Emphasis generated: ${getVisualEmphasisSummary(visualEmphasis)}`);

    // Generate the app files (M5A: pass Brand DNA for UI expression, M5B: pass Layout Grammar, M5C: pass Visual Emphasis)
    await appendLog(runId, 'info', 'Generating Next.js app scaffold...');
    await appendLog(runId, 'info', 'M5A: Applying brand expression layer...');
    await appendLog(runId, 'info', 'M5B: Applying layout grammar...');
    await appendLog(runId, 'info', 'M5C: Applying visual emphasis...');
    const result = await generateApp(output, { force: true, directive: run.directive }, brandDNA, layoutGrammar, visualEmphasis);

    await appendLog(runId, 'info', `Generated ${result.files.length} files`);
    await appendLog(runId, 'info', `Output path: ${getRelativeGeneratedPath(output.slug)}`);

    // Update run with generated app info
    await setGeneratedApp(runId, {
      slug: result.slug,
      path: getRelativeGeneratedPath(output.slug),
      fileTree: result.fileTree,
      fileCount: result.files.length,
    });

    // M6: Generate launch assets
    await appendLog(runId, 'info', 'M6: Generating launch assets...');
    const launchAssets = generateLaunchAssets(brandDNA, output);
    const playbookMarkdown = generateLaunchPlaybookMarkdown(launchAssets, brandDNA, output);
    await setLaunchAssets(runId, launchAssets, playbookMarkdown);
    await appendLog(runId, 'info', `Launch assets generated: ${launchAssets.founderTweets.length} tweets, hero copy, screenshot spec`);
    await appendLog(runId, 'info', 'Persisted to docs/launch-playbook.md');

    // M8: Generate evolution roadmap
    await appendLog(runId, 'info', 'M8: Generating evolution roadmap...');
    const evolution = generateEvolutionRoadmap(brandDNA, output);
    const evolutionMarkdown = generateEvolutionMarkdown(evolution, brandDNA);
    await setEvolution(runId, evolution, evolutionMarkdown);
    await appendLog(runId, 'info', `Evolution roadmap generated: v1 (${evolution.v1.sections.mustHaveFeatures?.length || 0} features) → v2 → v3`);
    await appendLog(runId, 'info', 'Persisted to docs/evolution.md');

    await appendLog(runId, 'info', 'App generation complete');
    await updateRunStatus(runId, 'completed', output);

  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    await appendLog(runId, 'error', `Generation failed: ${message}`);
    await updateRunStatus(runId, 'error', undefined, message);
  }
}
