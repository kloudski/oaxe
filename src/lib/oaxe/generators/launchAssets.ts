import type { BrandDNA, OaxeOutput } from '../types';
import type { LaunchAssets } from './types';

/**
 * M6: Launch Assets Generator
 *
 * Generates coherent, brand-aligned launch assets from Brand DNA.
 * All assets feel like they were written by a strong human founder
 * who deeply understands the product.
 */

// ============================================================================
// M6.1: COPY QUALITY GATE - Linter & Repair
// ============================================================================

/**
 * Banned cliché/vague marketing phrases (case-insensitive)
 */
const BANNED_PHRASES: string[] = [
  'definitive',
  'revolutionary',
  'next-gen',
  'next gen',
  'modern',
  'seamless',
  'built for',
  'with clarity',
  'all-in-one',
  'all in one',
  'game-changer',
  'game changer',
  'best-in-class',
  'best in class',
  'powerful',
  'unlock',
  'supercharge',
  'leverage',
  'streamline',
  'optimize',
  'transform',
  'in minutes',
  'ai-powered',
  'ai powered',
  'cutting-edge',
  'cutting edge',
  'world-class',
  'world class',
  'industry-leading',
  'industry leading',
  'innovative',
  'disruptive',
  'synergy',
  'holistic',
  'paradigm',
  'empower',
  'elevate',
  'amplify',
];

/**
 * Abstract nouns that indicate vagueness when used without specifics
 */
const ABSTRACT_NOUNS: string[] = [
  'clarity',
  'solution',
  'workflow',
  'platform',
  'system',
  'experience',
  'journey',
  'insights',
  'efficiency',
  'productivity',
];

/**
 * Concrete workflow nouns by category
 */
const WORKFLOW_NOUNS: Record<string, string[]> = {
  legal: ['intake', 'matters', 'docket', 'deposition', 'retainer', 'billing', 'evidence', 'conflicts', 'deadlines', 'filings', 'clients', 'cases', 'documents', 'timelines', 'court dates'],
  wellness: ['habits', 'sessions', 'check-ins', 'streaks', 'routines', 'prompts', 'reflections', 'breathing', 'meditation', 'journaling', 'goals', 'progress', 'reminders', 'rituals'],
  social: ['profiles', 'posts', 'messages', 'groups', 'invites', 'feed', 'reactions', 'moderation', 'comments', 'followers', 'threads', 'notifications', 'connections'],
  finance: ['invoices', 'reconciliation', 'ledger', 'payouts', 'approvals', 'reporting', 'cashflow', 'spend', 'budgets', 'expenses', 'transactions', 'accounts', 'forecasts'],
  technology: ['incidents', 'deploys', 'logs', 'traces', 'runbooks', 'pipelines', 'permissions', 'environments', 'endpoints', 'services', 'alerts', 'metrics', 'configs'],
  healthcare: ['patients', 'appointments', 'charts', 'prescriptions', 'labs', 'vitals', 'referrals', 'diagnoses', 'records', 'care plans', 'visits', 'orders'],
  creative: ['projects', 'assets', 'drafts', 'versions', 'feedback', 'briefs', 'deliverables', 'proofs', 'revisions', 'files', 'boards', 'timelines'],
  education: ['courses', 'lessons', 'assignments', 'grades', 'quizzes', 'progress', 'students', 'materials', 'schedules', 'submissions', 'feedback'],
  ecommerce: ['orders', 'inventory', 'products', 'customers', 'shipments', 'returns', 'catalogs', 'pricing', 'carts', 'checkout', 'fulfillment'],
  productivity: ['tasks', 'projects', 'deadlines', 'milestones', 'priorities', 'notes', 'calendars', 'meetings', 'reminders', 'checklists', 'goals'],
  nature: ['plants', 'collections', 'logs', 'observations', 'species', 'growth', 'seasons', 'habitats', 'records', 'photos', 'locations'],
  energy: ['workouts', 'training', 'metrics', 'sets', 'reps', 'sessions', 'progress', 'PRs', 'programs', 'recovery', 'nutrition', 'splits'],
};

/**
 * Generic fallback workflow nouns
 */
const FALLBACK_WORKFLOW_NOUNS: string[] = [
  'tasks', 'records', 'entries', 'items', 'data', 'history', 'lists', 'reports', 'updates', 'statuses',
];

/**
 * Concrete pain phrases (category-agnostic)
 */
const PAIN_PHRASES: string[] = [
  'missed deadlines',
  'duplicate entry',
  'status chasing',
  'lost context',
  'messy handoffs',
  'scattered notes',
  'broken reporting',
  'manual follow-ups',
  'slow approvals',
  'inconsistent process',
  'endless tabs',
  'copy-paste errors',
  'version confusion',
  'dropped balls',
  'forgotten tasks',
  'unclear ownership',
  'siloed data',
  'outdated info',
  'approval delays',
  'tracking chaos',
];

/**
 * Mechanism phrases that indicate specificity
 */
const MECHANISM_PHRASES: string[] = [
  'in one view',
  'single timeline',
  'one place',
  'auto-generated',
  'structured',
  'from intake to',
  'one-click',
  'audit-ready',
  'templated',
  'pre-filled',
  'organized by',
  'built around',
  'linked to',
  'tracked by',
  'grouped by',
  'filtered by',
  'sorted by',
  'synced with',
  'tied to',
  'connected to',
];

interface LintResult {
  ok: boolean;
  violations: string[];
}

/**
 * M6.1: Lint copy for clichés and vague language
 */
function lintCopy(text: string): LintResult {
  const violations: string[] = [];
  const lowerText = text.toLowerCase();

  // Check for banned phrases
  for (const phrase of BANNED_PHRASES) {
    if (lowerText.includes(phrase.toLowerCase())) {
      violations.push(`Banned phrase: "${phrase}"`);
    }
  }

  // Check for excessive abstraction (abstract nouns without concrete specifics)
  let abstractCount = 0;
  for (const noun of ABSTRACT_NOUNS) {
    if (lowerText.includes(noun.toLowerCase())) {
      abstractCount++;
    }
  }
  if (abstractCount >= 2) {
    violations.push(`Excessive abstraction: ${abstractCount} vague nouns without concrete specifics`);
  }

  return {
    ok: violations.length === 0,
    violations,
  };
}

interface SpecResult {
  ok: boolean;
  missing: string[];
  found: {
    workflowNouns: string[];
    pains: string[];
    mechanisms: string[];
  };
}

/**
 * M6.1: Check specificity requirements
 * Requires: 2+ workflow nouns, 1+ pain, 1+ mechanism
 */
function checkSpecificity(text: string, category: string): SpecResult {
  const lowerText = text.toLowerCase();
  const missing: string[] = [];

  // Get category-specific nouns + fallback
  const categoryNouns = WORKFLOW_NOUNS[category] || [];
  const allNouns = [...categoryNouns, ...FALLBACK_WORKFLOW_NOUNS];

  // Find workflow nouns
  const foundNouns: string[] = [];
  for (const noun of allNouns) {
    if (lowerText.includes(noun.toLowerCase())) {
      foundNouns.push(noun);
    }
  }
  if (foundNouns.length < 2) {
    missing.push(`Need 2+ workflow nouns (found ${foundNouns.length})`);
  }

  // Find pain phrases
  const foundPains: string[] = [];
  for (const pain of PAIN_PHRASES) {
    if (lowerText.includes(pain.toLowerCase())) {
      foundPains.push(pain);
    }
  }
  if (foundPains.length < 1) {
    missing.push('Need 1+ concrete pain phrase');
  }

  // Find mechanism phrases
  const foundMechanisms: string[] = [];
  for (const mech of MECHANISM_PHRASES) {
    if (lowerText.includes(mech.toLowerCase())) {
      foundMechanisms.push(mech);
    }
  }
  if (foundMechanisms.length < 1) {
    missing.push('Need 1+ mechanism phrase');
  }

  return {
    ok: missing.length === 0,
    missing,
    found: {
      workflowNouns: foundNouns,
      pains: foundPains,
      mechanisms: foundMechanisms,
    },
  };
}

/**
 * Replacement map for banned phrases -> specific alternatives
 */
const PHRASE_REPLACEMENTS: Record<string, string[]> = {
  'with clarity': ['in one view', 'organized by status', 'in a single timeline'],
  'all-in-one': ['everything from intake to completion', 'all your {noun} in one place'],
  'all in one': ['everything from intake to completion', 'all your {noun} in one place'],
  'seamless': ['connected', 'linked', 'synced'],
  'powerful': ['structured', 'organized', 'audit-ready'],
  'modern': ['built around', 'organized by', 'structured'],
  'streamline': ['organize', 'track', 'manage'],
  'optimize': ['improve', 'fix', 'structure'],
  'transform': ['organize', 'structure', 'connect'],
  'unlock': ['access', 'see', 'track'],
  'leverage': ['use', 'apply', 'work with'],
  'built for': ['designed around', 'structured for', 'organized for'],
  'innovative': ['structured', 'organized', 'connected'],
  'revolutionary': ['organized', 'structured', 'clear'],
  'next-gen': ['organized', 'structured', 'connected'],
  'next gen': ['organized', 'structured', 'connected'],
  'game-changer': ['a better way to track', 'a clearer way to manage'],
  'game changer': ['a better way to track', 'a clearer way to manage'],
  'best-in-class': ['structured', 'organized', 'clear'],
  'best in class': ['structured', 'organized', 'clear'],
  'supercharge': ['speed up', 'improve', 'fix'],
  'empower': ['help', 'let', 'enable'],
  'elevate': ['improve', 'organize', 'structure'],
  'amplify': ['increase', 'improve', 'boost'],
};

interface RepairContext {
  category: string;
  appName: string;
  primaryEntity?: string;
}

/**
 * M6.1: Deterministic copy repair
 * Replaces banned phrases and injects missing specifics
 */
function repairCopy(text: string, context: RepairContext): string {
  let result = text;
  const { category, primaryEntity } = context;

  // Get category-specific nouns
  const categoryNouns = WORKFLOW_NOUNS[category] || FALLBACK_WORKFLOW_NOUNS;
  const primaryNoun = primaryEntity || categoryNouns[0] || 'records';

  // Replace banned phrases with specific alternatives
  for (const [phrase, replacements] of Object.entries(PHRASE_REPLACEMENTS)) {
    const regex = new RegExp(phrase, 'gi');
    if (regex.test(result)) {
      // Pick first replacement and substitute {noun}
      const replacement = replacements[0].replace('{noun}', primaryNoun);
      result = result.replace(regex, replacement);
    }
  }

  // Remove remaining banned phrases that weren't replaced
  for (const phrase of BANNED_PHRASES) {
    const regex = new RegExp(`\\b${phrase}\\b`, 'gi');
    result = result.replace(regex, '');
  }

  // Clean up double spaces and trim
  result = result.replace(/\s+/g, ' ').trim();

  return result;
}

/**
 * M6.1: Generate specific subheadline with workflow nouns, pain, and mechanism
 */
function generateSpecificSubheadline(category: string, primaryEntity: string): string {
  const categoryNouns = WORKFLOW_NOUNS[category] || FALLBACK_WORKFLOW_NOUNS;
  const noun1 = categoryNouns[0] || 'records';
  const noun2 = categoryNouns[1] || 'updates';
  const noun3 = categoryNouns[2] || 'history';

  // Category-specific templates with pain + mechanism
  const templates: Record<string, string> = {
    legal: `${capitalize(noun1)}, ${noun2}, and ${noun3} in one view—no more scattered notes or missed deadlines.`,
    finance: `${capitalize(noun1)}, ${noun2}, and ${noun3} organized by status—end duplicate entry and manual follow-ups.`,
    wellness: `${capitalize(noun1)}, ${noun2}, and ${noun3} tracked in a single timeline—no more lost context.`,
    healthcare: `${capitalize(noun1)}, ${noun2}, and ${noun3} linked to each patient—stop status chasing.`,
    technology: `${capitalize(noun1)}, ${noun2}, and ${noun3} in one place—no more messy handoffs or tracking chaos.`,
    creative: `${capitalize(noun1)}, ${noun2}, and ${noun3} organized by project—end version confusion.`,
    education: `${capitalize(noun1)}, ${noun2}, and ${noun3} in a single timeline—no more scattered notes.`,
    ecommerce: `${capitalize(noun1)}, ${noun2}, and ${noun3} linked to each order—stop status chasing.`,
    social: `${capitalize(noun1)}, ${noun2}, and ${noun3} in one view—no more endless tabs.`,
    productivity: `${capitalize(noun1)}, ${noun2}, and ${noun3} organized by priority—end dropped balls.`,
    nature: `${capitalize(noun1)}, ${noun2}, and ${noun3} tracked by season—no more lost context.`,
    energy: `${capitalize(noun1)}, ${noun2}, and ${noun3} in a single timeline—stop tracking chaos.`,
  };

  return templates[category] || `${capitalize(noun1)}, ${noun2}, and ${noun3} in one place—no more lost context.`;
}

/**
 * M6.1: Generate specific bullet with workflow noun and mechanism
 */
function generateSpecificBullet(category: string, index: number): string {
  const categoryNouns = WORKFLOW_NOUNS[category] || FALLBACK_WORKFLOW_NOUNS;
  const mechanisms = ['in one view', 'auto-generated', 'organized by status', 'in a single timeline', 'linked to'];

  const noun = categoryNouns[index % categoryNouns.length] || 'records';
  const mechanism = mechanisms[index % mechanisms.length];

  return `${capitalize(noun)} ${mechanism}`;
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/**
 * M6.1: Validate and repair hero copy block
 * Returns repaired copy and any unresolved warnings
 */
function validateAndRepairHeroCopy(
  heroCopy: { headline: string; subheadline: string; bullets: string[] },
  context: RepairContext,
  maxPasses: number = 3
): { repaired: { headline: string; subheadline: string; bullets: string[] }; warnings: string[] } {
  const warnings: string[] = [];
  let current = { ...heroCopy, bullets: [...heroCopy.bullets] };

  for (let pass = 0; pass < maxPasses; pass++) {
    // Combine all hero copy for checking
    const combinedText = `${current.headline} ${current.subheadline} ${current.bullets.join(' ')}`;

    // Run lint
    const lintResult = lintCopy(combinedText);

    // Run spec check
    const specResult = checkSpecificity(combinedText, context.category);

    // If all good, return
    if (lintResult.ok && specResult.ok) {
      return { repaired: current, warnings: [] };
    }

    // Repair: replace banned phrases
    current.headline = repairCopy(current.headline, context);
    current.subheadline = repairCopy(current.subheadline, context);
    current.bullets = current.bullets.map(b => repairCopy(b, context));

    // If spec still failing after lint repair, inject specifics
    const postRepairSpec = checkSpecificity(
      `${current.headline} ${current.subheadline} ${current.bullets.join(' ')}`,
      context.category
    );

    if (!postRepairSpec.ok) {
      // Replace subheadline with specific one
      if (postRepairSpec.found.workflowNouns.length < 2 || postRepairSpec.found.pains.length < 1) {
        current.subheadline = generateSpecificSubheadline(context.category, context.primaryEntity || '');
      }

      // Inject mechanism into first bullet if missing
      if (postRepairSpec.found.mechanisms.length < 1 && current.bullets.length > 0) {
        current.bullets[0] = generateSpecificBullet(context.category, 0);
      }
    }
  }

  // After max passes, collect remaining warnings
  const finalText = `${current.headline} ${current.subheadline} ${current.bullets.join(' ')}`;
  const finalLint = lintCopy(finalText);
  const finalSpec = checkSpecificity(finalText, context.category);

  if (!finalLint.ok) {
    warnings.push(...finalLint.violations);
  }
  if (!finalSpec.ok) {
    warnings.push(...finalSpec.missing);
  }

  // Enforce headline word limit (8 words)
  const headlineWords = current.headline.split(/\s+/);
  if (headlineWords.length > 8) {
    current.headline = headlineWords.slice(0, 8).join(' ');
  }

  return { repaired: current, warnings };
}

/**
 * M6.1: Validate and repair pinned tweet
 */
function validateAndRepairPinnedTweet(
  pinnedTweet: string,
  context: RepairContext,
  maxPasses: number = 3
): { repaired: string; warnings: string[] } {
  const warnings: string[] = [];
  let current = pinnedTweet;

  for (let pass = 0; pass < maxPasses; pass++) {
    const lintResult = lintCopy(current);
    const specResult = checkSpecificity(current, context.category);

    if (lintResult.ok && specResult.ok) {
      return { repaired: current, warnings: [] };
    }

    // Repair banned phrases
    current = repairCopy(current, context);

    // If still missing specifics, rebuild with specifics
    const postRepairSpec = checkSpecificity(current, context.category);
    if (!postRepairSpec.ok) {
      const categoryNouns = WORKFLOW_NOUNS[context.category] || FALLBACK_WORKFLOW_NOUNS;
      const noun1 = categoryNouns[0] || 'records';
      const noun2 = categoryNouns[1] || 'updates';
      // Rebuild: AppName + concrete nouns + mechanism + pain
      current = `${context.appName}: ${capitalize(noun1)} and ${noun2} in one view—no more missed deadlines or lost context.`;
    }
  }

  // Collect final warnings
  const finalLint = lintCopy(current);
  const finalSpec = checkSpecificity(current, context.category);

  if (!finalLint.ok) {
    warnings.push(...finalLint.violations.map(v => `Pinned tweet: ${v}`));
  }
  if (!finalSpec.ok) {
    warnings.push(...finalSpec.missing.map(m => `Pinned tweet: ${m}`));
  }

  return { repaired: current, warnings };
}

/**
 * M6.1: Validate and repair Product Hunt tagline (60 chars max)
 */
function validateAndRepairTagline(
  tagline: string,
  context: RepairContext,
  maxPasses: number = 3
): { repaired: string; warnings: string[] } {
  const warnings: string[] = [];
  let current = tagline;

  for (let pass = 0; pass < maxPasses; pass++) {
    const lintResult = lintCopy(current);

    if (lintResult.ok && current.length <= 60) {
      return { repaired: current, warnings: [] };
    }

    // Repair banned phrases
    current = repairCopy(current, context);

    // If still has banned phrases or too long, rebuild
    const postLint = lintCopy(current);
    if (!postLint.ok || current.length > 60) {
      const categoryNouns = WORKFLOW_NOUNS[context.category] || FALLBACK_WORKFLOW_NOUNS;
      const noun1 = categoryNouns[0] || 'records';
      const noun2 = categoryNouns[1] || 'updates';
      current = `${capitalize(noun1)} and ${noun2} in one view`;
    }
  }

  // Enforce 60 char limit
  if (current.length > 60) {
    current = current.substring(0, 57) + '...';
  }

  const finalLint = lintCopy(current);
  if (!finalLint.ok) {
    warnings.push(...finalLint.violations.map(v => `Tagline: ${v}`));
  }

  return { repaired: current, warnings };
}

// ============================================================================
// FOUNDER TWEET GENERATION
// ============================================================================

type TweetStyle = 'insight' | 'problem' | 'solution' | 'why' | 'vision';

/**
 * Generate a founder tweet based on style and Brand DNA
 */
function generateTweetByStyle(
  style: TweetStyle,
  brandDNA: BrandDNA,
  output: OaxeOutput
): string {
  const { positioning, voice, category, archetype } = brandDNA;
  const appName = output.appName;

  // Tone modifiers based on voice
  const isMinimal = voice.tone === 'minimal' || voice.style.includes('concise');
  const isWarm = voice.tone === 'warm' || voice.tone === 'friendly';
  const isAuthoritative = voice.tone === 'authoritative' || archetype === 'Ruler' || archetype === 'Sage';

  switch (style) {
    case 'insight': {
      // Share an industry insight
      const insights: Record<string, string> = {
        legal: 'Most legal tech tries to automate lawyers. We think the better approach is to give them better tools.',
        finance: 'Financial software shouldn\'t require a finance degree to use. That was the bar we set.',
        healthcare: 'Healthcare tools often forget they\'re serving people, not just patients. We built differently.',
        wellness: 'Wellness apps love gamification. We think real progress doesn\'t need streaks.',
        technology: 'Developer tools are often built by developers who forgot what it\'s like to learn.',
        creative: 'Creative tools should get out of the way. The best software is invisible.',
        education: 'Learning platforms optimize for engagement. We optimize for understanding.',
        ecommerce: 'E-commerce software focuses on conversion. We focus on the entire customer relationship.',
        social: 'Social platforms measure success in time spent. We measure it in connections made.',
        productivity: 'Productivity software promises more. We think you should need less.',
        nature: 'Tech and nature aren\'t opposites. They should work together.',
        energy: 'Fitness apps track everything. We think what matters is what you actually do with it.',
      };
      return insights[category] || `Building ${appName} taught us that the obvious approach is rarely the right one.`;
    }

    case 'problem': {
      // Articulate the problem being solved
      const problems: Record<string, string> = {
        legal: 'Spent years watching firms drown in paper and outdated systems. Built what I wished existed.',
        finance: 'Watched too many teams struggle with tools that should be simple. Had to fix it.',
        healthcare: 'The gap between what healthcare workers need and what they get is absurd. We\'re closing it.',
        wellness: 'Tried every wellness app. They all felt like homework. Started building something different.',
        technology: 'Every time I needed to do this, I wasted hours on setup. Never again.',
        creative: 'Creative work shouldn\'t be interrupted by administrative friction. Period.',
        education: 'Learning something new shouldn\'t feel like fighting the tool. That frustration led here.',
        ecommerce: 'Ran my own store. The software was the hardest part. That\'s backwards.',
        social: 'Connection shouldn\'t require algorithms. Just people and good tools.',
        productivity: 'The irony of productivity software making you less productive was too much.',
        nature: 'Technology should bring us closer to what matters, not further away.',
        energy: 'Training shouldn\'t require a spreadsheet habit. Built what athletes actually need.',
      };
      return problems[category] || `The existing options felt like they were built for a different use case entirely.`;
    }

    case 'solution': {
      // Describe the solution briefly
      if (isMinimal) {
        return `${appName}: ${positioning.differentiator}`;
      }
      if (isWarm) {
        return `${appName} is what happens when you actually listen to ${positioning.targetAudience}.`;
      }
      return `Built ${appName} to do one thing well: ${positioning.differentiator.toLowerCase()}.`;
    }

    case 'why': {
      // Explain the motivation
      const whys: Record<string, string[]> = {
        Sage: [
          'There\'s a better way to do this. We found it.',
          'Knowledge should compound, not scatter.',
        ],
        Hero: [
          'Because settling for "good enough" isn\'t in the plan.',
          'Built this to help people take real action.',
        ],
        Creator: [
          'Creativity deserves better tools.',
          'Made this because the alternatives felt lifeless.',
        ],
        Caregiver: [
          'People deserve software that actually helps.',
          'Built with care, for people who care.',
        ],
        Ruler: [
          'Excellence requires the right foundation.',
          'Control shouldn\'t require complexity.',
        ],
        Everyman: [
          'Everyone deserves tools that just work.',
          'Built for people like us.',
        ],
        Magician: [
          'The right tool changes everything.',
          'Built to make hard things feel natural.',
        ],
        Innocent: [
          'Simple is powerful.',
          'Complexity is a choice. We chose differently.',
        ],
        Explorer: [
          'New territory needs new tools.',
          'Built for people who don\'t follow the map.',
        ],
        Outlaw: [
          'The status quo needed disrupting.',
          'If no one\'s going to fix it, we will.',
        ],
      };
      const archetypeWhys = whys[archetype] || whys.Creator;
      return archetypeWhys[Math.floor(Math.random() * archetypeWhys.length)];
    }

    case 'vision': {
      // Share the bigger picture
      if (isAuthoritative) {
        return `${appName} is the foundation. What we\'re building next is even more important.`;
      }
      if (isWarm) {
        return `This is just the beginning. Excited for what\'s coming.`;
      }
      return `${appName} is step one. The roadmap gets interesting from here.`;
    }
  }
}

/**
 * Generate 3-5 founder tweets
 * Written in first person, short, confident, non-hype
 */
function generateFounderTweets(brandDNA: BrandDNA, output: OaxeOutput): string[] {
  const tweets: string[] = [];

  // Always include these core styles
  const coreStyles: TweetStyle[] = ['problem', 'solution', 'why'];
  for (const style of coreStyles) {
    tweets.push(generateTweetByStyle(style, brandDNA, output));
  }

  // Add 1-2 additional tweets based on archetype
  const { archetype, mood } = brandDNA;

  if (archetype === 'Sage' || archetype === 'Creator') {
    tweets.push(generateTweetByStyle('insight', brandDNA, output));
  }

  if (mood !== 'minimal' && tweets.length < 5) {
    tweets.push(generateTweetByStyle('vision', brandDNA, output));
  }

  return tweets;
}

/**
 * Generate the pinned tweet
 * Clearly explains: what the product is, who it's for, why it exists
 */
function generatePinnedTweet(brandDNA: BrandDNA, output: OaxeOutput): string {
  const { positioning, voice } = brandDNA;
  const appName = output.appName;

  // Structure: [What] for [Who]. [Why].
  const what = positioning.statement.split('.')[0] || `${appName} is ${positioning.differentiator.toLowerCase()}`;
  const who = positioning.targetAudience;
  const why = positioning.differentiator;

  // Tone-appropriate connectors
  const isMinimal = voice.tone === 'minimal' || voice.style.includes('concise');

  if (isMinimal) {
    return `${appName}: ${why}. Built for ${who.toLowerCase()}.`;
  }

  return `${appName} is ${what.toLowerCase().replace(appName.toLowerCase() + ' is ', '')} for ${who.toLowerCase()}. ${why}.`;
}

// ============================================================================
// HERO COPY GENERATION
// ============================================================================

interface HeroCopy {
  headline: string;
  subheadline: string;
  bullets: string[];
}

/**
 * Generate hero copy block
 * - Headline: 8 words max
 * - Subheadline: 1 sentence
 * - Bullets: 2-3 max
 */
function generateHeroCopy(brandDNA: BrandDNA, output: OaxeOutput): HeroCopy {
  const { positioning, voice, archetype, mood, category } = brandDNA;
  const appName = output.appName;

  // Generate headline based on archetype (8 words max)
  const headlines: Record<string, string[]> = {
    Sage: [
      `The ${category} knowledge you need`,
      `Clarity for ${category} professionals`,
      `${appName}: Know what matters`,
    ],
    Hero: [
      `Get things done with ${appName}`,
      `Built for action`,
      `Ship faster with ${appName}`,
    ],
    Creator: [
      `Create without limits`,
      `${appName}: Where ideas become real`,
      `Design. Build. Launch.`,
    ],
    Caregiver: [
      `${category} software that cares`,
      `We handle the complexity`,
      `Built to help you help others`,
    ],
    Ruler: [
      `Control your ${category} workflow`,
      `${appName}: Command and clarity`,
      `Master your domain`,
    ],
    Everyman: [
      `${category} tools for everyone`,
      `Simple. Reliable. Yours.`,
      `${appName} just works`,
    ],
    Magician: [
      `Transform how you work`,
      `${appName}: The modern way`,
      `What was hard is now easy`,
    ],
    Innocent: [
      `${category} made simple`,
      `Less is more`,
      `Start here`,
    ],
    Explorer: [
      `Discover better ${category} tools`,
      `Go further with ${appName}`,
      `New territory, new tools`,
    ],
    Outlaw: [
      `${category} software, reinvented`,
      `Break the mold`,
      `Not your typical ${category} tool`,
    ],
  };

  const archetypeHeadlines = headlines[archetype] || headlines.Creator;
  let headline = archetypeHeadlines[0];

  // Trim to 8 words
  const words = headline.split(' ');
  if (words.length > 8) {
    headline = words.slice(0, 8).join(' ');
  }

  // Generate subheadline (1 sentence)
  let subheadline: string;
  if (mood === 'minimal') {
    subheadline = positioning.differentiator + '.';
  } else if (mood === 'professional') {
    subheadline = `${appName} helps ${positioning.targetAudience.toLowerCase()} ${positioning.differentiator.toLowerCase()}.`;
  } else {
    subheadline = `${positioning.statement}`;
  }

  // Ensure subheadline ends with period
  if (!subheadline.endsWith('.') && !subheadline.endsWith('!') && !subheadline.endsWith('?')) {
    subheadline += '.';
  }

  // Generate 2-3 bullets from core features
  const bullets: string[] = [];
  const features = output.productSpec.coreFeatures.slice(0, 3);

  for (const feature of features) {
    // Convert feature to benefit-oriented copy
    const cleanFeature = feature.replace(/^(Supports?|Provides?|Enables?|Allows?|Includes?)\s+/i, '');
    const capitalizedFeature = cleanFeature.charAt(0).toUpperCase() + cleanFeature.slice(1);

    if (mood === 'minimal') {
      bullets.push(capitalizedFeature);
    } else {
      // Add action-oriented prefix based on archetype
      const prefixes: Record<string, string> = {
        Hero: 'Achieve ',
        Creator: 'Create ',
        Sage: 'Understand ',
        Caregiver: 'Simplify ',
        Ruler: 'Control ',
        Magician: 'Transform ',
        default: '',
      };
      const prefix = prefixes[archetype] || prefixes.default;
      bullets.push(`${prefix}${cleanFeature.toLowerCase()}`);
    }
  }

  return { headline, subheadline, bullets };
}

// ============================================================================
// SCREENSHOT SPEC GENERATION
// ============================================================================

interface ScreenshotSpec {
  heroScreenshot: {
    screen: string;
    rationale: string;
    copyOverlay?: string;
  };
  supportingScreenshots: {
    screen: string;
    communicates: string;
    copyOverlay?: string;
  }[];
}

/**
 * Generate screenshot specification
 * Not images - structured spec for what to capture
 */
function generateScreenshotSpec(brandDNA: BrandDNA, output: OaxeOutput): ScreenshotSpec {
  const { category, mood, archetype } = brandDNA;
  const entities = output.entities;
  const primaryEntity = entities[0]?.name || 'dashboard';

  // Determine hero screen based on category
  const heroScreens: Record<string, { screen: string; rationale: string }> = {
    legal: { screen: 'Case detail view with matter timeline', rationale: 'Shows depth and organization' },
    finance: { screen: 'Dashboard with key metrics and charts', rationale: 'Demonstrates data clarity' },
    healthcare: { screen: 'Patient overview with care plan', rationale: 'Shows holistic care approach' },
    wellness: { screen: 'Daily ritual tracker with progress', rationale: 'Emphasizes personal journey' },
    technology: { screen: 'Main workspace with active project', rationale: 'Shows developer experience' },
    creative: { screen: 'Canvas or project board with work', rationale: 'Demonstrates creative flow' },
    education: { screen: 'Learning path with progress indicators', rationale: 'Shows structured learning' },
    ecommerce: { screen: 'Product catalog with filters', rationale: 'Demonstrates product discovery' },
    social: { screen: 'Feed or community view with activity', rationale: 'Shows community engagement' },
    productivity: { screen: 'Task board or list with priorities', rationale: 'Demonstrates organization' },
    nature: { screen: 'Collection or tracker with growth data', rationale: 'Shows nurturing aspect' },
    energy: { screen: 'Performance dashboard with metrics', rationale: 'Demonstrates achievement tracking' },
  };

  const heroConfig = heroScreens[category] || {
    screen: `${primaryEntity} list view with sample data`,
    rationale: 'Shows core functionality clearly',
  };

  // Generate supporting screenshots (2-3)
  const supportingScreenshots: ScreenshotSpec['supportingScreenshots'] = [];

  // Screenshot 2: Form/creation view
  supportingScreenshots.push({
    screen: `Create new ${primaryEntity} form`,
    communicates: 'Easy onboarding and data entry',
    copyOverlay: mood !== 'minimal' ? `Add your first ${primaryEntity}` : undefined,
  });

  // Screenshot 3: Detail view
  if (entities.length > 0) {
    supportingScreenshots.push({
      screen: `${primaryEntity} detail view with full information`,
      communicates: 'Data richness and organization',
    });
  }

  // Screenshot 4 (optional): Settings or secondary entity
  if (entities.length > 1) {
    const secondaryEntity = entities[1].name;
    supportingScreenshots.push({
      screen: `${secondaryEntity} list or settings view`,
      communicates: 'Configurability and depth',
    });
  }

  // Add copy overlay to hero based on archetype
  let heroOverlay: string | undefined;
  if (mood !== 'minimal') {
    const overlays: Record<string, string> = {
      Sage: 'Everything you need to know',
      Hero: 'Built for action',
      Creator: 'Where work happens',
      Caregiver: 'We take care of the details',
      Ruler: 'Command and control',
    };
    heroOverlay = overlays[archetype];
  }

  return {
    heroScreenshot: {
      ...heroConfig,
      copyOverlay: heroOverlay,
    },
    supportingScreenshots: supportingScreenshots.slice(0, 3),
  };
}

// ============================================================================
// PRODUCT HUNT TAGLINE GENERATION
// ============================================================================

/**
 * Generate Product Hunt tagline
 * - 60 characters max
 * - Clear, literal, differentiated
 * - No fluff
 */
function generateProductHuntTagline(brandDNA: BrandDNA, output: OaxeOutput): string {
  const { positioning, category, mood } = brandDNA;
  const appName = output.appName;

  // Start with the differentiator
  const differentiator = positioning.differentiator;

  // Create variations and pick the best fit
  const variations: string[] = [];

  // Variation 1: Simple statement
  variations.push(`${differentiator}`);

  // Variation 2: "X for Y" format
  const audience = positioning.targetAudience.toLowerCase();
  variations.push(`${category} software for ${audience}`);

  // Variation 3: Action-oriented
  const actionFormats: Record<string, string> = {
    legal: `Manage legal work with clarity`,
    finance: `Financial clarity, simplified`,
    healthcare: `Healthcare tools that care`,
    wellness: `Your wellness, your way`,
    technology: `Build better, ship faster`,
    creative: `Create without friction`,
    education: `Learn on your terms`,
    ecommerce: `Sell smarter, not harder`,
    social: `Connect authentically`,
    productivity: `Do more with less`,
    nature: `Grow with intention`,
    energy: `Track what matters`,
  };
  variations.push(actionFormats[category] || differentiator);

  // Pick the best one that fits in 60 chars
  let tagline = variations[0];
  for (const v of variations) {
    if (v.length <= 60 && v.length > tagline.length) {
      tagline = v;
    }
    if (v.length <= 55) {
      tagline = v;
      break;
    }
  }

  // Ensure under 60 chars
  if (tagline.length > 60) {
    tagline = tagline.substring(0, 57) + '...';
  }

  return tagline;
}

// ============================================================================
// MAIN GENERATOR
// ============================================================================

/**
 * Generate all launch assets from Brand DNA
 * Called after M5A in the planner pipeline
 *
 * M6.1: Applies quality gate with lint/spec checks and deterministic repair
 */
export function generateLaunchAssets(brandDNA: BrandDNA, output: OaxeOutput): LaunchAssets {
  const qualityWarnings: string[] = [];

  // Build repair context
  const context: RepairContext = {
    category: brandDNA.category,
    appName: output.appName,
    primaryEntity: output.entities[0]?.name,
  };

  // Generate initial assets
  const founderTweets = generateFounderTweets(brandDNA, output);
  const initialPinnedTweet = generatePinnedTweet(brandDNA, output);
  const initialHeroCopy = generateHeroCopy(brandDNA, output);
  const screenshotSpec = generateScreenshotSpec(brandDNA, output);
  const initialTagline = generateProductHuntTagline(brandDNA, output);

  // M6.1: Apply quality gate to pinned tweet
  const pinnedResult = validateAndRepairPinnedTweet(initialPinnedTweet, context);
  qualityWarnings.push(...pinnedResult.warnings);

  // M6.1: Apply quality gate to hero copy
  const heroResult = validateAndRepairHeroCopy(initialHeroCopy, context);
  qualityWarnings.push(...heroResult.warnings);

  // M6.1: Apply quality gate to tagline
  const taglineResult = validateAndRepairTagline(initialTagline, context);
  qualityWarnings.push(...taglineResult.warnings);

  const result: LaunchAssets = {
    founderTweets,
    pinnedTweet: pinnedResult.repaired,
    heroCopy: heroResult.repaired,
    screenshotSpec,
    productHuntTagline: taglineResult.repaired,
    generatedAt: new Date().toISOString(),
  };

  // Only include warnings if there are any
  if (qualityWarnings.length > 0) {
    result.qualityWarnings = qualityWarnings;
  }

  return result;
}

// ============================================================================
// LAUNCH PLAYBOOK MARKDOWN GENERATION
// ============================================================================

/**
 * Generate launch-playbook.md content from LaunchAssets
 */
export function generateLaunchPlaybookMarkdown(
  assets: LaunchAssets,
  brandDNA: BrandDNA,
  output: OaxeOutput
): string {
  const { founderTweets, pinnedTweet, heroCopy, screenshotSpec, productHuntTagline } = assets;
  const appName = output.appName;

  return `# ${appName} Launch Playbook

Generated: ${new Date().toISOString()}
Brand: ${brandDNA.category} / ${brandDNA.mood} / ${brandDNA.archetype}

---

## Pinned Tweet

> ${pinnedTweet}

---

## Founder Tweets

Use these for launch day and the following week. Written in first person, from the founder's perspective.

${founderTweets.map((tweet, i) => `### Tweet ${i + 1}\n\n> ${tweet}`).join('\n\n')}

---

## Hero Copy

For landing page, Product Hunt, and marketing materials.

### Headline
**${heroCopy.headline}**

### Subheadline
${heroCopy.subheadline}

### Key Benefits
${heroCopy.bullets.map(b => `- ${b}`).join('\n')}

---

## Screenshot Specification

### Hero Screenshot
- **Screen:** ${screenshotSpec.heroScreenshot.screen}
- **Rationale:** ${screenshotSpec.heroScreenshot.rationale}
${screenshotSpec.heroScreenshot.copyOverlay ? `- **Overlay Copy:** "${screenshotSpec.heroScreenshot.copyOverlay}"` : ''}

### Supporting Screenshots
${screenshotSpec.supportingScreenshots.map((ss, i) => `
#### Screenshot ${i + 2}
- **Screen:** ${ss.screen}
- **Communicates:** ${ss.communicates}
${ss.copyOverlay ? `- **Overlay Copy:** "${ss.copyOverlay}"` : ''}`).join('\n')}

---

## Product Hunt

### Tagline (60 chars max)
> ${productHuntTagline}

Character count: ${productHuntTagline.length}/60

---

## Brand Alignment Notes

- **Category:** ${brandDNA.category}
- **Mood:** ${brandDNA.mood}
- **Archetype:** ${brandDNA.archetype}
- **Voice Tone:** ${brandDNA.voice.tone}
- **Target Audience:** ${brandDNA.positioning.targetAudience}

### Voice Keywords
${brandDNA.voice.keywords.map(k => `- ${k}`).join('\n')}

### Do Say
${brandDNA.guardrails.doSay.map(d => `- "${d}"`).join('\n')}

### Don't Say
${brandDNA.guardrails.dontSay.map(d => `- "${d}"`).join('\n')}
${assets.qualityWarnings && assets.qualityWarnings.length > 0 ? `
---

## Quality Notes

The following quality checks could not be fully resolved after repair attempts:

${assets.qualityWarnings.map(w => `- ⚠️ ${w}`).join('\n')}

Consider manually reviewing and improving the flagged copy.
` : ''}
---

*Generated by Oaxe M6.1 Launch Assets Generator (with Quality Gate)*
`;
}
