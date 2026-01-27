import { promises as fs } from 'fs';
import path from 'path';
import type { OaxeOutput } from '../types';
import type { GenerationResult, FileTreeNode, GeneratedFile, GeneratorOptions } from './types';
import { generateScaffold } from './scaffold';
import { generatePages } from './pages';
import { generateApis } from './apis';
import { generateSchema } from './schema';

export * from './types';

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

export async function generateApp(
  output: OaxeOutput,
  options: GeneratorOptions = {}
): Promise<GenerationResult> {
  const { dryRun = false, force = false } = options;
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
  const files: GeneratedFile[] = [
    ...generateScaffold(output),
    ...generatePages(output),
    ...generateApis(output),
    ...generateSchema(output),
  ];

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
