import type { OaxeOutput } from '../types';
import type { GeneratedFile } from './types';

function sanitizePath(path: string): string {
  // Remove leading slash, normalize, handle params
  return path
    .replace(/^\/+/, '')
    .replace(/[^a-zA-Z0-9/-]/g, '')
    .replace(/:\w+/g, (match) => `[${match.slice(1)}]`) // :id -> [id]
    .toLowerCase();
}

function generateApiRoute(
  method: string,
  path: string,
  purpose: string
): string {
  const methodUpper = method.toUpperCase();
  const hasParams = path.includes('[');

  // Generate Zod schema based on method
  const requestSchema = methodUpper === 'GET' || methodUpper === 'DELETE'
    ? ''
    : `
const RequestSchema = z.object({
  // TODO: Define request body schema
  // Example:
  // name: z.string().min(1),
  // email: z.string().email(),
});
`;

  const responseSchema = `
const ResponseSchema = z.object({
  success: z.boolean(),
  data: z.unknown().optional(),
  error: z.string().optional(),
});
`;

  const paramsType = hasParams
    ? `{ params }: { params: Promise<{ [key: string]: string }> }`
    : '';

  const paramsUsage = hasParams
    ? `
  const resolvedParams = await params;
  console.log('Params:', resolvedParams);
`
    : '';

  const bodyParsing = methodUpper === 'GET' || methodUpper === 'DELETE'
    ? ''
    : `
  try {
    const body = await request.json();
    // Validate with Zod when schema is defined:
    // const validated = RequestSchema.parse(body);
    console.log('Body:', body);
  } catch {
    return NextResponse.json(
      { success: false, error: 'Invalid request body' },
      { status: 400 }
    );
  }
`;

  return `import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
${requestSchema}${responseSchema}
/**
 * ${methodUpper} ${path}
 * Purpose: ${purpose}
 */
export async function ${methodUpper}(request: NextRequest${paramsType ? `, ${paramsType}` : ''}) {
  ${paramsUsage}${bodyParsing}
  // TODO: Implement ${purpose}

  const response = {
    success: true,
    data: {
      message: 'Stub response for: ${purpose}',
      method: '${methodUpper}',
      path: '${path}',
    },
  };

  // Validate response
  ResponseSchema.parse(response);

  return NextResponse.json(response);
}
`;
}

export function generateApis(output: OaxeOutput): GeneratedFile[] {
  const files: GeneratedFile[] = [];

  for (const api of output.apis) {
    const path = sanitizePath(api.path);
    if (!path) continue;

    const filePath = `src/app/api/${path}/route.ts`;
    const content = generateApiRoute(api.method, api.path, api.purpose);

    files.push({ path: filePath, content });
  }

  return files;
}
