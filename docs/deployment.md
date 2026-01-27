# Deployment

## Overview

Oaxe is designed for edge-first deployment on Vercel with PostgreSQL, Redis, and optional vector storage.

## Architecture

```
                    ┌─────────────────────────────────────┐
                    │            Vercel Edge              │
                    │  ┌─────────────────────────────┐   │
     Internet ──────│──│     Edge Middleware         │   │
                    │  │  - Auth validation          │   │
                    │  │  - Rate limiting            │   │
                    │  │  - Geo routing              │   │
                    │  └─────────────────────────────┘   │
                    │              │                      │
                    │              ▼                      │
                    │  ┌─────────────────────────────┐   │
                    │  │     Edge Functions          │   │
                    │  │  - Static pages             │   │
                    │  │  - API routes (simple)      │   │
                    │  │  - Streaming responses      │   │
                    │  └─────────────────────────────┘   │
                    └──────────────┬──────────────────────┘
                                   │
                                   ▼
                    ┌─────────────────────────────────────┐
                    │          Vercel Serverless          │
                    │  ┌─────────────────────────────┐   │
                    │  │     Node.js Functions       │   │
                    │  │  - LLM orchestration        │   │
                    │  │  - Heavy computation        │   │
                    │  │  - Database writes          │   │
                    │  └─────────────────────────────┘   │
                    └──────────────┬──────────────────────┘
                                   │
          ┌────────────────────────┼────────────────────────┐
          │                        │                        │
          ▼                        ▼                        ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   PostgreSQL    │    │     Redis       │    │   Blob Store    │
│   (Neon/Supa)   │    │   (Upstash)     │    │  (Vercel Blob)  │
│                 │    │                 │    │                 │
│ - User data     │    │ - Cache         │    │ - Generated     │
│ - Projects      │    │ - Sessions      │    │   repos         │
│ - Generations   │    │ - Rate limits   │    │ - Assets        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Environment Variables

### Required

```bash
# Database
DATABASE_URL="postgresql://..."
DATABASE_URL_UNPOOLED="postgresql://..."

# Redis
UPSTASH_REDIS_REST_URL="https://..."
UPSTASH_REDIS_REST_TOKEN="..."

# Authentication
AUTH_SECRET="..."
AUTH_GOOGLE_ID="..."
AUTH_GOOGLE_SECRET="..."

# LLM Providers
OPENAI_API_KEY="sk-..."
ANTHROPIC_API_KEY="sk-ant-..."

# Blob Storage
BLOB_READ_WRITE_TOKEN="..."
```

### Optional

```bash
# Analytics
VERCEL_ANALYTICS_ID="..."
POSTHOG_KEY="..."

# Error Tracking
SENTRY_DSN="..."

# Feature Flags
LAUNCHDARKLY_SDK_KEY="..."

# Vector Store (if using)
PINECONE_API_KEY="..."
PINECONE_ENVIRONMENT="..."
```

## Deployment Process

### 1. Initial Setup

```bash
# Install Vercel CLI
pnpm add -g vercel

# Link project
vercel link

# Set up environment variables
vercel env add DATABASE_URL
vercel env add OPENAI_API_KEY
# ... etc
```

### 2. Database Migration

```bash
# Generate migration
pnpm db:generate

# Push to production
pnpm db:push --production
```

### 3. Deploy

```bash
# Preview deployment
vercel

# Production deployment
vercel --prod
```

### 4. Verify

```bash
# Check deployment
vercel ls

# View logs
vercel logs
```

## CI/CD Pipeline

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'

      - run: pnpm install
      - run: pnpm lint
      - run: pnpm typecheck
      - run: pnpm test

  deploy-preview:
    needs: test
    if: github.event_name == 'pull_request'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}

  deploy-production:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

## Environments

### Development

```
URL: localhost:3000
Database: Local PostgreSQL or Neon dev branch
Redis: Local Redis or Upstash dev
LLM: Same keys, lower rate limits
```

### Preview

```
URL: *.vercel.app (per-PR)
Database: Neon preview branch
Redis: Upstash preview
LLM: Same keys, lower rate limits
```

### Production

```
URL: oaxe.xyz
Database: Neon production
Redis: Upstash production
LLM: Production keys, full rate limits
```

## Database Branching

Using Neon for database branching:

```bash
# Create preview branch (automatic with Vercel integration)
# Branch is created per PR

# Manual branch creation
neonctl branches create --name preview-123

# Delete branch
neonctl branches delete preview-123
```

## Scaling Configuration

### Vercel Settings

```json
// vercel.json
{
  "functions": {
    "api/generate/**": {
      "maxDuration": 60,
      "memory": 1024
    },
    "api/**": {
      "maxDuration": 30,
      "memory": 512
    }
  },
  "regions": ["iad1", "sfo1", "cdg1", "hnd1"],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

### Edge Config

```typescript
// For feature flags and quick config
import { get } from '@vercel/edge-config'

export const config = { runtime: 'edge' }

export async function GET() {
  const featureEnabled = await get('new_feature_enabled')
  // ...
}
```

## Rollback

### Via Vercel Dashboard

1. Go to Deployments
2. Find previous production deployment
3. Click "..." menu
4. Select "Promote to Production"

### Via CLI

```bash
# List deployments
vercel ls

# Promote specific deployment
vercel promote [deployment-url]
```

## Monitoring

### Health Checks

```typescript
// app/api/health/route.ts
export async function GET() {
  const checks = {
    database: await checkDatabase(),
    redis: await checkRedis(),
    llm: await checkLLM(),
  }

  const healthy = Object.values(checks).every(c => c.ok)

  return Response.json(checks, {
    status: healthy ? 200 : 503
  })
}
```

### Alerting

Configure in Vercel dashboard:
- Deployment failures
- Function errors > threshold
- Latency > threshold
- Error rate > threshold

## Disaster Recovery

### Database Backups

- Neon: Continuous backup with point-in-time recovery
- Manual: `pg_dump` to Blob storage weekly

### Recovery Time Objectives

| Scenario | RTO | RPO |
|----------|-----|-----|
| Function failure | 0 (auto-retry) | 0 |
| Region failure | 5 min (auto-failover) | 0 |
| Database failure | 10 min | < 1 min |
| Complete outage | 1 hour | < 5 min |

## Cost Optimization

### Function Optimization

- Use edge runtime where possible (cheaper)
- Minimize cold starts with keep-warm
- Right-size memory allocation
- Use streaming for long operations

### Database Optimization

- Connection pooling via Neon
- Query optimization
- Index management
- Scale compute on-demand

### Caching Strategy

- Redis for hot data
- Vercel Edge Config for config
- CDN for static assets
- ISR for semi-static pages

## Related Documents

- [Architecture](./architecture.md)
- [Security](./security.md)
- [Performance](./performance.md)
- [Observability](./observability.md)
