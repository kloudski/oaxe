/**
 * M5B: Layout Grammar Generator
 *
 * Dynamically composes a LayoutGrammar from:
 * - Directive text
 * - Brand DNA (category, mood, archetype)
 * - Visual Signature (density, layout philosophy)
 * - Entities and their field structures
 *
 * The grammar determines structural layout decisions:
 * - Navigation pattern (sidebar/top/hybrid)
 * - Dashboard composition (grid/rail/stacked)
 * - Entity presentation modes (table/cards/kanban/timeline/feed)
 * - Create/details patterns (page/modal/drawer)
 */

import type { OaxeOutput, BrandDNA, LayoutGrammar, EntityViewConfig, DashboardBlock, NavPattern, DashboardLayout, EntityViewType, CreatePattern, DetailsPattern, DensityLevel, HierarchyStyle, InteractionModel } from '../types';

// ============================================================================
// DETERMINISTIC SEED GENERATION (FNV-1a)
// ============================================================================

/**
 * FNV-1a hash implementation (32-bit)
 * Reused from tokens.ts for consistency
 */
function fnv1a32(str: string): number {
  let hash = 0x811c9dc5; // FNV offset basis
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193); // FNV prime
  }
  return hash >>> 0; // Ensure positive 32-bit integer
}

/**
 * Generate a deterministic seed from directive and appName
 */
function generateLayoutSeed(directive: string, appName: string): number {
  const input = `layout::${directive.toLowerCase().trim()}::${appName.toLowerCase().trim()}`;
  return fnv1a32(input);
}

/**
 * Map a seed value to a range [min, max] deterministically
 */
function mapSeedToRange(seed: number, min: number, max: number, salt: number = 0): number {
  const mixed = fnv1a32(`${seed}:${salt}`);
  const normalized = (mixed % 10000) / 10000;
  return min + normalized * (max - min);
}

// ============================================================================
// WEIGHTED PICK - Deterministic selection from weighted options
// ============================================================================

interface WeightedOption<T> {
  value: T;
  weight: number;
}

/**
 * Deterministically select from weighted options using seed
 */
function weightedPick<T>(options: WeightedOption<T>[], seed: number, salt: number = 0): T {
  const totalWeight = options.reduce((sum, opt) => sum + opt.weight, 0);
  const threshold = mapSeedToRange(seed, 0, totalWeight, salt);

  let cumulative = 0;
  for (const option of options) {
    cumulative += option.weight;
    if (threshold <= cumulative) {
      return option.value;
    }
  }

  return options[options.length - 1].value;
}

// ============================================================================
// NAV PATTERN SELECTION
// ============================================================================

/**
 * Select navigation pattern based on category, entity count, and seed
 */
function selectNavPattern(
  category: string,
  entityCount: number,
  seed: number
): NavPattern {
  // Category-based weight adjustments
  const categoryBias: Record<string, NavPattern> = {
    legal: 'sidebar',
    finance: 'sidebar',
    healthcare: 'sidebar',
    technology: 'sidebar',
    productivity: 'sidebar',
    education: 'top',
    social: 'top',
    ecommerce: 'hybrid',
    creative: 'hybrid',
    wellness: 'top',
    nature: 'top',
    energy: 'hybrid',
  };

  const defaultPattern = categoryBias[category] || 'sidebar';

  // Entity count influences pattern
  // Many entities favor sidebar, few entities can use top
  if (entityCount >= 5) {
    return 'sidebar';
  }
  if (entityCount <= 2) {
    return weightedPick([
      { value: 'top' as const, weight: 4 },
      { value: 'sidebar' as const, weight: 3 },
      { value: 'hybrid' as const, weight: 3 },
    ], seed, 1);
  }

  // Use category default with some seed variance
  const options: WeightedOption<NavPattern>[] = [
    { value: defaultPattern, weight: 6 },
    { value: 'sidebar', weight: 2 },
    { value: 'top', weight: 1 },
    { value: 'hybrid', weight: 1 },
  ];

  return weightedPick(options, seed, 2);
}

// ============================================================================
// DASHBOARD LAYOUT SELECTION
// ============================================================================

/**
 * Select dashboard layout based on category, mood, and entity count
 */
function selectDashboardLayout(
  category: string,
  mood: string,
  entityCount: number,
  seed: number
): DashboardLayout {
  // Mood-driven layout preferences
  const moodLayouts: Record<string, DashboardLayout> = {
    minimal: 'stacked',
    calm: 'stacked',
    professional: 'grid',
    bold: 'rail',
    vibrant: 'grid',
    friendly: 'grid',
    elegant: 'stacked',
    serious: 'grid',
    playful: 'rail',
    warm: 'stacked',
  };

  // Category overrides
  const categoryLayouts: Record<string, DashboardLayout> = {
    finance: 'grid',
    legal: 'grid',
    healthcare: 'grid',
    social: 'rail',
    creative: 'rail',
    wellness: 'stacked',
  };

  const defaultLayout = categoryLayouts[category] || moodLayouts[mood] || 'grid';

  // Many entities favor grid layout
  if (entityCount >= 4) {
    return weightedPick([
      { value: 'grid' as const, weight: 7 },
      { value: 'rail' as const, weight: 2 },
      { value: 'stacked' as const, weight: 1 },
    ], seed, 3);
  }

  const options: WeightedOption<DashboardLayout>[] = [
    { value: defaultLayout, weight: 5 },
    { value: 'grid', weight: 2 },
    { value: 'rail', weight: 2 },
    { value: 'stacked', weight: 1 },
  ];

  return weightedPick(options, seed, 4);
}

// ============================================================================
// ENTITY VIEW TYPE DERIVATION
// ============================================================================

/**
 * Field name patterns that suggest specific view types
 */
const KANBAN_FIELDS = ['status', 'stage', 'state', 'phase', 'step'];
const TIMELINE_FIELDS = ['date', 'time', 'timestamp', 'created', 'updated', 'deadline', 'duedate', 'startat', 'endat', 'scheduledat'];
const FEED_FIELDS = ['content', 'body', 'message', 'text', 'description', 'post', 'comment', 'note'];

/**
 * Detect best view type for an entity based on its fields
 */
function detectEntityViewType(
  entity: OaxeOutput['entities'][0],
  seed: number,
  entityIndex: number,
  density: DensityLevel
): EntityViewType {
  const fieldNames = entity.fields.map(f => f.name.toLowerCase().replace(/[_-]/g, ''));

  // Check for kanban candidates (has status/stage field)
  const hasStatusField = fieldNames.some(name =>
    KANBAN_FIELDS.some(pattern => name.includes(pattern))
  );
  if (hasStatusField) {
    return 'kanban';
  }

  // Check for timeline candidates (has date/time fields)
  const hasDateField = fieldNames.some(name =>
    TIMELINE_FIELDS.some(pattern => name.includes(pattern))
  );
  if (hasDateField && fieldNames.length <= 6) {
    return 'timeline';
  }

  // Check for feed candidates (has content/body/message)
  const hasContentField = fieldNames.some(name =>
    FEED_FIELDS.some(pattern => name.includes(pattern))
  );
  if (hasContentField && fieldNames.length <= 5) {
    return 'feed';
  }

  // Default: table vs cards based on density and field count
  if (density === 'spacious' || entity.fields.length <= 4) {
    // Use seed-based selection with bias toward cards for spacious
    return weightedPick([
      { value: 'cards' as const, weight: density === 'spacious' ? 6 : 4 },
      { value: 'table' as const, weight: density === 'compact' ? 6 : 4 },
    ], seed, 10 + entityIndex);
  }

  return 'table';
}

/**
 * Ensure view diversity: if 3+ entities, at least 2 distinct views
 */
function ensureViewDiversity(
  entityViews: EntityViewConfig[],
  seed: number
): EntityViewConfig[] {
  if (entityViews.length < 3) {
    return entityViews;
  }

  const viewTypes = new Set(entityViews.map(e => e.viewType));

  if (viewTypes.size >= 2) {
    return entityViews;
  }

  // All same type - diversify the second entity
  const currentType = entityViews[0].viewType;
  const alternatives: EntityViewType[] = ['table', 'cards', 'kanban', 'timeline', 'feed']
    .filter(t => t !== currentType) as EntityViewType[];

  const newType = weightedPick(
    alternatives.map((v, i) => ({ value: v, weight: 4 - i })),
    seed,
    50
  );

  return entityViews.map((ev, i) =>
    i === 1 ? { ...ev, viewType: newType } : ev
  );
}

// ============================================================================
// PRIMARY FIELD & COLUMNS SELECTION
// ============================================================================

/**
 * Select the primary display field for an entity
 */
function selectPrimaryField(entity: OaxeOutput['entities'][0]): string {
  const fieldNames = entity.fields.map(f => f.name.toLowerCase());

  // Priority order for primary field
  const priorities = ['name', 'title', 'label', 'subject', 'heading'];

  for (const priority of priorities) {
    const match = entity.fields.find(f => f.name.toLowerCase().includes(priority));
    if (match) return match.name;
  }

  // Fall back to first string field
  const stringField = entity.fields.find(f =>
    f.type.toLowerCase() === 'string' || f.type.toLowerCase() === 'text'
  );
  if (stringField) return stringField.name;

  // Fall back to first field
  return entity.fields[0]?.name || 'id';
}

/**
 * Select columns to display in list view
 */
function selectListColumns(
  entity: OaxeOutput['entities'][0],
  viewType: EntityViewType
): string[] {
  const allFields = entity.fields.map(f => f.name);

  // For cards/feed, fewer columns
  if (viewType === 'cards' || viewType === 'feed') {
    return allFields.slice(0, 3);
  }

  // For kanban, need status plus a couple others
  if (viewType === 'kanban') {
    const statusField = entity.fields.find(f =>
      KANBAN_FIELDS.some(k => f.name.toLowerCase().includes(k))
    );
    const others = allFields.filter(f => f !== statusField?.name).slice(0, 2);
    return statusField ? [statusField.name, ...others] : allFields.slice(0, 3);
  }

  // For timeline, date plus a few others
  if (viewType === 'timeline') {
    const dateField = entity.fields.find(f =>
      TIMELINE_FIELDS.some(t => f.name.toLowerCase().includes(t))
    );
    const others = allFields.filter(f => f !== dateField?.name).slice(0, 3);
    return dateField ? [dateField.name, ...others] : allFields.slice(0, 4);
  }

  // Table: up to 5 columns
  return allFields.slice(0, 5);
}

// ============================================================================
// CREATE/DETAILS PATTERN SELECTION
// ============================================================================

/**
 * Select create pattern based on field count and mood
 */
function selectCreatePattern(
  entity: OaxeOutput['entities'][0],
  mood: string,
  seed: number,
  entityIndex: number
): CreatePattern {
  // Many fields = page, few fields can use modal
  if (entity.fields.length > 6) {
    return 'page';
  }

  // Minimal/professional moods prefer page
  if (mood === 'minimal' || mood === 'professional' || mood === 'serious') {
    return weightedPick([
      { value: 'page' as const, weight: 7 },
      { value: 'modal' as const, weight: 3 },
    ], seed, 20 + entityIndex);
  }

  // Friendly/playful moods more likely to use modals
  return weightedPick([
    { value: 'modal' as const, weight: 5 },
    { value: 'page' as const, weight: 5 },
  ], seed, 20 + entityIndex);
}

/**
 * Select details pattern based on entity complexity and mood
 */
function selectDetailsPattern(
  entity: OaxeOutput['entities'][0],
  mood: string,
  viewType: EntityViewType,
  seed: number,
  entityIndex: number
): DetailsPattern {
  // Complex entities always use page
  if (entity.fields.length > 8) {
    return 'page';
  }

  // Kanban often uses drawer for quick views
  if (viewType === 'kanban') {
    return weightedPick([
      { value: 'drawer' as const, weight: 6 },
      { value: 'page' as const, weight: 3 },
      { value: 'modal' as const, weight: 1 },
    ], seed, 30 + entityIndex);
  }

  // Cards/feed can use modal for quick details
  if (viewType === 'cards' || viewType === 'feed') {
    return weightedPick([
      { value: 'page' as const, weight: 4 },
      { value: 'modal' as const, weight: 4 },
      { value: 'drawer' as const, weight: 2 },
    ], seed, 30 + entityIndex);
  }

  // Table: usually page
  return 'page';
}

// ============================================================================
// DASHBOARD BLOCKS COMPOSITION
// ============================================================================

/**
 * Compose dashboard blocks based on entities and hierarchy
 */
function composeDashboardBlocks(
  entities: OaxeOutput['entities'],
  hierarchy: HierarchyStyle,
  dashboardLayout: DashboardLayout,
  brandDNA: BrandDNA,
  seed: number
): DashboardBlock[] {
  const blocks: DashboardBlock[] = [];

  // Always start with stats block
  blocks.push({
    type: 'stats',
    title: getStatsTitle(brandDNA),
    span: dashboardLayout === 'stacked' ? 4 : 2,
  });

  // Add entity-based blocks for top 2-3 entities
  const topEntities = entities.slice(0, 3);
  topEntities.forEach((entity, i) => {
    blocks.push({
      type: i === 0 ? 'list' : 'chart',
      entityName: entity.name,
      title: `Recent ${entity.name}s`,
      span: dashboardLayout === 'stacked' ? 4 : (i === 0 ? 2 : 1),
    });
  });

  // Add actions block
  blocks.push({
    type: 'actions',
    title: getActionsTitle(brandDNA),
    span: dashboardLayout === 'rail' ? 4 : 1,
  });

  // Add activity or moment block if room
  if (blocks.length < 6) {
    const addMoment = brandDNA.productBrandMoments?.length > 0 &&
      weightedPick([
        { value: true, weight: 4 },
        { value: false, weight: 6 },
      ], seed, 40);

    blocks.push({
      type: addMoment ? 'moment' : 'activity',
      title: addMoment ? 'Welcome' : 'Recent Activity',
      span: 1,
    });
  }

  // Ensure 4-6 blocks
  while (blocks.length > 6) {
    blocks.pop();
  }

  return blocks;
}

function getStatsTitle(brandDNA: BrandDNA): string {
  const { archetype, mood } = brandDNA;
  if (mood === 'minimal') return 'Overview';
  if (archetype === 'Ruler') return 'Key Metrics';
  if (archetype === 'Sage') return 'Insights';
  if (archetype === 'Hero') return 'Progress';
  return 'Dashboard';
}

function getActionsTitle(brandDNA: BrandDNA): string {
  const { mood, archetype } = brandDNA;
  if (mood === 'minimal') return 'Actions';
  if (archetype === 'Hero') return 'Take Action';
  if (archetype === 'Creator') return 'Create';
  return 'Quick Actions';
}

// ============================================================================
// GLOBAL SETTINGS SELECTION
// ============================================================================

function selectDensity(
  visualSignature: BrandDNA['visualSignature'],
  category: string,
  seed: number
): DensityLevel {
  // Use visual signature density if available
  if (visualSignature?.densityRhythm?.profile) {
    const mapping: Record<string, DensityLevel> = {
      compact: 'compact',
      balanced: 'comfortable',
      spacious: 'spacious',
    };
    return mapping[visualSignature.densityRhythm.profile] || 'comfortable';
  }

  // Category-based defaults
  const categoryDensity: Record<string, DensityLevel> = {
    legal: 'compact',
    finance: 'compact',
    healthcare: 'comfortable',
    technology: 'compact',
    wellness: 'spacious',
    creative: 'spacious',
    education: 'comfortable',
    social: 'comfortable',
    ecommerce: 'comfortable',
    productivity: 'compact',
    nature: 'spacious',
    energy: 'comfortable',
  };

  return categoryDensity[category] || 'comfortable';
}

function selectHierarchy(
  entityCount: number,
  navPattern: NavPattern,
  seed: number
): HierarchyStyle {
  // Many entities or sidebar nav = nested is common
  if (entityCount >= 5 && navPattern === 'sidebar') {
    return 'nested';
  }

  // Top nav often uses tabbed
  if (navPattern === 'top') {
    return 'tabbed';
  }

  // Default to flat
  return weightedPick([
    { value: 'flat' as const, weight: 5 },
    { value: 'nested' as const, weight: 3 },
    { value: 'tabbed' as const, weight: 2 },
  ], seed, 60);
}

function selectInteractionModel(
  mood: string,
  viewTypes: EntityViewType[],
  seed: number
): InteractionModel {
  // Kanban suggests inline-edit
  if (viewTypes.includes('kanban')) {
    return weightedPick([
      { value: 'inline-edit' as const, weight: 5 },
      { value: 'click' as const, weight: 5 },
    ], seed, 70);
  }

  // Professional moods prefer click
  if (mood === 'professional' || mood === 'serious' || mood === 'minimal') {
    return 'click';
  }

  // Friendly/playful can use hover-reveal
  if (mood === 'friendly' || mood === 'playful') {
    return weightedPick([
      { value: 'hover-reveal' as const, weight: 4 },
      { value: 'click' as const, weight: 6 },
    ], seed, 71);
  }

  return 'click';
}

// ============================================================================
// VALIDATION & REPAIR
// ============================================================================

/**
 * Validate grammar and repair if needed
 */
function validateAndRepair(grammar: LayoutGrammar): LayoutGrammar {
  const repaired = { ...grammar };

  // Ensure dashboardBlocks has 4-6 items
  if (repaired.dashboardBlocks.length < 4) {
    while (repaired.dashboardBlocks.length < 4) {
      repaired.dashboardBlocks.push({
        type: 'stats',
        title: 'Metrics',
        span: 1,
      });
    }
  }
  if (repaired.dashboardBlocks.length > 6) {
    repaired.dashboardBlocks = repaired.dashboardBlocks.slice(0, 6);
  }

  // Ensure all entity views have valid fields
  repaired.entityViews = repaired.entityViews.map(ev => ({
    ...ev,
    listPrimaryField: ev.listPrimaryField || 'id',
    listColumns: ev.listColumns.length > 0 ? ev.listColumns : ['id'],
  }));

  return repaired;
}

// ============================================================================
// MAIN GENERATOR
// ============================================================================

/**
 * Generate a Layout Grammar from directive, Brand DNA, and entities
 */
export function generateLayoutGrammar(
  directive: string,
  output: OaxeOutput,
  brandDNA: BrandDNA
): LayoutGrammar {
  const seed = generateLayoutSeed(directive, output.appName);
  const entityCount = output.entities.length;
  const category = brandDNA.category;
  const mood = brandDNA.mood;

  // Select global settings
  const density = selectDensity(brandDNA.visualSignature, category, seed);
  const navPattern = selectNavPattern(category, entityCount, seed);
  const dashboardLayout = selectDashboardLayout(category, mood, entityCount, seed);
  const hierarchy = selectHierarchy(entityCount, navPattern, seed);

  // Generate entity view configs
  let entityViews: EntityViewConfig[] = output.entities.map((entity, i) => {
    const viewType = detectEntityViewType(entity, seed, i, density);
    const primaryField = selectPrimaryField(entity);
    const listColumns = selectListColumns(entity, viewType);
    const createPattern = selectCreatePattern(entity, mood, seed, i);
    const detailsPattern = selectDetailsPattern(entity, mood, viewType, seed, i);

    return {
      entityName: entity.name,
      viewType,
      listPrimaryField: primaryField,
      listColumns,
      createPattern,
      detailsPattern,
    };
  });

  // Ensure view diversity
  entityViews = ensureViewDiversity(entityViews, seed);

  // Select interaction model
  const viewTypes = entityViews.map(e => e.viewType);
  const interactionModel = selectInteractionModel(mood, viewTypes, seed);

  // Compose dashboard blocks
  const dashboardBlocks = composeDashboardBlocks(
    output.entities,
    hierarchy,
    dashboardLayout,
    brandDNA,
    seed
  );

  // Build grammar
  const grammar: LayoutGrammar = {
    navPattern,
    dashboardLayout,
    dashboardBlocks,
    entityViews,
    hierarchy,
    density,
    interactionModel,
    seed,
    generatedAt: new Date().toISOString(),
  };

  // Validate and repair
  return validateAndRepair(grammar);
}

// ============================================================================
// MARKDOWN EXPORT
// ============================================================================

/**
 * Generate markdown documentation for the layout grammar
 */
export function generateLayoutGrammarMarkdown(grammar: LayoutGrammar, brandDNA: BrandDNA): string {
  const viewTypeEmoji: Record<EntityViewType, string> = {
    table: '📊',
    cards: '🃏',
    kanban: '📋',
    timeline: '📅',
    feed: '📰',
  };

  return `# Layout Grammar

Generated: ${grammar.generatedAt}
Seed: ${grammar.seed}

## Navigation

**Pattern:** ${grammar.navPattern}
**Hierarchy:** ${grammar.hierarchy}

## Dashboard

**Layout:** ${grammar.dashboardLayout}

### Blocks

${grammar.dashboardBlocks.map((block, i) =>
  `${i + 1}. **${block.title}** (${block.type}) — span: ${block.span}${block.entityName ? ` — ${block.entityName}` : ''}`
).join('\n')}

## Entity Presentation

| Entity | View | Primary Field | Create | Details |
|--------|------|---------------|--------|---------|
${grammar.entityViews.map(ev =>
  `| ${ev.entityName} | ${viewTypeEmoji[ev.viewType]} ${ev.viewType} | ${ev.listPrimaryField} | ${ev.createPattern} | ${ev.detailsPattern} |`
).join('\n')}

## Interaction

**Density:** ${grammar.density}
**Interaction Model:** ${grammar.interactionModel}

---

*Generated by Oaxe M5B: Dynamic Layout Grammar Composer*
`;
}

/**
 * Get a summary of the layout grammar for logging
 */
export function getLayoutGrammarSummary(grammar: LayoutGrammar): string {
  const viewSummary = grammar.entityViews
    .map(e => `${e.entityName}:${e.viewType}`)
    .join(', ');

  return `nav:${grammar.navPattern} dashboard:${grammar.dashboardLayout} density:${grammar.density} views:[${viewSummary}]`;
}
