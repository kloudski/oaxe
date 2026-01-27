import type { OaxeOutput } from '../types';
import type { GeneratedFile } from './types';
import { RESERVED_APP_ROUTES, getEntityBasePath, getEntityLabel } from './pages';

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
    <div className="min-h-screen bg-[var(--bg-secondary)]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-14 bg-[var(--bg-primary)] border-b border-[var(--border-default)] z-40 flex items-center justify-between px-4 shadow-[var(--shadow-xs)]">
        <div className="flex items-center">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-[var(--bg-hover)] rounded-lg transition-colors mr-3"
            aria-label="Toggle sidebar"
          >
            <svg
              className="w-5 h-5 text-[var(--text-muted)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <a href="/" className="text-base font-semibold text-[var(--text-primary)] tracking-tight">
            ${output.appName}
          </a>
        </div>

        {/* Header actions placeholder */}
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-[var(--bg-hover)] rounded-lg transition-colors">
            <svg className="w-5 h-5 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          <div className="w-8 h-8 rounded-full bg-[var(--accent-muted)] flex items-center justify-center">
            <span className="text-sm font-medium text-primary-600 dark:text-primary-400">U</span>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} />

      {/* Main content */}
      <main
        className={\`pt-14 transition-all duration-200 \${
          sidebarOpen ? 'pl-60' : 'pl-0'
        }\`}
      >
        <div className="p-6 md:p-8 max-w-7xl">{children}</div>
      </main>
    </div>
  );
}
`;
}

function generateSidebar(output: OaxeOutput): string {
  // Build entity navigation items with collision-aware routing
  // CRITICAL: Entities that collide with reserved routes use /e/<entity> prefix
  const entityNavItems: { route: string; label: string }[] = [];

  for (const entity of output.entities) {
    const basePath = getEntityBasePath(entity.name);
    const label = getEntityLabel(entity.name);
    entityNavItems.push({ route: `/${basePath}`, label });
  }

  return `'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
  isOpen: boolean;
}

const entityNavItems = ${JSON.stringify(entityNavItems, null, 2)};

// Helper to check if a path is active (normalizes paths for comparison)
function isPathActive(pathname: string, route: string): boolean {
  const normalizedPathname = pathname.replace(/\\/+$/, '').toLowerCase();
  const normalizedRoute = route.replace(/\\/+$/, '').toLowerCase();

  // Exact match
  if (normalizedPathname === normalizedRoute) return true;

  // Check if pathname starts with route (for sub-routes like /e/dashboard/123)
  if (normalizedPathname.startsWith(normalizedRoute + '/')) return true;

  return false;
}

export function Sidebar({ isOpen }: SidebarProps) {
  const pathname = usePathname();

  // Dashboard is active only at root "/" and NOT when on /e/dashboard or entity pages
  const isDashboardActive = pathname === '/' || pathname === '/dashboard';
  const isOnEntityRoute = pathname.startsWith('/e/') || entityNavItems.some(item => isPathActive(pathname, item.route));
  const showDashboardActive = isDashboardActive && !isOnEntityRoute;

  return (
    <aside
      className={\`fixed top-14 left-0 bottom-0 w-60 bg-[var(--bg-primary)] border-r border-[var(--border-default)] transform transition-transform duration-200 z-30 \${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }\`}
    >
      <nav className="p-3 space-y-0.5">
        {/* Dashboard link - Core app route, always at / */}
        <Link
          href="/"
          className={\`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 \${
            showDashboardActive
              ? 'bg-[var(--accent-muted)] text-primary-600 dark:text-primary-400'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]'
          }\`}
        >
          <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Dashboard
        </Link>

        {/* Section label */}
        <div className="pt-4 pb-1 px-3">
          <span className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Entities</span>
        </div>

        {/* Entity nav items - use collision-aware paths */}
        {entityNavItems.map((item) => (
          <Link
            key={item.route}
            href={item.route}
            className={\`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 \${
              isPathActive(pathname, item.route)
                ? 'bg-[var(--accent-muted)] text-primary-600 dark:text-primary-400'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]'
            }\`}
          >
            <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
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
  isLoading?: boolean;
}

export function DataTable<T extends { id: string }>({
  data,
  columns,
  onRowClick,
  emptyMessage = 'No data available',
  isLoading = false,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSort = (key: keyof T) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const handleRowClick = (row: T) => {
    setSelectedId(row.id === selectedId ? null : row.id);
    onRowClick?.(row);
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
    if (value === null || value === undefined) return '—';
    if (value instanceof Date) return value.toLocaleDateString();
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-default)] overflow-hidden">
        <div className="p-12 text-center">
          <div className="inline-flex items-center gap-2 text-[var(--text-muted)]">
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span className="text-sm">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (data.length === 0) {
    return (
      <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-default)] overflow-hidden">
        <div className="p-12 text-center">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center">
            <svg className="w-6 h-6 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <p className="text-[var(--text-secondary)] font-medium">{emptyMessage}</p>
          <p className="text-sm text-[var(--text-muted)] mt-1">Create your first item to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-default)] overflow-hidden shadow-[var(--shadow-sm)]">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--border-default)] bg-[var(--bg-secondary)]">
              {columns.map((col, index) => (
                <th
                  key={String(col.key)}
                  onClick={() => handleSort(col.key)}
                  className={\`px-4 py-3 text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider cursor-pointer hover:text-[var(--text-primary)] transition-colors select-none \${
                    index !== columns.length - 1 ? 'border-r border-[var(--border-subtle)]' : ''
                  }\`}
                >
                  <div className="flex items-center gap-1.5">
                    {col.header}
                    {sortKey === col.key && (
                      <svg className="w-3.5 h-3.5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {sortDir === 'asc'
                          ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        }
                      </svg>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedData.map((row, rowIndex) => (
              <tr
                key={row.id}
                onClick={() => handleRowClick(row)}
                className={\`\${
                  onRowClick ? 'cursor-pointer' : ''
                } \${
                  selectedId === row.id
                    ? 'bg-[var(--accent-muted)]'
                    : 'hover:bg-[var(--bg-hover)]'
                } \${
                  rowIndex !== sortedData.length - 1 ? 'border-b border-[var(--border-subtle)]' : ''
                } transition-colors\`}
              >
                {columns.map((col) => (
                  <td
                    key={String(col.key)}
                    className="px-4 py-3.5 text-sm text-[var(--text-primary)]"
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
  helperText?: string;
  options?: { value: string; label: string }[];
  required?: boolean;
}

interface EntityFormProps<T> {
  fields: FieldConfig[];
  schema?: ZodSchema<T>;
  onSubmit: (data: T) => void | Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
  initialValues?: Partial<T>;
}

export function EntityForm<T extends Record<string, unknown>>({
  fields,
  schema,
  onSubmit,
  onCancel,
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

  const baseInputClass =
    'w-full px-3.5 py-2.5 bg-[var(--bg-primary)] border border-[var(--border-default)] rounded-lg text-[var(--text-primary)] placeholder:text-[var(--text-placeholder)] transition-all duration-150 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20';

  const errorInputClass = 'border-red-400 dark:border-red-500 focus:border-red-500 focus:ring-red-500/20';

  const renderField = (field: FieldConfig) => {
    const value = values[field.name] ?? '';
    const hasError = Boolean(errors[field.name]);
    const inputClass = hasError ? \`\${baseInputClass} \${errorInputClass}\` : baseInputClass;

    if (field.type === 'checkbox') {
      return (
        <label className="inline-flex items-center gap-3 cursor-pointer py-1">
          <input
            type="checkbox"
            checked={Boolean(value)}
            onChange={(e) => handleChange(field.name, e.target.checked)}
            className="w-4 h-4 rounded border-[var(--border-default)] bg-[var(--bg-primary)] text-primary-500 focus:ring-primary-500 focus:ring-offset-0 transition-colors"
          />
          <span className="text-sm text-[var(--text-primary)]">{field.label}</span>
        </label>
      );
    }

    if (field.type === 'textarea') {
      return (
        <textarea
          value={String(value)}
          onChange={(e) => handleChange(field.name, e.target.value)}
          placeholder={field.placeholder || \`Enter \${field.label.toLowerCase()}\`}
          rows={4}
          className={\`\${inputClass} resize-none\`}
        />
      );
    }

    if (field.type === 'select') {
      return (
        <select
          value={String(value)}
          onChange={(e) => handleChange(field.name, e.target.value)}
          className={inputClass}
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
        placeholder={field.placeholder || \`Enter \${field.label.toLowerCase()}\`}
        className={inputClass}
      />
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {errors._form && (
        <div className="p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg flex items-start gap-3">
          <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm text-red-600 dark:text-red-400">{errors._form}</p>
        </div>
      )}

      <div className="space-y-5">
        {fields.map((field) => (
          <div key={field.name}>
            {field.type !== 'checkbox' && (
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
                {field.label}
                {field.required && <span className="text-red-500 ml-0.5">*</span>}
              </label>
            )}
            {renderField(field)}
            {field.helperText && !errors[field.name] && (
              <p className="text-xs text-[var(--text-muted)] mt-1.5">{field.helperText}</p>
            )}
            {errors[field.name] && (
              <p className="text-sm text-red-500 mt-1.5 flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {errors[field.name]}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Form actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border-default)]">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-[var(--bg-primary)] border border-[var(--border-default)] hover:border-[var(--border-strong)] rounded-lg transition-all duration-150"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-5 py-2.5 text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-all duration-150 flex items-center gap-2"
        >
          {isSubmitting && (
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          )}
          {isSubmitting ? 'Saving...' : submitLabel}
        </button>
      </div>
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

// Light-mode-first semantic color system
const variantStyles: Record<string, string> = {
  default: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300',
  success: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400',
  warning: 'bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400',
  error: 'bg-red-50 text-red-700 dark:bg-red-500/15 dark:text-red-400',
  info: 'bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400',
};

const statusVariants: Record<string, string> = {
  active: 'success',
  completed: 'success',
  done: 'success',
  approved: 'success',
  pending: 'warning',
  waiting: 'warning',
  review: 'warning',
  draft: 'warning',
  in_progress: 'info',
  processing: 'info',
  new: 'info',
  open: 'info',
  error: 'error',
  failed: 'error',
  cancelled: 'error',
  rejected: 'error',
  archived: 'default',
  inactive: 'default',
  closed: 'default',
};

export function StatusBadge({ status, variant }: StatusBadgeProps) {
  const resolvedVariant = variant || statusVariants[status.toLowerCase().replace(/[\\s-]/g, '_')] || 'default';
  const styles = variantStyles[resolvedVariant];

  // Format display text (capitalize, replace underscores)
  const displayText = status
    .replace(/[_-]/g, ' ')
    .replace(/\\b\\w/g, (c) => c.toUpperCase());

  return (
    <span className={\`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium tracking-wide \${styles}\`}>
      {displayText}
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

// Light-mode-first button variants
const variantStyles = {
  primary: 'bg-primary-500 hover:bg-primary-600 text-white shadow-sm',
  secondary: 'bg-[var(--bg-primary)] border border-[var(--border-default)] hover:border-[var(--border-strong)] hover:bg-[var(--bg-hover)] text-[var(--text-primary)]',
  ghost: 'bg-transparent hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]',
  danger: 'bg-red-500 hover:bg-red-600 text-white shadow-sm',
};

const sizeStyles = {
  sm: 'px-3 py-1.5 text-sm gap-1.5',
  md: 'px-4 py-2 text-sm gap-2',
  lg: 'px-5 py-2.5 text-base gap-2',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', isLoading, className = '', children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={\`inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed \${variantStyles[variant]} \${sizeStyles[size]} \${className}\`}
        {...props}
      >
        {isLoading && (
          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
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
  md: 'p-5',
  lg: 'p-6',
};

export function Card({ children, className = '', padding = 'md' }: CardProps) {
  return (
    <div className={\`bg-[var(--bg-primary)] rounded-xl border border-[var(--border-default)] shadow-[var(--shadow-sm)] \${paddingStyles[padding]} \${className}\`}>
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
    <div className="flex items-start justify-between mb-5 pb-4 border-b border-[var(--border-subtle)]">
      <div>
        <h3 className="text-base font-semibold text-[var(--text-primary)]">{title}</h3>
        {description && <p className="text-sm text-[var(--text-muted)] mt-1">{description}</p>}
      </div>
      {action}
    </div>
  );
}

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function CardFooter({ children, className = '' }: CardFooterProps) {
  return (
    <div className={\`mt-5 pt-4 border-t border-[var(--border-subtle)] flex items-center justify-end gap-3 \${className}\`}>
      {children}
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
export { Card, CardHeader, CardFooter } from './Card';
`,
  });

  return files;
}
