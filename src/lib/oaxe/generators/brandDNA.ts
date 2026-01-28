import type { OaxeOutput, BrandDNA } from '../types';
import { BrandDNASchema } from '../schemas';

/**
 * M4A: Brand DNA Generator
 *
 * Generates comprehensive Brand DNA from directive and planner output.
 * Uses deterministic extraction from available inputs, with conservative defaults.
 */

// Brand archetypes based on Jungian archetypes
const ARCHETYPES = [
  'Sage',       // Wisdom, knowledge (legal, education)
  'Hero',       // Achievement, willpower (sports, productivity)
  'Creator',    // Innovation, imagination (creative, technology)
  'Caregiver',  // Compassion, generosity (healthcare, wellness)
  'Ruler',      // Control, stability (finance, enterprise)
  'Everyman',   // Belonging, authenticity (social, community)
  'Jester',     // Joy, humor (entertainment, social)
  'Lover',      // Passion, intimacy (lifestyle, luxury)
  'Magician',   // Transformation, vision (technology, innovation)
  'Innocent',   // Simplicity, optimism (wellness, nature)
  'Explorer',   // Freedom, discovery (travel, adventure)
  'Outlaw',     // Liberation, disruption (startups, rebels)
] as const;

// Category to archetype mapping
const CATEGORY_ARCHETYPE_MAP: Record<string, string> = {
  legal: 'Sage',
  finance: 'Ruler',
  healthcare: 'Caregiver',
  wellness: 'Innocent',
  technology: 'Magician',
  creative: 'Creator',
  education: 'Sage',
  ecommerce: 'Everyman',
  social: 'Everyman',
  productivity: 'Hero',
  nature: 'Explorer',
  energy: 'Hero',
};

// Category to mood mapping (default moods)
const CATEGORY_MOOD_MAP: Record<string, string> = {
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

// Category to aesthetic mapping
const CATEGORY_AESTHETIC_MAP: Record<string, string> = {
  legal: 'refined and trustworthy',
  finance: 'clean and authoritative',
  healthcare: 'clean and reassuring',
  wellness: 'organic and peaceful',
  technology: 'sleek and modern',
  creative: 'bold and expressive',
  education: 'friendly and accessible',
  ecommerce: 'inviting and dynamic',
  social: 'vibrant and approachable',
  productivity: 'minimal and focused',
  nature: 'organic and earthy',
  energy: 'dynamic and powerful',
};

// Category to icon style mapping
const CATEGORY_ICON_MAP: Record<string, string> = {
  legal: 'outlined, formal',
  finance: 'outlined, precise',
  healthcare: 'rounded, soft',
  wellness: 'organic, flowing',
  technology: 'geometric, sharp',
  creative: 'custom, expressive',
  education: 'friendly, rounded',
  ecommerce: 'filled, friendly',
  social: 'filled, rounded',
  productivity: 'outlined, minimal',
  nature: 'organic, hand-drawn',
  energy: 'bold, dynamic',
};

// Category-based color palettes (OKLCH hues)
const CATEGORY_COLORS: Record<string, { primary: string; palette: string[] }> = {
  legal: { primary: 'oklch(0.55 0.12 225)', palette: ['Deep Blue', 'Slate Gray', 'Ivory'] },
  finance: { primary: 'oklch(0.55 0.14 215)', palette: ['Trust Blue', 'Forest Green', 'Gold'] },
  healthcare: { primary: 'oklch(0.55 0.15 175)', palette: ['Calm Teal', 'Clean White', 'Soft Gray'] },
  wellness: { primary: 'oklch(0.55 0.16 155)', palette: ['Serene Green', 'Warm Sand', 'Soft Lavender'] },
  technology: { primary: 'oklch(0.55 0.15 235)', palette: ['Tech Purple', 'Cyber Blue', 'Neon Accent'] },
  creative: { primary: 'oklch(0.55 0.18 285)', palette: ['Vibrant Purple', 'Electric Pink', 'Bold Orange'] },
  education: { primary: 'oklch(0.55 0.14 195)', palette: ['Friendly Cyan', 'Warm Yellow', 'Soft Coral'] },
  ecommerce: { primary: 'oklch(0.55 0.16 35)', palette: ['Warm Orange', 'Trust Blue', 'Success Green'] },
  social: { primary: 'oklch(0.55 0.17 265)', palette: ['Friendly Purple', 'Vibrant Blue', 'Warm Pink'] },
  productivity: { primary: 'oklch(0.55 0.13 205)', palette: ['Focus Blue', 'Neutral Gray', 'Success Green'] },
  nature: { primary: 'oklch(0.55 0.18 135)', palette: ['Forest Green', 'Earth Brown', 'Sky Blue'] },
  energy: { primary: 'oklch(0.55 0.20 25)', palette: ['Active Red', 'Power Orange', 'Electric Yellow'] },
};

// Brand moments by category
const CATEGORY_BRAND_MOMENTS: Record<string, { moment: string; description: string; emotion: string }[]> = {
  legal: [
    { moment: 'First Case Win', description: 'Celebrating a successful case outcome', emotion: 'Pride and relief' },
    { moment: 'Onboarding', description: 'Welcoming new users with clarity', emotion: 'Trust and confidence' },
    { moment: 'Document Ready', description: 'Completing a complex document', emotion: 'Accomplishment' },
  ],
  finance: [
    { moment: 'First Transaction', description: 'Completing the first successful transaction', emotion: 'Security and trust' },
    { moment: 'Goal Achieved', description: 'Reaching a financial milestone', emotion: 'Pride and satisfaction' },
    { moment: 'Insights Revealed', description: 'Discovering valuable financial patterns', emotion: 'Empowerment' },
  ],
  healthcare: [
    { moment: 'Care Connection', description: 'Connecting patient with provider', emotion: 'Relief and hope' },
    { moment: 'Health Milestone', description: 'Reaching a health improvement goal', emotion: 'Joy and motivation' },
    { moment: 'Appointment Confirmed', description: 'Successfully scheduling care', emotion: 'Peace of mind' },
  ],
  wellness: [
    { moment: 'Daily Ritual', description: 'Completing a wellness routine', emotion: 'Calm and centered' },
    { moment: 'Streak Achieved', description: 'Maintaining consistency', emotion: 'Pride and motivation' },
    { moment: 'Mindful Moment', description: 'Pausing for reflection', emotion: 'Peace and clarity' },
  ],
  technology: [
    { moment: 'First Deploy', description: 'Successfully deploying first project', emotion: 'Excitement and accomplishment' },
    { moment: 'Problem Solved', description: 'Overcoming a technical challenge', emotion: 'Satisfaction and relief' },
    { moment: 'Integration Success', description: 'Connecting systems seamlessly', emotion: 'Efficiency and power' },
  ],
  creative: [
    { moment: 'Creative Spark', description: 'Capturing an inspiring idea', emotion: 'Excitement and possibility' },
    { moment: 'Project Launch', description: 'Sharing work with the world', emotion: 'Pride and vulnerability' },
    { moment: 'Collaboration Magic', description: 'Co-creating something amazing', emotion: 'Connection and synergy' },
  ],
  education: [
    { moment: 'Aha Moment', description: 'Understanding a difficult concept', emotion: 'Clarity and excitement' },
    { moment: 'Course Complete', description: 'Finishing a learning journey', emotion: 'Pride and growth' },
    { moment: 'First Lesson', description: 'Starting something new', emotion: 'Curiosity and anticipation' },
  ],
  ecommerce: [
    { moment: 'First Purchase', description: 'Completing initial transaction', emotion: 'Excitement and anticipation' },
    { moment: 'Package Arrival', description: 'Receiving ordered items', emotion: 'Joy and satisfaction' },
    { moment: 'Great Deal Found', description: 'Discovering a perfect match', emotion: 'Delight and value' },
  ],
  social: [
    { moment: 'First Connection', description: 'Making initial connection', emotion: 'Belonging and curiosity' },
    { moment: 'Viral Moment', description: 'Content resonating widely', emotion: 'Validation and excitement' },
    { moment: 'Community Welcome', description: 'Being embraced by a group', emotion: 'Warmth and acceptance' },
  ],
  productivity: [
    { moment: 'Task Complete', description: 'Checking off an item', emotion: 'Satisfaction and progress' },
    { moment: 'Zero Inbox', description: 'Clearing all pending items', emotion: 'Relief and control' },
    { moment: 'Flow State', description: 'Entering peak productivity', emotion: 'Focus and power' },
  ],
  nature: [
    { moment: 'First Bloom', description: 'Seeing growth results', emotion: 'Wonder and patience rewarded' },
    { moment: 'Nature Walk', description: 'Connecting with outdoors', emotion: 'Peace and grounding' },
    { moment: 'Seasonal Shift', description: 'Observing natural cycles', emotion: 'Awe and perspective' },
  ],
  energy: [
    { moment: 'Personal Best', description: 'Breaking own record', emotion: 'Triumph and power' },
    { moment: 'Team Victory', description: 'Achieving together', emotion: 'Unity and celebration' },
    { moment: 'Challenge Started', description: 'Committing to a goal', emotion: 'Determination and excitement' },
  ],
};

// Default guardrails by mood
const MOOD_GUARDRAILS: Record<string, BrandDNA['guardrails']> = {
  professional: {
    doSay: ['We help you', 'Trusted by', 'Reliable and secure', 'Expert guidance'],
    dontSay: ['Cheap', 'Disrupt', 'Hustle', 'Crushing it'],
    visualDo: ['Use ample whitespace', 'Maintain visual hierarchy', 'Use professional photography'],
    visualDont: ['Use cartoon illustrations', 'Use overly bright colors', 'Clutter interfaces'],
  },
  calm: {
    doSay: ['Take your time', 'Breathe', 'You are enough', 'Gentle progress'],
    dontSay: ['Hurry', 'Urgent', 'Dont miss out', 'Limited time'],
    visualDo: ['Use soft gradients', 'Rounded corners', 'Organic shapes'],
    visualDont: ['Use harsh angles', 'Flash or animate aggressively', 'Use high contrast'],
  },
  bold: {
    doSay: ['Make it happen', 'Be unstoppable', 'Stand out', 'Own your power'],
    dontSay: ['Maybe', 'Try', 'Hopefully', 'If you want'],
    visualDo: ['Use strong contrast', 'Bold typography', 'Dynamic compositions'],
    visualDont: ['Be subtle', 'Use muted colors', 'Blend into the background'],
  },
  friendly: {
    doSay: ['Hey there', 'We got you', 'No worries', 'Happy to help'],
    dontSay: ['Dear Sir/Madam', 'Per our policy', 'Unfortunately', 'Regrettably'],
    visualDo: ['Use warm colors', 'Include illustrations', 'Smile in photos'],
    visualDont: ['Be overly formal', 'Use corporate stock photos', 'Be cold or distant'],
  },
  minimal: {
    doSay: ['Simple', 'Essential', 'Focus', 'Just what you need'],
    dontSay: ['Feature-packed', 'All-in-one', 'Everything you need', 'Loaded with'],
    visualDo: ['Embrace whitespace', 'Use single accent color', 'Hide complexity'],
    visualDont: ['Add decorative elements', 'Use multiple colors', 'Show all options at once'],
  },
  vibrant: {
    doSay: ['Exciting', 'Amazing', 'Love it', 'Fantastic'],
    dontSay: ['Adequate', 'Sufficient', 'Acceptable', 'Fine'],
    visualDo: ['Use bright colors', 'Add playful animations', 'Create visual surprise'],
    visualDont: ['Be monotone', 'Use boring layouts', 'Skip the fun'],
  },
};

// Category keyword detection (for directive analysis)
const CATEGORY_KEYWORDS: Record<string, string[]> = {
  legal: ['legal', 'law', 'attorney', 'lawyer', 'court', 'contract', 'compliance', 'case'],
  finance: ['finance', 'bank', 'payment', 'money', 'invoice', 'accounting', 'budget', 'expense', 'billing'],
  healthcare: ['health', 'medical', 'clinic', 'patient', 'doctor', 'hospital', 'care', 'therapy'],
  wellness: ['wellness', 'mindful', 'meditation', 'ritual', 'yoga', 'self-care', 'calm', 'relaxation', 'habit'],
  technology: ['tech', 'software', 'code', 'developer', 'api', 'platform', 'saas', 'cloud', 'data'],
  creative: ['creative', 'design', 'art', 'studio', 'agency', 'brand', 'marketing', 'media'],
  education: ['education', 'learn', 'course', 'student', 'school', 'training', 'knowledge', 'academy'],
  ecommerce: ['shop', 'store', 'commerce', 'product', 'cart', 'order', 'inventory', 'retail'],
  social: ['social', 'community', 'network', 'connect', 'chat', 'message', 'friend', 'profile'],
  productivity: ['task', 'project', 'manage', 'track', 'workflow', 'productivity', 'organize', 'schedule'],
  nature: ['nature', 'eco', 'green', 'sustainable', 'environment', 'organic', 'plant', 'garden'],
  energy: ['energy', 'sport', 'fitness', 'active', 'workout', 'gym', 'performance', 'athlete'],
};

/**
 * Detect category from directive and planner output
 */
function detectCategory(directive: string, output: OaxeOutput): string {
  const text = `${directive} ${output.appName} ${output.elevatorPitch} ${output.brandDNA.positioning}`.toLowerCase();

  let bestCategory = 'technology'; // Default fallback
  let bestScore = 0;

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    let score = 0;
    for (const keyword of keywords) {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      const matches = text.match(regex);
      if (matches) {
        score += matches.length;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestCategory = category;
    }
  }

  return bestCategory;
}

/**
 * Detect mood from tone and category
 */
function detectMood(tone: string, category: string): string {
  const toneWords = tone.toLowerCase();

  if (toneWords.includes('playful') || toneWords.includes('fun')) return 'vibrant';
  if (toneWords.includes('serious') || toneWords.includes('formal')) return 'professional';
  if (toneWords.includes('warm') || toneWords.includes('friendly')) return 'friendly';
  if (toneWords.includes('minimal') || toneWords.includes('clean')) return 'minimal';
  if (toneWords.includes('bold') || toneWords.includes('vibrant')) return 'bold';
  if (toneWords.includes('calm') || toneWords.includes('peaceful')) return 'calm';

  return CATEGORY_MOOD_MAP[category] || 'professional';
}

/**
 * Generate Brand DNA from directive and planner output
 *
 * @param directive - Original user directive
 * @param output - Planner output with basic brandDNA
 */
export function generateBrandDNA(directive: string, output: OaxeOutput): BrandDNA {
  // Detect category from all available inputs
  const category = detectCategory(directive, output);

  // Detect mood from tone and category
  const mood = detectMood(output.brandDNA.tone, category);

  // Get archetype from category
  const archetype = CATEGORY_ARCHETYPE_MAP[category] || 'Creator';

  // Get colors from category
  const colors = CATEGORY_COLORS[category] || CATEGORY_COLORS.technology;

  // Get brand moments from category
  const moments = CATEGORY_BRAND_MOMENTS[category] || CATEGORY_BRAND_MOMENTS.technology;

  // Get guardrails from mood
  const guardrails = MOOD_GUARDRAILS[mood] || MOOD_GUARDRAILS.professional;

  // Build enhanced Brand DNA
  const brandDNA: BrandDNA = {
    // Core identity
    name: output.brandDNA.name || output.appName,
    tagline: output.elevatorPitch.split('.')[0] || `The ${category} platform you deserve`,
    category,

    // Brand personality
    mood,
    archetype,

    // Positioning
    positioning: {
      statement: output.brandDNA.positioning || `The definitive ${category} solution`,
      targetAudience: output.productSpec.personas[0] || `${category} professionals`,
      differentiator: `Thoughtfully designed for ${category} workflows`,
    },

    // Voice & Tone
    voice: {
      tone: output.brandDNA.tone || mood,
      style: mood === 'professional' ? 'clear and authoritative' : mood === 'friendly' ? 'warm and conversational' : 'focused and efficient',
      keywords: output.brandDNA.values.slice(0, 5),
    },

    // Visual identity
    visual: {
      primaryColor: colors.primary,
      colorPalette: colors.palette,
      aesthetic: CATEGORY_AESTHETIC_MAP[category] || 'modern and clean',
      iconStyle: CATEGORY_ICON_MAP[category] || 'outlined, balanced',
    },

    // Brand moments
    productBrandMoments: moments,

    // Values & guardrails
    values: output.brandDNA.values,
    guardrails,
  };

  // Validate against schema
  const result = BrandDNASchema.safeParse(brandDNA);
  if (!result.success) {
    console.warn('BrandDNA validation warnings:', result.error.errors);
  }

  return brandDNA;
}

/**
 * Get Brand DNA as JSON string for file persistence
 */
export function getBrandDNAAsJSON(brandDNA: BrandDNA): string {
  return JSON.stringify(brandDNA, null, 2);
}

/**
 * Export category detection for tokens integration
 */
export { detectCategory, detectMood };
