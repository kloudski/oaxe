# Security

## Overview

Atlas9 implements defense-in-depth security across all layers. Security is not optional—it's infrastructure.

## Security Principles

1. **Least Privilege** — Components have minimum necessary access
2. **Defense in Depth** — Multiple layers of protection
3. **Secure by Default** — Safe defaults, explicit opt-in for risk
4. **Fail Secure** — Errors result in denial, not bypass
5. **Audit Everything** — Complete trail of sensitive operations

## Threat Model

### Assets

| Asset | Sensitivity | Protection Priority |
|-------|-------------|---------------------|
| User credentials | Critical | Highest |
| API keys | Critical | Highest |
| User data | High | High |
| Generated code | Medium | Medium |
| Usage metrics | Low | Standard |

### Threat Actors

| Actor | Capability | Motivation |
|-------|------------|------------|
| Script kiddie | Low | Curiosity, vandalism |
| Competitor | Medium | Intelligence gathering |
| Organized crime | High | Data theft, ransom |
| Nation state | Very high | Espionage |

### Attack Vectors

| Vector | Risk | Mitigation |
|--------|------|------------|
| Authentication bypass | High | MFA, rate limiting, secure sessions |
| Injection (SQL, XSS, etc.) | High | Parameterized queries, CSP, sanitization |
| API abuse | Medium | Rate limiting, authentication, validation |
| Supply chain | Medium | Dependency scanning, lockfiles, SBOMs |
| Social engineering | Medium | Security training, verification procedures |
| DDoS | Medium | CDN, rate limiting, auto-scaling |

## Authentication

### Provider

Using Clerk or Auth.js with the following configuration:

```typescript
// Secure session configuration
export const authConfig = {
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  jwt: {
    maxAge: 24 * 60 * 60,
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
}
```

### Session Security

- JWT tokens with short expiry (24h)
- Secure, HttpOnly, SameSite=Strict cookies
- Token rotation on sensitive operations
- Immediate invalidation on logout

### Password Policy

- Minimum 12 characters
- No common passwords (haveibeenpwned check)
- Bcrypt with cost factor 12
- No password hints or security questions

## Authorization

### Role-Based Access Control

```typescript
enum Role {
  USER = 'user',
  ADMIN = 'admin',
  SYSTEM = 'system',
}

enum Permission {
  READ_PROJECT = 'read:project',
  WRITE_PROJECT = 'write:project',
  DELETE_PROJECT = 'delete:project',
  GENERATE = 'generate',
  ADMIN = 'admin',
}

const rolePermissions: Record<Role, Permission[]> = {
  [Role.USER]: [
    Permission.READ_PROJECT,
    Permission.WRITE_PROJECT,
    Permission.GENERATE,
  ],
  [Role.ADMIN]: [
    Permission.READ_PROJECT,
    Permission.WRITE_PROJECT,
    Permission.DELETE_PROJECT,
    Permission.GENERATE,
    Permission.ADMIN,
  ],
  [Role.SYSTEM]: Object.values(Permission),
}
```

### Resource-Level Authorization

```typescript
async function canAccessProject(
  userId: string,
  projectId: string
): Promise<boolean> {
  const project = await db.project.findUnique({
    where: { id: projectId },
    include: { members: true },
  })

  if (!project) return false

  return project.members.some(m => m.userId === userId)
}
```

## Input Validation

### Schema Validation

All inputs validated with Zod:

```typescript
const createProjectSchema = z.object({
  name: z.string().min(1).max(100).regex(/^[a-zA-Z0-9-_]+$/),
  directive: z.string().min(10).max(10000),
})

export async function POST(request: Request) {
  const body = await request.json()
  const result = createProjectSchema.safeParse(body)

  if (!result.success) {
    return Response.json(
      { error: 'Validation failed', details: result.error.issues },
      { status: 400 }
    )
  }

  // Proceed with validated data
}
```

### Sanitization

```typescript
import DOMPurify from 'isomorphic-dompurify'

function sanitizeHtml(input: string): string {
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
    ALLOWED_ATTR: ['href'],
  })
}
```

## SQL Injection Prevention

Using Drizzle ORM with parameterized queries:

```typescript
// Safe - parameterized
const user = await db
  .select()
  .from(users)
  .where(eq(users.email, email))

// Never do this
// db.execute(`SELECT * FROM users WHERE email = '${email}'`)
```

## XSS Prevention

### Content Security Policy

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  response.headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Needed for Next.js
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self'",
      "connect-src 'self' https://api.openai.com https://api.anthropic.com",
      "frame-ancestors 'none'",
    ].join('; ')
  )

  return response
}
```

### Output Encoding

React handles this by default. For raw HTML:

```typescript
// Never use dangerouslySetInnerHTML with user input
// If necessary, sanitize first:
<div
  dangerouslySetInnerHTML={{
    __html: DOMPurify.sanitize(userContent)
  }}
/>
```

## CSRF Protection

### SameSite Cookies

```typescript
cookies().set('session', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  path: '/',
})
```

### Token Validation

```typescript
// For non-cookie auth, validate Origin header
export async function POST(request: Request) {
  const origin = request.headers.get('Origin')
  const allowedOrigins = ['https://atlas9.dev']

  if (!allowedOrigins.includes(origin ?? '')) {
    return Response.json({ error: 'Invalid origin' }, { status: 403 })
  }

  // Proceed
}
```

## Rate Limiting

### Implementation

```typescript
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'),
  analytics: true,
})

export async function middleware(request: NextRequest) {
  const ip = request.ip ?? '127.0.0.1'
  const { success, limit, reset, remaining } = await ratelimit.limit(ip)

  if (!success) {
    return Response.json(
      { error: 'Rate limit exceeded' },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': remaining.toString(),
          'X-RateLimit-Reset': reset.toString(),
        },
      }
    )
  }

  return NextResponse.next()
}
```

### Limits by Endpoint

| Endpoint | Limit | Window |
|----------|-------|--------|
| `/api/auth/*` | 5 | 1 minute |
| `/api/generate` | 10 | 1 minute |
| `/api/*` | 100 | 1 minute |
| `/*` | 1000 | 1 minute |

## Secrets Management

### Environment Variables

- Never commit secrets
- Use Vercel environment variables
- Separate per environment
- Rotate regularly

### Secret Rotation

```typescript
// Support multiple API keys during rotation
const apiKeys = [
  process.env.OPENAI_API_KEY,
  process.env.OPENAI_API_KEY_PREVIOUS,
].filter(Boolean)

async function callOpenAI(prompt: string) {
  for (const key of apiKeys) {
    try {
      return await openai.chat.completions.create({
        // ...
      }, { apiKey: key })
    } catch (error) {
      if (error.status === 401) continue // Try next key
      throw error
    }
  }
  throw new Error('All API keys failed')
}
```

## Dependency Security

### Automated Scanning

```yaml
# .github/workflows/security.yml
name: Security

on:
  schedule:
    - cron: '0 0 * * *'
  push:
    branches: [main]

jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: pnpm audit

  snyk:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
```

### Lockfile Integrity

```bash
# Always use lockfile
pnpm install --frozen-lockfile

# In CI
pnpm install --frozen-lockfile --ignore-scripts
```

## Audit Logging

### What to Log

| Event | Data | Retention |
|-------|------|-----------|
| Authentication | User, IP, success/fail | 90 days |
| Authorization failure | User, resource, permission | 90 days |
| Data access | User, resource, action | 90 days |
| Admin actions | Admin, action, target | 1 year |
| Security events | Details | 1 year |

### Log Format

```typescript
interface AuditLog {
  timestamp: string
  eventType: string
  actor: {
    id: string
    type: 'user' | 'system' | 'api'
    ip?: string
  }
  action: string
  resource: {
    type: string
    id: string
  }
  outcome: 'success' | 'failure'
  metadata?: Record<string, unknown>
}
```

## Incident Response

### Severity Levels

| Level | Description | Response Time |
|-------|-------------|---------------|
| P0 | Active exploit, data breach | Immediate |
| P1 | Vulnerability in production | 4 hours |
| P2 | Security bug, no exploit | 24 hours |
| P3 | Hardening opportunity | 1 week |

### Response Procedure

1. **Detect** — Automated alerts or reports
2. **Contain** — Limit blast radius
3. **Investigate** — Determine scope and cause
4. **Remediate** — Fix the vulnerability
5. **Recover** — Restore normal operations
6. **Review** — Post-incident analysis

## Compliance

### GDPR

- Data minimization
- Purpose limitation
- Right to access
- Right to deletion
- Data portability
- Privacy by design

### SOC 2 (v3 Target)

- Security
- Availability
- Processing integrity
- Confidentiality
- Privacy

## Security Headers

```typescript
// Applied via middleware
const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
}
```

## Related Documents

- [Architecture](./architecture.md)
- [Deployment](./deployment.md)
- [Observability](./observability.md)
