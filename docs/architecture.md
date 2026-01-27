# Architecture

## Overview

Oaxe follows an edge-first, streaming-first architecture optimized for global performance and AI-native workflows.

## System Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              CLIENT LAYER                               │
├─────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │
│  │   Next.js   │  │   Design    │  │    Brand    │  │   Motion    │   │
│  │  App Router │  │   System    │  │   Moments   │  │   System    │   │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘   │
│         │                │                │                │           │
│         └────────────────┴────────────────┴────────────────┘           │
│                                   │                                     │
└───────────────────────────────────┼─────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                              EDGE LAYER                                 │
├─────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │
│  │    Edge     │  │   Streaming │  │    Auth     │  │    Cache    │   │
│  │   Runtime   │  │   Handler   │  │  Middleware │  │   Strategy  │   │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘   │
│         │                │                │                │           │
│         └────────────────┴────────────────┴────────────────┘           │
│                                   │                                     │
└───────────────────────────────────┼─────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                             ORIGIN LAYER                                │
├─────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │
│  │     API     │  │   Prompt    │  │   Product   │  │   Brand     │   │
│  │   Routes    │  │   Router    │  │   Engine    │  │   Engine    │   │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘   │
│         │                │                │                │           │
│  ┌──────┴──────┐  ┌──────┴──────┐  ┌──────┴──────┐  ┌──────┴──────┐   │
│  │   Design    │  │  Evolution  │  │   Launch    │  │   Eval      │   │
│  │   Engine    │  │   Engine    │  │   Engine    │  │   Harness   │   │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘   │
│         │                │                │                │           │
│         └────────────────┴────────────────┴────────────────┘           │
│                                   │                                     │
└───────────────────────────────────┼─────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                              DATA LAYER                                 │
├─────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │
│  │  PostgreSQL │  │    Redis    │  │   Vector    │  │    Blob     │   │
│  │   (Primary) │  │   (Cache)   │  │    Store    │  │   Storage   │   │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                           EXTERNAL SERVICES                             │
├─────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │
│  │     LLM     │  │    Auth     │  │  Analytics  │  │  Observ-    │   │
│  │  Providers  │  │  Provider   │  │   Service   │  │  ability    │   │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
```

## Component Boundaries

### Client Layer

| Component | Responsibility | Runtime |
|-----------|----------------|---------|
| App Router | Page routing, layouts, streaming | Browser |
| Design System | UI components, tokens, variants | Browser |
| Brand Moments | Hero sections, signature interactions | Browser |
| Motion System | Animations, transitions, reduced-motion | Browser |

### Edge Layer

| Component | Responsibility | Runtime |
|-----------|----------------|---------|
| Edge Runtime | Request handling, routing | Vercel Edge |
| Streaming Handler | SSE, chunked responses | Vercel Edge |
| Auth Middleware | JWT validation, session management | Vercel Edge |
| Cache Strategy | CDN, stale-while-revalidate | Vercel Edge |

### Origin Layer

| Component | Responsibility | Runtime |
|-----------|----------------|---------|
| API Routes | Business logic, data mutations | Node.js |
| Prompt Router | Prompt selection, versioning | Node.js |
| Product Engine | Product specification generation | Node.js |
| Brand Engine | Brand DNA generation | Node.js |
| Design Engine | Design system generation | Node.js |
| Evolution Engine | Roadmap generation | Node.js |
| Launch Engine | Viral asset generation | Node.js |
| Eval Harness | Prompt evaluation, regression testing | Node.js |

### Data Layer

| Component | Purpose | Technology |
|-----------|---------|------------|
| PostgreSQL | Primary data store | Neon / Supabase |
| Redis | Caching, rate limiting | Upstash |
| Vector Store | Embeddings, similarity search | Pinecone / pgvector |
| Blob Storage | Generated assets, exports | Vercel Blob / S3 |

## Core Engines

### Product Engine

Transforms user directives into complete product specifications.

```typescript
interface ProductEngine {
  infer(directive: string): Promise<ProductSpec>
  validate(spec: ProductSpec): ValidationResult
  expand(spec: ProductSpec): Promise<ExpandedSpec>
}
```

**Responsibilities:**
- Feature inference from product names
- User persona generation
- Journey mapping
- Success metrics definition
- Competitive positioning

### Brand Engine

Generates distinctive, ownable brand identities.

```typescript
interface BrandEngine {
  generate(spec: ProductSpec): Promise<BrandDNA>
  validate(dna: BrandDNA): ValidationResult
  evolve(dna: BrandDNA, feedback: Feedback): Promise<BrandDNA>
}
```

**Responsibilities:**
- Archetype selection
- Visual signature generation
- Verbal tone codification
- Guardrail establishment

### Design Engine

Generates production-grade design systems.

```typescript
interface DesignEngine {
  generate(dna: BrandDNA): Promise<DesignSystem>
  generateTokens(dna: BrandDNA): Promise<DesignTokens>
  generateComponents(tokens: DesignTokens): Promise<ComponentSpecs>
}
```

**Responsibilities:**
- OKLCH color generation
- Typography system
- Spacing system
- Component specifications
- Motion system

### Evolution Engine

Generates time-aware product roadmaps.

```typescript
interface EvolutionEngine {
  plan(spec: ProductSpec, dna: BrandDNA): Promise<EvolutionRoadmap>
  advanceVersion(roadmap: EvolutionRoadmap): Promise<VersionSpec>
}
```

**Responsibilities:**
- v1 MVP definition
- v2 scaling plan
- v3 category expansion
- Technical debt tracking
- Compliance roadmap

### Launch Engine

Generates viral launch assets.

```typescript
interface LaunchEngine {
  generateTweets(dna: BrandDNA): Promise<Tweet[]>
  generateHeroCopy(dna: BrandDNA): Promise<HeroCopy>
  generateScreenshotSpec(dna: BrandDNA): Promise<ScreenshotSpec>
}
```

**Responsibilities:**
- Founder tweet generation
- Hero copy optimization
- Screenshot composition
- Activation loop design

## Streaming Architecture

All AI operations use streaming for optimal UX.

```typescript
// Streaming response pattern
async function* generateProduct(directive: string) {
  yield { type: 'status', message: 'Analyzing directive...' }

  const spec = await productEngine.infer(directive)
  yield { type: 'spec', data: spec }

  yield { type: 'status', message: 'Generating brand...' }

  for await (const chunk of brandEngine.stream(spec)) {
    yield { type: 'brand', data: chunk }
  }

  // Continue for design, evolution, launch...
}
```

## Caching Strategy

| Data Type | Cache | TTL | Invalidation |
|-----------|-------|-----|--------------|
| Product specs | Redis | 1h | On regenerate |
| Brand DNA | Redis | 24h | On evolve |
| Design tokens | CDN | 7d | On version |
| Generated code | Blob | Forever | Immutable |
| LLM responses | Redis | 1h | On prompt version |

## Security Boundaries

```
┌─────────────────────────────────────────┐
│              PUBLIC ZONE                │
│  - Static assets                        │
│  - Public API (rate-limited)            │
│  - Landing pages                        │
└───────────────────┬─────────────────────┘
                    │ Auth Middleware
                    ▼
┌─────────────────────────────────────────┐
│           AUTHENTICATED ZONE            │
│  - User projects                        │
│  - Generation APIs                      │
│  - User data                            │
└───────────────────┬─────────────────────┘
                    │ Role Check
                    ▼
┌─────────────────────────────────────────┐
│              ADMIN ZONE                 │
│  - System configuration                 │
│  - Prompt management                    │
│  - Analytics access                     │
└─────────────────────────────────────────┘
```

## Scalability Path

### 1K MAU
- Single region deployment
- Shared database
- Basic caching

### 100K MAU
- Multi-region edge deployment
- Read replicas
- Aggressive caching
- Queue-based generation

### 1M+ MAU
- Global edge presence
- Sharded database
- Dedicated LLM capacity
- Custom model fine-tuning

## Technology Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Framework | Next.js 14+ | App Router, streaming, edge |
| Styling | Tailwind + OKLCH | Design token integration |
| Database | PostgreSQL | Relational + pgvector |
| ORM | Drizzle | Type-safe, edge-compatible |
| Auth | Clerk / Auth.js | Edge-compatible, social login |
| LLM | OpenAI + Anthropic | Quality, streaming, fallback |
| Deployment | Vercel | Edge, streaming, DX |
| Observability | Vercel + Sentry | Integrated, low-overhead |

## Related Documents

- [Data Flow](./data-flow.md)
- [Security](./security.md)
- [Performance](./performance.md)
- [ADR-0001: Initial Architecture](/adr/0001-initial-architecture.md)
