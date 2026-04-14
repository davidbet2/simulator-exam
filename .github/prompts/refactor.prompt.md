---
mode: 'agent'
tools: ['codebase', 'changes', 'problems']
description: 'Structured refactoring with a clear plan, preserving all observable behavior.'
---

# Refactor

## Trigger
Activate when: "refactor", "clean up this code", "improve structure", "restructure".

## Golden Rule
> **Observable external behavior MUST NOT change.**
> If there are no tests validating current behavior, create them FIRST.

## When NOT to Refactor First
- If there are no tests validating current behavior → create tests first
- If there is a bug to fix → fix the bug first, then refactor
- If deadline is imminent → document tech debt and refactor later

## Process

### Step 1: Understand the Current Code
- Read the code and understand what it does
- Identify what the tests cover (if any exist)
- Document assumed behavior before changing anything

### Step 2: Create a Safety Net (if needed)
- If tests are missing: write characterization tests before refactoring
- Run all existing tests to confirm they pass in green state

### Step 3: Propose a Plan
Present the refactoring plan BEFORE implementing:
- What will change and why
- What will NOT change (behavior preservation)
- Estimated risk level (Low/Medium/High)
- Rollback strategy if something breaks

### Step 4: Execute in Small Steps
- One conceptual change per commit
- Run tests after each step
- Stop if tests break — fix before continuing

### Step 5: Verify
- All existing tests still pass
- No new behaviors introduced
- Code is simpler or clearer than before

## Refactoring Patterns Reference
| Problem | Pattern |
|---------|---------|
| Long function | Extract method |
| Duplicated code | Extract and reuse |
| Magic numbers | Named constants |
| Deep nesting | Early returns / guard clauses |
| Huge class | Split by responsibility |
| Complex conditionals | Strategy pattern / polymorphism |
