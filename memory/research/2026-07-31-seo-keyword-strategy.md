# SEO Keyword & Content Strategy — CertZen (certzen.app)

Date: 2026-07-31
Scope: Keyword/certification popularity research per domain (ES + EN), cross-referenced against the current catalog (`scripts/seed-data/*.mjs`, `src/core/constants/domains.js`), to prioritize what content to build/promote next. No Search Console / Keyword Planner access available in this environment — findings are based on WebSearch market signals (job-posting frequency, comparison-article density, provider ubiquity), not hard search-volume numbers. Treat rankings as directional, not exact.

## Executive Summary

- **English is not secondary here — it's the primary language for the highest-value certifications.** AWS, CompTIA, PMI/Scrum, CISSP/CEH, IELTS/TOEFL are globally searched overwhelmingly in English; Spanish search volume for these exists but is smaller and mostly long-tail ("examen aws en español", "simulador comptia security+ en español"). Domains where Spanish is the *primary* driver: `health` (LatAm-specific content like ICFES-adjacent, primeros auxilios) and `logic` (ICFES/oposiciones-style psychometric tests are a Spanish-speaking-market phenomenon with little English equivalent).
- The catalog is **already broad and well-aligned** with what's actually popular — AWS, Azure, CompTIA, PMP/Scrum, Security+/CEH/CISSP, IELTS/TOEFL/Duolingo, BLS/ACLS are all seeded. The bigger opportunity is **on-page/URL structure to rank for what's already built** (Fase 2 of this plan), not a content gap crisis.
- Real content gaps exist but are narrower than expected: Google/Microsoft entry-level certs (Google IT Support, MS-900), CKA (vs. only CKAD today), and a few high-volume "free practice test" long-tail terms not yet targeted by exact-match set titles.
- Recommendation: prioritize **IT, Security, and English** domains first for the code/content investment in this pass — they have the clearest, highest-volume, most bilingual keyword opportunity. `agile`, `health`, `logic` are solid but lower ceiling (more niche/regional volume).

---

## Domain: IT & Cloud (`it`)

**Top certifications by search demand** (ranking, language driver, coverage status):

1. **AWS Cloud Practitioner / Solutions Architect Associate** — EN-dominant (AWS market leader globally), meaningful ES long-tail ("aws en español"). ✅ Covered (`sets-it.mjs`, `sets-cloud-extended.mjs`).
2. **CompTIA A+ / Network+ / Security+** (Security+ counted under `security` domain) — EN-dominant, A+ is the most-recognized IT entry point worldwide. ⚠️ Network+ covered; **A+ not found in seed data** — notable gap, it's consistently the #1-cited beginner IT cert in every 2026 roundup found.
3. **Microsoft Azure Fundamentals (AZ-900) / Administrator (AZ-104)** — EN-dominant, strong enterprise demand. ✅ Covered.
4. **Google Cloud Digital Leader / Associate Cloud Engineer** — EN-dominant, fast-growing but smaller volume than AWS/Azure. ✅ Covered.
5. **Kubernetes (CKA/CKAD) & Docker** — EN-dominant, DevOps-adjacent, consistently cited. ⚠️ CKAD covered; **CKA (Certified Kubernetes Administrator) not found** — CKA is searched more than CKAD in most comparisons (broader ops audience).
6. **Terraform Associate** — EN-dominant, fast-growing IaC demand. ✅ Covered.
7. **CompTIA Network+** — EN-dominant. ✅ Covered.
8. **Google IT Support Professional Certificate** — EN-dominant, very high volume (Coursera-driven, huge beginner audience). ❌ **Gap** — not in seed data, worth flagging to `exam-content-architect`.

**Search intent:** mixed — strong informational ("qué es AWS Cloud Practitioner", "what is AZ-900") alongside transactional ("aws practice test free", "simulador azure gratis"). The transactional English long-tail ("<cert> practice test free", "<cert> exam questions") is the single most valuable keyword pattern to target on-page.

## Domain: Ciberseguridad (`security`)

1. **CompTIA Security+** — EN-dominant, confirmed as *the* most-searched entry-level cybersecurity cert in every 2026 source found ("appears in more entry-level listings than any other credential"). ✅ Covered.
2. **CEH (Certified Ethical Hacker)** — EN-dominant, high volume for offensive-security/pentesting intent. ✅ Covered.
3. **CISSP** — EN-dominant, high volume but skews senior/management search intent ("what is CISSP", "CISSP requirements") over practice-test intent. ✅ Covered.
4. **OWASP Top 10** — EN-dominant (global appsec standard), high recurring search volume as OWASP updates. ✅ Covered.
5. **SOC Analyst / Blue Team fundamentals** — EN-dominant, fast-growing (SOC-analyst-as-a-career searches are rising sharply). ✅ Covered.
6. **CompTIA CySA+** — EN-dominant, cited alongside Security+/CEH/CISSP as a top-4 credential by job-posting frequency. ❌ **Gap** — not found in seed data.
7. **Penetration Testing / Network Security fundamentals** — EN-dominant. ✅ Covered.
8. **Cryptography fundamentals** — EN-dominant, more niche/informational volume. ✅ Covered.

**Search intent:** heavily transactional for Security+/CEH ("security+ practice test free", "sy0-701 practice questions") — this domain has the cleanest keyword-to-content match in the whole catalog already.

## Domain: Agile & PM (`agile`)

1. **PMP (Project Management Professional)** — EN-dominant globally, "PMP" is the single most-searched PM credential by a wide margin per every comparison article found. ✅ Covered (2 variants).
2. **Scrum Master (CSM / PSM I)** — EN-dominant, second-most-searched PM/Agile term, strong "scrum master vs pmp" comparison-search cluster. ✅ Covered (both CSM and PSM I).
3. **ITIL 4 Foundation** — EN-dominant, distinct audience (IT service management vs. project delivery). ✅ Covered.
4. **CAPM (entry-level PMI)** — EN-dominant, positioned as "PMP without experience requirement" — high informational search ("capm vs pmp"). ✅ Covered.
5. **PRINCE2 Foundation** — EN-dominant but geographically skewed (UK/EU/Commonwealth demand higher than US/LatAm). ✅ Covered.
6. **SAFe (Scaled Agile)** — EN-dominant, enterprise-agile niche but growing. ✅ Covered.
7. **Lean Six Sigma** — EN-dominant, adjacent audience (process improvement, not pure PM). ✅ Covered.

**Search intent:** strongly informational/comparison-driven at the top of funnel ("pmp vs scrum master", "itil vs pmp") — this domain could benefit most from comparison-style FAQ content (see Fase 2.2) since users are actively researching *which* cert to pursue, not just cramming for one.

## Domain: Salud (`health`)

1. **BLS (Basic Life Support) / CPR/AED** — bilingual but the *free practice test* search cluster is dominated by US English-language sites (AHA-affiliated); Spanish equivalent volume exists but smaller and less commercially competitive (an opportunity, not just a gap). ✅ Covered.
2. **ACLS (Advanced Cardiac Life Support)** — same pattern as BLS, EN-dominant source ecosystem. ✅ Covered.
3. **CNA (Certified Nursing Assistant) / NNAAP** — EN-dominant, US-specific credential with very high practice-test search volume (large low-wage-entry-job market). ✅ Covered.
4. **Primeros Auxilios (general first aid, Spanish-market framing)** — ES-dominant, this is where CertZen's Spanish content has a real edge over English-first competitors — less competitive SERP for "primeros auxilios simulador examen gratis" than the English BLS/ACLS space. ✅ Covered.
5. **NCLEX-RN** — EN-dominant, huge search volume among nursing students (US/Philippines market) but a large exam (very deep content investment for full coverage) — flag as high-effort/high-reward if pursued further, current coverage is "fundamentos" only. ✅ Covered (foundational level).

**Search intent:** transactional-heavy across the board ("free BLS practice test", "primeros auxilios examen simulacro") — this is naturally the most practice-test-search-friendly domain of the six.

## Domain: Inglés — CEFR (`english`)

1. **IELTS** — EN+ES bilingual demand (most-searched English test globally for immigration/UK-Australia-Canada), strong Spanish-market search too ("examen ielts simulacro"). ✅ Covered (Academic Reading + Writing).
2. **TOEFL iBT** — EN+ES bilingual (dominant for US university admission), similarly strong Spanish long-tail. ✅ Covered.
3. **Duolingo English Test (DET)** — EN+ES bilingual, fastest-growing of the three (cheapest, most accessible, mobile-first — matches CertZen's own positioning well). ✅ Covered.
4. **CEFR general levels (A1-C2)** — ES-dominant search pattern in Latin America/Spain ("examen de inglés nivel B1", "test de nivel de inglés gratis") — this is arguably CertZen's strongest existing keyword fit since it already covers A2 through C1. ✅ Covered broadly.
5. **TOEIC** — EN-dominant (workplace-English test, more common in Asia/LatAm corporate contexts than IELTS/TOEFL). ✅ Covered.
6. **Cambridge exams (FCE/CAE) named explicitly** — EN-dominant, high search volume in Spain specifically for "First Certificate"/"FCE" branding rather than generic "C1" — partially covered (`sets-english-extended.mjs` has "English C1 — Advanced" tagged `cae` but not titled "Cambridge FCE/CAE" explicitly, which is the more search-friendly title). ⚠️ **Minor gap** — consider retitling/adding explicit Cambridge-branded variants.

**Search intent:** the CEFR-level searches ("nivel de inglés B1/B2") are almost purely self-assessment/informational — good FAQ territory; IELTS/TOEFL/Duolingo searches are transactional (practice tests) and bilingual by nature since students researching these exams often search in both languages during the same research session.

## Domain: Razonamiento (`logic`)

1. **ICFES Saber Pro (Colombia)** — ES-only, regional (Colombia-specific national exam), no English equivalent — this is the domain's standout keyword opportunity since it's essentially uncontested by English-first competitors and CertZen already has it. ✅ Covered.
2. **Pruebas psicotécnicas / test psicotécnico** — ES-dominant, broad Spanish-speaking-market term (used for job selection processes and oposiciones across Spain/LatAm), very high generic search volume per the popularity of dedicated psicotécnico sites found. ✅ Covered.
3. **Razonamiento verbal / numérico** — ES-dominant, same audience as above, often searched as separate sub-skills. ✅ Covered (both).
4. **Pensamiento crítico** — ES-dominant but lower volume/more academic framing. ✅ Covered.
5. **Aptitude/logic tests in English (generic "logical reasoning test", "aptitude test practice")** — EN-dominant equivalent exists (used for UK/US graduate-scheme recruitment, e.g. SHL/Kenexa-style tests) — **not represented at all today**, since this domain is currently 100% Spanish-market-framed. ❌ **Gap** — if pursuing English-market growth, this is the one domain where an EN equivalent audience is essentially untapped.

**Search intent:** heavily transactional ("test psicotécnico gratis online", "icfes simulacro gratis") — this is the most Spanish-native domain in the catalog by a wide margin, consistent with `logic`'s regional (Colombia/LatAm) framing.

---

## Content gaps to fill (prioritized for `exam-content-architect`)

Cross-checked against every `scripts/seed-data/sets-*.mjs` file (title/tags), not just a summary — this list only includes certifications genuinely absent, not already covered under a different title/tag. Two extra domains exist in seed data but not in the frontend's `DOMAINS` taxonomy (`business`: Google Analytics/Ads, HubSpot, Salesforce Admin, SEO, etc.; `sports`: CrossFit, Yoga, Pilates, etc.) — flagging as a separate taxonomy discrepancy, not a content gap, and out of scope for this report.

| Priority | Certification | Domain | Why |
|---|---|---|---|
| High | CompTIA A+ | it | Most-cited universal IT entry cert in every 2026 source; currently absent despite Network+/Security+ both present |
| High | Google IT Support Professional Certificate | it | Huge Coursera-driven beginner audience, high EN search volume, zero current coverage |
| High | Cisco CCNA | it | 2026 sources flag CCNA as increasingly relevant (exam now covers AI/ML/data fundamentals); no networking-vendor cert beyond CompTIA Network+ today |
| Medium | CKA (Certified Kubernetes Administrator) | it | Complements existing CKAD; broader ops/sysadmin audience than CKAD (dev-focused) alone |
| Medium | Docker Certified Associate (DCA) | it | Current "Docker — Fundamentos" set is generic, not tied to the actual vendor-certification exam blueprint that drives "docker certified associate practice test" searches |
| Low | Linux Foundation LFCS/LFCE | it | Recognized Linux sysadmin/engineer credential, no Linux-specific cert in catalog despite heavy DevOps coverage (Ansible, Jenkins, Docker, K8s) |
| High | CompTIA CySA+ | security | Named alongside Security+/CEH/CISSP as a top-4 by job-posting frequency; natural extension of existing security catalog |
| High | (ISC)² CCSP (Certified Cloud Security Professional) | security | Multiple 2026 sources call it "the best cloud security certification"; current "Cloud Security — Fundamentos" set isn't tied to this specific, highly-searched credential |
| Medium | CISM (Certified Information Security Manager) | security | Consistently listed alongside CISSP/CEH/Security+ as top-tier; management-track audience not served by current catalog (CISSP skews similar but distinct exam/audience) |
| Medium | (ISC)² SSCP | security | Positioned as the "CISSP without experience requirement" entry point — same pattern as CAPM/PSM I being good entry certs elsewhere in the catalog |
| Low | GIAC (e.g. GSEC) | security | Cited in comparison articles as a premium/specialized track; lower volume than Security+/CEH but a recognizable gap for advanced learners |
| High | Lean Six Sigma Green Belt | agile | Only Yellow Belt is seeded — Green Belt is the belt in *highest* standalone job-listing demand per 2026 sources, not Yellow |
| Medium | Lean Six Sigma Black Belt | agile | Second-highest-demand belt after Green; currently completely absent (only Yellow Belt exists) |
| Medium | PMI-ACP (Agile Certified Practitioner) | agile | Distinct PMI credential from PMP/CAPM already covered — recurring "PMI-ACP vs Disciplined Agile" and "PMI-ACP vs PMP" comparison-search cluster suggests real informational demand |
| High | EMT-Basic (NREMT) | health | Confirmed dense competitor ecosystem (ExamEdge, Mometrix, Pocket Prep, Quizlet, UnionTestPrep all have dedicated EMT practice-test products) — high transactional search volume, zero current coverage |
| Medium | Mental Health First Aid (standalone certification) | health | Current "Salud Mental Básica" is a fundamentals set, not tied to the actual internationally-recognized MHFA certification now bundled into many EMT/first-responder training requirements |
| Low | PALS (Pediatric Advanced Life Support) | health | Natural adjacent credential to already-covered BLS/ACLS (same AHA family); "Pediatría Básica" set exists but isn't PALS-specific |
| Medium | Cambridge KET / PET (A2/B1-branded) | english | Catalog has generic "English A2/B1" CEFR sets but no explicit Cambridge-branded KET/PET variant — same retitling opportunity already flagged for FCE/CAE at C1 |
| Low | Trinity College London (GESE/ISE) | english | Recognized alternative to Cambridge/IELTS in some markets (notably Spain); zero current coverage, smaller volume than Cambridge/IELTS/TOEFL |
| Low | Cambridge BULATS / BEC (Business English Certificate) | english | Current "Business English — B2" is generic; BULATS/BEC are the actual named credentials driving business-English-certification searches |
| High | EXANI-I / EXANI-II (Mexico, CENEVAL) | logic | Confirmed dense dedicated-competitor ecosystem (CONACCI, WIZI Academy, ETAC, UNEA, exani.com.mx all offer free simulators) for this single-country admission exam — strong signal of high, underserved search volume; ICFES (Colombia) is covered but this equivalent for Mexico (300+ universities use it) is not |
| Medium | PAES (Chile, university admission) | logic | Regional equivalent to ICFES/EXANI for Chile; confirmed dedicated resources exist (examenes.lat) but CertZen has no PAES-specific set |
| Medium | Perú university admission exams (UNMSM, UNI, PUCP-style) | logic | Same regional pattern as ICFES/EXANI/PAES — a third LatAm market with dedicated exam-prep demand and no current coverage |
| Low (future, EN-market expansion) | Generic English-language logical/aptitude reasoning test (SHL/Kenexa-style) | logic | Only relevant if CertZen decides to push English-market growth for this domain; currently 100% Spanish-framed and that's fine for the LatAm audience it serves today |

## Priority for Fase 2 implementation investment

Given limited engineering time, prioritize the on-page content (2.2) and structured data (2.3) work first for **`it`, `security`, `english`** — these three have the clearest bilingual, high-volume keyword match with content already in the catalog, meaning the code investment converts to rankings fastest. `agile`, `health`, `logic` are good candidates for a second pass.

**Update after the expanded gap pass:** this ranking is about *code/on-page investment for what's already built*, not new-content priority — those are two separate tracks. For new-*content* priority specifically, `logic` jumped up unexpectedly: EXANI (Mexico) shows the same dense-dedicated-competitor signal that made ICFES worth covering, and it's a single, well-scoped set (like ICFES already is) rather than a large multi-domain credential like CompTIA A+ or CCSP. If `exam-content-architect` is prioritizing by "fastest to ship + strongest standalone signal," EXANI-II and Lean Six Sigma Green Belt (both single, well-defined, high-confidence-demand certifications) are reasonable first picks alongside the already-flagged CompTIA A+ and CompTIA CySA+.
