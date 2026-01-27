# Safety Partial

Include this partial when generating outputs that require safety considerations.

## Security Principles

1. **Least Privilege** — Minimum necessary access
2. **Defense in Depth** — Multiple protection layers
3. **Secure by Default** — Safe defaults, explicit opt-in
4. **Fail Secure** — Errors result in denial
5. **Audit Everything** — Complete operation trail

## Input Validation

### All User Input

Every user input must be validated:

```typescript
// Schema validation with Zod
const inputSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  content: z.string().max(10000),
})

// Validate before processing
const result = inputSchema.safeParse(input)
if (!result.success) {
  throw new ValidationError(result.error)
}
```

### Sanitization

HTML content must be sanitized:

```typescript
import DOMPurify from 'isomorphic-dompurify'

const clean = DOMPurify.sanitize(userHtml, {
  ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p'],
  ALLOWED_ATTR: ['href'],
})
```

## SQL Injection Prevention

Always use parameterized queries:

```typescript
// Safe - parameterized
const user = await db
  .select()
  .from(users)
  .where(eq(users.email, email))

// NEVER do this
// db.execute(`SELECT * FROM users WHERE email = '${email}'`)
```

## XSS Prevention

### Content Security Policy

```
default-src 'self';
script-src 'self' 'unsafe-inline';
style-src 'self' 'unsafe-inline';
img-src 'self' data: https:;
connect-src 'self' https://api.*;
frame-ancestors 'none';
```

### Output Encoding

React encodes by default. For raw HTML:

```tsx
// Only with sanitization
<div
  dangerouslySetInnerHTML={{
    __html: DOMPurify.sanitize(content)
  }}
/>
```

## Authentication

### Session Security

- JWT with short expiry (24h)
- Secure, HttpOnly, SameSite=Strict cookies
- Token rotation on sensitive operations
- Immediate invalidation on logout

### Password Requirements

- Minimum 12 characters
- Breached password check
- Bcrypt with cost factor 12
- No security questions

## Authorization

### Role-Based Access

```typescript
enum Permission {
  READ = 'read',
  WRITE = 'write',
  DELETE = 'delete',
  ADMIN = 'admin',
}

// Check before every operation
if (!hasPermission(user, Permission.WRITE, resource)) {
  throw new ForbiddenError()
}
```

### Resource-Level Checks

```typescript
// Always verify ownership
const project = await db.project.findUnique({
  where: { id: projectId },
})

if (project.userId !== currentUser.id) {
  throw new ForbiddenError()
}
```

## Rate Limiting

### Implementation

```typescript
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'),
})

// Apply to all endpoints
const { success } = await ratelimit.limit(identifier)
if (!success) {
  return new Response('Rate limited', { status: 429 })
}
```

### Limits by Endpoint

| Endpoint | Limit | Window |
|----------|-------|--------|
| Auth | 5 | 1 min |
| Generate | 10 | 1 min |
| API | 100 | 1 min |

## Secrets Management

### Environment Variables

- Never commit secrets
- Use platform secret management
- Separate by environment
- Rotate regularly

### Secret Patterns

```typescript
// Redact in logs
const redactedConfig = {
  ...config,
  apiKey: '[REDACTED]',
  password: '[REDACTED]',
}
logger.info('Config loaded', redactedConfig)
```

## CSRF Protection

### SameSite Cookies

```typescript
cookies().set('session', token, {
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
})
```

### Origin Validation

```typescript
const origin = request.headers.get('Origin')
if (!allowedOrigins.includes(origin)) {
  return new Response('Forbidden', { status: 403 })
}
```

## Security Headers

```typescript
const headers = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=()',
  'Strict-Transport-Security': 'max-age=31536000',
}
```

## Dependency Security

### Automated Scanning

- Run `pnpm audit` in CI
- Use Snyk or Dependabot
- Review before merging updates

### Lockfile Integrity

```bash
# Always use lockfile
pnpm install --frozen-lockfile
```

## Audit Logging

### What to Log

| Event | Retention |
|-------|-----------|
| Auth events | 90 days |
| Authorization failures | 90 days |
| Data access | 90 days |
| Admin actions | 1 year |
| Security events | 1 year |

### Log Format

```typescript
interface AuditLog {
  timestamp: string
  eventType: string
  actor: { id: string; type: string; ip?: string }
  action: string
  resource: { type: string; id: string }
  outcome: 'success' | 'failure'
  metadata?: Record<string, unknown>
}
```

## LLM Safety

### Prompt Injection Prevention

- Validate prompt structure
- Escape user content in prompts
- Use system prompts for instructions
- Monitor for injection patterns

### Output Validation

- Validate LLM output structure
- Sanitize before rendering
- Filter sensitive content
- Rate limit generation

## Incident Response

### Severity Levels

| Level | Response |
|-------|----------|
| P0 Critical | Immediate |
| P1 High | 4 hours |
| P2 Medium | 24 hours |
| P3 Low | 1 week |

### Response Steps

1. Detect
2. Contain
3. Investigate
4. Remediate
5. Recover
6. Review

## Output Format

When generating security-related artifacts:

```typescript
interface SecurityOutput {
  authConfig: AuthConfig
  rateLimits: RateLimitConfig[]
  headers: SecurityHeaders
  validationSchemas: ValidationSchema[]
  auditConfig: AuditConfig
  incidentPlan: IncidentPlan
}
```
