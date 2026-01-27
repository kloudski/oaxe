# Accessibility

## Overview

Atlas9 adheres to WCAG 2.2 Level AA standards. Accessibility is not an afterthought—it's a core design requirement that ensures every user can access and use generated products effectively.

## Standards

### WCAG 2.2 Level AA

All generated products must meet WCAG 2.2 Level AA success criteria.

### Key Principles (POUR)

1. **Perceivable** — Information must be presentable in ways users can perceive
2. **Operable** — Interface components must be operable by all users
3. **Understandable** — Information and UI operation must be understandable
4. **Robust** — Content must be robust enough for diverse user agents and assistive technologies

## Color Accessibility

### Contrast Requirements

| Element | Minimum Ratio | Standard |
|---------|---------------|----------|
| Normal text (< 18px) | 4.5:1 | WCAG AA |
| Large text (≥ 18px or 14px bold) | 3:1 | WCAG AA |
| UI components & graphics | 3:1 | WCAG AA |
| Focus indicators | 3:1 | WCAG AA |

### OKLCH for Accessible Color

```css
/* Generate accessible color pairs */
--text-primary: oklch(15% 0.01 0);       /* L=15% */
--bg-primary: oklch(98% 0.01 0);         /* L=98% */
/* Contrast: ~15:1 */

--text-secondary: oklch(40% 0.01 0);     /* L=40% */
--bg-primary: oklch(98% 0.01 0);         /* L=98% */
/* Contrast: ~7:1 */

/* Dark mode - invert L values */
--text-primary-dark: oklch(95% 0.01 0);  /* L=95% */
--bg-primary-dark: oklch(12% 0.01 0);    /* L=12% */
/* Contrast: ~14:1 */
```

### Color Independence

Never convey information by color alone:

```tsx
// Bad - color only
<span className="text-red-500">Error</span>

// Good - color + icon + text
<span className="text-red-500 flex items-center gap-1">
  <AlertCircle className="h-4 w-4" aria-hidden="true" />
  Error: Invalid email format
</span>
```

## Keyboard Navigation

### Focus Management

All interactive elements must be keyboard accessible:

```tsx
// Visible focus indicators
.focus-visible:outline-none
.focus-visible:ring-2
.focus-visible:ring-primary
.focus-visible:ring-offset-2
```

### Tab Order

Logical tab order following visual layout:

```tsx
// Use tabIndex sparingly
// 0 = natural order (preferred)
// -1 = programmatically focusable only
// Positive values = avoid

<button tabIndex={0}>First</button>
<button tabIndex={0}>Second</button>
<div tabIndex={-1} ref={modalRef}>Modal content</div>
```

### Keyboard Shortcuts

| Action | Shortcut | Scope |
|--------|----------|-------|
| Close modal | Escape | Global |
| Submit form | Enter | Form |
| Navigate list | Arrow keys | List |
| Select item | Enter/Space | List item |
| Skip to main | Tab (first) | Global |

### Focus Trap

Modals and dialogs must trap focus:

```tsx
import { FocusTrap } from '@radix-ui/react-focus-trap'

function Modal({ open, children }) {
  return (
    <FocusTrap>
      <div role="dialog" aria-modal="true">
        {children}
      </div>
    </FocusTrap>
  )
}
```

## Screen Reader Support

### Semantic HTML

Use semantic elements:

```tsx
// Good
<nav aria-label="Main navigation">
  <ul>
    <li><a href="/dashboard">Dashboard</a></li>
  </ul>
</nav>

<main>
  <article>
    <h1>Page Title</h1>
    <section aria-labelledby="section-1">
      <h2 id="section-1">Section Title</h2>
    </section>
  </article>
</main>

// Bad
<div class="nav">
  <div class="nav-item">Dashboard</div>
</div>
```

### ARIA Labels

Provide labels for icons and controls:

```tsx
// Icon buttons
<button aria-label="Close dialog">
  <X className="h-4 w-4" aria-hidden="true" />
</button>

// Form inputs
<label htmlFor="email">Email</label>
<input
  id="email"
  type="email"
  aria-describedby="email-hint email-error"
/>
<span id="email-hint">We'll never share your email</span>
<span id="email-error" role="alert">Invalid email format</span>
```

### Live Regions

Announce dynamic content:

```tsx
// Polite - waits for silence
<div aria-live="polite" aria-atomic="true">
  {statusMessage}
</div>

// Assertive - interrupts
<div role="alert" aria-live="assertive">
  {errorMessage}
</div>

// Status messages
<div role="status" aria-live="polite">
  Saving...
</div>
```

### Heading Hierarchy

Maintain logical heading structure:

```tsx
// Good
<h1>Dashboard</h1>
  <h2>Projects</h2>
    <h3>Recent Projects</h3>
    <h3>Archived Projects</h3>
  <h2>Settings</h2>

// Bad - skipping levels
<h1>Dashboard</h1>
  <h3>Projects</h3>  // Missing h2
```

## Motion Accessibility

### Reduced Motion

Respect user preferences:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

```tsx
// JavaScript check
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches

function animate(element) {
  if (prefersReducedMotion) {
    // Skip or simplify animation
    return
  }
  // Full animation
}
```

### Safe Animation Patterns

| Safe | Avoid |
|------|-------|
| Opacity fades | Flashing/strobing |
| Subtle transforms | Parallax scrolling |
| Color transitions | Auto-playing video |
| Scale changes | Infinite loops |

## Form Accessibility

### Labels

Every input needs a label:

```tsx
// Visible label (preferred)
<label htmlFor="name">Name</label>
<input id="name" type="text" />

// Hidden label (when visually implied)
<label htmlFor="search" className="sr-only">Search</label>
<input id="search" type="search" placeholder="Search..." />
```

### Error Handling

Clear error identification:

```tsx
<div>
  <label htmlFor="email">Email</label>
  <input
    id="email"
    type="email"
    aria-invalid={hasError}
    aria-describedby={hasError ? 'email-error' : undefined}
  />
  {hasError && (
    <span id="email-error" role="alert" className="text-error">
      Please enter a valid email address
    </span>
  )}
</div>
```

### Required Fields

Indicate required fields:

```tsx
<label htmlFor="email">
  Email
  <span aria-hidden="true" className="text-error">*</span>
  <span className="sr-only">(required)</span>
</label>
<input id="email" type="email" required aria-required="true" />
```

## Component Patterns

### Buttons

```tsx
// Standard button
<button type="button">Click me</button>

// Icon button
<button type="button" aria-label="Delete item">
  <Trash className="h-4 w-4" aria-hidden="true" />
</button>

// Toggle button
<button
  type="button"
  aria-pressed={isPressed}
  onClick={() => setIsPressed(!isPressed)}
>
  {isPressed ? 'On' : 'Off'}
</button>

// Loading button
<button type="submit" disabled={isLoading}>
  {isLoading ? (
    <>
      <Spinner aria-hidden="true" />
      <span className="sr-only">Loading...</span>
    </>
  ) : (
    'Submit'
  )}
</button>
```

### Modal Dialog

```tsx
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
  aria-describedby="modal-description"
>
  <h2 id="modal-title">Confirm Delete</h2>
  <p id="modal-description">
    Are you sure you want to delete this item?
  </p>
  <button onClick={onConfirm}>Delete</button>
  <button onClick={onCancel}>Cancel</button>
</div>
```

### Tabs

```tsx
<div role="tablist" aria-label="Project sections">
  <button
    role="tab"
    id="tab-overview"
    aria-selected={activeTab === 'overview'}
    aria-controls="panel-overview"
    tabIndex={activeTab === 'overview' ? 0 : -1}
  >
    Overview
  </button>
  <button
    role="tab"
    id="tab-settings"
    aria-selected={activeTab === 'settings'}
    aria-controls="panel-settings"
    tabIndex={activeTab === 'settings' ? 0 : -1}
  >
    Settings
  </button>
</div>

<div
  role="tabpanel"
  id="panel-overview"
  aria-labelledby="tab-overview"
  hidden={activeTab !== 'overview'}
>
  Overview content
</div>
```

### Data Tables

```tsx
<table>
  <caption>Project list</caption>
  <thead>
    <tr>
      <th scope="col">Name</th>
      <th scope="col">Status</th>
      <th scope="col">Created</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">Project Alpha</th>
      <td>Active</td>
      <td>2024-01-15</td>
    </tr>
  </tbody>
</table>
```

## Testing

### Automated Testing

```typescript
// Using axe-core
import { axe, toHaveNoViolations } from 'jest-axe'

expect.extend(toHaveNoViolations)

it('should have no accessibility violations', async () => {
  const { container } = render(<Component />)
  const results = await axe(container)
  expect(results).toHaveNoViolations()
})
```

### Manual Testing Checklist

- [ ] Navigate entire page with keyboard only
- [ ] Test with screen reader (VoiceOver, NVDA)
- [ ] Verify focus indicators visible
- [ ] Check color contrast ratios
- [ ] Test at 200% zoom
- [ ] Test with reduced motion enabled
- [ ] Verify form error handling
- [ ] Test skip links

### Tools

| Tool | Purpose |
|------|---------|
| axe DevTools | Browser extension for audits |
| Lighthouse | Performance + accessibility |
| WAVE | Visual accessibility feedback |
| VoiceOver | macOS screen reader |
| NVDA | Windows screen reader |
| Colour Contrast Analyser | Check contrast ratios |

## Accessibility Utilities

### Screen Reader Only

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

### Skip Link

```tsx
<a
  href="#main-content"
  className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-white focus:p-4"
>
  Skip to main content
</a>

<main id="main-content" tabIndex={-1}>
  {/* Page content */}
</main>
```

## Related Documents

- [Design System](./design-system.md)
- [Brand DNA](./brand-dna.md)
