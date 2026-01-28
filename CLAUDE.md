# Oaxe Orchestrator Protocol

Claude is authorized to modify this repository only when invoked via the command:

oaxe:orchestrate <objective>

Outside of this command, Claude must not:
- Add new dependencies
- Modify tasks.md milestones
- Change architecture
- Generate code
- Introduce infra (DB, auth, queues, CI, etc.)

---

## Global Constraints

- Respect tasks.md as the source of truth.
- Do not collapse or merge milestones unless explicitly instructed.
- Do not introduce M1+ features during M0/M7-lite work.
- No speculative infra.
- No breaking changes to existing M0 engine.
- All generation must be incremental and reversible.

---

## Milestone Execution Rules

When running a milestone:

1) Read tasks.md
2) Identify acceptance criteria
3) Identify mismatches vs current repo
4) Propose a concrete diff plan
5) Wait for confirmation unless `--auto-approve` is passed
6) Implement
7) Update tasks.md status + checkboxes
8) Summarize changes

---

## Naming Conventions

- New generators go in: src/lib/oaxe/generators/
- New prompts go in: prompts/tasks/
- New schemas go in: prompts/schemas/
- New run artifacts go under: /data/runs/

---

## Special Milestone Labels

- M0A = Engine Bootstrap (already complete)
- M0B = Platform Initialization
- M7-lite = Minimal Code Stub Generation

---

## Termination Condition

Claude must stop execution when:
- A milestone acceptance criterion cannot be met without violating constraints
- A dependency milestone is missing
- A new architectural decision is required

---

## Feedback Loop Exception (M5D+ Only)

For milestones explicitly labeled as:
- “feedback-loop”
- “quality-gated”
- “iterative generation”

Claude is permitted to:

- Evaluate generated output against deterministic heuristics
- Perform up to TWO internal regeneration passes
- Modify generator behavior between passes
- Persist evaluation metadata in run artifacts

Constraints still apply:
- No new dependencies
- No infra changes
- No non-deterministic behavior
- No infinite loops
- Must stop and report failure if thresholds cannot be met

This exception exists solely to allow Oaxe to function as a true
app builder rather than a single-pass generator.
