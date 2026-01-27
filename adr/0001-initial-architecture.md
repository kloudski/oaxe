# ADR 0001: Initial Architecture

## Status

Accepted

## Date

2024-01-15

## Context

Oaxe is an autonomous product replication, invention, branding, and evolution engine. It needs to:

1. Accept user directives and generate complete product specifications
2. Generate production-grade code, design systems, and brand identities
3. Scale to 1M+ MAU from day one
4. Maintain p95 latency < 1.2s globally
5. Support streaming for all AI operations
6. Integrate with multiple LLM providers

We need to choose a foundational architecture that supports these requirements while remaining maintainable and cost-effective.

## Decision

We will adopt an **edge-first, streaming-first architecture** built on:

### Core Stack

| Layer | Technology | Rationale |
|-------|------------|-----------|
| Framework | Next.js 14+ (App Router) | Best-in-class streaming, edge support, DX |
| Deployment | Vercel | Native Next.js support, global edge, low ops burden |
| Database | PostgreSQL (Neon) | Serverless, branching, familiar, pgvector support |
| Cache | Redis (Upstash) | Serverless, global, low latency |
| Blob Storage | Vercel Blob | Integrated, edge-optimized |
| Auth | Clerk or Auth.js | Edge-compatible, social login, managed |
| LLM | OpenAI + Anthropic | Best quality, streaming support, redundancy |

### Architecture Layers

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                            │
│  Next.js App Router, React Server Components, Design System     │
└───────────────────────────────┬─────────────────────────────────┘
                                │
┌───────────────────────────────▼─────────────────────────────────┐
│                          EDGE LAYER                             │
│  Auth middleware, rate limiting, caching, geo-routing           │
└───────────────────────────────┬─────────────────────────────────┘
                                │
┌───────────────────────────────▼─────────────────────────────────┐
│                        ORIGIN LAYER                             │
│  Product Engine, Brand Engine, Design Engine, Evolution Engine  │
│  Prompt Router, Eval Harness, Code Generator                    │
└───────────────────────────────┬─────────────────────────────────┘
                                │
┌───────────────────────────────▼─────────────────────────────────┐
│                         DATA LAYER                              │
│  PostgreSQL (primary), Redis (cache), Blob (assets)             │
└─────────────────────────────────────────────────────────────────┘
```

### Key Patterns

1. **React Server Components** — Minimize client bundle, improve TTFB
2. **Streaming Responses** — All AI operations stream for perceived performance
3. **Edge Middleware** — Auth and rate limiting at the edge
4. **Connection Pooling** — Neon serverless driver for efficient DB access
5. **Deterministic Caching** — Hash-based cache keys for LLM responses

## Consequences

### Positive

1. **Global performance** — Edge deployment provides < 50ms to most users
2. **Streaming UX** — Users see progress immediately on long operations
3. **Scalability** — Serverless scales automatically with demand
4. **Developer experience** — Next.js + Vercel provides excellent DX
5. **Cost efficiency** — Pay-per-use model, no idle capacity
6. **Maintainability** — Managed services reduce ops burden

### Negative

1. **Vendor lock-in** — Tight coupling to Vercel ecosystem
2. **Cold starts** — Serverless functions have cold start latency
3. **Complexity** — Edge vs. origin decisions require careful thought
4. **Cost unpredictability** — Usage-based pricing can spike

### Risks

1. **Vercel pricing changes** — Mitigated by abstracting deployment layer
2. **LLM provider outages** — Mitigated by multi-provider fallback
3. **Database scaling** — Mitigated by read replicas, caching

## Alternatives Considered

### Alternative 1: Traditional Server Architecture

Deploy on EC2/GCE with containers.

**Rejected because:**
- Higher ops burden
- Manual scaling
- No edge deployment without CDN layer
- Slower iteration

### Alternative 2: Cloudflare Workers

Full edge deployment on Cloudflare.

**Rejected because:**
- Limited compute time for LLM operations
- Database connectivity challenges
- Less mature Next.js support
- Smaller ecosystem

### Alternative 3: AWS Lambda + CDK

Serverless on AWS with infrastructure-as-code.

**Rejected because:**
- Higher complexity
- Slower deployments
- More ops burden
- Less integrated streaming support

## Implementation Notes

### Phase 1: Foundation

1. Set up Next.js project with App Router
2. Configure Vercel deployment
3. Set up Neon database
4. Configure Upstash Redis
5. Implement auth with Clerk

### Phase 2: Core Engines

1. Implement Product Engine
2. Implement Brand Engine
3. Implement Design Engine
4. Implement Prompt Router

### Phase 3: Streaming

1. Implement streaming API routes
2. Implement streaming UI components
3. Add progress indicators

### Phase 4: Optimization

1. Add caching layer
2. Optimize cold starts
3. Add monitoring and alerting

## References

- [Next.js App Router Documentation](https://nextjs.org/docs/app)
- [Vercel Edge Functions](https://vercel.com/docs/functions/edge-functions)
- [Neon Serverless Driver](https://neon.tech/docs/serverless/serverless-driver)
- [Upstash Redis](https://upstash.com/docs/redis/overall/getstarted)
