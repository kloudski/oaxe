# Evolution Partial

Include this partial when generating product evolution roadmaps.

## Evolution Philosophy

1. **Ship v1 fast** — Speed to market beats feature completeness
2. **Earn v2** — User traction justifies expansion
3. **Build moats in v2** — Data, network effects, integrations
4. **Platformize in v3** — Ecosystem creates defensibility
5. **Never break trust** — Evolution adds value, never removes it

## Version Framework

### v1 — Unfair MVP

**Timeline:** 2-4 weeks from start

**Objective:** Dominate a specific niche with a focused, polished solution.

**Characteristics:**
- Minimum viable feature set (5-10 features)
- Maximum polish on core flow
- Single, clear value proposition
- One signature interaction
- One brand moment screen
- Obvious technical shortcuts (documented)
- Clear activation and retention loop

**Success Criteria:**
- Users say "finally, someone built this"
- Core flow completion > 80%
- D7 retention > 15%
- Organic word-of-mouth visible

**Allowed Shortcuts:**
- Single database region
- Basic error handling
- Minimal admin tooling
- Manual customer support
- No analytics deep-dives
- No internationalization
- No enterprise features

### v2 — Scale & Moat

**Timeline:** 3-6 months post-launch

**Objective:** Expand feature set, build defensibility, introduce monetization.

**Characteristics:**
- Feature expansion (20-40 features)
- UX depth (power user features)
- Data moat creation
- Infrastructure scaling
- Monetization introduction
- Team growth support

**Success Criteria:**
- Revenue or clear path to revenue
- D30 retention > 25%
- Power users emerging
- Competitors attempting to copy

**Moat Types:**
1. **Data moat** — User data improves product
2. **Network effects** — More users = more value
3. **Integration depth** — Workflow lock-in
4. **Brand affinity** — Users identify with product
5. **Switching costs** — Data, learning curve

### v3 — Category King

**Timeline:** 12-24 months post-launch

**Objective:** Own the category, platform for ecosystem, enterprise-ready.

**Characteristics:**
- Platform capabilities (APIs, webhooks, SDKs)
- Ecosystem (integrations, partners, marketplace)
- Enterprise features (SSO, audit logs, compliance)
- Advanced personalization / ML
- Internationalization
- Category-defining positioning

**Success Criteria:**
- Category associated with product name
- Enterprise customers paying premium
- Third-party integrations built organically
- Acquisition interest or IPO trajectory

## Feature Progression

### Core Feature Lifecycle

```
Idea → v1 MVP → v2 Enhanced → v3 Platform
         │           │            │
         │           │            └── API exposure
         │           └── Power user features
         └── Basic implementation
```

### Feature Addition Rules

| Version | Add When |
|---------|----------|
| v1 | Critical path only |
| v2 | Top 3 requests + moat builders |
| v3 | Platform enablers + enterprise |

### Feature Removal Rules

| Safe to Remove | Never Remove |
|----------------|--------------|
| < 5% usage | Core workflow |
| Redundant | Paid features |
| Tech debt | Data access |
| Failed experiments | Active integrations |

## Architecture Evolution

### v1 Architecture

```
┌─────────────────────────────────────┐
│            Single Region            │
│  ┌─────────┐      ┌─────────┐      │
│  │ Next.js │──────│   DB    │      │
│  └─────────┘      └─────────┘      │
└─────────────────────────────────────┘
```

**Characteristics:**
- Monolithic
- Single region
- Basic caching
- Direct DB access

### v2 Architecture

```
┌─────────────────────────────────────┐
│              Edge Layer             │
│  ┌─────────┐      ┌─────────┐      │
│  │  Edge   │      │   CDN   │      │
│  └────┬────┘      └────┬────┘      │
└───────┼────────────────┼────────────┘
        │                │
┌───────┼────────────────┼────────────┐
│       ▼                ▼            │
│  ┌─────────┐      ┌─────────┐      │
│  │ Origin  │      │  Cache  │      │
│  └────┬────┘      └────┬────┘      │
│       │                │            │
│       ▼                ▼            │
│  ┌─────────┐      ┌─────────┐      │
│  │Primary  │      │ Replica │      │
│  └─────────┘      └─────────┘      │
└─────────────────────────────────────┘
```

**Additions:**
- Edge layer
- Read replicas
- Caching layer
- Queue for async
- Monitoring

### v3 Architecture

```
┌─────────────────────────────────────┐
│           Global Edge               │
│  Multiple regions, auto-routing     │
└───────────────┬─────────────────────┘
                │
┌───────────────┼─────────────────────┐
│               ▼                     │
│  ┌────────────────────────┐        │
│  │     API Gateway        │        │
│  │  Auth, Rate Limit, Log │        │
│  └───────────┬────────────┘        │
│              │                      │
│    ┌─────────┼─────────┐           │
│    │         │         │           │
│    ▼         ▼         ▼           │
│ ┌─────┐  ┌─────┐  ┌─────┐         │
│ │Svc A│  │Svc B│  │Svc C│         │
│ └──┬──┘  └──┬──┘  └──┬──┘         │
│    │         │         │           │
│    └─────────┼─────────┘           │
│              ▼                      │
│      ┌──────────────┐              │
│      │ Data Layer   │              │
│      │ Sharded, Geo │              │
│      └──────────────┘              │
└─────────────────────────────────────┘
```

**Additions:**
- Service decomposition
- API gateway
- Global distribution
- Data sharding
- ML pipeline

## Monetization Evolution

### v1: Free

- No monetization
- Focus on adoption
- Gather usage data

### v2: Freemium

```
Free Tier:
- Core features
- Usage limits
- Community support

Pro Tier ($X/mo):
- Advanced features
- Higher limits
- Priority support
```

### v3: Enterprise

```
Free Tier:
- Unchanged

Pro Tier:
- Individual professionals

Team Tier ($X/user/mo):
- Collaboration
- Shared resources
- Team admin

Enterprise (Custom):
- SSO/SAML
- Audit logs
- Compliance
- Custom contracts
- Dedicated support
```

## Compliance Evolution

### v1: Basic

- Privacy policy
- Terms of service
- Cookie consent

### v2: Standard

- GDPR basics
- Data export
- Account deletion
- Security overview

### v3: Enterprise

- SOC 2 Type II
- GDPR full compliance
- HIPAA (if applicable)
- Industry certifications
- Vendor security questionnaire

## Team Evolution

### v1 Team

- 1-3 people
- Generalists
- Founder-led

### v2 Team

- 5-15 people
- Specialists emerging
- Function leads

### v3 Team

- 20-50+ people
- Full functions
- Management layers
- Platform teams

## Transition Triggers

### v1 → v2 Triggers

- [ ] Revenue > $10K MRR or 10K users
- [ ] Core metrics healthy
- [ ] Clear demand for expansion
- [ ] Team capacity exists
- [ ] Technical foundation stable

### v2 → v3 Triggers

- [ ] Revenue > $100K MRR or 100K users
- [ ] Enterprise inbound requests
- [ ] Platform requests from partners
- [ ] Category leadership visible
- [ ] Team ready to scale

## Anti-Patterns

### Premature v2

- Adding features before v1 proven
- Scaling before product-market fit
- Monetizing before value delivery
- Building moats without users

### Premature v3

- Enterprise features before revenue
- Platform before adoption
- Compliance before customers need it
- Global before regional success

### Evolution Debt

- Skipping migrations
- Keeping dead features
- Ignoring technical debt
- Inconsistent brand evolution

## Output Format

When generating evolution roadmaps:

```typescript
interface EvolutionOutput {
  v1: {
    theme: string
    features: Feature[]
    shortcuts: Shortcut[]
    architecture: ArchitectureSpec
    activationLoop: string
    retentionLoop: string
    metrics: Metric[]
    timeline: string
  }
  v2: {
    theme: string
    features: {
      new: Feature[]
      enhanced: Feature[]
      deprecated: Feature[]
    }
    moatStrategy: MoatStrategy
    architectureChanges: ArchitectureChange[]
    monetization: MonetizationSpec
    metrics: Metric[]
    timeline: string
  }
  v3: {
    theme: string
    platformFeatures: Feature[]
    enterpriseFeatures: Feature[]
    ecosystemPlan: EcosystemPlan
    compliancePlan: CompliancePlan
    internationalization: i18nPlan
    architectureChanges: ArchitectureChange[]
    metrics: Metric[]
    timeline: string
  }
  transitions: {
    v1ToV2: TransitionTrigger[]
    v2ToV3: TransitionTrigger[]
  }
}
```
