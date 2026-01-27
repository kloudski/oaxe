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
}
