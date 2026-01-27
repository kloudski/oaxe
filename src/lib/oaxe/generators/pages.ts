import type { OaxeOutput } from '../types';
import type { GeneratedFile } from './types';

function sanitizeRoute(route: string): string {
  return route
    .replace(/^\/+/, '')
    .replace(/[^a-zA-Z0-9/-]/g, '')
    .toLowerCase();
}

function pascalCase(str: string): string {
  return str
    .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
    .replace(/^(.)/, (c) => c.toUpperCase());
}

function camelCase(str: string): string {
  const pascal = pascalCase(str);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

function findEntityForPage(pageName: string, entities: OaxeOutput['entities']): OaxeOutput['entities'][0] | null {
  const normalized = pageName.toLowerCase();
  return entities.find(e => {
    const entityName = e.name.toLowerCase();
    return normalized.includes(entityName) ||
           normalized.includes(entityName + 's') ||
           entityName.includes(normalized) ||
           entityName + 's' === normalized;
  }) || null;
}

function mapFieldToInputType(fieldName: string, type: string): string {
  const normalized = type.toLowerCase().trim();
  const name = fieldName.toLowerCase();

  // Check field name patterns first
  if (name.includes('email')) return 'email';
  if (name.includes('url') || name.includes('link') || name.includes('website')) return 'url';
  if (name.includes('description') || name.includes('content') || name.includes('bio') || name.includes('notes')) return 'textarea';
  if (name.includes('status') || name.includes('type') || name.includes('category')) return 'select';

  // Fall back to type-based mapping
  switch (normalized) {
    case 'number':
    case 'int':
    case 'integer':
    case 'float':
    case 'decimal':
      return 'number';
    case 'boolean':
    case 'bool':
      return 'checkbox';
    case 'date':
      return 'date';
    case 'datetime':
    case 'timestamp':
      return 'datetime-local';
    case 'text':
      return 'textarea';
    default:
      return 'text';
  }
}

function generateEntityListPage(
  route: string,
  purpose: string,
  entity: OaxeOutput['entities'][0],
  appName: string
): string {
  const entityName = pascalCase(entity.name);
  const entityVar = camelCase(entity.name);
  const pageName = route.split('/').pop() || 'Page';
  const titleCase = pageName.charAt(0).toUpperCase() + pageName.slice(1);

  // Generate column definitions
  const columns = entity.fields.slice(0, 5).map(field => {
    const fieldName = camelCase(field.name);
    const label = field.name.charAt(0).toUpperCase() + field.name.slice(1).replace(/([A-Z])/g, ' $1');
    return `    { key: '${fieldName}' as keyof ${entityName}, header: '${label}' },`;
  }).join('\n');

  return `'use client';

import { useState } from 'react';
import { DataTable, Card, CardHeader, Button, StatusBadge } from '@/components';
import type { ${entityName} } from '@/lib/db';
import { ${entityVar}Seed } from '@/lib/db/seed';

const columns = [
${columns}
];

export default function ${titleCase}Page() {
  const [data] = useState<${entityName}[]>(${entityVar}Seed);
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">${titleCase}</h1>
          <p className="text-zinc-400 mt-1">${purpose.replace(/'/g, "\\'")}</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Create ${entityName}'}
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader title="Create ${entityName}" description="Add a new ${entityName.toLowerCase()} to the system" />
          <a href="/${route}/new" className="text-primary-400 hover:text-primary-300 text-sm">
            Go to create form →
          </a>
        </Card>
      )}

      <Card padding="none">
        <div className="p-4 border-b border-zinc-800">
          <div className="flex items-center justify-between">
            <p className="text-sm text-zinc-400">
              Showing <span className="font-medium text-white">{data.length}</span> ${entityName.toLowerCase()}s
            </p>
          </div>
        </div>
        <DataTable
          data={data}
          columns={columns}
          onRowClick={(row) => console.log('Clicked:', row)}
          emptyMessage="No ${entityName.toLowerCase()}s found"
        />
      </Card>
    </div>
  );
}
`;
}

function generateEntityFormPage(
  route: string,
  entity: OaxeOutput['entities'][0]
): string {
  const entityName = pascalCase(entity.name);
  const pageName = route.split('/')[0] || 'Entity';
  const titleCase = pageName.charAt(0).toUpperCase() + pageName.slice(1);

  // Generate field configurations
  const fieldConfigs = entity.fields.map(field => {
    const fieldName = camelCase(field.name);
    const label = field.name.charAt(0).toUpperCase() + field.name.slice(1).replace(/([A-Z])/g, ' $1');
    const inputType = mapFieldToInputType(field.name, field.type);

    let config = `    { name: '${fieldName}', label: '${label}', type: '${inputType}' as const`;

    if (inputType === 'select') {
      config += `, options: [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
        { value: 'option3', label: 'Option 3' },
      ]`;
    }

    config += ` },`;
    return config;
  }).join('\n');

  return `'use client';

import { useRouter } from 'next/navigation';
import { EntityForm, Card, CardHeader } from '@/components';
import { ${entityName}Schema } from '@/lib/db';

const fields = [
${fieldConfigs}
];

export default function Create${entityName}Page() {
  const router = useRouter();

  const handleSubmit = async (data: Record<string, unknown>) => {
    console.log('Creating ${entityName}:', data);
    // TODO: Call API to create ${entityName}
    // await fetch('/api/${route}', { method: 'POST', body: JSON.stringify(data) });
    router.push('/${route.split('/')[0]}');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Create ${entityName}</h1>
        <p className="text-zinc-400 mt-1">Add a new ${entityName.toLowerCase()} to the system</p>
      </div>

      <Card>
        <CardHeader
          title="${entityName} Details"
          description="Fill in the information below"
        />
        <EntityForm
          fields={fields}
          schema={${entityName}Schema}
          onSubmit={handleSubmit}
          submitLabel="Create ${entityName}"
        />
      </Card>
    </div>
  );
}
`;
}

function generateEntityDetailPage(
  route: string,
  entity: OaxeOutput['entities'][0]
): string {
  const entityName = pascalCase(entity.name);
  const entityVar = camelCase(entity.name);
  const pageName = route.split('/')[0] || 'Entity';
  const titleCase = pageName.charAt(0).toUpperCase() + pageName.slice(1);

  // Generate field display rows
  const fieldRows = entity.fields.map(field => {
    const fieldName = camelCase(field.name);
    const label = field.name.charAt(0).toUpperCase() + field.name.slice(1).replace(/([A-Z])/g, ' $1');
    return `          <div className="py-3 border-b border-zinc-800 last:border-0">
            <dt className="text-sm text-zinc-500">${label}</dt>
            <dd className="mt-1 text-white">{String(item.${fieldName})}</dd>
          </div>`;
  }).join('\n');

  return `'use client';

import { useParams, useRouter } from 'next/navigation';
import { Card, CardHeader, Button } from '@/components';
import type { ${entityName} } from '@/lib/db';
import { ${entityVar}Seed } from '@/lib/db/seed';

export default function ${entityName}DetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const item = ${entityVar}Seed.find(i => i.id === id) || ${entityVar}Seed[0];

  if (!item) {
    return (
      <div className="text-center py-12">
        <p className="text-zinc-400">${entityName} not found</p>
        <Button onClick={() => router.push('/${route}')} className="mt-4">
          Back to ${titleCase}
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">${entityName} Details</h1>
          <p className="text-zinc-400 mt-1">Viewing ${entityName.toLowerCase()} {id}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => router.push('/${route}')}>
            Back
          </Button>
          <Button>Edit</Button>
        </div>
      </div>

      <Card>
        <CardHeader title="${entityName} Information" />
        <dl className="divide-y divide-zinc-800">
${fieldRows}
        </dl>
      </Card>
    </div>
  );
}
`;
}

function generateSimplePage(
  route: string,
  purpose: string,
  appName: string
): string {
  const pageName = route.split('/').pop() || 'Page';
  const titleCase = pageName.charAt(0).toUpperCase() + pageName.slice(1);

  return `import { Card, CardHeader } from '@/components';

export default function ${titleCase}Page() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">${titleCase}</h1>
        <p className="text-zinc-400 mt-1">${purpose.replace(/'/g, "\\'")}</p>
      </div>

      <Card>
        <CardHeader
          title="${titleCase} Content"
          description="This page is ready for implementation"
        />
        <div className="space-y-4">
          <p className="text-zinc-400">
            This is the ${titleCase.toLowerCase()} page. Add your content and functionality here.
          </p>
          <div className="p-4 bg-zinc-800/50 rounded-lg">
            <p className="text-sm text-zinc-500">
              Purpose: ${purpose.replace(/'/g, "\\'")}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
`;
}

export function generatePages(output: OaxeOutput): GeneratedFile[] {
  const files: GeneratedFile[] = [];

  // Track which entity index pages we've already generated
  const generatedEntityIndexPages = new Set<string>();

  for (const page of output.pages) {
    const route = sanitizeRoute(page.route);

    // Skip root page (handled in scaffold with redirect)
    if (!route || route === '/') continue;

    // Check if this page relates to an entity
    const pageName = route.split('/')[0];
    const matchedEntity = findEntityForPage(pageName, output.entities);

    if (matchedEntity) {
      // Only generate entity index page if route is the base entity route (not a sub-route like [id])
      const isBaseEntityRoute = route === pageName;

      if (isBaseEntityRoute) {
        // Generate entity list page
        const listPath = `src/app/(app)/${route}/page.tsx`;
        const listContent = generateEntityListPage(route, page.purpose, matchedEntity, output.appName);
        files.push({ path: listPath, content: listContent });
        generatedEntityIndexPages.add(matchedEntity.name.toLowerCase());

        // Generate entity create form page
        const formPath = `src/app/(app)/${route}/new/page.tsx`;
        const formContent = generateEntityFormPage(route, matchedEntity);
        files.push({ path: formPath, content: formContent });

        // Generate entity detail page
        const detailPath = `src/app/(app)/${route}/[id]/page.tsx`;
        const detailContent = generateEntityDetailPage(route, matchedEntity);
        files.push({ path: detailPath, content: detailContent });
      } else {
        // This is a sub-route (like /job/[id]), generate it as specified
        const filePath = `src/app/(app)/${route}/page.tsx`;
        const content = generateSimplePage(route, page.purpose, output.appName);
        files.push({ path: filePath, content });
      }
    } else {
      // Generate simple page
      const filePath = `src/app/(app)/${route}/page.tsx`;
      const content = generateSimplePage(route, page.purpose, output.appName);
      files.push({ path: filePath, content });
    }
  }

  // VALIDATION: Ensure every entity has an index page
  // This is critical to prevent 404s when clicking sidebar links
  for (const entity of output.entities) {
    const entitySlug = entity.name.toLowerCase();

    if (!generatedEntityIndexPages.has(entitySlug)) {
      // Generate missing entity index page
      const route = entitySlug;
      const listPath = `src/app/(app)/${route}/page.tsx`;
      const listContent = generateEntityListPage(
        route,
        `Manage ${entity.name}s`,
        entity,
        output.appName
      );
      files.push({ path: listPath, content: listContent });

      // Generate create form page
      const formPath = `src/app/(app)/${route}/new/page.tsx`;
      const formContent = generateEntityFormPage(route, entity);
      files.push({ path: formPath, content: formContent });

      // Generate detail page
      const detailPath = `src/app/(app)/${route}/[id]/page.tsx`;
      const detailContent = generateEntityDetailPage(route, entity);
      files.push({ path: detailPath, content: detailContent });

      generatedEntityIndexPages.add(entitySlug);
    }
  }

  return files;
}
