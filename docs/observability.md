# Observability

## Overview

Oaxe implements comprehensive observability through logs, traces, and metrics. Every operation is instrumented for debugging, performance analysis, and cost tracking.

## Three Pillars

### Logs

Structured JSON logs for debugging and audit trails.

### Traces

Distributed tracing for request flow analysis.

### Metrics

Quantitative measurements for alerting and dashboards.

## Logging

### Log Format

```typescript
interface LogEntry {
  timestamp: string        // ISO 8601
  level: 'debug' | 'info' | 'warn' | 'error'
  message: string
  service: string
  traceId?: string
  spanId?: string
  userId?: string
  requestId?: string
  duration?: number
  error?: {
    name: string
    message: string
    stack?: string
  }
  metadata?: Record<string, unknown>
}
```

### Log Levels

| Level | Usage | Example |
|-------|-------|---------|
| debug | Development details | Query parameters, intermediate values |
| info | Normal operations | Request completed, job started |
| warn | Unexpected but handled | Rate limit approached, retry needed |
| error | Failures | Exception thrown, request failed |

### Structured Logging

```typescript
import { logger } from '@/lib/logger'

// Good - structured
logger.info('Generation completed', {
  projectId: project.id,
  duration: endTime - startTime,
  tokensUsed: response.usage.total_tokens,
})

// Bad - unstructured
console.log(`Generation completed for ${project.id} in ${duration}ms`)
```

### Logger Implementation

```typescript
// lib/logger.ts
import pino from 'pino'

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  formatters: {
    level: (label) => ({ level: label }),
  },
  timestamp: () => `,"timestamp":"${new Date().toISOString()}"`,
  redact: ['password', 'apiKey', 'token', 'secret'],
})

export function createRequestLogger(requestId: string) {
  return logger.child({ requestId })
}
```

## Tracing

### Trace Structure

```
Trace: generate-product-abc123
│
├── Span: parse-directive (50ms)
│   └── Attributes: directive_length=45
│
├── Span: infer-features (200ms)
│   ├── Span: llm-call (180ms)
│   │   └── Attributes: model=gpt-4, tokens_in=500, tokens_out=1200
│   └── Attributes: features_count=15
│
├── Span: generate-brand (400ms)
│   ├── Span: select-archetype (100ms)
│   ├── Span: generate-visual (150ms)
│   └── Span: generate-verbal (150ms)
│
├── Span: generate-design (350ms)
│   ├── Span: generate-colors (100ms)
│   ├── Span: generate-typography (100ms)
│   └── Span: generate-motion (150ms)
│
└── Span: assemble-output (50ms)

Total Duration: 1050ms
```

### OpenTelemetry Setup

```typescript
// lib/tracing.ts
import { trace, SpanStatusCode } from '@opentelemetry/api'

const tracer = trace.getTracer('oaxe')

export async function withSpan<T>(
  name: string,
  fn: () => Promise<T>,
  attributes?: Record<string, string | number>
): Promise<T> {
  return tracer.startActiveSpan(name, async (span) => {
    try {
      if (attributes) {
        Object.entries(attributes).forEach(([key, value]) => {
          span.setAttribute(key, value)
        })
      }

      const result = await fn()
      span.setStatus({ code: SpanStatusCode.OK })
      return result
    } catch (error) {
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: error.message
      })
      span.recordException(error)
      throw error
    } finally {
      span.end()
    }
  })
}
```

### Usage

```typescript
export async function generateProduct(directive: string) {
  return withSpan('generate-product', async () => {
    const spec = await withSpan('infer-features', () =>
      inferFeatures(directive),
      { directive_length: directive.length }
    )

    const brand = await withSpan('generate-brand', () =>
      generateBrand(spec)
    )

    // ...
  })
}
```

## Metrics

### Metric Types

| Type | Usage | Example |
|------|-------|---------|
| Counter | Cumulative counts | Requests, errors, tokens |
| Gauge | Current value | Active connections, queue size |
| Histogram | Distribution | Latency, response size |

### Key Metrics

#### Request Metrics

```typescript
// HTTP request metrics
http_requests_total{method, path, status}
http_request_duration_seconds{method, path}
http_request_size_bytes{method, path}
http_response_size_bytes{method, path}
```

#### Generation Metrics

```typescript
// Generation pipeline metrics
generation_total{type, status}
generation_duration_seconds{type, stage}
generation_tokens_total{provider, model, direction}
generation_cost_dollars{provider, model}
generation_cache_hits_total{type}
```

#### LLM Metrics

```typescript
// LLM provider metrics
llm_requests_total{provider, model, status}
llm_request_duration_seconds{provider, model}
llm_tokens_input_total{provider, model}
llm_tokens_output_total{provider, model}
llm_rate_limit_hits_total{provider}
```

#### Business Metrics

```typescript
// Business metrics
projects_created_total
users_active_total
generations_successful_total
```

### Prometheus Format

```typescript
// lib/metrics.ts
import { Counter, Histogram, Registry } from 'prom-client'

export const registry = new Registry()

export const httpRequestsTotal = new Counter({
  name: 'http_requests_total',
  help: 'Total HTTP requests',
  labelNames: ['method', 'path', 'status'],
  registers: [registry],
})

export const httpRequestDuration = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP request duration in seconds',
  labelNames: ['method', 'path'],
  buckets: [0.1, 0.3, 0.5, 1, 2, 5],
  registers: [registry],
})

export const generationTokensTotal = new Counter({
  name: 'generation_tokens_total',
  help: 'Total tokens used in generation',
  labelNames: ['provider', 'model', 'direction'],
  registers: [registry],
})
```

### Metrics Endpoint

```typescript
// app/api/metrics/route.ts
import { registry } from '@/lib/metrics'

export async function GET() {
  const metrics = await registry.metrics()

  return new Response(metrics, {
    headers: {
      'Content-Type': registry.contentType,
    },
  })
}
```

## Dashboards

### Request Dashboard

| Panel | Visualization | Query |
|-------|---------------|-------|
| Request Rate | Time series | `rate(http_requests_total[5m])` |
| Error Rate | Time series | `rate(http_requests_total{status=~"5.."}[5m])` |
| Latency p50/p95/p99 | Time series | `histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))` |
| Top Endpoints | Table | `topk(10, sum by (path) (rate(http_requests_total[5m])))` |

### Generation Dashboard

| Panel | Visualization | Query |
|-------|---------------|-------|
| Generation Rate | Time series | `rate(generation_total[5m])` |
| Success Rate | Gauge | `sum(rate(generation_total{status="success"}[5m])) / sum(rate(generation_total[5m]))` |
| Token Usage | Time series | `rate(generation_tokens_total[5m])` |
| Cost | Time series | `sum(increase(generation_cost_dollars[1h]))` |
| Cache Hit Rate | Gauge | `sum(rate(generation_cache_hits_total[5m])) / sum(rate(generation_total[5m]))` |

### LLM Dashboard

| Panel | Visualization | Query |
|-------|---------------|-------|
| Provider Requests | Time series by provider | `rate(llm_requests_total[5m])` |
| Provider Latency | Time series | `histogram_quantile(0.95, rate(llm_request_duration_seconds_bucket[5m]))` |
| Token Usage by Model | Stacked bar | `sum by (model) (rate(llm_tokens_total[1h]))` |
| Rate Limit Events | Time series | `rate(llm_rate_limit_hits_total[5m])` |

## Alerting

### Alert Rules

```yaml
# alerts.yml
groups:
  - name: oaxe
    rules:
      - alert: HighErrorRate
        expr: |
          sum(rate(http_requests_total{status=~"5.."}[5m]))
          / sum(rate(http_requests_total[5m])) > 0.05
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: High error rate detected
          description: Error rate is {{ $value | humanizePercentage }}

      - alert: HighLatency
        expr: |
          histogram_quantile(0.95,
            sum(rate(http_request_duration_seconds_bucket[5m])) by (le)
          ) > 2
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: High latency detected
          description: p95 latency is {{ $value }}s

      - alert: LLMRateLimited
        expr: rate(llm_rate_limit_hits_total[5m]) > 0
        for: 1m
        labels:
          severity: warning
        annotations:
          summary: LLM rate limiting detected

      - alert: HighTokenUsage
        expr: |
          sum(increase(generation_tokens_total[1h])) > 1000000
        for: 10m
        labels:
          severity: warning
        annotations:
          summary: High token usage
          description: Used {{ $value }} tokens in the last hour
```

### Alert Routing

| Severity | Channel | Response Time |
|----------|---------|---------------|
| critical | PagerDuty | Immediate |
| warning | Slack #alerts | 15 minutes |
| info | Slack #monitoring | Best effort |

## Cost Tracking

### Token Cost Calculation

```typescript
const TOKEN_COSTS = {
  'gpt-4': { input: 0.03 / 1000, output: 0.06 / 1000 },
  'gpt-4-turbo': { input: 0.01 / 1000, output: 0.03 / 1000 },
  'gpt-3.5-turbo': { input: 0.0005 / 1000, output: 0.0015 / 1000 },
  'claude-3-opus': { input: 0.015 / 1000, output: 0.075 / 1000 },
  'claude-3-sonnet': { input: 0.003 / 1000, output: 0.015 / 1000 },
}

export function calculateCost(
  model: string,
  inputTokens: number,
  outputTokens: number
): number {
  const costs = TOKEN_COSTS[model]
  if (!costs) return 0

  return (inputTokens * costs.input) + (outputTokens * costs.output)
}
```

### Cost Dashboard

| Panel | Description |
|-------|-------------|
| Daily Cost | Rolling 24h total |
| Cost by Model | Breakdown by LLM model |
| Cost by Feature | Breakdown by generation type |
| Cost per User | Average cost per active user |
| Projected Monthly | Extrapolated monthly cost |

## Debug Tools

### Request Inspector

```typescript
// Middleware to attach debug info
export function debugMiddleware(request: NextRequest) {
  const requestId = crypto.randomUUID()

  const response = NextResponse.next()
  response.headers.set('X-Request-ID', requestId)

  // Log request details
  logger.debug('Request received', {
    requestId,
    method: request.method,
    path: request.nextUrl.pathname,
    userAgent: request.headers.get('user-agent'),
  })

  return response
}
```

### Trace Viewer

Access traces via:
- Vercel Dashboard → Logs → Trace view
- OpenTelemetry collector → Jaeger UI
- Datadog APM (if configured)

## Integration

### Vercel

Native integration via Vercel Analytics and Logs.

### Sentry

```typescript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 0.1,
  environment: process.env.VERCEL_ENV,
})
```

### Datadog (Optional)

```typescript
import { datadogLogs } from '@datadog/browser-logs'

datadogLogs.init({
  clientToken: process.env.NEXT_PUBLIC_DD_CLIENT_TOKEN,
  site: 'datadoghq.com',
  service: 'oaxe',
  env: process.env.VERCEL_ENV,
})
```

## Related Documents

- [Architecture](./architecture.md)
- [Performance](./performance.md)
- [Security](./security.md)
