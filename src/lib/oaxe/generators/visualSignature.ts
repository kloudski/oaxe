import type { BrandDNA } from '../types';

/**
 * M4B: Visual Signature Generator
 *
 * Generates a structured Visual Signature System that formalizes how the brand looks beyond colors:
 * - Shape Language
 * - Density & Rhythm
 * - Contrast Philosophy
 * - Texture Usage
 * - Motion Character (descriptive only)
 * - Layout Philosophy
 *
 * This must feel like something a design lead would write for a real brand.
 * Deterministic output based on brandDNA properties.
 */

// ===== Type Definitions =====

export type ShapeLanguage = 'rounded' | 'balanced' | 'sharp' | 'mixed';
export type DensityProfile = 'compact' | 'balanced' | 'spacious';
export type ContrastPhilosophy = 'low-contrast-calm' | 'high-contrast-assertive' | 'mixed-functional';
export type TextureUsage = 'none' | 'subtle' | 'expressive';
export type MotionCharacter = 'restrained' | 'confident' | 'energetic' | 'ceremonial';
export type LayoutPhilosophy = 'content-first' | 'structure-first' | 'narrative';

export interface VisualSignature {
  shapeLanguage: {
    profile: ShapeLanguage;
    rationale: string;
    cornerRadiusGuidance: string;
    iconTreatment: string;
  };

  densityRhythm: {
    profile: DensityProfile;
    rationale: string;
    contexts: {
      tables: string;
      dashboards: string;
      forms: string;
      navigation: string;
    };
  };

  contrastPhilosophy: {
    profile: ContrastPhilosophy;
    rationale: string;
    textHierarchy: string;
    surfaceContrast: string;
    emphasisStrategy: string;
  };

  textureUsage: {
    profile: TextureUsage;
    rationale: string;
    allowedContexts: string[];
    prohibitedContexts: string[];
    performanceGuidance: string;
  };

  motionCharacter: {
    profile: MotionCharacter;
    timingPhilosophy: string;
    purposeOfMotion: string;
    entranceExits: string;
    microInteractions: string;
  };

  layoutPhilosophy: {
    profile: LayoutPhilosophy;
    rationale: string;
    gridUsage: string;
    whiteSpaceIntent: string;
    responsiveStrategy: string;
  };

  generatedAt: string;
}

// ===== Derivation Logic =====

/**
 * Mood to shape language mapping
 * Professional moods favor balanced/sharp, calm favors rounded, bold favors mixed
 */
const MOOD_SHAPE_MAP: Record<string, ShapeLanguage> = {
  professional: 'balanced',
  calm: 'rounded',
  bold: 'mixed',
  friendly: 'rounded',
  minimal: 'sharp',
  vibrant: 'mixed',
  serious: 'sharp',
  playful: 'rounded',
  warm: 'rounded',
  elegant: 'balanced',
};

/**
 * Archetype to shape language influence
 * Some archetypes have strong shape preferences that override mood
 */
const ARCHETYPE_SHAPE_OVERRIDE: Record<string, ShapeLanguage | undefined> = {
  Ruler: 'balanced',      // Authority through balance
  Hero: 'sharp',          // Strength through precision
  Caregiver: 'rounded',   // Approachability through softness
  Creator: 'mixed',       // Creativity through contrast
  Sage: 'balanced',       // Wisdom through measured design
  Innocent: 'rounded',    // Simplicity through soft forms
  Explorer: 'mixed',      // Adventure through dynamic shapes
  Outlaw: 'sharp',        // Rebellion through edge
  Magician: 'mixed',      // Transformation through variety
  Everyman: 'balanced',   // Relatability through familiarity
  Lover: 'rounded',       // Intimacy through curves
  Jester: 'rounded',      // Fun through playful shapes
};

/**
 * Category to density mapping
 * Data-heavy categories favor compact, wellness favors spacious
 */
const CATEGORY_DENSITY_MAP: Record<string, DensityProfile> = {
  legal: 'compact',
  finance: 'compact',
  healthcare: 'balanced',
  wellness: 'spacious',
  technology: 'balanced',
  creative: 'spacious',
  education: 'balanced',
  ecommerce: 'balanced',
  social: 'balanced',
  productivity: 'compact',
  nature: 'spacious',
  energy: 'balanced',
};

/**
 * Mood to contrast philosophy mapping
 */
const MOOD_CONTRAST_MAP: Record<string, ContrastPhilosophy> = {
  professional: 'mixed-functional',
  calm: 'low-contrast-calm',
  bold: 'high-contrast-assertive',
  friendly: 'mixed-functional',
  minimal: 'low-contrast-calm',
  vibrant: 'high-contrast-assertive',
  serious: 'mixed-functional',
  playful: 'mixed-functional',
  warm: 'low-contrast-calm',
  elegant: 'low-contrast-calm',
};

/**
 * Category to texture mapping
 * Most digital products use none/subtle, creative/nature may use expressive
 */
const CATEGORY_TEXTURE_MAP: Record<string, TextureUsage> = {
  legal: 'none',
  finance: 'none',
  healthcare: 'subtle',
  wellness: 'subtle',
  technology: 'none',
  creative: 'expressive',
  education: 'subtle',
  ecommerce: 'subtle',
  social: 'subtle',
  productivity: 'none',
  nature: 'expressive',
  energy: 'subtle',
};

/**
 * Archetype to motion character mapping
 */
const ARCHETYPE_MOTION_MAP: Record<string, MotionCharacter> = {
  Ruler: 'confident',
  Hero: 'energetic',
  Caregiver: 'restrained',
  Creator: 'energetic',
  Sage: 'restrained',
  Innocent: 'restrained',
  Explorer: 'energetic',
  Outlaw: 'energetic',
  Magician: 'ceremonial',
  Everyman: 'confident',
  Lover: 'ceremonial',
  Jester: 'energetic',
};

/**
 * Mood to motion character override (when strong mood signal)
 */
const MOOD_MOTION_OVERRIDE: Record<string, MotionCharacter | undefined> = {
  calm: 'restrained',
  bold: 'energetic',
  minimal: 'restrained',
  vibrant: 'energetic',
};

/**
 * Category to layout philosophy mapping
 */
const CATEGORY_LAYOUT_MAP: Record<string, LayoutPhilosophy> = {
  legal: 'structure-first',
  finance: 'structure-first',
  healthcare: 'content-first',
  wellness: 'narrative',
  technology: 'structure-first',
  creative: 'narrative',
  education: 'content-first',
  ecommerce: 'content-first',
  social: 'content-first',
  productivity: 'structure-first',
  nature: 'narrative',
  energy: 'content-first',
};

// ===== Rationale Generation =====

function getShapeRationale(
  profile: ShapeLanguage,
  mood: string,
  archetype: string,
  category: string
): string {
  const rationales: Record<ShapeLanguage, string> = {
    rounded: `Rounded shapes reinforce the ${mood} mood and ${archetype} archetype, creating an approachable visual language that invites interaction. In the ${category} space, this softness builds trust without sacrificing professionalism.`,
    balanced: `A balanced shape vocabulary supports the ${archetype}'s authority while maintaining the ${mood} sensibility. This measured approach ensures the ${category} product feels neither rigid nor casual.`,
    sharp: `Sharp geometric forms express the precision and clarity expected in ${category}. The ${mood} mood is reinforced through clean edges that communicate competence and attention to detail.`,
    mixed: `A mixed shape language allows the ${archetype} personality to express itself dynamically. Primary actions use rounded forms for approachability, while data displays employ sharper geometry for clarity.`,
  };
  return rationales[profile];
}

function getCornerRadiusGuidance(profile: ShapeLanguage): string {
  const guidance: Record<ShapeLanguage, string> = {
    rounded: 'Use generous radii (8-16px) for containers and cards. Buttons should feel pill-like. Avoid sharp corners except for precise data elements.',
    balanced: 'Use moderate radii (4-8px) consistently across the interface. Larger containers may use slightly increased radii. Maintain visual cohesion.',
    sharp: 'Use minimal radii (2-4px) or none. Reserve subtle rounding for interactive elements only. Data visualization should use precise geometry.',
    mixed: 'Primary interactive elements use larger radii (8-12px). Secondary elements and data displays use smaller radii (2-4px). This contrast creates visual hierarchy.',
  };
  return guidance[profile];
}

function getIconTreatment(profile: ShapeLanguage, archetype: string): string {
  const treatments: Record<ShapeLanguage, string> = {
    rounded: `Icons should use rounded terminals and soft corners. The ${archetype} personality is expressed through friendly, approachable iconography with consistent stroke weights.`,
    balanced: `Icons should balance geometric precision with subtle rounding at terminals. The ${archetype} archetype calls for clear, professional iconography that communicates efficiently.`,
    sharp: `Icons should favor geometric precision with minimal rounding. Use consistent stroke weights and sharp terminals to reinforce the ${archetype}'s clarity and purpose.`,
    mixed: `Navigation and action icons use softer treatments, while status and data icons employ sharper geometry. This distinction helps users quickly parse icon purpose.`,
  };
  return treatments[profile];
}

function getDensityRationale(profile: DensityProfile, category: string, mood: string): string {
  const rationales: Record<DensityProfile, string> = {
    compact: `The ${category} domain demands efficient information display. Users expect to see more data at once. The ${mood} mood is maintained through careful spacing that prevents visual chaos.`,
    balanced: `A balanced density serves the ${category} use case without overwhelming users. This rhythm allows for both efficient work and comfortable browsing, aligned with the ${mood} character.`,
    spacious: `Generous spacing supports the ${mood} mood essential to ${category}. White space is not empty—it provides breathing room that helps users feel calm and in control.`,
  };
  return rationales[profile];
}

function getDensityContextGuidance(profile: DensityProfile): {
  tables: string;
  dashboards: string;
  forms: string;
  navigation: string;
} {
  const contexts: Record<DensityProfile, { tables: string; dashboards: string; forms: string; navigation: string }> = {
    compact: {
      tables: 'Tight row heights (36-44px) with minimal cell padding. Enable users to scan large datasets efficiently. Consider alternating row backgrounds for scanability.',
      dashboards: 'Maximize data density with smaller widget gaps (8-12px). Use concise labels. Prioritize showing more metrics over larger visualizations.',
      forms: 'Standard field heights with reduced vertical spacing (12-16px between fields). Group related fields tightly. Use inline validation.',
      navigation: 'Compact sidebar items (32-36px height). Use icons with optional text labels. Favor collapsed by default on secondary navigation.',
    },
    balanced: {
      tables: 'Standard row heights (44-52px) with comfortable padding. Balance scanability with touch targets. Use subtle dividers.',
      dashboards: 'Moderate widget gaps (16-20px). Balance information density with visual clarity. Allow widgets to breathe.',
      forms: 'Comfortable field spacing (20-24px between fields). Clear visual grouping. Adequate space for help text and errors.',
      navigation: 'Standard navigation items (40-44px height). Include icons and text labels. Clearly distinguish active states.',
    },
    spacious: {
      tables: 'Generous row heights (52-64px) with ample padding. Prioritize readability over density. Use white space as a separator.',
      dashboards: 'Large widget gaps (24-32px). Each widget should feel like a distinct moment. Favor quality of information over quantity.',
      forms: 'Generous spacing (28-36px between fields). Each field should feel unrushed. Use step-by-step patterns for complex forms.',
      navigation: 'Tall navigation items (48-56px height). Icons prominent, text clear. Use negative space to create focus areas.',
    },
  };
  return contexts[profile];
}

function getContrastRationale(profile: ContrastPhilosophy, mood: string, category: string): string {
  const rationales: Record<ContrastPhilosophy, string> = {
    'low-contrast-calm': `The ${mood} mood is expressed through subtle tonal shifts rather than stark contrasts. This approach reduces visual stress, essential for ${category} where users may spend extended time.`,
    'high-contrast-assertive': `Bold contrast supports the ${mood} character, making the interface feel decisive and energetic. Key actions and important information demand attention in the ${category} context.`,
    'mixed-functional': `Contrast is deployed strategically: high contrast for actions and critical information, low contrast for supporting elements. This serves ${category} users who need both efficiency and clarity.`,
  };
  return rationales[profile];
}

function getTextHierarchy(profile: ContrastPhilosophy): string {
  const hierarchy: Record<ContrastPhilosophy, string> = {
    'low-contrast-calm': 'Primary text uses medium weight rather than bold. Secondary text is only slightly lighter than primary. Headlines differ in size rather than weight.',
    'high-contrast-assertive': 'Clear weight contrast between headings and body. Primary text is noticeably darker. Use bold strategically to create emphasis.',
    'mixed-functional': 'Headings use bold weight for clear hierarchy. Body text maintains comfortable contrast. Secondary text steps down noticeably but remains readable.',
  };
  return hierarchy[profile];
}

function getSurfaceContrast(profile: ContrastPhilosophy): string {
  const surface: Record<ContrastPhilosophy, string> = {
    'low-contrast-calm': 'Surfaces differ subtly—cards barely lift from backgrounds. Borders are soft or replaced with shadows. The interface feels unified and calm.',
    'high-contrast-assertive': 'Clear surface hierarchy with distinct elevation. Cards pop from backgrounds. Borders are crisp when used. Active states are unmistakable.',
    'mixed-functional': 'Primary content areas have clear contrast. Secondary surfaces use subtle differentiation. Interactive elements stand out through targeted contrast.',
  };
  return surface[profile];
}

function getEmphasisStrategy(profile: ContrastPhilosophy): string {
  const emphasis: Record<ContrastPhilosophy, string> = {
    'low-contrast-calm': 'Emphasis through size and position rather than color intensity. Use brand color sparingly. Animation can provide emphasis without visual weight.',
    'high-contrast-assertive': 'Brand color used confidently for primary actions. Strong fills for buttons. Status colors are vibrant. Empty states have personality.',
    'mixed-functional': 'Primary actions use full brand color. Secondary actions use subtle treatments. Status and feedback use appropriate semantic colors at reduced intensity.',
  };
  return emphasis[profile];
}

function getTextureRationale(profile: TextureUsage, category: string, mood: string): string {
  const rationales: Record<TextureUsage, string> = {
    none: `The ${category} product maintains a clean, texture-free aesthetic. This supports ${mood} by eliminating visual noise. Depth is created through shadows and layering, not surface treatments.`,
    subtle: `Minimal texture adds warmth without distraction. Light gradients, subtle patterns, or noise in specific contexts reinforce the ${mood} mood while keeping the ${category} interface functional.`,
    expressive: `Texture plays an active role in the visual language, supporting the ${mood} character and ${category} identity. Backgrounds, illustrations, and decorative elements contribute to a rich visual experience.`,
  };
  return rationales[profile];
}

function getTextureContexts(profile: TextureUsage): { allowed: string[]; prohibited: string[] } {
  const contexts: Record<TextureUsage, { allowed: string[]; prohibited: string[] }> = {
    none: {
      allowed: ['Subtle shadows for depth', 'Solid color fills only', 'Clean gradients for illustration backgrounds'],
      prohibited: ['Background patterns', 'Grainy textures', 'Illustrative textures on UI surfaces', 'Noise overlays'],
    },
    subtle: {
      allowed: ['Light noise on hero sections', 'Subtle gradients on cards', 'Muted patterns in empty states', 'Soft shadows with slight blur'],
      prohibited: ['Heavy patterns on interactive elements', 'Texture on text backgrounds', 'Animated textures', 'High-contrast patterns'],
    },
    expressive: {
      allowed: ['Rich background textures', 'Illustrative patterns', 'Gradient meshes', 'Organic shapes and patterns', 'Paper-like textures for content areas'],
      prohibited: ['Texture on critical UI controls', 'Patterns that reduce text readability', 'Animations on textured surfaces'],
    },
  };
  return contexts[profile];
}

function getTexturePerformanceGuidance(profile: TextureUsage): string {
  const guidance: Record<TextureUsage, string> = {
    none: 'No special performance considerations. CSS-based shadows and gradients are GPU-accelerated.',
    subtle: 'Use CSS gradients and SVG filters when possible. Pre-generate noise textures at appropriate resolution. Avoid texture animations on scroll.',
    expressive: 'Optimize image textures for web delivery. Use WebP/AVIF formats. Consider lazy-loading textured sections. Test on low-end devices.',
  };
  return guidance[profile];
}

function getTimingPhilosophy(profile: MotionCharacter): string {
  const timing: Record<MotionCharacter, string> = {
    restrained: 'Short durations (100-150ms) with gentle easing. Prefer fade over movement. Group animations complete together without drawing attention.',
    confident: 'Moderate durations (150-250ms) with smooth easing. Elements settle with subtle overshoot. Stagger is minimal but perceptible.',
    energetic: 'Quick durations (100-200ms) with snappy easing. Noticeable acceleration and deceleration. Staggered animations create rhythm.',
    ceremonial: 'Varies by context: routine interactions are quick (100-150ms), meaningful moments take time (300-500ms). Special easing for celebration.',
  };
  return timing[profile];
}

function getPurposeOfMotion(profile: MotionCharacter): string {
  const purpose: Record<MotionCharacter, string> = {
    restrained: 'Motion serves feedback and orientation only. It confirms actions, shows loading states, and maintains spatial continuity during navigation.',
    confident: 'Motion builds trust through polish. It communicates quality and reliability. Users feel the product is well-crafted and predictable.',
    energetic: 'Motion creates engagement and delight. It makes the interface feel dynamic and responsive. Users feel energized by the interaction.',
    ceremonial: 'Motion marks achievements and milestones. It transforms routine actions into meaningful moments. Users feel recognized and celebrated.',
  };
  return purpose[profile];
}

function getEntranceExits(profile: MotionCharacter): string {
  const patterns: Record<MotionCharacter, string> = {
    restrained: 'Elements appear with quick fade (100ms). Exits use fade-out. No translation on entrance. Modals appear instantly with background fade.',
    confident: 'Elements scale up slightly (0.98 to 1) with fade. Exits reverse the pattern. Modals slide in from below with confident timing.',
    energetic: 'Elements slide in from context-appropriate direction with bounce. Multiple elements stagger. Exits are quick to not delay the next action.',
    ceremonial: 'Important elements have distinctive entrances (e.g., success celebrations). Routine elements use confident patterns. Exits are quick for flow.',
  };
  return patterns[profile];
}

function getMicroInteractions(profile: MotionCharacter): string {
  const micro: Record<MotionCharacter, string> = {
    restrained: 'Buttons have subtle hover states (color shift only). Focus rings appear instantly. Loading spinners are simple and unobtrusive.',
    confident: 'Buttons have smooth hover transitions. Press states are perceptible. Toggles animate smoothly. Loading states feel controlled.',
    energetic: 'Buttons respond quickly to hover with noticeable feedback. Press creates satisfying response. Toggles snap with personality.',
    ceremonial: 'Standard interactions are confident. Success states have special treatment. Achievement unlocks have memorable micro-animations.',
  };
  return micro[profile];
}

function getLayoutRationale(profile: LayoutPhilosophy, category: string, mood: string): string {
  const rationales: Record<LayoutPhilosophy, string> = {
    'content-first': `The ${category} product prioritizes content accessibility. Structure serves content, not vice versa. The ${mood} mood emerges from thoughtful content presentation.`,
    'structure-first': `The ${category} domain benefits from clear structural organization. Users navigate by structure, finding content within predictable containers. This supports the ${mood} sensibility.`,
    'narrative': `The ${category} experience unfolds as a journey. Layout guides users through content progressively, supporting the ${mood} mood and creating memorable experiences.`,
  };
  return rationales[profile];
}

function getGridUsage(profile: LayoutPhilosophy): string {
  const grid: Record<LayoutPhilosophy, string> = {
    'content-first': 'Flexible grid that adapts to content needs. Column widths respond to content type. The grid is a guide, not a constraint.',
    'structure-first': 'Rigid grid with consistent column widths. Content adapts to grid, creating predictable patterns. Use 12-column base with clear breakpoints.',
    'narrative': 'Grid varies by section to support storytelling. Hero sections break the grid. Content sections use centered, readable widths.',
  };
  return grid[profile];
}

function getWhiteSpaceIntent(profile: LayoutPhilosophy): string {
  const whitespace: Record<LayoutPhilosophy, string> = {
    'content-first': 'White space creates content grouping. Margins between content types are generous. Internal spacing is tighter for cohesion.',
    'structure-first': 'White space is systematic—consistent across similar elements. Padding and margins follow a strict scale. Predictability over personality.',
    'narrative': 'White space creates rhythm and pacing. More space before important sections. The page breathes like a well-designed editorial.',
  };
  return whitespace[profile];
}

function getResponsiveStrategy(profile: LayoutPhilosophy): string {
  const responsive: Record<LayoutPhilosophy, string> = {
    'content-first': 'Content determines breakpoints. Key content remains visible at all sizes. Navigation simplifies but content structure persists.',
    'structure-first': 'Structural landmarks persist across breakpoints. Sidebar collapses predictably. Grid adapts but maintains column relationships.',
    'narrative': 'Story adapts to viewport. Mobile may reorder sections for optimal narrative flow. Hero treatments transform but maintain impact.',
  };
  return responsive[profile];
}

// ===== Main Generator =====

/**
 * Generate Visual Signature from Brand DNA
 *
 * Deterministic output based on:
 * - brandDNA.mood (shape, contrast, texture)
 * - brandDNA.archetype (shape override, motion character)
 * - brandDNA.category (density, texture, layout)
 *
 * @param brandDNA - Enhanced Brand DNA object
 * @returns Complete Visual Signature specification
 */
export function generateVisualSignature(brandDNA: BrandDNA): VisualSignature {
  const { mood, archetype, category } = brandDNA;

  // Derive shape language (archetype can override mood)
  const baseShape = MOOD_SHAPE_MAP[mood] || 'balanced';
  const shapeOverride = ARCHETYPE_SHAPE_OVERRIDE[archetype];
  const shapeProfile = shapeOverride || baseShape;

  // Derive density from category
  const densityProfile = CATEGORY_DENSITY_MAP[category] || 'balanced';
  const densityContexts = getDensityContextGuidance(densityProfile);

  // Derive contrast from mood
  const contrastProfile = MOOD_CONTRAST_MAP[mood] || 'mixed-functional';

  // Derive texture from category
  const textureProfile = CATEGORY_TEXTURE_MAP[category] || 'none';
  const textureContexts = getTextureContexts(textureProfile);

  // Derive motion from archetype (mood can override for strong signals)
  const baseMotion = ARCHETYPE_MOTION_MAP[archetype] || 'confident';
  const motionOverride = MOOD_MOTION_OVERRIDE[mood];
  const motionProfile = motionOverride || baseMotion;

  // Derive layout from category
  const layoutProfile = CATEGORY_LAYOUT_MAP[category] || 'content-first';

  return {
    shapeLanguage: {
      profile: shapeProfile,
      rationale: getShapeRationale(shapeProfile, mood, archetype, category),
      cornerRadiusGuidance: getCornerRadiusGuidance(shapeProfile),
      iconTreatment: getIconTreatment(shapeProfile, archetype),
    },

    densityRhythm: {
      profile: densityProfile,
      rationale: getDensityRationale(densityProfile, category, mood),
      contexts: densityContexts,
    },

    contrastPhilosophy: {
      profile: contrastProfile,
      rationale: getContrastRationale(contrastProfile, mood, category),
      textHierarchy: getTextHierarchy(contrastProfile),
      surfaceContrast: getSurfaceContrast(contrastProfile),
      emphasisStrategy: getEmphasisStrategy(contrastProfile),
    },

    textureUsage: {
      profile: textureProfile,
      rationale: getTextureRationale(textureProfile, category, mood),
      allowedContexts: textureContexts.allowed,
      prohibitedContexts: textureContexts.prohibited,
      performanceGuidance: getTexturePerformanceGuidance(textureProfile),
    },

    motionCharacter: {
      profile: motionProfile,
      timingPhilosophy: getTimingPhilosophy(motionProfile),
      purposeOfMotion: getPurposeOfMotion(motionProfile),
      entranceExits: getEntranceExits(motionProfile),
      microInteractions: getMicroInteractions(motionProfile),
    },

    layoutPhilosophy: {
      profile: layoutProfile,
      rationale: getLayoutRationale(layoutProfile, category, mood),
      gridUsage: getGridUsage(layoutProfile),
      whiteSpaceIntent: getWhiteSpaceIntent(layoutProfile),
      responsiveStrategy: getResponsiveStrategy(layoutProfile),
    },

    generatedAt: new Date().toISOString(),
  };
}

/**
 * Get Visual Signature as JSON string for file persistence
 */
export function getVisualSignatureAsJSON(visualSignature: VisualSignature): string {
  return JSON.stringify(visualSignature, null, 2);
}

/**
 * Generate a human-readable summary of the Visual Signature
 * For logging and display purposes
 */
export function getVisualSignatureSummary(visualSignature: VisualSignature): string {
  return [
    `Shape: ${visualSignature.shapeLanguage.profile}`,
    `Density: ${visualSignature.densityRhythm.profile}`,
    `Contrast: ${visualSignature.contrastPhilosophy.profile}`,
    `Texture: ${visualSignature.textureUsage.profile}`,
    `Motion: ${visualSignature.motionCharacter.profile}`,
    `Layout: ${visualSignature.layoutPhilosophy.profile}`,
  ].join(' | ');
}
