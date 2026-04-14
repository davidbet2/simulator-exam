---
mode: 'agent'
tools: ['codebase', 'terminal', 'changes', 'problems']
description: 'Systematic debugging using scientific method — hypothesis, evidence, fix, verify.'
---

# Debug

## Trigger
Activate when: "debug", "why does this fail", "there's a bug", "investigate error", "not working".

## Process — Scientific Method

### Phase 1: Gather Evidence
Before touching code:
1. **Exact error message** — Full stack trace, not a paraphrase
2. **Reproduction context:**
   - Does it always fail or intermittently?
   - Which environments is it affected?
   - When did it start? What changed before it appeared?
3. **Expected vs actual behavior** — Be specific
4. **Relevant logs** — Last N lines, not the full file
5. **Environment** — Runtime version, OS, relevant dependencies

### Phase 2: Form Hypotheses
Generate **minimum 3 hypotheses**, ordered by probability:
```
H1 (most likely):  [description] — Evidence: [what points to this]
H2 (likely):       [description] — Evidence: [what points to this]
H3 (less likely):  [description] — Evidence: [what points to this]
```

### Phase 3: Narrow the Problem
1. **Bisect** — Which version/commit worked? Use `git bisect` if applicable
2. **Isolate** — Can you reproduce in a smaller context?
3. **Contrast** — What's different between working and broken states?

### Phase 4: Fix
- Apply the **minimal change** that solves the root cause
- Fix the cause, NOT the symptom
- Do NOT change unrelated code

### Phase 5: Verify
1. Run the failing test/step to confirm it passes
2. Run the full test suite to confirm no regressions
3. Remove any debug logging added during investigation

## Output Format
For each issue:
1. **Root cause** — What's actually wrong
2. **Evidence** — Proof supporting the diagnosis
3. **Fix applied** — Exact code change made
4. **Verification** — How to confirm it's resolved
5. **Prevention** — How to avoid this class of bug in the future
