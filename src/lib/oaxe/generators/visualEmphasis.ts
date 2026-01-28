/**
 * M5C: Visual Emphasis & Hierarchy Amplification
 *
 * Eliminates the "generic SaaS" look by amplifying visual hierarchy, emphasis,
 * and component personality using existing LayoutGrammar, BrandDNA, VisualSignature,
 * and Token systems.
 *
 * This must make two generated apps feel visually distinct at a glance,
 * even if they share components and layouts.
 */

import type { BrandDNA, LayoutGrammar, DashboardLayout, VisualSignature } from '../types';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Emphasis level for UI elements
 * Determines visual weight through size, spacing, contrast
 */
export type EmphasisLevel = 'dominant' | 'primary' | 'secondary' | 'tertiary' | 'muted';

/**
 * Dashboard focus style - what the dashboard emphasizes
 */
export type DashboardFocus = 'metrics-first' | 'narrative' | 'workflow-first';

/**
 * Component personality modulation settings
 */
export interface ComponentPersonality {
  // Padding scale: 1.0 is baseline, <1.0 is tighter, >1.0 is more generous
  paddingScale: number;
  // Radius preference: 'tighter' | 'baseline' | 'softer'
  radiusPreference: 'tighter' | 'baseline' | 'softer';
  // Border visibility: 'clear' | 'subtle' | 'minimal'
  borderVisibility: 'clear' | 'subtle' | 'minimal';
  // Shadow usage: 'pronounced' | 'standard' | 'minimal' | 'none'
  shadowUsage: 'pronounced' | 'standard' | 'minimal' | 'none';
  // CTA prominence: 'high' | 'medium' | 'low'
  ctaProminence: 'high' | 'medium' | 'low';
  // Text contrast: 'high' | 'medium' | 'low'
  textContrast: 'high' | 'medium' | 'low';
}

/**
 * Section weighting for pages
 */
export interface SectionWeight {
  level: EmphasisLevel;
  backgroundShift: 'none' | 'subtle' | 'strong';
  borderEmphasis: 'none' | 'subtle' | 'strong';
  paddingMultiplier: number;
  headingScale: number;
}

/**
 * Complete Visual Emphasis configuration
 */
export interface VisualEmphasis {
  // Dashboard focus
  dashboardFocus: DashboardFocus;

  // Component personality modulations
  button: ComponentPersonality;
  card: ComponentPersonality;
  dataTable: ComponentPersonality;
  entityForm: ComponentPersonality;
  sidebar: ComponentPersonality;

  // Section weights for dashboard
  dashboardSections: {
    primary: SectionWeight;
    secondary: SectionWeight;
    tertiary: SectionWeight;
  };

  // Category-native heuristics applied
  categoryHeuristics: {
    category: string;
    density: 'dense' | 'balanced' | 'spacious';
    separators: 'strong' | 'standard' | 'soft';
    hierarchy: 'pronounced' | 'balanced' | 'subtle';
    decoration: 'minimal' | 'moderate' | 'expressive';
  };

  // Visual signature enforcement flags
  signatureEnforcement: {
    shapeApplied: boolean;
    densityApplied: boolean;
    contrastApplied: boolean;
    motionApplied: boolean;
    layoutApplied: boolean;
  };

  // Summary for logging/debugging
  summary: string;

  // Metadata
  generatedAt: string;
}

// ============================================================================
// CATEGORY-NATIVE DEFAULTS
// ============================================================================

interface CategoryDefaults {
  density: 'dense' | 'balanced' | 'spacious';
  separators: 'strong' | 'standard' | 'soft';
  hierarchy: 'pronounced' | 'balanced' | 'subtle';
  decoration: 'minimal' | 'moderate' | 'expressive';
  dashboardFocus: DashboardFocus;
  paddingScale: number;
}

/**
 * Hard-locked category-driven visual heuristics
 * These override neutral defaults
 */
const CATEGORY_DEFAULTS: Record<string, CategoryDefaults> = {
  legal: {
    density: 'dense',
    separators: 'strong',
    hierarchy: 'pronounced',
    decoration: 'minimal',
    dashboardFocus: 'metrics-first',
    paddingScale: 0.85,
  },
  finance: {
    density: 'dense',
    separators: 'strong',
    hierarchy: 'pronounced',
    decoration: 'minimal',
    dashboardFocus: 'metrics-first',
    paddingScale: 0.85,
  },
  healthcare: {
    density: 'balanced',
    separators: 'standard',
    hierarchy: 'balanced',
    decoration: 'minimal',
    dashboardFocus: 'workflow-first',
    paddingScale: 1.0,
  },
  wellness: {
    density: 'spacious',
    separators: 'soft',
    hierarchy: 'subtle',
    decoration: 'moderate',
    dashboardFocus: 'narrative',
    paddingScale: 1.25,
  },
  technology: {
    density: 'balanced',
    separators: 'standard',
    hierarchy: 'balanced',
    decoration: 'minimal',
    dashboardFocus: 'workflow-first',
    paddingScale: 0.95,
  },
  creative: {
    density: 'spacious',
    separators: 'soft',
    hierarchy: 'balanced',
    decoration: 'expressive',
    dashboardFocus: 'narrative',
    paddingScale: 1.15,
  },
  education: {
    density: 'balanced',
    separators: 'standard',
    hierarchy: 'balanced',
    decoration: 'moderate',
    dashboardFocus: 'narrative',
    paddingScale: 1.1,
  },
  ecommerce: {
    density: 'balanced',
    separators: 'standard',
    hierarchy: 'pronounced',
    decoration: 'moderate',
    dashboardFocus: 'workflow-first',
    paddingScale: 1.0,
  },
  social: {
    density: 'balanced',
    separators: 'soft',
    hierarchy: 'subtle',
    decoration: 'moderate',
    dashboardFocus: 'narrative',
    paddingScale: 1.1,
  },
  productivity: {
    density: 'dense',
    separators: 'standard',
    hierarchy: 'balanced',
    decoration: 'minimal',
    dashboardFocus: 'workflow-first',
    paddingScale: 0.9,
  },
  nature: {
    density: 'spacious',
    separators: 'soft',
    hierarchy: 'subtle',
    decoration: 'expressive',
    dashboardFocus: 'narrative',
    paddingScale: 1.2,
  },
  energy: {
    density: 'balanced',
    separators: 'standard',
    hierarchy: 'pronounced',
    decoration: 'moderate',
    dashboardFocus: 'workflow-first',
    paddingScale: 1.0,
  },
};

const DEFAULT_CATEGORY_DEFAULTS: CategoryDefaults = {
  density: 'balanced',
  separators: 'standard',
  hierarchy: 'balanced',
  decoration: 'minimal',
  dashboardFocus: 'workflow-first',
  paddingScale: 1.0,
};

// ============================================================================
// ARCHETYPE INFLUENCE ON COMPONENTS
// ============================================================================

interface ArchetypeModifiers {
  ctaProminence: 'high' | 'medium' | 'low';
  textContrast: 'high' | 'medium' | 'low';
  borderEmphasis: 'strong' | 'standard' | 'subtle';
}

const ARCHETYPE_MODIFIERS: Record<string, ArchetypeModifiers> = {
  Ruler: { ctaProminence: 'medium', textContrast: 'high', borderEmphasis: 'strong' },
  Hero: { ctaProminence: 'high', textContrast: 'high', borderEmphasis: 'standard' },
  Caregiver: { ctaProminence: 'low', textContrast: 'medium', borderEmphasis: 'subtle' },
  Creator: { ctaProminence: 'medium', textContrast: 'medium', borderEmphasis: 'subtle' },
  Sage: { ctaProminence: 'low', textContrast: 'high', borderEmphasis: 'standard' },
  Innocent: { ctaProminence: 'low', textContrast: 'medium', borderEmphasis: 'subtle' },
  Explorer: { ctaProminence: 'medium', textContrast: 'medium', borderEmphasis: 'standard' },
  Outlaw: { ctaProminence: 'high', textContrast: 'high', borderEmphasis: 'strong' },
  Magician: { ctaProminence: 'medium', textContrast: 'medium', borderEmphasis: 'subtle' },
  Everyman: { ctaProminence: 'medium', textContrast: 'medium', borderEmphasis: 'standard' },
  Lover: { ctaProminence: 'medium', textContrast: 'medium', borderEmphasis: 'subtle' },
  Jester: { ctaProminence: 'high', textContrast: 'medium', borderEmphasis: 'subtle' },
};

const DEFAULT_ARCHETYPE_MODIFIERS: ArchetypeModifiers = {
  ctaProminence: 'medium',
  textContrast: 'medium',
  borderEmphasis: 'standard',
};

// ============================================================================
// MOOD INFLUENCE ON RADIUS AND SHADOW
// ============================================================================

interface MoodStyles {
  radiusPreference: 'tighter' | 'baseline' | 'softer';
  shadowUsage: 'pronounced' | 'standard' | 'minimal' | 'none';
}

const MOOD_STYLES: Record<string, MoodStyles> = {
  professional: { radiusPreference: 'baseline', shadowUsage: 'standard' },
  calm: { radiusPreference: 'softer', shadowUsage: 'minimal' },
  bold: { radiusPreference: 'baseline', shadowUsage: 'pronounced' },
  friendly: { radiusPreference: 'softer', shadowUsage: 'standard' },
  minimal: { radiusPreference: 'tighter', shadowUsage: 'minimal' },
  vibrant: { radiusPreference: 'softer', shadowUsage: 'pronounced' },
  serious: { radiusPreference: 'tighter', shadowUsage: 'minimal' },
  playful: { radiusPreference: 'softer', shadowUsage: 'standard' },
  warm: { radiusPreference: 'softer', shadowUsage: 'standard' },
  elegant: { radiusPreference: 'baseline', shadowUsage: 'minimal' },
};

const DEFAULT_MOOD_STYLES: MoodStyles = {
  radiusPreference: 'baseline',
  shadowUsage: 'standard',
};

// ============================================================================
// VISUAL SIGNATURE ENFORCEMENT
// ============================================================================

/**
 * Derive component personality from visual signature
 */
function enforceVisualSignature(
  visualSignature: VisualSignature | undefined,
  basePersonality: ComponentPersonality
): ComponentPersonality {
  if (!visualSignature) return basePersonality;

  const result = { ...basePersonality };

  // Shape → radius preference
  const shapeProfile = visualSignature.shapeLanguage?.profile;
  if (shapeProfile === 'sharp') {
    result.radiusPreference = 'tighter';
  } else if (shapeProfile === 'rounded') {
    result.radiusPreference = 'softer';
  } else if (shapeProfile === 'mixed') {
    // Mixed: baseline for containers, softer for buttons (handled at component level)
    result.radiusPreference = 'baseline';
  }

  // Density → padding scale
  const densityProfile = visualSignature.densityRhythm?.profile;
  if (densityProfile === 'compact') {
    result.paddingScale = Math.min(result.paddingScale, 0.85);
  } else if (densityProfile === 'spacious') {
    result.paddingScale = Math.max(result.paddingScale, 1.2);
  }

  // Contrast → border and text contrast
  const contrastProfile = visualSignature.contrastPhilosophy?.profile;
  if (contrastProfile === 'low-contrast-calm') {
    result.borderVisibility = 'subtle';
    result.textContrast = 'medium';
    result.shadowUsage = 'minimal';
  } else if (contrastProfile === 'high-contrast-assertive') {
    result.borderVisibility = 'clear';
    result.textContrast = 'high';
    result.shadowUsage = 'pronounced';
  }

  return result;
}

// ============================================================================
// SECTION WEIGHTING
// ============================================================================

/**
 * Get section weights based on dashboard focus
 */
function getSectionWeights(
  dashboardFocus: DashboardFocus,
  category: string,
  archetype: string
): { primary: SectionWeight; secondary: SectionWeight; tertiary: SectionWeight } {
  const archetypeMods = ARCHETYPE_MODIFIERS[archetype] || DEFAULT_ARCHETYPE_MODIFIERS;
  const categoryDefaults = CATEGORY_DEFAULTS[category] || DEFAULT_CATEGORY_DEFAULTS;

  // Base weights
  const primary: SectionWeight = {
    level: 'dominant',
    backgroundShift: 'none',
    borderEmphasis: archetypeMods.borderEmphasis === 'strong' ? 'strong' : 'subtle',
    paddingMultiplier: 1.0,
    headingScale: 1.25, // Larger headings
  };

  const secondary: SectionWeight = {
    level: 'secondary',
    backgroundShift: 'none',
    borderEmphasis: 'none',
    paddingMultiplier: 0.9,
    headingScale: 1.0, // Normal headings
  };

  const tertiary: SectionWeight = {
    level: 'tertiary',
    backgroundShift: 'subtle',
    borderEmphasis: 'none',
    paddingMultiplier: 0.85,
    headingScale: 0.9, // Smaller headings
  };

  // Adjust based on dashboard focus
  switch (dashboardFocus) {
    case 'metrics-first':
      // Strong emphasis on KPI cards
      primary.backgroundShift = 'none';
      primary.borderEmphasis = 'strong';
      primary.paddingMultiplier = 0.95;
      secondary.backgroundShift = 'subtle';
      break;

    case 'narrative':
      // Headings and copy dominate, data recedes
      primary.headingScale = 1.35;
      primary.paddingMultiplier = 1.15;
      secondary.backgroundShift = 'none';
      tertiary.backgroundShift = 'subtle';
      break;

    case 'workflow-first':
      // Entity views dominate, chrome minimized
      primary.paddingMultiplier = 1.05;
      primary.borderEmphasis = 'subtle';
      secondary.paddingMultiplier = 0.85;
      tertiary.backgroundShift = 'strong';
      break;
  }

  // Adjust based on category hierarchy setting
  if (categoryDefaults.hierarchy === 'pronounced') {
    primary.headingScale *= 1.1;
    tertiary.backgroundShift = 'strong';
  } else if (categoryDefaults.hierarchy === 'subtle') {
    primary.headingScale *= 0.95;
    tertiary.backgroundShift = 'subtle';
  }

  return { primary, secondary, tertiary };
}

// ============================================================================
// COMPONENT PERSONALITY DERIVATION
// ============================================================================

/**
 * Derive component personality from brand DNA and category
 */
function deriveComponentPersonality(
  componentType: 'button' | 'card' | 'dataTable' | 'entityForm' | 'sidebar',
  brandDNA: BrandDNA,
  layoutGrammar?: LayoutGrammar
): ComponentPersonality {
  const category = brandDNA.category;
  const mood = brandDNA.mood;
  const archetype = brandDNA.archetype;

  const categoryDefaults = CATEGORY_DEFAULTS[category] || DEFAULT_CATEGORY_DEFAULTS;
  const moodStyles = MOOD_STYLES[mood] || DEFAULT_MOOD_STYLES;
  const archetypeMods = ARCHETYPE_MODIFIERS[archetype] || DEFAULT_ARCHETYPE_MODIFIERS;

  // Base personality from category
  let personality: ComponentPersonality = {
    paddingScale: categoryDefaults.paddingScale,
    radiusPreference: moodStyles.radiusPreference,
    borderVisibility: categoryDefaults.separators === 'strong' ? 'clear' :
                      categoryDefaults.separators === 'soft' ? 'minimal' : 'subtle',
    shadowUsage: moodStyles.shadowUsage,
    ctaProminence: archetypeMods.ctaProminence,
    textContrast: archetypeMods.textContrast,
  };

  // Component-specific adjustments
  switch (componentType) {
    case 'button':
      // Buttons get special treatment based on archetype
      if (archetype === 'Hero' || archetype === 'Outlaw') {
        personality.ctaProminence = 'high';
        personality.shadowUsage = 'pronounced';
      }
      if (mood === 'calm') {
        personality.ctaProminence = 'low';
        personality.shadowUsage = 'minimal';
      }
      break;

    case 'card':
      // Cards affected by layout grammar's dashboard layout
      if (layoutGrammar?.dashboardLayout === 'stacked') {
        personality.paddingScale *= 1.1;
        personality.borderVisibility = 'subtle';
      } else if (layoutGrammar?.dashboardLayout === 'grid') {
        personality.shadowUsage = 'standard';
      }
      break;

    case 'dataTable':
      // Tables are always denser for data-heavy categories
      if (category === 'legal' || category === 'finance' || category === 'productivity') {
        personality.paddingScale = Math.min(personality.paddingScale, 0.85);
        personality.borderVisibility = 'clear';
      }
      break;

    case 'entityForm':
      // Forms get more padding for wellness/education
      if (category === 'wellness' || category === 'education') {
        personality.paddingScale = Math.max(personality.paddingScale, 1.15);
        personality.borderVisibility = 'subtle';
      }
      break;

    case 'sidebar':
      // Sidebar density follows category
      personality.paddingScale = categoryDefaults.paddingScale * 0.95;
      if (categoryDefaults.density === 'dense') {
        personality.paddingScale *= 0.9;
      }
      break;
  }

  // Apply visual signature enforcement
  personality = enforceVisualSignature(brandDNA.visualSignature, personality);

  return personality;
}

// ============================================================================
// MAIN GENERATOR
// ============================================================================

/**
 * Generate Visual Emphasis configuration from Brand DNA and Layout Grammar
 */
export function generateVisualEmphasis(
  brandDNA: BrandDNA,
  layoutGrammar?: LayoutGrammar
): VisualEmphasis {
  const category = brandDNA.category;
  const archetype = brandDNA.archetype;

  const categoryDefaults = CATEGORY_DEFAULTS[category] || DEFAULT_CATEGORY_DEFAULTS;

  // Determine dashboard focus
  let dashboardFocus: DashboardFocus = categoryDefaults.dashboardFocus;
  if (layoutGrammar) {
    // Override based on layout grammar
    if (layoutGrammar.dashboardLayout === 'stacked') {
      dashboardFocus = 'narrative';
    } else if (layoutGrammar.dashboardLayout === 'rail') {
      dashboardFocus = 'workflow-first';
    }
  }

  // Generate component personalities
  const button = deriveComponentPersonality('button', brandDNA, layoutGrammar);
  const card = deriveComponentPersonality('card', brandDNA, layoutGrammar);
  const dataTable = deriveComponentPersonality('dataTable', brandDNA, layoutGrammar);
  const entityForm = deriveComponentPersonality('entityForm', brandDNA, layoutGrammar);
  const sidebar = deriveComponentPersonality('sidebar', brandDNA, layoutGrammar);

  // Generate section weights
  const dashboardSections = getSectionWeights(dashboardFocus, category, archetype);

  // Track signature enforcement
  const visualSignature = brandDNA.visualSignature;
  const signatureEnforcement = {
    shapeApplied: !!visualSignature?.shapeLanguage?.profile,
    densityApplied: !!visualSignature?.densityRhythm?.profile,
    contrastApplied: !!visualSignature?.contrastPhilosophy?.profile,
    motionApplied: !!visualSignature?.motionCharacter?.profile,
    layoutApplied: !!visualSignature?.layoutPhilosophy?.profile,
  };

  // Generate summary
  const summary = [
    `Focus: ${dashboardFocus}`,
    `Density: ${categoryDefaults.density}`,
    `Hierarchy: ${categoryDefaults.hierarchy}`,
    `CTA: ${button.ctaProminence}`,
    `Radius: ${button.radiusPreference}`,
    `Shadows: ${card.shadowUsage}`,
  ].join(' | ');

  return {
    dashboardFocus,
    button,
    card,
    dataTable,
    entityForm,
    sidebar,
    dashboardSections,
    categoryHeuristics: {
      category,
      density: categoryDefaults.density,
      separators: categoryDefaults.separators,
      hierarchy: categoryDefaults.hierarchy,
      decoration: categoryDefaults.decoration,
    },
    signatureEnforcement,
    summary,
    generatedAt: new Date().toISOString(),
  };
}

// ============================================================================
// CSS CLASS GENERATORS
// ============================================================================

/**
 * Get Tailwind classes for button based on emphasis
 */
export function getButtonEmphasisClasses(emphasis: VisualEmphasis): {
  primary: string;
  secondary: string;
} {
  const { button } = emphasis;

  // Primary button classes
  const primaryPadding = button.paddingScale < 0.9 ? 'px-3 py-1.5' :
                         button.paddingScale > 1.1 ? 'px-6 py-3' : 'px-4 py-2';
  const primaryRadius = button.radiusPreference === 'tighter' ? 'rounded-sm' :
                        button.radiusPreference === 'softer' ? 'rounded-lg' : 'rounded';
  const primaryShadow = button.shadowUsage === 'pronounced' ? 'shadow-md hover:shadow-lg' :
                        button.shadowUsage === 'standard' ? 'shadow-sm hover:shadow' :
                        button.shadowUsage === 'minimal' ? 'shadow-xs' : '';
  const primaryContrast = button.ctaProminence === 'high'
    ? 'font-semibold'
    : button.ctaProminence === 'low' ? 'font-normal' : 'font-medium';

  // Secondary button classes
  const secondaryPadding = primaryPadding;
  const secondaryRadius = primaryRadius;
  const secondaryShadow = button.shadowUsage === 'pronounced' ? 'shadow-sm' :
                          button.shadowUsage === 'standard' ? 'shadow-xs' : '';
  const secondaryBorder = button.borderVisibility === 'clear' ? 'border-2' :
                          button.borderVisibility === 'minimal' ? 'border' : 'border';

  return {
    primary: `${primaryPadding} ${primaryRadius} ${primaryShadow} ${primaryContrast}`.trim(),
    secondary: `${secondaryPadding} ${secondaryRadius} ${secondaryShadow} ${secondaryBorder}`.trim(),
  };
}

/**
 * Get Tailwind classes for card based on emphasis
 */
export function getCardEmphasisClasses(
  emphasis: VisualEmphasis,
  isPrimary: boolean = false
): string {
  const { card, dashboardSections } = emphasis;
  const section = isPrimary ? dashboardSections.primary : dashboardSections.secondary;

  const padding = card.paddingScale < 0.9 ? 'p-4' :
                  card.paddingScale > 1.1 ? 'p-6' : 'p-5';
  const radius = card.radiusPreference === 'tighter' ? 'rounded' :
                 card.radiusPreference === 'softer' ? 'rounded-xl' : 'rounded-lg';
  const shadow = card.shadowUsage === 'pronounced' ? 'shadow-md' :
                 card.shadowUsage === 'standard' ? 'shadow-sm' :
                 card.shadowUsage === 'minimal' ? 'shadow-xs' : 'shadow-none';
  const border = card.borderVisibility === 'clear' ? 'border-2 border-border' :
                 card.borderVisibility === 'minimal' ? 'border border-border-subtle' : 'border border-border';

  // Primary section emphasis
  const emphasisRing = isPrimary && section.borderEmphasis === 'strong'
    ? 'ring-1 ring-primary/20'
    : '';

  return `${padding} ${radius} ${shadow} ${border} ${emphasisRing}`.trim();
}

/**
 * Get Tailwind classes for data table based on emphasis
 */
export function getDataTableEmphasisClasses(emphasis: VisualEmphasis): {
  wrapper: string;
  row: string;
  cell: string;
  header: string;
} {
  const { dataTable } = emphasis;

  // Wrapper
  const wrapperRadius = dataTable.radiusPreference === 'tighter' ? 'rounded' :
                        dataTable.radiusPreference === 'softer' ? 'rounded-xl' : 'rounded-lg';
  const wrapperShadow = dataTable.shadowUsage === 'pronounced' ? 'shadow-md' :
                        dataTable.shadowUsage === 'standard' ? 'shadow-sm' : '';
  const wrapperBorder = dataTable.borderVisibility === 'clear' ? 'border-2 border-border' :
                        dataTable.borderVisibility === 'minimal' ? 'border border-border-subtle' : 'border border-border';

  // Row height based on padding scale
  const cellPadding = dataTable.paddingScale < 0.9 ? 'px-3 py-2' :
                      dataTable.paddingScale > 1.1 ? 'px-5 py-4' : 'px-4 py-3';

  // Header contrast
  const headerContrast = dataTable.textContrast === 'high'
    ? 'font-semibold text-fg'
    : dataTable.textContrast === 'low' ? 'font-normal text-fg-muted' : 'font-medium text-fg-muted';

  // Row separator
  const rowBorder = dataTable.borderVisibility === 'clear' ? 'border-b border-border' :
                    dataTable.borderVisibility === 'minimal' ? 'border-b border-border-subtle/50' : 'border-b border-border-subtle';

  return {
    wrapper: `${wrapperRadius} ${wrapperShadow} ${wrapperBorder}`.trim(),
    row: rowBorder,
    cell: cellPadding,
    header: `${cellPadding} ${headerContrast}`.trim(),
  };
}

/**
 * Get Tailwind classes for section based on weight
 */
export function getSectionEmphasisClasses(
  emphasis: VisualEmphasis,
  level: 'primary' | 'secondary' | 'tertiary'
): {
  wrapper: string;
  heading: string;
  content: string;
} {
  const section = emphasis.dashboardSections[level];

  // Background shift
  const bgClass = section.backgroundShift === 'strong' ? 'bg-muted/50' :
                  section.backgroundShift === 'subtle' ? 'bg-muted/30' : '';

  // Border emphasis
  const borderClass = section.borderEmphasis === 'strong' ? 'border-l-4 border-l-primary' :
                      section.borderEmphasis === 'subtle' ? 'border-l-2 border-l-border' : '';

  // Padding multiplier to Tailwind classes
  const paddingClass = section.paddingMultiplier < 0.9 ? 'p-3' :
                       section.paddingMultiplier > 1.1 ? 'p-6' : 'p-4';

  // Heading scale
  const headingClass = section.headingScale > 1.2 ? 'text-xl font-semibold' :
                       section.headingScale < 0.95 ? 'text-base font-medium' : 'text-lg font-semibold';

  // Content contrast
  const contentClass = level === 'tertiary' ? 'text-fg-secondary' : 'text-fg';

  return {
    wrapper: `${bgClass} ${borderClass} ${paddingClass}`.trim(),
    heading: headingClass,
    content: contentClass,
  };
}

/**
 * Get Tailwind classes for sidebar based on emphasis
 */
export function getSidebarEmphasisClasses(emphasis: VisualEmphasis): {
  wrapper: string;
  item: string;
  itemActive: string;
  section: string;
} {
  const { sidebar } = emphasis;

  // Item padding based on density
  const itemPadding = sidebar.paddingScale < 0.9 ? 'px-2.5 py-1.5' :
                      sidebar.paddingScale > 1.1 ? 'px-4 py-3' : 'px-3 py-2';
  const itemRadius = sidebar.radiusPreference === 'tighter' ? 'rounded' :
                     sidebar.radiusPreference === 'softer' ? 'rounded-lg' : 'rounded-md';

  // Active state
  const activeEmphasis = sidebar.ctaProminence === 'high' ? 'bg-primary-muted text-primary-600 font-medium' :
                         sidebar.ctaProminence === 'low' ? 'bg-muted text-fg' : 'bg-primary-muted text-primary-600';

  // Section label
  const sectionPadding = sidebar.paddingScale < 0.9 ? 'px-2.5 py-1' : 'px-3 py-1.5';

  return {
    wrapper: '',
    item: `${itemPadding} ${itemRadius}`.trim(),
    itemActive: `${itemPadding} ${itemRadius} ${activeEmphasis}`.trim(),
    section: sectionPadding,
  };
}

/**
 * Get Tailwind classes for forms based on emphasis
 */
export function getFormEmphasisClasses(emphasis: VisualEmphasis): {
  fieldWrapper: string;
  input: string;
  label: string;
  helperText: string;
} {
  const { entityForm } = emphasis;

  // Field spacing
  const fieldSpacing = entityForm.paddingScale < 0.9 ? 'space-y-4' :
                       entityForm.paddingScale > 1.1 ? 'space-y-7' : 'space-y-5';

  // Input styling
  const inputPadding = entityForm.paddingScale < 0.9 ? 'px-3 py-2' :
                       entityForm.paddingScale > 1.1 ? 'px-4 py-3' : 'px-3.5 py-2.5';
  const inputRadius = entityForm.radiusPreference === 'tighter' ? 'rounded' :
                      entityForm.radiusPreference === 'softer' ? 'rounded-lg' : 'rounded-md';
  const inputBorder = entityForm.borderVisibility === 'clear' ? 'border-2' :
                      entityForm.borderVisibility === 'minimal' ? 'border border-border-subtle' : 'border';
  const inputShadow = entityForm.shadowUsage === 'pronounced' ? 'shadow-sm' :
                      entityForm.shadowUsage === 'minimal' || entityForm.shadowUsage === 'none' ? '' : 'shadow-xs';

  // Label styling
  const labelWeight = entityForm.textContrast === 'high' ? 'font-semibold' :
                      entityForm.textContrast === 'low' ? 'font-normal' : 'font-medium';

  return {
    fieldWrapper: fieldSpacing,
    input: `${inputPadding} ${inputRadius} ${inputBorder} ${inputShadow}`.trim(),
    label: `text-sm ${labelWeight}`.trim(),
    helperText: 'text-xs text-fg-muted',
  };
}

// ============================================================================
// SUMMARY HELPER
// ============================================================================

/**
 * Get visual emphasis summary for logging
 */
export function getVisualEmphasisSummary(emphasis: VisualEmphasis): string {
  return emphasis.summary;
}
