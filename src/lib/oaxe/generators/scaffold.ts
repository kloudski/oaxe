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

:root {
  --background: #09090b;
  --foreground: #fafafa;
}

body {
  color: var(--foreground);
  background: var(--background);
  font-family: Inter, system-ui, sans-serif;
}

/* Scrollbar styling */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #18181b;
}

::-webkit-scrollbar-thumb {
  background: #3f3f46;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #52525b;
}

/* Focus styles */
*:focus-visible {
  outline: 2px solid #0ea5e9;
  outline-offset: 2px;
}

/* Form input base styles */
input, textarea, select {
  font-family: inherit;
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
      <body className="min-h-screen bg-zinc-950 text-zinc-100 antialiased">
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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">${output.appName}</h1>
        <p className="text-zinc-400 mt-1">${output.elevatorPitch.replace(/'/g, "\\'")}</p>
      </div>

      {/* Stats overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-white">${entityCount}</p>
            <p className="text-sm text-zinc-400 mt-1">Entities</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-white">${pageCount}</p>
            <p className="text-sm text-zinc-400 mt-1">Pages</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-white">${output.apis.length}</p>
            <p className="text-sm text-zinc-400 mt-1">API Routes</p>
          </div>
        </Card>
      </div>

      {/* Quick actions */}
      <Card padding="lg">
        <CardHeader
          title="Getting Started"
          description="Quick actions to help you get started with ${output.appName}"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          ${output.pages.slice(0, 4).map(page => {
            const route = page.route.replace(/^\/+/, '');
            const label = route.split('/')[0] || 'Home';
            const titleCase = label.charAt(0).toUpperCase() + label.slice(1);
            return `
          <a
            href="/${route}"
            className="flex items-center gap-3 p-4 bg-zinc-800/50 hover:bg-zinc-800 rounded-lg transition-colors group"
          >
            <div className="w-10 h-10 bg-primary-500/10 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-white group-hover:text-primary-400 transition-colors">${titleCase}</p>
              <p className="text-sm text-zinc-500">${page.purpose.replace(/'/g, "\\'").substring(0, 50)}...</p>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          ${output.productSpec.coreFeatures.slice(0, 6).map((feature, i) => `
          <div className="p-4 bg-zinc-800/30 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 bg-primary-500/20 rounded flex items-center justify-center">
                <span className="text-xs font-medium text-primary-400">${i + 1}</span>
              </div>
              <span className="text-sm font-medium text-white">Feature ${i + 1}</span>
            </div>
            <p className="text-sm text-zinc-400">${feature.replace(/'/g, "\\'")}</p>
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
