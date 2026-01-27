# Performance

## Overview

Atlas9 targets world-class performance to support 1M+ MAU from day one. Every architectural decision optimizes for speed, efficiency, and scalability.

## Performance Targets

### Core Metrics

| Metric | Target | Critical Threshold |
|--------|--------|-------------------|
| p50 Latency | < 400ms | < 600ms |
| p95 Latency | < 1.2s | < 2s |
| p99 Latency | < 2s | < 5s |
| TTFB | < 300ms | < 500ms |
| Error Rate | < 0.1% | < 1% |
| Availability | 99.9% | 99.5% |

### Core Web Vitals

| Metric | Target | Good | Needs Improvement |
|--------|--------|------|-------------------|
| LCP | < 2.5s | < 2.5s | < 4s |
| FID | < 100ms | < 100ms | < 300ms |
| CLS | < 0.1 | < 0.1 | < 0.25 |
| INP | < 200ms | < 200ms | < 500ms |

### Generation Performance

| Operation | Target | Notes |
|-----------|--------|-------|
| Product inference | < 5s | With streaming |
| Brand generation | < 10s | With streaming |
| Design generation | < 8s | With streaming |
| Full generation | < 60s | With streaming |
| Code stub generation | < 30s | With streaming |

## Architecture for Performance

### Edge-First

```
User Request
    │
    ▼
┌─────────────────────────────────────┐
│         Vercel Edge Network         │
│  - 30+ regions worldwide            │
│  - < 50ms to nearest POP            │
│  - Static assets served from edge   │
│  - Auth validation at edge          │
└───────────────┬─────────────────────┘
                │
                ▼ (only if needed)
┌─────────────────────────────────────┐
│         Origin (Serverless)         │
│  - Compute-intensive operations     │
│  - Database access                  │
│  - LLM calls                        │
└─────────────────────────────────────┘
```

### Streaming-First

All AI operations use streaming for perceived performance:

```typescript
// Stream partial results as they're generated
export async function* generateProduct(directive: string) {
  // Immediate feedback
  yield { type: 'status', message: 'Analyzing...' }

  // Stream as available
  for await (const feature of inferFeatures(directive)) {
    yield { type: 'feature', data: feature }
  }

  // Continue streaming...
}
```

## Caching Strategy

### Cache Layers

```
Request
    │
    ▼
┌─────────────────────────────────────┐
│           Browser Cache             │
│  - Static assets (1 year)           │
│  - API responses (SWR)              │
└───────────────┬─────────────────────┘
                │ MISS
                ▼
┌─────────────────────────────────────┐
│             CDN Cache               │
│  - Static pages                     │
│  - ISR pages                        │
│  - Public API responses             │
└───────────────┬─────────────────────┘
                │ MISS
                ▼
┌─────────────────────────────────────┐
│           Redis Cache               │
│  - User sessions                    │
│  - Generated content                │
│  - LLM responses                    │
└───────────────┬─────────────────────┘
                │ MISS
                ▼
┌─────────────────────────────────────┐
│            Origin/DB                │
└─────────────────────────────────────┘
```

### Cache TTLs

| Content | Location | TTL | Strategy |
|---------|----------|-----|----------|
| Static assets | CDN | 1 year | Immutable, hash-based |
| HTML pages | CDN | 1 hour | ISR with revalidation |
| API (public) | CDN | 5 min | stale-while-revalidate |
| API (user) | Redis | 5 min | On-demand invalidation |
| LLM responses | Redis | 1 hour | Hash-based key |
| Generated code | Blob | Forever | Immutable |

### Cache Keys

```typescript
// Deterministic cache keys for LLM responses
function generateCacheKey(params: {
  prompt: string
  model: string
  temperature: number
  version: string
}): string {
  const hash = crypto
    .createHash('sha256')
    .update(JSON.stringify(params))
    .digest('hex')
    .slice(0, 16)

  return `llm:${params.model}:${params.version}:${hash}`
}
```

## Database Performance

### Connection Pooling

```typescript
// Using Neon serverless driver
import { neon } from '@neondatabase/serverless'

// Pooled connection for serverless
const sql = neon(process.env.DATABASE_URL)
```

### Query Optimization

```typescript
// Use indexes
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_generations_project_id ON generations(project_id);
CREATE INDEX idx_generations_created_at ON generations(created_at);

// Avoid N+1
const projects = await db
  .select()
  .from(projects)
  .where(eq(projects.userId, userId))
  .leftJoin(generations, eq(generations.projectId, projects.id))
  .limit(20)

// Use cursor pagination
const projects = await db
  .select()
  .from(projects)
  .where(gt(projects.id, cursor))
  .orderBy(projects.id)
  .limit(20)
```

### Read Replicas

For read-heavy operations:

```typescript
// Write to primary
await db.insert(projects).values(project)

// Read from replica
const project = await readReplica
  .select()
  .from(projects)
  .where(eq(projects.id, id))
```

## Frontend Performance

### Bundle Optimization

```typescript
// next.config.js
module.exports = {
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
}
```

### Code Splitting

```typescript
// Dynamic imports for heavy components
const Editor = dynamic(() => import('@/components/editor'), {
  loading: () => <EditorSkeleton />,
})

// Route-based splitting (automatic with App Router)
// app/dashboard/page.tsx
// app/project/[id]/page.tsx
```

### Image Optimization

```typescript
import Image from 'next/image'

// Automatic optimization
<Image
  src="/hero.png"
  width={1200}
  height={675}
  alt="Hero"
  priority // For LCP images
  placeholder="blur"
/>
```

### Font Optimization

```typescript
// app/layout.tsx
import { Inter, Newsreader, JetBrains_Mono } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
})

const newsreader = Newsreader({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-serif',
})

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
})
```

## LLM Performance

### Request Optimization

```typescript
// Parallel calls when independent
const [brand, design, architecture] = await Promise.all([
  generateBrand(spec),
  generateDesign(spec),
  generateArchitecture(spec),
])

// Streaming for long operations
const stream = await openai.chat.completions.create({
  model: 'gpt-4-turbo',
  messages,
  stream: true,
})

for await (const chunk of stream) {
  yield chunk.choices[0]?.delta?.content || ''
}
```

### Token Optimization

```typescript
// Minimize input tokens
const systemPrompt = compressPrompt(fullSystemPrompt)

// Use cheaper models for simple tasks
const model = isComplexTask ? 'gpt-4-turbo' : 'gpt-3.5-turbo'

// Cache repeated prompts
const cachedResponse = await cache.get(cacheKey)
if (cachedResponse) return cachedResponse
```

### Fallback Strategy

```typescript
async function callLLM(params: LLMParams) {
  try {
    // Primary: GPT-4
    return await openai.chat.completions.create(params)
  } catch (error) {
    if (error.status === 429) {
      // Fallback: Claude
      return await anthropic.messages.create(convertParams(params))
    }
    throw error
  }
}
```

## Monitoring Performance

### Real User Monitoring

```typescript
// Using Web Vitals
import { onCLS, onFID, onLCP, onINP, onTTFB } from 'web-vitals'

function sendToAnalytics(metric) {
  // Send to your analytics endpoint
  fetch('/api/analytics', {
    method: 'POST',
    body: JSON.stringify(metric),
  })
}

onCLS(sendToAnalytics)
onFID(sendToAnalytics)
onLCP(sendToAnalytics)
onINP(sendToAnalytics)
onTTFB(sendToAnalytics)
```

### Synthetic Monitoring

```typescript
// Scheduled performance checks
// Using Vercel Cron or external service

export async function GET() {
  const start = performance.now()

  // Test critical paths
  await fetch(`${process.env.BASE_URL}/api/health`)
  await fetch(`${process.env.BASE_URL}/dashboard`)

  const duration = performance.now() - start

  if (duration > 1000) {
    await alertSlack(`Synthetic check slow: ${duration}ms`)
  }

  return Response.json({ duration })
}
```

## Performance Budget

### JavaScript

| Metric | Budget |
|--------|--------|
| Initial JS | < 100KB gzipped |
| Route JS | < 50KB gzipped |
| Total JS | < 300KB gzipped |

### CSS

| Metric | Budget |
|--------|--------|
| Critical CSS | < 14KB (inline) |
| Total CSS | < 50KB gzipped |

### Images

| Metric | Budget |
|--------|--------|
| Hero image | < 200KB |
| Thumbnails | < 30KB each |
| Icons | SVG preferred |

## Performance Checklist

### Pre-Launch

- [ ] Lighthouse score > 90 all categories
- [ ] Core Web Vitals passing
- [ ] Bundle size within budget
- [ ] No layout shift
- [ ] Images optimized
- [ ] Fonts optimized
- [ ] Caching configured
- [ ] CDN configured

### Ongoing

- [ ] Weekly performance review
- [ ] RUM dashboard monitored
- [ ] Synthetic tests running
- [ ] Bundle size tracked
- [ ] Database query analysis
- [ ] LLM cost/latency tracked

## Related Documents

- [Architecture](./architecture.md)
- [Observability](./observability.md)
- [Deployment](./deployment.md)
