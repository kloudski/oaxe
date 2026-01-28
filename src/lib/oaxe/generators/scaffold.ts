import type { OaxeOutput, BrandDNA } from '../types';
import type { GeneratedFile } from './types';
import { generateTokenizedTailwindConfig, generateTokenizedGlobalsCss } from './tokens';
import {
  getEmphasisStrategy,
  getDashboardPersonality,
  getQuickActionsTitle,
  getFeaturesTitle,
  getBrandMomentForContext,
  formatBrandMoment,
  getCardElevation,
  type EmphasisStrategy,
} from './brandExpression';

function getFirstPageRoute(output: OaxeOutput): string {
  // Find first non-root page, or default to /dashboard
  const firstPage = output.pages.find(p => p.route !== '/' && p.route !== '');
  if (firstPage) {
    const route = firstPage.route.replace(/^\/+/, '');
    return `/${route}`;
  }
  return '/dashboard';
}

/**
 * M5A: Generate scaffold with Brand DNA expression
 * Accepts optional BrandDNA for dashboard personality and brand moments
 */
export function generateScaffold(output: OaxeOutput, directive: string = '', brandDNA?: BrandDNA): GeneratedFile[] {
  const files: GeneratedFile[] = [];
  const firstPageRoute = getFirstPageRoute(output);

  // M5A: Extract brand expression settings
  const emphasisStrategy = brandDNA ? getEmphasisStrategy(brandDNA) : 'balanced';
  const dashboardPersonality = brandDNA ? getDashboardPersonality(brandDNA) : null;
  const quickActionsTitle = brandDNA ? getQuickActionsTitle(brandDNA) : 'Get Started';
  const featuresTitle = brandDNA ? getFeaturesTitle(brandDNA) : 'Core Features';

  // M5A: Get at most ONE brand moment for dashboard
  const dashboardMoment = brandDNA
    ? getBrandMomentForContext('dashboard_first_load', brandDNA, new Set())
    : null;
  const formattedMoment = dashboardMoment && brandDNA
    ? formatBrandMoment(dashboardMoment, brandDNA)
    : null;

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

  // tailwind.config.ts - OKLCH token-based (no hex codes)
  files.push({
    path: 'tailwind.config.ts',
    content: generateTokenizedTailwindConfig(output, directive),
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

  // src/app/globals.css - Imports OKLCH tokens (no hex codes)
  files.push({
    path: 'src/app/globals.css',
    content: generateTokenizedGlobalsCss(output),
  });

  // src/app/layout.tsx - With theme initialization
  files.push({
    path: 'src/app/layout.tsx',
    content: `import type { Metadata } from 'next';
import { ThemeInitScript } from '@/components/ThemeInitScript';
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen antialiased bg-bg text-fg">
        <ThemeInitScript />
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

  // src/app/(app)/page.tsx (dashboard) - M5A: Uses brand expression
  const entityCount = output.entities.length;
  const pageCount = output.pages.length;

  // M5A: Generate dashboard with personality
  const welcomeMessage = dashboardPersonality?.welcomeMessage || '';
  const primaryCardClass = getCardElevation(emphasisStrategy, true);

  // M5A: Brand moment block (at most ONE per screen)
  const brandMomentBlock = formattedMoment ? `
      {/* Brand moment - ${formattedMoment.title} */}
      <div className="p-4 rounded-lg border border-primary/20 bg-primary-muted/50">
        <p className="text-sm font-medium text-fg">${formattedMoment.title}</p>
        <p className="text-sm text-fg-secondary mt-1">${formattedMoment.message}</p>
      </div>
` : '';

  // M5A: Dashboard block composition based on personality
  const blockType = dashboardPersonality?.blockType || 'actions_first';

  // Generate stats block
  const statsBlock = `
      {/* Stats overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card${primaryCardClass ? ` className="${primaryCardClass}"` : ''}>
          <div className="text-center py-2">
            <p className="text-3xl font-semibold tracking-tight text-fg">${entityCount}</p>
            <p className="text-sm text-fg-muted mt-1">Entities</p>
          </div>
        </Card>
        <Card>
          <div className="text-center py-2">
            <p className="text-3xl font-semibold tracking-tight text-fg">${pageCount}</p>
            <p className="text-sm text-fg-muted mt-1">Pages</p>
          </div>
        </Card>
        <Card>
          <div className="text-center py-2">
            <p className="text-3xl font-semibold tracking-tight text-fg">${output.apis.length}</p>
            <p className="text-sm text-fg-muted mt-1">API Routes</p>
          </div>
        </Card>
      </div>`;

  // Generate quick actions block
  const actionsBlock = `
      {/* Quick actions */}
      <Card padding="lg">
        <CardHeader
          title="${quickActionsTitle}"
          description="${brandDNA?.mood === 'minimal' ? '' : `Quick actions to help you get started with ${output.appName}`}"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-1">
          ${output.pages.slice(0, 4).map(page => {
            const route = page.route.replace(/^\/+/, '');
            const label = route.split('/')[0] || 'Home';
            const titleCase = label.charAt(0).toUpperCase() + label.slice(1);
            return `
          <a
            href="/${route}"
            className="flex items-center gap-4 p-4 rounded-xl border border-border hover:border-border-strong hover:bg-muted transition-all duration-150 group"
          >
            <div className="w-10 h-10 bg-primary-muted rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="min-w-0">
              <p className="font-medium text-fg group-hover:text-primary transition-colors">${titleCase}</p>
              <p className="text-sm text-fg-muted truncate">${page.purpose.replace(/'/g, "\\'").substring(0, 50)}...</p>
            </div>
          </a>`;
          }).join('')}
        </div>
      </Card>`;

  // Generate features block
  const featuresBlock = `
      {/* Features */}
      <Card padding="lg">
        <CardHeader
          title="${featuresTitle}"
          description="${brandDNA?.mood === 'minimal' ? '' : `What ${output.appName} offers`}"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-1">
          ${output.productSpec.coreFeatures.slice(0, 6).map((feature, i) => `
          <div className="p-4 rounded-lg border border-border-subtle bg-muted">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 bg-primary-muted rounded flex items-center justify-center">
                <span className="text-xs font-semibold text-primary-600">${i + 1}</span>
              </div>
              <span className="text-sm font-medium text-fg">Feature ${i + 1}</span>
            </div>
            <p className="text-sm text-fg-secondary">${feature.replace(/'/g, "\\'")}</p>
          </div>`).join('')}
        </div>
      </Card>`;

  // M5A: Compose dashboard blocks based on personality type
  let dashboardBlocks: string;
  switch (blockType) {
    case 'metrics_first':
      // Analytics, finance, legal - lead with numbers
      dashboardBlocks = `${statsBlock}
${brandMomentBlock}${actionsBlock}
${featuresBlock}`;
      break;
    case 'guidance_first':
      // Healthcare, wellness, education - lead with features/guidance
      dashboardBlocks = `${brandMomentBlock}${featuresBlock}
${actionsBlock}
${statsBlock}`;
      break;
    case 'activity_first':
      // Social, ecommerce, energy - lead with actions
      dashboardBlocks = `${brandMomentBlock}${actionsBlock}
${statsBlock}
${featuresBlock}`;
      break;
    case 'actions_first':
    default:
      // Technology, productivity, creative - balanced with actions first
      dashboardBlocks = `${statsBlock}
${brandMomentBlock}${actionsBlock}
${featuresBlock}`;
  }

  files.push({
    path: 'src/app/(app)/page.tsx',
    content: `import { Card, CardHeader } from '@/components';

export default function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="pb-6 border-b border-border">
        <h1 className="text-2xl font-semibold tracking-tight text-fg">${output.appName}</h1>
        <p className="text-fg-secondary mt-2 max-w-2xl">${output.elevatorPitch.replace(/'/g, "\\'")}</p>${welcomeMessage ? `
        <p className="text-fg-muted mt-1">${welcomeMessage}</p>` : ''}
      </div>
${dashboardBlocks}
    </div>
  );
}
`,
  });

  return files;
}
