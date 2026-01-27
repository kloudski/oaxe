import type { OaxeOutput } from '../types';
import type { GeneratedFile } from './types';

function sanitizePath(path: string): string {
  return path
    .replace(/^\/+/, '')
    .replace(/^api\/+/i, '') // Remove leading api/ since we're in src/app/api/
    .replace(/:\w+/g, (match) => `[${match.slice(1)}]`) // :id -> [id] (must be before sanitization)
    .replace(/\{(\w+)\}/g, '[$1]') // {id} -> [id]
    .replace(/[^a-zA-Z0-9/[\]-]/g, '') // Remove special chars except [ ] - /
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

function findEntityForApi(path: string, entities: OaxeOutput['entities']): OaxeOutput['entities'][0] | null {
  const normalized = path.toLowerCase();
  return entities.find(e => {
    const entityName = e.name.toLowerCase();
    return normalized.includes(entityName) ||
           normalized.includes(entityName + 's');
  }) || null;
}

function mapFieldToZod(type: string): string {
  const zodMap: Record<string, string> = {
    string: 'z.string()',
    text: 'z.string()',
    number: 'z.number()',
    int: 'z.number().int()',
    integer: 'z.number().int()',
    float: 'z.number()',
    decimal: 'z.number()',
    boolean: 'z.boolean()',
    bool: 'z.boolean()',
    date: 'z.coerce.date()',
    datetime: 'z.coerce.date()',
    timestamp: 'z.coerce.date()',
    uuid: 'z.string().uuid()',
    id: 'z.string()',
    json: 'z.record(z.unknown())',
    object: 'z.record(z.unknown())',
    array: 'z.array(z.unknown())',
    email: 'z.string().email()',
    url: 'z.string().url()',
    file: 'z.string()', // File URLs/paths are strings
  };

  const normalized = type.toLowerCase().trim();
  return zodMap[normalized] || 'z.string()';
}

export function generateApis(output: OaxeOutput): GeneratedFile[] {
  const files: GeneratedFile[] = [];

  // Group APIs by sanitized path to handle multiple methods per endpoint
  const apisByPath = new Map<string, { methods: string[]; purposes: string[]; originalPath: string; entity: OaxeOutput['entities'][0] | null }>();

  for (const api of output.apis) {
    const path = sanitizePath(api.path);
    if (!path) continue;

    const entity = findEntityForApi(api.path, output.entities);

    if (apisByPath.has(path)) {
      const existing = apisByPath.get(path)!;
      existing.methods.push(api.method);
      existing.purposes.push(api.purpose);
    } else {
      apisByPath.set(path, {
        methods: [api.method],
        purposes: [api.purpose],
        originalPath: api.path,
        entity
      });
    }
  }

  // Generate one file per path with all methods
  for (const [path, { methods, purposes, originalPath, entity }] of apisByPath) {
    const filePath = `src/app/api/${path}/route.ts`;

    // Generate combined route file with all methods
    const handlers: string[] = [];
    for (let i = 0; i < methods.length; i++) {
      handlers.push(generateApiHandler(methods[i], originalPath, purposes[i], entity));
    }

    const content = generateApiFile(originalPath, entity, handlers);
    files.push({ path: filePath, content });
  }

  return files;
}

function generateApiFile(
  path: string,
  entity: OaxeOutput['entities'][0] | null,
  handlers: string[]
): string {
  const entityName = entity ? pascalCase(entity.name) : null;
  const entityVar = entity ? camelCase(entity.name) : null;

  let imports = `import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';`;

  if (entity) {
    imports += `
import type { ${entityName} } from '@/lib/db';
import { ${entityName}Schema } from '@/lib/db';
import { ${entityVar}Seed } from '@/lib/db/seed';`;
  }

  return `${imports}

${handlers.join('\n\n')}
`;
}

function generateApiHandler(
  method: string,
  path: string,
  purpose: string,
  entity: OaxeOutput['entities'][0] | null
): string {
  const methodUpper = method.toUpperCase();
  // Check for dynamic route params in various formats: :id, {id}, [id]
  const hasParams = path.includes('[') || path.includes('{') || path.includes(':');
  const entityName = entity ? pascalCase(entity.name) : null;
  const entityVar = entity ? camelCase(entity.name) : null;

  // Generate request schema based on entity
  let requestSchema = '';
  if ((methodUpper === 'POST' || methodUpper === 'PUT' || methodUpper === 'PATCH') && entity) {
    const fields = entity.fields
      .filter(f => !['id', 'createdat', 'updatedat'].includes(f.name.toLowerCase().replace(/[-_]/g, '')))
      .map(f => {
        const fieldName = camelCase(f.name);
        const zodType = mapFieldToZod(f.type);
        return `  ${fieldName}: ${zodType},`;
      }).join('\n');

    requestSchema = `const ${methodUpper}Schema = z.object({
${fields}
});

`;
  }

  // Generate params type
  const paramsType = hasParams
    ? `{ params }: { params: Promise<{ [key: string]: string }> }`
    : '';

  // Generate handler body based on method and entity
  let handlerBody = '';

  if (entity) {
    switch (methodUpper) {
      case 'GET':
        if (hasParams) {
          handlerBody = `  const resolvedParams = await params;
  const id = resolvedParams.id;

  const item = ${entityVar}Seed.find(i => i.id === id);

  if (!item) {
    return NextResponse.json(
      { success: false, error: '${entityName} not found' },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, data: item });`;
        } else {
          handlerBody = `  return NextResponse.json({
    success: true,
    data: ${entityVar}Seed,
    total: ${entityVar}Seed.length,
  });`;
        }
        break;

      case 'POST':
        handlerBody = `  try {
    const body = await request.json();
    const validated = ${methodUpper}Schema.parse(body);

    const newItem: ${entityName} = {
      id: crypto.randomUUID(),
      ...validated,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    console.log('Created ${entityName}:', newItem);

    return NextResponse.json({
      success: true,
      data: newItem,
      message: '${entityName} created successfully',
    }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'Invalid request body' },
      { status: 400 }
    );
  }`;
        break;

      case 'PUT':
      case 'PATCH':
        handlerBody = `  const resolvedParams = await params;
  const id = resolvedParams.id;

  try {
    const body = await request.json();
    const validated = ${methodUpper}Schema.partial().parse(body);

    const existingIndex = ${entityVar}Seed.findIndex(i => i.id === id);
    if (existingIndex === -1) {
      return NextResponse.json(
        { success: false, error: '${entityName} not found' },
        { status: 404 }
      );
    }

    const updated: ${entityName} = {
      ...${entityVar}Seed[existingIndex],
      ...validated,
      updatedAt: new Date(),
    };

    return NextResponse.json({
      success: true,
      data: updated,
      message: '${entityName} updated successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'Invalid request body' },
      { status: 400 }
    );
  }`;
        break;

      case 'DELETE':
        handlerBody = `  const resolvedParams = await params;
  const id = resolvedParams.id;

  const existingIndex = ${entityVar}Seed.findIndex(i => i.id === id);
  if (existingIndex === -1) {
    return NextResponse.json(
      { success: false, error: '${entityName} not found' },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    message: '${entityName} deleted successfully',
  });`;
        break;
    }
  } else {
    // Generic handler for non-entity APIs
    const paramsUsage = hasParams
      ? `  const resolvedParams = await params;
  console.log('Params:', resolvedParams);

`
      : '';

    const bodyParsing = (methodUpper === 'POST' || methodUpper === 'PUT' || methodUpper === 'PATCH')
      ? `  try {
    const body = await request.json();
    console.log('Body:', body);
  } catch {
    return NextResponse.json(
      { success: false, error: 'Invalid request body' },
      { status: 400 }
    );
  }

`
      : '';

    handlerBody = `${paramsUsage}${bodyParsing}  // TODO: Implement ${purpose}

  return NextResponse.json({
    success: true,
    data: { message: 'Stub response', method: '${methodUpper}' },
  });`;
  }

  return `${requestSchema}/**
 * ${methodUpper} ${path}
 * ${purpose}
 */
export async function ${methodUpper}(request: NextRequest${paramsType ? `, ${paramsType}` : ''}) {
${handlerBody}
}`;
}
