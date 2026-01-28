export interface GeneratedFile {
  path: string;
  content: string;
}

export interface FileTreeNode {
  name: string;
  type: 'file' | 'directory';
  children?: FileTreeNode[];
}

export interface GenerationResult {
  slug: string;
  outputPath: string;
  fileTree: FileTreeNode;
  files: GeneratedFile[];
}

export interface GeneratorOptions {
  dryRun?: boolean;
  force?: boolean;
  /** Original user directive - used for brand-driven token generation */
  directive?: string;
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
