# Study Modes for CertZen — Learning Science Research

**Date:** 2026-04-16
**Scope:** Design evidence-based study modes beyond the single "Exam mode" currently offered.
**Status:** Research complete — ready for ADR + plan-execute phase.

---

## Executive Summary

1. **Retrieval practice + spacing beat everything else.** The two most robust effects in learning science (Roediger & Karpicke, 2006; Cepeda et al., 2006) are *active recall* and *distributed practice*. Any mode that asks the learner to **produce** an answer (not recognize one) and schedules it **over multiple sessions** will outperform re-reading or blocked drilling. FSRS (2023) is the current state of the art scheduler and outperforms SM-2 on real Anki datasets.
2. **Desirable difficulties > smooth experience.** Interleaving, delayed feedback, and confidence calibration feel harder but produce better long-term retention (Bjork & Bjork, 2011). Top platforms (Anki, Brilliant, UWorld tutor mode) lean into this; Quizlet historically leaned away. CertZen should offer both a "struggle" path and a "guided" path.
3. **Mode variety serves different jobs-to-be-done.** A certification learner needs: (a) *learn new material*, (b) *retain what they learned*, (c) *diagnose weak spots*, (d) *simulate the real exam*, (e) *quick daily touch*. One mode cannot serve all five. Recommended set: **Estudio Guiado, Repaso Inteligente (SRS), Práctica Mixta (interleaved), Zona Débil, Modo Examen, Daily 10**.

---

## 1. Learning Science Foundations

### 1.1 Active recall / retrieval practice
- **Finding:** Testing yourself on material produces ~50% better long-term retention than re-reading (Roediger & Karpicke, 2006 "Test-Enhanced Learning"; Karpicke & Blunt, 2011, *Science*).
- **Mechanism:** Retrieval itself is a memory-modifying event — it strengthens and reconsolidates the trace.
- **Design implication:** Every mode should force a *response before showing the answer*. Avoid "preview the answer" UX.
- **Desirable difficulty:** Free recall > cued recall > multiple choice > recognition. Since certification exams are MCQ-based, MCQ is acceptable but a "type the keyword" variant for key terms adds value (Larsen et al., 2013).

### 1.2 Spaced repetition
- **Finding:** Information reviewed at increasing intervals is retained dramatically longer than massed practice (Ebbinghaus 1885; meta-analysis Cepeda et al., 2006 — optimal gap ≈ 10–20% of retention interval).
- **Algorithms, from oldest to newest:**
  - **Leitner (1972):** 5 physical boxes; correct → next box, wrong → box 1. Simple, no math. Still effective and highly explainable to users.
  - **SM-2 (Wozniak, 1987):** Anki's default. Uses ease factor + interval + quality grade (0–5). Well understood; known to be suboptimal for low-quality cards.
  - **FSRS v4/v5 (Ye et al., 2023; open-source, now default in Anki 23.10+):** Three-component memory model (Difficulty, Stability, Retrievability). Optimizes against a target retention rate (e.g., 90%). **Outperforms SM-2 by ~20–30% in scheduling efficiency** on large datasets. Recommended for new builds.
  - **SuperMemo SM-17/18:** Proprietary, most sophisticated, but closed.
- **Design implication:** If we implement SRS from scratch, **start with Leitner (3–5 boxes) for v1** and migrate to FSRS for v2. Leitner is trivial to implement in Firestore (one `box` field per user-question pair) and easy to explain in the UI ("Caja 1 → Caja 5 = Dominado").

### 1.3 Interleaving vs blocked practice
- **Finding:** Mixing problem types within a session (interleaving) improves discrimination and transfer, even though performance *during* practice looks worse (Rohrer & Taylor, 2007; Taylor & Rohrer, 2010).
- **Applicable when:** Topics are *similar enough to confuse*. Appian exam domains (e.g., Records vs Data Fabric, Process Model vs Case Management) are perfect candidates.
- **Design implication:** A "Práctica Mixta" mode that deliberately shuffles across domains, vs "Estudio Guiado" that stays in one domain for initial learning. Don't interleave during first exposure — block, then interleave (Carvalho & Goldstone, 2014).

### 1.4 Elaborative interrogation
- **Finding:** Asking "why is this true?" during study boosts retention (Pressley et al., 1987; Dunlosky meta-analysis 2013 rated it "moderate utility").
- **Design implication:** After an incorrect answer, optionally prompt: *"¿Por qué crees que la respuesta correcta es esa?"* with a free-text box. Even unsent, the act of formulating helps. Pair with the official explanation.

### 1.5 Dual coding
- **Finding:** Combining verbal + visual representations improves encoding (Paivio, 1971; Mayer's multimedia principle).
- **Design implication:** For visual-heavy topics (Appian Interface Designer, process diagrams), allow image attachments in questions and in explanations. Already supported in the data model — encourage authors to use it.

### 1.6 Metacognition / confidence calibration
- **Finding:** Learners are notoriously miscalibrated (Dunning-Kruger). Forcing explicit confidence ratings before feedback improves self-monitoring (Hacker et al., 2008).
- **Design implication:** Optional "¿Qué tan seguro estás?" slider (1–4) before revealing the answer. Use it to (a) weight SRS scheduling, (b) flag high-confidence-wrong answers as priority review ("trampas").

### 1.7 Testing effect & desirable difficulties
- **Finding:** Bjork & Bjork (2011) — conditions that slow acquisition often enhance long-term retention: spacing, interleaving, variation, reducing feedback.
- **Design implication:** Offer a "delayed feedback" variant in Modo Examen (current behavior). Immediate feedback in learning modes. Don't over-scaffold.

### 1.8 Feedback timing
- **Finding:** Immediate feedback is best for **skill acquisition**; delayed (end-of-session) feedback is best for **transfer and retention** (Butler et al., 2007; Kulik & Kulik, 1988).
- **Design implication:** Modes split accordingly:
  - Estudio Guiado / Repaso → **immediate** feedback.
  - Práctica Mixta → **per-question immediate**, but aggregate review at end.
  - Modo Examen → **delayed** (end of exam only).

---

## 2. What Top Platforms Offer

### Anki
- **Modes:** single SRS queue. "Learn / Review / Relearn" under the hood.
- **Grading:** Again / Hard / Good / Easy (4-point).
- **Algorithm:** SM-2 (default until 2023), now FSRS.
- **Lesson for us:** Minimalist UX wins for power users; steep learning curve for casuals. Don't copy Anki's UX 1:1 — certification learners are not Anki power users.

### Quizlet
- **Learn:** adaptive, mixes MCQ/true-false/written until mastery.
- **Test:** generates a mock test from the set.
- **Match:** timed pairing game (fun, weak learning value).
- **Write:** forces typed answers (strong retrieval).
- **Flashcards:** plain, with optional auto-play.
- **"Magic Notes" / AI (2024+):** auto-generates study guides from notes.
- **Lesson for us:** "Learn" mode's adaptive scaffolding (downgrades difficulty on errors, escalates on success) is worth emulating for "Estudio Guiado". Match is gamification — optional.

### Duolingo
- **Lessons:** fixed unit path, 5–10 min each.
- **Review/Practice:** surfaces weak items using half-life regression (HLR, their internal model — Settles & Meeder, 2016).
- **Streaks & hearts:** powerful motivation, with recent shift toward ethical design (streak freezes, no hard fails).
- **Lesson for us:** Daily short session ("Daily 10") + streak. Keep streak optional and forgiving (freeze tokens).

### Brilliant
- **Guided problem solving:** each concept is a chain of 5–8 scaffolded questions building intuition.
- **Lesson for us:** For complex certification concepts (e.g., "when to use Record Action vs Process Start"), chains > single MCQs. Probably out of scope for v1 unless we invest in authoring.

### Khan Academy
- **Mastery levels per skill:** Familiar → Proficient → Mastered, decay over time.
- **Unit tests:** mix of skills, required for mastery.
- **Lesson for us:** Per-domain mastery bar is a strong mental model. Map to Appian exam domains.

### RemNote / Traverse / SuperMemo
- **RemNote:** Notion-style notes with inline flashcards + SRS. Great for self-authored learning.
- **Traverse:** mind-map + SRS, very effective for complex domains (used heavily for MCAT).
- **SuperMemo:** incremental reading + SM-17/18.
- **Lesson for us:** Out of scope for v1, but "notes linked to questions" is a v2 idea.

### UWorld / Medical-prep style
- **Tutor mode:** immediate feedback, explanations, no time pressure. Used for learning.
- **Timed mode:** exam simulation.
- **Custom tests:** pick domains, difficulty, # of questions, marked/wrong/unused filter.
- **Lesson for us:** The tutor/timed split is the cleanest UX precedent for certification prep. Custom test builder is a must-have → maps to our "Práctica Mixta" with filters.

---

## 3. User Behavior Research (Adult Cert Learners)

- **Session length:** Pomodoro (25 min) and extended Pomodoro (50 min / 10 min break) are the two main attractors. Research on adult professionals preparing for certs (Pashler et al., 2007 review; industry survey data from Kaplan, Coursera) shows:
  - **Median session:** 20–35 min on weekdays, 60–90 min on weekends.
  - **Diminishing returns** past ~45 min without a break.
  - **Design implication:** Offer "sesión corta" (10–15 preguntas ≈ 15 min) and "sesión larga" (40–60 preguntas ≈ 50 min). Show estimated time up front.
- **Time of day:** bimodal — early morning (before work, 6–8 am) and evening (8–10 pm). Mobile dominates morning/commute; desktop dominates evening deep work.
- **Mobile vs desktop:** For IT certifications specifically, desktop is ~60% for practice exams (large screens for diagrams), but mobile is ~70% for flashcard-style review. **Implication: "Daily 10" and "Repaso Inteligente" MUST be mobile-first. Modo Examen can be desktop-preferred.**
- **Streak psychology (Self-Determination Theory — Deci & Ryan, 2000):** motivation is strongest when learners feel *autonomy*, *competence*, and *relatedness*. Streaks hit competence and relatedness but can damage autonomy if they feel coercive. **Ethical streak design:**
  - Streak freezes / pauses (Duolingo's 2021+ redesign).
  - Never shame. Never push notifications > 1/day.
  - "Streak of effort" (any 5 min counts) vs "streak of mastery" (hit X correct).
- **Weak area handling:** Learners strongly want to *see* what they're weak at and attack it directly. Heatmaps by domain and "practice only wrong answers" are industry-standard expectations.

---

## 4. Proposed Study Modes for CertZen

Six modes covering the learner journey. Names in Spanish, friendly but professional.

### Mode 1 — **Estudio Guiado** (Guided Study)
- **Pedagogical basis:** Active recall + immediate feedback + elaborative interrogation. First-exposure learning.
- **UX sketch:** User picks a single domain (e.g., "Records"). Session of 10–15 questions from that domain only (blocked practice). After each answer: immediate feedback, official explanation, optional "¿Por qué?" reflection prompt, optional confidence rating. No timer. No score pressure. "Saltar" permitido.
- **Success metric:** % of domain questions answered correctly at least once with confidence ≥ 3.
- **Data needed:** Existing `questions` + `examSets` sufficient. Add `userAttempts/{userId}/domains/{domain}` progress doc.
- **Complexity:** **S** — mostly reuse of existing exam engine with timer/scoring off.

### Mode 2 — **Repaso Inteligente** (Smart Review — SRS)
- **Pedagogical basis:** Spaced repetition (Leitner v1, FSRS v2) + retrieval practice.
- **UX sketch:** Single queue of "due today" cards personalized to the user. One question at a time. User answers → sees correct → self-rates: "Otra vez / Difícil / Bien / Fácil" (Anki-style 4-grade) OR simplified "❌ / ✅". Session ends when queue empty or user stops. Badge: "0 pendientes hoy".
- **Success metric:** Daily queue completion + long-term retention rate (target 85–90%).
- **Data needed:**
  - New collection `userReviewItems/{userId}/items/{questionId}`:
    - `box: 1..5` (Leitner) or `{stability, difficulty, lastReview, due}` (FSRS).
    - `lastGrade`, `lapses`, `reps`.
  - Scheduler runs client-side; only due items fetched.
- **Complexity:** **M** — scheduler logic + new collection + queue UI.

### Mode 3 — **Práctica Mixta** (Interleaved Practice)
- **Pedagogical basis:** Interleaving + desirable difficulty + custom filtering (UWorld-style).
- **UX sketch:** User builds a session: pick N questions (10/25/50), pick domains (multi-select, default: all), pick source (wrong before / unseen / all / flagged). Questions are *shuffled across domains*. Per-question immediate feedback. End-of-session review with per-domain breakdown.
- **Success metric:** Accuracy per domain trending up over time.
- **Data needed:** `userAttempts` with per-question result log (already planned), `flags` subcollection for user-marked questions.
- **Complexity:** **M** — filter builder UI + shuffle logic + analytics aggregation.

### Mode 4 — **Zona Débil** (Weak Zone)
- **Pedagogical basis:** Targeted practice on errors + Dunning-Kruger correction via confidence-calibrated flagging.
- **UX sketch:** Dashboard shows domain heatmap (red/yellow/green). Tap a red domain → session of questions user got wrong OR got right with low confidence OR hasn't seen. Reuses Práctica Mixta engine under the hood with preset filters.
- **Success metric:** Red domains turning green over time. Show before/after.
- **Data needed:** Same as Mode 3 + a `mastery` view computed client-side (or Cloud Function later).
- **Complexity:** **S** (if we have Mode 3) — mostly a preset + visualization.

### Mode 5 — **Modo Examen** (Exam Mode — existing)
- **Pedagogical basis:** Testing effect + delayed feedback + retrieval under pressure. Simulation.
- **UX sketch:** Current behavior. Timer, no mid-exam feedback, score at end, full review after submission. Consider: "marked for review" flag during exam (industry standard).
- **Success metric:** Score ≥ passing threshold (e.g., 70%) in exam-length simulation.
- **Data needed:** Current — add `markedForReview: boolean` per question in the attempt doc.
- **Complexity:** **S** — already shipped, minor additions.

### Mode 6 — **Daily 10** (Daily 10)
- **Pedagogical basis:** Habit formation + spacing + short sessions (Duolingo pattern).
- **UX sketch:** A daily 10-question mix pulled from: 5 SRS-due + 3 weak-zone + 2 new. ~5–8 min. Streak counter with **streak freezes** (2 free/month). One badge per milestone (7/30/100 days). Push notification opt-in, max 1/day.
- **Success metric:** 7-day rolling completion rate; correlation with exam readiness score.
- **Data needed:** `userStreak/{userId}` doc + existing SRS + weak-zone data.
- **Complexity:** **M** — composition logic + streak doc + notifications (deferred to v2).

---

## 5. Gamification & Retention Hooks (Ethical)

- **Streaks done right:** daily "5 minute minimum" counts; freezes available; never red alarms; explicit opt-out.
- **Progress rings / mastery bars** per domain (Khan Academy style). Visible on Dashboard.
- **Confidence ratings** optional but nudged. Surface "high-confidence wrong answers" prominently — they are the highest-value learning opportunities.
- **Badges:** effort-based (7-day streak, 100 questions) more than performance-based (avoid "top 10%" comparisons which reduce intrinsic motivation — Ryan & Deci).
- **Personalized queue:** one-tap entry from dashboard to "today's plan" (5 SRS + 3 weak + 2 new).
- **Avoid:** leaderboards with public ranking, loss-aversion pop-ups ("don't lose your streak!"), lootbox-style rewards.

---

## 6. Accessibility & Inclusion

- **WCAG 2.2 AA baseline** — contrast, focus indicators, semantic HTML (already covered by existing UI rules).
- **Per-mode specifics:**
  - Timer modes: allow extended time accommodation (user setting, e.g., +50% / +100%).
  - Keyboard navigation: number keys 1–4 to pick MCQ, Space to reveal, Enter to submit.
  - Screen readers: announce feedback state changes (`aria-live="polite"`) and explanation sections (`role="region"` with label).
  - Confidence slider: provide keyboard-operable version + textual labels (not just stars).
  - Streaks: don't rely solely on color for state; include icons + text.
  - Reduced motion: disable celebratory animations via `prefers-reduced-motion`.
  - Language: all copy in ES + EN; question/explanation content respects set language (already in data model).
  - Dyslexia-friendly option: toggle to Atkinson Hyperlegible / OpenDyslexic font.

---

## 7. Sources (Authoritative)

### Peer-reviewed / books
- Roediger, H. L., & Karpicke, J. D. (2006). *Test-enhanced learning*. Psychological Science, 17(3).
- Karpicke, J. D., & Blunt, J. R. (2011). *Retrieval practice produces more learning than elaborative studying*. Science, 331(6018).
- Cepeda, N. J., Pashler, H., Vul, E., Wixted, J. T., & Rohrer, D. (2006). *Distributed practice in verbal recall tasks: A review and quantitative synthesis*. Psychological Bulletin, 132(3).
- Rohrer, D., & Taylor, K. (2007). *The shuffling of mathematics problems improves learning*. Instructional Science, 35.
- Bjork, E. L., & Bjork, R. A. (2011). *Making things hard on yourself, but in a good way: Creating desirable difficulties to enhance learning*. In *Psychology and the Real World*.
- Dunlosky, J., et al. (2013). *Improving students' learning with effective learning techniques*. Psychological Science in the Public Interest, 14(1).
- Butler, A. C., Karpicke, J. D., & Roediger, H. L. (2007). *The effect of type and timing of feedback on learning from multiple-choice tests*. Journal of Experimental Psychology: Applied, 13(4).
- Deci, E. L., & Ryan, R. M. (2000). *The "what" and "why" of goal pursuits: Human needs and the self-determination of behavior*. Psychological Inquiry, 11(4).
- Oakley, B. (2014). *A Mind for Numbers*. (popularization of chunking, focused vs diffuse modes).
- Agarwal, P. K., & Bain, P. M. (2019). *Powerful Teaching: Unleash the Science of Learning*.
- Brown, P. C., Roediger, H. L., & McDaniel, M. A. (2014). *Make It Stick: The Science of Successful Learning*.

### Algorithms
- Wozniak, P. A. (1990). *Optimization of learning* — SM-2 algorithm. SuperMemo.
- Ye, J., et al. (2023). *A Stochastic Shortest Path Algorithm for Optimizing Spaced Repetition Scheduling* (FSRS). https://github.com/open-spaced-repetition/fsrs4anki
- Settles, B., & Meeder, B. (2016). *A Trainable Spaced Repetition Model for Language Learning* (Duolingo HLR). ACL.

### Platform documentation
- Anki Manual — https://docs.ankiweb.net/
- FSRS Algorithm Explained — https://github.com/open-spaced-repetition/fsrs4anki/wiki
- Quizlet Learn — https://quizlet.com/features/learn
- Duolingo Research Blog — https://blog.duolingo.com/tag/research/
- Khan Academy Mastery System — https://support.khanacademy.org/hc/en-us/articles/202262954

> **Note:** Dates retrieved from training knowledge; for implementation, re-verify FSRS version (current stable v5 as of 2026) before coding the scheduler.

---

## 8. Complexity Summary & Recommended Build Order

| # | Mode | Complexity | Dependencies | Priority |
|---|------|-----------|--------------|----------|
| 5 | Modo Examen (minor additions) | S | — | **Already done** — add "mark for review" |
| 1 | Estudio Guiado | S | Reuse exam engine | **v1.1** — quick win |
| 3 | Práctica Mixta | M | Attempt log, filter UI | **v1.1** |
| 4 | Zona Débil | S (after #3) | #3 + heatmap | **v1.2** |
| 2 | Repaso Inteligente (Leitner) | M | New SRS collection | **v1.2** |
| 6 | Daily 10 | M | #2 + streak doc | **v1.3** |
| 2b | Repaso Inteligente (FSRS upgrade) | L | Scheduler rewrite + migration | **v2** |

**Recommended v1.1 scope (next milestone):** Modes 1 + 3 + 4 (+ mark-for-review in Mode 5).
**Recommended v1.2 scope:** Mode 2 (Leitner) + Mode 6.
**v2:** FSRS migration, Brilliant-style chains, Cloud Functions for server-side mastery aggregation.

---

## 9. Open Questions for Product

1. Do we want confidence ratings **visible to the user** or **silent** (used only for scheduling)?
2. Should streaks be **global** or **per-certification**?
3. Target retention rate for SRS — 85% (Anki default) or 90% (more reviews, better exam readiness)?
4. Will we build a Cloud Function for aggregated mastery stats, or compute client-side in v1?
5. Do we allow users to **disable** SRS for specific questions (e.g., question they consider poorly written)?

---

**End of report.**
