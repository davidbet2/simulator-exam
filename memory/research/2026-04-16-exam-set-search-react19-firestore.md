# Research: Real-Time Exam Set Search — React 19 + Vite + Firestore

**Date:** 2026-04-16  
**Status:** ✅ Complete  
**Topic:** Client-side search/filtering for exam sets in the SimulatorExam SPA  
**Sources fetched:**
- https://firebase.google.com/docs/firestore/query-data/queries (2026-04-13)
- https://fusejs.io/ (2026-04-09)
- https://lucaong.github.io/minisearch/ (current)
- https://react.dev/reference/react/useDeferredValue (React 19.2)
- https://react.dev/reference/react/useTransition (React 19.2)

---

## Executive Summary

**Recommendation:** Load all exam-set metadata once on mount (Firestore `getDocs`), cache it in Zustand or local state, and filter client-side using `useDeferredValue` + `Array.filter` with `.toLowerCase().includes()`. For typo-tolerance, add **MiniSearch** (~6.3 kB gzip). No external search service needed for hundreds of sets.

---

## Q1: Client-Side Filtering vs. Firestore Query-Based Search

### What Firestore can do
- Exact equality: `where("domain", "==", "automation")`
- Prefix range: `where("title", ">=", "App").where("title", "<=", "App\uf8ff")` — supports startsWith but NOT contains
- `array-contains` for pre-tokenized tags: store `["appian","developer","automation"]` and query `where("tags", "array-contains", "auto")` — only exact token match, no fuzzy
- NO native full-text search, NO `LIKE %term%`, NO stemming

### Verdict for ~100–500 exam sets
**Client-side is optimal.** Full metadata for 500 sets (title, description, domain, questionCount, tags) is < 50 kB JSON. Load once on mount with `getDocs` (or snapshot), store in state. Every search is then O(n) in memory — sub-millisecond.

Firestore query per-keystroke would be:
- Slower (network round-trip per keystroke)
- More expensive (each query = 1 read per matched document)
- Limited (no substring/fuzzy without pre-tokenization tricks)

---

## Q2: Debounce Patterns in React 19 / 2026

### Official React 19 recommendation: `useDeferredValue`
```jsx
const [query, setQuery] = useState('');
const deferredQuery = useDeferredValue(query);

// Input uses `query` (synchronous, always up-to-date)
// Results list uses `deferredQuery` (lower priority render)
```

**Key behaviors:**
- No fixed delay — adapts to device speed (slower device = longer lag, faster device = catches up faster)
- Interruptible: if user types faster than the re-render takes, React discards intermediate renders
- **Requires `memo`** on the expensive results component, otherwise optimization is void
- Background re-render will not block user input keystrokes

### `useTransition` — for Firestore fetches (not input state)

```jsx
const [isPending, startTransition] = useTransition();
// CRITICAL: CANNOT wrap controlled input value in startTransition
// ❌ startTransition(() => setQueryText(e.target.value));  // BREAKS

// ✅ Correct use: wrapping a Firestore fetch triggered by a button/filter
startTransition(async () => {
  const results = await fetchFromFirestore(filterValue);
  startTransition(() => setResults(results)); // must re-wrap after await
});
```

**Known React 19 pitfall:** After an `await` inside `startTransition`, any `setState` calls must be wrapped in another `startTransition`. This is due to JavaScript losing async context scope — will be fixed when TC39 `AsyncContext` lands.

### Custom setTimeout debounce
Still valid for Firestore network fetches (not for client-side filtering):
```js
const debounce = (fn, delay) => {
  let timer;
  return (...args) => { clearTimeout(timer); timer = setTimeout(fn, delay, ...args); };
};
```
Use 300–400ms for network requests. **Do not use** for client-side filtering — `useDeferredValue` is strictly better (no arbitrary delay, interruptible).

### Decision table for this project
| Scenario | Pattern |
|---|---|
| Filter in-memory exam set list | `useDeferredValue` |
| Load sets from Firestore on mount | `useTransition` (mark as non-urgent) |
| Load sets on type (lazy mode) | `useTransition` + custom debounce 300ms |
| Controlled input value | plain `useState` (synchronous, always) |

---

## Q3: Firestore Full-Text Search Limitations & Workarounds

### The problem
Firestore has **no native full-text search**. The only text-related query is:
- Exact prefix range (`>=`/`<=` trick for startsWith)
- `array-contains` for pre-tokenized keyword arrays

### Option comparison for this stack

| Option | Cost | Bundle | Latency | Fuzzy | Verdict |
|---|---|---|---|---|---|
| **Client-side filter** (`.includes`) | Free | 0 kB | <1ms | ❌ | ✅ Best for simple search |
| **MiniSearch** (client-side) | Free | ~6.3 kB | <1ms | ✅ | ✅ Best for fuzzy |
| **Fuse.js** (client-side) | Free | ~8 kB gzip | <1ms | ✅ | ✅ Good, heavier |
| Firestore `array-contains` tags | Free | 0 kB | network | ❌ exact only | ⚠️ Supplement only |
| Algolia | $$$+ | CDN | ~50ms | ✅ | ❌ Overkill for 500 sets |
| Typesense | Self-host | CDN | ~20ms | ✅ | ❌ No server in this stack |
| Firebase Extension (Algolia/Elastic) | $+ | CDN | ~50ms | ✅ | ❌ Adds infra |

### Recommended hybrid approach
1. Store `searchTokens: ["appian", "developer", "senior", "automation", "process"]` per set in Firestore (pre-computed at import time)
2. On mount, load all set documents with `getDocs` — one-time fetch, cached
3. Filter in-memory with MiniSearch for fuzzy, or plain `.includes()` for simple substring
4. Use `array-contains` Firestore queries ONLY for hard filters (domain, certification type, availability)

---

## Q4: React 19 Concurrent Mode Pitfalls for Search/Filtering

### ⚠️ Critical pitfalls

1. **Cannot use `startTransition` on controlled input state**
   ```jsx
   // ❌ This breaks: input becomes uncontrolled/laggy
   startTransition(() => setQuery(e.target.value));
   
   // ✅ Correct: two states
   setQuery(e.target.value); // sync — input stays responsive
   // deferredQuery via useDeferredValue handles the rest
   ```

2. **`useDeferredValue` requires `memo` to be effective**
   ```jsx
   // Without memo, the child re-renders synchronously anyway — no benefit
   const ResultsList = memo(({ query }) => { /* filtering here */ });
   ```

3. **Async transitions lose context after `await`**
   ```jsx
   startTransition(async () => {
     const data = await fetchSets();
     // ❌ setState here is NOT a transition
     setSets(data);
     // ✅ Must re-wrap:
     startTransition(() => setSets(data));
   });
   ```

4. **`useDeferredValue` does NOT prevent extra network requests** — it only defers re-rendering. If you call Firestore per keystroke, debounce is still needed for that.

5. **Race conditions with async transitions** — if a user types quickly and the previous Firestore fetch finishes after the latest one, state can be stale. Use `AbortController` or `useActionState` for ordered executions.

---

## Q5: Search UX Strategy — Instant, Lazy, or Hybrid?

### For exam sets (~100–500 documents)

**Recommendation: Instant (client-side after single load)**

| Strategy | Description | When to use |
|---|---|---|
| **Instant** | Load all metadata on mount, filter in-memory | ✅ < 1000 documents |
| **Lazy (fetch on type)** | Firestore query per keystroke (debounced) | Tens of thousands of docs |
| **Hybrid** | Load first page, query for rest if > 1000 | Medium scale |

**UX pattern for this project:**
1. On `ExploreSetPage` mount: `getDocs(collection(db, "sets"))` in a `startTransition`
2. Show skeleton/shimmer until loaded (~500ms on cold start)
3. Cache results in component state (or Zustand slice)
4. Subsequent searches: instant, zero latency
5. Stale while revalidate: re-fetch in background every 5 minutes if page stays open (optional)

---

## Q6: Bundle Size Impact

| Library | Minzipped | Fuzzy | Prefix | Rank | Notes |
|---|---|---|---|---|---|
| None (plain filter) | 0 kB | ❌ | ✅ (manual) | ❌ | Perfect for simple substring match |
| **MiniSearch** | ~6.3 kB | ✅ | ✅ | ✅ TF-IDF | **Recommended** for this project |
| Fuse.js basic | ~6.5 kB | ✅ | ❌ | ✅ | No prefix search, Bitap algorithm |
| Fuse.js full | ~8 kB | ✅ | ✅ | ✅ | Logical/extended search operators |
| FlexSearch | ~5 kB | ⚠️ | ✅ | ✅ | Fastest, but less typo-tolerant |

**Decision:** Start with plain `.filter().toLowerCase().includes()` — it's sufficient for exact substring matching and is 0 kB. Add MiniSearch only if fuzzy/typo-tolerance is needed. Do NOT add Fuse.js + MiniSearch — pick one.

---

## Q7: Security Implications

### Firestore rules (current: `firestore.rules`)
✅ Confirm that unauthenticated users can only READ the public metadata fields.  
⛔ Never expose: `adminNotes`, `internalFlags`, `pricingTier`, `userId` of creator in search results.

### Fields safe to expose in search index:
```js
{
  id,         // document ID
  title,      // exam set title
  description,// short description
  domain,     // e.g. "automation", "integrations"
  questionCount,
  available,  // boolean
  certificationId, // e.g. "developer-senior"
  tags,       // pre-tokenized search tags (public)
}
```

### What to strip before indexing client-side:
- `createdBy` (user UID)
- `hiddenUntil`, `flaggedForReview`
- Any pricing/subscription gate flags (expose only `available: true/false`)

### No injection risk with client-side filtering
Since filtering happens in-memory via JavaScript (not concatenated into a query string), there is no SQL/NoSQL injection surface. However:
- Validate/sanitize the raw input string before displaying back to user to prevent XSS (React handles this in JSX `{}` expressions automatically)
- Do NOT pass unescaped user input into Firestore `where()` clauses without validation

---

## Q8: Accessibility Best Practices (ARIA)

```jsx
// Search container
<section role="search" aria-label="Search exam sets">
  <input
    type="search"
    value={query}
    onChange={e => setQuery(e.target.value)}
    aria-label="Search exam sets by title, domain, or keywords"
    aria-controls="search-results"
    aria-autocomplete="list"
    placeholder="e.g. automation, designer…"
  />
</section>

// Results container
<div
  id="search-results"
  role="region"
  aria-live="polite"
  aria-atomic="false"
  aria-label="Search results"
>
  {/* Announce result count */}
  <p className="sr-only" aria-live="polite">
    {results.length} exam sets found
  </p>
  <ul role="list">
    {results.map(set => (
      <li key={set.id} role="listitem">
        <a href={`/sets/${set.id}`} aria-label={`${set.title}, ${set.questionCount} questions`}>
          {set.title}
        </a>
      </li>
    ))}
  </ul>
</div>
```

**Key rules:**
- `role="search"` on the outer form/section
- `aria-live="polite"` on the results region (not `assertive` — don't interrupt screen reader mid-sentence)
- `aria-controls` linking input to results list
- `aria-busy="true"` on results during initial Firestore load
- Screen-reader-only result count announcement
- Keyboard: ensure `Tab` navigates results list (semantic `<a>` and `<button>` elements handle this automatically)
- Do NOT hide results with `display:none` during filtering — use `visibility: hidden` or empty list + aria-live

---

## Concrete Implementation Pattern

### File: `src/features/explore/hooks/useSetSearch.js`

```jsx
import { useState, useDeferredValue, useMemo, useTransition } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/core/firebase/firebase';

export function useSetSearch() {
  const [allSets, setAllSets] = useState([]);
  const [query, setQuery] = useState('');
  const [isPending, startTransition] = useTransition();

  // Load all sets once on mount — non-blocking via transition
  const loadSets = useCallback(async () => {
    startTransition(async () => {
      const snap = await getDocs(collection(db, 'sets'));
      const sets = snap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter(s => s.available !== false); // only public sets
      startTransition(() => setAllSets(sets)); // re-wrap after await
    });
  }, []);

  // Defer the expensive filtering render — input stays responsive
  const deferredQuery = useDeferredValue(query);

  const results = useMemo(() => {
    if (!deferredQuery.trim()) return allSets;
    const q = deferredQuery.toLowerCase();
    return allSets.filter(set =>
      set.title?.toLowerCase().includes(q) ||
      set.description?.toLowerCase().includes(q) ||
      set.domain?.toLowerCase().includes(q) ||
      set.tags?.some(t => t.includes(q))
    );
  }, [allSets, deferredQuery]);

  const isStale = query !== deferredQuery;

  return { query, setQuery, results, isStale, isPending, loadSets };
}
```

### Key decisions encoded here:
1. `useState(query)` is synchronous (input never lags)
2. `useDeferredValue(query)` defers the expensive `useMemo` filter render
3. `isStale = query !== deferredQuery` → use to show loading indicator on results
4. `startTransition(async () => {...})`  for initial Firestore load (marks as low-priority)
5. `available !== false` filter in JS (not Firestore) to keep query simple
6. `useMemo([allSets, deferredQuery])` — filter only re-runs when deferred value settles

---

## Pitfalls Summary

| # | Pitfall | Fix |
|---|---|---|
| 1 | `startTransition` on controlled input | Use plain `useState` for input, `useDeferredValue` for results |
| 2 | `useDeferredValue` without `memo` | Wrap the results component in `React.memo` |
| 3 | `setState` after `await` in transition | Wrap in a new `startTransition` call |
| 4 | Firestore read per keystroke | Load once, filter in-memory |
| 5 | Exposing admin fields in Firestore returns | Strip in `.map()` before indexing |
| 6 | `array-contains` for fuzzy substring | Pre-tokenize OR use client-side library |
| 7 | No `aria-live` on results | Add `aria-live="polite"` to results region |
| 8 | Adding both Fuse.js and MiniSearch | Pick one (MiniSearch preferred) or none (plain filter) |

---

## Decision

**For this project (SimulatorExam, ~100–500 sets):**

1. ✅ **Load all set metadata once** on the Explore page mount using `getDocs` in `startTransition`
2. ✅ **Filter client-side** using `useDeferredValue` + `React.memo` + `useMemo`
3. ✅ **Plain `String.includes`** for MVP (0 kB) — add MiniSearch later if fuzzy is requested
4. ✅ **Do NOT** use Algolia/Typesense/Firebase Extensions — overkill for this scale
5. ✅ **Security**: filter `available !== false` and strip internal fields in JS before storing in state
6. ✅ **Accessibility**: `role="search"`, `aria-live="polite"`, `aria-label` on input

**Do NOT proceed to implementation without user confirmation.**
