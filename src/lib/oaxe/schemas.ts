import { z } from 'zod';

export const OaxeOutputSchema = z.object({
  appName: z.string(),
  slug: z.string(),
  elevatorPitch: z.string(),
  productSpec: z.object({
    description: z.string(),
    personas: z.array(z.string()),
    coreFeatures: z.array(z.string()),
  }),
  architecture: z.object({
    frontend: z.string(),
    backend: z.string(),
    infra: z.string(),
  }),
  entities: z.array(
    z.object({
      name: z.string(),
      fields: z.array(
        z.object({
          name: z.string(),
          type: z.string(),
        })
      ),
    })
  ),
  apis: z.array(
    z.object({
      method: z.string(),
      path: z.string(),
      purpose: z.string(),
    })
  ),
  pages: z.array(
    z.object({
      route: z.string(),
      purpose: z.string(),
    })
  ),
  designTokens: z.object({
    typography: z.array(z.string()),
    colors: z.array(z.string()),
    spacing: z.array(z.string()),
  }),
  brandDNA: z.object({
    name: z.string(),
    tone: z.string(),
    values: z.array(z.string()),
    positioning: z.string(),
  }),
  roadmap: z.object({
    v1: z.array(z.string()),
    v2: z.array(z.string()),
    v3: z.array(z.string()),
  }),
  founderTweets: z.array(z.string()),
});

const FileTreeNodeSchema: z.ZodType<{
  name: string;
  type: 'file' | 'directory';
  children?: { name: string; type: 'file' | 'directory'; children?: unknown[] }[];
}> = z.lazy(() =>
  z.object({
    name: z.string(),
    type: z.enum(['file', 'directory']),
    children: z.array(FileTreeNodeSchema).optional(),
  })
);

export const GeneratedAppSchema = z.object({
  slug: z.string(),
  path: z.string(),
  fileTree: FileTreeNodeSchema,
  fileCount: z.number(),
});

export const RunSchema = z.object({
  id: z.string(),
  directive: z.string(),
  status: z.enum(['pending', 'running', 'completed', 'error']),
  createdAt: z.string(),
  updatedAt: z.string(),
  logs: z.array(
    z.object({
      timestamp: z.string(),
      level: z.enum(['info', 'warn', 'error']),
      message: z.string(),
    })
  ),
  output: OaxeOutputSchema.optional(),
  generatedApp: GeneratedAppSchema.optional(),
  error: z.string().optional(),
});

export type OaxeOutput = z.infer<typeof OaxeOutputSchema>;
export type Run = z.infer<typeof RunSchema>;
