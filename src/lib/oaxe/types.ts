/**
 * M4A: Enhanced Brand DNA Interface
 * Structured brand identity for consistent product generation
 */
export interface BrandDNA {
  // Core identity
  name: string;
  tagline: string;
  category: string;

  // Brand personality
  mood: string;
  archetype: string;

  // Positioning
  positioning: {
    statement: string;
    targetAudience: string;
    differentiator: string;
  };

  // Voice & Tone
  voice: {
    tone: string;
    style: string;
    keywords: string[];
  };

  // Visual identity
  visual: {
    primaryColor: string;
    colorPalette: string[];
    aesthetic: string;
    iconStyle: string;
  };

  // Brand moments
  productBrandMoments: {
    moment: string;
    description: string;
    emotion: string;
  }[];

  // Values & guardrails
  values: string[];
  guardrails: {
    doSay: string[];
    dontSay: string[];
    visualDo: string[];
    visualDont: string[];
  };
}

/**
 * Legacy brandDNA format for backward compatibility
 */
export interface LegacyBrandDNA {
  name: string;
  tone: string;
  values: string[];
  positioning: string;
}

export interface OaxeOutput {
  appName: string;
  slug: string;
  elevatorPitch: string;
  productSpec: {
    description: string;
    personas: string[];
    coreFeatures: string[];
  };
  architecture: {
    frontend: string;
    backend: string;
    infra: string;
  };
  entities: {
    name: string;
    fields: { name: string; type: string }[];
  }[];
  apis: {
    method: string;
    path: string;
    purpose: string;
  }[];
  pages: {
    route: string;
    purpose: string;
  }[];
  designTokens: {
    typography: string[];
    colors: string[];
    spacing: string[];
  };
  brandDNA: LegacyBrandDNA;
  roadmap: {
    v1: string[];
    v2: string[];
    v3: string[];
  };
  founderTweets: string[];
}

export type RunStatus = 'pending' | 'running' | 'completed' | 'error';

export interface LogEntry {
  timestamp: string;
  level: 'info' | 'warn' | 'error';
  message: string;
}

export interface FileTreeNode {
  name: string;
  type: 'file' | 'directory';
  children?: FileTreeNode[];
}

export interface GeneratedApp {
  slug: string;
  path: string;
  fileTree: FileTreeNode;
  fileCount: number;
}

/**
 * M6: Launch Assets
 * Coherent, brand-aligned marketing assets for product launch
 */
export interface LaunchAssets {
  founderTweets: string[];
  pinnedTweet: string;
  heroCopy: {
    headline: string;
    subheadline: string;
    bullets: string[];
  };
  screenshotSpec: {
    heroScreenshot: {
      screen: string;
      rationale: string;
      copyOverlay?: string;
    };
    supportingScreenshots: {
      screen: string;
      communicates: string;
      copyOverlay?: string;
    }[];
  };
  productHuntTagline: string;
  generatedAt: string;
  /** M6.1: Quality warnings if copy lint/spec checks failed after repair attempts */
  qualityWarnings?: string[];
}

/**
 * M8: Evolution Roadmap
 * Strategic v1 → v2 → v3 evolution roadmap
 */
export interface VersionPhase {
  version: string;
  title: string;
  timeline: string;
  sections: {
    problemStatement?: string;
    mustHaveFeatures?: string[];
    notBuilt?: string[];
    targetUser?: string;
    useCase?: string;
    successMetrics?: string[];
    technicalConstraints?: string[];
    featureExpansions?: string[];
    architectureEvolution?: string[];
    scalingConsiderations?: string[];
    monetization?: string;
    moatBuilding?: string[];
    categoryExpansion?: string;
    platformStrategy?: string;
    advancedMonetization?: string;
    partnerships?: string[];
    differentiationNarrative?: string;
  };
}

export interface FeatureProgression {
  feature: string;
  v1: string;
  v2: string;
  v3: string;
}

export interface EvolutionRoadmap {
  appName: string;
  category: string;
  generatedAt: string;
  v1: VersionPhase;
  v2: VersionPhase;
  v3: VersionPhase;
  featureProgression: FeatureProgression[];
  architectureNotes: {
    v1ToV2: string[];
    v2ToV3: string[];
    technicalDebt: string[];
  };
  monetizationEvolution: {
    v1: string;
    v2: string;
    v3: string;
  };
}

export interface Run {
  id: string;
  directive: string;
  status: RunStatus;
  createdAt: string;
  updatedAt: string;
  logs: LogEntry[];
  output?: OaxeOutput;
  generatedApp?: GeneratedApp;
  brandDNA?: BrandDNA;  // M4A: Enhanced Brand DNA
  launchAssets?: LaunchAssets;  // M6: Launch Assets
  evolution?: EvolutionRoadmap;  // M8: Evolution Roadmap
  error?: string;
}
