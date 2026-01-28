import type { BrandDNA } from '../types';
import type { ShapeLanguage } from './visualSignature';

/**
 * M4C: Iconography System Generator
 *
 * Generates a structured Brand Iconography System that defines:
 * - Icon style rules
 * - Stroke philosophy
 * - Metaphor preferences
 * - Do / Don't usage rules
 * - Semantic consistency
 *
 * This system guides designers and engineers implementing icons.
 * Deterministic output based on brandDNA properties.
 */

// ===== Type Definitions =====

export type IconStyle = 'outline' | 'solid' | 'duotone' | 'mixed';
export type StrokeWeight = 'thin' | 'standard' | 'bold';
export type MetaphorStrategy = 'literal' | 'symbolic' | 'hybrid';

export interface Iconography {
  iconStyle: {
    profile: IconStyle;
    rationale: string;
    strokeWeight: StrokeWeight;
    strokeWeightRationale: string;
    cornerTreatment: string;
  };

  metaphorStrategy: {
    profile: MetaphorStrategy;
    rationale: string;
    categoryGuidance: string;
    examples: {
      preferred: string[];
      avoid: string[];
    };
  };

  semanticRules: {
    oneIconOneMeaning: string;
    reusePolicy: string;
    newIconCriteria: string[];
    consistencyGuidelines: string[];
  };

  usageRules: {
    do: string[];
    dont: string[];
  };

  accessibilityGuidance: {
    labelingExpectations: string;
    contrastConsiderations: string;
    nonVisualSignaling: string;
    touchTargets: string;
  };

  generatedAt: string;
}

// ===== Derivation Logic =====

/**
 * Mood to icon style mapping
 * Professional/serious favor outline, playful favor solid/duotone
 */
const MOOD_ICON_STYLE_MAP: Record<string, IconStyle> = {
  professional: 'outline',
  calm: 'outline',
  bold: 'solid',
  friendly: 'duotone',
  minimal: 'outline',
  vibrant: 'duotone',
  serious: 'outline',
  playful: 'duotone',
  warm: 'duotone',
  elegant: 'outline',
};

/**
 * Archetype to icon style override
 * Some archetypes have strong preferences that override mood
 */
const ARCHETYPE_ICON_STYLE_OVERRIDE: Record<string, IconStyle | undefined> = {
  Ruler: 'solid',       // Authority through presence
  Hero: 'solid',        // Strength through boldness
  Caregiver: 'duotone', // Warmth through layering
  Creator: 'mixed',     // Creativity through variety
  Sage: 'outline',      // Clarity through simplicity
  Innocent: 'outline',  // Purity through simplicity
  Explorer: 'mixed',    // Adventure through dynamism
  Outlaw: 'solid',      // Rebellion through boldness
  Magician: 'duotone',  // Transformation through depth
  Everyman: 'outline',  // Approachability through clarity
  Lover: 'duotone',     // Intimacy through softness
  Jester: 'duotone',    // Fun through personality
};

/**
 * Category to stroke weight mapping
 * Data-heavy categories favor standard/thin, expressive categories may use bold
 */
const CATEGORY_STROKE_WEIGHT_MAP: Record<string, StrokeWeight> = {
  legal: 'standard',
  finance: 'standard',
  healthcare: 'standard',
  wellness: 'thin',
  technology: 'standard',
  creative: 'bold',
  education: 'standard',
  ecommerce: 'standard',
  social: 'standard',
  productivity: 'thin',
  nature: 'thin',
  energy: 'bold',
};

/**
 * Archetype to metaphor strategy mapping
 * Analytical archetypes prefer literal, creative prefer symbolic
 */
const ARCHETYPE_METAPHOR_MAP: Record<string, MetaphorStrategy> = {
  Ruler: 'literal',
  Hero: 'symbolic',
  Caregiver: 'literal',
  Creator: 'symbolic',
  Sage: 'literal',
  Innocent: 'literal',
  Explorer: 'symbolic',
  Outlaw: 'symbolic',
  Magician: 'symbolic',
  Everyman: 'literal',
  Lover: 'hybrid',
  Jester: 'hybrid',
};

/**
 * Category to metaphor strategy override
 * Some categories demand specific approaches regardless of archetype
 */
const CATEGORY_METAPHOR_OVERRIDE: Record<string, MetaphorStrategy | undefined> = {
  legal: 'literal',     // Legal requires unmistakable clarity
  finance: 'literal',   // Financial data must be unambiguous
  healthcare: 'literal', // Medical contexts require precision
  creative: undefined,   // Let archetype decide
  wellness: 'hybrid',   // Balance between clarity and feeling
  technology: undefined, // Let archetype decide
};

// ===== Rationale Generation =====

function getIconStyleRationale(
  profile: IconStyle,
  mood: string,
  archetype: string,
  category: string
): string {
  const rationales: Record<IconStyle, string> = {
    outline: `Outline icons support the ${mood} mood by providing visual clarity without competing for attention. In ${category}, where information density matters, outlined icons serve as efficient wayfinding without visual weight. The ${archetype} archetype benefits from this restrained approach that prioritizes function over decoration.`,
    solid: `Solid icons express the ${archetype}'s presence with confidence. The ${mood} brand personality comes through in icons that hold their space firmly. In ${category}, solid icons create clear visual anchors that users can locate instantly.`,
    duotone: `Duotone icons add warmth and depth to the ${mood} personality. The two-tone treatment allows the ${archetype} brand to express personality while maintaining clarity. For ${category}, this approach balances professionalism with approachability.`,
    mixed: `A mixed icon vocabulary gives the ${archetype} brand flexibility to express different intents. Primary navigation uses outlined icons for efficiency, while feature highlights and empty states use solid or duotone treatments for personality. This serves ${category} users who benefit from visual differentiation.`,
  };
  return rationales[profile];
}

function getStrokeWeightRationale(weight: StrokeWeight, category: string, mood: string): string {
  const rationales: Record<StrokeWeight, string> = {
    thin: `Thin strokes (1-1.5px) create an elegant, lightweight feel aligned with the ${mood} aesthetic. In ${category}, this delicate treatment prevents icons from overwhelming content and supports a sophisticated visual hierarchy.`,
    standard: `Standard stroke weights (1.5-2px) provide optimal legibility across device sizes. For ${category}, this balanced approach ensures icons remain clear at small sizes while not dominating the interface. The ${mood} mood is maintained through consistent, professional execution.`,
    bold: `Bold strokes (2-2.5px) give icons presence and personality. The ${mood} brand benefits from icons that make a statement. In ${category}, bolder icons create visual energy without sacrificing recognition.`,
  };
  return rationales[weight];
}

function getCornerTreatment(shapeProfile: ShapeLanguage): string {
  const treatments: Record<ShapeLanguage, string> = {
    rounded: 'Icon corners should use generous rounding (2-3px at stroke joins) to align with the rounded shape language. Line caps should be round. This creates cohesion between icons and UI elements.',
    balanced: 'Icon corners should use subtle rounding (1-2px) at stroke joins. Line caps may be round or squared depending on the specific icon. Maintain consistency within icon families.',
    sharp: 'Icon corners should be precise with minimal to no rounding. Line caps should be squared for geometric precision. This reinforces the sharp, professional shape language.',
    mixed: 'Navigation and action icons use rounded corners for approachability. Data and status icons use sharper corners for precision. This distinction should be consistent across icon families.',
  };
  return treatments[shapeProfile];
}

function getMetaphorRationale(
  profile: MetaphorStrategy,
  archetype: string,
  category: string
): string {
  const rationales: Record<MetaphorStrategy, string> = {
    literal: `Literal iconography ensures instant recognition in ${category} contexts. The ${archetype} brand values clarity and precision—a document icon should look like a document, a person icon should clearly represent a person. Abstraction risks confusion in professional workflows.`,
    symbolic: `Symbolic iconography allows the ${archetype} brand to express meaning beyond the obvious. Abstract representations can convey concepts, emotions, or transformations that literal icons cannot. In ${category}, this approach differentiates the brand while maintaining learnability.`,
    hybrid: `A hybrid approach uses literal icons for core functionality (navigation, common actions) and symbolic icons for brand moments and conceptual features. This gives ${category} users clear wayfinding while allowing the ${archetype} personality to emerge in appropriate contexts.`,
  };
  return rationales[profile];
}

function getCategoryGuidance(category: string, metaphor: MetaphorStrategy): string {
  const guidance: Record<string, Record<MetaphorStrategy, string>> = {
    legal: {
      literal: 'Legal contexts demand unmistakable icons. Documents, folders, scales, gavels—use established legal iconography. Users must never question what an icon represents.',
      symbolic: 'Even with symbolic preference, legal icons should lean toward recognizable metaphors. Abstract justice symbols are acceptable; abstract document icons are not.',
      hybrid: 'Use literal icons for all document and workflow actions. Reserve symbolic treatment for success states, achievements, and brand illustrations only.',
    },
    finance: {
      literal: 'Financial icons must be unambiguous. Charts, currency, transactions should use industry-standard representations. Clarity protects users from costly mistakes.',
      symbolic: 'Symbolic finance icons work for dashboards and marketing but should be avoided for transactional interfaces. Money movements require literal clarity.',
      hybrid: 'Transactions and accounts use literal icons. Dashboard widgets and insights can use more expressive symbolic representations.',
    },
    healthcare: {
      literal: 'Healthcare demands precise iconography. Medical symbols, body parts, and clinical actions must be immediately recognizable. Lives may depend on clear UI.',
      symbolic: 'Symbolic healthcare icons should still reference recognizable medical metaphors. Abstract wellness concepts are acceptable; clinical action icons are not.',
      hybrid: 'Clinical workflows use literal icons without exception. Patient-facing wellness features may use gentler symbolic representations.',
    },
    wellness: {
      literal: 'Wellness icons should feel warm but recognizable. Heart, meditation, nature—established wellness vocabulary helps users feel understood.',
      symbolic: 'Symbolic wellness icons can express feelings and states that literal icons cannot. Flowing forms and organic shapes support emotional connection.',
      hybrid: 'Navigation uses friendly literal icons. Feature areas and achievements use symbolic icons that evoke feeling over function.',
    },
    technology: {
      literal: 'Technical interfaces benefit from literal icons. Settings, integrations, data—users expect recognizable metaphors for technical concepts.',
      symbolic: 'Symbolic tech icons work for innovative features and AI concepts where literal representation is impossible. Ground abstractions in familiar shapes.',
      hybrid: 'Core functionality uses literal icons. Advanced features and AI capabilities may use symbolic representations to convey innovation.',
    },
    creative: {
      literal: 'Creative tools still need recognizable icons for common actions. Brushes, layers, tools—creative professionals expect industry-standard iconography.',
      symbolic: 'Creative contexts welcome expressive iconography. Brand illustrations and feature icons can push boundaries while maintaining function.',
      hybrid: 'Tool palettes use literal icons. Feature discovery and inspiration contexts use symbolic icons that inspire creativity.',
    },
    education: {
      literal: 'Educational icons should be instantly recognizable to diverse audiences. Books, graduation, progress—universal educational metaphors work best.',
      symbolic: 'Symbolic education icons can represent growth and transformation. Abstract learning concepts pair well with clear action icons.',
      hybrid: 'Course navigation uses literal icons. Achievement badges and progress indicators can use more symbolic, rewarding representations.',
    },
    ecommerce: {
      literal: 'Commerce icons must be unmistakable. Cart, payment, shipping—users need instant recognition for transactional confidence.',
      symbolic: 'Symbolic e-commerce icons work for brand personality but should never replace clear transaction iconography.',
      hybrid: 'All purchase flows use literal icons. Brand moments and loyalty features can express more personality through symbolic treatment.',
    },
    social: {
      literal: 'Social platform icons should use established conventions. Users, messaging, reactions—platforms benefit from pattern recognition.',
      symbolic: 'Symbolic social icons can differentiate the platform while maintaining learnability. Express brand personality through icon style, not unrecognizable metaphors.',
      hybrid: 'Core interactions use literal icons. Community features and achievements can use symbolic icons that reinforce platform identity.',
    },
    productivity: {
      literal: 'Productivity icons prioritize efficiency. Tasks, calendars, lists—recognizable icons reduce cognitive load for power users.',
      symbolic: 'Symbolic productivity icons should still convey clear concepts. Abstraction works for insights and analytics, not daily workflows.',
      hybrid: 'Daily workflow icons are literal. Dashboard insights and long-term planning features can use symbolic representations.',
    },
    nature: {
      literal: 'Nature-focused products can use organic, recognizable imagery. Plants, animals, landscapes—literal nature icons feel authentic.',
      symbolic: 'Symbolic nature icons express environmental concepts and feelings. Flowing, organic abstractions complement the subject matter.',
      hybrid: 'Species and location identification use literal icons. Conservation impact and community features use symbolic, inspiring representations.',
    },
    energy: {
      literal: 'Energy products need clear iconography for technical concepts. Power, consumption, sources—literal icons prevent confusion.',
      symbolic: 'Symbolic energy icons work for impact and savings representations. Abstract energy flows can be compelling while grounded in recognizable forms.',
      hybrid: 'Technical data and settings use literal icons. Impact dashboards and sustainability metrics can use symbolic, motivating representations.',
    },
  };

  return guidance[category]?.[metaphor] || `Apply ${metaphor} metaphors thoughtfully. Prioritize user recognition for critical actions.`;
}

function getMetaphorExamples(category: string, metaphor: MetaphorStrategy): { preferred: string[]; avoid: string[] } {
  const examples: Record<string, Record<MetaphorStrategy, { preferred: string[]; avoid: string[] }>> = {
    legal: {
      literal: {
        preferred: ['Document: paper with lines', 'Case: folder with legal symbol', 'Client: person silhouette', 'Deadline: calendar with date'],
        avoid: ['Abstract shapes for documents', 'Unusual metaphors for common legal concepts', 'Decorative flourishes on functional icons'],
      },
      symbolic: {
        preferred: ['Justice: balanced abstract form', 'Progress: ascending visual', 'Collaboration: connected shapes'],
        avoid: ['Abstract icons for critical actions', 'Metaphors requiring explanation', 'Culture-specific symbols'],
      },
      hybrid: {
        preferred: ['Literal for workflow, symbolic for achievements', 'Recognition for actions, expression for states', 'Clarity first, personality second'],
        avoid: ['Mixing styles within the same context', 'Symbolic icons for critical paths', 'Inconsistent treatment across similar functions'],
      },
    },
    default: {
      literal: {
        preferred: ['Standard representations for common concepts', 'Industry-recognized metaphors', 'Consistent object representation'],
        avoid: ['Overly abstract forms for concrete concepts', 'Unusual metaphors that require learning', 'Decorative complexity'],
      },
      symbolic: {
        preferred: ['Meaningful abstractions for complex concepts', 'Expressive forms for emotional content', 'Brand-distinctive representations'],
        avoid: ['Abstraction for critical actions', 'Symbols without clear meaning', 'Culture-specific or regional metaphors'],
      },
      hybrid: {
        preferred: ['Literal for navigation and actions', 'Symbolic for brand moments and achievements', 'Consistent rules for when each applies'],
        avoid: ['Random mixing of styles', 'Symbolic icons where clarity is critical', 'Inconsistent application within families'],
      },
    },
  };

  return examples[category]?.[metaphor] || examples.default[metaphor];
}

function getSemanticRules(category: string, archetype: string): {
  oneIconOneMeaning: string;
  reusePolicy: string;
  newIconCriteria: string[];
  consistencyGuidelines: string[];
} {
  return {
    oneIconOneMeaning: `Each icon in the ${category} system represents exactly one concept. If "star" means "favorite," it cannot also mean "important" or "rating." Dual meanings create user confusion and accessibility issues.`,
    reusePolicy: `Reuse existing icons whenever the concept matches. Before creating a new icon, verify no existing icon serves the purpose. New icons require documentation of meaning and usage context. The ${archetype} brand values consistency over novelty.`,
    newIconCriteria: [
      'The concept has no existing representation in the icon set',
      'Existing icons would cause confusion if reused for this purpose',
      'The feature is significant enough to warrant dedicated iconography',
      'The new icon can be designed to fit the established style',
      'The meaning can be communicated without explanation',
    ],
    consistencyGuidelines: [
      'All icons in a family share the same visual weight',
      'Similar concepts use similar visual treatments',
      'Opposite concepts (add/remove, open/close) are visually related but distinct',
      'Icon size remains consistent within context (navigation, inline, feature)',
      'Color application follows the same rules across all icons',
    ],
  };
}

function getUsageRules(mood: string, category: string): { do: string[]; dont: string[] } {
  const moodDo: Record<string, string[]> = {
    professional: [
      'Use icons to reinforce information hierarchy',
      'Maintain consistent spacing around icons',
      'Pair icons with text labels for critical actions',
      'Use subtle color to indicate state changes',
    ],
    calm: [
      'Give icons breathing room—never crowd',
      'Use muted icon colors that blend with the interface',
      'Prefer subtle hover states over dramatic changes',
      'Let icons support rather than dominate',
    ],
    bold: [
      'Use icons confidently at appropriate sizes',
      'Allow brand color in icons where impactful',
      'Create visual energy through icon placement',
      'Ensure icons command appropriate attention',
    ],
    friendly: [
      'Soften icons with rounded treatments',
      'Use icons to create welcoming touchpoints',
      'Add subtle personality to empty states',
      'Maintain approachable proportions',
    ],
    minimal: [
      'Use only essential icons—less is more',
      'Prefer text labels where possible',
      'Keep icon designs extremely simple',
      'Remove any decorative elements',
    ],
    vibrant: [
      'Allow icons to carry brand color confidently',
      'Create energy through icon variety',
      'Use icons to punctuate the interface',
      'Ensure icons support the visual rhythm',
    ],
  };

  const moodDont: Record<string, string[]> = {
    professional: [
      'Use decorative icons without functional purpose',
      'Apply inconsistent styling across icon families',
      'Create visual clutter with excessive iconography',
      'Use trendy icon styles that may not age well',
    ],
    calm: [
      'Introduce jarring, attention-grabbing icons',
      'Use bright or saturated icon colors',
      'Animate icons unless absolutely necessary',
      'Overwhelm users with icon density',
    ],
    bold: [
      'Undersize icons to the point of weakness',
      'Use washed-out or timid icon colors',
      'Hide icons behind text-only treatments',
      'Apply inconsistent boldness across families',
    ],
    friendly: [
      'Use cold, institutional iconography',
      'Apply harsh, angular icon treatments',
      'Neglect personality in empty states',
      'Create intimidating visual density',
    ],
    minimal: [
      'Add icons where text alone suffices',
      'Use complex multi-element icons',
      'Apply decorative treatments to icons',
      'Create icon-heavy interfaces',
    ],
    vibrant: [
      'Mute icons to the point of invisibility',
      'Use monotone icon treatments throughout',
      'Neglect opportunities for visual interest',
      'Apply inconsistent energy levels',
    ],
  };

  const categorySpecificDont: Record<string, string[]> = {
    legal: ['Use playful or cartoon-style icons', 'Apply emoji aesthetics to professional functions'],
    finance: ['Use icons that could be misinterpreted in financial context', 'Apply playful treatments to transaction icons'],
    healthcare: ['Use ambiguous medical iconography', 'Apply decorative treatments to clinical icons'],
    wellness: ['Use clinical or harsh iconography', 'Apply institutional styling to wellness features'],
    technology: ['Use outdated tech metaphors (floppy disk for save)', 'Apply skeuomorphic detail unnecessarily'],
    creative: ['Use generic, uninspired iconography', 'Apply corporate rigidity to creative tools'],
    education: ['Use condescending or childish icons for adult learners', 'Apply complex icons that create learning barriers'],
    ecommerce: ['Use unclear icons for transaction steps', 'Apply trendy styles that reduce trust'],
    social: ['Deviate from established social conventions', 'Apply unfamiliar metaphors for common actions'],
    productivity: ['Use attention-grabbing icons that distract', 'Apply decorative complexity to workflow icons'],
    nature: ['Use artificial or synthetic-feeling icons', 'Apply harsh geometric treatments to organic subjects'],
    energy: ['Use confusing technical iconography', 'Apply unclear metaphors for important data'],
  };

  const doRules = moodDo[mood] || moodDo.professional;
  const dontRules = [
    ...(moodDont[mood] || moodDont.professional),
    ...(categorySpecificDont[category] || []),
    'Use emoji-style icons in professional interfaces',
    'Mix metaphors within the same icon (e.g., document with legs)',
  ];

  return { do: doRules, dont: dontRules };
}

function getAccessibilityGuidance(category: string): {
  labelingExpectations: string;
  contrastConsiderations: string;
  nonVisualSignaling: string;
  touchTargets: string;
} {
  const criticalCategories = ['legal', 'finance', 'healthcare'];
  const isCritical = criticalCategories.includes(category);

  return {
    labelingExpectations: isCritical
      ? `All icons MUST have text labels for ${category} compliance requirements. Icon-only buttons require visible labels or immediately adjacent text. ARIA labels are mandatory for any icon used without visible text. Tooltips do not satisfy accessibility requirements for critical actions.`
      : 'Provide text labels for primary actions. Icon-only treatments are acceptable for universally recognized icons (close, menu, search) with appropriate ARIA labels. Complex or custom icons require visible labels.',

    contrastConsiderations: `Icons must meet WCAG 2.1 contrast requirements. For ${category}, maintain minimum 3:1 contrast ratio against backgrounds for informational icons, 4.5:1 for icons conveying critical information. Disabled states may use reduced contrast but should remain distinguishable.`,

    nonVisualSignaling: `Icons must never be the only signal for ${isCritical ? 'critical' : 'important'} information. Pair status icons with text, color, or other indicators. Error states require text explanation. Success confirmations need explicit messaging. Users who cannot see icons must receive equivalent information.`,

    touchTargets: `Minimum touch target: 44x44px regardless of icon visual size. Icon hit areas may extend beyond visible bounds. ${category} interfaces should consider larger targets (48x48px) for primary actions. Maintain adequate spacing between adjacent icon targets.`,
  };
}

// ===== Main Generator =====

/**
 * Generate Iconography System from Brand DNA
 *
 * Deterministic output based on:
 * - brandDNA.mood (icon style, usage rules)
 * - brandDNA.archetype (icon style override, metaphor strategy)
 * - brandDNA.category (stroke weight, category guidance, accessibility)
 * - brandDNA.visualSignature?.shapeLanguage.profile (corner treatment)
 *
 * @param brandDNA - Enhanced Brand DNA object
 * @returns Complete Iconography specification
 */
export function generateIconography(brandDNA: BrandDNA): Iconography {
  const { mood, archetype, category, visualSignature } = brandDNA;

  // Derive icon style (archetype can override mood)
  const baseStyle = MOOD_ICON_STYLE_MAP[mood] || 'outline';
  const styleOverride = ARCHETYPE_ICON_STYLE_OVERRIDE[archetype];
  const iconStyleProfile = styleOverride || baseStyle;

  // Derive stroke weight from category
  const strokeWeight = CATEGORY_STROKE_WEIGHT_MAP[category] || 'standard';

  // Derive metaphor strategy (category can override archetype)
  const baseMetaphor = ARCHETYPE_METAPHOR_MAP[archetype] || 'literal';
  const metaphorOverride = CATEGORY_METAPHOR_OVERRIDE[category];
  const metaphorProfile = metaphorOverride || baseMetaphor;

  // Get shape language for corner treatment alignment
  const shapeProfile: ShapeLanguage = visualSignature?.shapeLanguage?.profile || 'balanced';

  // Get metaphor examples
  const metaphorExamples = getMetaphorExamples(category, metaphorProfile);

  // Get semantic rules
  const semanticRules = getSemanticRules(category, archetype);

  // Get usage rules
  const usageRules = getUsageRules(mood, category);

  // Get accessibility guidance
  const accessibilityGuidance = getAccessibilityGuidance(category);

  return {
    iconStyle: {
      profile: iconStyleProfile,
      rationale: getIconStyleRationale(iconStyleProfile, mood, archetype, category),
      strokeWeight,
      strokeWeightRationale: getStrokeWeightRationale(strokeWeight, category, mood),
      cornerTreatment: getCornerTreatment(shapeProfile),
    },

    metaphorStrategy: {
      profile: metaphorProfile,
      rationale: getMetaphorRationale(metaphorProfile, archetype, category),
      categoryGuidance: getCategoryGuidance(category, metaphorProfile),
      examples: metaphorExamples,
    },

    semanticRules,

    usageRules,

    accessibilityGuidance,

    generatedAt: new Date().toISOString(),
  };
}

/**
 * Get Iconography as JSON string for file persistence
 */
export function getIconographyAsJSON(iconography: Iconography): string {
  return JSON.stringify(iconography, null, 2);
}

/**
 * Generate a human-readable summary of the Iconography
 * For logging and display purposes
 */
export function getIconographySummary(iconography: Iconography): string {
  return [
    `Style: ${iconography.iconStyle.profile}`,
    `Stroke: ${iconography.iconStyle.strokeWeight}`,
    `Metaphor: ${iconography.metaphorStrategy.profile}`,
  ].join(' | ');
}
