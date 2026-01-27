# Formatting Partial

Include this partial to ensure consistent output formatting.

## Response Structure

All outputs follow a consistent structure:

```
## Section Heading

Brief description of what follows.

### Subsection

Details organized logically.

| Column 1 | Column 2 |
|----------|----------|
| Data     | Data     |

\`\`\`language
code block
\`\`\`
```

## Code Block Formatting

### TypeScript/JavaScript

```typescript
// Interface definitions
interface Example {
  id: string
  name: string
  createdAt: Date
}

// Function signatures
async function processData(input: Input): Promise<Output> {
  // Implementation
}
```

### SQL

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### JSON

```json
{
  "key": "value",
  "nested": {
    "array": [1, 2, 3]
  }
}
```

### CSS

```css
.component {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}
```

## Table Formatting

### Specification Tables

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| id | string | Yes | Unique identifier |
| name | string | Yes | Display name |
| status | enum | No | Current status |

### Comparison Tables

| Feature | v1 | v2 | v3 |
|---------|----|----|-----|
| Feature A | ✓ | ✓ | ✓ |
| Feature B | - | ✓ | ✓ |
| Feature C | - | - | ✓ |

### Metrics Tables

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| p95 Latency | < 1.2s | 0.8s | ✓ |
| Error Rate | < 0.1% | 0.05% | ✓ |

## List Formatting

### Ordered Lists (Sequential Steps)

1. First step
2. Second step
3. Third step

### Unordered Lists (Non-Sequential)

- Item one
- Item two
- Item three

### Nested Lists

- Category A
  - Sub-item 1
  - Sub-item 2
- Category B
  - Sub-item 1

### Checklist

- [ ] Task to complete
- [x] Completed task

## Diagram Formatting

### ASCII Architecture

```
┌─────────────────────────────────────┐
│           Component Name            │
├─────────────────────────────────────┤
│  ┌─────────┐      ┌─────────┐      │
│  │  Box A  │──────│  Box B  │      │
│  └────┬────┘      └────┬────┘      │
│       │                │           │
│       └───────┬────────┘           │
│               ▼                    │
│         ┌─────────┐                │
│         │  Box C  │                │
│         └─────────┘                │
└─────────────────────────────────────┘
```

### Flow Diagrams

```
Input ──▶ Process ──▶ Output
            │
            ▼
         Validate
            │
      ┌─────┴─────┐
      │           │
   Success     Error
      │           │
      ▼           ▼
   Continue    Handle
```

## File Path Formatting

```
project/
├── src/
│   ├── app/
│   │   ├── page.tsx
│   │   └── layout.tsx
│   ├── components/
│   │   └── ui/
│   └── lib/
├── docs/
└── tests/
```

## Specification Formatting

### Feature Specification

```markdown
## Feature: [Name]

### Overview
Brief description of the feature.

### User Story
As a [persona], I want to [action] so that [benefit].

### Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

### Technical Requirements
- Requirement 1
- Requirement 2

### UI Requirements
- Screen: [Name]
- States: Loading, Empty, Error, Success
- Interactions: [List]

### Performance Requirements
- Target latency: X ms
- Target throughput: X req/s

### Security Requirements
- Authentication: Required
- Authorization: [Level]
- Data sensitivity: [Level]
```

### API Endpoint Specification

```markdown
## Endpoint: [Method] [Path]

### Description
What this endpoint does.

### Authentication
Required / Optional / None

### Request
\`\`\`typescript
interface Request {
  // Body schema
}
\`\`\`

### Response
\`\`\`typescript
interface Response {
  // Response schema
}
\`\`\`

### Errors
| Code | Description |
|------|-------------|
| 400 | Bad request |
| 401 | Unauthorized |
| 404 | Not found |

### Example
\`\`\`bash
curl -X POST /api/resource \
  -H "Authorization: Bearer token" \
  -d '{"key": "value"}'
\`\`\`
```

## Inline Formatting

- **Bold** for emphasis
- `code` for inline code, file names, commands
- *italic* for introducing terms
- [links](url) for references

## Quotations

> Use blockquotes for important callouts or quotes.

## Warnings and Notes

**Note:** Important information.

**Warning:** Critical information requiring attention.

**Deprecated:** Feature being removed.

## Version Markers

```
Version: 1.0.0
Last Updated: YYYY-MM-DD
Status: Draft | Review | Final
```

## Prohibited Formatting

- No emojis in specifications
- No marketing language
- No vague qualifiers ("very", "really")
- No speculation without marking
- No incomplete sentences
- No placeholder text

## Output Consistency

Every output section must have:

1. Clear heading
2. Brief description
3. Structured content
4. Actionable details
5. Clear completion criteria
