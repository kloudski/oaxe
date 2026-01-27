'use client';

import { useState } from 'react';
import type { FileTreeNode } from '@/lib/oaxe/types';

interface FileTreeProps {
  tree: FileTreeNode;
  level?: number;
}

function FileIcon({ type }: { type: 'file' | 'directory' }) {
  if (type === 'directory') {
    return (
      <svg
        className="w-4 h-4 text-yellow-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
        />
      </svg>
    );
  }

  return (
    <svg
      className="w-4 h-4 text-zinc-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  );
}

function TreeNode({ node, level = 0 }: { node: FileTreeNode; level: number }) {
  const [isExpanded, setIsExpanded] = useState(level < 2);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div>
      <div
        className={`flex items-center gap-2 py-1 px-2 hover:bg-zinc-800/50 rounded cursor-pointer ${
          level === 0 ? '' : ''
        }`}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={() => hasChildren && setIsExpanded(!isExpanded)}
      >
        {hasChildren && (
          <svg
            className={`w-3 h-3 text-zinc-500 transition-transform ${
              isExpanded ? 'rotate-90' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        )}
        {!hasChildren && <span className="w-3" />}
        <FileIcon type={node.type} />
        <span
          className={`text-sm ${
            node.type === 'directory' ? 'text-zinc-200' : 'text-zinc-400'
          }`}
        >
          {node.name}
        </span>
      </div>
      {isExpanded && hasChildren && (
        <div>
          {node.children!.map((child, i) => (
            <TreeNode key={`${child.name}-${i}`} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export function FileTree({ tree, level = 0 }: FileTreeProps) {
  // Skip the root node and render children directly
  if (tree.name === '/' && tree.children) {
    return (
      <div className="font-mono text-sm">
        {tree.children.map((child, i) => (
          <TreeNode key={`${child.name}-${i}`} node={child} level={0} />
        ))}
      </div>
    );
  }

  return (
    <div className="font-mono text-sm">
      <TreeNode node={tree} level={level} />
    </div>
  );
}
