# Atlas9

**Product Replication, Invention, Branding, and Evolution Engine**

Atlas9 is an autonomous system that generates production-grade software products from a single prompt. It replicates existing products faithfully, invents new category-defining products, generates distinctive brand identities, and evolves products through structured milestones.

## Capabilities

- **Product Cloning** — Infer full feature sets from product names. Generate faithful replicas with architecture, schemas, and UI flows.
- **Design Excellence** — Generate world-class UI that exceeds Vercel, Linear, Stripe, Notion, and Figma in visual quality.
- **Brand Identity** — Generate ownable visual identities, verbal tone, and Brand DNA that compounds over time.
- **Launch Virality** — Generate founder tweets, hero copy, screenshot specs, and activation loops optimized for elite dev/design Twitter.
- **Product Evolution** — Generate v1→v2→v3 roadmaps with feature progression, architecture scaling, and monetization paths.

## Quick Start

```bash
pnpm install
pnpm dev
```

## Usage

When prompted, provide a product directive:

```
Build Facebook
Build a Stripe-level billing dashboard
Build Linear but for legal case management
Invent a tool for async team rituals
```

Atlas9 will generate:

1. Product specification
2. Architecture diagram (textual)
3. Data model with schemas
4. API contract
5. UI flow map
6. Design system tokens
7. Brand DNA
8. Founder tweets + hero copy
9. Evolution roadmap (v1–v3)
10. Prompt updates
11. tasks.md with milestones
12. Code stubs (Next.js + API routes)

## Repository Structure

```
atlas9/
├── README.md                    # This file
├── tasks.md                     # Milestone-driven execution plan
├── brand/
│   └── dna.json                 # Brand DNA object
├── docs/
│   ├── index.md                 # Documentation index
│   ├── architecture.md          # System architecture
│   ├── data-flow.md             # Data flow diagrams
│   ├── deployment.md            # Deployment guide
│   ├── security.md              # Security posture
│   ├── observability.md         # Logs, traces, metrics
│   ├── performance.md           # Performance targets
│   ├── design-system.md         # Design system spec
│   ├── accessibility.md         # WCAG 2.2 AA compliance
│   ├── brand-dna.md             # Brand DNA documentation
│   ├── launch-playbook.md       # Launch strategy
│   └── evolution.md             # v1→v2→v3 roadmap
├── prompts/
│   ├── system/
│   │   └── v1.md                # Canonical system prompt
│   ├── tasks/
│   │   ├── build_product.md     # Product generation prompt
│   │   └── evolve_product.md    # Product evolution prompt
│   ├── partials/
│   │   ├── design.md            # Design partial
│   │   ├── safety.md            # Safety partial
│   │   ├── formatting.md        # Output formatting
│   │   ├── brand.md             # Brand generation
│   │   ├── virality.md          # Virality optimization
│   │   └── evolution.md         # Evolution planning
│   └── schemas/
│       └── product_spec.schema.json
├── adr/
│   └── 0001-initial-architecture.md
├── src/
│   ├── app/                     # Next.js App Router
│   ├── components/
│   │   ├── ui/                  # Base UI components
│   │   └── brand/               # Brand moment components
│   ├── lib/
│   │   ├── ai/                  # LLM orchestration
│   │   ├── db/                  # Database utilities
│   │   └── auth/                # Authentication
│   └── design/
│       ├── tokens/              # OKLCH color tokens
│       └── utils/               # Design utilities
└── public/                      # Static assets
```

## Engineering Standards

| Metric | Target |
|--------|--------|
| p95 Latency | < 1.2s globally |
| TTFB | < 300ms |
| WCAG | 2.2 AA |
| Scale | 1M+ MAU from day one |
| Architecture | Edge-first (Vercel-compatible) |
| AI UX | Streaming-first |

## Design Standards

**Typography**
- Serif for narrative + headings (editorial gravitas)
- Monospace for code, data, timestamps, IDs
- Optical sizing and baseline grid enforced

**Color**
- All colors as OKLCH tokens
- Light/dark via L adjustments only
- WCAG 2.2 AA contrast minimum
- No raw hex anywhere

**Texture**
- Subtle generative noise overlays
- Backgrounds and dividers only
- GPU cost < 2ms/frame

**Motion**
- Micro-interactions < 200ms
- No layout shift
- Reduced-motion supported
- Motion = state + causality + trust

**Layout**
- 8pt spacing system
- Typographic rhythm locked to grid
- Zero arbitrary values

## Design Benchmark

Every generated product must look better than:

- Vercel
- Linear
- Stripe
- Notion
- Figma

This is non-negotiable.

## Documentation

- [Architecture](/docs/architecture.md)
- [Design System](/docs/design-system.md)
- [Brand DNA](/docs/brand-dna.md)
- [Launch Playbook](/docs/launch-playbook.md)
- [Evolution Roadmap](/docs/evolution.md)
- [Security](/docs/security.md)
- [Performance](/docs/performance.md)
- [Accessibility](/docs/accessibility.md)

## License

Proprietary. All rights reserved.
