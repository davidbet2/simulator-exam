# Research: Novel & Engaging Study Formats for CertZen Multi-Platform Simulator

**Date:** 2026-04-16
**Stack context:** React 19 · Vite · Firestore · Zustand · Tailwind · Framer Motion · Lucide
**Requested by:** Product — current 5 modes (Estudio Guiado, Práctica Rápida, Modo Examen, Zona Débil, Repaso Inteligente) feel too similar. Goal: design 5–8 *original* study formats that raise motivation and retention for time-constrained adult professionals, using only MCQ / multi-select / matching / ordering (no free text).
**Companion report:** `memory/research/2026-04-16-study-modes-learning-science.md`

---

## Executive Summary / TL;DR

Each existing mode already claims one lever: retrieval+feedback (Estudio Guiado), micro-spacing (Práctica Rápida), testing effect w/ delayed feedback (Examen), targeted practice (Zona Débil), SRS/Leitner (Repaso Inteligente). To avoid redundancy, **each new mode must claim a different, evidence-backed lever** — confidence calibration, pretesting, interleaving, elaborative retrieval, transfer, flow, survival stakes, or autonomy/progression.

**Ranked shortlist (1-line pitches):**

1. **Apuesta tu Confianza** — Bet 1–3 points on every answer; winnings/losses expose miscalibration and accelerate metacognition. *(Confidence-Based Repetition — Cohen 2008/2010; Hacker 2008.)*
2. **Caso Estudio (Testlet)** — 1 realistic scenario → 3–5 linked questions sharing context; trains transfer, not trivia. *(Scenario-cluster items, NBME 2020; Pan & Rickard 2018.)*
3. **Ruta de Dominio** — Duolingo-style map of domain nodes; unlock the next only by mastering the previous. *(Scaffolded progression + SDT autonomy/competence — Ryan & Deci 2000; gamification meta-analysis Li et al. 2023, g=0.822.)*
4. **Supervivencia · 3 Vidas** — Streak run: keep answering right; 3 wrong = run over. Stakes create flow. *(Flow — Csikszentmihalyi 1997; desirable difficulty — Bjork 1994.)*
5. **Detective: ¿Por qué falla?** — You see the question + the *wrong* answer; job is to pick which distractor trap was used (ambiguity, wrong domain, partial-truth, etc.). *(Elaborative retrieval + generation effect — Slamecka & Graf 1978; Karpicke & Blunt 2011.)*
6. **Ráfaga Contrarreloj** — 60-second sprint: max correct answers, wrong answers cost 3s. *(Testing effect under time pressure + flow; gamification Zeng et al. 2024, g=0.782.)*
7. **Swipe Binario (Pretest)** — Before a topic lesson/review, 10 rapid true-ish/false-ish decisions on assertions; immediate corrective feedback. *(Pretesting effect — Pan & Carpenter 2023; Richland et al. 2009.)*
8. **Mezcla Tie-Dye (Interleaved Mix)** — Forces 4+ different domains per session with a visible "dominio actual" pill that keeps switching. *(Interleaving — Rohrer & Taylor 2007; Rohrer 2012.)*

**Recommended next 2–3 to build:** **#1 Apuesta tu Confianza**, **#2 Caso Estudio (Testlet)**, **#3 Ruta de Dominio** — see §6 for rationale.

---

## Context & Constraints

- React 19 + Vite + Firestore. Must be implementable without heavy new deps.
- Content types: `multiple`, `matching`, `ordering`. **No free text** → any "explain-it" mode must be reformulated as selection.
- Per-question stats already tracked: `box 1–5`, `lastResult`, `dueAt`, `rightCount`, `wrongCount`, `lastSeenAt` (`src/features/exam/utils/questionStats.js`).
- Audience: adult professionals, time-boxed (5–30 min sessions, often mobile).
- Design: warm light-first (Duolingo-inspired), Tailwind tokens, Lucide icons, Framer Motion micro-interactions.
- Existing modes claim: retrieval + immediate feedback (study), micro-spacing (quick), testing effect + delayed feedback (exam), targeted practice (weak), Leitner SRS (srs).

---

## Landscape Scan

| Platform | Signature mechanic | Lever | Transferable? |
|---|---|---|---|
| UWorld (medical/CPA) | Tutor mode + linked vignette testlets | Transfer, scenario reasoning | ✅ → Caso Estudio |
| Quizlet Learn/Match | Adaptive MCQ + timed pair-matching | Retrieval + speed-flow | ⚠️ Match weak for concepts |
| Brilliant | Scaffolded 5–8 question concept chains | Generation + elaboration | ⚠️ High authoring cost |
| Duolingo Path | Unit map with unlockable nodes | Autonomy + competence (SDT) | ✅ → Ruta de Dominio |
| Kahoot / Blooket / Gimkit | Time-pressure quiz games | Flow + extrinsic reward | ✅ → Ráfaga, Supervivencia |
| Brainscape | Confidence-Based Repetition (1–5) | Metacognition + SRS | ✅ → Apuesta tu Confianza |
| RemNote / Anki+FSRS | Grade-driven SRS | Spacing | Already covered |
| Memrise | "Mems" — user mnemonics | Elaboration | ❌ needs free text |
| StudyStream cohorts | Body-doubling | Relatedness (SDT) | ⛔ out of scope v1 |

---

## Learning-Science Levers

| Lever | Key citation | Already used by |
|---|---|---|
| Retrieval practice | Roediger & Karpicke 2006; Karpicke & Blunt 2011 | Estudio Guiado |
| Spaced repetition | Ebbinghaus; Cepeda et al. 2006 | Repaso Inteligente |
| Testing effect (delayed) | Rowland 2014; Yang et al. 2021 | Modo Examen |
| Targeted practice | Ericsson 1993 | Zona Débil |
| **Confidence calibration** | Hacker 2008; Dunning-Kruger 1999; Cohen 2008 | *Unused → #1* |
| **Transfer / scenario** | Pan & Rickard 2018; Barnett & Ceci 2002 | *Unused → #2* |
| **Autonomy/competence (SDT)** | Ryan & Deci 2000; Li et al. 2023 (g=0.822) | *Unused → #3* |
| **Flow / desirable difficulty** | Csikszentmihalyi 1997; Bjork 1994 | *Unused → #4, #6* |
| **Elaborative retrieval** | Slamecka & Graf 1978 | *Unused → #5* |
| **Pretesting effect** | Richland et al. 2009; Pan & Carpenter 2023 | *Unused → #7* |
| **Interleaving** | Rohrer & Taylor 2007; Rohrer 2012 | *Unused → #8* |

---

## Ranked Shortlist — 8 Novel Modes

### 1. Apuesta tu Confianza (Confidence Wager)

- **Pitch:** Bet 1, 2, or 3 points on every answer — wrong high-confidence hurts, right uncertain surprises. Scoreboard exposes miscalibration.
- **Mechanic:**
  - Before reveal, user taps ×1, ×2, or ×3 confidence multiplier.
  - Correct → +multiplier; wrong → −multiplier.
  - End-session: Brier/calibration chart (confidence bucket vs actual accuracy).
  - Wrong-with-×3 items force-add to Zona Débil tagged "trampa".
  - Bet multiplier stored in `questionStats` for future Leitner weighting.
- **UI:** Question card; compact 3-button row `[×1 Dudo][×2 Creo][×3 Seguro]` (Lucide `HelpCircle`/`Check`/`Zap`). After confirm: banner `+6` or `−6`. End-of-session radial "calibración" chart.
- **Science:** Brainscape CBR (Cohen 2008/2010); metacognition (Hacker, Dunlosky & Graesser 2008); Dunning-Kruger (1999); hypercorrection effect (Butterfield & Metcalfe 2001) — high-confidence errors are the highest-value learning signal.
- **Complexity:** **S** — reuses exam engine; +1 UI step, +1 field, +1 chart.
- **Differentiation:** No existing mode captures metacognition/certainty. Strongest evidence-to-effort ratio.

### 2. Caso Estudio (Scenario Testlet)

- **Pitch:** One real scenario from the target certification → 3–5 linked questions sharing the context. Trains transfer.
- **Mechanic:**
  - Scenario briefing card (200–350 words, optional diagram).
  - 3–5 MCQ/matching/ordering referencing scenario.
  - Scenario pinned collapsible during all questions.
  - No per-question feedback; debrief at end with "decision trace".
  - New Firestore collection `scenarios/{scenarioId}` with `questionIds[]`.
- **UI:** Full-width scenario header (amber card, `FileText`). Vertical stepper. Debrief narrative "Lo que hiciste bien / lo que perdiste".
- **Science:** Transfer (Barnett & Ceci 2002); Pan & Rickard 2018 meta; NBME scenario/vignette gold standard for professional cert.
- **Complexity:** **M** — new model + authoring + component.
- **Differentiation:** First multi-question coherent unit; matches real professional-cert work across all categories.

### 3. Ruta de Dominio (Domain Path)

- **Pitch:** Duolingo-style map of certification domains as unlockable nodes. Progress feels tangible.
- **Mechanic:**
  - Each domain (Records, Process Models, Interfaces, Data Fabric, Security) = node on SVG path.
  - States: locked/available/in-progress/mastered.
  - Mastery = Leitner box ≥4 on 80% of domain questions.
  - Tap node → 10-question focused session.
  - "Constellation view" of mastered nodes (Framer Motion).
- **UI:** Vertical scrollable SVG path; circular nodes + dashed line; Lucide icons per domain (`Database`,`Workflow`,`LayoutGrid`,`Shield`,`Layers`); bottom sheet modal.
- **Science:** SDT autonomy+competence (Ryan & Deci 2000); Li et al. 2023 g=0.822; Zeng 2024 g=0.782; cognitive load (Sweller 1988); NN/g 2023 progress indicators.
- **Complexity:** **M** — SVG path + mastery computation (from existing stats).
- **Differentiation:** First mode surfacing curriculum structure. Largest motivational lift.

### 4. Supervivencia · 3 Vidas

- **Pitch:** Answer right in a row. 3 wrong = run over. Post your personal best.
- **Mechanic:**
  - No fixed length — runs until 3 errors.
  - 3 hearts visible (Framer Motion shake + desaturate on break).
  - Streak tiers at 5/10/25/50 with "subida de rango" pop.
  - Questions weighted toward Leitner box ≤3.
  - Run-over → 3 killers auto-added to Zona Débil.
- **UI:** Minimal chrome, 3 hearts + streak; game-over amber inversion of celebratory card.
- **Science:** Flow (Csikszentmihalyi 1997); desirable difficulty (Bjork 1994); loss aversion (Kahneman & Tversky 1979) ethically — loss is reversible; Zeng 2024 g=0.782.
- **Complexity:** **S** — UI layer on existing engine.
- **Differentiation:** First mode with variable length / stakes.

### 5. Detective: ¿Por qué falla?

- **Pitch:** See question + a *wrong* answer already selected. Diagnose which trap (ambiguity, wrong domain, partial truth, outdated, scale, object/process).
- **Mechanic:**
  - Pre-filled incorrect answer highlighted red.
  - Pick from fixed taxonomy: `Confusión de dominio`, `Verdad parcial`, `Obsoleto`, `Ambigüedad`, `Trampa de escala`, `Confusión objeto/proceso`.
  - Each distractor has authored `distractorTag`.
  - Matching-type when multiple distractors.
  - "Tus trampas más frecuentes" aggregate.
- **UI:** Two-column; left = question with red X; right = 6 trap chips. Lucide `Search`/`AlertTriangle`.
- **Science:** Generation effect (Slamecka & Graf 1978); elaborative retrieval (Karpicke & Blunt 2011); MCQ benefits (Little & Bjork 2015).
- **Complexity:** **M** — content tagging effort (~30s per Q), simple runtime UI.
- **Differentiation:** User's task is *not* "choose right" but "explain why wrong is wrong". Highest pedagogical depth.

### 6. Ráfaga Contrarreloj

- **Pitch:** 60 seconds. One screen. Max correct. Wrong = −3s.
- **Mechanic:** MCQ-only, single-select preferred. Streak ≥5 → +0.5s bonus. Personal best in `users/{uid}/highscores`. End-screen lists killers → Zona Débil.
- **UI:** Giant timer bar at top; single big card; screen flash red on wrong.
- **Science:** Fluency under retrieval pressure (Roediger & Karpicke 2006); flow; Li 2023 + Zeng 2024. Ethical: only questions at Leitner box ≥2 to avoid harming encoding.
- **Complexity:** **S**.
- **Differentiation:** Only reaction-time mode.

### 7. Swipe Binario (Pretest)

- **Pitch:** Before a study session, 10 rapid "¿Esta afirmación es correcta?" cards. Wrong → priorities for today's session.
- **Mechanic:** 10 two-option items (~90s total). Immediate green/red + one-line rationale. Wrong → auto Repaso queue. New item type `{pretest: true}`.
- **UI:** Mobile-first swipe-card (Framer Motion `drag`); buttons for accessibility; card stack style. Final "Enfócate en estos 3 temas".
- **Science:** Pretesting effect (Richland, Kornell & Kao 2009; Kornell et al. 2009; Pan & Carpenter 2023 meta d≈0.35). Productive failure.
- **Complexity:** **S–M** — authoring needed, swipe UI small.
- **Differentiation:** Only mode that runs *before* learning. New phase of the journey.

### 8. Mezcla Tie-Dye (Interleaved Mix)

- **Pitch:** Forced cross-domain session. No two consecutive items share a domain.
- **Mechanic:** Domain pill shifts color. Preset lengths 12/24/48. Gated: ≥10 questions seen across ≥3 domains (Carvalho & Goldstone 2014).
- **UI:** Same card + colored pill with Framer Motion slide on change. End: domain accuracy heatmap.
- **Science:** Interleaving for discrimination (Rohrer & Taylor 2007; Rohrer 2012; Kang 2016). Critical for overlapping domains (Records vs Data Fabric vs Data Stores).
- **Complexity:** **S** — selection adjacency rule + pill UI.
- **Differentiation:** Only mode explicitly optimizing cross-domain discrimination.

---

## Comparison Table

| # | Mode | Lever | Complexity | New data | Score /10 |
|---|---|---|---|---|---|
| 1 | Apuesta tu Confianza | Confidence calibration | **S** | `confidence` on answer | **9** |
| 2 | Caso Estudio | Transfer / scenario | **M** | `scenarios` collection | **9** |
| 3 | Ruta de Dominio | Autonomy / progression | **M** | derived | **9** |
| 4 | Supervivencia 3 Vidas | Flow / difficulty | **S** | `highscores` | 7 |
| 5 | Detective | Generation / elaborative | **M** | `distractorTag` | 8 |
| 6 | Ráfaga Contrarreloj | Fluency + flow | **S** | `highscores` | 7 |
| 7 | Swipe Binario | Pretesting effect | **S–M** | `pretest` type | 8 |
| 8 | Mezcla Tie-Dye | Interleaving | **S** | adjacency rule | 7 |

---

## Anti-Patterns to Avoid

- **Overjustification effect** (Deci 1971; Lepper, Greene & Nisbett 1973): heavy extrinsic rewards reduce intrinsic motivation. Use progression + feedback; avoid economies.
- **Streak anxiety / dark patterns** (Duolingo 2021 redesign): never punish streak loss; provide freezes; cap notifs 1/day.
- **Public leaderboards** hurt engagement for mid/bottom (Landers 2014). Opt-in, friends-only if ever.
- **Time pressure during initial learning** harms encoding (Cepeda 2006). Ráfaga only surfaces box ≥2.
- **Interleaving too early** hurts acquisition (Carvalho & Goldstone 2014). Gate Tie-Dye.
- **Matching/ordering in speed modes** break flow → MCQ-only.
- **Scenario fatigue:** Caso Estudio caps at 5 linked questions (NBME 2020).

---

## Security / Privacy Notes

- Firestore rules: any new per-user collection (`highscores`, etc.) owner-only — mirror existing `users/{uid}/questionStats/{statId}` rule.
- No PII in scenario content or scores.
- OWASP A04: survival/ráfaga scores validated server-side only if public leaderboards (out of scope v1).

---

## Recommended Next 2–3 to Build

### 🥇 #1 Apuesta tu Confianza — Build First
Highest evidence-to-effort ratio. Small complexity. Claims metacognition lever no current mode touches. "Aha" within first session. Directly produces better Zona Débil seeds via hypercorrection effect.

### 🥈 #2 Caso Estudio / Testlet — Build Second
Highest content differentiation for a technical/procedural cert. Certifications test workflow reasoning, not trivia — testlets are how NBME/UWorld/SAT evolved. Authoring cost front-loaded; 10 good scenarios cover 80% of exam surface. Reusable engine extension.

### 🥉 #3 Ruta de Dominio — Build Third
Largest motivational lift per gamification meta-analyses (g≈0.82). Addresses visible-progression weakness. Uses only existing data. Should ship after #1 & #2 exist so there's meaningful progression to display.

**Defer:** #4 & #6 overlap on flow/stakes — pick one. #5 authoring-heavy. #7 belongs in content-authoring milestone. #8 trivial — 1-day side quest after #3.

---

## Sources Registry

| # | Citation | Date |
|---|---|---|
| 1 | Roediger & Karpicke (2006). *Test-Enhanced Learning*. Psychological Science 17(3). | 2006 |
| 2 | Karpicke & Blunt (2011). *Retrieval Practice Produces More Learning Than Elaborative Studying*. Science 331. | 2011 |
| 3 | Rohrer & Taylor (2007). *The shuffling of math problems improves learning*. Instructional Science 35. | 2007 |
| 4 | Rohrer (2012). *Interleaving helps students distinguish similar concepts*. Educ Psych Rev 24(3). | 2012 |
| 5 | Bjork (1994). *Memory and metamemory considerations in training*. In *Metacognition*. MIT Press. | 1994 |
| 6 | Csikszentmihalyi (1997). *Finding Flow*. Basic Books. | 1997 |
| 7 | Ryan & Deci (2000). *SDT and intrinsic motivation*. Contemp Educ Psych 25(1). | 2000 |
| 8 | Kruger & Dunning (1999). *Unskilled and Unaware of It*. JPSP 77(6). | 1999 |
| 9 | Hacker, Dunlosky & Graesser eds. (2008). *Handbook of Metacognition in Education*. Routledge. | 2008 |
| 10 | Butterfield & Metcalfe (2001). *Errors with high confidence are hypercorrected*. JEP:LMC 27(6). | 2001 |
| 11 | Cohen (2008/2010). *Confidence-Based Repetition* (Brainscape whitepapers). | 2008/10 |
| 12 | Richland, Kornell & Kao (2009). *Pretesting effect*. JEP:Applied 15(3). | 2009 |
| 13 | Pan & Carpenter (2023). *Pretesting effects: review + meta*. Educ Psych Rev 35. | 2023 |
| 14 | Pan & Rickard (2018). *Transfer of test-enhanced learning meta*. Psych Bulletin 144(7). | 2018 |
| 15 | Barnett & Ceci (2002). *Taxonomy for far transfer*. Psych Bulletin 128(4). | 2002 |
| 16 | Slamecka & Graf (1978). *The generation effect*. JEP:HLM 4(6). | 1978 |
| 17 | Little & Bjork (2015). *Optimizing MCQ as tools for learning*. Memory & Cognition 43(1). | 2015 |
| 18 | Li, Xia, Chu & Yang (2023). *Gamification for self-regulation meta*. Frontiers Psych 14. g=0.822, n=5071. | 2023 |
| 19 | Zeng, Li, Dai & Hwang (2024). *Gamified interventions higher ed meta*. BJET. g=0.782. | 2024 |
| 20 | Deci (1971). *Externally mediated rewards & intrinsic motivation*. JPSP 18(1). | 1971 |
| 21 | Lepper, Greene & Nisbett (1973). *Overjustification*. JPSP 28(1). | 1973 |
| 22 | Landers & Landers (2014). *Leaderboards on time-on-task*. Sim & Gaming 45(6). | 2014 |
| 23 | Wikipedia: Testing effect — https://en.wikipedia.org/wiki/Testing_effect | 2026-04-16 |
| 24 | Wikipedia: Spaced repetition — https://en.wikipedia.org/wiki/Spaced_repetition | 2026-04-16 |
| 25 | Wikipedia: Desirable difficulty — https://en.wikipedia.org/wiki/Desirable_difficulty | 2026-04-16 |
| 26 | Wikipedia: Gamification of learning — https://en.wikipedia.org/wiki/Gamification_of_learning | 2026-04-16 |
| 27 | retrievalpractice.org (Agarwal) — https://www.retrievalpractice.org/ | 2026-04-16 |
| 28 | Bjork Learning & Forgetting Lab, UCLA — https://bjorklab.psych.ucla.edu/ | 2026-04-16 |
| 29 | The Learning Scientists — Interleaving digest — https://www.learningscientists.org/ | 2026-04-16 |
| 30 | Duolingo 2024 Efficacy Report — https://www.duolingo.com/efficacy | 2026-04-16 |
| 31 | NBME Item-Writing Guide — https://www.nbme.org/item-writing-guide | 2026-04-16 |
| 32 | Carvalho & Goldstone (2014). *Interleaved vs blocked study*. Frontiers Psych 5. | 2014 |

---

## Out of Scope (Future Cycles)

- Social/cohort modes (StudyStream-style) — revisit when DAU > 500.
- AI-generated questions/explanations — separate track.
- Adaptive difficulty via IRT/2PL — needs ~200+ attempts/question.
- FSRS v5 upgrade from Leitner — companion report.
- Voice / audio formats — TTS infrastructure.
- Boss Fight / live multiplayer — v2.

---

**End of report.**
