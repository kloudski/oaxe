import type { OaxeOutput } from '../types';
import type { GeneratedFile } from './types';

/**
 * OKLCH Token System - Brand-Driven with Variance Amplifier + Fingerprinting (M3E)
 *
 * OKLCH format: oklch(L C H)
 * - L = Lightness (0-1, where 0 is black, 1 is white)
 * - C = Chroma (0-0.22, color intensity - capped for accessibility)
 * - H = Hue (0-360, color wheel position)
 *
 * Brand tokens are derived from:
 * 1. Directive text analysis
 * 2. Product name/tagline
 * 3. Brand DNA fields (tone, archetype, keywords)
 * 4. Deterministic fingerprint from directive::appName (M3E)
 *
 * M3D Enhancements:
 * - Category-driven neutral hue offsets (not fixed +30°)
 * - Mood-based neutral chroma variation
 * - Primary scale chroma curve (low at extremes, peak at 500-700)
 * - Structural tokens (radius, shadow, border) derived from mood
 *
 * M3E Enhancements:
 * - Deterministic seed = stableHash(directive::appName)
 * - brandHueFinal = brandHue + clamp(seedVariance, -12, +12)
 * - neutralHueFinal = brandHueFinal + baseOffset + clamp(seedVariance, -12, +12)
 * - radiusProfile / shadowProfile driven by seed+mood
 * - All fingerprint data persisted in tokens.json
 *
 * Semantic hues are FIXED (not harmonized) for predictable UX:
 * - success: green (145°) - universal positive association
 * - warning: amber (45°) - universal caution association
 * - error: red (25°) - universal danger association
 * - info: blue (220°) - universal information association
 *
 * Dark mode is derived by L-shift only (C/H preserved).
 */

// ===== M3E: Deterministic Brand Fingerprinting =====

/**
 * FNV-1a hash implementation (32-bit)
 * No external dependencies, produces stable numeric hash from string
 */
function fnv1a32(str: string): number {
  let hash = 0x811c9dc5; // FNV offset basis
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    // FNV prime: 0x01000193 (16777619)
    // Using multiplication with bit operations for 32-bit safety
    hash = Math.imul(hash, 0x01000193);
  }
  // Ensure positive 32-bit integer
  return hash >>> 0;
}

/**
 * Generate a deterministic seed from directive and appName
 * Format: stableHash(`${directive}::${appName}`)
 */
function generateBrandSeed(directive: string, appName: string): number {
  const input = `${directive.toLowerCase().trim()}::${appName.toLowerCase().trim()}`;
  return fnv1a32(input);
}

/**
 * Map a seed value to a range [min, max] deterministically
 * Uses different bit regions of the seed for different ranges
 */
function mapSeedToRange(seed: number, min: number, max: number, salt: number = 0): number {
  // Mix seed with salt to get different values from same seed
  const mixed = fnv1a32(`${seed}:${salt}`);
  // Normalize to 0-1 range
  const normalized = (mixed % 10000) / 10000;
  // Scale to desired range
  return min + normalized * (max - min);
}

/**
 * Clamp a value between min and max
 */
function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

// Fixed semantic hues (not harmonized) for UX predictability
const SEMANTIC_HUES = {
  success: 145,   // Green - universal positive
  warning: 45,    // Amber - universal caution
  error: 25,      // Red - universal danger
  info: 220,      // Blue - universal information
} as const;

// Brand category hue mappings
const BRAND_HUE_CATEGORIES: Record<string, { hue: number; chroma: number; keywords: string[] }> = {
  legal: { hue: 225, chroma: 0.12, keywords: ['legal', 'law', 'attorney', 'lawyer', 'court', 'contract', 'compliance', 'case'] },
  finance: { hue: 215, chroma: 0.14, keywords: ['finance', 'bank', 'payment', 'money', 'invoice', 'accounting', 'budget', 'expense'] },
  healthcare: { hue: 175, chroma: 0.15, keywords: ['health', 'medical', 'clinic', 'patient', 'doctor', 'hospital', 'care', 'therapy'] },
  wellness: { hue: 155, chroma: 0.16, keywords: ['wellness', 'mindful', 'meditation', 'ritual', 'yoga', 'self-care', 'calm', 'relaxation', 'habit'] },
  technology: { hue: 235, chroma: 0.15, keywords: ['tech', 'software', 'code', 'developer', 'api', 'platform', 'saas', 'cloud', 'data'] },
  creative: { hue: 285, chroma: 0.18, keywords: ['creative', 'design', 'art', 'studio', 'agency', 'brand', 'marketing', 'media'] },
  education: { hue: 195, chroma: 0.14, keywords: ['education', 'learn', 'course', 'student', 'school', 'training', 'knowledge', 'academy'] },
  ecommerce: { hue: 35, chroma: 0.16, keywords: ['shop', 'store', 'commerce', 'product', 'cart', 'order', 'inventory', 'retail'] },
  social: { hue: 265, chroma: 0.17, keywords: ['social', 'community', 'network', 'connect', 'chat', 'message', 'friend', 'profile'] },
  productivity: { hue: 205, chroma: 0.13, keywords: ['task', 'project', 'manage', 'track', 'workflow', 'productivity', 'organize', 'schedule'] },
  nature: { hue: 135, chroma: 0.18, keywords: ['nature', 'eco', 'green', 'sustainable', 'environment', 'organic', 'plant', 'garden'] },
  energy: { hue: 25, chroma: 0.20, keywords: ['energy', 'sport', 'fitness', 'active', 'workout', 'gym', 'performance', 'athlete'] },
};

// Tone modifiers for chroma
const TONE_CHROMA_MODIFIERS: Record<string, number> = {
  professional: -0.03,
  corporate: -0.03,
  minimal: -0.04,
  serious: -0.02,
  playful: 0.04,
  vibrant: 0.05,
  bold: 0.03,
  friendly: 0.02,
  warm: 0.01,
  calm: -0.02,
  elegant: -0.01,
};

/**
 * M3D: Category-driven neutral hue offsets
 * Different categories benefit from different neutral warmth/coolness
 */
const CATEGORY_NEUTRAL_OFFSETS: Record<string, number> = {
  legal: 15,        // Slightly warm grays for trust
  finance: 20,      // Cool professional grays
  healthcare: 25,   // Calm, clinical feel
  wellness: 35,     // Warmer, more organic grays
  technology: 10,   // Very subtle, nearly pure gray
  creative: 45,     // Distinctive warm offset
  education: 30,    // Approachable warmth
  ecommerce: 40,    // Warm, inviting grays
  social: 50,       // Distinctive personality
  productivity: 15, // Clean, focused grays
  nature: 55,       // Organic, earthy grays
  energy: 20,       // Warm but not overpowering
};

/**
 * M3D: Mood-based neutral chroma ranges
 * Controls how much color tint neutrals have
 */
const MOOD_NEUTRAL_CHROMA: Record<string, { min: number; max: number }> = {
  calm: { min: 0.006, max: 0.010 },
  serious: { min: 0.006, max: 0.010 },
  professional: { min: 0.006, max: 0.012 },
  minimal: { min: 0.004, max: 0.008 },
  elegant: { min: 0.008, max: 0.012 },
  friendly: { min: 0.010, max: 0.016 },
  playful: { min: 0.012, max: 0.018 },
  warm: { min: 0.012, max: 0.016 },
  bold: { min: 0.010, max: 0.015 },
  vibrant: { min: 0.012, max: 0.018 },
};

/**
 * M3D: Structural tokens derived from mood
 * Defines radius, shadow intensity, and border characteristics
 */
interface StructuralTokens {
  radiusSm: string;
  radiusMd: string;
  radiusLg: string;
  radiusFull: string;
  shadowXs: string;
  shadowSm: string;
  shadowMd: string;
  shadowLg: string;
  shadowXl: string;
  borderSubtle: string;
  borderDefault: string;
  borderStrong: string;
}

const MOOD_STRUCTURAL_TOKENS: Record<string, StructuralTokens> = {
  minimal: {
    radiusSm: '0.25rem',
    radiusMd: '0.375rem',
    radiusLg: '0.5rem',
    radiusFull: '9999px',
    shadowXs: '0 1px 2px oklch(0 0 0 / 0.04)',
    shadowSm: '0 1px 3px oklch(0 0 0 / 0.05)',
    shadowMd: '0 4px 6px oklch(0 0 0 / 0.05)',
    shadowLg: '0 10px 15px oklch(0 0 0 / 0.05)',
    shadowXl: '0 20px 25px oklch(0 0 0 / 0.06)',
    borderSubtle: '1px',
    borderDefault: '1px',
    borderStrong: '1px',
  },
  professional: {
    radiusSm: '0.25rem',
    radiusMd: '0.5rem',
    radiusLg: '0.75rem',
    radiusFull: '9999px',
    shadowXs: '0 1px 2px oklch(0 0 0 / 0.05)',
    shadowSm: '0 1px 3px oklch(0 0 0 / 0.06), 0 1px 2px oklch(0 0 0 / 0.04)',
    shadowMd: '0 4px 6px oklch(0 0 0 / 0.06), 0 2px 4px oklch(0 0 0 / 0.04)',
    shadowLg: '0 10px 15px oklch(0 0 0 / 0.06), 0 4px 6px oklch(0 0 0 / 0.04)',
    shadowXl: '0 20px 25px oklch(0 0 0 / 0.08), 0 8px 10px oklch(0 0 0 / 0.04)',
    borderSubtle: '1px',
    borderDefault: '1px',
    borderStrong: '1.5px',
  },
  serious: {
    radiusSm: '0.125rem',
    radiusMd: '0.25rem',
    radiusLg: '0.375rem',
    radiusFull: '9999px',
    shadowXs: '0 1px 2px oklch(0 0 0 / 0.04)',
    shadowSm: '0 1px 2px oklch(0 0 0 / 0.05)',
    shadowMd: '0 3px 5px oklch(0 0 0 / 0.05)',
    shadowLg: '0 8px 12px oklch(0 0 0 / 0.05)',
    shadowXl: '0 16px 20px oklch(0 0 0 / 0.06)',
    borderSubtle: '1px',
    borderDefault: '1px',
    borderStrong: '1px',
  },
  calm: {
    radiusSm: '0.375rem',
    radiusMd: '0.625rem',
    radiusLg: '1rem',
    radiusFull: '9999px',
    shadowXs: '0 1px 3px oklch(0 0 0 / 0.03)',
    shadowSm: '0 2px 4px oklch(0 0 0 / 0.04)',
    shadowMd: '0 4px 8px oklch(0 0 0 / 0.04)',
    shadowLg: '0 8px 16px oklch(0 0 0 / 0.04)',
    shadowXl: '0 16px 24px oklch(0 0 0 / 0.05)',
    borderSubtle: '1px',
    borderDefault: '1px',
    borderStrong: '1px',
  },
  friendly: {
    radiusSm: '0.375rem',
    radiusMd: '0.625rem',
    radiusLg: '1rem',
    radiusFull: '9999px',
    shadowXs: '0 1px 2px oklch(0 0 0 / 0.05)',
    shadowSm: '0 2px 4px oklch(0 0 0 / 0.06), 0 1px 2px oklch(0 0 0 / 0.04)',
    shadowMd: '0 4px 8px oklch(0 0 0 / 0.06), 0 2px 4px oklch(0 0 0 / 0.04)',
    shadowLg: '0 12px 20px oklch(0 0 0 / 0.07), 0 4px 8px oklch(0 0 0 / 0.04)',
    shadowXl: '0 24px 32px oklch(0 0 0 / 0.08), 0 8px 12px oklch(0 0 0 / 0.04)',
    borderSubtle: '1px',
    borderDefault: '1px',
    borderStrong: '1.5px',
  },
  playful: {
    radiusSm: '0.5rem',
    radiusMd: '0.75rem',
    radiusLg: '1.25rem',
    radiusFull: '9999px',
    shadowXs: '0 2px 4px oklch(0 0 0 / 0.06)',
    shadowSm: '0 2px 6px oklch(0 0 0 / 0.08), 0 1px 3px oklch(0 0 0 / 0.05)',
    shadowMd: '0 6px 12px oklch(0 0 0 / 0.08), 0 3px 6px oklch(0 0 0 / 0.05)',
    shadowLg: '0 14px 24px oklch(0 0 0 / 0.10), 0 6px 10px oklch(0 0 0 / 0.05)',
    shadowXl: '0 28px 40px oklch(0 0 0 / 0.12), 0 10px 16px oklch(0 0 0 / 0.05)',
    borderSubtle: '1px',
    borderDefault: '1.5px',
    borderStrong: '2px',
  },
  warm: {
    radiusSm: '0.375rem',
    radiusMd: '0.5rem',
    radiusLg: '0.875rem',
    radiusFull: '9999px',
    shadowXs: '0 1px 2px oklch(0.2 0.02 45 / 0.08)',
    shadowSm: '0 2px 4px oklch(0.2 0.02 45 / 0.10), 0 1px 2px oklch(0 0 0 / 0.04)',
    shadowMd: '0 4px 8px oklch(0.2 0.02 45 / 0.10), 0 2px 4px oklch(0 0 0 / 0.04)',
    shadowLg: '0 10px 18px oklch(0.2 0.02 45 / 0.12), 0 4px 8px oklch(0 0 0 / 0.04)',
    shadowXl: '0 20px 28px oklch(0.2 0.02 45 / 0.14), 0 8px 12px oklch(0 0 0 / 0.04)',
    borderSubtle: '1px',
    borderDefault: '1px',
    borderStrong: '1.5px',
  },
  bold: {
    radiusSm: '0.25rem',
    radiusMd: '0.5rem',
    radiusLg: '0.75rem',
    radiusFull: '9999px',
    shadowXs: '0 2px 4px oklch(0 0 0 / 0.08)',
    shadowSm: '0 3px 6px oklch(0 0 0 / 0.10), 0 1px 3px oklch(0 0 0 / 0.06)',
    shadowMd: '0 6px 12px oklch(0 0 0 / 0.12), 0 3px 6px oklch(0 0 0 / 0.06)',
    shadowLg: '0 14px 24px oklch(0 0 0 / 0.14), 0 6px 10px oklch(0 0 0 / 0.06)',
    shadowXl: '0 28px 40px oklch(0 0 0 / 0.16), 0 10px 16px oklch(0 0 0 / 0.06)',
    borderSubtle: '1px',
    borderDefault: '1.5px',
    borderStrong: '2px',
  },
  vibrant: {
    radiusSm: '0.375rem',
    radiusMd: '0.625rem',
    radiusLg: '1rem',
    radiusFull: '9999px',
    shadowXs: '0 2px 4px oklch(0 0 0 / 0.07)',
    shadowSm: '0 3px 6px oklch(0 0 0 / 0.09), 0 1px 3px oklch(0 0 0 / 0.05)',
    shadowMd: '0 6px 12px oklch(0 0 0 / 0.10), 0 3px 6px oklch(0 0 0 / 0.05)',
    shadowLg: '0 14px 24px oklch(0 0 0 / 0.12), 0 6px 10px oklch(0 0 0 / 0.05)',
    shadowXl: '0 28px 40px oklch(0 0 0 / 0.14), 0 10px 16px oklch(0 0 0 / 0.05)',
    borderSubtle: '1px',
    borderDefault: '1px',
    borderStrong: '1.5px',
  },
  elegant: {
    radiusSm: '0.25rem',
    radiusMd: '0.375rem',
    radiusLg: '0.625rem',
    radiusFull: '9999px',
    shadowXs: '0 1px 2px oklch(0 0 0 / 0.04)',
    shadowSm: '0 1px 3px oklch(0 0 0 / 0.05), 0 1px 2px oklch(0 0 0 / 0.03)',
    shadowMd: '0 4px 6px oklch(0 0 0 / 0.05), 0 2px 4px oklch(0 0 0 / 0.03)',
    shadowLg: '0 10px 15px oklch(0 0 0 / 0.06), 0 4px 6px oklch(0 0 0 / 0.03)',
    shadowXl: '0 20px 25px oklch(0 0 0 / 0.07), 0 8px 10px oklch(0 0 0 / 0.03)',
    borderSubtle: '1px',
    borderDefault: '1px',
    borderStrong: '1px',
  },
};

/**
 * Get structural tokens for a mood, with fallback to professional
 */
function getStructuralTokens(mood: string): StructuralTokens {
  return MOOD_STRUCTURAL_TOKENS[mood] || MOOD_STRUCTURAL_TOKENS.professional;
}

// ===== M3E: Radius/Shadow Profile System =====

/**
 * Radius profiles with micro-variance multipliers
 * Applied on top of base mood structural tokens
 */
interface RadiusProfile {
  name: string;
  smMultiplier: number;  // Multiplier for radiusSm
  mdMultiplier: number;  // Multiplier for radiusMd
  lgMultiplier: number;  // Multiplier for radiusLg
}

const RADIUS_PROFILES: RadiusProfile[] = [
  { name: 'sharp', smMultiplier: 0.7, mdMultiplier: 0.75, lgMultiplier: 0.8 },
  { name: 'balanced', smMultiplier: 1.0, mdMultiplier: 1.0, lgMultiplier: 1.0 },
  { name: 'soft', smMultiplier: 1.15, mdMultiplier: 1.2, lgMultiplier: 1.25 },
  { name: 'rounded', smMultiplier: 1.3, mdMultiplier: 1.4, lgMultiplier: 1.5 },
];

/**
 * Shadow profiles with intensity/blur variance
 * Applied on top of base mood structural tokens
 */
interface ShadowProfile {
  name: string;
  intensityMultiplier: number;  // Multiplier for shadow opacity
  blurMultiplier: number;       // Multiplier for shadow blur radius
}

const SHADOW_PROFILES: ShadowProfile[] = [
  { name: 'subtle', intensityMultiplier: 0.7, blurMultiplier: 0.8 },
  { name: 'standard', intensityMultiplier: 1.0, blurMultiplier: 1.0 },
  { name: 'pronounced', intensityMultiplier: 1.25, blurMultiplier: 1.15 },
  { name: 'bold', intensityMultiplier: 1.5, blurMultiplier: 1.3 },
];

/**
 * Select a radius profile based on seed and mood
 * Certain moods bias toward certain profiles
 */
function selectRadiusProfile(seed: number, mood: string): RadiusProfile {
  // Mood-based biases (index into RADIUS_PROFILES)
  const moodBias: Record<string, number> = {
    minimal: 0,      // Prefer sharp
    serious: 0,      // Prefer sharp
    professional: 1, // Prefer balanced
    elegant: 1,      // Prefer balanced
    calm: 2,         // Prefer soft
    friendly: 2,     // Prefer soft
    warm: 2,         // Prefer soft
    playful: 3,      // Prefer rounded
    vibrant: 2,      // Prefer soft
    bold: 1,         // Prefer balanced
  };

  const baseBias = moodBias[mood] ?? 1;
  // Use seed to add variance: -1 to +1 step from bias
  const variance = Math.floor(mapSeedToRange(seed, -1, 2, 1));
  const profileIndex = clamp(baseBias + variance, 0, RADIUS_PROFILES.length - 1);

  return RADIUS_PROFILES[profileIndex];
}

/**
 * Select a shadow profile based on seed and mood
 * Certain moods bias toward certain profiles
 */
function selectShadowProfile(seed: number, mood: string): ShadowProfile {
  // Mood-based biases (index into SHADOW_PROFILES)
  const moodBias: Record<string, number> = {
    minimal: 0,      // Prefer subtle
    elegant: 0,      // Prefer subtle
    calm: 0,         // Prefer subtle
    serious: 1,      // Prefer standard
    professional: 1, // Prefer standard
    friendly: 2,     // Prefer pronounced
    warm: 2,         // Prefer pronounced
    vibrant: 2,      // Prefer pronounced
    playful: 3,      // Prefer bold
    bold: 3,         // Prefer bold
  };

  const baseBias = moodBias[mood] ?? 1;
  // Use seed to add variance: -1 to +1 step from bias
  const variance = Math.floor(mapSeedToRange(seed, -1, 2, 2));
  const profileIndex = clamp(baseBias + variance, 0, SHADOW_PROFILES.length - 1);

  return SHADOW_PROFILES[profileIndex];
}

/**
 * Apply radius profile multipliers to base structural tokens
 */
function applyRadiusProfile(tokens: StructuralTokens, profile: RadiusProfile): StructuralTokens {
  const parseRem = (value: string): number => parseFloat(value.replace('rem', ''));
  const formatRem = (value: number): string => `${value.toFixed(3)}rem`;

  return {
    ...tokens,
    radiusSm: formatRem(parseRem(tokens.radiusSm) * profile.smMultiplier),
    radiusMd: formatRem(parseRem(tokens.radiusMd) * profile.mdMultiplier),
    radiusLg: formatRem(parseRem(tokens.radiusLg) * profile.lgMultiplier),
  };
}

/**
 * Apply shadow profile multipliers to base structural tokens
 * Modifies opacity and blur values in shadow strings
 */
function applyShadowProfile(tokens: StructuralTokens, profile: ShadowProfile): StructuralTokens {
  const transformShadow = (shadow: string): string => {
    // Pattern: "0 Xpx Ypx oklch(L C H / opacity)"
    return shadow.replace(
      /(\d+(?:\.\d+)?px)\s+(\d+(?:\.\d+)?px)\s+oklch\(([^/]+)\/\s*(\d+(?:\.\d+)?)\)/g,
      (_match, offset, blur, color, opacity) => {
        const newBlur = (parseFloat(blur) * profile.blurMultiplier).toFixed(0) + 'px';
        const newOpacity = (parseFloat(opacity) * profile.intensityMultiplier).toFixed(2);
        return `${offset} ${newBlur} oklch(${color}/ ${newOpacity})`;
      }
    );
  };

  return {
    ...tokens,
    shadowXs: transformShadow(tokens.shadowXs),
    shadowSm: transformShadow(tokens.shadowSm),
    shadowMd: transformShadow(tokens.shadowMd),
    shadowLg: transformShadow(tokens.shadowLg),
    shadowXl: transformShadow(tokens.shadowXl),
  };
}

/**
 * M3E Fingerprint - deterministic variance data
 */
interface BrandFingerprint {
  seed: number;
  brandHueVariance: number;      // -12 to +12
  neutralHueVariance: number;    // -12 to +12
  radiusProfile: RadiusProfile;
  shadowProfile: ShadowProfile;
}

/**
 * Brand Seed - computed from directive and brand DNA (M3E enhanced)
 */
interface BrandSeed {
  // M3D fields
  brandHue: number;           // Base hue from category
  brandHueFinal: number;      // M3E: with fingerprint variance applied
  brandChroma: number;
  neutralHue: number;         // Base offset from category
  neutralHueFinal: number;    // M3E: with fingerprint variance applied
  neutralChroma: number;
  mood: string;
  category: string;
  matchedKeywords: string[];
  matchSource: 'directive' | 'appName' | 'brandDNA' | 'elevatorPitch' | 'default';
  structuralTokens: StructuralTokens;
  // M3E fields
  fingerprint: BrandFingerprint;
}

/**
 * Text sources for brand extraction with source tracking
 */
interface TextSource {
  text: string;
  source: 'directive' | 'appName' | 'brandDNA' | 'elevatorPitch';
}

/**
 * Extract brand seed from directive, product name, and brand DNA
 */
function extractBrandSeed(
  directive: string,
  appName: string,
  brandDNA: OaxeOutput['brandDNA'],
  elevatorPitch: string
): BrandSeed {
  // Track text sources separately for source attribution
  const sources: TextSource[] = [
    { text: directive.toLowerCase(), source: 'directive' },
    { text: appName.toLowerCase(), source: 'appName' },
    { text: [brandDNA.tone, brandDNA.positioning, ...brandDNA.values].join(' ').toLowerCase(), source: 'brandDNA' },
    { text: elevatorPitch.toLowerCase(), source: 'elevatorPitch' },
  ];

  // Score each category by keyword matches, tracking which keywords matched and where
  let bestCategory = 'technology'; // Default fallback
  let bestScore = 0;
  let matchedKeywords: string[] = [];
  let matchSource: BrandSeed['matchSource'] = 'default';

  for (const [category, config] of Object.entries(BRAND_HUE_CATEGORIES)) {
    let categoryScore = 0;
    const categoryMatches: string[] = [];
    let categoryMatchSource: BrandSeed['matchSource'] = 'default';
    let highestSourceScore = 0;

    for (const keyword of config.keywords) {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');

      for (const { text, source } of sources) {
        const matches = text.match(regex);
        if (matches) {
          const matchCount = matches.length;
          categoryScore += matchCount;
          if (!categoryMatches.includes(keyword)) {
            categoryMatches.push(keyword);
          }
          // Track which source had the most matches for this category
          if (matchCount > highestSourceScore) {
            highestSourceScore = matchCount;
            categoryMatchSource = source;
          }
        }
      }
    }

    if (categoryScore > bestScore) {
      bestScore = categoryScore;
      bestCategory = category;
      matchedKeywords = categoryMatches;
      matchSource = categoryMatchSource;
    }
  }

  const categoryConfig = BRAND_HUE_CATEGORIES[bestCategory];
  const brandHueBase = categoryConfig.hue;
  let brandChroma = categoryConfig.chroma;

  // Apply tone modifiers
  const tone = brandDNA.tone.toLowerCase();
  for (const [toneName, modifier] of Object.entries(TONE_CHROMA_MODIFIERS)) {
    if (tone.includes(toneName)) {
      brandChroma = Math.max(0.08, Math.min(0.22, brandChroma + modifier));
      break;
    }
  }

  // Determine mood from tone (needed before neutral calculation)
  const mood = deriveMood(tone, bestCategory);

  // ===== M3E: Generate Deterministic Fingerprint =====
  const seed = generateBrandSeed(directive, appName);

  // M3E: Compute bounded hue variance from seed (-12 to +12)
  const brandHueVariance = clamp(Math.round(mapSeedToRange(seed, -12, 12, 3)), -12, 12);
  const brandHueFinal = (brandHueBase + brandHueVariance + 360) % 360;

  // M3D: Category-driven neutral hue offset (not fixed +30°)
  const neutralOffset = CATEGORY_NEUTRAL_OFFSETS[bestCategory] || 30;
  const neutralHueBase = (brandHueFinal + neutralOffset) % 360;

  // M3E: Apply additional neutral hue variance from seed
  const neutralHueVariance = clamp(Math.round(mapSeedToRange(seed, -12, 12, 4)), -12, 12);
  const neutralHueFinal = (neutralHueBase + neutralHueVariance + 360) % 360;

  // M3D: Mood-based neutral chroma variation
  const moodChromaRange = MOOD_NEUTRAL_CHROMA[mood] || { min: 0.006, max: 0.012 };
  // Use midpoint of range, slightly biased toward lower end for safety
  // Cap neutral chroma to keep neutrals from becoming too tinted
  const neutralChroma = Math.min(
    0.015,
    moodChromaRange.min + (moodChromaRange.max - moodChromaRange.min) * 0.4
  );

  // M3E: Select radius and shadow profiles based on seed + mood
  const radiusProfile = selectRadiusProfile(seed, mood);
  const shadowProfile = selectShadowProfile(seed, mood);

  // M3D: Get base structural tokens for this mood
  let structuralTokens = getStructuralTokens(mood);

  // M3E: Apply profile multipliers to structural tokens
  structuralTokens = applyRadiusProfile(structuralTokens, radiusProfile);
  structuralTokens = applyShadowProfile(structuralTokens, shadowProfile);

  // Build fingerprint object
  const fingerprint: BrandFingerprint = {
    seed,
    brandHueVariance,
    neutralHueVariance,
    radiusProfile,
    shadowProfile,
  };

  return {
    brandHue: brandHueBase,
    brandHueFinal,
    brandChroma,
    neutralHue: neutralHueBase,
    neutralHueFinal,
    neutralChroma,
    mood,
    category: bestCategory,
    matchedKeywords,
    matchSource,
    structuralTokens,
    fingerprint,
  };
}

/**
 * Derive mood string from tone and category
 */
function deriveMood(tone: string, category: string): string {
  const toneWords = tone.toLowerCase();

  if (toneWords.includes('playful') || toneWords.includes('fun')) return 'playful';
  if (toneWords.includes('serious') || toneWords.includes('formal')) return 'serious';
  if (toneWords.includes('warm') || toneWords.includes('friendly')) return 'warm';
  if (toneWords.includes('minimal') || toneWords.includes('clean')) return 'minimal';
  if (toneWords.includes('bold') || toneWords.includes('vibrant')) return 'bold';
  if (toneWords.includes('calm') || toneWords.includes('peaceful')) return 'calm';
  if (toneWords.includes('elegant') || toneWords.includes('luxury')) return 'elegant';
  if (toneWords.includes('professional')) return 'professional';

  // Default based on category
  const categoryMoods: Record<string, string> = {
    legal: 'professional',
    finance: 'professional',
    healthcare: 'calm',
    wellness: 'calm',
    technology: 'minimal',
    creative: 'bold',
    education: 'friendly',
    ecommerce: 'vibrant',
    social: 'friendly',
    productivity: 'minimal',
    nature: 'calm',
    energy: 'bold',
  };

  return categoryMoods[category] || 'professional';
}

interface TokenScale {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
  950: string;
}

/**
 * M3D: Generate a color scale with enhanced chroma curve
 *
 * Chroma curve:
 * - Low at 50-200 (subtle tints)
 * - Peaks at 500-700 (vibrant core)
 * - Tapers at 900-950 (muted darks)
 *
 * This creates more natural, premium-feeling color scales.
 */
function generateColorScale(hue: number, chroma: number): TokenScale {
  // Chroma multipliers forming a bell curve peaking at 500-600
  const chromaMultipliers = {
    50: 0.20,   // Very subtle
    100: 0.30,  // Subtle
    200: 0.50,  // Building
    300: 0.75,  // Approaching peak
    400: 0.92,  // Near peak
    500: 1.00,  // Peak
    600: 1.00,  // Peak maintained
    700: 0.90,  // Starting taper
    800: 0.70,  // Tapering
    900: 0.50,  // Muted
    950: 0.35,  // Very muted
  };

  return {
    50: `oklch(0.985 ${(chroma * chromaMultipliers[50]).toFixed(3)} ${hue})`,
    100: `oklch(0.965 ${(chroma * chromaMultipliers[100]).toFixed(3)} ${hue})`,
    200: `oklch(0.92 ${(chroma * chromaMultipliers[200]).toFixed(3)} ${hue})`,
    300: `oklch(0.85 ${(chroma * chromaMultipliers[300]).toFixed(3)} ${hue})`,
    400: `oklch(0.75 ${(chroma * chromaMultipliers[400]).toFixed(3)} ${hue})`,
    500: `oklch(0.65 ${(chroma * chromaMultipliers[500]).toFixed(3)} ${hue})`,
    600: `oklch(0.55 ${(chroma * chromaMultipliers[600]).toFixed(3)} ${hue})`,
    700: `oklch(0.45 ${(chroma * chromaMultipliers[700]).toFixed(3)} ${hue})`,
    800: `oklch(0.35 ${(chroma * chromaMultipliers[800]).toFixed(3)} ${hue})`,
    900: `oklch(0.25 ${(chroma * chromaMultipliers[900]).toFixed(3)} ${hue})`,
    950: `oklch(0.15 ${(chroma * chromaMultipliers[950]).toFixed(3)} ${hue})`,
  };
}

/**
 * Contrast Guardrails
 *
 * OKLCH L values for WCAG AA compliance (4.5:1 for normal text):
 * - On white (L=1.0): text needs L ≤ 0.55
 * - On black (L=0.0): text needs L ≥ 0.55
 * - On primary-500 (L=0.65): white text works (contrast ~4.5:1)
 *
 * These are minimal guardrails - semantic tokens handle most cases.
 */
const CONTRAST_GUARDRAILS = {
  // Minimum L for readable text on light backgrounds
  minTextLightBg: 0.45,
  // Maximum L for readable text on dark backgrounds
  maxTextDarkBg: 0.85,
  // Primary button: L=0.55-0.65 range allows white text
  primaryButtonL: { min: 0.50, max: 0.65 },
  // Primary fg should be white (L=1.0) for buttons
  primaryFgL: 1.0,
} as const;

/**
 * Ensure primary color has sufficient contrast for white text
 */
function ensurePrimaryContrast(lightness: number): number {
  if (lightness > CONTRAST_GUARDRAILS.primaryButtonL.max) {
    return CONTRAST_GUARDRAILS.primaryButtonL.max;
  }
  if (lightness < CONTRAST_GUARDRAILS.primaryButtonL.min) {
    return CONTRAST_GUARDRAILS.primaryButtonL.min;
  }
  return lightness;
}

/**
 * Extract brand seed and generate tokens CSS
 * Uses directive-driven computation instead of hex color extraction
 */
function generateTokensCSS(output: OaxeOutput, directive: string = ''): string {
  // Extract brand seed from all available inputs
  const brandSeed = extractBrandSeed(
    directive,
    output.appName,
    output.brandDNA,
    output.elevatorPitch
  );

  // M3E: Use final hue values (with fingerprint variance applied)
  const { brandHueFinal, brandChroma, neutralHueFinal, neutralChroma, fingerprint } = brandSeed;

  // Generate color scales with brand-computed values (using final hues)
  const primary = generateColorScale(brandHueFinal, brandChroma);
  const success = generateColorScale(SEMANTIC_HUES.success, 0.18);
  const warning = generateColorScale(SEMANTIC_HUES.warning, 0.16);
  const error = generateColorScale(SEMANTIC_HUES.error, 0.20);
  const info = generateColorScale(SEMANTIC_HUES.info, 0.14);

  // Compute guardrailed L values for primary
  const primaryL = ensurePrimaryContrast(0.55);

  // Format neutral chroma for CSS
  const nC = neutralChroma.toFixed(3);

  const { structuralTokens } = brandSeed;

  return `/**
 * ${output.appName} Design Tokens
 * Generated with OKLCH color space for perceptual uniformity
 *
 * Brand: ${brandSeed.category} / ${brandSeed.mood}
 * Brand Hue (base): ${brandSeed.brandHue}° → (final): ${brandHueFinal}° [variance: ${fingerprint.brandHueVariance > 0 ? '+' : ''}${fingerprint.brandHueVariance}°]
 * Brand Chroma: ${brandChroma.toFixed(3)}
 * Neutral Hue (base): ${brandSeed.neutralHue}° → (final): ${neutralHueFinal}° [variance: ${fingerprint.neutralHueVariance > 0 ? '+' : ''}${fingerprint.neutralHueVariance}°]
 * Neutral Chroma: ${neutralChroma.toFixed(4)} (mood-adjusted, capped)
 *
 * M3E Fingerprint:
 * - Seed: ${fingerprint.seed} (from directive::appName)
 * - Radius Profile: ${fingerprint.radiusProfile.name}
 * - Shadow Profile: ${fingerprint.shadowProfile.name}
 *
 * M3D Enhancements:
 * - Category-driven neutral offset (not fixed +30°)
 * - Mood-based neutral chroma (${brandSeed.mood}: ${MOOD_NEUTRAL_CHROMA[brandSeed.mood]?.min || 0.006}-${MOOD_NEUTRAL_CHROMA[brandSeed.mood]?.max || 0.012})
 * - Primary chroma curve (peak at 500-700, tapers at extremes)
 * - Structural tokens (radius/shadow/border) from mood
 *
 * Semantic hues are FIXED for UX predictability:
 * - success: 145° (green), warning: 45° (amber), error: 25° (red), info: 220° (blue)
 *
 * Dark mode derived via L-shift only (C/H preserved)
 * Dark mode preserves semantic order: 50 stays lightest, 950 stays darkest
 */

/* ===== LIGHT MODE (Default) ===== */
:root {
  /* --- Structural Tokens (mood: ${brandSeed.mood}) --- */
  --radius-sm: ${structuralTokens.radiusSm};
  --radius-md: ${structuralTokens.radiusMd};
  --radius-lg: ${structuralTokens.radiusLg};
  --radius-full: ${structuralTokens.radiusFull};

  --border-width-subtle: ${structuralTokens.borderSubtle};
  --border-width-default: ${structuralTokens.borderDefault};
  --border-width-strong: ${structuralTokens.borderStrong};

  /* --- Neutral Scale (hue derived from brand: ${neutralHueFinal}°) --- */
  --neutral-50: oklch(0.985 ${nC} ${neutralHueFinal});
  --neutral-100: oklch(0.965 ${nC} ${neutralHueFinal});
  --neutral-200: oklch(0.92 ${nC} ${neutralHueFinal});
  --neutral-300: oklch(0.88 ${nC} ${neutralHueFinal});
  --neutral-400: oklch(0.70 ${nC} ${neutralHueFinal});
  --neutral-500: oklch(0.55 ${nC} ${neutralHueFinal});
  --neutral-600: oklch(0.45 ${nC} ${neutralHueFinal});
  --neutral-700: oklch(0.35 ${nC} ${neutralHueFinal});
  --neutral-800: oklch(0.25 ${nC} ${neutralHueFinal});
  --neutral-900: oklch(0.18 ${nC} ${neutralHueFinal});
  --neutral-950: oklch(0.12 ${nC} ${neutralHueFinal});

  /* --- Primary/Brand Scale --- */
  --primary-50: ${primary[50]};
  --primary-100: ${primary[100]};
  --primary-200: ${primary[200]};
  --primary-300: ${primary[300]};
  --primary-400: ${primary[400]};
  --primary-500: ${primary[500]};
  --primary-600: ${primary[600]};
  --primary-700: ${primary[700]};
  --primary-800: ${primary[800]};
  --primary-900: ${primary[900]};
  --primary-950: ${primary[950]};

  /* --- Semantic: Success --- */
  --success-50: ${success[50]};
  --success-100: ${success[100]};
  --success-500: ${success[500]};
  --success-600: ${success[600]};
  --success-700: ${success[700]};

  /* --- Semantic: Warning --- */
  --warning-50: ${warning[50]};
  --warning-100: ${warning[100]};
  --warning-500: ${warning[500]};
  --warning-600: ${warning[600]};
  --warning-700: ${warning[700]};

  /* --- Semantic: Error --- */
  --error-50: ${error[50]};
  --error-100: ${error[100]};
  --error-500: ${error[500]};
  --error-600: ${error[600]};
  --error-700: ${error[700]};

  /* --- Semantic: Info --- */
  --info-50: ${info[50]};
  --info-100: ${info[100]};
  --info-500: ${info[500]};
  --info-600: ${info[600]};
  --info-700: ${info[700]};

  /* ===== SEMANTIC TOKENS (Light) ===== */

  /* Background */
  --bg: var(--neutral-50);
  --bg-secondary: oklch(0.995 0 0);
  --bg-surface: oklch(1 0 0);
  --bg-surface-raised: oklch(1 0 0);
  --bg-muted: var(--neutral-100);
  --bg-hover: var(--neutral-100);
  --bg-active: var(--neutral-200);

  /* Text */
  --text: var(--neutral-900);
  --text-secondary: var(--neutral-600);
  --text-muted: var(--neutral-500);
  --text-placeholder: var(--neutral-400);
  --text-inverse: oklch(1 0 0);

  /* Border */
  --border: var(--neutral-200);
  --border-subtle: var(--neutral-100);
  --border-strong: var(--neutral-300);

  /* Ring (focus) */
  --ring: var(--primary-500);
  --ring-offset: oklch(1 0 0);

  /* Shadow (mood-derived: ${brandSeed.mood}) */
  --shadow-xs: ${structuralTokens.shadowXs};
  --shadow-sm: ${structuralTokens.shadowSm};
  --shadow-md: ${structuralTokens.shadowMd};
  --shadow-lg: ${structuralTokens.shadowLg};
  --shadow-xl: ${structuralTokens.shadowXl};

  /* Primary semantic */
  --primary: var(--primary-500);
  --primary-hover: var(--primary-600);
  --primary-active: var(--primary-700);
  --primary-fg: oklch(1 0 0);
  --primary-muted: oklch(0.95 0.03 ${brandHueFinal});

  /* Success semantic */
  --success: var(--success-500);
  --success-fg: oklch(1 0 0);
  --success-muted: var(--success-50);

  /* Warning semantic */
  --warning: var(--warning-500);
  --warning-fg: var(--neutral-900);
  --warning-muted: var(--warning-50);

  /* Error semantic */
  --error: var(--error-500);
  --error-fg: oklch(1 0 0);
  --error-muted: var(--error-50);

  /* Info semantic */
  --info: var(--info-500);
  --info-fg: oklch(1 0 0);
  --info-muted: var(--info-50);

  /* Selection */
  --selection: oklch(0.92 0.05 ${brandHueFinal});
}

/* ===== DARK MODE (L-shift only, semantic order preserved) ===== */
/* 50 stays lightest, 950 stays darkest - only L values shift for dark surfaces */
.dark {
  /* --- Neutral Scale (L-shifted for dark, semantic order preserved, hue: ${neutralHueFinal}°) --- */
  /* 50 = lightest (high L), 950 = darkest (low L) - same as light mode */
  --neutral-50: oklch(0.94 ${nC} ${neutralHueFinal});
  --neutral-100: oklch(0.88 ${nC} ${neutralHueFinal});
  --neutral-200: oklch(0.78 ${nC} ${neutralHueFinal});
  --neutral-300: oklch(0.65 ${nC} ${neutralHueFinal});
  --neutral-400: oklch(0.52 ${nC} ${neutralHueFinal});
  --neutral-500: oklch(0.42 ${nC} ${neutralHueFinal});
  --neutral-600: oklch(0.34 ${nC} ${neutralHueFinal});
  --neutral-700: oklch(0.26 ${nC} ${neutralHueFinal});
  --neutral-800: oklch(0.20 ${nC} ${neutralHueFinal});
  --neutral-900: oklch(0.15 ${nC} ${neutralHueFinal});
  --neutral-950: oklch(0.10 ${nC} ${neutralHueFinal});

  /* --- Primary Scale (L-shifted for dark, M3D chroma curve, brand hue: ${brandHueFinal}°) --- */
  /* 50 = lightest (high L), 950 = darkest (low L) - same as light mode */
  /* Chroma curve: low at extremes, peak at 500-600 */
  --primary-50: oklch(0.94 ${(brandChroma * 0.20).toFixed(3)} ${brandHueFinal});
  --primary-100: oklch(0.88 ${(brandChroma * 0.30).toFixed(3)} ${brandHueFinal});
  --primary-200: oklch(0.78 ${(brandChroma * 0.50).toFixed(3)} ${brandHueFinal});
  --primary-300: oklch(0.68 ${(brandChroma * 0.75).toFixed(3)} ${brandHueFinal});
  --primary-400: oklch(0.58 ${(brandChroma * 0.92).toFixed(3)} ${brandHueFinal});
  --primary-500: oklch(0.50 ${brandChroma.toFixed(3)} ${brandHueFinal});
  --primary-600: oklch(0.42 ${brandChroma.toFixed(3)} ${brandHueFinal});
  --primary-700: oklch(0.35 ${(brandChroma * 0.90).toFixed(3)} ${brandHueFinal});
  --primary-800: oklch(0.28 ${(brandChroma * 0.70).toFixed(3)} ${brandHueFinal});
  --primary-900: oklch(0.22 ${(brandChroma * 0.50).toFixed(3)} ${brandHueFinal});
  --primary-950: oklch(0.16 ${(brandChroma * 0.35).toFixed(3)} ${brandHueFinal});

  /* --- Semantic Scales (L-shifted for dark, semantic order preserved) --- */
  /* 50 = lightest (high L), 700 = darkest in subset */
  --success-50: oklch(0.92 0.054 ${SEMANTIC_HUES.success});
  --success-100: oklch(0.85 0.072 ${SEMANTIC_HUES.success});
  --success-500: oklch(0.50 0.18 ${SEMANTIC_HUES.success});
  --success-600: oklch(0.42 0.18 ${SEMANTIC_HUES.success});
  --success-700: oklch(0.35 0.144 ${SEMANTIC_HUES.success});

  --warning-50: oklch(0.92 0.048 ${SEMANTIC_HUES.warning});
  --warning-100: oklch(0.85 0.064 ${SEMANTIC_HUES.warning});
  --warning-500: oklch(0.55 0.16 ${SEMANTIC_HUES.warning});
  --warning-600: oklch(0.45 0.16 ${SEMANTIC_HUES.warning});
  --warning-700: oklch(0.38 0.128 ${SEMANTIC_HUES.warning});

  --error-50: oklch(0.92 0.06 ${SEMANTIC_HUES.error});
  --error-100: oklch(0.85 0.08 ${SEMANTIC_HUES.error});
  --error-500: oklch(0.50 0.20 ${SEMANTIC_HUES.error});
  --error-600: oklch(0.42 0.20 ${SEMANTIC_HUES.error});
  --error-700: oklch(0.35 0.16 ${SEMANTIC_HUES.error});

  --info-50: oklch(0.92 0.042 ${SEMANTIC_HUES.info});
  --info-100: oklch(0.85 0.056 ${SEMANTIC_HUES.info});
  --info-500: oklch(0.50 0.14 ${SEMANTIC_HUES.info});
  --info-600: oklch(0.42 0.14 ${SEMANTIC_HUES.info});
  --info-700: oklch(0.35 0.112 ${SEMANTIC_HUES.info});

  /* ===== SEMANTIC TOKENS (Dark) ===== */

  /* Background - use dark end of neutral scale (high step numbers = low L in dark mode) */
  --bg: var(--neutral-950);
  --bg-secondary: oklch(0.08 ${nC} ${neutralHueFinal});
  --bg-surface: var(--neutral-900);
  --bg-surface-raised: var(--neutral-800);
  --bg-muted: var(--neutral-800);
  --bg-hover: var(--neutral-800);
  --bg-active: var(--neutral-700);

  /* Text - use light end of neutral scale (low step numbers = high L in dark mode) */
  --text: var(--neutral-50);
  --text-secondary: var(--neutral-200);
  --text-muted: var(--neutral-300);
  --text-placeholder: var(--neutral-400);
  --text-inverse: var(--neutral-950);

  /* Border */
  --border: var(--neutral-700);
  --border-subtle: var(--neutral-800);
  --border-strong: var(--neutral-600);

  /* Ring (focus) */
  --ring-offset: var(--neutral-950);

  /* Shadow (dark mode - deeper for visibility on dark surfaces) */
  --shadow-xs: 0 1px 3px oklch(0 0 0 / 0.3);
  --shadow-sm: 0 2px 4px oklch(0 0 0 / 0.35), 0 1px 2px oklch(0 0 0 / 0.25);
  --shadow-md: 0 4px 8px oklch(0 0 0 / 0.35), 0 2px 4px oklch(0 0 0 / 0.25);
  --shadow-lg: 0 10px 20px oklch(0 0 0 / 0.40), 0 4px 8px oklch(0 0 0 / 0.25);
  --shadow-xl: 0 20px 30px oklch(0 0 0 / 0.45), 0 8px 12px oklch(0 0 0 / 0.25);

  /* Primary semantic (dark) - use darker end of primary scale for muted bg */
  --primary-muted: var(--primary-900);
  --primary-fg: var(--neutral-950);

  /* Selection */
  --selection: oklch(0.30 ${(brandChroma * 0.5).toFixed(3)} ${brandHueFinal});
}
`;
}

function generateTailwindTokensConfig(output: OaxeOutput, directive: string = ''): string {
  // Extract brand seed for documentation
  const brandSeed = extractBrandSeed(
    directive,
    output.appName,
    output.brandDNA,
    output.elevatorPitch
  );

  return `import type { Config } from 'tailwindcss';

/**
 * ${output.appName} Tailwind Configuration
 *
 * All colors reference OKLCH CSS variables from tokens.css
 * No hex codes - everything flows from the token system
 *
 * Brand: ${brandSeed.category} / ${brandSeed.mood}
 * Brand hue: ${brandSeed.brandHueFinal}° | Chroma: ${brandSeed.brandChroma.toFixed(3)}
 * Neutral hue: ${brandSeed.neutralHueFinal}° (derived from brand)
 * Fingerprint seed: ${brandSeed.fingerprint.seed}
 */
const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
      },
      colors: {
        // Semantic colors - use these in components
        bg: 'var(--bg)',
        'bg-secondary': 'var(--bg-secondary)',
        surface: 'var(--bg-surface)',
        'surface-raised': 'var(--bg-surface-raised)',
        muted: 'var(--bg-muted)',

        fg: 'var(--text)',
        'fg-secondary': 'var(--text-secondary)',
        'fg-muted': 'var(--text-muted)',

        border: 'var(--border)',
        'border-subtle': 'var(--border-subtle)',
        'border-strong': 'var(--border-strong)',

        ring: 'var(--ring)',

        // Primary palette
        primary: {
          DEFAULT: 'var(--primary)',
          hover: 'var(--primary-hover)',
          active: 'var(--primary-active)',
          fg: 'var(--primary-fg)',
          muted: 'var(--primary-muted)',
          50: 'var(--primary-50)',
          100: 'var(--primary-100)',
          200: 'var(--primary-200)',
          300: 'var(--primary-300)',
          400: 'var(--primary-400)',
          500: 'var(--primary-500)',
          600: 'var(--primary-600)',
          700: 'var(--primary-700)',
          800: 'var(--primary-800)',
          900: 'var(--primary-900)',
          950: 'var(--primary-950)',
        },

        // Semantic status colors
        success: {
          DEFAULT: 'var(--success)',
          fg: 'var(--success-fg)',
          muted: 'var(--success-muted)',
          50: 'var(--success-50)',
          100: 'var(--success-100)',
          500: 'var(--success-500)',
          600: 'var(--success-600)',
          700: 'var(--success-700)',
        },
        warning: {
          DEFAULT: 'var(--warning)',
          fg: 'var(--warning-fg)',
          muted: 'var(--warning-muted)',
          50: 'var(--warning-50)',
          100: 'var(--warning-100)',
          500: 'var(--warning-500)',
          600: 'var(--warning-600)',
          700: 'var(--warning-700)',
        },
        error: {
          DEFAULT: 'var(--error)',
          fg: 'var(--error-fg)',
          muted: 'var(--error-muted)',
          50: 'var(--error-50)',
          100: 'var(--error-100)',
          500: 'var(--error-500)',
          600: 'var(--error-600)',
          700: 'var(--error-700)',
        },
        info: {
          DEFAULT: 'var(--info)',
          fg: 'var(--info-fg)',
          muted: 'var(--info-muted)',
          50: 'var(--info-50)',
          100: 'var(--info-100)',
          500: 'var(--info-500)',
          600: 'var(--info-600)',
          700: 'var(--info-700)',
        },

        // Neutral palette (for explicit use)
        neutral: {
          50: 'var(--neutral-50)',
          100: 'var(--neutral-100)',
          200: 'var(--neutral-200)',
          300: 'var(--neutral-300)',
          400: 'var(--neutral-400)',
          500: 'var(--neutral-500)',
          600: 'var(--neutral-600)',
          700: 'var(--neutral-700)',
          800: 'var(--neutral-800)',
          900: 'var(--neutral-900)',
          950: 'var(--neutral-950)',
        },
      },
      boxShadow: {
        xs: 'var(--shadow-xs)',
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        xl: 'var(--shadow-xl)',
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        DEFAULT: 'var(--radius-md)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        full: 'var(--radius-full)',
      },
      borderWidth: {
        subtle: 'var(--border-width-subtle)',
        DEFAULT: 'var(--border-width-default)',
        strong: 'var(--border-width-strong)',
      },
      ringOffsetColor: {
        DEFAULT: 'var(--ring-offset)',
      },
    },
  },
  plugins: [],
};

export default config;
`;
}

function generateThemeHelper(): string {
  return `/**
 * Theme management utilities
 *
 * Provides simple light/dark mode toggle that works with the OKLCH token system.
 * Tokens are defined in src/design/tokens.css and automatically adapt via .dark class.
 */

export type Theme = 'light' | 'dark' | 'system';

const THEME_KEY = 'theme-preference';

/**
 * Get the current theme preference from localStorage or system
 */
export function getTheme(): Theme {
  if (typeof window === 'undefined') return 'light';

  const stored = localStorage.getItem(THEME_KEY);
  if (stored === 'light' || stored === 'dark' || stored === 'system') {
    return stored;
  }

  return 'system';
}

/**
 * Get the resolved theme (light or dark) based on preference and system
 */
export function getResolvedTheme(): 'light' | 'dark' {
  const theme = getTheme();

  if (theme === 'system') {
    if (typeof window === 'undefined') return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  return theme;
}

/**
 * Set the theme preference and apply it immediately
 */
export function setTheme(theme: Theme): void {
  if (typeof window === 'undefined') return;

  localStorage.setItem(THEME_KEY, theme);
  applyTheme(theme);
}

/**
 * Apply the theme to the document
 */
function applyTheme(theme: Theme): void {
  const root = document.documentElement;
  const resolved = theme === 'system'
    ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    : theme;

  if (resolved === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}

/**
 * Toggle between light and dark themes
 */
export function toggleTheme(): Theme {
  const current = getResolvedTheme();
  const next = current === 'dark' ? 'light' : 'dark';
  setTheme(next);
  return next;
}

/**
 * Initialize theme on page load
 * Call this in your layout or app initialization
 */
export function initTheme(): void {
  if (typeof window === 'undefined') return;

  // Apply saved preference immediately
  applyTheme(getTheme());

  // Listen for system preference changes
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addEventListener('change', () => {
    if (getTheme() === 'system') {
      applyTheme('system');
    }
  });
}
`;
}

function generateGlobalsCss(output: OaxeOutput): string {
  return `@import '../design/tokens.css';

@tailwind base;
@tailwind components;
@tailwind utilities;

/**
 * ${output.appName} Global Styles
 *
 * All colors flow from the OKLCH token system in tokens.css.
 * This file contains base styles, typography, and utility classes.
 */

/* ===== BASE STYLES ===== */

html {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}

body {
  color: var(--text);
  background: var(--bg);
  font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-feature-settings: 'cv02', 'cv03', 'cv04', 'cv11';
  line-height: 1.5;
}

/* ===== TYPOGRAPHY ===== */

h1, h2, h3, h4, h5, h6 {
  font-weight: 600;
  letter-spacing: -0.02em;
  color: var(--text);
}

h1 { font-size: 1.875rem; line-height: 2.25rem; }
h2 { font-size: 1.5rem; line-height: 2rem; }
h3 { font-size: 1.25rem; line-height: 1.75rem; }
h4 { font-size: 1.125rem; line-height: 1.5rem; }

p { color: var(--text-secondary); }

.text-muted { color: var(--text-muted); }

/* ===== SELECTION ===== */

::selection {
  background: var(--selection);
  color: var(--text);
}

/* ===== SCROLLBAR ===== */

::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: var(--border-strong);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--text-muted);
}

/* ===== FOCUS RINGS ===== */

*:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px var(--ring-offset), 0 0 0 4px var(--ring);
}

/* ===== FORM BASE ===== */

input, textarea, select {
  font-family: inherit;
  font-size: inherit;
  color: var(--text);
}

input::placeholder,
textarea::placeholder {
  color: var(--text-placeholder);
}

/* ===== UTILITY CLASSES ===== */

.content-width {
  max-width: 65ch;
}

.section-gap {
  gap: 1.5rem;
}

@media (min-width: 768px) {
  .section-gap {
    gap: 2rem;
  }
}
`;
}

export interface DesignTokensOutput {
  tokensCSS: string;
  tokensJSON: Record<string, unknown>;
}

/**
 * Generate all token-related files for a generated app
 *
 * @param output - The planner output
 * @param directive - Original user directive (used for brand extraction)
 */
export function generateTokens(output: OaxeOutput, directive: string = ''): GeneratedFile[] {
  const files: GeneratedFile[] = [];

  // Extract brand seed from directive and brand DNA
  const brandSeed = extractBrandSeed(
    directive,
    output.appName,
    output.brandDNA,
    output.elevatorPitch
  );

  // 1. tokens.css - The core token definitions in OKLCH
  files.push({
    path: 'src/design/tokens.css',
    content: generateTokensCSS(output, directive),
  });

  // 2. theme.ts - Theme toggle helper
  files.push({
    path: 'src/lib/theme.ts',
    content: generateThemeHelper(),
  });

  // 3. tokens.json - Machine-readable token export with brand metadata
  const tokensJSON = {
    $schema: 'https://design-tokens.github.io/community-group/format/',
    name: `${output.appName} Design Tokens`,
    version: '1.0.0',
    colorSpace: 'oklch',
    // Brand extraction metadata (M3C requirements)
    category: brandSeed.category,
    mood: brandSeed.mood,
    // M3E: Base and final hue values
    brandHue: brandSeed.brandHue,
    brandHueFinal: brandSeed.brandHueFinal,
    brandChroma: brandSeed.brandChroma,
    neutralHue: brandSeed.neutralHue,
    neutralHueFinal: brandSeed.neutralHueFinal,
    neutralChroma: brandSeed.neutralChroma,
    matchedKeywords: brandSeed.matchedKeywords,
    matchSource: brandSeed.matchSource,
    // M3D: Category-driven neutral offset
    neutralOffset: CATEGORY_NEUTRAL_OFFSETS[brandSeed.category] || 30,
    neutralChromaRange: MOOD_NEUTRAL_CHROMA[brandSeed.mood] || { min: 0.006, max: 0.012 },
    // M3D: Primary chroma curve strategy
    primaryChromaStrategy: 'bell-curve', // Low at extremes, peak at 500-700
    // Fixed semantic hues (not harmonized)
    semanticHues: SEMANTIC_HUES,
    semanticHueStrategy: 'fixed', // Documented: not harmonized
    // Dark mode strategy
    darkModeStrategy: 'L-shift-semantic-preserved', // 50 stays lightest, 950 stays darkest
    // M3E: Brand Fingerprint
    fingerprint: {
      seed: brandSeed.fingerprint.seed,
      brandHueVariance: brandSeed.fingerprint.brandHueVariance,
      neutralHueVariance: brandSeed.fingerprint.neutralHueVariance,
      radiusProfile: brandSeed.fingerprint.radiusProfile.name,
      shadowProfile: brandSeed.fingerprint.shadowProfile.name,
    },
    // Full token palette (using final hue values)
    tokens: {
      neutral: { hue: brandSeed.neutralHueFinal, chroma: brandSeed.neutralChroma },
      primary: { hue: brandSeed.brandHueFinal, chroma: brandSeed.brandChroma },
      success: { hue: SEMANTIC_HUES.success, chroma: 0.18 },
      warning: { hue: SEMANTIC_HUES.warning, chroma: 0.16 },
      error: { hue: SEMANTIC_HUES.error, chroma: 0.20 },
      info: { hue: SEMANTIC_HUES.info, chroma: 0.14 },
    },
    // M3D/M3E: Structural tokens (mood-derived + profile-adjusted)
    structuralTokens: brandSeed.structuralTokens,
    // Contrast guardrails
    contrastGuardrails: {
      primaryButtonLRange: [0.50, 0.65],
      minTextLOnLightBg: 0.45,
      maxTextLOnDarkBg: 0.85,
    },
  };

  files.push({
    path: 'src/design/tokens.json',
    content: JSON.stringify(tokensJSON, null, 2),
  });

  return files;
}

/**
 * Generate OKLCH-based Tailwind config
 */
export function generateTokenizedTailwindConfig(output: OaxeOutput, directive: string = ''): string {
  return generateTailwindTokensConfig(output, directive);
}

/**
 * Generate OKLCH globals.css that imports tokens
 */
export function generateTokenizedGlobalsCss(output: OaxeOutput): string {
  return generateGlobalsCss(output);
}

/**
 * Get token data for run metadata persistence
 *
 * @param output - The planner output
 * @param directive - Original user directive (used for brand extraction)
 */
export function getTokensForRunMetadata(output: OaxeOutput, directive: string = ''): DesignTokensOutput {
  const brandSeed = extractBrandSeed(
    directive,
    output.appName,
    output.brandDNA,
    output.elevatorPitch
  );

  return {
    tokensCSS: generateTokensCSS(output, directive),
    tokensJSON: {
      colorSpace: 'oklch',
      // M3C metadata fields
      category: brandSeed.category,
      mood: brandSeed.mood,
      // M3E: Base and final hue values
      brandHue: brandSeed.brandHue,
      brandHueFinal: brandSeed.brandHueFinal,
      brandChroma: brandSeed.brandChroma,
      neutralHue: brandSeed.neutralHue,
      neutralHueFinal: brandSeed.neutralHueFinal,
      neutralChroma: brandSeed.neutralChroma,
      matchedKeywords: brandSeed.matchedKeywords,
      matchSource: brandSeed.matchSource,
      // M3D: Category-driven neutral offset
      neutralOffset: CATEGORY_NEUTRAL_OFFSETS[brandSeed.category] || 30,
      neutralChromaRange: MOOD_NEUTRAL_CHROMA[brandSeed.mood] || { min: 0.006, max: 0.012 },
      // M3D: Primary chroma curve strategy
      primaryChromaStrategy: 'bell-curve',
      // Semantic hues
      semanticHues: SEMANTIC_HUES,
      semanticHueStrategy: 'fixed',
      // Dark mode strategy
      darkModeStrategy: 'L-shift-semantic-preserved',
      // M3E: Brand Fingerprint
      fingerprint: {
        seed: brandSeed.fingerprint.seed,
        brandHueVariance: brandSeed.fingerprint.brandHueVariance,
        neutralHueVariance: brandSeed.fingerprint.neutralHueVariance,
        radiusProfile: brandSeed.fingerprint.radiusProfile.name,
        shadowProfile: brandSeed.fingerprint.shadowProfile.name,
      },
      // M3D/M3E: Structural tokens (mood-derived + profile-adjusted)
      structuralTokens: brandSeed.structuralTokens,
    },
  };
}

// Export brand seed extractor for testing
export { extractBrandSeed, type BrandSeed };

// ===== M4A: Brand DNA Integration Handshake =====

import type { BrandDNA } from '../types';

/**
 * M4A: Brand DNA Integration Interface
 *
 * Defines the handshake between Brand DNA and tokens generator.
 * Tokens can optionally consume mood/category from brandDNA for future enhancements.
 *
 * Currently wired for field access only - no behavior change in token generation.
 * This enables future integration where enhanced Brand DNA directly influences tokens.
 */
export interface BrandDNATokenIntegration {
  /** Category from Brand DNA (e.g., 'legal', 'wellness') */
  category: string;
  /** Mood from Brand DNA (e.g., 'calm', 'professional') */
  mood: string;
  /** Archetype from Brand DNA (e.g., 'Sage', 'Hero') */
  archetype: string;
  /** Primary color from Brand DNA visual */
  primaryColor?: string;
  /** Color palette from Brand DNA visual */
  colorPalette?: string[];
}

/**
 * M4A: Extract token-relevant fields from Brand DNA
 *
 * This function provides the integration handshake between Brand DNA and tokens.
 * Currently returns extracted fields for optional consumption.
 *
 * @param brandDNA - Enhanced Brand DNA object
 * @returns Token-relevant fields from Brand DNA
 */
export function extractBrandDNAForTokens(brandDNA: BrandDNA): BrandDNATokenIntegration {
  return {
    category: brandDNA.category,
    mood: brandDNA.mood,
    archetype: brandDNA.archetype,
    primaryColor: brandDNA.visual?.primaryColor,
    colorPalette: brandDNA.visual?.colorPalette,
  };
}

/**
 * M4A: Check if tokens should use Brand DNA override
 *
 * Returns true if Brand DNA provides explicit values that should
 * override the directive-based extraction. Currently always returns false
 * to maintain existing behavior - wire only, no change.
 *
 * @param brandDNA - Enhanced Brand DNA object
 * @returns Whether to use Brand DNA overrides
 */
export function shouldUseBrandDNAOverride(_brandDNA: BrandDNA): boolean {
  // M4A: Wire only - no behavior change yet
  // Future: return true when Brand DNA should override directive extraction
  return false;
}
