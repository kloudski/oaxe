import type { BrandDNA } from '../types';

/**
 * M5A: Brand Expression Layer
 *
 * Translates Brand DNA into UI copy, emphasis, and moments.
 * No layout or component changes - pure expression through words and weight.
 */

// ============================================================================
// EMPHASIS STRATEGY
// ============================================================================

export type EmphasisStrategy = 'subtle' | 'balanced' | 'assertive';

/**
 * Determine emphasis strategy from Brand DNA
 * Controls visual weight: card elevation, CTA prominence, accent usage
 */
export function getEmphasisStrategy(brandDNA: BrandDNA): EmphasisStrategy {
  const { mood, archetype } = brandDNA;

  // Assertive: bold brands that demand attention
  if (
    mood === 'bold' ||
    mood === 'vibrant' ||
    archetype === 'Hero' ||
    archetype === 'Outlaw' ||
    archetype === 'Ruler'
  ) {
    return 'assertive';
  }

  // Subtle: calm, minimal, or gentle brands
  if (
    mood === 'calm' ||
    mood === 'minimal' ||
    archetype === 'Innocent' ||
    archetype === 'Caregiver' ||
    archetype === 'Sage'
  ) {
    return 'subtle';
  }

  // Balanced: default for professional, friendly, and neutral brands
  return 'balanced';
}

// ============================================================================
// COPY & MICROCOPY HELPERS
// ============================================================================

/**
 * Get primary action verb based on brand personality
 * Replaces generic "Create", "Add", "New"
 */
export function getPrimaryVerb(brandDNA: BrandDNA): string {
  const { archetype, mood, category } = brandDNA;

  // Archetype-driven verbs
  const archetypeVerbs: Record<string, string> = {
    Sage: 'Establish',
    Hero: 'Launch',
    Creator: 'Craft',
    Caregiver: 'Begin',
    Ruler: 'Initiate',
    Everyman: 'Start',
    Jester: 'Spin Up',
    Lover: 'Introduce',
    Magician: 'Conjure',
    Innocent: 'Add',
    Explorer: 'Discover',
    Outlaw: 'Unleash',
  };

  // Mood overrides for specific tones
  if (mood === 'calm') return 'Begin';
  if (mood === 'minimal') return 'Add';
  if (mood === 'vibrant') return 'Create';
  if (mood === 'bold') return 'Launch';

  // Category fallbacks
  if (category === 'legal') return 'Open';
  if (category === 'finance') return 'Create';
  if (category === 'healthcare') return 'Schedule';
  if (category === 'wellness') return 'Begin';

  return archetypeVerbs[archetype] || 'Create';
}

/**
 * Get secondary action verb for less prominent actions
 */
export function getSecondaryVerb(brandDNA: BrandDNA): string {
  const { mood, archetype } = brandDNA;

  if (mood === 'professional' || archetype === 'Ruler') return 'View';
  if (mood === 'calm') return 'Browse';
  if (mood === 'friendly') return 'Check Out';
  if (mood === 'minimal') return 'See';
  if (archetype === 'Explorer') return 'Explore';

  return 'View';
}

/**
 * Get empty state copy for an entity based on Brand DNA
 * Replaces generic "No items yet"
 */
export function getEmptyStateCopy(
  entityName: string,
  brandDNA: BrandDNA
): { headline: string; subline: string } {
  const { mood, archetype, voice, category } = brandDNA;
  const entity = entityName.toLowerCase();
  const entityPlural = entity.endsWith('s') ? entity : `${entity}s`;
  const verb = getPrimaryVerb(brandDNA);

  // Mood-driven empty states
  const moodMessages: Record<string, { headline: string; subline: string }> = {
    professional: {
      headline: `No ${entityPlural} on record`,
      subline: `${verb} your first ${entity} to get started.`,
    },
    calm: {
      headline: `Your ${entityPlural} will appear here`,
      subline: `When you're ready, ${verb.toLowerCase()} your first ${entity}.`,
    },
    friendly: {
      headline: `No ${entityPlural} yet!`,
      subline: `${verb} one to see it here.`,
    },
    minimal: {
      headline: `Empty`,
      subline: `${verb} ${entity}`,
    },
    bold: {
      headline: `Ready to ${verb.toLowerCase()}?`,
      subline: `Your ${entityPlural} will show up right here.`,
    },
    vibrant: {
      headline: `This space is waiting for you!`,
      subline: `${verb} your first ${entity} and watch the magic happen.`,
    },
  };

  // Archetype-specific overrides
  if (archetype === 'Sage') {
    return {
      headline: `No ${entityPlural} documented`,
      subline: `${verb} a ${entity} to build your knowledge base.`,
    };
  }

  if (archetype === 'Caregiver') {
    return {
      headline: `No ${entityPlural} to care for yet`,
      subline: `${verb} one when the time is right.`,
    };
  }

  if (archetype === 'Hero') {
    return {
      headline: `Your ${entityPlural} await`,
      subline: `${verb} your first ${entity} and take action.`,
    };
  }

  // Category-specific edge cases
  if (category === 'legal') {
    return {
      headline: `No ${entityPlural} on file`,
      subline: `${verb} a new ${entity} to begin.`,
    };
  }

  if (category === 'wellness') {
    return {
      headline: `Your ${entity} journey begins here`,
      subline: `When you're ready, ${verb.toLowerCase()} your first ${entity}.`,
    };
  }

  return moodMessages[mood] || moodMessages.professional;
}

/**
 * Get CTA label for creating a new entity
 * Replaces generic "New {Entity}" or "Create {Entity}"
 */
export function getCTALabel(entityName: string, brandDNA: BrandDNA): string {
  const verb = getPrimaryVerb(brandDNA);
  const entity = entityName.charAt(0).toUpperCase() + entityName.slice(1);

  // Minimal brands prefer shorter labels
  if (brandDNA.mood === 'minimal') {
    return `+ ${entity}`;
  }

  return `${verb} ${entity}`;
}

/**
 * Get form page header copy
 */
export function getFormHeader(
  entityName: string,
  brandDNA: BrandDNA
): { title: string; description: string } {
  const verb = getPrimaryVerb(brandDNA);
  const entity = entityName.charAt(0).toUpperCase() + entityName.slice(1);
  const { mood, archetype } = brandDNA;

  if (mood === 'minimal') {
    return {
      title: `New ${entity}`,
      description: `Enter details below.`,
    };
  }

  if (mood === 'calm' || archetype === 'Caregiver') {
    return {
      title: `${verb} ${entity}`,
      description: `Take your time filling in the details.`,
    };
  }

  if (mood === 'professional' || archetype === 'Ruler') {
    return {
      title: `${verb} New ${entity}`,
      description: `Complete the fields below to ${verb.toLowerCase()} a new ${entity.toLowerCase()}.`,
    };
  }

  if (mood === 'friendly') {
    return {
      title: `${verb} ${entity}`,
      description: `Fill in what you know — you can always update it later.`,
    };
  }

  return {
    title: `${verb} ${entity}`,
    description: `Provide the information below.`,
  };
}

/**
 * Get detail page "not found" copy
 */
export function getNotFoundCopy(
  entityName: string,
  brandDNA: BrandDNA
): { headline: string; subline: string } {
  const entity = entityName.charAt(0).toUpperCase() + entityName.slice(1);
  const { mood } = brandDNA;

  if (mood === 'calm') {
    return {
      headline: `${entity} not found`,
      subline: `This ${entity.toLowerCase()} may have been removed or the link may be incorrect.`,
    };
  }

  if (mood === 'friendly') {
    return {
      headline: `Oops! ${entity} not found`,
      subline: `We couldn't find what you're looking for.`,
    };
  }

  if (mood === 'minimal') {
    return {
      headline: `Not found`,
      subline: `${entity} does not exist.`,
    };
  }

  return {
    headline: `${entity} not found`,
    subline: `The requested item could not be located.`,
  };
}

/**
 * Get submit button label
 */
export function getSubmitLabel(entityName: string, brandDNA: BrandDNA): string {
  const verb = getPrimaryVerb(brandDNA);
  const entity = entityName.charAt(0).toUpperCase() + entityName.slice(1);

  if (brandDNA.mood === 'minimal') {
    return 'Save';
  }

  if (brandDNA.mood === 'professional') {
    return `${verb} ${entity}`;
  }

  if (brandDNA.mood === 'friendly') {
    return `${verb} ${entity}`;
  }

  return `${verb} ${entity}`;
}

// ============================================================================
// BRAND MOMENTS
// ============================================================================

export type BrandMomentContext =
  | 'dashboard_first_load'
  | 'empty_table'
  | 'post_create_success';

/**
 * Get a brand moment for a specific UI context
 * Returns null if no appropriate moment exists or limit exceeded
 */
export function getBrandMomentForContext(
  context: BrandMomentContext,
  brandDNA: BrandDNA,
  usedMomentIndices: Set<number> = new Set()
): { moment: string; description: string; emotion: string } | null {
  const { productBrandMoments } = brandDNA;

  if (!productBrandMoments || productBrandMoments.length === 0) {
    return null;
  }

  // Map context to moment keywords
  const contextKeywords: Record<BrandMomentContext, string[]> = {
    dashboard_first_load: ['first', 'welcome', 'onboarding', 'start'],
    empty_table: ['first', 'begin', 'start', 'empty'],
    post_create_success: ['complete', 'success', 'achieve', 'done'],
  };

  const keywords = contextKeywords[context];

  // Find matching moment that hasn't been used
  for (let i = 0; i < productBrandMoments.length; i++) {
    if (usedMomentIndices.has(i)) continue;

    const moment = productBrandMoments[i];
    const momentText = `${moment.moment} ${moment.description}`.toLowerCase();

    for (const keyword of keywords) {
      if (momentText.includes(keyword)) {
        return moment;
      }
    }
  }

  // Return first unused moment as fallback
  for (let i = 0; i < productBrandMoments.length; i++) {
    if (!usedMomentIndices.has(i)) {
      return productBrandMoments[i];
    }
  }

  return null;
}

/**
 * Format a brand moment for display
 */
export function formatBrandMoment(
  moment: { moment: string; description: string; emotion: string },
  brandDNA: BrandDNA
): { title: string; message: string } {
  const { mood } = brandDNA;

  // Mood-driven formatting
  if (mood === 'minimal') {
    return {
      title: moment.moment,
      message: moment.description,
    };
  }

  if (mood === 'calm') {
    return {
      title: moment.moment,
      message: `${moment.description}. ${moment.emotion}.`,
    };
  }

  if (mood === 'friendly' || mood === 'vibrant') {
    return {
      title: `✨ ${moment.moment}`,
      message: moment.description,
    };
  }

  return {
    title: moment.moment,
    message: moment.description,
  };
}

// ============================================================================
// DASHBOARD PERSONALITY
// ============================================================================

export type DashboardBlockType =
  | 'metrics_first'
  | 'guidance_first'
  | 'activity_first'
  | 'actions_first';

/**
 * Determine dashboard block composition based on Brand DNA
 */
export function getDashboardPersonality(brandDNA: BrandDNA): {
  blockType: DashboardBlockType;
  welcomeMessage: string;
  sectionTitle: string;
} {
  const { category, archetype, mood, voice } = brandDNA;

  // Category-driven dashboard types
  const categoryDashboard: Record<string, DashboardBlockType> = {
    legal: 'metrics_first',
    finance: 'metrics_first',
    healthcare: 'guidance_first',
    wellness: 'guidance_first',
    technology: 'actions_first',
    creative: 'actions_first',
    education: 'guidance_first',
    ecommerce: 'activity_first',
    social: 'activity_first',
    productivity: 'actions_first',
    nature: 'guidance_first',
    energy: 'activity_first',
  };

  const blockType = categoryDashboard[category] || 'actions_first';

  // Generate welcome message based on archetype and tone
  let welcomeMessage: string;
  let sectionTitle: string;

  switch (archetype) {
    case 'Sage':
      welcomeMessage = `Your knowledge hub awaits.`;
      sectionTitle = 'Insights';
      break;
    case 'Hero':
      welcomeMessage = `Ready to take action.`;
      sectionTitle = 'Your Mission';
      break;
    case 'Creator':
      welcomeMessage = `Let's build something great.`;
      sectionTitle = 'Create';
      break;
    case 'Caregiver':
      welcomeMessage = `We're here to help.`;
      sectionTitle = 'Your Care';
      break;
    case 'Ruler':
      welcomeMessage = `Everything under control.`;
      sectionTitle = 'Command Center';
      break;
    case 'Everyman':
      welcomeMessage = `Good to see you.`;
      sectionTitle = 'Your Space';
      break;
    case 'Jester':
      welcomeMessage = `Let's have some fun!`;
      sectionTitle = 'Play';
      break;
    case 'Lover':
      welcomeMessage = `Crafted with care.`;
      sectionTitle = 'Your Collection';
      break;
    case 'Magician':
      welcomeMessage = `Transform your workflow.`;
      sectionTitle = 'Your Powers';
      break;
    case 'Innocent':
      welcomeMessage = `Simple and ready.`;
      sectionTitle = 'Start Here';
      break;
    case 'Explorer':
      welcomeMessage = `What will you discover today?`;
      sectionTitle = 'Explore';
      break;
    case 'Outlaw':
      welcomeMessage = `Break the mold.`;
      sectionTitle = 'Your Arena';
      break;
    default:
      welcomeMessage = `Welcome back.`;
      sectionTitle = 'Overview';
  }

  // Mood adjustments
  if (mood === 'minimal') {
    welcomeMessage = '';
    sectionTitle = 'Overview';
  }

  if (mood === 'professional') {
    welcomeMessage = welcomeMessage.replace('!', '.');
  }

  return { blockType, welcomeMessage, sectionTitle };
}

/**
 * Get quick actions section title
 */
export function getQuickActionsTitle(brandDNA: BrandDNA): string {
  const { archetype, mood } = brandDNA;

  if (mood === 'minimal') return 'Actions';
  if (mood === 'professional') return 'Quick Actions';
  if (mood === 'friendly') return 'Jump Right In';
  if (mood === 'calm') return 'When Ready';

  if (archetype === 'Hero') return 'Take Action';
  if (archetype === 'Explorer') return 'Explore';
  if (archetype === 'Creator') return 'Create Something';

  return 'Get Started';
}

/**
 * Get features section title
 */
export function getFeaturesTitle(brandDNA: BrandDNA): string {
  const { archetype, mood, category } = brandDNA;

  if (mood === 'minimal') return 'Features';
  if (mood === 'professional') return 'Capabilities';

  if (archetype === 'Sage') return 'What We Offer';
  if (archetype === 'Hero') return 'Your Toolkit';
  if (archetype === 'Magician') return 'Your Powers';

  if (category === 'wellness') return 'Your Journey';
  if (category === 'education') return 'Learn & Grow';

  return 'Core Features';
}

// ============================================================================
// EMPHASIS HELPERS (for CSS class decisions)
// ============================================================================

/**
 * Get card elevation class based on emphasis strategy
 */
export function getCardElevation(
  strategy: EmphasisStrategy,
  isPrimary: boolean = false
): string {
  if (!isPrimary) return '';

  switch (strategy) {
    case 'assertive':
      return 'ring-2 ring-primary/20';
    case 'subtle':
      return 'border-border-strong';
    case 'balanced':
    default:
      return 'shadow-sm';
  }
}

/**
 * Get CTA button variant based on emphasis
 */
export function getCTAVariant(
  strategy: EmphasisStrategy,
  isSecondary: boolean = false
): 'default' | 'secondary' | 'ghost' {
  if (isSecondary) {
    return strategy === 'assertive' ? 'secondary' : 'ghost';
  }
  return 'default';
}
