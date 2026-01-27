import type { OaxeOutput } from '../types';
import type { GeneratedFile } from './types';

function getFirstPageRoute(output: OaxeOutput): string {
  // Find first non-root page, or default to /dashboard
  const firstPage = output.pages.find(p => p.route !== '/' && p.route !== '');
  if (firstPage) {
    const route = firstPage.route.replace(/^\/+/, '');
    return `/${route}`;
  }
  return '/dashboard';
}

export function generateScaffold(output: OaxeOutput): GeneratedFile[] {
  const files: GeneratedFile[] = [];
  const firstPageRoute = getFirstPageRoute(output);

  // package.json
  files.push({
    path: 'package.json',
    content: JSON.stringify({
      name: output.slug,
      version: '0.1.0',
      private: true,
      scripts: {
        dev: 'next dev',
        build: 'next build',
        start: 'next start',
        lint: 'next lint',
      },
      dependencies: {
        next: '14.2.28',
        react: '^18.3.1',
        'react-dom': '^18.3.1',
        zod: '^3.24.1',
      },
      devDependencies: {
        '@types/node': '^20.17.12',
        '@types/react': '^18.3.18',
        '@types/react-dom': '^18.3.5',
        autoprefixer: '^10.4.20',
        postcss: '^8.4.49',
        tailwindcss: '^3.4.17',
        typescript: '^5.7.3',
      },
    }, null, 2),
  });

  // next.config.mjs
  files.push({
    path: 'next.config.mjs',
    content: `/** @type {import('next').NextConfig} */
const nextConfig = {};

export default nextConfig;
`,
  });

  // tsconfig.json
  files.push({
    path: 'tsconfig.json',
    content: JSON.stringify({
      compilerOptions: {
        lib: ['dom', 'dom.iterable', 'esnext'],
        allowJs: true,
        skipLibCheck: true,
        strict: true,
        noEmit: true,
        esModuleInterop: true,
        module: 'esnext',
        moduleResolution: 'bundler',
        resolveJsonModule: true,
        isolatedModules: true,
        jsx: 'preserve',
        incremental: true,
        plugins: [{ name: 'next' }],
        paths: {
          '@/*': ['./src/*'],
        },
      },
      include: ['next-env.d.ts', '**/*.ts', '**/*.tsx', '.next/types/**/*.ts'],
      exclude: ['node_modules'],
    }, null, 2),
  });

  // tailwind.config.ts
  const primaryColor = output.designTokens.colors[0] || '#0ea5e9';
  files.push({
    path: 'tailwind.config.ts',
    content: `import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
      },
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '${primaryColor}',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
      },
    },
  },
  plugins: [],
};

export default config;
`,
  });

  // postcss.config.js
  files.push({
    path: 'postcss.config.js',
    content: `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
`,
  });

  // .env.example
  files.push({
    path: '.env.example',
    content: `# ${output.appName} Environment Variables
# Copy this file to .env.local and fill in the values

# API Configuration
# API_URL=http://localhost:3000

# Database (when ready)
# DATABASE_URL=

# Auth (when ready)
# AUTH_SECRET=
`,
  });

  // .gitignore
  files.push({
    path: '.gitignore',
    content: `# Dependencies
/node_modules
/.pnp
.pnp.js
.yarn/install-state.gz

# Testing
/coverage

# Next.js
/.next/
/out/

# Production
/build

# Misc
.DS_Store
*.pem

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Local env files
.env*.local
.env

# Vercel
.vercel

# TypeScript
*.tsbuildinfo
next-env.d.ts
`,
  });

  // src/app/globals.css
  files.push({
    path: 'src/app/globals.css',
    content: `@tailwind base;
@tailwind components;
@tailwind utilities;

/* ===== LIGHT-MODE-FIRST DESIGN SYSTEM ===== */

:root {
  /* Background hierarchy */
  --bg-primary: #ffffff;
  --bg-secondary: #fafafa;
  --bg-tertiary: #f4f4f5;
  --bg-hover: #f0f0f1;
  --bg-active: #e8e8ea;

  /* Text hierarchy */
  --text-primary: #18181b;
  --text-secondary: #52525b;
  --text-muted: #71717a;
  --text-placeholder: #a1a1aa;

  /* Border colors */
  --border-default: #e4e4e7;
  --border-subtle: #f4f4f5;
  --border-strong: #d4d4d8;

  /* Shadow system */
  --shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.04);
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.05), 0 2px 4px rgba(0, 0, 0, 0.03);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.05), 0 4px 6px rgba(0, 0, 0, 0.03);

  /* Accent */
  --accent: ${primaryColor};
  --accent-hover: #0284c7;
  --accent-muted: rgba(14, 165, 233, 0.1);

  /* Selection */
  --selection-bg: rgba(14, 165, 233, 0.15);
}

.dark {
  --bg-primary: #09090b;
  --bg-secondary: #18181b;
  --bg-tertiary: #27272a;
  --bg-hover: #3f3f46;
  --bg-active: #52525b;

  --text-primary: #fafafa;
  --text-secondary: #a1a1aa;
  --text-muted: #71717a;
  --text-placeholder: #52525b;

  --border-default: #27272a;
  --border-subtle: #1f1f23;
  --border-strong: #3f3f46;

  --shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.2);
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.25), 0 2px 4px rgba(0, 0, 0, 0.15);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.25), 0 4px 6px rgba(0, 0, 0, 0.15);

  --accent-muted: rgba(14, 165, 233, 0.15);
  --selection-bg: rgba(14, 165, 233, 0.25);
}

/* ===== BASE STYLES ===== */

html {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}

body {
  color: var(--text-primary);
  background: var(--bg-secondary);
  font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-feature-settings: 'cv02', 'cv03', 'cv04', 'cv11';
  line-height: 1.5;
}

/* ===== TYPOGRAPHY ===== */

h1, h2, h3, h4, h5, h6 {
  font-weight: 600;
  letter-spacing: -0.02em;
  color: var(--text-primary);
}

h1 { font-size: 1.875rem; line-height: 2.25rem; }
h2 { font-size: 1.5rem; line-height: 2rem; }
h3 { font-size: 1.25rem; line-height: 1.75rem; }
h4 { font-size: 1.125rem; line-height: 1.5rem; }

p { color: var(--text-secondary); }

.text-muted { color: var(--text-muted); }

/* ===== SELECTION ===== */

::selection {
  background: var(--selection-bg);
  color: var(--text-primary);
}

/* ===== SCROLLBAR ===== */

::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: var(--border-strong);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--text-muted);
}

/* ===== FOCUS RINGS ===== */

*:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px var(--bg-primary), 0 0 0 4px var(--accent);
}

/* ===== FORM BASE ===== */

input, textarea, select {
  font-family: inherit;
  font-size: inherit;
  color: var(--text-primary);
}

input::placeholder,
textarea::placeholder {
  color: var(--text-placeholder);
}

/* ===== UTILITY CLASSES ===== */

.content-width {
  max-width: 65ch;
}

.section-gap {
  gap: 1.5rem;
}

@media (min-width: 768px) {
  .section-gap {
    gap: 2rem;
  }
}
`,
  });

  // src/app/layout.tsx
  files.push({
    path: 'src/app/layout.tsx',
    content: `import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '${output.appName}',
  description: '${output.elevatorPitch.replace(/'/g, "\\'")}',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
`,
  });

  // src/app/(app)/layout.tsx - App layout with shell
  files.push({
    path: 'src/app/(app)/layout.tsx',
    content: `import { AppShell } from '@/components/AppShell';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}
`,
  });

  // src/app/page.tsx (root redirect)
  files.push({
    path: 'src/app/page.tsx',
    content: `import { redirect } from 'next/navigation';

export default function Home() {
  redirect('${firstPageRoute}');
}
`,
  });

  // src/app/(app)/page.tsx (dashboard)
  const entityCount = output.entities.length;
  const pageCount = output.pages.length;
  files.push({
    path: 'src/app/(app)/page.tsx',
    content: `import { Card, CardHeader } from '@/components';

export default function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="pb-6 border-b border-[var(--border-default)]">
        <h1 className="text-2xl font-semibold tracking-tight">${output.appName}</h1>
        <p className="text-[var(--text-secondary)] mt-2 max-w-2xl">${output.elevatorPitch.replace(/'/g, "\\'")}</p>
      </div>

      {/* Stats overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card>
          <div className="text-center py-2">
            <p className="text-3xl font-semibold tracking-tight">${entityCount}</p>
            <p className="text-sm text-[var(--text-muted)] mt-1">Entities</p>
          </div>
        </Card>
        <Card>
          <div className="text-center py-2">
            <p className="text-3xl font-semibold tracking-tight">${pageCount}</p>
            <p className="text-sm text-[var(--text-muted)] mt-1">Pages</p>
          </div>
        </Card>
        <Card>
          <div className="text-center py-2">
            <p className="text-3xl font-semibold tracking-tight">${output.apis.length}</p>
            <p className="text-sm text-[var(--text-muted)] mt-1">API Routes</p>
          </div>
        </Card>
      </div>

      {/* Quick actions */}
      <Card padding="lg">
        <CardHeader
          title="Getting Started"
          description="Quick actions to help you get started with ${output.appName}"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-1">
          ${output.pages.slice(0, 4).map(page => {
            const route = page.route.replace(/^\/+/, '');
            const label = route.split('/')[0] || 'Home';
            const titleCase = label.charAt(0).toUpperCase() + label.slice(1);
            return `
          <a
            href="/${route}"
            className="flex items-center gap-4 p-4 rounded-xl border border-[var(--border-default)] hover:border-[var(--border-strong)] hover:bg-[var(--bg-hover)] transition-all duration-150 group"
          >
            <div className="w-10 h-10 bg-[var(--accent-muted)] rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="min-w-0">
              <p className="font-medium text-[var(--text-primary)] group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">${titleCase}</p>
              <p className="text-sm text-[var(--text-muted)] truncate">${page.purpose.replace(/'/g, "\\'").substring(0, 50)}...</p>
            </div>
          </a>`;
          }).join('')}
        </div>
      </Card>

      {/* Features */}
      <Card padding="lg">
        <CardHeader
          title="Core Features"
          description="What ${output.appName} offers"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-1">
          ${output.productSpec.coreFeatures.slice(0, 6).map((feature, i) => `
          <div className="p-4 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-tertiary)]">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 bg-[var(--accent-muted)] rounded flex items-center justify-center">
                <span className="text-xs font-semibold text-primary-600 dark:text-primary-400">${i + 1}</span>
              </div>
              <span className="text-sm font-medium">Feature ${i + 1}</span>
            </div>
            <p className="text-sm text-[var(--text-secondary)]">${feature.replace(/'/g, "\\'")}</p>
          </div>`).join('')}
        </div>
      </Card>
    </div>
  );
}
`,
  });

  return files;
}
