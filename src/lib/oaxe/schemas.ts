import { z } from 'zod';

/**
 * M4B: Visual Signature Schema
 * Formalizes how the brand looks beyond colors
 */
export const VisualSignatureSchema = z.object({
  shapeLanguage: z.object({
    profile: z.enum(['rounded', 'balanced', 'sharp', 'mixed']).describe('Shape language profile'),
    rationale: z.string().describe('Why this shape language fits the brand'),
    cornerRadiusGuidance: z.string().describe('Specific corner radius guidance'),
    iconTreatment: z.string().describe('How icons should be styled'),
  }),

  densityRhythm: z.object({
    profile: z.enum(['compact', 'balanced', 'spacious']).describe('Density profile'),
    rationale: z.string().describe('Why this density fits the category'),
    contexts: z.object({
      tables: z.string().describe('Table density guidance'),
      dashboards: z.string().describe('Dashboard density guidance'),
      forms: z.string().describe('Form density guidance'),
      navigation: z.string().describe('Navigation density guidance'),
    }),
  }),

  contrastPhilosophy: z.object({
    profile: z.enum(['low-contrast-calm', 'high-contrast-assertive', 'mixed-functional']).describe('Contrast philosophy'),
    rationale: z.string().describe('Why this contrast approach fits the mood'),
    textHierarchy: z.string().describe('How text hierarchy is expressed'),
    surfaceContrast: z.string().describe('How surfaces relate to each other'),
    emphasisStrategy: z.string().describe('How emphasis is created'),
  }),

  textureUsage: z.object({
    profile: z.enum(['none', 'subtle', 'expressive']).describe('Texture usage profile'),
    rationale: z.string().describe('Why this texture approach fits'),
    allowedContexts: z.array(z.string()).describe('Where texture may appear'),
    prohibitedContexts: z.array(z.string()).describe('Where texture must not appear'),
    performanceGuidance: z.string().describe('GPU/performance considerations'),
  }),

  motionCharacter: z.object({
    profile: z.enum(['restrained', 'confident', 'energetic', 'ceremonial']).describe('Motion character'),
    timingPhilosophy: z.string().describe('Timing philosophy (not specific numbers)'),
    purposeOfMotion: z.string().describe('Why motion exists in this product'),
    entranceExits: z.string().describe('How elements enter and exit'),
    microInteractions: z.string().describe('How micro-interactions behave'),
  }),

  layoutPhilosophy: z.object({
    profile: z.enum(['content-first', 'structure-first', 'narrative']).describe('Layout philosophy'),
    rationale: z.string().describe('Why this layout approach fits'),
    gridUsage: z.string().describe('How the grid is used'),
    whiteSpaceIntent: z.string().describe('Purpose of white space'),
    responsiveStrategy: z.string().describe('How layout responds to viewport'),
  }),

  generatedAt: z.string().describe('ISO timestamp of generation'),
});

export type VisualSignature = z.infer<typeof VisualSignatureSchema>;

/**
 * M4C: Iconography System Schema
 * Defines icon style rules, metaphor preferences, and usage guidelines
 */
export const IconographySchema = z.object({
  iconStyle: z.object({
    profile: z.enum(['outline', 'solid', 'duotone', 'mixed']).describe('Icon style profile'),
    rationale: z.string().describe('Why this icon style fits the brand'),
    strokeWeight: z.enum(['thin', 'standard', 'bold']).describe('Stroke weight philosophy'),
    strokeWeightRationale: z.string().describe('Why this stroke weight fits'),
    cornerTreatment: z.string().describe('How icon corners align with visual signature'),
  }),

  metaphorStrategy: z.object({
    profile: z.enum(['literal', 'symbolic', 'hybrid']).describe('Metaphor strategy'),
    rationale: z.string().describe('Why this metaphor approach fits'),
    categoryGuidance: z.string().describe('Category-specific metaphor guidance'),
    examples: z.object({
      preferred: z.array(z.string()).describe('Preferred metaphor examples'),
      avoid: z.array(z.string()).describe('Metaphors to avoid'),
    }),
  }),

  semanticRules: z.object({
    oneIconOneMeaning: z.string().describe('One icon = one meaning rule'),
    reusePolicy: z.string().describe('When to reuse existing icons'),
    newIconCriteria: z.array(z.string()).describe('Criteria for introducing new icons'),
    consistencyGuidelines: z.array(z.string()).describe('Consistency guidelines'),
  }),

  usageRules: z.object({
    do: z.array(z.string()).describe('Icon usage best practices'),
    dont: z.array(z.string()).describe('Icon usage anti-patterns'),
  }),

  accessibilityGuidance: z.object({
    labelingExpectations: z.string().describe('Text label requirements'),
    contrastConsiderations: z.string().describe('Contrast requirements'),
    nonVisualSignaling: z.string().describe('When icons must not be the only signal'),
    touchTargets: z.string().describe('Touch target requirements'),
  }),

  generatedAt: z.string().describe('ISO timestamp of generation'),
});

export type Iconography = z.infer<typeof IconographySchema>;

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

  // M4B: Visual Signature (optional, generated after M4A.1)
  visualSignature: VisualSignatureSchema.optional().describe('Visual signature system'),

  // M4C: Iconography System (optional, generated after M4B)
  iconography: IconographySchema.optional().describe('Iconography system'),

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

/**
 * M5B: Layout Grammar Schema
 * Dynamic composition of layout structure
 */
export const EntityViewConfigSchema = z.object({
  entityName: z.string().describe('Entity this config applies to'),
  viewType: z.enum(['table', 'cards', 'kanban', 'timeline', 'feed']).describe('How to display entity list'),
  listPrimaryField: z.string().describe('Primary field to display in list'),
  listColumns: z.array(z.string()).describe('Columns to show in list view'),
  createPattern: z.enum(['page', 'modal']).describe('How to create new entities'),
  detailsPattern: z.enum(['page', 'drawer', 'modal']).describe('How to show entity details'),
});

export const DashboardBlockSchema = z.object({
  type: z.enum(['stats', 'chart', 'list', 'actions', 'activity', 'moment']).describe('Block type'),
  entityName: z.string().optional().describe('Entity this block relates to'),
  title: z.string().describe('Block title'),
  span: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]).describe('Grid span (1-4 columns)'),
});

export const LayoutGrammarSchema = z.object({
  // Navigation structure
  navPattern: z.enum(['sidebar', 'top', 'hybrid']).describe('Navigation pattern'),

  // Dashboard composition
  dashboardLayout: z.enum(['grid', 'rail', 'stacked']).describe('Dashboard layout style'),
  dashboardBlocks: z.array(DashboardBlockSchema).min(4).max(6).describe('Dashboard blocks'),

  // Entity presentation
  entityViews: z.array(EntityViewConfigSchema).describe('Per-entity view configuration'),

  // Global interaction model
  hierarchy: z.enum(['flat', 'nested', 'tabbed']).describe('Navigation hierarchy style'),
  density: z.enum(['compact', 'comfortable', 'spacious']).describe('UI density level'),
  interactionModel: z.enum(['click', 'hover-reveal', 'inline-edit']).describe('Primary interaction pattern'),

  // Metadata
  seed: z.number().describe('Deterministic seed for grammar generation'),
  generatedAt: z.string().describe('ISO timestamp of generation'),
});

export type LayoutGrammar = z.infer<typeof LayoutGrammarSchema>;

/**
 * M5C: Visual Emphasis Schema
 * Amplifies visual hierarchy, emphasis, and component personality
 */
export const ComponentPersonalitySchema = z.object({
  paddingScale: z.number().describe('Padding scale: 1.0 is baseline'),
  radiusPreference: z.enum(['tighter', 'baseline', 'softer']).describe('Radius preference'),
  borderVisibility: z.enum(['clear', 'subtle', 'minimal']).describe('Border visibility'),
  shadowUsage: z.enum(['pronounced', 'standard', 'minimal', 'none']).describe('Shadow usage'),
  ctaProminence: z.enum(['high', 'medium', 'low']).describe('CTA prominence'),
  textContrast: z.enum(['high', 'medium', 'low']).describe('Text contrast'),
});

export const SectionWeightSchema = z.object({
  level: z.enum(['dominant', 'primary', 'secondary', 'tertiary', 'muted']).describe('Emphasis level'),
  backgroundShift: z.enum(['none', 'subtle', 'strong']).describe('Background shift'),
  borderEmphasis: z.enum(['none', 'subtle', 'strong']).describe('Border emphasis'),
  paddingMultiplier: z.number().describe('Padding multiplier'),
  headingScale: z.number().describe('Heading scale'),
});

export const VisualEmphasisSchema = z.object({
  dashboardFocus: z.enum(['metrics-first', 'narrative', 'workflow-first']).describe('Dashboard focus style'),
  button: ComponentPersonalitySchema.describe('Button personality'),
  card: ComponentPersonalitySchema.describe('Card personality'),
  dataTable: ComponentPersonalitySchema.describe('DataTable personality'),
  entityForm: ComponentPersonalitySchema.describe('EntityForm personality'),
  sidebar: ComponentPersonalitySchema.describe('Sidebar personality'),
  dashboardSections: z.object({
    primary: SectionWeightSchema.describe('Primary section weight'),
    secondary: SectionWeightSchema.describe('Secondary section weight'),
    tertiary: SectionWeightSchema.describe('Tertiary section weight'),
  }).describe('Dashboard section weights'),
  categoryHeuristics: z.object({
    category: z.string().describe('Category name'),
    density: z.enum(['dense', 'balanced', 'spacious']).describe('Density level'),
    separators: z.enum(['strong', 'standard', 'soft']).describe('Separator style'),
    hierarchy: z.enum(['pronounced', 'balanced', 'subtle']).describe('Hierarchy style'),
    decoration: z.enum(['minimal', 'moderate', 'expressive']).describe('Decoration level'),
  }).describe('Category-native heuristics'),
  signatureEnforcement: z.object({
    shapeApplied: z.boolean().describe('Shape dimension applied'),
    densityApplied: z.boolean().describe('Density dimension applied'),
    contrastApplied: z.boolean().describe('Contrast dimension applied'),
    motionApplied: z.boolean().describe('Motion dimension applied'),
    layoutApplied: z.boolean().describe('Layout dimension applied'),
  }).describe('Visual signature enforcement flags'),
  summary: z.string().describe('Summary string for debugging'),
  generatedAt: z.string().describe('ISO timestamp'),
});

export type VisualEmphasis = z.infer<typeof VisualEmphasisSchema>;

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
  layoutGrammar: LayoutGrammarSchema.optional(),  // M5B: Layout Grammar
  visualEmphasis: VisualEmphasisSchema.optional(),  // M5C: Visual Emphasis
  launchAssets: LaunchAssetsSchema.optional(),  // M6: Launch Assets
  evolution: EvolutionRoadmapSchema.optional(),  // M8: Evolution Roadmap
  error: z.string().optional(),
});

export type OaxeOutput = z.infer<typeof OaxeOutputSchema>;
export type Run = z.infer<typeof RunSchema>;
