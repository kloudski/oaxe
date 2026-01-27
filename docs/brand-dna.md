# Brand DNA

## Overview

Brand DNA is the genetic code that defines a product's identity. Every visual decision, verbal choice, and interaction pattern traces back to this foundational document.

Brand DNA is not decoration. It is infrastructure.

## Brand DNA Structure

The Brand DNA object lives at `/brand/dna.json` and is referenced by:
- Design system generator
- UI generator
- Copy generator
- Tweet generator
- Evolution planner

## Components

### 1. Brand Archetype

The archetype defines the fundamental personality and role the brand plays.

**Available Archetypes:**

| Archetype | Core Drive | Brand Examples |
|-----------|------------|----------------|
| The Sage | Truth, wisdom | Google, IBM |
| The Creator | Innovation, vision | Apple, Adobe |
| The Ruler | Control, leadership | Mercedes, Rolex |
| The Magician | Transformation | Disney, Dyson |
| The Hero | Mastery, courage | Nike, FedEx |
| The Outlaw | Revolution, liberation | Harley, Virgin |
| The Explorer | Freedom, discovery | Jeep, Patagonia |
| The Innocent | Safety, simplicity | Coca-Cola, Dove |
| The Everyman | Belonging, equality | IKEA, Target |
| The Lover | Intimacy, passion | Chanel, Victoria's Secret |
| The Jester | Joy, irreverence | Old Spice, Dollar Shave Club |
| The Caregiver | Service, protection | Johnson & Johnson, UNICEF |

**For Atlas9 Products:**
- Primary archetype: **The Sage** (truth, precision, expertise)
- Secondary archetype: **The Creator** (innovation, building, possibility)

### 2. Brand Promise

A single sentence that captures what the brand delivers.

**Structure:**
```
For [audience], [brand] is the [category] that [key benefit]
because [reason to believe].
```

**Example:**
```
For ambitious builders, Atlas9 is the product engine that
transforms vision into production-grade software because it
encodes the expertise of world-class teams.
```

### 3. Emotional Signature

The feelings the brand should evoke.

**Primary Emotion:** Confidence
**Secondary Emotion:** Clarity
**Avoided Emotions:** Anxiety, Confusion, Overwhelm

**Emotion Spectrum (0-100):**
```
Power:      ████████████████░░░░ 80
Trust:      ██████████████████░░ 90
Precision:  ████████████████████ 100
Warmth:     ████████░░░░░░░░░░░░ 40
Innovation: ██████████████████░░ 90
Stability:  ████████████████░░░░ 80
```

### 4. Visual Signature

The visual elements that make the brand instantly recognizable.

#### Typography Pattern

| Context | Treatment |
|---------|-----------|
| Hero headlines | Serif, large, tracked out |
| Section headings | Serif, medium weight |
| Body text | Sans, regular weight |
| Code/data | Mono, slightly smaller |
| Labels | Sans, medium, uppercase |

#### Signature Layout Motif

The "research paper" layout:
- Wide margins
- Generous whitespace
- Asymmetric grids
- Data-dense regions balanced with breathing room
- Clear visual hierarchy through type scale, not decoration

#### Signature Motion Behavior

"Confident emergence":
- Elements fade and slide up on enter
- No bouncing or playful motion
- Subtle scale on interactive elements
- Progress indicators are precise, not whimsical

#### Signature Texture Behavior

"Laboratory precision":
- Subtle grain on hero surfaces
- Dithered gradients on dividers
- Clean, textureless interactive elements
- Noise suggests physicality without distraction

### 5. Verbal Tone

How the brand speaks.

**Personality Traits:**
- Direct (no hedge words)
- Precise (specific > vague)
- Confident (declarative statements)
- Helpful (solves problems)
- Unpretentious (no jargon for its own sake)

**Avoided Traits:**
- Salesy
- Hyperbolic
- Cutesy
- Corporate-speak
- Apologetic

#### Microcopy Style

**Buttons:**
- "Generate" not "Click to generate"
- "Save changes" not "Save your changes!"
- "Continue" not "Next step →"

**Placeholders:**
- "Search products..." not "Type to search"
- "Enter email" not "Your email address here"

**Labels:**
- "Email" not "Email Address:"
- "Password" not "Enter your password"

#### Error Message Voice

**Style:** Calm, specific, actionable

**Examples:**
```
✗ "Oops! Something went wrong. Please try again."
✓ "Connection failed. Check your network and retry."

✗ "Invalid input!!!"
✓ "Email format invalid. Example: name@domain.com"

✗ "Error 500"
✓ "Server error. We're investigating. Try again in a few minutes."
```

#### Empty State Voice

**Style:** Encouraging, clear next action

**Examples:**
```
No projects yet

Create your first project to start building.

[Create Project]
```

```
No results for "xyz"

Try different keywords or clear filters.

[Clear filters]
```

#### System Message Voice

**Style:** Informative, not celebratory

**Examples:**
```
✗ "Awesome! Your project was created successfully! 🎉"
✓ "Project created."

✗ "Yay! Changes saved!"
✓ "Changes saved."

✗ "Oopsie! That didn't work."
✓ "Save failed. Retrying..."
```

### 6. Iconography & Symbol Logic

**Style:** Outlined, geometric, 2px stroke

**Corner Style:** Rounded (2px radius)

**Library:** Lucide Icons (primary), custom for brand-specific

**Custom Symbols:**
- Product logo
- Feature icons
- Status indicators

**Usage Rules:**
- Icons accompany text, never replace it alone
- Consistent size within context (16px UI, 24px features)
- Color follows text color, never decorative
- No filled variants except for state (selected, active)

### 7. Brand Guardrails

What the brand never does.

**Visual Don'ts:**
- No gradients on interactive elements
- No shadows heavier than lg
- No border radius larger than 16px
- No decorative illustrations
- No stock photography
- No emoji in UI (allowed in user content)

**Verbal Don'ts:**
- No exclamation points in system messages
- No "please" in error messages
- No apologetic language ("sorry")
- No hedging ("might," "possibly")
- No superlatives ("best," "amazing")

**Competitor References:**
- Never directly compare to competitors
- Never disparage alternatives
- Position on capabilities, not against others

**Trademark Notes:**
- Product name always capitalized
- Logo has minimum clear space
- Brand colors used consistently

## Generating Brand DNA

When Atlas9 generates a new product, it:

1. **Analyzes the directive** — What category? What audience?
2. **Selects archetypes** — Based on product positioning
3. **Defines emotional target** — What should users feel?
4. **Generates visual signature** — Typography, color, motion
5. **Generates verbal tone** — Microcopy patterns
6. **Establishes guardrails** — What to avoid
7. **Outputs to `/brand/dna.json`**

## Brand DNA in Practice

### Design System References Brand DNA

```css
/* Color from dna.json */
--primary: var(--brand-primary);

/* Typography from dna.json */
--font-heading: var(--brand-serif);
```

### Copy Generator References Brand DNA

```typescript
function generateErrorMessage(error: Error): string {
  // Check brandDNA.verbalTone.errorMessages.style
  // Apply personality traits
  // Avoid donts
  return formattedMessage
}
```

### Tweet Generator References Brand DNA

```typescript
function generateFounderTweet(product: ProductSpec): string {
  // Apply brandDNA.verbalTone.personality
  // Match emotional signature
  // Follow guardrails
  return tweet
}
```

## Evolving Brand DNA

Brand DNA is not static. As products evolve (v1 → v2 → v3), Brand DNA may need adjustment.

**What Can Change:**
- Color palette (expansion, not replacement)
- Typography (additional weights/styles)
- Motion (complexity can increase)
- Verbal tone (maturity can deepen)

**What Must Not Change:**
- Core archetype
- Primary emotional signature
- Fundamental visual motifs
- Brand guardrails

## Related Documents

- [Design System](./design-system.md)
- [Launch Playbook](./launch-playbook.md)
- [Evolution](./evolution.md)
