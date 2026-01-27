import type { OaxeOutput } from '../types';
import type { GeneratedFile } from './types';

function mapFieldType(type: string): string {
  const typeMap: Record<string, string> = {
    string: 'string',
    text: 'string',
    number: 'number',
    int: 'number',
    integer: 'number',
    float: 'number',
    decimal: 'number',
    boolean: 'boolean',
    bool: 'boolean',
    date: 'Date',
    datetime: 'Date',
    timestamp: 'Date',
    uuid: 'string',
    id: 'string',
    json: 'Record<string, unknown>',
    object: 'Record<string, unknown>',
    array: 'unknown[]',
  };

  const normalized = type.toLowerCase().trim();
  return typeMap[normalized] || 'unknown';
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
  };

  const normalized = type.toLowerCase().trim();
  return zodMap[normalized] || 'z.unknown()';
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

export function generateSchema(output: OaxeOutput): GeneratedFile[] {
  const files: GeneratedFile[] = [];

  // Generate TypeScript interfaces
  let typesContent = `// Generated TypeScript types for ${output.appName}
// These are type-only definitions (no runtime DB connection)

`;

  // Generate Zod schemas
  let schemasContent = `import { z } from 'zod';

// Generated Zod schemas for ${output.appName}
// Use these for runtime validation

`;

  for (const entity of output.entities) {
    const entityName = pascalCase(entity.name);

    // TypeScript interface
    typesContent += `export interface ${entityName} {\n`;
    typesContent += `  id: string;\n`;
    for (const field of entity.fields) {
      const fieldName = camelCase(field.name);
      const tsType = mapFieldType(field.type);
      typesContent += `  ${fieldName}: ${tsType};\n`;
    }
    typesContent += `  createdAt: Date;\n`;
    typesContent += `  updatedAt: Date;\n`;
    typesContent += `}\n\n`;

    // Zod schema
    schemasContent += `export const ${entityName}Schema = z.object({\n`;
    schemasContent += `  id: z.string(),\n`;
    for (const field of entity.fields) {
      const fieldName = camelCase(field.name);
      const zodType = mapFieldToZod(field.type);
      schemasContent += `  ${fieldName}: ${zodType},\n`;
    }
    schemasContent += `  createdAt: z.coerce.date(),\n`;
    schemasContent += `  updatedAt: z.coerce.date(),\n`;
    schemasContent += `});\n\n`;
    schemasContent += `export type ${entityName}Input = z.infer<typeof ${entityName}Schema>;\n\n`;
  }

  // Add type exports summary
  typesContent += `// Entity type exports\n`;
  typesContent += `export type EntityTypes = {\n`;
  for (const entity of output.entities) {
    const entityName = pascalCase(entity.name);
    typesContent += `  ${entityName}: ${entityName};\n`;
  }
  typesContent += `};\n`;

  files.push({
    path: 'src/lib/db/types.ts',
    content: typesContent,
  });

  files.push({
    path: 'src/lib/db/schema.ts',
    content: schemasContent,
  });

  // Generate index file
  files.push({
    path: 'src/lib/db/index.ts',
    content: `export * from './types';
export * from './schema';

// Database connection will be added in M0B
// For now, this module provides type-only definitions
`,
  });

  return files;
}
