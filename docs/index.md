# Atlas9 Documentation

## Overview

Atlas9 is an autonomous product replication, invention, branding, and evolution engine. This documentation covers all aspects of the system.

## Quick Navigation

### Core Concepts
- [Architecture](./architecture.md) — System design and component boundaries
- [Data Flow](./data-flow.md) — How data moves through the system
- [Design System](./design-system.md) — Visual language and components

### Brand & Identity
- [Brand DNA](./brand-dna.md) — Brand identity generation system
- [Launch Playbook](./launch-playbook.md) — Viral launch strategies

### Product Evolution
- [Evolution Roadmap](./evolution.md) — v1→v2→v3 progression framework

### Operations
- [Deployment](./deployment.md) — Deployment procedures
- [Security](./security.md) — Security posture and practices
- [Observability](./observability.md) — Monitoring and debugging
- [Performance](./performance.md) — Performance targets and optimization

### Accessibility
- [Accessibility](./accessibility.md) — WCAG 2.2 AA compliance

### Architecture Decisions
- [ADR Index](/adr/) — Architecture Decision Records

## System Requirements

| Requirement | Specification |
|-------------|---------------|
| Node.js | >= 20.x |
| pnpm | >= 8.x |
| Database | PostgreSQL 15+ |
| Edge Runtime | Vercel Edge / Cloudflare Workers |
| LLM Provider | OpenAI / Anthropic / Local |

## Performance Targets

| Metric | Target | Rationale |
|--------|--------|-----------|
| p95 Latency | < 1.2s | Global user experience |
| TTFB | < 300ms | Core Web Vitals |
| LCP | < 2.5s | Core Web Vitals |
| FID | < 100ms | Core Web Vitals |
| CLS | < 0.1 | Core Web Vitals |
| Lighthouse | > 90 | All categories |

## Design Quality Benchmark

All generated UI must exceed:

1. **Vercel** — Precision and restraint
2. **Linear** — Density and usability
3. **Stripe** — Polish and trust
4. **Notion** — Flexibility and clarity
5. **Figma** — Power and approachability

## Prompt System

The system uses versioned prompts located in `/prompts`:

```
prompts/
├── system/v1.md          # Canonical system prompt
├── tasks/                # Task-specific prompts
├── partials/             # Composable prompt fragments
└── schemas/              # Output schemas
```

All prompts are treated as production code with versioning, testing, and rollback capabilities.

## Getting Started

1. Clone the repository
2. Install dependencies: `pnpm install`
3. Configure environment: `cp .env.example .env`
4. Initialize database: `pnpm db:push`
5. Start development: `pnpm dev`

## Support

- GitHub Issues for bugs and features
- Architecture decisions require ADRs
- Design decisions require Brand DNA alignment verification
