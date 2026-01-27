# Brand Partial

Include this partial when generating brand-related outputs.

## Brand DNA Framework

Every product requires a complete Brand DNA object that defines its identity.

## Archetype Selection

### Available Archetypes

| Archetype | Core Drive | Best For |
|-----------|------------|----------|
| The Sage | Truth, wisdom | Developer tools, analytics, research |
| The Creator | Innovation, vision | Design tools, creative platforms |
| The Ruler | Control, leadership | Enterprise, finance, management |
| The Magician | Transformation | AI tools, automation, productivity |
| The Hero | Mastery, courage | Fitness, performance, competition |
| The Outlaw | Revolution, liberation | Disruptors, alternatives, indie tools |
| The Explorer | Freedom, discovery | Travel, learning, exploration |
| The Innocent | Safety, simplicity | Consumer apps, family tools |
| The Everyman | Belonging, equality | Community, social, collaboration |
| The Lover | Intimacy, passion | Lifestyle, fashion, relationships |
| The Jester | Joy, irreverence | Entertainment, casual games |
| The Caregiver | Service, protection | Healthcare, education, support |

### Selection Criteria

Choose archetypes based on:
1. Target audience expectations
2. Problem being solved
3. Competitive positioning
4. Desired emotional response
5. Long-term brand trajectory

### Oaxe Default

- Primary: **The Sage** (precision, expertise, truth)
- Secondary: **The Creator** (building, possibility, innovation)

## Brand Promise

### Structure

```
For [target audience],
[product] is the [category]
that [key benefit]
because [reason to believe].
```

### Requirements

- Specific, not generic
- Defensible claim
- Clear audience
- Measurable benefit

### Example

```
For ambitious builders,
Oaxe is the product engine
that transforms vision into production-grade software
because it encodes the expertise of world-class teams.
```

## Emotional Signature

### Spectrum Definition

Rate each dimension 0-100:

| Dimension | Low End | High End |
|-----------|---------|----------|
| Power | Humble | Authoritative |
| Trust | Experimental | Reliable |
| Precision | Approximate | Exact |
| Warmth | Professional | Personal |
| Innovation | Traditional | Cutting-edge |
| Stability | Dynamic | Consistent |

### Primary vs. Secondary

- **Primary emotion**: The dominant feeling (70% of brand expression)
- **Secondary emotion**: The supporting feeling (30% of brand expression)
- **Avoided emotions**: Feelings that would damage the brand

### Oaxe Default

```
Primary: Confidence
Secondary: Clarity
Avoided: Anxiety, Confusion, Overwhelm

Power:      80
Trust:      90
Precision:  100
Warmth:     40
Innovation: 90
Stability:  80
```

## Visual Signature

### Typography Pattern

| Context | Family | Weight | Style |
|---------|--------|--------|-------|
| Hero headlines | Serif | Regular | Large, tracked |
| Section headings | Serif | Medium | Clear hierarchy |
| Body text | Sans | Regular | Readable |
| Code/data | Mono | Regular | Technical clarity |
| Labels | Sans | Medium | Uppercase optional |

### Signature Layout Motif

Define the characteristic layout approach:

- "Research paper" — Wide margins, data density, clear hierarchy
- "Dashboard" — Information-dense, grid-based, functional
- "Editorial" — Generous whitespace, story-driven, scrolling
- "App" — Compact, interactive, tool-like

### Signature Motion Behavior

Define the characteristic motion feel:

- "Confident emergence" — Fade + slide up, no bounce
- "Precise mechanics" — Snappy, exact, responsive
- "Fluid transitions" — Smooth, continuous, flowing
- "Playful energy" — Bouncy, springy, delightful

### Signature Texture Behavior

Define the characteristic texture treatment:

- "Laboratory precision" — Subtle grain, clean surfaces
- "Editorial depth" — Paper-like, tactile, layered
- "Digital clarity" — Flat, crisp, no texture
- "Organic warmth" — Noise, gradients, soft edges

## Verbal Tone

### Personality Traits

Select 4-6 traits:

| Trait | Opposite |
|-------|----------|
| Direct | Indirect |
| Precise | Approximate |
| Confident | Tentative |
| Helpful | Neutral |
| Technical | Accessible |
| Formal | Casual |
| Serious | Playful |

### Voice Guidelines

#### Microcopy Style

| Element | Pattern | Example |
|---------|---------|---------|
| Buttons | Verb (object) | "Save changes" |
| Placeholders | Action hint | "Search projects..." |
| Labels | Noun only | "Email" |
| Hints | Helpful context | "We'll send a confirmation" |

#### Error Messages

| Quality | Pattern |
|---------|---------|
| Calm | No exclamation marks |
| Specific | State what went wrong |
| Actionable | Suggest next step |
| Blameless | No "you did" language |

Example:
```
✗ "Error! Invalid input!"
✓ "Email format invalid. Example: name@domain.com"
```

#### Empty States

| Quality | Pattern |
|---------|---------|
| Encouraging | Positive framing |
| Clear | Explain what's missing |
| Actionable | Obvious next step |
| On-brand | Match personality |

Example:
```
No projects yet

Create your first project to start building.

[Create Project]
```

#### System Messages

| Quality | Pattern |
|---------|---------|
| Informative | State what happened |
| Brief | Minimum words |
| Non-celebratory | No "Awesome!" |
| Professional | Match seriousness |

Example:
```
✗ "Yay! Successfully saved! 🎉"
✓ "Changes saved."
```

## Iconography

### Style Definition

| Attribute | Options |
|-----------|---------|
| Style | Outlined, Filled, Duotone |
| Stroke width | 1px, 1.5px, 2px |
| Corners | Sharp, Rounded (2px, 4px) |
| Size | 16px (UI), 24px (features), 32px+ (heroes) |

### Usage Rules

1. Icons accompany text, never replace alone
2. Consistent size within context
3. Color follows text color
4. No decorative icons
5. Filled only for active/selected states

## Brand Guardrails

### Visual Don'ts

- No gradients on interactive elements
- No shadows heavier than defined scale
- No border radius larger than 16px
- No decorative illustrations
- No stock photography
- No emoji in UI

### Verbal Don'ts

- No exclamation points in system messages
- No "please" in error messages
- No apologetic language
- No hedging words
- No superlatives
- No competitor mentions

### Trademark Protections

- Product name always capitalized
- Logo has minimum clear space
- Brand colors used consistently
- No modifications to wordmark

## Output Format

When generating brand artifacts:

```typescript
interface BrandOutput {
  archetype: {
    primary: ArchetypeType
    secondary: ArchetypeType
    rationale: string
  }
  brandPromise: {
    statement: string
    audience: string
    benefit: string
    proof: string
  }
  emotionalSignature: {
    primary: Emotion
    secondary: Emotion
    avoided: Emotion[]
    spectrum: EmotionSpectrum
  }
  visualSignature: {
    typography: TypographyPattern
    layoutMotif: LayoutMotif
    motionBehavior: MotionBehavior
    textureBehavior: TextureBehavior
  }
  verbalTone: {
    personality: string[]
    microcopy: MicrocopyExamples
    errors: ErrorExamples
    emptyStates: EmptyStateExamples
    systemMessages: SystemMessageExamples
  }
  iconography: IconographySpec
  guardrails: BrandGuardrails
}
```
