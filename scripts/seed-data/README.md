# Seed — Official Multi-Domain Exam Sets

This directory contains the data and scripts to populate the `examSets` collection
with **official, curated content** across multiple domains: IT, Cloud, Health,
English (CEFR), Logic/Aptitude, and Appian.

## Content & Licensing

> ⚖️ **All questions are ORIGINAL content** written by referencing ONLY
> **publicly available exam blueprints**, open educational material, or
> public-domain references. No copyrighted material from commercial
> certification exams has been copied.

Every set declares a `source` field with the blueprint/document it was written
against (e.g. "Basado en AWS CCP Exam Guide v1.0 — aws.amazon.com").

## Files

```
scripts/
├── seed-data/
│   ├── domains.mjs        → Domain catalog (it, health, english, logic, ...)
│   ├── sets-it.mjs        → AWS CCP, Azure AZ-900, Git & GitHub
│   ├── sets-health.mjs    → Primeros auxilios, Anatomía
│   ├── sets-english.mjs   → CEFR A2, B1
│   └── sets-logic.mjs     → Razonamiento lógico
├── seed-official-sets.mjs → Runner (upserts all sets to Firestore)
└── seed.mjs               → Original Appian questions seed (separate flow)
```

## Usage

### First-time setup

```bash
# 1. Set env vars in .env (VITE_FIREBASE_* + SEED_ADMIN_EMAIL/PASSWORD)

# 2. Create admin user + seed Appian questions (run once):
npm run seed

# 3. Seed official multi-domain sets (idempotent — safe to re-run):
npm run seed:official-sets
```

### Add a new set

1. Pick the domain file (`sets-it.mjs`, `sets-health.mjs`, ...) or create a new
   one (e.g. `sets-finance.mjs`) following the existing shape.
2. Add a new object to the exported array:
   ```js
   {
     slug: 'your-unique-slug',
     title: 'Title shown to users',
     description: 'Short description for the card + SEO meta.',
     domain: 'it',                   // must match a DOMAINS id
     category: 'cloud',              // free-form category inside the domain
     level: 'beginner',              // beginner | intermediate | advanced
     language: 'es',                 // es | en
     tags: ['aws', 'cloud'],
     passPercent: 70,
     timeMinutes: 30,
     source: 'Basado en AWS CCP Exam Guide v1.0 (public blueprint)',
     questions: [ /* see shape below */ ],
   }
   ```
3. If you created a new file, import it in `seed-official-sets.mjs` and add
   it to the `ALL_SETS` array.
4. Run `npm run seed:official-sets`.

### Question shape

```js
{
  type: 'multiple',                  // only 'multiple' is used for now
  question: 'Text of the question',
  options: { A: '...', B: '...', C: '...', D: '...' },
  answer: ['B'],                     // array — supports multi-answer
  explanation: 'Why this is the right answer.',
  domain: 'Subtopic within the set', // used for study-mode grouping
  difficulty: 'easy',                // easy | medium | hard
}
```

## Idempotency

Re-running `npm run seed:official-sets` will:

- Overwrite the set metadata (title, description, etc.) via `setDoc` merge.
- **Delete and re-create** all questions in the subcollection — so any edits
  made directly in Firestore will be lost.

If you need to preserve manual edits, run the seed **once**, then manage
content via the admin panel.

## SEO sitemap

After seeding, regenerate the sitemap:

```bash
npm run sitemap
```

This writes `public/sitemap.xml` with all public set landing pages and
`public/robots.txt` with the correct crawl directives.
