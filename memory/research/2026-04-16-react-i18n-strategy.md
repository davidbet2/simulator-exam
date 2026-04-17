# Research: React 19 + Vite i18n Strategy for CertZen

**Date:** 2026-04-16
**Stack context:** React 19 · Vite 5 · Firebase · Tailwind · Framer Motion · JSX (no TS)
**Requested by:** Replace custom flat-dictionary i18n helper at `src/core/i18n.js` (es/en/fr/pt/de/it/zh/ja) with a production-grade solution. ~30 components, ~500 strings, most hardcoded in Spanish.

---

## Executive Summary

**Recommendation: adopt Lingui (v5.9.5 stable) with the Vite plugin and the `<Trans>` + `useLingui` macro.** It gives the lowest total cost for this situation: handles nested JSX (ubiquitous in hardcoded Spanish strings) better than any competitor, is ~3.3 kB gzipped runtime, supports ICU plurals/dates/numbers natively, has an extraction CLI that finds hardcoded strings, works with JSX (no TS required), and is compatible with React 19. Ship es+en fully human-reviewed, then add fr/pt/de/it/zh/ja as machine-translated (DeepL/GPT-4o) with a "Beta translation" badge and community feedback link.

---

## Findings (summary)

1. **react-i18next** — safe default, 15–20 kB, but weaker nested-JSX DX (manual `<0>` indices).
2. **Lingui 5.9.5** — smallest runtime (~3.3 kB), best JSX migration DX via `<Trans>` macro, ICU native, official Vite plugin, React 19 ready (adopted new JSX transform in v5.9.0).
3. **FormatJS / react-intl** — mature but verbose `FormattedMessage` per string, 12–16 kB.
4. **Paraglide JS** — fastest bundles for new projects with simple strings, but poor fit for migrating rich Spanish JSX and 8 locales (inline-all-locales cost).
5. **Keep custom** — dead end at 8 languages: no ICU, no extraction, no lazy loading.

## Comparison

| Criterion | **Lingui 5.9** | react-i18next | FormatJS | Paraglide | Custom |
|---|---|---|---|---|---|
| Runtime (gz) | ~3.3 kB | ~15–20 kB | ~12–16 kB | ~2 kB + msgs | <0.5 kB |
| Nested JSX migration | ✅ Best | 🟠 manual indices | 🟠 verbose | ❌ refactor needed | n/a |
| ICU plurals/select | ✅ Native | 🟠 plugin | ✅ Native | ✅ plugin | ❌ |
| Dates/numbers | ✅ `i18n.date/number` | 🟠 formatters | ✅ | ✅ Intl | ❌ |
| Extraction CLI | ✅ `lingui extract` | ✅ | ✅ | ✅ | ❌ |
| Vite plugin (HMR) | ✅ official | 🟠 community | 🟠 community | ✅ official | n/a |
| Lazy per-locale | ✅ dynamic import | ✅ HTTP backend | ✅ | 🟠 experimental | ❌ |
| React 19 + Vite 5 | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Score /10** | **9** | 7 | 6 | 6 | 2 |

---

## Recommendation: Lingui v5.9.5

### Dependencies to pin
```json
{
  "dependencies": {
    "@lingui/core": "~5.9.5",
    "@lingui/react": "~5.9.5"
  },
  "devDependencies": {
    "@lingui/cli": "~5.9.5",
    "@lingui/vite-plugin": "~5.9.5",
    "@lingui/babel-plugin-lingui-macro": "~5.9.5",
    "eslint-plugin-lingui": "~2.4.0"
  }
}
```
Do **not** adopt v6 yet — still pre-release (April 2026) and requires Node ≥ 22.19.

### Migration phases

**Phase 1 — Setup**
1. Install Lingui deps.
2. Add `lingui.config.js`:
   ```js
   export default {
     locales: ['es', 'en', 'fr', 'pt', 'de', 'it', 'zh', 'ja'],
     sourceLocale: 'es',
     fallbackLocales: { default: 'en' },
     catalogs: [{
       path: '<rootDir>/src/locales/{locale}/messages',
       include: ['src'],
     }],
     format: 'po',
   };
   ```
3. Register Vite plugin in `vite.config.js` + Babel macro.
4. Replace `src/core/i18n.js` with thin wrapper that initializes `i18n` from `@lingui/core`, reads locale from Zustand store, dynamically imports `./locales/${locale}/messages.po`.
5. Wrap `<App>` in `<I18nProvider>`.

**Phase 2 — Seed catalogs from existing dict**
6. Script to convert current flat dict → 8 `.po` files (preserves all existing translations).
7. Run `npx lingui compile`.
8. Remove old `dict`/`useTranslation`/`VALID_LANGS`.

**Phase 3 — Incremental component migration**
9. Wrap hardcoded Spanish in `<Trans>`:
   ```jsx
   import { Trans } from '@lingui/react/macro';
   <h2><Trans>Empieza un simulacro</Trans></h2>
   ```
10. For attributes/strings outside JSX use the macro hook:
    ```jsx
    import { useLingui } from '@lingui/react/macro';
    const { t } = useLingui();
    <img alt={t`Logo de CertZen`} />
    ```
11. Run `npx lingui extract` — scans codebase and adds missing msgids without overwriting existing translations.
12. Enable `eslint-plugin-lingui` rules: `no-unlocalized-strings` (warn), `no-expression-in-message` (error).

**Phase 4 — Translation workflow**
13. Ship es + en human-reviewed first.
14. Machine-translate fr/pt/de/it/zh/ja with DeepL API or GPT-4o via Node script consuming `.po`. Mark as `#, fuzzy`.
15. UI: show a "Community translation — report issues" link in the language selector.
16. Optional TMS later: Crowdin / Locize / Tolgee free tiers.

### Common patterns

```jsx
// Nested JSX
<Trans>
  Tienes <strong>{messagesCount}</strong> exámenes.{' '}
  <a href="/explore">Explora más</a>.
</Trans>

// Pluralization
<Plural value={count} one="# pregunta restante" other="# preguntas restantes" />

// Dates / numbers
const { i18n } = useLingui();
<span>{i18n.date(attempt.finishedAt, { dateStyle: 'medium' })}</span>
<span>{i18n.number(score, { style: 'percent' })}</span>
```

```js
// Lazy-load locale catalog
async function activate(locale) {
  const { messages } = await import(`./locales/${locale}/messages.po`);
  i18n.load(locale, messages);
  i18n.activate(locale);
}
```

---

## Anti-Patterns

- ❌ Don't hand-write message IDs — let the macro generate content-based IDs.
- ❌ Don't put complex expressions inside `<Trans>` — extract variables first.
- ❌ Don't import from `@lingui/react` directly — use `@lingui/react/macro` (compile-time, ~60% smaller).
- ❌ Don't bundle all 8 catalogs eagerly — use dynamic `import()`.
- ❌ Don't ship MT without marking it (`#, fuzzy` + UI badge).
- ❌ Don't migrate all ~500 strings in one PR — do it feature by feature; untranslated strings fall back to the Spanish source.

---

## Security & Ops

- `.po` files are not secrets — safe to commit.
- Never interpolate user input into a message with `dangerouslySetInnerHTML` without sanitizing (DOMPurify).
- DeepL/OpenAI keys must stay server/Node-side, never bundled (no `VITE_` prefix).
- Add `locales/**/*.po` to Prettier ignore.

---

## Sources

| # | URL | Used In |
|---|---|---|
| 1 | https://lingui.dev/introduction | Findings 2, 6 |
| 2 | https://lingui.dev/tutorials/react | Snippets, Finding 2 |
| 3 | https://github.com/lingui/js-lingui/releases (v5.9.5, 2026-04-06) | Version pinning |
| 4 | https://www.npmjs.com/package/@lingui/react | Weekly downloads |
| 5 | https://react.i18next.com/ | Finding 1 |
| 6 | https://www.i18next.com/overview/comparison-to-others | Finding 1 |
| 7 | https://inlang.com/m/gerre34r/library-inlang-paraglideJs | Finding 4 |
| 8 | https://inlang.com/m/gerre34r/library-inlang-paraglideJs/comparison | Finding 4 |
| 9 | https://dropanote.de/en/blog/20250726-why-i-replaced-i18next-with-paraglide-js/ | Finding 4 |

---

## Out of Scope

- SSR/RSC (not applicable — Vite SPA).
- RTL locales (no Arabic/Hebrew requested).
- TMS vendor choice — decide after Phase 3.
