import type { OaxeOutput } from '../types';
import type { GeneratedFile } from './types';

export function generateScaffold(output: OaxeOutput): GeneratedFile[] {
  const files: GeneratedFile[] = [];

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
        <nav className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <a href="/" className="text-xl font-bold text-white">
              ${output.appName}
            </a>
            <div className="flex gap-6 text-sm text-zinc-400">
              <a href="/" className="hover:text-white transition-colors">Home</a>
            </div>
          </div>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}
`,
  });

  // src/app/page.tsx (landing page)
  files.push({
    path: 'src/app/page.tsx',
    content: `export default function Home() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="text-center space-y-6">
        <h1 className="text-5xl font-bold text-white">
          ${output.appName}
        </h1>
        <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
          ${output.elevatorPitch.replace(/'/g, "\\'")}
        </p>
        <div className="pt-8">
          <a
            href="#features"
            className="inline-flex items-center px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors"
          >
            Get Started
          </a>
        </div>
      </div>

      <section id="features" className="mt-24">
        <h2 className="text-3xl font-bold text-white text-center mb-12">
          Core Features
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          ${output.productSpec.coreFeatures.map((feature, i) => `
          <div className="p-6 bg-zinc-900 rounded-xl border border-zinc-800">
            <h3 className="text-lg font-semibold text-white mb-2">Feature ${i + 1}</h3>
            <p className="text-zinc-400 text-sm">${feature.replace(/'/g, "\\'")}</p>
          </div>`).join('')}
        </div>
      </section>
    </div>
  );
}
`,
  });

  return files;
}
