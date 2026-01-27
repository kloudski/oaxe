# Design Partial

Include this partial when generating design-related outputs.

## Design Philosophy

Design is infrastructure, not decoration. Every pixel has purpose. Every interaction communicates.

## Visual Excellence Mandate

Generated UI must exceed:
- Vercel (precision, restraint)
- Linear (density, usability)
- Stripe (polish, trust)
- Notion (flexibility, clarity)
- Figma (power, approachability)

## Typography Rules

### Font Families

| Role | Usage |
|------|-------|
| Serif | Headings, hero text, narrative blocks, brand moments |
| Mono | Code, data, timestamps, IDs, technical labels |
| Sans | UI labels, buttons, navigation, body text |

### Type Scale

```
xs:   0.75rem (12px)  — Captions, labels
sm:   0.875rem (14px) — Secondary text
base: 1rem (16px)     — Body text
lg:   1.125rem (18px) — Large body
xl:   1.25rem (20px)  — Small headings
2xl:  1.5rem (24px)   — Section headings
3xl:  1.875rem (30px) — Page headings
4xl:  2.25rem (36px)  — Display
5xl:  3rem (48px)     — Hero
6xl:  3.75rem (60px)  — Hero large
7xl:  4.5rem (72px)   — Hero XL
```

### Typography Constraints

- Maximum line length: 65-75 characters
- Baseline grid: 8px
- No arbitrary font sizes
- Heading hierarchy must be logical
- Serif for emotional impact, sans for utility

## Color System

### OKLCH Format

All colors MUST be OKLCH:
```css
oklch(L% C H)
/* L = Lightness (0-100%) */
/* C = Chroma (0-0.4) */
/* H = Hue (0-360) */
```

### Theme Generation

Light and dark themes via L-channel only:
```css
/* Light */
--background: oklch(98% 0.01 0);
--foreground: oklch(15% 0.01 0);

/* Dark */
--background: oklch(12% 0.01 0);
--foreground: oklch(95% 0.01 0);
```

### Contrast Requirements

| Element | Minimum |
|---------|---------|
| Body text | 4.5:1 |
| Large text | 3:1 |
| UI components | 3:1 |
| Focus indicators | 3:1 |

### Color Prohibitions

- No raw hex values
- No RGB/HSL
- No hardcoded colors
- No color-only information

## Spacing System

### Base Unit

8px base unit. All spacing derives from this.

```
0:  0px
1:  8px
2:  16px
3:  24px
4:  32px
5:  40px
6:  48px
8:  64px
10: 80px
12: 96px
16: 128px
```

### Spacing Rules

- All spacing uses scale values
- No arbitrary pixel values
- Components use consistent internal spacing
- Section spacing: 64px, 96px, 128px

## Motion System

### Duration Scale

```
instant: 50ms
fast:    100ms
normal:  200ms
slow:    300ms
slower:  500ms
```

### Timing Functions

```css
--ease-default: cubic-bezier(0.4, 0, 0.2, 1);
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

### Motion Rules

- All interactions < 200ms
- No layout shift from animation
- Reduced motion fully supported
- Animation = state communication

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Texture & Depth

### Noise Overlay

- Type: Perlin or simplex
- Opacity: 2-3%
- Application: Backgrounds, dividers, heroes
- Never on: Body text, inputs, buttons

### GPU Budget

- Noise: < 2ms/frame
- No JavaScript-based generation
- SVG filter preferred

### Shadow Scale

```css
--shadow-sm: 0 1px 2px oklch(0% 0 0 / 0.05);
--shadow-md: 0 4px 6px oklch(0% 0 0 / 0.07);
--shadow-lg: 0 10px 15px oklch(0% 0 0 / 0.1);
--shadow-xl: 0 20px 25px oklch(0% 0 0 / 0.15);
```

## Component States

Every interactive component must define:

1. **Default** — Resting state
2. **Hover** — Mouse over
3. **Focus** — Keyboard focus (visible ring)
4. **Active** — Being pressed
5. **Disabled** — Not interactive
6. **Loading** — Async operation

## Screen States

Every screen must define:

1. **Loading** — Data fetching (skeleton)
2. **Empty** — No data (CTA)
3. **Error** — Failure (recovery action)
4. **Success** — Complete (next step)

## Brand Moments

Every product must include:

1. **Signature Interaction** — One interaction that feels premium
2. **Hero Section** — Cinematic visual impact
3. **Delight Moment** — "Holy sh*t this is good"

## Accessibility

### Required

- WCAG 2.2 AA minimum
- Keyboard navigation complete
- Screen reader tested
- Focus indicators visible
- Color independence

### Patterns

- Skip links
- Logical heading hierarchy
- ARIA labels on icons
- Live regions for updates
- Focus traps in modals

## Output Format

When generating design artifacts:

```typescript
interface DesignOutput {
  tokens: {
    typography: TypographyTokens
    color: ColorTokens
    spacing: SpacingTokens
    motion: MotionTokens
    depth: DepthTokens
  }
  components: ComponentSpec[]
  screens: ScreenSpec[]
  brandMoments: BrandMoment[]
}
```
