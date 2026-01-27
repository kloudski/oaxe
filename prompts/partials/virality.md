# Virality Partial

Include this partial when generating launch assets and growth-related outputs.

## Virality Philosophy

Virality is earned through quality, not manufactured through tactics. The goal is to create work so good that sharing it reflects well on the sharer.

## Target Audience

### Elite Dev/Design Twitter

Primary amplification channel characteristics:
- Technical sophistication
- Design sensitivity
- Skepticism of hype
- Appreciation for craft
- Builder mentality
- High standards

### What They Share

1. **Visual excellence** — Screenshots that look better than expected
2. **Technical depth** — Signals expertise and thought
3. **Solves real pain** — Addresses known problems
4. **Novel approach** — Fresh perspective on familiar problem
5. **Accessible** — Free tier or open source
6. **Speed signals** — "Built in X days/weeks"
7. **Polish** — Obsessive attention to detail

### What They Ignore

1. Marketing speak
2. Hype language
3. Emoji-heavy posts
4. "Excited to announce"
5. Feature lists without context
6. Generic screenshots
7. Begging for engagement

## Founder Tweet Framework

### Tweet Structures

#### The Demo Tweet
```
[Product] turns [input] into [output].

Here's [specific example]:

[screenshot or video]
```

#### The Technical Tweet
```
Built [product] to solve [problem].

[Technical detail that signals quality].

[Link]
```

#### The Insight Tweet
```
[Observation about problem space].

So I built [product].

[What it does in one sentence].
```

#### The Speed Tweet
```
[Time frame] from idea to shipped.

[Product] does [thing].

[Link]
```

#### The Contrast Tweet
```
Before: [painful state]
After: [solved state]

[Product] makes this possible.

[screenshot]
```

### Tweet Constraints

| Constraint | Requirement |
|------------|-------------|
| Length | < 280 characters |
| Emojis | None |
| Hashtags | None |
| Links | One, at end |
| Media | Screenshot or video |

### Tweet Quality Signals

**Good:**
- Specific numbers
- Technical details
- Personal voice
- Clear value prop
- Screenshot-worthy UI

**Bad:**
- "Excited to announce"
- "Check it out"
- "Let me know what you think"
- "Would love your feedback"
- Marketing superlatives

## Screenshot Optimization

### Composition Rules

| Element | Guideline |
|---------|-----------|
| Resolution | 1200x675 (Twitter) or 1920x1080 |
| Content | Actual UI, not mockup |
| Mode | Dark preferred for dev audience |
| Chrome | No browser chrome |
| Background | Clean, brand-aligned |

### What to Show

1. Primary value proposition visible
2. Information density (looks powerful)
3. Real data (not Lorem ipsum)
4. Polish details visible
5. Brand moment if applicable

### What to Avoid

1. Empty states
2. Loading screens
3. Error states
4. Placeholder content
5. Cluttered interface

## Hero Copy Framework

### Headline Formula

3-7 words that state what it does:
```
[Action verb] [object] [outcome/method]
```

Examples:
- "Turn any product into code"
- "Ship with world-class design"
- "Build faster, ship better"

### Subhead Formula

10-20 words that expand the headline:
```
[How it works] or [key benefit] + [credibility signal]
```

Examples:
- "Point Oaxe at any product. Get production-grade architecture, design, and brand."
- "The AI that builds like a senior engineering team. Complete and shipping-ready."

### CTA Formula

2-4 words, action-oriented:
```
[Action verb] + [implied outcome]
```

Examples:
- "Start Building"
- "Get Started"
- "Try Free"
- "See Demo"

## Product Hunt Optimization

### Tagline Formula

Under 60 characters:
```
[Action verb] [what] [how/benefit]
```

Examples:
- "Turn any product into production-grade code"
- "Ship products with world-class design, instantly"
- "The AI that builds like a senior eng team"

### First Comment

Structure for maker's first comment:
1. Personal context (1 sentence)
2. Problem statement (1-2 sentences)
3. Solution overview (1-2 sentences)
4. Call for feedback (1 sentence)

## Activation Loop Design

### Framework

```
Discover → Try → Succeed → Share
    ↑                        │
    └────────────────────────┘
```

### Discovery Triggers

- Twitter screenshot
- Peer recommendation
- Search result
- Product Hunt
- Hacker News
- Blog post

### Try Friction

Target: Value in < 60 seconds

| Step | Target Time |
|------|-------------|
| Land on page | 3 sec to understand |
| Click CTA | 1 click to start |
| First action | < 30 sec to value |
| First success | < 60 sec total |

### Success Definition

What makes a user feel they've won:
1. Generated something useful
2. Saved noticeable time
3. Learned something valuable
4. Created something shareable

### Share Triggers

Natural moments to share:
1. First successful generation
2. Impressive output quality
3. Feature discovery delight
4. Time saved visible
5. Comparison to manual work

## Launch Timing

### Best Days

- Tuesday: Strong start
- Wednesday: Peak engagement
- Thursday: Good follow-through

### Worst Days

- Friday: Weekend mode
- Saturday/Sunday: Low engagement
- Monday: Inbox clearing

### Best Times

- 9-11 AM PT: US coasts active
- Avoid major tech events
- Avoid holidays

## Engagement Strategy

### Post-Launch (First 2 Hours)

- Be present
- Respond to every reply
- Retweet quality responses
- Add context where needed

### Day 1

- Post follow-up technical content
- Share interesting early feedback
- Engage constructively with critics

### Week 1

- Share learnings thread
- Post metrics if impressive
- Thank community
- Ship quick fixes based on feedback

## Metrics to Track

### Vanity (Awareness)

| Metric | Good | Great |
|--------|------|-------|
| Tweet impressions | 50K | 200K+ |
| Profile visits | 5K | 20K+ |
| Landing visits | 2K | 10K+ |

### Real (Adoption)

| Metric | Good | Great |
|--------|------|-------|
| Sign-ups | 500 | 2K+ |
| Activation | 30% | 50%+ |
| D1 retention | 15% | 30%+ |
| D7 retention | 8% | 15%+ |

## Output Format

When generating virality assets:

```typescript
interface ViralityOutput {
  tweets: {
    launch: Tweet[]      // 3-5 tweets
    pinned: Tweet        // 1 tweet
    followUp: Tweet[]    // 2-3 tweets
  }
  heroCopy: {
    headline: string
    subhead: string
    cta: string
  }
  screenshotSpec: {
    composition: string
    keyElements: string[]
    mode: 'light' | 'dark'
    resolution: string
  }
  productHunt: {
    tagline: string
    firstComment: string
  }
  activationLoop: {
    discover: string[]
    tryFriction: string
    successDefinition: string
    shareTriggers: string[]
  }
}
```
