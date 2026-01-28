import { promises as fs } from 'fs';
import path from 'path';
import type { OaxeOutput, BrandDNA } from '../types';
import type { GenerationResult, FileTreeNode, GeneratedFile, GeneratorOptions } from './types';
import { generateScaffold } from './scaffold';
import { generatePages, getEntityBasePath } from './pages';
import { generateApis } from './apis';
import { generateSchema } from './schema';
import { generateSeed } from './seed';
import { generateComponents } from './components';
import { generateTokens, getTokensForRunMetadata, extractBrandDNAForTokens, shouldUseBrandDNAOverride } from './tokens';
import { generateBrandDNA, getBrandDNAAsJSON } from './brandDNA';
import { generateLaunchAssets, generateLaunchPlaybookMarkdown } from './launchAssets';

export * from './types';
export { getTokensForRunMetadata, extractBrandDNAForTokens, shouldUseBrandDNAOverride };
export { generateBrandDNA, getBrandDNAAsJSON };

// M4B: Export visual signature generator
export { generateVisualSignature, getVisualSignatureAsJSON, getVisualSignatureSummary } from './visualSignature';

// M4C: Export iconography generator
export { generateIconography, getIconographyAsJSON, getIconographySummary } from './iconography';

// M5A: Export brand expression utilities
export * from './brandExpression';

// M6: Export launch assets generator
export { generateLaunchAssets, generateLaunchPlaybookMarkdown };

// M8: Export evolution roadmap generator
export { generateEvolutionRoadmap, generateEvolutionMarkdown } from './evolution';

const GENERATED_DIR = path.join(process.cwd(), 'generated');

function sanitizeSlug(slug: string): string {
  return slug
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 50);
}

function buildFileTree(files: GeneratedFile[]): FileTreeNode {
  const root: FileTreeNode = { name: '/', type: 'directory', children: [] };

  for (const file of files) {
    const parts = file.path.split('/');
    let current = root;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const isFile = i === parts.length - 1;

      if (!current.children) {
        current.children = [];
      }

      let child = current.children.find((c) => c.name === part);
      if (!child) {
        child = {
          name: part,
          type: isFile ? 'file' : 'directory',
          children: isFile ? undefined : [],
        };
        current.children.push(child);
      }
      current = child;
    }
  }

  // Sort children alphabetically, directories first
  function sortTree(node: FileTreeNode): void {
    if (node.children) {
      node.children.sort((a, b) => {
        if (a.type !== b.type) {
          return a.type === 'directory' ? -1 : 1;
        }
        return a.name.localeCompare(b.name);
      });
      node.children.forEach(sortTree);
    }
  }

  sortTree(root);
  return root;
}

/**
 * M5A: Generate app with Brand DNA expression
 * Accepts optional BrandDNA for brand-aware copy, emphasis, and moments
 */
export async function generateApp(
  output: OaxeOutput,
  options: GeneratorOptions = {},
  brandDNA?: BrandDNA
): Promise<GenerationResult> {
  const { dryRun = false, force = false, directive = '' } = options;
  const slug = sanitizeSlug(output.slug);
  const outputPath = path.join(GENERATED_DIR, slug);

  // Check if directory exists
  if (!force && !dryRun) {
    try {
      await fs.access(outputPath);
      throw new Error(
        `Directory already exists: ${outputPath}. Use force=true to overwrite.`
      );
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code !== 'ENOENT') {
        throw err;
      }
    }
  }

  // Collect all generated files
  // Pass directive for brand-driven token generation (M3B)
  // M5A: Pass Brand DNA for UI expression
  const files: GeneratedFile[] = [
    ...generateScaffold(output, directive, brandDNA),    // M5A: Dashboard personality
    ...generateTokens(output, directive),                 // Brand-driven OKLCH tokens
    ...generateComponents(output),
    ...generatePages(output, brandDNA),                   // M5A: Brand-aware copy
    ...generateApis(output),
    ...generateSchema(output),
    ...generateSeed(output),
  ];

  // VALIDATION: Ensure all sidebar routes have corresponding page.tsx files
  // This prevents 404 errors when clicking sidebar links
  const generatedPagePaths = new Set(
    files
      .filter(f => f.path.includes('src/app/(app)/') && f.path.endsWith('/page.tsx'))
      .map(f => {
        // Extract route from path: src/app/(app)/job/page.tsx -> job
        // Also handles: src/app/(app)/e/dashboard/page.tsx -> e/dashboard
        const match = f.path.match(/src\/app\/\(app\)\/(.+?)\/page\.tsx$/);
        return match ? match[1] : null;
      })
      .filter(Boolean)
  );

  // Get all sidebar routes (from entities + pages)
  // Use collision-aware base paths for entities
  const sidebarRoutes = new Set<string>();

  // All entities need index pages (use collision-aware paths)
  for (const entity of output.entities) {
    const basePath = getEntityBasePath(entity.name);
    sidebarRoutes.add(basePath);
  }

  // All page base routes need pages
  for (const page of output.pages) {
    if (page.route === '/') continue;
    const route = page.route.replace(/^\/+/, '');
    const baseRoute = route.split('/')[0];
    if (baseRoute && !baseRoute.startsWith('[')) {
      sidebarRoutes.add(baseRoute);
    }
  }

  // Generate placeholder pages for any missing routes
  for (const route of Array.from(sidebarRoutes)) {
    if (!generatedPagePaths.has(route)) {
      // Get the display name (last segment for e/dashboard -> Dashboard)
      const displayName = route.includes('/') ? route.split('/').pop()! : route;
      const titleCase = displayName.charAt(0).toUpperCase() + displayName.slice(1);
      const placeholderContent = `import { Card, CardHeader } from '@/components';

export default function ${titleCase}Page() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="pb-6 border-b border-border">
        <h1 className="text-2xl font-semibold tracking-tight text-fg">${titleCase}</h1>
        <p className="text-fg-secondary mt-1">Manage ${titleCase.toLowerCase()} data</p>
      </div>

      <Card padding="lg">
        <CardHeader
          title="${titleCase}"
          description="This page is ready for implementation"
        />
        <div className="p-4 bg-muted rounded-lg border border-border-subtle">
          <p className="text-sm text-fg-muted">
            Content for ${titleCase.toLowerCase()} will appear here.
          </p>
        </div>
      </Card>
    </div>
  );
}
`;
      files.push({
        path: `src/app/(app)/${route}/page.tsx`,
        content: placeholderContent,
      });
    }
  }

  // Build file tree
  const fileTree = buildFileTree(files);

  // Write files if not dry run
  if (!dryRun) {
    // Remove existing directory if force
    if (force) {
      try {
        await fs.rm(outputPath, { recursive: true });
      } catch {
        // Directory doesn't exist, that's fine
      }
    }

    // Create output directory
    await fs.mkdir(outputPath, { recursive: true });

    // Write all files
    for (const file of files) {
      const filePath = path.join(outputPath, file.path);
      const fileDir = path.dirname(filePath);

      await fs.mkdir(fileDir, { recursive: true });
      await fs.writeFile(filePath, file.content, 'utf-8');
    }
  }

  return {
    slug,
    outputPath,
    fileTree,
    files,
  };
}

export function getRelativeGeneratedPath(slug: string): string {
  return `generated/${sanitizeSlug(slug)}`;
}
