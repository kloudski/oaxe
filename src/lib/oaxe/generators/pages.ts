import type { OaxeOutput } from '../types';
import type { GeneratedFile } from './types';

function sanitizeRoute(route: string): string {
  // Remove leading slash and normalize
  return route
    .replace(/^\/+/, '')
    .replace(/[^a-zA-Z0-9/-]/g, '')
    .toLowerCase();
}

function generatePageComponent(
  route: string,
  purpose: string,
  appName: string
): string {
  const pageName = route.split('/').pop() || 'Page';
  const titleCase = pageName.charAt(0).toUpperCase() + pageName.slice(1);

  return `export default function ${titleCase}Page() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="space-y-6">
        <h1 className="text-4xl font-bold text-white">
          ${titleCase}
        </h1>
        <p className="text-zinc-400">
          ${purpose.replace(/'/g, "\\'")}
        </p>

        <div className="mt-8 p-6 bg-zinc-900 rounded-xl border border-zinc-800">
          <p className="text-zinc-500 text-sm">
            This page is a placeholder. Implement your ${titleCase.toLowerCase()} functionality here.
          </p>
        </div>
      </div>
    </div>
  );
}
`;
}

export function generatePages(output: OaxeOutput): GeneratedFile[] {
  const files: GeneratedFile[] = [];

  for (const page of output.pages) {
    const route = sanitizeRoute(page.route);

    // Skip root page (already generated in scaffold)
    if (!route || route === '/') continue;

    const filePath = `src/app/${route}/page.tsx`;
    const content = generatePageComponent(route, page.purpose, output.appName);

    files.push({ path: filePath, content });
  }

  return files;
}
