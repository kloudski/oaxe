# Tasks

Milestone-driven execution plan for product generation.

## Structure

Each task follows this format:

```markdown
## [MILESTONE-ID] Milestone Name

**Status:** Not Started | In Progress | Blocked | Complete
**Owner:** @handle
**Dependencies:** [MILESTONE-IDs]
**Priority:** P0 | P1 | P2

### Objective
What this milestone achieves.

### Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2

### Performance Implications
- Impact on latency, throughput, or resource usage

### Security Implications
- Impact on attack surface, data exposure, or compliance

### Tasks
- [ ] Task 1 — @owner — Est: Xh
- [ ] Task 2 — @owner — Est: Xh

### Notes
Additional context.
```

---

## [M0A] Engine Bootstrap

**Status:** Complete
**Owner:** @architect
**Dependencies:** None
**Priority:** P0

### Objective
Bootstrap the core generation engine with file-based persistence.

### Acceptance Criteria
- [x] Next.js 14+ App Router configured
- [x] TypeScript strict mode enabled
- [x] Tailwind CSS configured
- [x] Directive → JSON generation via LLM
- [x] File-based run persistence (data/runs/)
- [x] Zod validation for all schemas
- [x] Live logs with polling UI
- [x] API routes: POST /api/runs, GET /api/runs, GET /api/runs/[id]

### Performance Implications
- File I/O acceptable for single-user dev mode
- Polling interval: 1s

### Security Implications
- No auth required (local dev only)
- No secrets in generated output

### Tasks
- [x] Initialize Next.js project — @architect
- [x] Configure TypeScript strict mode — @architect
- [x] Set up Tailwind — @architect
- [x] Implement Zod schemas — @architect
- [x] Implement file-based runStore — @architect
- [x] Implement LLM planner — @architect
- [x] Build polling UI — @architect

### Notes
Engine bootstrap complete. Platform infrastructure deferred to M0B.

---

## [M0B] Platform Initialization

**Status:** Not Started
**Owner:** @architect
**Dependencies:** [M0A]
**Priority:** P1

### Objective
Initialize production-grade platform infrastructure.

### Acceptance Criteria
- [ ] ESLint + Prettier configured
- [ ] Tailwind CSS with OKLCH tokens
- [ ] Database schema initialized (Postgres + Drizzle)
- [ ] Auth provider connected
- [ ] CI/CD pipeline operational
- [ ] Observability stack connected
- [ ] CSP headers configured
- [ ] Environment variables secured
- [ ] Auth flow hardened

### Performance Implications
- Foundation for p95 < 1.2s latency
- Edge runtime compatibility verified
- Database connection pooling required

### Security Implications
- CSP headers configured
- Environment variables secured
- Auth flow hardened
- OWASP top 10 mitigated

### Tasks
- [ ] Configure ESLint + Prettier — @architect — Est: 1h
- [ ] Migrate Tailwind to OKLCH tokens — @designer — Est: 2h
- [ ] Configure database (Postgres + Drizzle) — @backend — Est: 2h
- [ ] Set up authentication — @backend — Est: 3h
- [ ] Configure CI/CD — @devops — Est: 2h
- [ ] Set up observability — @devops — Est: 2h
- [ ] Implement CSP headers — @security — Est: 1h

### Notes
Use Vercel for deployment. Prefer edge runtime where possible.

---

## [M7-lite] Minimal Code Stub Generation

**Status:** Complete
**Owner:** @engineer
**Dependencies:** [M0A]
**Priority:** P0

### Objective
Generate minimal runnable Next.js app scaffold from planner output.

### Acceptance Criteria
- [x] App scaffold generated (package.json, tsconfig, tailwind, etc.)
- [x] Page stubs generated from pages[]
- [x] API route stubs generated from apis[] with Zod validation
- [x] Entity → TypeScript types generated from entities[]
- [x] Slug sanitization implemented
- [x] Overwrite protection (force flag required)
- [x] Integration with run lifecycle (generatedApp in run JSON)
- [x] UI tab: "Generated App" with file tree + instructions

### Performance Implications
- Generation is synchronous after spec completion
- File tree built in-memory before write

### Security Implications
- No secrets in generated code
- Slug sanitization prevents path traversal
- Input validation stubs in all API routes

### Tasks
- [x] Create generator types — @engineer
- [x] Build scaffold generator — @engineer
- [x] Build page generator — @engineer
- [x] Build API route generator — @engineer
- [x] Build entity/schema generator — @engineer
- [x] Integrate with planner lifecycle — @engineer
- [x] Build FileTree component — @engineer
- [x] Build GeneratedAppView component — @engineer
- [x] Update RunViewer with Generated App tab — @engineer

### Notes
Generated apps output to /generated/<slug>/. Run `pnpm install && pnpm dev` to start.

---

## [M7-plus] Real Product Generator

**Status:** Complete
**Owner:** @engineer
**Dependencies:** [M7-lite]
**Priority:** P0

### Objective
Upgrade generated apps from skeletons into real-feeling products with navigation, layouts, CRUD UI, and coherent UX.

### Acceptance Criteria
- [x] App shell with sidebar + header generated
- [x] Navigation auto-built from pages[]
- [x] Root redirect to first page or /dashboard
- [x] Entities rendered as tables with seed data
- [x] Create forms generated from entity fields
- [x] API stubs return realistic shapes
- [x] Zod validation in forms and APIs
- [x] All generated apps boot and feel usable
- [x] No infra dependencies added

### Performance Implications
- No blocking operations in UI
- No unnecessary re-renders
- Page load < 1s local

### Security Implications
- Input validation on all forms and APIs
- No secrets or tokens in generated code

### Tasks
- [x] Build AppShell generator — @engineer
- [x] Build sidebar + nav generator — @engineer
- [x] Build entity table generator — @engineer
- [x] Build form generator — @engineer
- [x] Upgrade API stub generator — @engineer
- [x] Add seed data generator — @engineer
- [x] Add base UI styles — @engineer

### Notes
No database. No auth. No infra.
All UX must be derived strictly from planner output.

**Patch (2026-01-27): Entity Index Page Bug Fix**
- Fixed 404s for entity routes (/job, /applicant) when planner only specified /:id routes
- pages.ts: Now ensures every entity has an index page even if not explicitly in pages[]
- components.ts: Sidebar now correctly derives nav items from entities[] + pages[]
- index.ts: Added validation step to catch any missing sidebar route pages
- apis.ts: Fixed path sanitization order (`:id` → `[id]` before char filtering)
- apis.ts: Fixed hasParams to detect `:id` syntax
- schema.ts: Added file/email/url type mappings

**Patch (2026-01-27): Nav/Route Collision Fix**
- Fixed duplicate "Dashboard" nav and route collisions between core app routes and entity routes
- Added RESERVED_APP_ROUTES set: dashboard, settings, profile, billing, reports, admin, api, auth
- pages.ts: Entity routes that collide with reserved routes are now placed under /e/<entity>
- pages.ts: Added getEntityBasePath() and getEntityLabel() helpers for collision-aware routing
- components.ts: Sidebar now separates App section (Dashboard) from Entities section
- components.ts: Entity labels append " (Entity)" when colliding with reserved route names
- components.ts: Active-state logic now uses path normalization (isPathActive helper)
- index.ts: Validation updated to use collision-aware base paths
- tsconfig.json: Excluded generated/ directory from parent project compilation

---

## [M7++] Design Excellence Layer (Light-first)

**Status:** Complete
**Owner:** @engineer
**Dependencies:** [M7-plus]
**Priority:** P0

### Objective
Make generated apps look premium in LIGHT MODE first (Stripe/Notion vibe), while keeping dark mode as secondary theme. Improve typography hierarchy, spacing rhythm, tables, forms, buttons, cards, and shell composition.

### Acceptance Criteria
- [x] Light-mode-first visual system with CSS custom properties
- [x] Typography hierarchy (heading scale, body, muted text)
- [x] AppShell polish (clean sidebar, page header, improved spacing)
- [x] DataTable polish (comfortable density, hover states, empty/loading states)
- [x] EntityForm polish (field grouping, labels, helper text, focus rings)
- [x] Button variants (primary, secondary, ghost, danger)
- [x] Card improvements (header/content/footer spacing)
- [x] StatusBadge (subtle light-mode semantic chips)
- [x] Globals.css improvements (selection, scrollbar, focus rings)
- [x] No new dependencies added
- [x] Build passes

### Performance Implications
- No additional runtime overhead
- CSS custom properties for efficient theming
- No layout shifts on theme change

### Security Implications
- No security impact (UI-only changes)

### Tasks
- [x] Create light-mode-first CSS variable system in globals.css — @engineer
- [x] Update AppShell with premium light-mode styling — @engineer
- [x] Update Sidebar with clean, compact design — @engineer
- [x] Update DataTable with Stripe/Notion quality — @engineer
- [x] Update EntityForm with improved field composition — @engineer
- [x] Update Button with light-mode-first variants — @engineer
- [x] Update Card with header/content/footer structure — @engineer
- [x] Update StatusBadge with light-mode semantic colors — @engineer
- [x] Update page generators with light-mode styling — @engineer
- [x] Fix TypeScript iteration issues in apis.ts and index.ts — @engineer

### Notes
Light-mode-first design system using CSS custom properties:
- `--bg-primary/secondary/tertiary` for background hierarchy
- `--text-primary/secondary/muted` for text hierarchy
- `--border-default/subtle/strong` for border variations
- `--shadow-xs/sm/md/lg` for elevation system
- `--accent-muted` for primary color backgrounds
- Dark mode via `.dark` class with L-shift values

Files modified:
- generators/scaffold.ts: globals.css, layout.tsx, dashboard page
- generators/components.ts: AppShell, Sidebar, DataTable, EntityForm, StatusBadge, Button, Card
- generators/pages.ts: Entity list, form, and detail pages
- generators/index.ts: Placeholder page styling
- generators/apis.ts: Fixed Map iteration for TypeScript compatibility

---

## [M3A] Design Tokens Foundation (OKLCH)

**Status:** Complete
**Owner:** @engineer
**Dependencies:** [M7++]
**Priority:** P0

### Objective
Implement a design token system using OKLCH color space. Generated apps use semantic tokens instead of hardcoded colors. Light-mode-first with dark mode derived via L-shift only.

### Acceptance Criteria
- [x] Token output format: `src/design/tokens.css` with OKLCH CSS variables
- [x] Tailwind integration: `tailwind.config.ts` references CSS variables (no hex codes)
- [x] Token generator produces neutral scale, brand accent, and semantic hues
- [x] Dark mode derived by L-shift only (same C/H preserved)
- [x] Components updated to use semantic token classes (bg, fg, border, surface, primary, etc.)
- [x] Theme selector helper: `src/lib/theme.ts` with `setTheme("light"|"dark")`
- [x] ThemeToggle component in header
- [x] ThemeInitScript for flash-free hydration
- [x] Tokens persisted as JSON in generated output
- [x] Generated apps build and run
- [x] No hex codes in generated app outputs

### Performance Implications
- CSS custom properties for efficient theming
- No layout shifts on theme change
- Minimal CSS overhead from OKLCH syntax

### Security Implications
- No security impact (UI-only changes)

### Tasks
- [x] Create tokens.ts generator — @engineer
- [x] Generate OKLCH-based tokens.css — @engineer
- [x] Generate tokenized tailwind.config.ts — @engineer
- [x] Update globals.css to import tokens — @engineer
- [x] Add theme.ts helper with light/dark toggle — @engineer
- [x] Add ThemeToggle component — @engineer
- [x] Add ThemeInitScript for hydration — @engineer
- [x] Update AppShell with theme toggle — @engineer
- [x] Update all components to use semantic tokens — @engineer
- [x] Update all page generators to use semantic tokens — @engineer
- [x] Export token JSON for run metadata — @engineer

### Notes
OKLCH color space provides perceptual uniformity. Token architecture:

**Color Scales (OKLCH):**
- Neutral: Very low chroma (0.01) for backgrounds, borders, text
- Primary: Brand hue extracted from designTokens.colors[0]
- Semantic: success (145°), warning (45°), error (25°), info (220°)

**Semantic Tokens (Tailwind classes):**
- Background: `bg`, `bg-secondary`, `surface`, `surface-raised`, `muted`
- Text: `fg`, `fg-secondary`, `fg-muted`
- Border: `border`, `border-subtle`, `border-strong`
- Primary: `primary`, `primary-hover`, `primary-fg`, `primary-muted`
- Status: `success`, `warning`, `error`, `info` (each with muted variants)

**Files created:**
- generators/tokens.ts: New token generator
- Generated: src/design/tokens.css, src/design/tokens.json, src/lib/theme.ts

**Files modified:**
- generators/scaffold.ts: Uses tokenized tailwind.config.ts and globals.css
- generators/components.ts: All components use semantic token classes
- generators/pages.ts: All pages use semantic token classes
- generators/index.ts: Includes token generation, exports metadata helper

---

## [M3B] Brand-Driven Tokens

**Status:** Complete
**Owner:** @engineer
**Dependencies:** [M3A]
**Priority:** P0

### Objective
Make design tokens brand-driven and ownable per generated product. Tokens are computed from directive text, product name, and brand DNA fields rather than hardcoded values.

### Acceptance Criteria
- [x] Token generator accepts "brand seed" inputs (directive, appName, brandDNA)
- [x] Compute brandHue (0-360) and brandChroma (0-0.22) from semantic analysis
- [x] Compute neutralHue derived from brandHue offset (+30°)
- [x] Semantic hues are FIXED (not harmonized) for UX predictability
- [x] Generate primary scale using computed brandHue/Chroma (OKLCH only)
- [x] Generate neutrals using computed neutralHue with very low chroma
- [x] Contrast guardrails ensure primary-fg works on primary buttons
- [x] Persist extended metadata in tokens.json (brandHue, neutralHue, mood, category)
- [x] GeneratorOptions accepts directive for brand extraction
- [x] No new dependencies added

### Performance Implications
- No runtime overhead - all computation at generation time
- Category matching uses simple keyword scoring

### Security Implications
- No security impact (UI-only changes)

### Design Decisions

**Brand Category Hue Mappings:**
- legal: 225° (professional blue)
- finance: 215° (trust blue)
- healthcare: 175° (calm teal)
- wellness: 155° (serene green)
- technology: 235° (tech purple-blue)
- creative: 285° (vibrant purple)
- education: 195° (approachable cyan)
- ecommerce: 35° (warm orange)
- social: 265° (friendly purple)
- productivity: 205° (focused blue)
- nature: 135° (organic green)
- energy: 25° (active red-orange)

**Semantic Hue Strategy: FIXED**
Semantic hues (success, warning, error, info) are NOT harmonized with brand hue.
Rationale: Users have universal color associations (green=good, red=bad) that should not be overridden for brand consistency. This ensures predictable UX across all generated apps.

**Neutral Hue Derivation:**
neutralHue = (brandHue + 30) % 360
This creates subtle color harmony while keeping neutrals perceptually neutral.

**Contrast Guardrails:**
- Primary button L: 0.50-0.65 (allows white text at ~4.5:1 contrast)
- Min text L on light bg: 0.45
- Max text L on dark bg: 0.85

### Files Modified
- generators/tokens.ts: Brand seed extraction, category matching, tone modifiers
- generators/types.ts: Added directive to GeneratorOptions
- generators/index.ts: Pass directive through to token generators
- generators/scaffold.ts: Accept directive for Tailwind config generation

### Notes
Tokens now differ materially based on directive. Example token differences:
- "legal case management" → brandHue: 225° (blue), mood: professional
- "wellness ritual tracker" → brandHue: 155° (green), mood: calm

---

## [M3C] Token Semantics + Metadata Patch

**Status:** Complete
**Owner:** @engineer
**Dependencies:** [M3B]
**Priority:** P0

### Objective
Fix token export metadata and make dark-mode scales preserve semantic order (50 stays lightest), while still changing L only.

### Acceptance Criteria
- [x] tokens.json includes category, mood, brandHue, brandChroma, neutralHue, neutralChroma
- [x] tokens.json includes matchedKeywords and matchSource fields
- [x] Dark mode preserves scale semantics: 50 is lightest, 950 is darkest
- [x] Dark mode only changes L values (C and H preserved from light mode)
- [x] No hex codes anywhere in token output
- [x] Build passes

### Performance Implications
- No runtime overhead - all computation at generation time

### Security Implications
- No security impact (UI-only changes)

### Design Decisions

**Dark Mode L-Shift Strategy: Semantic Preserved**
Previously, dark mode inverted the L ladder (50 became darkest, 950 became lightest).
This broke semantic expectations where developers expect "50" to always be a light tint.

New approach:
- 50 stays the lightest step (high L) in both light and dark mode
- 950 stays the darkest step (low L) in both light and dark mode
- L values shift down overall for dark surfaces, but order is preserved

Example (neutral scale):
- Light mode: 50=0.985, 500=0.55, 950=0.12
- Dark mode:  50=0.94,  500=0.42, 950=0.10

**Metadata Fields Added:**
- `matchedKeywords`: Array of keywords that matched during category detection
- `matchSource`: Which input source had the strongest match (directive/appName/brandDNA/elevatorPitch/default)

### Files Modified
- generators/tokens.ts: Updated BrandSeed interface, extractBrandSeed(), dark mode L ladders, tokens.json output

### Notes
This patch ensures:
1. In dark mode, `bg-primary-50` is still a light shade of the brand color
2. Token consumers can see exactly why a particular hue/category was chosen
3. Debugging brand extraction is now transparent via matchedKeywords/matchSource

---

## [M3D] Token Variance Amplifier

**Status:** Complete
**Owner:** @engineer
**Dependencies:** [M3C]
**Priority:** P0

### Objective
Increase brand distinctiveness across generated apps by adding controlled variance in neutrals, elevation, and primary scale shaping based on category+mood, while staying OKLCH-only and preserving accessibility.

### Acceptance Criteria
- [x] Category-driven neutral hue offsets (not fixed +30°)
- [x] Mood-based neutral chroma variation (calm/serious: 0.006-0.012, friendly/playful: 0.010-0.018)
- [x] Primary scale chroma curve (low at 50-200, peak at 500-700, taper at 900-950)
- [x] Primary button L in light mode supports white text (primaryFg) without changing hue
- [x] Structural tokens emitted in tokens.css and tokens.json:
  - radiusSm/radiusMd/radiusLg/radiusFull
  - shadowXs/shadowSm/shadowMd/shadowLg/shadowXl
  - borderWidthSubtle/Default/Strong
- [x] Structural tokens derived from mood (10 mood presets)
- [x] Components updated to use structural tokens (Card, Button, DataTable, EntityForm, AppShell, Sidebar, ThemeToggle)
- [x] Tailwind config extended with radius/shadow/borderWidth
- [x] tokens.json includes all M3D metadata (neutralOffset, neutralChromaRange, primaryChromaStrategy, structuralTokens)
- [x] Build passes

### Performance Implications
- No runtime overhead - all computation at generation time
- CSS custom properties for efficient theming
- Structural tokens use CSS variables for theme consistency

### Security Implications
- No security impact (UI-only changes)

### Design Decisions

**Category-Driven Neutral Offsets:**
Different categories benefit from different neutral warmth/coolness:
- legal: +15° (slightly warm grays for trust)
- finance: +20° (cool professional grays)
- healthcare: +25° (calm, clinical feel)
- wellness: +35° (warmer, more organic grays)
- technology: +10° (very subtle, nearly pure gray)
- creative: +45° (distinctive warm offset)
- education: +30° (approachable warmth)
- ecommerce: +40° (warm, inviting grays)
- social: +50° (distinctive personality)
- productivity: +15° (clean, focused grays)
- nature: +55° (organic, earthy grays)
- energy: +20° (warm but not overpowering)

**Mood-Based Neutral Chroma:**
- calm/serious/professional/minimal: 0.004-0.012 (very subtle tint)
- friendly/warm: 0.010-0.016 (noticeable but not heavy)
- playful/vibrant: 0.012-0.018 (distinctive personality)

**Primary Chroma Curve (Bell Curve Strategy):**
```
Step  | Multiplier | Effect
------|------------|----------------
50    | 0.20       | Very subtle tint
100   | 0.30       | Subtle
200   | 0.50       | Building
300   | 0.75       | Approaching peak
400   | 0.92       | Near peak
500   | 1.00       | Peak vibrance
600   | 1.00       | Peak maintained
700   | 0.90       | Starting taper
800   | 0.70       | Tapering
900   | 0.50       | Muted
950   | 0.35       | Very muted
```

**Structural Tokens by Mood:**
10 mood presets define radius/shadow/border characteristics:
- minimal: Sharp corners (0.25-0.5rem), subtle shadows
- professional: Balanced (0.25-0.75rem), standard shadows
- serious: Very sharp (0.125-0.375rem), minimal shadows
- calm: Soft corners (0.375-1rem), gentle shadows
- friendly: Soft corners (0.375-1rem), medium shadows
- playful: Very rounded (0.5-1.25rem), prominent shadows
- warm: Balanced with warm-tinted shadows
- bold: Balanced corners, strong shadows
- vibrant: Soft corners, medium-strong shadows
- elegant: Sharp corners (0.25-0.625rem), subtle shadows

### Files Modified
- generators/tokens.ts: Added CATEGORY_NEUTRAL_OFFSETS, MOOD_NEUTRAL_CHROMA, MOOD_STRUCTURAL_TOKENS, StructuralTokens interface, getStructuralTokens(), updated extractBrandSeed(), generateColorScale() with chroma curve, generateTokensCSS() with structural tokens, updated tokens.json output
- generators/components.ts: Updated Card, Button, DataTable, EntityForm, AppShell, Sidebar, ThemeToggle to use structural tokens

### Notes
Generated apps now have materially different visual identities based on category and mood:
- "legal case management" → professional mood, sharp corners, subtle shadows, cool neutral tint
- "wellness ritual tracker" → calm mood, soft corners, gentle shadows, warm neutral tint
- "social networking app" → friendly mood, soft corners, medium shadows, distinctive neutral tint

---

## [M1] Product Specification

**Status:** Not Started
**Owner:** @product
**Dependencies:** [M0A]
**Priority:** P0

### Objective
Generate complete product specification from user directive.

### Acceptance Criteria
- [ ] Product name and tagline generated
- [ ] Core features identified (10-20 features)
- [ ] User personas defined (3-5 personas)
- [ ] User journeys mapped
- [ ] Success metrics defined
- [ ] Competitive positioning documented

### Performance Implications
- Specification generation < 30s
- Streaming output for long specs

### Security Implications
- No PII in generated specs
- Competitive analysis sanitized

### Tasks
- [ ] Implement product inference engine — @ai — Est: 8h
- [ ] Build persona generator — @ai — Est: 4h
- [ ] Build journey mapper — @ai — Est: 4h
- [ ] Build metrics framework — @product — Est: 2h

### Notes
Reference prompts/tasks/build_product.md for generation logic.

---

## [M2] Architecture Design

**Status:** Not Started
**Owner:** @architect
**Dependencies:** [M1]
**Priority:** P0

### Objective
Generate production-grade architecture from product specification.

### Acceptance Criteria
- [ ] System diagram generated
- [ ] Component boundaries defined
- [ ] Data model designed
- [ ] API contracts specified
- [ ] Edge vs. origin boundaries defined
- [ ] Caching strategy documented
- [ ] Scaling plan documented

### Performance Implications
- Architecture supports p95 < 1.2s
- Horizontal scaling path clear

### Security Implications
- Attack surface minimized
- Data isolation boundaries defined
- Auth/authz architecture documented

### Tasks
- [ ] Build architecture generator — @ai — Est: 8h
- [ ] Implement data model generator — @ai — Est: 6h
- [ ] Implement API contract generator — @ai — Est: 6h
- [ ] Build scaling advisor — @ai — Est: 4h

### Notes
All architecture decisions require ADRs.

---

## [M3] Design System Generation

**Status:** Not Started
**Owner:** @designer
**Dependencies:** [M1]
**Priority:** P0

### Objective
Generate product-specific design system derived from Brand DNA.

### Acceptance Criteria
- [ ] OKLCH color palette generated
- [ ] Typography scale defined
- [ ] Spacing system documented
- [ ] Component library specified
- [ ] Motion system defined
- [ ] Dark mode generated via L-shift
- [ ] WCAG 2.2 AA verified

### Performance Implications
- CSS bundle < 50kb gzipped
- No runtime style computation

### Security Implications
- No external font loading (self-hosted)
- No tracking in design assets

### Tasks
- [ ] Build color generator (OKLCH) — @designer — Est: 4h
- [ ] Build typography generator — @designer — Est: 4h
- [ ] Build spacing system — @designer — Est: 2h
- [ ] Build component spec generator — @designer — Est: 8h
- [ ] Build motion system — @designer — Est: 4h

### Notes
Reference docs/design-system.md for specifications.

---

## [M4] Brand DNA Generation

**Status:** Not Started
**Owner:** @brand
**Dependencies:** [M1]
**Priority:** P0

### Objective
Generate distinctive, ownable brand identity for the product.

### Acceptance Criteria
- [ ] Brand archetype selected
- [ ] Brand promise articulated
- [ ] Emotional signature defined
- [ ] Visual signature documented
- [ ] Verbal tone codified
- [ ] Iconography logic defined
- [ ] Brand guardrails established
- [ ] brand/dna.json populated

### Performance Implications
- Brand assets pregenerated, not runtime
- No external brand API calls

### Security Implications
- Brand assets are first-party only
- No trademark infringement checks automated

### Tasks
- [ ] Build archetype selector — @brand — Est: 4h
- [ ] Build visual signature generator — @designer — Est: 6h
- [ ] Build verbal tone generator — @writer — Est: 4h
- [ ] Build iconography system — @designer — Est: 4h

### Notes
Reference docs/brand-dna.md and brand/dna.json.

---

## [M5] UI Flow Generation

**Status:** Not Started
**Owner:** @designer
**Dependencies:** [M2, M3, M4]
**Priority:** P0

### Objective
Generate complete UI flows with screens, states, and interactions.

### Acceptance Criteria
- [ ] All primary flows mapped
- [ ] All screens designed
- [ ] Loading states defined
- [ ] Empty states defined
- [ ] Error states defined
- [ ] Micro-interactions specified
- [ ] Brand moments identified
- [ ] Accessibility annotations complete

### Performance Implications
- Skeleton loading for all heavy screens
- Optimistic updates where applicable

### Security Implications
- No sensitive data in empty states
- Error states sanitized

### Tasks
- [ ] Build flow mapper — @designer — Est: 6h
- [ ] Build screen generator — @ai — Est: 12h
- [ ] Build state generator — @designer — Est: 6h
- [ ] Build interaction spec generator — @designer — Est: 6h

### Notes
Every screen must exceed Linear/Stripe visual quality.

---

## [M6] Launch Assets Generation

**Status:** Not Started
**Owner:** @growth
**Dependencies:** [M4, M5]
**Priority:** P1

### Objective
Generate viral launch assets optimized for elite dev/design Twitter.

### Acceptance Criteria
- [ ] 3-5 founder tweets generated
- [ ] Pinned tweet generated
- [ ] Screenshot spec defined
- [ ] Hero copy block written
- [ ] Product Hunt tagline generated
- [ ] All assets derived from Brand DNA

### Performance Implications
- Asset generation < 10s
- No external API dependencies

### Security Implications
- No leaked internal details in tweets
- No competitive attack language

### Tasks
- [ ] Build tweet generator — @writer — Est: 4h
- [ ] Build hero copy generator — @writer — Est: 4h
- [ ] Build screenshot spec generator — @designer — Est: 2h

### Notes
Reference docs/launch-playbook.md.

---

## [M7] Code Stub Generation

**Status:** Not Started
**Owner:** @engineer
**Dependencies:** [M2, M3, M5]
**Priority:** P0

### Objective
Generate production-ready code stubs for implementation.

### Acceptance Criteria
- [ ] Next.js page stubs generated
- [ ] API route stubs generated
- [ ] Database schema migrations generated
- [ ] Component stubs generated
- [ ] Type definitions generated
- [ ] All stubs pass linting

### Performance Implications
- Generated code follows performance patterns
- No blocking operations in generated code

### Security Implications
- Input validation in all API stubs
- Auth guards in protected routes
- No secrets in generated code

### Tasks
- [ ] Build page generator — @engineer — Est: 8h
- [ ] Build API generator — @engineer — Est: 8h
- [ ] Build schema generator — @engineer — Est: 6h
- [ ] Build component generator — @engineer — Est: 10h

### Notes
All generated code must be production-grade, not demo quality.

---

## [M8] Evolution Roadmap Generation

**Status:** Not Started
**Owner:** @product
**Dependencies:** [M1, M2]
**Priority:** P1

### Objective
Generate v1→v2→v3 evolution roadmap with clear milestones.

### Acceptance Criteria
- [ ] v1 (Unfair MVP) defined
- [ ] v2 (Scale & Moat) defined
- [ ] v3 (Category King) defined
- [ ] Feature progression documented
- [ ] Architecture evolution documented
- [ ] Monetization evolution documented
- [ ] docs/evolution.md populated

### Performance Implications
- Roadmap considers performance scaling
- Technical debt explicitly tracked

### Security Implications
- Compliance roadmap included (SOC2, GDPR)
- Security posture evolution documented

### Tasks
- [ ] Build evolution planner — @product — Est: 6h
- [ ] Build feature progression mapper — @product — Est: 4h
- [ ] Build architecture evolution advisor — @architect — Est: 4h

### Notes
Reference prompts/tasks/evolve_product.md.

---

## [M9] Integration Testing

**Status:** Not Started
**Owner:** @qa
**Dependencies:** [M7]
**Priority:** P1

### Objective
Verify all generated artifacts work together correctly.

### Acceptance Criteria
- [ ] All generated code compiles
- [ ] All pages render
- [ ] All API routes respond
- [ ] Database migrations apply
- [ ] Auth flow works end-to-end
- [ ] Design tokens render correctly
- [ ] Accessibility audit passes

### Performance Implications
- Performance baselines established
- Lighthouse scores > 90

### Security Implications
- Security audit passing
- No exposed secrets

### Tasks
- [ ] Build integration test harness — @qa — Est: 6h
- [ ] Build visual regression tests — @qa — Est: 4h
- [ ] Build accessibility tests — @qa — Est: 4h
- [ ] Build security scan — @security — Est: 4h

### Notes
Block release on any P0 issues.

---

## Backlog

Tasks not yet scheduled:

- [ ] Multi-language support
- [ ] Plugin architecture
- [ ] Custom LLM provider support
- [ ] Team collaboration features
- [ ] Version control integration
- [ ] Design handoff export
