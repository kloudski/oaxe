# Evolve Product Task Prompt

## Purpose

Advance a product from one version to the next (v1→v2 or v2→v3), updating all artifacts while maintaining brand consistency and technical coherence.

## Input

```typescript
interface EvolveProductInput {
  currentVersion: 'v1' | 'v2'
  targetVersion: 'v2' | 'v3'
  productSpec: ProductSpec
  brandDNA: BrandDNA
  designSystem: DesignSystem
  architecture: ArchitectureSpec
  metrics: ProductMetrics        // Current performance data
  feedback: UserFeedback[]       // User research insights
  constraints?: string[]         // Business or technical constraints
}
```

## Evolution Contexts

### v1 → v2: Scale & Moat

**Trigger Conditions:**
- Product-market fit validated
- Revenue or user traction achieved
- Clear demand for expansion
- Technical debt becoming limiting

**Focus Areas:**
- Feature expansion
- UX depth for power users
- Data moat creation
- Infrastructure scaling
- Monetization introduction

### v2 → v3: Category King

**Trigger Conditions:**
- Revenue milestone achieved
- Enterprise demand emerging
- Platform requests from partners
- Category leadership visible

**Focus Areas:**
- Platformization (APIs, SDKs)
- Enterprise features
- Compliance certifications
- Advanced ML/personalization
- Internationalization

## Process

### Phase 1: Current State Analysis

Evaluate the current product state:

1. **Metrics Review**
   - Activation rate
   - Retention (D1, D7, D30)
   - Feature usage distribution
   - Performance metrics
   - Error rates

2. **Feedback Synthesis**
   - Top feature requests
   - Pain points
   - Churned user reasons
   - Power user patterns
   - Support ticket themes

3. **Technical Assessment**
   - Technical debt inventory
   - Performance bottlenecks
   - Security posture gaps
   - Scalability limits

4. **Competitive Landscape**
   - New entrants
   - Feature parity gaps
   - Differentiation opportunities

### Phase 2: Evolution Planning

Plan the version transition:

1. **Feature Delta**
   ```typescript
   interface FeatureDelta {
     new: Feature[]        // Features to add
     enhanced: Feature[]   // Features to improve
     deprecated: Feature[] // Features to remove
     unchanged: Feature[]  // Features to keep
   }
   ```

2. **Architecture Delta**
   ```typescript
   interface ArchitectureDelta {
     newComponents: Component[]
     modifiedComponents: Component[]
     removedComponents: Component[]
     newIntegrations: Integration[]
     scalingChanges: ScalingChange[]
   }
   ```

3. **Data Model Delta**
   ```typescript
   interface DataModelDelta {
     newEntities: Entity[]
     modifiedEntities: EntityModification[]
     migrations: Migration[]
     backfills: Backfill[]
   }
   ```

4. **Brand Evolution**
   - What can evolve (expansion)
   - What must not change (core identity)
   - New brand moments to add

### Phase 3: Feature Specification

For each new/enhanced feature:

1. **Feature Definition**
   - Problem statement
   - Solution approach
   - Success criteria
   - Failure modes

2. **User Impact**
   - Affected personas
   - Journey changes
   - Learning curve

3. **Technical Specification**
   - API changes
   - Data requirements
   - Performance impact
   - Security considerations

4. **UI Specification**
   - New screens
   - Modified screens
   - State changes
   - Accessibility updates

### Phase 4: Deprecation Planning

For each deprecated feature:

1. **Impact Assessment**
   - Users affected
   - Usage patterns
   - Data dependencies

2. **Migration Path**
   - Alternative solution
   - Data export
   - Timeline

3. **Communication Plan**
   - Announcement
   - Documentation
   - Support resources

### Phase 5: Architecture Evolution

Update system architecture:

1. **Scaling Changes**
   - New regions
   - Read replicas
   - Caching layers
   - Queue systems

2. **New Services**
   - Service boundaries
   - Communication patterns
   - Deployment strategy

3. **Integration Updates**
   - New external services
   - API versioning
   - Deprecation of old APIs

4. **Security Hardening**
   - New threat vectors
   - Compliance requirements
   - Audit logging

### Phase 6: Design System Evolution

Update design system:

1. **Color Palette**
   - New semantic colors (if needed)
   - Enterprise theme support (v3)
   - White-labeling support (v3)

2. **Component Library**
   - New components
   - Component variants
   - Accessibility improvements

3. **Motion System**
   - New interaction patterns
   - Performance optimizations
   - Platform-specific behaviors

4. **Typography**
   - Additional weights (if needed)
   - Localization support (v3)

### Phase 7: Brand DNA Update

Carefully evolve brand:

1. **Preserved Elements**
   - Core archetype
   - Primary emotional signature
   - Fundamental visual motifs
   - Brand guardrails

2. **Evolved Elements**
   - Extended color palette
   - Additional motion patterns
   - Deepened verbal maturity
   - New brand moments

3. **New Elements**
   - Enterprise voice (v3)
   - Partner communication (v3)
   - International adaptation (v3)

### Phase 8: Monetization Evolution

Update monetization:

1. **v2 Introduction**
   - Pricing model design
   - Tier structure
   - Free vs. paid boundary
   - Trial experience

2. **v3 Expansion**
   - Enterprise pricing
   - Volume discounts
   - Custom contracts
   - Partner revenue share

### Phase 9: Code Updates

Generate code changes:

1. **Database Migrations**
   - Schema changes
   - Data backfills
   - Index updates

2. **API Updates**
   - New endpoints
   - Modified endpoints
   - Deprecated endpoints
   - Version negotiation

3. **UI Updates**
   - New pages
   - Modified components
   - Removed features
   - Feature flags

4. **Infrastructure**
   - New services
   - Configuration changes
   - Monitoring updates

### Phase 10: Task Planning

Generate evolution tasks.md:

1. **Pre-Evolution**
   - Data backups
   - Feature flags setup
   - Monitoring preparation

2. **Core Evolution**
   - Database migrations
   - Service deployments
   - UI rollout

3. **Post-Evolution**
   - Deprecation enforcement
   - Cleanup tasks
   - Documentation updates

## Output

```typescript
interface EvolveProductOutput {
  evolutionPlan: EvolutionPlan
  updatedProductSpec: ProductSpec
  updatedArchitecture: ArchitectureSpec
  updatedBrandDNA: BrandDNA
  updatedDesignSystem: DesignSystem
  updatedUIFlows: UIFlows
  migrations: Migration[]
  codeChanges: CodeChange[]
  tasks: TaskPlan
  deprecationPlan: DeprecationPlan
  communicationPlan: CommunicationPlan
}
```

## Quality Checklist

Before completing:

- [ ] All changes traced to user feedback or metrics
- [ ] Backward compatibility addressed
- [ ] Migration paths documented
- [ ] Brand consistency maintained
- [ ] Performance impact assessed
- [ ] Security implications reviewed
- [ ] Accessibility preserved or improved
- [ ] Deprecation communicated
- [ ] Rollback plan exists
- [ ] Team capacity considered

## Anti-Patterns to Avoid

1. **Feature Bloat**
   - Adding features without removing
   - No prioritization
   - Everything is P0

2. **Breaking Changes**
   - Removing features without notice
   - API breaks without versioning
   - Data loss without migration

3. **Brand Drift**
   - Changing core identity
   - Inconsistent evolution
   - Trend-chasing

4. **Technical Neglect**
   - Ignoring debt
   - Skipping migrations
   - Security shortcuts

## Version

Task Prompt Version: 1.0
