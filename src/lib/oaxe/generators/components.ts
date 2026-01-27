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

function mapFieldToInputType(type: string): string {
  const normalized = type.toLowerCase().trim();
  switch (normalized) {
    case 'number':
    case 'int':
    case 'integer':
    case 'float':
    case 'decimal':
      return 'number';
    case 'boolean':
    case 'bool':
      return 'checkbox';
    case 'date':
      return 'date';
    case 'datetime':
    case 'timestamp':
      return 'datetime-local';
    case 'text':
      return 'textarea';
    case 'email':
      return 'email';
    case 'url':
      return 'url';
    default:
      return 'text';
  }
}

function generateAppShell(output: OaxeOutput): string {
  return `'use client';

import { useState } from 'react';
import { Sidebar } from './Sidebar';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-14 bg-zinc-900 border-b border-zinc-800 z-40 flex items-center px-4">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 hover:bg-zinc-800 rounded-lg transition-colors mr-4"
          aria-label="Toggle sidebar"
        >
          <svg
            className="w-5 h-5 text-zinc-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        <a href="/" className="text-lg font-semibold text-white">
          ${output.appName}
        </a>
      </header>

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} />

      {/* Main content */}
      <main
        className={\`pt-14 transition-all duration-200 \${
          sidebarOpen ? 'pl-64' : 'pl-0'
        }\`}
      >
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
`;
}

function generateSidebar(output: OaxeOutput): string {
  // Build navigation items from pages AND entities
  // CRITICAL: Sidebar must link to base entity routes (e.g., /job not /job/[id])
  const navItemsMap = new Map<string, { route: string; label: string }>();

  // First, add all entities as nav items (ensures every entity has a sidebar link)
  for (const entity of output.entities) {
    const entitySlug = entity.name.toLowerCase();
    const titleCase = entity.name.charAt(0).toUpperCase() + entity.name.slice(1);
    navItemsMap.set(entitySlug, { route: `/${entitySlug}`, label: titleCase });
  }

  // Then add pages (may override or add to entity nav items)
  for (const page of output.pages) {
    if (page.route === '/') continue;

    const route = page.route.replace(/^\/+/, '');
    // Extract base route (first segment only) for sidebar links
    // This ensures /job/[id] becomes /job in the sidebar
    const baseRoute = route.split('/')[0];
    if (!baseRoute) continue;

    // Skip dynamic route segments (don't add [id] type routes directly)
    if (baseRoute.startsWith('[') && baseRoute.endsWith(']')) continue;

    const titleCase = baseRoute.charAt(0).toUpperCase() + baseRoute.slice(1);

    // Only add if not already present (entities take precedence)
    if (!navItemsMap.has(baseRoute)) {
      navItemsMap.set(baseRoute, { route: `/${baseRoute}`, label: titleCase });
    }
  }

  const uniqueNav = Array.from(navItemsMap.values());

  return `'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
  isOpen: boolean;
}

const navItems = ${JSON.stringify(uniqueNav, null, 2)};

export function Sidebar({ isOpen }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={\`fixed top-14 left-0 bottom-0 w-64 bg-zinc-900 border-r border-zinc-800 transform transition-transform duration-200 z-30 \${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }\`}
    >
      <nav className="p-4 space-y-1">
        <Link
          href="/"
          className={\`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors \${
            pathname === '/'
              ? 'bg-primary-500/10 text-primary-400'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
          }\`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Dashboard
        </Link>
        {navItems.map((item) => (
          <Link
            key={item.route}
            href={item.route}
            className={\`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors \${
              pathname === item.route || pathname.startsWith(item.route + '/')
                ? 'bg-primary-500/10 text-primary-400'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }\`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
`;
}

function generateDataTable(output: OaxeOutput): string {
  return `'use client';

import { useState } from 'react';

interface Column<T> {
  key: keyof T;
  header: string;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
}

interface DataTableProps<T extends { id: string }> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
}

export function DataTable<T extends { id: string }>({
  data,
  columns,
  onRowClick,
  emptyMessage = 'No data available',
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const handleSort = (key: keyof T) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortKey) return 0;
    const aVal = a[sortKey];
    const bVal = b[sortKey];
    if (aVal === bVal) return 0;
    const comparison = aVal < bVal ? -1 : 1;
    return sortDir === 'asc' ? comparison : -comparison;
  });

  const formatValue = (value: unknown): string => {
    if (value === null || value === undefined) return '-';
    if (value instanceof Date) return value.toLocaleDateString();
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  };

  if (data.length === 0) {
    return (
      <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-12 text-center">
        <p className="text-zinc-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-800">
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  onClick={() => handleSort(col.key)}
                  className="px-4 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-2">
                    {col.header}
                    {sortKey === col.key && (
                      <span className="text-primary-400">
                        {sortDir === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {sortedData.map((row) => (
              <tr
                key={row.id}
                onClick={() => onRowClick?.(row)}
                className={\`\${
                  onRowClick ? 'cursor-pointer hover:bg-zinc-800/50' : ''
                } transition-colors\`}
              >
                {columns.map((col) => (
                  <td
                    key={String(col.key)}
                    className="px-4 py-3 text-sm text-zinc-300 whitespace-nowrap"
                  >
                    {col.render
                      ? col.render(row[col.key], row)
                      : formatValue(row[col.key])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
`;
}

function generateEntityForm(): string {
  return `'use client';

import { useState } from 'react';
import { ZodSchema, ZodError } from 'zod';

interface FieldConfig {
  name: string;
  label: string;
  type: 'text' | 'number' | 'email' | 'url' | 'date' | 'datetime-local' | 'checkbox' | 'textarea' | 'select';
  placeholder?: string;
  options?: { value: string; label: string }[];
  required?: boolean;
}

interface EntityFormProps<T> {
  fields: FieldConfig[];
  schema?: ZodSchema<T>;
  onSubmit: (data: T) => void | Promise<void>;
  submitLabel?: string;
  initialValues?: Partial<T>;
}

export function EntityForm<T extends Record<string, unknown>>({
  fields,
  schema,
  onSubmit,
  submitLabel = 'Create',
  initialValues = {},
}: EntityFormProps<T>) {
  const [values, setValues] = useState<Record<string, unknown>>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (name: string, value: unknown) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      let validatedData = values as T;

      if (schema) {
        validatedData = schema.parse(values) as T;
      }

      await onSubmit(validatedData);
      setValues({});
    } catch (err) {
      if (err instanceof ZodError) {
        const fieldErrors: Record<string, string> = {};
        err.errors.forEach((e) => {
          const path = e.path.join('.');
          fieldErrors[path] = e.message;
        });
        setErrors(fieldErrors);
      } else {
        setErrors({ _form: 'An error occurred. Please try again.' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (field: FieldConfig) => {
    const value = values[field.name] ?? '';
    const error = errors[field.name];
    const baseInputClass =
      'w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors';

    if (field.type === 'checkbox') {
      return (
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={Boolean(value)}
            onChange={(e) => handleChange(field.name, e.target.checked)}
            className="w-4 h-4 rounded border-zinc-600 bg-zinc-800 text-primary-500 focus:ring-primary-500"
          />
          <span className="text-sm text-zinc-300">{field.label}</span>
        </label>
      );
    }

    if (field.type === 'textarea') {
      return (
        <textarea
          value={String(value)}
          onChange={(e) => handleChange(field.name, e.target.value)}
          placeholder={field.placeholder}
          rows={4}
          className={\`\${baseInputClass} resize-none\`}
        />
      );
    }

    if (field.type === 'select') {
      return (
        <select
          value={String(value)}
          onChange={(e) => handleChange(field.name, e.target.value)}
          className={baseInputClass}
        >
          <option value="">Select {field.label.toLowerCase()}</option>
          {field.options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      );
    }

    return (
      <input
        type={field.type}
        value={field.type === 'number' ? (value as number) || '' : String(value)}
        onChange={(e) =>
          handleChange(
            field.name,
            field.type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value
          )
        }
        placeholder={field.placeholder}
        className={baseInputClass}
      />
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errors._form && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
          {errors._form}
        </div>
      )}

      {fields.map((field) => (
        <div key={field.name} className="space-y-1">
          {field.type !== 'checkbox' && (
            <label className="block text-sm font-medium text-zinc-300">
              {field.label}
              {field.required && <span className="text-red-400 ml-1">*</span>}
            </label>
          )}
          {renderField(field)}
          {errors[field.name] && (
            <p className="text-sm text-red-400">{errors[field.name]}</p>
          )}
        </div>
      ))}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full px-4 py-2 bg-primary-500 hover:bg-primary-600 disabled:bg-primary-500/50 text-white font-medium rounded-lg transition-colors"
      >
        {isSubmitting ? 'Submitting...' : submitLabel}
      </button>
    </form>
  );
}
`;
}

function generateStatusBadge(): string {
  return `interface StatusBadgeProps {
  status: string;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
}

const variantStyles: Record<string, string> = {
  default: 'bg-zinc-700 text-zinc-300',
  success: 'bg-green-500/10 text-green-400 border border-green-500/20',
  warning: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
  error: 'bg-red-500/10 text-red-400 border border-red-500/20',
  info: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
};

const statusVariants: Record<string, string> = {
  active: 'success',
  completed: 'success',
  done: 'success',
  pending: 'warning',
  waiting: 'warning',
  in_progress: 'info',
  processing: 'info',
  error: 'error',
  failed: 'error',
  cancelled: 'error',
  archived: 'default',
  inactive: 'default',
};

export function StatusBadge({ status, variant }: StatusBadgeProps) {
  const resolvedVariant = variant || statusVariants[status.toLowerCase()] || 'default';
  const styles = variantStyles[resolvedVariant];

  return (
    <span className={\`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium \${styles}\`}>
      {status}
    </span>
  );
}
`;
}

function generateButton(): string {
  return `import { forwardRef } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

const variantStyles = {
  primary: 'bg-primary-500 hover:bg-primary-600 text-white',
  secondary: 'bg-zinc-700 hover:bg-zinc-600 text-white',
  ghost: 'bg-transparent hover:bg-zinc-800 text-zinc-300',
  danger: 'bg-red-500 hover:bg-red-600 text-white',
};

const sizeStyles = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', isLoading, className = '', children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={\`inline-flex items-center justify-center font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed \${variantStyles[variant]} \${sizeStyles[size]} \${className}\`}
        {...props}
      >
        {isLoading && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
`;
}

function generateCard(): string {
  return `interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const paddingStyles = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export function Card({ children, className = '', padding = 'md' }: CardProps) {
  return (
    <div className={\`bg-zinc-900 rounded-xl border border-zinc-800 \${paddingStyles[padding]} \${className}\`}>
      {children}
    </div>
  );
}

interface CardHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function CardHeader({ title, description, action }: CardHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-4">
      <div>
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        {description && <p className="text-sm text-zinc-400 mt-1">{description}</p>}
      </div>
      {action}
    </div>
  );
}
`;
}

export function generateComponents(output: OaxeOutput): GeneratedFile[] {
  const files: GeneratedFile[] = [];

  // AppShell component
  files.push({
    path: 'src/components/AppShell.tsx',
    content: generateAppShell(output),
  });

  // Sidebar component
  files.push({
    path: 'src/components/Sidebar.tsx',
    content: generateSidebar(output),
  });

  // DataTable component
  files.push({
    path: 'src/components/DataTable.tsx',
    content: generateDataTable(output),
  });

  // EntityForm component
  files.push({
    path: 'src/components/EntityForm.tsx',
    content: generateEntityForm(),
  });

  // StatusBadge component
  files.push({
    path: 'src/components/StatusBadge.tsx',
    content: generateStatusBadge(),
  });

  // Button component
  files.push({
    path: 'src/components/Button.tsx',
    content: generateButton(),
  });

  // Card component
  files.push({
    path: 'src/components/Card.tsx',
    content: generateCard(),
  });

  // Components index
  files.push({
    path: 'src/components/index.ts',
    content: `export { AppShell } from './AppShell';
export { Sidebar } from './Sidebar';
export { DataTable } from './DataTable';
export { EntityForm } from './EntityForm';
export { StatusBadge } from './StatusBadge';
export { Button } from './Button';
export { Card, CardHeader } from './Card';
`,
  });

  return files;
}
