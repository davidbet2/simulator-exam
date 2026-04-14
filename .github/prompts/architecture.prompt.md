---
mode: 'agent'
tools: ['codebase']
description: 'Architectural decision-making and design with ADR creation.'
---

# Architecture

## Trigger
Activate when: "design this", "how to structure", "architect", "propose a solution", "new module".

## Critical Questions Before Designing
Never propose architecture without answering:
1. **What is the real problem?** — Not the symptom, the underlying problem
2. **Key non-functional requirements:**
   - Scale: How many users/requests/data?
   - Latency: What response time is acceptable?
   - Availability: How much downtime is tolerable?
   - Consistency: CAP theorem — what's sacrificed?
3. **What constraints exist?** — Technology, team, timeline, budget
4. **What alternatives exist?** — Always present at least 2–3 options

## Design Process

### Phase 1: Understand the Domain
- Map the main entities and their relationships
- Identify bounded contexts
- Define the ubiquitous language (shared vocabulary)

### Phase 2: Compare Alternatives
For each significant decision, present a comparison table:

| Option | Pros | Cons | When to use |
|--------|------|------|-------------|
| Option A | ... | ... | ... |
| Option B | ... | ... | ... |

### Phase 3: Design the Selected Solution
- Define clear interfaces between components
- Specify the data flow (who calls whom)
- Identify infrastructure dependencies (DB, cache, queues)
- Define error and failure boundaries

### Phase 4: Create ADR
For decisions changing the current architecture, create an ADR:

```markdown
# ADR-NNN: [Title]

## Status
Accepted

## Context
[Why this decision was needed]

## Decision
[What was decided]

## Consequences
[What changes, tech debt created, future implications]
```

Save to `docs/decisions/ADR-NNN-title.md`.

## Output Format
1. **Problem restatement** — Confirm you understand the actual problem
2. **Comparison table** — 2–3 evaluated alternatives
3. **Recommended solution** — With diagrams or ASCII art if helpful
4. **ADR** — If it modifies existing architecture
5. **Implementation plan** — High-level next steps
