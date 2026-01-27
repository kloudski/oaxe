import type { OaxeOutput } from '../types';
import type { GeneratedFile } from './types';

function pascalCase(str: string): string {
  return str
    .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
    .replace(/^(.)/, (c) => c.toUpperCase());
}

function camelCase(str: string): string {
  const pascal = pascalCase(str);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

function generateSeedValue(fieldName: string, fieldType: string, index: number): string {
  const normalized = fieldType.toLowerCase().trim();
  const name = fieldName.toLowerCase();

  // Generate contextual seed data based on field name patterns
  if (name.includes('email')) {
    return `"user${index + 1}@example.com"`;
  }
  if (name.includes('name') || name.includes('title')) {
    const names = ['Alice Johnson', 'Bob Smith', 'Carol Williams', 'David Brown', 'Eve Davis'];
    return `"${names[index % names.length]}"`;
  }
  if (name.includes('phone')) {
    return `"+1-555-${String(100 + index).padStart(3, '0')}-${String(1000 + index * 111).slice(0, 4)}"`;
  }
  if (name.includes('description') || name.includes('content') || name.includes('bio')) {
    return `"Sample description for item ${index + 1}. This is placeholder content."`;
  }
  if (name.includes('status')) {
    const statuses = ['active', 'pending', 'completed', 'archived'];
    return `"${statuses[index % statuses.length]}"`;
  }
  if (name.includes('priority')) {
    const priorities = ['high', 'medium', 'low'];
    return `"${priorities[index % priorities.length]}"`;
  }
  if (name.includes('url') || name.includes('link') || name.includes('website')) {
    return `"https://example.com/item-${index + 1}"`;
  }
  if (name.includes('address')) {
    return `"${100 + index * 10} Main Street, City ${index + 1}"`;
  }
  if (name.includes('company') || name.includes('organization')) {
    const companies = ['Acme Corp', 'TechStart Inc', 'GlobalSoft', 'DataFlow LLC', 'CloudBase'];
    return `"${companies[index % companies.length]}"`;
  }
  if (name.includes('price') || name.includes('amount') || name.includes('cost')) {
    return `${(index + 1) * 29.99}`;
  }
  if (name.includes('quantity') || name.includes('count')) {
    return `${(index + 1) * 5}`;
  }

  // Type-based fallbacks
  switch (normalized) {
    case 'string':
    case 'text':
      return `"Sample ${fieldName} ${index + 1}"`;
    case 'number':
    case 'int':
    case 'integer':
      return `${(index + 1) * 10}`;
    case 'float':
    case 'decimal':
      return `${(index + 1) * 10.5}`;
    case 'boolean':
    case 'bool':
      return index % 2 === 0 ? 'true' : 'false';
    case 'date':
    case 'datetime':
    case 'timestamp':
      const date = new Date(2024, 0, 1 + index * 7);
      return `new Date("${date.toISOString()}")`;
    case 'uuid':
    case 'id':
      return `"${generateUUID(index)}"`;
    case 'json':
    case 'object':
      return `{ key: "value${index + 1}" }`;
    case 'array':
      return `["item${index + 1}"]`;
    default:
      return `"${fieldName}-${index + 1}"`;
  }
}

function generateUUID(seed: number): string {
  // Generate deterministic UUID-like strings for seed data
  const hex = (n: number) => n.toString(16).padStart(4, '0');
  return `${hex(seed * 1111)}-${hex(seed * 2222)}-4${hex(seed * 333).slice(1)}-8${hex(seed * 444).slice(1)}-${hex(seed * 5555)}${hex(seed * 6666)}`;
}

export function generateSeed(output: OaxeOutput): GeneratedFile[] {
  const files: GeneratedFile[] = [];
  const seedCount = 5; // Generate 5 seed records per entity

  let seedContent = `// Generated seed data for ${output.appName}
// This provides realistic mock data for development

`;

  // Import types
  seedContent += `import type { ${output.entities.map(e => pascalCase(e.name)).join(', ')} } from './types';\n\n`;

  for (const entity of output.entities) {
    const entityName = pascalCase(entity.name);
    const varName = camelCase(entity.name) + 'Seed';

    // Filter out reserved fields that we add manually
    const reservedFields = ['id', 'createdat', 'updatedat', 'created_at', 'updated_at'];
    const userFields = entity.fields.filter(f =>
      !reservedFields.includes(f.name.toLowerCase().replace(/[-_]/g, ''))
    );

    seedContent += `export const ${varName}: ${entityName}[] = [\n`;

    for (let i = 0; i < seedCount; i++) {
      seedContent += `  {\n`;
      seedContent += `    id: "${generateUUID(i + 1)}",\n`;

      for (const field of userFields) {
        const fieldName = camelCase(field.name);
        const value = generateSeedValue(field.name, field.type, i);
        seedContent += `    ${fieldName}: ${value},\n`;
      }

      const createdDate = new Date(2024, 0, 1 + i);
      const updatedDate = new Date(2024, 0, 15 + i);
      seedContent += `    createdAt: new Date("${createdDate.toISOString()}"),\n`;
      seedContent += `    updatedAt: new Date("${updatedDate.toISOString()}"),\n`;
      seedContent += `  },\n`;
    }

    seedContent += `];\n\n`;
  }

  // Generate combined seed data object
  seedContent += `// Combined seed data for easy access\n`;
  seedContent += `export const seedData = {\n`;
  for (const entity of output.entities) {
    const varName = camelCase(entity.name) + 'Seed';
    seedContent += `  ${camelCase(entity.name)}: ${varName},\n`;
  }
  seedContent += `};\n`;

  files.push({
    path: 'src/lib/db/seed.ts',
    content: seedContent,
  });

  return files;
}
