# Data Flow

## Overview

This document describes how data moves through Oaxe during product generation, from user directive to complete repository output.

## Primary Data Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           USER DIRECTIVE                                │
│                    "Build a Stripe-level billing dashboard"             │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         PRODUCT ENGINE                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │
│  │   Directive │  │   Feature   │  │   Persona   │  │   Journey   │   │
│  │   Parser    │──▶│   Inference │──▶│  Generator  │──▶│   Mapper    │   │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘   │
│                                                              │          │
│                                              ProductSpec ◀───┘          │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │
                    ┌───────────┴───────────┐
                    │                       │
                    ▼                       ▼
┌───────────────────────────┐  ┌───────────────────────────────────────────┐
│      BRAND ENGINE         │  │            ARCHITECTURE ENGINE            │
│  ┌─────────────┐         │  │  ┌─────────────┐  ┌─────────────┐        │
│  │  Archetype  │         │  │  │   System    │  │    Data     │        │
│  │  Selector   │         │  │  │   Diagram   │  │    Model    │        │
│  └──────┬──────┘         │  │  └──────┬──────┘  └──────┬──────┘        │
│         │                │  │         │                │               │
│  ┌──────▼──────┐         │  │  ┌──────▼──────┐  ┌──────▼──────┐        │
│  │   Visual    │         │  │  │     API     │  │   Schema    │        │
│  │  Signature  │         │  │  │   Contract  │  │  Generator  │        │
│  └──────┬──────┘         │  │  └──────┬──────┘  └──────┬──────┘        │
│         │                │  │         │                │               │
│  ┌──────▼──────┐         │  │         └────────┬───────┘               │
│  │   Verbal    │         │  │                  │                       │
│  │    Tone     │         │  │        ArchitectureSpec ◀────────────────┘
│  └──────┬──────┘         │  │
│         │                │  └───────────────────────────────────────────┘
│         │                │
│  BrandDNA ◀──────────────┘
│
└───────────────────────────────┬───────────────────────────────────────────┘
                                │
                    ┌───────────┴───────────┐
                    │                       │
                    ▼                       ▼
┌───────────────────────────┐  ┌───────────────────────────────────────────┐
│     DESIGN ENGINE         │  │            EVOLUTION ENGINE               │
│  ┌─────────────┐         │  │  ┌─────────────┐  ┌─────────────┐        │
│  │    Color    │         │  │  │     v1      │  │     v2      │        │
│  │  Generator  │         │  │  │    MVP      │  │   Scale     │        │
│  └──────┬──────┘         │  │  └──────┬──────┘  └──────┬──────┘        │
│         │                │  │         │                │               │
│  ┌──────▼──────┐         │  │  ┌──────▼──────┐  ┌──────▼──────┐        │
│  │ Typography  │         │  │  │     v3      │  │   Feature   │        │
│  │  Generator  │         │  │  │  Category   │  │ Progression │        │
│  └──────┬──────┘         │  │  └──────┬──────┘  └──────┬──────┘        │
│         │                │  │         │                │               │
│  ┌──────▼──────┐         │  │         └────────┬───────┘               │
│  │   Motion    │         │  │                  │                       │
│  │   System    │         │  │      EvolutionRoadmap ◀──────────────────┘
│  └──────┬──────┘         │  │
│         │                │  └───────────────────────────────────────────┘
│  DesignSystem ◀──────────┘
│
└───────────────────────────────┬───────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                           UI ENGINE                                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │
│  │    Flow     │  │   Screen    │  │   State     │  │ Interaction │   │
│  │   Mapper    │──▶│  Generator  │──▶│  Generator  │──▶│  Designer   │   │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘   │
│                                                              │          │
│                                                 UIFlows ◀────┘          │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         LAUNCH ENGINE                                   │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │
│  │   Tweet     │  │    Hero     │  │ Screenshot  │  │  Activation │   │
│  │  Generator  │──▶│    Copy     │──▶│    Spec     │──▶│    Loop     │   │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘   │
│                                                              │          │
│                                             LaunchAssets ◀───┘          │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                          CODE ENGINE                                    │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │
│  │    Page     │  │     API     │  │   Schema    │  │  Component  │   │
│  │  Generator  │──▶│  Generator  │──▶│  Generator  │──▶│  Generator  │   │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘   │
│                                                              │          │
│                                               CodeStubs ◀────┘          │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        OUTPUT ASSEMBLER                                 │
│                                                                         │
│  ProductSpec + BrandDNA + DesignSystem + ArchitectureSpec +            │
│  UIFlows + LaunchAssets + EvolutionRoadmap + CodeStubs                 │
│                              ↓                                          │
│                     Complete Repository                                 │
└─────────────────────────────────────────────────────────────────────────┘
```

## Data Objects

### ProductSpec

```typescript
interface ProductSpec {
  id: string
  name: string
  tagline: string
  category: string
  targetAudience: string[]

  features: Feature[]
  personas: Persona[]
  journeys: UserJourney[]

  successMetrics: Metric[]
  competitivePosition: CompetitiveAnalysis

  constraints: Constraint[]
  assumptions: Assumption[]
}
```

### BrandDNA

```typescript
interface BrandDNA {
  archetype: {
    primary: ArchetypeType
    secondary: ArchetypeType
    description: string
  }

  brandPromise: {
    statement: string
    proofPoints: string[]
    constraints: string[]
  }

  emotionalSignature: {
    primary: Emotion
    secondary: Emotion
    avoided: Emotion[]
    spectrum: EmotionSpectrum
  }

  visualSignature: VisualSignature
  verbalTone: VerbalTone
  iconography: IconographySpec
  guardrails: BrandGuardrails
}
```

### DesignSystem

```typescript
interface DesignSystem {
  typography: {
    families: FontFamily[]
    scale: TypeScale
    lineHeights: LineHeights
    weights: FontWeights
  }

  color: {
    mode: 'oklch'
    palette: ColorPalette
    lightTheme: ThemeColors
    darkTheme: ThemeColors
  }

  spacing: SpacingScale
  layout: LayoutSpec
  texture: TextureSpec
  motion: MotionSpec
  depth: DepthSpec

  components: ComponentSpec[]
}
```

### ArchitectureSpec

```typescript
interface ArchitectureSpec {
  systemDiagram: string

  components: Component[]
  boundaries: Boundary[]

  dataModel: {
    entities: Entity[]
    relationships: Relationship[]
    indexes: Index[]
  }

  apiContract: {
    endpoints: Endpoint[]
    schemas: Schema[]
    authentication: AuthSpec
  }

  infrastructure: {
    compute: ComputeSpec[]
    storage: StorageSpec[]
    caching: CacheSpec
  }

  scalingPlan: ScalingPlan
}
```

### UIFlows

```typescript
interface UIFlows {
  flows: Flow[]
  screens: Screen[]

  states: {
    loading: StateSpec[]
    empty: StateSpec[]
    error: StateSpec[]
  }

  interactions: Interaction[]
  brandMoments: BrandMoment[]
}
```

### LaunchAssets

```typescript
interface LaunchAssets {
  tweets: Tweet[]
  pinnedTweet: Tweet

  heroCopy: {
    headline: string
    subhead: string
    cta: string
  }

  screenshotSpec: ScreenshotSpec
  productHuntTagline: string

  activationLoop: ActivationLoop
  retentionLoop: RetentionLoop
}
```

### EvolutionRoadmap

```typescript
interface EvolutionRoadmap {
  v1: VersionSpec
  v2: VersionSpec
  v3: VersionSpec

  featureProgression: FeatureProgression[]
  architectureEvolution: ArchitectureEvolution[]
  monetizationEvolution: MonetizationEvolution[]
}

interface VersionSpec {
  theme: string
  targetDate: string

  features: {
    new: Feature[]
    deprecated: Feature[]
  }

  uxChanges: UXChange[]
  architectureChanges: ArchitectureChange[]
  dataModelChanges: DataModelChange[]

  performanceTargets: PerformanceTarget[]
  securityPosture: SecurityPosture

  monetization: MonetizationSpec
  teamImplications: TeamImplication[]
}
```

## Streaming Data Flow

All major generation operations use streaming for optimal UX.

```typescript
// Streaming interface
type GenerationStream = AsyncGenerator<StreamChunk, void, unknown>

interface StreamChunk {
  type: 'status' | 'partial' | 'complete' | 'error'
  stage: GenerationStage
  data: unknown
  progress: number // 0-100
}

type GenerationStage =
  | 'product_inference'
  | 'brand_generation'
  | 'design_generation'
  | 'architecture_generation'
  | 'ui_generation'
  | 'launch_generation'
  | 'evolution_generation'
  | 'code_generation'
  | 'assembly'
```

## Caching Layer

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          REQUEST                                        │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                       CACHE CHECK                                       │
│                                                                         │
│  Cache Key = hash(directive + promptVersion + brandDNA)                │
│                                                                         │
│  HIT ──────────────────────────────────────────────────────▶ Return    │
│                                                                         │
│  MISS ─────────────────────────────────────────────────────▶ Generate  │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                       GENERATION                                        │
│                                                                         │
│  1. Generate ProductSpec                                               │
│  2. Generate BrandDNA + DesignSystem + Architecture (parallel)         │
│  3. Generate UIFlows                                                   │
│  4. Generate LaunchAssets + Evolution (parallel)                       │
│  5. Generate CodeStubs                                                 │
│  6. Assemble Repository                                                │
│  7. Cache Result                                                       │
└─────────────────────────────────────────────────────────────────────────┘
```

### Cache TTLs

| Data Type | Cache | TTL | Invalidation |
|-----------|-------|-----|--------------|
| ProductSpec | Redis | 1 hour | Directive change |
| BrandDNA | Redis | 24 hours | Manual evolve |
| DesignSystem | Redis | 24 hours | Brand change |
| ArchitectureSpec | Redis | 1 hour | Spec change |
| UIFlows | Redis | 1 hour | Design change |
| LaunchAssets | Redis | 24 hours | Brand change |
| EvolutionRoadmap | Redis | 24 hours | Spec change |
| CodeStubs | Blob | Forever | Immutable |

## Error Handling Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         ERROR OCCURS                                    │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      ERROR CLASSIFICATION                               │
│                                                                         │
│  Transient (network, rate limit) ───────────▶ Retry with backoff       │
│                                                                         │
│  Validation (bad input) ────────────────────▶ Return error details     │
│                                                                         │
│  LLM (bad output) ──────────────────────────▶ Retry with feedback      │
│                                                                         │
│  System (infrastructure) ───────────────────▶ Alert + graceful degrade │
└─────────────────────────────────────────────────────────────────────────┘
```

## Observability

### Traces

Every generation request produces a trace:

```
trace_id: abc123
├── product_inference (250ms)
│   ├── directive_parse (50ms)
│   ├── feature_infer (100ms)
│   └── persona_generate (100ms)
├── brand_generation (500ms)
│   ├── archetype_select (100ms)
│   ├── visual_generate (200ms)
│   └── verbal_generate (200ms)
├── design_generation (400ms)
├── architecture_generation (600ms)
├── ui_generation (800ms)
├── launch_generation (300ms)
├── evolution_generation (400ms)
├── code_generation (1200ms)
└── assembly (100ms)

Total: 4550ms
```

### Metrics

| Metric | Type | Purpose |
|--------|------|---------|
| `generation.duration` | Histogram | Total generation time |
| `generation.stage.duration` | Histogram | Per-stage timing |
| `generation.tokens.input` | Counter | LLM input tokens |
| `generation.tokens.output` | Counter | LLM output tokens |
| `generation.cache.hit` | Counter | Cache hit rate |
| `generation.error` | Counter | Error count by type |

## Related Documents

- [Architecture](./architecture.md)
- [Performance](./performance.md)
- [Observability](./observability.md)
