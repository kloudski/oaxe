import type { OaxeOutput, BrandDNA, LayoutGrammar, EntityViewType, EntityViewConfig, VisualEmphasis } from '../types';
import type { GeneratedFile } from './types';
import {
  getEmphasisStrategy,
  getEmptyStateCopy,
  getCTALabel,
  getFormHeader,
  getNotFoundCopy,
  getSubmitLabel,
  getSecondaryVerb,
  getCardElevation,
  type EmphasisStrategy,
} from './brandExpression';
import {
  getSectionEmphasisClasses,
  getDataTableEmphasisClasses,
  getFormEmphasisClasses,
} from './visualEmphasis';

// Reserved app routes that entity slugs cannot collide with
// If an entity name matches one of these, its routes are prefixed with /e/
export const RESERVED_APP_ROUTES = new Set([
  'dashboard',
  'settings',
  'profile',
  'billing',
  'reports',
  'admin',
  'api',
  'auth',
]);

// Helper to get the base path for an entity (checks for collision with reserved routes)
export function getEntityBasePath(entitySlug: string): string {
  const normalized = entitySlug.toLowerCase();
  return RESERVED_APP_ROUTES.has(normalized) ? `e/${normalized}` : normalized;
}

// Helper to get the label for an entity (appends " (Entity)" if collides with reserved routes)
export function getEntityLabel(entityName: string): string {
  const normalized = entityName.toLowerCase();
  const titleCase = entityName.charAt(0).toUpperCase() + entityName.slice(1);
  return RESERVED_APP_ROUTES.has(normalized) ? `${titleCase} (Entity)` : titleCase;
}

function sanitizeRoute(route: string): string {
  return route
    .replace(/^\/+/, '')
    .replace(/[^a-zA-Z0-9/-]/g, '')
    .toLowerCase();
}

// Check if a route segment is a parameter (e.g., :id, [id], :param)
// After sanitization, :id becomes id - we need to check original route
function isParameterizedRoute(route: string): boolean {
  // Check for common parameter patterns: :id, :param, [id], etc.
  return /:\w+|[\[\]]/i.test(route);
}

// Check if a route's final segment is a parameter
function endsWithParameter(route: string): boolean {
  const segments = route.split('/');
  const lastSegment = segments[segments.length - 1];
  return /^:\w+$|^\[\w+\]$/.test(lastSegment);
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
  basePath: string,
  purpose: string,
  entity: OaxeOutput['entities'][0],
  appName: string,
  brandDNA?: BrandDNA,
  entityViewConfig?: EntityViewConfig
): string {
  const entityName = pascalCase(entity.name);
  const entityVar = camelCase(entity.name);
  const label = getEntityLabel(entity.name);

  // M5B: Get view type from grammar or default to table
  const viewType = entityViewConfig?.viewType || 'table';
  const createPattern = entityViewConfig?.createPattern || 'page';

  // Brand expression: Get brand-aware copy
  const ctaLabel = brandDNA ? getCTALabel(entity.name, brandDNA) : `New ${entityName}`;
  const emptyCopy = brandDNA
    ? getEmptyStateCopy(entity.name, brandDNA)
    : { headline: `No ${entityName.toLowerCase()}s found`, subline: '' };
  const emphasisStrategy = brandDNA ? getEmphasisStrategy(brandDNA) : 'balanced';
  const cardElevation = getCardElevation(emphasisStrategy, false);

  // M5B: Generate different list pages based on view type
  switch (viewType) {
    case 'cards':
      return generateCardsListPage(basePath, purpose, entity, entityName, entityVar, label, ctaLabel, emptyCopy, cardElevation, createPattern);
    case 'kanban':
      return generateKanbanListPage(basePath, purpose, entity, entityName, entityVar, label, ctaLabel, emptyCopy, createPattern);
    case 'timeline':
      return generateTimelineListPage(basePath, purpose, entity, entityName, entityVar, label, ctaLabel, emptyCopy, createPattern);
    case 'feed':
      return generateFeedListPage(basePath, purpose, entity, entityName, entityVar, label, ctaLabel, emptyCopy, createPattern);
    case 'table':
    default:
      return generateTableListPage(basePath, purpose, entity, entityName, entityVar, label, ctaLabel, emptyCopy, cardElevation, createPattern);
  }
}

// M5B: Table view (default)
function generateTableListPage(
  basePath: string,
  purpose: string,
  entity: OaxeOutput['entities'][0],
  entityName: string,
  entityVar: string,
  label: string,
  ctaLabel: string,
  emptyCopy: { headline: string; subline: string },
  cardElevation: string,
  createPattern: 'page' | 'modal'
): string {
  // Generate column definitions
  const columns = entity.fields.slice(0, 5).map(field => {
    const fieldName = camelCase(field.name);
    const fieldLabel = field.name.charAt(0).toUpperCase() + field.name.slice(1).replace(/([A-Z])/g, ' $1');
    return `    { key: '${fieldName}' as keyof ${entityName}, header: '${fieldLabel}' },`;
  }).join('\n');

  const modalImport = createPattern === 'modal' ? ", Modal, EntityForm" : '';
  const modalState = createPattern === 'modal' ? "\n  const [showCreate, setShowCreate] = useState(false);" : '';
  const ctaAction = createPattern === 'modal'
    ? "onClick={() => setShowCreate(true)}"
    : `onClick={() => router.push('/${basePath}/new')}`;
  const modalComponent = createPattern === 'modal' ? `

      {/* Create Modal */}
      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Create ${entityName}">
        <EntityForm
          fields={[]}
          onSubmit={async () => { setShowCreate(false); }}
          onCancel={() => setShowCreate(false)}
          submitLabel="${ctaLabel}"
        />
      </Modal>` : '';

  return `'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DataTable, Card, Button${modalImport} } from '@/components';
import type { ${entityName} } from '@/lib/db';
import { ${entityVar}Seed } from '@/lib/db/seed';

const columns = [
${columns}
];

export default function ${entityName}ListPage() {
  const router = useRouter();
  const [data] = useState<${entityName}[]>(${entityVar}Seed);${modalState}

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-start justify-between pb-6 border-b border-border">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-fg">${label}</h1>
          <p className="text-fg-secondary mt-1">${purpose.replace(/'/g, "\\'")}</p>
        </div>
        <Button ${ctaAction}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          ${ctaLabel}
        </Button>
      </div>

      {/* Table card */}
      <Card padding="none"${cardElevation ? ` className="${cardElevation}"` : ''}>
        <div className="px-5 py-4 border-b border-border-subtle">
          <div className="flex items-center justify-between">
            <p className="text-sm text-fg-muted">
              <span className="font-medium text-fg">{data.length}</span> ${entityName.toLowerCase()}s
            </p>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                <svg className="w-4 h-4 text-fg-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        <DataTable
          data={data}
          columns={columns}
          onRowClick={(row) => router.push(\`/${basePath}/\${row.id}\`)}
          emptyMessage="${emptyCopy.headline}"
        />
      </Card>${modalComponent}
    </div>
  );
}
`;
}

// M5B: Cards view
function generateCardsListPage(
  basePath: string,
  purpose: string,
  entity: OaxeOutput['entities'][0],
  entityName: string,
  entityVar: string,
  label: string,
  ctaLabel: string,
  emptyCopy: { headline: string; subline: string },
  cardElevation: string,
  createPattern: 'page' | 'modal'
): string {
  const primaryField = entity.fields[0]?.name ? camelCase(entity.fields[0].name) : 'id';
  const secondaryField = entity.fields[1]?.name ? camelCase(entity.fields[1].name) : null;

  const modalImport = createPattern === 'modal' ? ", Modal, EntityForm" : '';
  const modalState = createPattern === 'modal' ? "\n  const [showCreate, setShowCreate] = useState(false);" : '';
  const ctaAction = createPattern === 'modal'
    ? "onClick={() => setShowCreate(true)}"
    : `onClick={() => router.push('/${basePath}/new')}`;
  const modalComponent = createPattern === 'modal' ? `

      {/* Create Modal */}
      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Create ${entityName}">
        <EntityForm
          fields={[]}
          onSubmit={async () => { setShowCreate(false); }}
          onCancel={() => setShowCreate(false)}
          submitLabel="${ctaLabel}"
        />
      </Modal>` : '';

  return `'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CardList, Button${modalImport} } from '@/components';
import type { ${entityName} } from '@/lib/db';
import { ${entityVar}Seed } from '@/lib/db/seed';

export default function ${entityName}ListPage() {
  const router = useRouter();
  const [data] = useState<${entityName}[]>(${entityVar}Seed);${modalState}

  // Transform data for CardList
  const items = data.map(item => ({
    id: item.id,
    title: String(item.${primaryField} || item.id),
    subtitle: ${secondaryField ? `String(item.${secondaryField} || '')` : "undefined"},
  }));

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-start justify-between pb-6 border-b border-border">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-fg">${label}</h1>
          <p className="text-fg-secondary mt-1">${purpose.replace(/'/g, "\\'")}</p>
        </div>
        <Button ${ctaAction}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          ${ctaLabel}
        </Button>
      </div>

      {/* Cards grid - M5B */}
      <CardList
        data={items}
        onItemClick={(item) => router.push(\`/${basePath}/\${item.id}\`)}
        emptyMessage="${emptyCopy.headline}"
        columns={3}
      />${modalComponent}
    </div>
  );
}
`;
}

// M5B: Kanban view
function generateKanbanListPage(
  basePath: string,
  purpose: string,
  entity: OaxeOutput['entities'][0],
  entityName: string,
  entityVar: string,
  label: string,
  ctaLabel: string,
  emptyCopy: { headline: string; subline: string },
  createPattern: 'page' | 'modal'
): string {
  // Find status field
  const statusField = entity.fields.find(f =>
    ['status', 'stage', 'state', 'phase'].some(p => f.name.toLowerCase().includes(p))
  );
  const statusFieldName = statusField ? camelCase(statusField.name) : 'status';
  const titleField = entity.fields.find(f =>
    ['name', 'title', 'label'].some(p => f.name.toLowerCase().includes(p))
  ) || entity.fields[0];
  const titleFieldName = titleField ? camelCase(titleField.name) : 'id';

  const modalImport = createPattern === 'modal' ? ", Modal, EntityForm" : '';
  const modalState = createPattern === 'modal' ? "\n  const [showCreate, setShowCreate] = useState(false);" : '';
  const ctaAction = createPattern === 'modal'
    ? "onClick={() => setShowCreate(true)}"
    : `onClick={() => router.push('/${basePath}/new')}`;
  const modalComponent = createPattern === 'modal' ? `

      {/* Create Modal */}
      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Create ${entityName}">
        <EntityForm
          fields={[]}
          onSubmit={async () => { setShowCreate(false); }}
          onCancel={() => setShowCreate(false)}
          submitLabel="${ctaLabel}"
        />
      </Modal>` : '';

  return `'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { KanbanBoard, Button${modalImport} } from '@/components';
import type { ${entityName} } from '@/lib/db';
import { ${entityVar}Seed } from '@/lib/db/seed';

// Define kanban columns based on status values
const STATUSES = ['pending', 'in_progress', 'completed'];

export default function ${entityName}ListPage() {
  const router = useRouter();
  const [data] = useState<${entityName}[]>(${entityVar}Seed);${modalState}

  // Group items by status for kanban
  const columns = useMemo(() => {
    return STATUSES.map(status => ({
      id: status,
      title: status.replace('_', ' ').replace(/\\b\\w/g, l => l.toUpperCase()),
      items: data
        .filter(item => (item.${statusFieldName} as string || 'pending') === status)
        .map(item => ({
          id: item.id,
          title: String(item.${titleFieldName} || item.id),
          status: String(item.${statusFieldName} || 'pending'),
        })),
    }));
  }, [data]);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-start justify-between pb-6 border-b border-border">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-fg">${label}</h1>
          <p className="text-fg-secondary mt-1">${purpose.replace(/'/g, "\\'")}</p>
        </div>
        <Button ${ctaAction}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          ${ctaLabel}
        </Button>
      </div>

      {/* Kanban board - M5B */}
      <KanbanBoard
        columns={columns}
        onItemClick={(item) => router.push(\`/${basePath}/\${item.id}\`)}
      />${modalComponent}
    </div>
  );
}
`;
}

// M5B: Timeline view
function generateTimelineListPage(
  basePath: string,
  purpose: string,
  entity: OaxeOutput['entities'][0],
  entityName: string,
  entityVar: string,
  label: string,
  ctaLabel: string,
  emptyCopy: { headline: string; subline: string },
  createPattern: 'page' | 'modal'
): string {
  // Find date and title fields
  const dateField = entity.fields.find(f =>
    ['date', 'time', 'created', 'timestamp'].some(p => f.name.toLowerCase().includes(p))
  ) || entity.fields[0];
  const dateFieldName = dateField ? camelCase(dateField.name) : 'createdAt';

  const titleField = entity.fields.find(f =>
    ['name', 'title', 'label', 'subject'].some(p => f.name.toLowerCase().includes(p))
  ) || entity.fields[0];
  const titleFieldName = titleField ? camelCase(titleField.name) : 'id';

  const descField = entity.fields.find(f =>
    ['description', 'content', 'body', 'note'].some(p => f.name.toLowerCase().includes(p))
  );
  const descFieldName = descField ? camelCase(descField.name) : null;

  const modalImport = createPattern === 'modal' ? ", Modal, EntityForm" : '';
  const modalState = createPattern === 'modal' ? "\n  const [showCreate, setShowCreate] = useState(false);" : '';
  const ctaAction = createPattern === 'modal'
    ? "onClick={() => setShowCreate(true)}"
    : `onClick={() => router.push('/${basePath}/new')}`;
  const modalComponent = createPattern === 'modal' ? `

      {/* Create Modal */}
      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Create ${entityName}">
        <EntityForm
          fields={[]}
          onSubmit={async () => { setShowCreate(false); }}
          onCancel={() => setShowCreate(false)}
          submitLabel="${ctaLabel}"
        />
      </Modal>` : '';

  return `'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Timeline, Button${modalImport} } from '@/components';
import type { ${entityName} } from '@/lib/db';
import { ${entityVar}Seed } from '@/lib/db/seed';

export default function ${entityName}ListPage() {
  const router = useRouter();
  const [data] = useState<${entityName}[]>(${entityVar}Seed);${modalState}

  // Transform data for Timeline
  const items = data.map(item => ({
    id: item.id,
    title: String(item.${titleFieldName} || item.id),
    date: String(item.${dateFieldName} || new Date().toISOString().split('T')[0]),
    ${descFieldName ? `description: String(item.${descFieldName} || ''),` : ''}
  }));

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-start justify-between pb-6 border-b border-border">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-fg">${label}</h1>
          <p className="text-fg-secondary mt-1">${purpose.replace(/'/g, "\\'")}</p>
        </div>
        <Button ${ctaAction}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          ${ctaLabel}
        </Button>
      </div>

      {/* Timeline - M5B */}
      <Timeline
        items={items}
        onItemClick={(item) => router.push(\`/${basePath}/\${item.id}\`)}
        emptyMessage="${emptyCopy.headline}"
      />${modalComponent}
    </div>
  );
}
`;
}

// M5B: Feed view
function generateFeedListPage(
  basePath: string,
  purpose: string,
  entity: OaxeOutput['entities'][0],
  entityName: string,
  entityVar: string,
  label: string,
  ctaLabel: string,
  emptyCopy: { headline: string; subline: string },
  createPattern: 'page' | 'modal'
): string {
  // Find content and author fields
  const contentField = entity.fields.find(f =>
    ['content', 'body', 'message', 'text', 'post'].some(p => f.name.toLowerCase().includes(p))
  ) || entity.fields[0];
  const contentFieldName = contentField ? camelCase(contentField.name) : 'content';

  const authorField = entity.fields.find(f =>
    ['author', 'user', 'creator', 'name'].some(p => f.name.toLowerCase().includes(p))
  );
  const authorFieldName = authorField ? camelCase(authorField.name) : null;

  const modalImport = createPattern === 'modal' ? ", Modal, EntityForm" : '';
  const modalState = createPattern === 'modal' ? "\n  const [showCreate, setShowCreate] = useState(false);" : '';
  const ctaAction = createPattern === 'modal'
    ? "onClick={() => setShowCreate(true)}"
    : `onClick={() => router.push('/${basePath}/new')}`;
  const modalComponent = createPattern === 'modal' ? `

      {/* Create Modal */}
      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Create ${entityName}">
        <EntityForm
          fields={[]}
          onSubmit={async () => { setShowCreate(false); }}
          onCancel={() => setShowCreate(false)}
          submitLabel="${ctaLabel}"
        />
      </Modal>` : '';

  return `'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Feed, Button${modalImport} } from '@/components';
import type { ${entityName} } from '@/lib/db';
import { ${entityVar}Seed } from '@/lib/db/seed';

export default function ${entityName}ListPage() {
  const router = useRouter();
  const [data] = useState<${entityName}[]>(${entityVar}Seed);${modalState}

  // Transform data for Feed
  const items = data.map(item => ({
    id: item.id,
    content: String(item.${contentFieldName} || ''),
    ${authorFieldName ? `author: String(item.${authorFieldName} || ''),` : ''}
    timestamp: new Date().toLocaleDateString(),
  }));

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-start justify-between pb-6 border-b border-border">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-fg">${label}</h1>
          <p className="text-fg-secondary mt-1">${purpose.replace(/'/g, "\\'")}</p>
        </div>
        <Button ${ctaAction}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          ${ctaLabel}
        </Button>
      </div>

      {/* Feed - M5B */}
      <Feed
        items={items}
        onItemClick={(item) => router.push(\`/${basePath}/\${item.id}\`)}
        emptyMessage="${emptyCopy.headline}"
      />${modalComponent}
    </div>
  );
}
`;
}

function generateEntityFormPage(
  basePath: string,
  entity: OaxeOutput['entities'][0],
  brandDNA?: BrandDNA
): string {
  const entityName = pascalCase(entity.name);
  const label = getEntityLabel(entity.name);

  // Brand expression: Get brand-aware copy
  const formHeader = brandDNA
    ? getFormHeader(entity.name, brandDNA)
    : { title: `${entityName} Details`, description: `Fill in the information below to create a new ${entityName.toLowerCase()}` };
  const submitLabel = brandDNA
    ? getSubmitLabel(entity.name, brandDNA)
    : `Create ${entityName}`;
  const pageTitle = brandDNA
    ? getFormHeader(entity.name, brandDNA).title
    : `Create ${entityName}`;

  // Generate field configurations
  const fieldConfigs = entity.fields.map(field => {
    const fieldName = camelCase(field.name);
    const fieldLabel = field.name.charAt(0).toUpperCase() + field.name.slice(1).replace(/([A-Z])/g, ' $1');
    const inputType = mapFieldToInputType(field.name, field.type);

    let config = `    { name: '${fieldName}', label: '${fieldLabel}', type: '${inputType}' as const, required: true`;

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
import { EntityForm, Card, CardHeader, Button } from '@/components';
import { ${entityName}Schema } from '@/lib/db';

const fields = [
${fieldConfigs}
];

export default function Create${entityName}Page() {
  const router = useRouter();

  const handleSubmit = async (data: Record<string, unknown>) => {
    console.log('Creating ${entityName}:', data);
    // TODO: Call API to create ${entityName}
    // await fetch('/api/${basePath}', { method: 'POST', body: JSON.stringify(data) });
    router.push('/${basePath}');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between pb-6 border-b border-border">
        <div>
          <nav className="text-sm text-fg-muted mb-1">
            <a href="/${basePath}" className="hover:text-fg transition-colors">${label}</a>
            <span className="mx-2">/</span>
            <span>New</span>
          </nav>
          <h1 className="text-2xl font-semibold tracking-tight text-fg">${pageTitle}</h1>
        </div>
        <Button variant="ghost" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>

      {/* Form card */}
      <Card padding="lg">
        <CardHeader
          title="${formHeader.title}"
          description="${formHeader.description}"
        />
        <EntityForm
          fields={fields}
          schema={${entityName}Schema}
          onSubmit={handleSubmit}
          onCancel={() => router.back()}
          submitLabel="${submitLabel}"
        />
      </Card>
    </div>
  );
}
`;
}

function generateEntityDetailPage(
  basePath: string,
  entity: OaxeOutput['entities'][0],
  brandDNA?: BrandDNA
): string {
  const entityName = pascalCase(entity.name);
  const entityVar = camelCase(entity.name);
  const label = getEntityLabel(entity.name);

  // Brand expression: Get brand-aware copy
  const notFoundCopy = brandDNA
    ? getNotFoundCopy(entity.name, brandDNA)
    : { headline: `${entityName} not found`, subline: 'The requested item could not be found' };
  const secondaryVerb = brandDNA ? getSecondaryVerb(brandDNA) : 'View';
  const detailsTitle = brandDNA?.mood === 'minimal'
    ? entityName
    : `${entityName} Information`;

  // Generate field display rows
  const fieldRows = entity.fields.map(field => {
    const fieldName = camelCase(field.name);
    const fieldLabel = field.name.charAt(0).toUpperCase() + field.name.slice(1).replace(/([A-Z])/g, ' $1');
    return `          <div className="py-4 border-b border-border-subtle last:border-0">
            <dt className="text-sm font-medium text-fg-muted">${fieldLabel}</dt>
            <dd className="mt-1 text-fg">{String(item.${fieldName})}</dd>
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
      <div className="text-center py-16">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
          <svg className="w-8 h-8 text-fg-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-fg-secondary font-medium">${notFoundCopy.headline}</p>
        <p className="text-sm text-fg-muted mt-1">${notFoundCopy.subline}</p>
        <Button onClick={() => router.push('/${basePath}')} className="mt-6">
          Back to ${label}
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between pb-6 border-b border-border">
        <div>
          <nav className="text-sm text-fg-muted mb-1">
            <a href="/${basePath}" className="hover:text-fg transition-colors">${label}</a>
            <span className="mx-2">/</span>
            <span>{id}</span>
          </nav>
          <h1 className="text-2xl font-semibold tracking-tight text-fg">${entityName} Details</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => router.push('/${basePath}')}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </Button>
          <Button>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit
          </Button>
        </div>
      </div>

      {/* Details card */}
      <Card padding="lg">
        <CardHeader title="${detailsTitle}" />
        <dl>
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
      {/* Page header */}
      <div className="pb-6 border-b border-border">
        <h1 className="text-2xl font-semibold tracking-tight text-fg">${titleCase}</h1>
        <p className="text-fg-secondary mt-1">${purpose.replace(/'/g, "\\'")}</p>
      </div>

      <Card padding="lg">
        <CardHeader
          title="${titleCase} Content"
          description="This page is ready for implementation"
        />
        <div className="space-y-4">
          <p className="text-fg-secondary">
            This is the ${titleCase.toLowerCase()} page. Add your content and functionality here.
          </p>
          <div className="p-4 bg-muted rounded-lg border border-border-subtle">
            <p className="text-sm text-fg-muted">
              <span className="font-medium text-fg-secondary">Purpose:</span> ${purpose.replace(/'/g, "\\'")}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
`;
}

/**
 * M5A/M5B: Generate pages with Brand DNA expression and Layout Grammar
 * Accepts optional BrandDNA for brand-aware copy and emphasis
 * Accepts optional LayoutGrammar for entity view types and create patterns
 */
export function generatePages(output: OaxeOutput, brandDNA?: BrandDNA, layoutGrammar?: LayoutGrammar, visualEmphasis?: VisualEmphasis): GeneratedFile[] {
  const files: GeneratedFile[] = [];

  // M5B: Build entity view config lookup
  const entityViewLookup = new Map<string, EntityViewConfig>();
  if (layoutGrammar?.entityViews) {
    for (const ev of layoutGrammar.entityViews) {
      entityViewLookup.set(ev.entityName.toLowerCase(), ev);
    }
  }

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

      // M5B: Get entity view config from grammar
      const entityViewConfig = entityViewLookup.get(matchedEntity.name.toLowerCase());

      if (isBaseEntityRoute) {
        // Get collision-aware base path for this entity
        const basePath = getEntityBasePath(matchedEntity.name);

        // Generate entity list page (M5A: with brand expression, M5B: with view type)
        const listPath = `src/app/(app)/${basePath}/page.tsx`;
        const listContent = generateEntityListPage(basePath, page.purpose, matchedEntity, output.appName, brandDNA, entityViewConfig);
        files.push({ path: listPath, content: listContent });
        generatedEntityIndexPages.add(matchedEntity.name.toLowerCase());

        // M5B: Only generate /new page if createPattern is 'page'
        if (!entityViewConfig || entityViewConfig.createPattern === 'page') {
          // Generate entity create form page (M5A: with brand expression)
          const formPath = `src/app/(app)/${basePath}/new/page.tsx`;
          const formContent = generateEntityFormPage(basePath, matchedEntity, brandDNA);
          files.push({ path: formPath, content: formContent });
        }

        // Generate entity detail page (M5A: with brand expression)
        const detailPath = `src/app/(app)/${basePath}/[id]/page.tsx`;
        const detailContent = generateEntityDetailPage(basePath, matchedEntity, brandDNA);
        files.push({ path: detailPath, content: detailContent });
      } else {
        // This is a sub-route (like /cases/:id)
        // M9 FIX: Skip parameterized routes (e.g., /cases/:id) - entity detail pages already handle these
        // The original route contains :id or [id] patterns, but sanitizeRoute strips the `:` making it "cases/id"
        // We should NOT generate a literal "id" folder page - the [id] dynamic route handles this
        const originalRouteIsParameterized = endsWithParameter(page.route);
        if (originalRouteIsParameterized) {
          // Skip - entity detail page is already generated at [id]/page.tsx
          continue;
        }

        // Only generate simple page for non-parameterized sub-routes
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
      // Get collision-aware base path for this entity
      const basePath = getEntityBasePath(entity.name);

      // M5B: Get entity view config from grammar
      const entityViewConfig = entityViewLookup.get(entitySlug);

      // Generate missing entity index page (M5A: with brand expression, M5B: with view type)
      const listPath = `src/app/(app)/${basePath}/page.tsx`;
      const listContent = generateEntityListPage(
        basePath,
        `Manage ${entity.name}s`,
        entity,
        output.appName,
        brandDNA,
        entityViewConfig
      );
      files.push({ path: listPath, content: listContent });

      // M5B: Only generate /new page if createPattern is 'page'
      if (!entityViewConfig || entityViewConfig.createPattern === 'page') {
        // Generate create form page (M5A: with brand expression)
        const formPath = `src/app/(app)/${basePath}/new/page.tsx`;
        const formContent = generateEntityFormPage(basePath, entity, brandDNA);
        files.push({ path: formPath, content: formContent });
      }

      // Generate detail page (M5A: with brand expression)
      const detailPath = `src/app/(app)/${basePath}/[id]/page.tsx`;
      const detailContent = generateEntityDetailPage(basePath, entity, brandDNA);
      files.push({ path: detailPath, content: detailContent });

      generatedEntityIndexPages.add(entitySlug);
    }
  }

  return files;
}
