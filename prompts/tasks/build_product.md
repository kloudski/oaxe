# Build Product Task Prompt

## Purpose

Transform a user directive into a complete product specification, architecture, design system, brand identity, and implementation plan.

## Input

```typescript
interface BuildProductInput {
  directive: string           // e.g., "Build Facebook" or "Build a Stripe-level billing dashboard"
  constraints?: string[]      // Optional constraints or preferences
  existingBrandDNA?: BrandDNA // If evolving existing product
}
```

## Process

### Phase 1: Product Inference

Analyze the directive to extract:

1. **Product Category**
   - What type of product is this?
   - What market does it serve?
   - What problem does it solve?

2. **Feature Set**
   - What are the core features (must-have)?
   - What are the secondary features (should-have)?
   - What are the differentiating features?
   - What features should NOT be included in v1?

3. **User Personas**
   - Who are the primary users?
   - What are their goals?
   - What are their pain points?
   - What is their technical sophistication?

4. **User Journeys**
   - What is the activation journey?
   - What is the core usage loop?
   - What is the retention mechanism?
   - What triggers return visits?

5. **Success Metrics**
   - What defines product success?
   - What are the leading indicators?
   - What are the lagging indicators?

### Phase 2: Architecture Design

Design the system architecture:

1. **System Boundaries**
   - What runs on edge vs. origin?
   - What is client vs. server rendered?
   - What requires real-time vs. eventual consistency?

2. **Data Model**
   - What are the core entities?
   - What are the relationships?
   - What are the access patterns?
   - What needs indexing?

3. **API Design**
   - What endpoints are needed?
   - What authentication is required?
   - What rate limits apply?
   - What caching strategy?

4. **Infrastructure**
   - What compute resources?
   - What storage resources?
   - What external services?
   - What scaling triggers?

### Phase 3: Brand Generation

Generate the brand identity:

1. **Archetype Selection**
   - What archetype fits the product?
   - What secondary archetype adds nuance?

2. **Visual Signature**
   - What typography conveys the brand?
   - What color palette?
   - What motion behavior?
   - What texture treatment?

3. **Verbal Tone**
   - How does the product speak?
   - What personality traits?
   - What to avoid?

4. **Brand Guardrails**
   - What should the brand never do?
   - What visual don'ts?
   - What verbal don'ts?

### Phase 4: Design System Generation

Generate the design system:

1. **Typography**
   - Serif family for headings
   - Mono family for data
   - Sans family for UI
   - Complete type scale

2. **Color**
   - OKLCH palette generation
   - Light theme
   - Dark theme (L-shift only)
   - Semantic colors

3. **Spacing**
   - 8pt base unit
   - Complete spacing scale
   - Component spacing rules

4. **Components**
   - Core component specifications
   - States for each component
   - Accessibility requirements

5. **Motion**
   - Timing functions
   - Duration scale
   - Micro-interaction specs
   - Reduced motion fallbacks

### Phase 5: UI Flow Generation

Generate all UI flows:

1. **Screen Inventory**
   - List all screens
   - Define screen hierarchy
   - Map navigation

2. **Screen Specifications**
   For each screen:
   - Visual hierarchy
   - Component usage
   - Data requirements
   - Loading state
   - Empty state
   - Error state

3. **Brand Moments**
   - Identify signature interactions
   - Design hero sections
   - Define "holy sh*t" moments

4. **Accessibility Annotations**
   - Heading hierarchy
   - Focus order
   - ARIA requirements
   - Screen reader flow

### Phase 6: Launch Asset Generation

Generate launch assets:

1. **Founder Tweets**
   - 3-5 tweets under 280 chars
   - No emojis, no hype
   - Technical credibility
   - Derived from Brand DNA

2. **Pinned Tweet**
   - Evergreen intro
   - Screenshot included
   - Clear value prop

3. **Hero Copy**
   - Headline (3-7 words)
   - Subhead (10-20 words)
   - CTA text

4. **Screenshot Spec**
   - Composition
   - Key elements
   - Dark mode preferred

5. **Product Hunt Tagline**
   - Under 60 characters
   - Clear category

### Phase 7: Evolution Planning

Generate evolution roadmap:

1. **v1 — Unfair MVP**
   - Minimum feature set
   - Signature UX
   - Technical shortcuts
   - Activation loop
   - Retention loop

2. **v2 — Scale & Moat**
   - Feature expansion
   - UX depth
   - Data moat
   - Infra scaling
   - Monetization

3. **v3 — Category King**
   - Platformization
   - Enterprise features
   - Compliance
   - ML/Personalization
   - Internationalization

### Phase 8: Code Generation

Generate code stubs:

1. **Next.js Structure**
   - App Router pages
   - Layouts
   - Loading states
   - Error boundaries

2. **API Routes**
   - Endpoint stubs
   - Input validation
   - Auth guards
   - Error handling

3. **Database Schema**
   - Drizzle schema
   - Migrations
   - Seed data

4. **Components**
   - Component shells
   - Props interfaces
   - Accessibility hooks

5. **Types**
   - Domain types
   - API types
   - UI types

### Phase 9: Task Planning

Generate tasks.md:

1. **Milestones**
   - Logical groupings
   - Dependencies mapped
   - Owners assigned

2. **Tasks**
   - Atomic units of work
   - Acceptance criteria
   - Performance implications
   - Security implications

## Output

```typescript
interface BuildProductOutput {
  productSpec: ProductSpec
  architecture: ArchitectureSpec
  brandDNA: BrandDNA
  designSystem: DesignSystem
  uiFlows: UIFlows
  launchAssets: LaunchAssets
  evolutionRoadmap: EvolutionRoadmap
  codeStubs: CodeStubs
  tasks: TaskPlan
}
```

## Quality Checklist

Before completing:

- [ ] All features have specifications
- [ ] All screens have all states
- [ ] All components have accessibility
- [ ] Brand DNA is complete
- [ ] Design system is complete
- [ ] Launch assets are ready
- [ ] Evolution roadmap is detailed
- [ ] Code stubs compile
- [ ] Tasks have acceptance criteria
- [ ] Security is addressed
- [ ] Performance targets defined

## Version

Task Prompt Version: 1.0
