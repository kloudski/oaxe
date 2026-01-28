import { z } from 'zod';

/**
 * M4A: Enhanced Brand DNA Schema
 * Structured brand identity for consistent product generation
 */
export const BrandDNASchema = z.object({
  // Core identity
  name: z.string().describe('Product/brand name'),
  tagline: z.string().describe('Short memorable tagline'),
  category: z.string().describe('Product category (e.g., legal, finance, wellness)'),

  // Brand personality
  mood: z.string().describe('Brand mood (e.g., calm, professional, playful)'),
  archetype: z.string().describe('Brand archetype (e.g., Sage, Hero, Creator, Caregiver)'),

  // Positioning
  positioning: z.object({
    statement: z.string().describe('Market positioning statement'),
    targetAudience: z.string().describe('Primary target audience'),
    differentiator: z.string().describe('Key differentiator from competitors'),
  }),

  // Voice & Tone
  voice: z.object({
    tone: z.string().describe('Overall tone (e.g., warm, authoritative, friendly)'),
    style: z.string().describe('Writing style (e.g., concise, technical, conversational)'),
    keywords: z.array(z.string()).describe('Brand vocabulary keywords'),
  }),

  // Visual identity
  visual: z.object({
    primaryColor: z.string().describe('Primary brand color'),
    colorPalette: z.array(z.string()).describe('Extended color palette'),
    aesthetic: z.string().describe('Visual aesthetic (e.g., minimal, bold, organic)'),
    iconStyle: z.string().describe('Icon style preference'),
  }),

  // Brand moments
  productBrandMoments: z.array(
    z.object({
      moment: z.string().describe('Name of the brand moment'),
      description: z.string().describe('What happens at this moment'),
      emotion: z.string().describe('Target emotion to evoke'),
    })
  ).describe('Key moments where brand personality shines'),

  // Values & guardrails
  values: z.array(z.string()).describe('Core brand values'),
  guardrails: z.object({
    doSay: z.array(z.string()).describe('Language patterns to use'),
    dontSay: z.array(z.string()).describe('Language patterns to avoid'),
    visualDo: z.array(z.string()).describe('Visual patterns to use'),
    visualDont: z.array(z.string()).describe('Visual patterns to avoid'),
  }),
});

export type BrandDNA = z.infer<typeof BrandDNASchema>;

/**
 * Legacy brandDNA format for backward compatibility
 * Used in OaxeOutput until migration is complete
 */
const LegacyBrandDNASchema = z.object({
  name: z.string(),
  tone: z.string(),
  values: z.array(z.string()),
  positioning: z.string(),
});

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
  brandDNA: LegacyBrandDNASchema,
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

/**
 * M6: Launch Assets Schema
 * Brand-aligned marketing assets for product launch
 */
export const LaunchAssetsSchema = z.object({
  founderTweets: z.array(z.string()).min(3).max(5).describe('3-5 founder tweets in first person'),
  pinnedTweet: z.string().describe('The main tweet explaining what/who/why'),
  heroCopy: z.object({
    headline: z.string().max(50).describe('Hero headline, 8 words max'),
    subheadline: z.string().describe('One sentence supporting headline'),
    bullets: z.array(z.string()).min(2).max(3).describe('2-3 benefit bullets'),
  }),
  screenshotSpec: z.object({
    heroScreenshot: z.object({
      screen: z.string().describe('What screen to capture'),
      rationale: z.string().describe('Why this screen'),
      copyOverlay: z.string().optional().describe('Optional text overlay'),
    }),
    supportingScreenshots: z.array(z.object({
      screen: z.string().describe('What screen to capture'),
      communicates: z.string().describe('What this screenshot shows'),
      copyOverlay: z.string().optional().describe('Optional text overlay'),
    })).min(2).max(3),
  }),
  productHuntTagline: z.string().max(60).describe('PH tagline, 60 chars max'),
  generatedAt: z.string().describe('ISO timestamp'),
  qualityWarnings: z.array(z.string()).optional().describe('M6.1: Quality warnings if lint/spec checks failed'),
});

/**
 * M8: Evolution Roadmap Schema
 * Strategic v1 → v2 → v3 evolution roadmap
 */
export const VersionPhaseSchema = z.object({
  version: z.string(),
  title: z.string(),
  timeline: z.string(),
  sections: z.object({
    problemStatement: z.string().optional(),
    mustHaveFeatures: z.array(z.string()).optional(),
    notBuilt: z.array(z.string()).optional(),
    targetUser: z.string().optional(),
    useCase: z.string().optional(),
    successMetrics: z.array(z.string()).optional(),
    technicalConstraints: z.array(z.string()).optional(),
    featureExpansions: z.array(z.string()).optional(),
    architectureEvolution: z.array(z.string()).optional(),
    scalingConsiderations: z.array(z.string()).optional(),
    monetization: z.string().optional(),
    moatBuilding: z.array(z.string()).optional(),
    categoryExpansion: z.string().optional(),
    platformStrategy: z.string().optional(),
    advancedMonetization: z.string().optional(),
    partnerships: z.array(z.string()).optional(),
    differentiationNarrative: z.string().optional(),
  }),
});

export const FeatureProgressionSchema = z.object({
  feature: z.string(),
  v1: z.string(),
  v2: z.string(),
  v3: z.string(),
});

export const EvolutionRoadmapSchema = z.object({
  appName: z.string(),
  category: z.string(),
  generatedAt: z.string(),
  v1: VersionPhaseSchema,
  v2: VersionPhaseSchema,
  v3: VersionPhaseSchema,
  featureProgression: z.array(FeatureProgressionSchema),
  architectureNotes: z.object({
    v1ToV2: z.array(z.string()),
    v2ToV3: z.array(z.string()),
    technicalDebt: z.array(z.string()),
  }),
  monetizationEvolution: z.object({
    v1: z.string(),
    v2: z.string(),
    v3: z.string(),
  }),
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
  brandDNA: BrandDNASchema.optional(),  // M4A: Enhanced Brand DNA
  launchAssets: LaunchAssetsSchema.optional(),  // M6: Launch Assets
  evolution: EvolutionRoadmapSchema.optional(),  // M8: Evolution Roadmap
  error: z.string().optional(),
});

export type OaxeOutput = z.infer<typeof OaxeOutputSchema>;
export type Run = z.infer<typeof RunSchema>;
