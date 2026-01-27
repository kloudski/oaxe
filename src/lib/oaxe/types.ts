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
  brandDNA: {
    name: string;
    tone: string;
    values: string[];
    positioning: string;
  };
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

export interface Run {
  id: string;
  directive: string;
  status: RunStatus;
  createdAt: string;
  updatedAt: string;
  logs: LogEntry[];
  output?: OaxeOutput;
  generatedApp?: GeneratedApp;
  error?: string;
}
