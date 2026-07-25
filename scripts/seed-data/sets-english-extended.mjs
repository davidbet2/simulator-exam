// Generado por el subagente exam-content-architect (research + QA manual, sin LLM-API externo).
// Batch: english-extended — COMPLETO: 11 sets (duolingo-english-test + 10 nuevos).
// Contenido 100% en inglés (siguiendo la convención de scripts/seed-data/sets-english.mjs),
// grounding en CEFR (Council of Europe), Cambridge English, IELTS/British Council,
// TOEFL iBT (ETS) y TOEIC (ETS) — formatos y descriptores públicos vigentes.
//
// Duolingo English Test (DET) — test adaptativo de proficiencia en inglés, 60 min,
// aceptado por miles de universidades como alternativa a IELTS/TOEFL. NO es un
// examen de opción múltiple sobre "contenido" con temario fijo: es adaptativo y
// evalúa 4 subscores (literacy, comprehension, conversation, production) mediante
// tareas como reconocimiento de palabras reales/inventadas (yes/no vocabulary),
// texto cloze, dictado, lectura en voz alta, y escritura/habla abierta. Este set
// simula en formato de opción múltiple las habilidades subyacentes evaluadas
// (vocabulario, gramática, comprensión lectora), siguiendo la misma convención
// que los demás sets de inglés de este proyecto (type: 'multiple' únicamente).
// No reemplaza práctica con el formato real interactivo/adaptativo del DET.
// https://englishtest.duolingo.com

export const ENGLISH_EXTENDED_SETS = [
  {
    slug: 'duolingo-english-test',
    title: 'Duolingo English Test (DET) — Preparación',
    description:
      'Preguntas de práctica para las habilidades evaluadas en el Duolingo English Test: reconocimiento de vocabulario, texto cloze, comprensión lectora y gramática.',
    domain: 'english',
    category: 'det',
    level: 'intermediate',
    language: 'en',
    tags: ['duolingo', 'det', 'english-proficiency'],
    passPercent: 65,
    timeMinutes: 33,
    source:
      'Basado en el formato público del Duolingo English Test (DET) — englishtest.duolingo.com (contenido original, preguntas de práctica en formato opción múltiple)',
    questions: [
      // ── Reconocimiento de palabras reales vs. inventadas (6) ───────────
      {
        type: 'multiple',
        question: 'Which of the following is a real English word?',
        options: {
          A: 'flibbertane',
          B: 'meticulous',
          C: 'contrapize',
          D: 'undersplend',
        },
        answer: ['B'],
        explanation:
          '"Meticulous" is a real English word meaning showing great attention to detail. The other options are invented non-words designed to look plausible — this mirrors the DET\'s "yes/no vocabulary" task, which measures word recognition speed and accuracy.',
        domain: 'Reconocimiento de vocabulario',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question: 'Which of the following is NOT a real English word?',
        options: {
          A: 'resilient',
          B: 'ambiguous',
          C: 'dwindlement',
          D: 'plausible',
        },
        answer: ['C'],
        explanation:
          '"Dwindlement" is not a standard English word (the correct noun form is "dwindling"). "Resilient", "ambiguous", and "plausible" are all real, commonly used English words.',
        domain: 'Reconocimiento de vocabulario',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question: 'Which of the following is a real English word?',
        options: {
          A: 'consequential',
          B: 'introcept',
          C: 'malfluent',
          D: 'perceptude',
        },
        answer: ['A'],
        explanation:
          '"Consequential" is a real word meaning "following as a result or effect." The other three combine real English morphemes in ways that do not form actual words.',
        domain: 'Reconocimiento de vocabulario',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question: 'Which of the following is NOT a real English word?',
        options: {
          A: 'inevitable',
          B: 'nuance',
          C: 'gregarious',
          D: 'vexplain',
        },
        answer: ['D'],
        explanation:
          '"Vexplain" is not a real word. "Inevitable," "nuance," and "gregarious" are all legitimate, dictionary-listed English words.',
        domain: 'Reconocimiento de vocabulario',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question: 'Which of the following is a real English word?',
        options: {
          A: 'diligent',
          B: 'obsoletion',
          C: 'transflect',
          D: 'unpermeant',
        },
        answer: ['A'],
        explanation:
          '"Diligent" is a real word meaning showing care and effort in one\'s work. The other options are plausible-looking but nonexistent word forms.',
        domain: 'Reconocimiento de vocabulario',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question: 'Which of the following is NOT a real English word?',
        options: {
          A: 'discrepancy',
          B: 'anomaly',
          C: 'quandary',
          D: 'exorbitude',
        },
        answer: ['D'],
        explanation:
          '"Exorbitude" is not a real word (the correct related adjective is "exorbitant"). "Discrepancy," "anomaly," and "quandary" are all standard English words.',
        domain: 'Reconocimiento de vocabulario',
        difficulty: 'medium',
      },

      // ── Texto cloze / completar espacios (6) ───────────────────────────
      {
        type: 'multiple',
        question:
          'Complete the sentence: "Despite the heavy rain, the marathon runners continued ______ toward the finish line."',
        options: {
          A: 'determine',
          B: 'determined',
          C: 'determinedly',
          D: 'determination',
        },
        answer: ['C'],
        explanation:
          'The sentence needs an adverb to modify how the runners "continued" moving — "determinedly" correctly describes the manner of the action, while the other options are the wrong part of speech for this slot.',
        domain: 'Texto cloze',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          'Complete the sentence: "By the time the meeting started, she ______ already reviewed all the documents."',
        options: {
          A: 'has',
          B: 'have',
          C: 'had',
          D: 'having',
        },
        answer: ['C'],
        explanation:
          'This sentence describes an action completed before another past action ("the meeting started"), which requires the past perfect tense ("had already reviewed"), not the present perfect or simple forms.',
        domain: 'Texto cloze',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          'Complete the sentence: "The company\'s profits have risen steadily ______ the last quarter."',
        options: {
          A: 'since',
          B: 'during',
          C: 'for',
          D: 'while',
        },
        answer: ['B'],
        explanation:
          '"During" is used with a specific period/event ("the last quarter") to indicate when something happened throughout that time. "Since" would require a starting point in time, and "for" would need a duration expressed as a quantity (e.g., "for three months").',
        domain: 'Texto cloze',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          'Complete the sentence: "If the flight ______ delayed, we would have missed the connection."',
        options: {
          A: 'wasn\'t',
          B: 'hadn\'t been',
          C: 'weren\'t',
          D: 'isn\'t',
        },
        answer: ['B'],
        explanation:
          'This is a third conditional sentence (hypothetical about the past), which requires "had/hadn\'t + past participle" in the if-clause: "If the flight hadn\'t been delayed, we would have missed the connection."',
        domain: 'Texto cloze',
        difficulty: 'hard',
      },
      {
        type: 'multiple',
        question:
          'Complete the sentence: "Neither the manager nor the employees ______ satisfied with the new policy."',
        options: {
          A: 'is',
          B: 'was',
          C: 'are',
          D: 'be',
        },
        answer: ['C'],
        explanation:
          'With "neither...nor" connecting a singular and a plural subject, the verb agrees with the subject closest to it — "employees" (plural) — so the correct verb is "are."',
        domain: 'Texto cloze',
        difficulty: 'hard',
      },
      {
        type: 'multiple',
        question:
          'Complete the sentence: "She is the kind of person ______ always puts others before herself."',
        options: {
          A: 'which',
          B: 'who',
          C: 'whom',
          D: 'whose',
        },
        answer: ['B'],
        explanation:
          '"Who" is the correct relative pronoun to refer to a person as the subject of the relative clause ("who...puts others"). "Whom" would be used as an object, "which" refers to things, and "whose" indicates possession.',
        domain: 'Texto cloze',
        difficulty: 'medium',
      },

      // ── Comprensión de lectura (6) ──────────────────────────────────
      {
        type: 'multiple',
        question:
          'Read the passage: "Urban gardens have become increasingly popular in large cities. Beyond providing fresh produce, they offer residents a space to connect with nature, reduce stress, and build community ties with neighbors who share plots." What is the main idea of this passage?',
        options: {
          A: 'Urban gardens are only useful for producing food',
          B: 'Urban gardens provide multiple benefits beyond food production, including well-being and community connection',
          C: 'Urban gardens are becoming less popular in cities',
          D: 'Urban gardens require government funding to succeed',
        },
        answer: ['B'],
        explanation:
          'The passage explicitly states that urban gardens offer benefits "beyond providing fresh produce" — connection with nature, stress reduction, and community ties — making option B the accurate summary of the main idea.',
        domain: 'Comprensión de lectura',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question:
          'Read the passage: "Although remote work offers flexibility, many employees report feeling isolated without regular in-person interaction. Companies are now experimenting with hybrid models to balance autonomy with collaboration." According to the passage, why are companies adopting hybrid models?',
        options: {
          A: 'To eliminate remote work entirely',
          B: 'To balance the flexibility of remote work with the collaboration benefits of in-person interaction',
          C: 'Because employees prefer working in isolation',
          D: 'To reduce office costs completely',
        },
        answer: ['B'],
        explanation:
          'The passage states hybrid models aim "to balance autonomy with collaboration" — directly addressing both the flexibility employees value and the collaboration/interaction they miss when fully remote.',
        domain: 'Comprensión de lectura',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          'Read the passage: "The study found that participants who took short breaks every 90 minutes reported higher productivity than those who worked continuously, suggesting that sustained focus without pause may actually reduce overall output." What can be inferred from this passage?',
        options: {
          A: 'Working without breaks always increases productivity',
          B: 'Taking periodic breaks may improve productivity more than continuous work',
          C: 'The study found no relationship between breaks and productivity',
          D: 'Productivity cannot be measured through this type of study',
        },
        answer: ['B'],
        explanation:
          'The passage directly reports that participants taking breaks "reported higher productivity" than those working continuously, supporting the inference that periodic breaks may improve productivity more than uninterrupted work.',
        domain: 'Comprensión de lectura',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          'Read the passage: "While critics argue that social media fosters superficial connections, proponents counter that it enables meaningful relationships across geographic distances that would otherwise be impossible to maintain." What rhetorical structure does this passage use?',
        options: {
          A: 'It presents only one perspective without acknowledging any counterargument',
          B: 'It presents two opposing viewpoints on the same topic',
          C: 'It provides a chronological narrative of events',
          D: 'It presents a step-by-step instructional process',
        },
        answer: ['B'],
        explanation:
          'The passage explicitly contrasts two viewpoints — critics who see superficial connections versus proponents who see meaningful long-distance relationships — a classic "on one hand / on the other hand" structure presenting opposing perspectives.',
        domain: 'Comprensión de lectura',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          'Read the passage: "The museum\'s new exhibit was initially met with skepticism, but attendance figures released last month reveal it has become one of the most visited installations in the institution\'s history." What is the tone shift in this sentence?',
        options: {
          A: 'From skepticism to unexpected success',
          B: 'From excitement to disappointment',
          C: 'From neutrality to continued skepticism',
          D: 'There is no tone shift in this sentence',
        },
        answer: ['A'],
        explanation:
          'The sentence moves from an initial negative reception ("met with skepticism") to a positive outcome ("one of the most visited installations"), signaled by the contrastive conjunction "but" — a shift from skepticism to unexpected success.',
        domain: 'Comprensión de lectura',
        difficulty: 'hard',
      },
      {
        type: 'multiple',
        question:
          'Read the passage: "Renewable energy costs have dropped by more than 80% over the past decade, largely due to improvements in manufacturing efficiency and economies of scale, making solar and wind increasingly competitive with fossil fuels." What caused the drop in renewable energy costs, according to the passage?',
        options: {
          A: 'Government subsidies exclusively',
          B: 'Improvements in manufacturing efficiency and economies of scale',
          C: 'A decrease in demand for fossil fuels',
          D: 'The passage does not specify any cause',
        },
        answer: ['B'],
        explanation:
          'The passage explicitly attributes the cost drop to being "largely due to improvements in manufacturing efficiency and economies of scale" — a direct textual answer, not requiring inference.',
        domain: 'Comprensión de lectura',
        difficulty: 'easy',
      },

      // ── Gramática y estructura de oraciones (6) ────────────────────────
      {
        type: 'multiple',
        question: 'Which sentence is grammatically correct?',
        options: {
          A: 'She don\'t like coffee in the mornings.',
          B: 'She doesn\'t likes coffee in the mornings.',
          C: 'She doesn\'t like coffee in the mornings.',
          D: 'She not like coffee in the mornings.',
        },
        answer: ['C'],
        explanation:
          'The correct third-person singular negative form uses "doesn\'t" followed by the base form of the verb: "She doesn\'t like." Option A uses the wrong auxiliary ("don\'t"), B incorrectly conjugates the verb after the auxiliary, and D omits the auxiliary entirely.',
        domain: 'Gramática y estructura',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question: 'Which sentence uses the passive voice correctly?',
        options: {
          A: 'The report was wrote by the intern.',
          B: 'The report was written by the intern.',
          C: 'The report writing by the intern.',
          D: 'The report is write by the intern.',
        },
        answer: ['B'],
        explanation:
          'The passive voice requires "be" + past participle. "Written" is the correct past participle of "write," so "was written by" correctly forms the passive voice; "wrote" is the simple past, not a participle.',
        domain: 'Gramática y estructura',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question: 'Which sentence correctly uses a comparative structure?',
        options: {
          A: 'This laptop is more faster than my old one.',
          B: 'This laptop is fastest than my old one.',
          C: 'This laptop is faster than my old one.',
          D: 'This laptop is the faster than my old one.',
        },
        answer: ['C'],
        explanation:
          'For short adjectives like "fast," the comparative is formed by adding "-er" ("faster"), not by adding "more" (double comparative, as in A) or using the superlative form "fastest" (B, D) when comparing only two things.',
        domain: 'Gramática y estructura',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question: 'Which sentence correctly uses a gerund after a preposition?',
        options: {
          A: 'She is interested in learn new languages.',
          B: 'She is interested in learning new languages.',
          C: 'She is interested in to learn new languages.',
          D: 'She is interested in learned new languages.',
        },
        answer: ['B'],
        explanation:
          'Prepositions (like "in") must be followed by a gerund (-ing form), not an infinitive or base verb — "interested in learning" is the grammatically correct structure.',
        domain: 'Gramática y estructura',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question: 'Which sentence correctly uses a conditional structure to express a general truth?',
        options: {
          A: 'If you heat water to 100°C, it boils.',
          B: 'If you will heat water to 100°C, it boils.',
          C: 'If you heated water to 100°C, it will boil.',
          D: 'If you heat water to 100°C, it will boiled.',
        },
        answer: ['A'],
        explanation:
          'For general truths/facts (zero conditional), both clauses use the simple present tense: "If you heat water to 100°C, it boils." Mixing tenses (B, C, D) is incorrect for expressing a scientific fact or general rule.',
        domain: 'Gramática y estructura',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question: 'Which sentence correctly places the adverb of frequency?',
        options: {
          A: 'He always is late for work.',
          B: 'He is always late for work.',
          C: 'He late is always for work.',
          D: 'Always he is late for work.',
        },
        answer: ['B'],
        explanation:
          'Adverbs of frequency like "always" are placed after the verb "to be" but before other main verbs: "He is always late" is correct, following standard English word order.',
        domain: 'Gramática y estructura',
        difficulty: 'easy',
      },

      // ── Vocabulario en contexto (6) ──────────────────────────────────
      {
        type: 'multiple',
        question:
          'Choose the word that best completes the sentence: "The negotiations reached a(n) ______ when both parties refused to make further concessions."',
        options: {
          A: 'consensus',
          B: 'impasse',
          C: 'resolution',
          D: 'compromise',
        },
        answer: ['B'],
        explanation:
          '"Impasse" means a situation in which no progress is possible, especially due to disagreement — fitting the context where "both parties refused to make further concessions." The other options describe positive/resolved outcomes, which contradict the sentence.',
        domain: 'Vocabulario en contexto',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          'Choose the word closest in meaning to "meticulous" in the sentence: "The accountant was meticulous when reviewing the financial records."',
        options: {
          A: 'Careless',
          B: 'Thorough',
          C: 'Fast',
          D: 'Reluctant',
        },
        answer: ['B'],
        explanation:
          '"Meticulous" means showing great attention to detail and being very careful/precise — "thorough" is the closest synonym among the options, while "careless" is actually an antonym.',
        domain: 'Vocabulario en contexto',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question:
          'Choose the word that best completes the sentence: "Her argument was so ______ that even her critics found it hard to disagree."',
        options: {
          A: 'compelling',
          B: 'trivial',
          C: 'vague',
          D: 'irrelevant',
        },
        answer: ['A'],
        explanation:
          '"Compelling" means evoking interest or belief in a powerfully persuasive way, which fits the context of an argument so strong that even critics struggle to disagree. The other options describe weak or unconvincing arguments.',
        domain: 'Vocabulario en contexto',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          'Choose the word closest in meaning to "ubiquitous" in the sentence: "Smartphones have become ubiquitous in modern society."',
        options: {
          A: 'Rare',
          B: 'Expensive',
          C: 'Widespread',
          D: 'Outdated',
        },
        answer: ['C'],
        explanation:
          '"Ubiquitous" means present, appearing, or found everywhere — "widespread" is the closest synonym, describing something extremely common, not rare or outdated.',
        domain: 'Vocabulario en contexto',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          'Choose the word that best completes the sentence: "Despite the company\'s efforts to appear transparent, employees remained ______ about the real reasons behind the layoffs."',
        options: {
          A: 'confident',
          B: 'skeptical',
          C: 'indifferent',
          D: 'delighted',
        },
        answer: ['B'],
        explanation:
          '"Skeptical" (doubting, not easily convinced) fits the context of "despite efforts to appear transparent" — implying employees did not fully believe the official explanation, unlike "confident" or "delighted," which would contradict that tension.',
        domain: 'Vocabulario en contexto',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          'Choose the word closest in meaning to "reluctant" in the sentence: "He was reluctant to share his opinion during the meeting."',
        options: {
          A: 'Eager',
          B: 'Unwilling',
          C: 'Confident',
          D: 'Prepared',
        },
        answer: ['B'],
        explanation:
          '"Reluctant" means hesitant or unwilling to do something — "unwilling" is the closest synonym, while "eager" is essentially its opposite.',
        domain: 'Vocabulario en contexto',
        difficulty: 'easy',
      },
    ],
  },
  {
    slug: 'english-b2-upper-intermediate',
    title: 'English B2 — Upper Intermediate',
    description: 'Practice exam for CEFR B2 level: advanced verb tenses, reported speech, passive voice, modals of deduction and phrasal verbs.',
    domain: 'english', category: 'cefr', level: 'intermediate', language: 'en',
    tags: ['english', 'b2', 'cefr'], passPercent: 70, timeMinutes: 22,
    source: 'Based on CEFR B2 Global Scale descriptors (Council of Europe) + Cambridge B2 First (FCE) specifications (original content)',
    questions: [
      { type: 'multiple', question: 'By the time she arrived, we ____ already ____ for two hours.', options: { A: 'have / waited', B: 'had / been waiting', C: 'were / waiting', D: 'has / waited' }, answer: ['B'], explanation: 'The past perfect continuous ("had been waiting") is used to emphasize the duration of an action that was ongoing before another past action (her arrival).', domain: 'Verb tenses', difficulty: 'medium' },
      { type: 'multiple', question: 'She said that she ____ the report by Friday.', options: { A: 'will finish', B: 'would finish', C: 'finishes', D: 'is finishing' }, answer: ['B'], explanation: 'In reported speech, "will" in the original statement shifts to "would" when the reporting verb is in the past tense ("said").', domain: 'Reported speech', difficulty: 'medium' },
      { type: 'multiple', question: 'Choose the correct passive form: "They are building a new bridge."', options: { A: 'A new bridge is being built.', B: 'A new bridge is built.', C: 'A new bridge was being built.', D: 'A new bridge has being built.' }, answer: ['A'], explanation: 'The present continuous passive is formed with "is/are being + past participle", correctly reflecting an action in progress: "A new bridge is being built."', domain: 'Passive voice', difficulty: 'medium' },
      { type: 'multiple', question: 'The lights are off and the car isn\'t in the driveway. She ____ be at home.', options: { A: 'must', B: 'can\'t', C: 'should', D: 'might' }, answer: ['B'], explanation: '"Can\'t" expresses strong deduction that something is NOT true, appropriate here given the evidence (lights off, car gone) suggesting she is not home.', domain: 'Modal verbs of deduction', difficulty: 'medium' },
      { type: 'multiple', question: 'I need to ____ this problem before the deadline.', options: { A: 'look up', B: 'look into', C: 'look after', D: 'look forward to' }, answer: ['B'], explanation: '"Look into" means to investigate or examine something, which fits the context of dealing with a problem, unlike "look up" (search for info) or "look after" (take care of).', domain: 'Phrasal verbs', difficulty: 'medium' },
      { type: 'multiple', question: 'Choose the correct sentence.', options: { A: 'If I would have known, I would have told you.', B: 'If I had known, I would have told you.', C: 'If I knew, I would have told you.', D: 'If I have known, I would have told you.' }, answer: ['B'], explanation: 'The third conditional (hypothetical past) requires "if + past perfect, would have + past participle": "If I had known, I would have told you."', domain: 'Verb tenses', difficulty: 'medium' },
      { type: 'multiple', question: 'She ____ working here for over a decade now.', options: { A: 'is', B: 'has been', C: 'was', D: 'had been' }, answer: ['B'], explanation: 'The present perfect continuous ("has been working") describes an action that started in the past and continues into the present, appropriate with "for over a decade now."', domain: 'Verb tenses', difficulty: 'easy' },
      { type: 'multiple', question: 'He asked me where ____.', options: { A: 'did I live', B: 'I lived', C: 'I live', D: 'do I live' }, answer: ['B'], explanation: 'In reported questions, the word order becomes statement order (subject + verb), not question order, so "I lived" is correct, not "did I live."', domain: 'Reported speech', difficulty: 'medium' },
      { type: 'multiple', question: 'The new policy ____ by the board next week.', options: { A: 'will approve', B: 'will be approved', C: 'is approving', D: 'approves' }, answer: ['B'], explanation: 'Since the policy does not approve itself, the passive form is needed: "will be approved" (future simple passive).', domain: 'Passive voice', difficulty: 'medium' },
      { type: 'multiple', question: 'You look exhausted. You ____ have slept well last night.', options: { A: 'mustn\'t', B: 'can\'t', C: 'should', D: 'don\'t' }, answer: ['B'], explanation: '"Can\'t have slept" expresses a strong deduction about the past — based on the visible evidence (looking exhausted), it\'s logical to conclude they did NOT sleep well.', domain: 'Modal verbs of deduction', difficulty: 'hard' },
      { type: 'multiple', question: 'I don\'t want to ____ our friendship over such a small issue.', options: { A: 'give up', B: 'mess up', C: 'come across', D: 'get along' }, answer: ['B'], explanation: '"Mess up" means to spoil or ruin something, fitting the context of damaging a friendship over a small issue.', domain: 'Phrasal verbs', difficulty: 'medium' },
      { type: 'multiple', question: 'Choose the correct sentence.', options: { A: 'If it rains tomorrow, we will cancel the picnic.', B: 'If it will rain tomorrow, we cancel the picnic.', C: 'If it rains tomorrow, we would cancel the picnic.', D: 'If it would rain tomorrow, we will cancel the picnic.' }, answer: ['A'], explanation: 'The first conditional (real future possibility) uses "if + present simple, will + base verb": "If it rains tomorrow, we will cancel the picnic."', domain: 'Verb tenses', difficulty: 'easy' },
      { type: 'multiple', question: 'The manager told the team that they ____ finish the project by Friday.', options: { A: 'must', B: 'had to', C: 'has to', D: 'will have to' }, answer: ['B'], explanation: 'In reported speech, "must" (obligation) typically shifts to "had to" when reporting in the past, matching the past reporting verb "told."', domain: 'Reported speech', difficulty: 'hard' },
      { type: 'multiple', question: 'The email ____ to all employees by the end of the day.', options: { A: 'will send', B: 'will be sent', C: 'is sending', D: 'sends' }, answer: ['B'], explanation: 'The email is the object receiving the action, requiring the passive form: "will be sent."', domain: 'Passive voice', difficulty: 'easy' },
      { type: 'multiple', question: 'She hasn\'t answered any messages all day. She ____ be busy with something important.', options: { A: 'must', B: 'can\'t', C: 'mustn\'t', D: 'shouldn\'t' }, answer: ['A'], explanation: '"Must" expresses strong positive deduction based on evidence — not answering messages all day suggests she is likely occupied with something important.', domain: 'Modal verbs of deduction', difficulty: 'medium' },
      { type: 'multiple', question: 'We need to ____ the meeting until next week due to a scheduling conflict.', options: { A: 'put off', B: 'put up with', C: 'put on', D: 'put out' }, answer: ['A'], explanation: '"Put off" means to postpone or delay, fitting the context of rescheduling a meeting.', domain: 'Phrasal verbs', difficulty: 'medium' },
      { type: 'multiple', question: 'By next year, she ____ her degree.', options: { A: 'will complete', B: 'will have completed', C: 'completes', D: 'is completing' }, answer: ['B'], explanation: 'The future perfect ("will have completed") describes an action that will be finished before a specific point in the future ("by next year").', domain: 'Verb tenses', difficulty: 'medium' },
      { type: 'multiple', question: 'Choose the correct passive form: "Someone stole my bike yesterday."', options: { A: 'My bike stole yesterday.', B: 'My bike was stolen yesterday.', C: 'My bike is stolen yesterday.', D: 'My bike has stolen yesterday.' }, answer: ['B'], explanation: 'Past simple passive: "was/were + past participle" — "My bike was stolen yesterday" correctly shifts focus from the unknown thief to the bike.', domain: 'Passive voice', difficulty: 'easy' },
      { type: 'multiple', question: 'I need to ____ my presentation before the meeting starts.', options: { A: 'go over', B: 'go off', C: 'go without', D: 'go along' }, answer: ['A'], explanation: '"Go over" means to review or examine something carefully, fitting the context of reviewing a presentation before a meeting.', domain: 'Phrasal verbs', difficulty: 'medium' },
      { type: 'multiple', question: 'He said he ____ me the next day.', options: { A: 'will call', B: 'would call', C: 'calls', D: 'is calling' }, answer: ['B'], explanation: '"Will" in direct speech shifts to "would" in reported speech, and "tomorrow" typically becomes "the next day" — matching this reported statement.', domain: 'Reported speech', difficulty: 'medium' },
    ],
  },
  {
    slug: 'english-c1-advanced',
    title: 'English C1 — Advanced',
    description: 'Practice exam for CEFR C1 level: inversion, cleft sentences, advanced conditionals, hedging language and idiomatic expressions.',
    domain: 'english', category: 'cefr', level: 'advanced', language: 'en',
    tags: ['english', 'c1', 'cae'], passPercent: 70, timeMinutes: 22,
    source: 'Based on CEFR C1 Global Scale descriptors (Council of Europe) + Cambridge C1 Advanced (CAE) specifications (original content)',
    questions: [
      { type: 'multiple', question: 'Choose the sentence with correct inversion: (Original: "I had never seen such chaos before.")', options: { A: 'Never before I had seen such chaos.', B: 'Never before had I seen such chaos.', C: 'Never before I have seen such chaos.', D: 'Never had before I seen such chaos.' }, answer: ['B'], explanation: 'Negative adverbials like "never before" placed at the start of a sentence trigger subject-auxiliary inversion: "Never before had I seen such chaos."', domain: 'Inversión enfática', difficulty: 'hard' },
      { type: 'multiple', question: 'Choose the sentence using a cleft structure to emphasize "the manager" as the one who made the decision. (Original: "The manager made the final decision.")', options: { A: 'It was the manager who made the final decision.', B: 'The manager who made the final decision it was.', C: 'It made the manager who the final decision was.', D: 'Was it the manager the final decision made.' }, answer: ['A'], explanation: 'An "it-cleft" sentence structure ("It was X who/that...") emphasizes a specific element of the sentence — here, correctly emphasizing "the manager" as the agent of the decision.', domain: 'Cleft sentences', difficulty: 'hard' },
      { type: 'multiple', question: 'Choose the correct mixed conditional: (present result of a past unreal condition)', options: { A: 'If I had studied medicine, I would be a doctor now.', B: 'If I studied medicine, I would have been a doctor now.', C: 'If I had studied medicine, I would have been a doctor now.', D: 'If I study medicine, I would be a doctor now.' }, answer: ['A'], explanation: 'A mixed conditional combining a past hypothetical condition with a present result uses "if + past perfect, would + base verb": "If I had studied medicine, I would be a doctor now."', domain: 'Advanced conditionals', difficulty: 'hard' },
      { type: 'multiple', question: 'Which phrase best exemplifies "hedging language" (softening a claim to sound less absolute) in academic writing?', options: { A: 'This proves that the theory is completely correct.', B: 'The results appear to suggest a possible correlation between the variables.', C: 'The theory is obviously wrong.', D: 'Everyone agrees this is the only explanation.' }, answer: ['B'], explanation: 'Hedging language uses tentative expressions ("appear to suggest," "possible") to present claims cautiously, avoiding absolute statements — a hallmark of careful academic writing, unlike the overconfident claims in the other options.', domain: 'Hedging language', difficulty: 'medium' },
      { type: 'multiple', question: 'What does the idiom "to bite the bullet" mean?', options: { A: 'To avoid a difficult situation entirely', B: 'To face a difficult or unpleasant situation with courage, because it\'s unavoidable', C: 'To celebrate a small victory', D: 'To speak too quickly without thinking' }, answer: ['B'], explanation: '"To bite the bullet" means to accept and confront something unpleasant or difficult because there is no way to avoid it, showing resolve in a tough situation.', domain: 'Idioms y expresiones formales', difficulty: 'medium' },
      { type: 'multiple', question: 'Choose the correct collocation: "The committee will ____ a decision by next week."', options: { A: 'do', B: 'make', C: 'take', D: 'have' }, answer: ['B'], explanation: '"Make a decision" is the correct collocation in English; "do a decision" and "take a decision" (though the latter is used in some British/other varieties informally) are not the standard, most widely accepted form in formal English.', domain: 'Collocations', difficulty: 'medium' },
      { type: 'multiple', question: 'Read: "While the proposal has merit, several practical concerns must be addressed before implementation." What tone does this sentence convey?', options: { A: 'Complete rejection of the proposal', B: 'Enthusiastic, unconditional support', C: 'Cautious, balanced acknowledgment — acknowledging value while raising reservations', D: 'Total indifference to the proposal' }, answer: ['C'], explanation: 'The structure "while X has merit, ... concerns must be addressed" is a classic academic hedge, balancing acknowledgment of value with legitimate reservations — neither full rejection nor unconditional support.', domain: 'Lectura crítica de textos académicos', difficulty: 'medium' },
      { type: 'multiple', question: 'Choose the sentence with correct inversion after a negative adverbial: (Original: "I rarely see such dedication.")', options: { A: 'Rarely I see such dedication.', B: 'Rarely do I see such dedication.', C: 'Rarely I do see such dedication.', D: 'Do rarely I see such dedication.' }, answer: ['B'], explanation: 'The negative/restrictive adverb "rarely" at the start of a sentence triggers auxiliary inversion using "do": "Rarely do I see such dedication."', domain: 'Inversión enfática', difficulty: 'hard' },
      { type: 'multiple', question: 'What does the idiom "to read between the lines" mean?', options: { A: 'To read a text very slowly and carefully', B: 'To understand the implied or hidden meaning of something, beyond its literal words', C: 'To skip parts of a text while reading', D: 'To translate a text from one language to another' }, answer: ['B'], explanation: '"To read between the lines" means to grasp the implicit or underlying meaning of a message that isn\'t explicitly stated in the text.', domain: 'Idioms y expresiones formales', difficulty: 'medium' },
      { type: 'multiple', question: 'Choose the correct cleft sentence to emphasize "next month" as the timing: (Original: "The new policy will take effect next month.")', options: { A: 'It is next month when the new policy will take effect.', B: 'It is next month that the new policy will take effect.', C: 'Next month is it that the new policy will take effect.', D: 'What next month the new policy will take effect.' }, answer: ['B'], explanation: 'An it-cleft using "that" is grammatically standard to emphasize a time expression: "It is next month that the new policy will take effect."', domain: 'Cleft sentences', difficulty: 'hard' },
      { type: 'multiple', question: 'Choose the correct collocation: "She has always ____ a keen interest in astronomy."', options: { A: 'done', B: 'made', C: 'taken', D: 'held' }, answer: ['C'], explanation: '"Take an interest in" is the standard collocation in English, meaning to become interested/involved in something.', domain: 'Collocations', difficulty: 'medium' },
      { type: 'multiple', question: 'Choose the correct mixed conditional: (past result of a general/present truth)', options: { A: 'If she weren\'t so stubborn, she would have accepted the offer.', B: 'If she isn\'t so stubborn, she would have accepted the offer.', C: 'If she wasn\'t so stubborn, she will have accepted the offer.', D: 'If she hadn\'t been so stubborn, she would accept the offer.' }, answer: ['A'], explanation: 'This mixed conditional combines a present unreal condition (her general stubborn character) with a past unreal result, using "if + past simple, would have + past participle": "If she weren\'t so stubborn, she would have accepted the offer."', domain: 'Advanced conditionals', difficulty: 'hard' },
      { type: 'multiple', question: 'Which sentence uses hedging most effectively in an academic context?', options: { A: 'The data definitely proves our hypothesis beyond any doubt.', B: 'The data seems to lend some support to our hypothesis, though further research is needed.', C: 'Our hypothesis is obviously correct based on this data.', D: 'This data is undeniable proof of our hypothesis.' }, answer: ['B'], explanation: 'Phrases like "seems to lend some support" and "further research is needed" appropriately hedge the claim, reflecting the tentative nature typical of rigorous academic writing, unlike the overconfident absolute claims in the other options.', domain: 'Hedging language', difficulty: 'medium' },
      { type: 'multiple', question: 'What does the idiom "to hit the nail on the head" mean?', options: { A: 'To make a serious mistake', B: 'To describe exactly what is causing a situation or problem, with precision', C: 'To avoid answering a question', D: 'To work extremely hard on a task' }, answer: ['B'], explanation: '"To hit the nail on the head" means to identify or describe something with exact precision, capturing the essence of a situation correctly.', domain: 'Idioms y expresiones formales', difficulty: 'medium' },
      { type: 'multiple', question: 'Choose the correct collocation: "It is essential to ____ a balance between work and personal life."', options: { A: 'do', B: 'strike', C: 'catch', D: 'build' }, answer: ['B'], explanation: '"Strike a balance" is the standard collocation meaning to find an appropriate middle ground between two things.', domain: 'Collocations', difficulty: 'hard' },
      { type: 'multiple', question: 'Read: "It could be argued that the policy, while well-intentioned, ultimately fails to address the root causes of the issue." What rhetorical purpose does "it could be argued that" serve?', options: { A: 'It states an undeniable fact', B: 'It introduces a claim tentatively, distancing the author slightly from a fully committed assertion, typical of academic hedging', C: 'It signals the end of the argument', D: 'It has no rhetorical function; it is purely decorative' }, answer: ['B'], explanation: '"It could be argued that" is a classic hedging phrase that introduces a claim while maintaining some distance from full commitment, allowing for nuance and acknowledging other possible viewpoints — common in critical academic writing.', domain: 'Lectura crítica de textos académicos', difficulty: 'hard' },
      { type: 'multiple', question: 'Choose the sentence with correct inversion: (Original: "She had no sooner sat down than the phone rang.")', options: { A: 'No sooner she had sat down than the phone rang.', B: 'No sooner had she sat down than the phone rang.', C: 'No sooner had sat she down than the phone rang.', D: 'No sooner she sat down had than the phone rang.' }, answer: ['B'], explanation: '"No sooner" at the start of a sentence requires inversion of the auxiliary and subject: "No sooner had she sat down than the phone rang."', domain: 'Inversión enfática', difficulty: 'hard' },
      { type: 'multiple', question: 'What does the idiom "to cut corners" mean?', options: { A: 'To take a shortcut in a task, often sacrificing quality or safety to save time/money', B: 'To finish a task exceptionally well', C: 'To divide a project fairly among team members', D: 'To decorate a room\'s corners' }, answer: ['A'], explanation: '"To cut corners" means to do something in the easiest or cheapest way, often at the expense of quality or thoroughness — usually carrying a negative connotation.', domain: 'Idioms y expresiones formales', difficulty: 'medium' },
      { type: 'multiple', question: 'Choose the correct cleft sentence emphasizing "the lack of funding" as the cause: (Original: "The lack of funding caused the project to fail.")', options: { A: 'What caused the project to fail was the lack of funding.', B: 'The lack of funding was what the project to fail caused.', C: 'It was what caused the lack of funding the project to fail.', D: 'What the lack of funding caused was fail the project.' }, answer: ['A'], explanation: 'A "wh-cleft" sentence starting with "What caused..." followed by "was + the emphasized element" correctly emphasizes "the lack of funding" as the cause: "What caused the project to fail was the lack of funding."', domain: 'Cleft sentences', difficulty: 'hard' },
    ],
  },
  {
    slug: 'ielts-academic-reading',
    title: 'IELTS Academic — Reading',
    description: 'Practice questions for the IELTS Academic Reading module: question types, skimming/scanning strategies and academic vocabulary.',
    domain: 'english', category: 'ielts', level: 'advanced', language: 'en',
    tags: ['ielts', 'reading', 'academic'], passPercent: 65, timeMinutes: 22,
    source: 'Based on IELTS Academic Test Format (British Council/IDP/Cambridge) — ielts.org/test-format (original content)',
    questions: [
      { type: 'multiple', question: 'Read: "Urban beekeeping has surged in popularity over the past decade, with city dwellers installing hives on rooftops to support declining bee populations and produce local honey." What is the main idea of this passage?', options: { A: 'Bees are declining because of urban beekeeping', B: 'Urban beekeeping has grown as a way to support bee populations and produce honey locally', C: 'Rooftops are unsuitable for beekeeping', D: 'City dwellers dislike honey' }, answer: ['B'], explanation: 'The passage states urban beekeeping "has surged in popularity... to support declining bee populations and produce local honey," directly stating the main idea reflected in option B.', domain: 'Comprensión general y tipos de pregunta', difficulty: 'easy' },
      { type: 'multiple', question: 'In IELTS Reading, when a question asks you to match a paragraph to a heading from a list, what is this question type called?', options: { A: 'Matching Headings', B: 'True/False/Not Given', C: 'Sentence Completion', D: 'Multiple Choice' }, answer: ['A'], explanation: '"Matching Headings" requires identifying which heading from a given list best summarizes the main idea of each paragraph in the passage, testing overall comprehension of each section.', domain: 'Tipos de pregunta IELTS', difficulty: 'easy' },
      { type: 'multiple', question: 'Read: "While some researchers argue that remote work increases productivity, the passage does not provide any data on employee satisfaction levels." Based ONLY on this sentence, is the statement "The passage confirms that remote work decreases employee satisfaction" True, False, or Not Given?', options: { A: 'True', B: 'False', C: 'Not Given', D: 'Cannot be determined from any passage ever' }, answer: ['C'], explanation: 'The sentence explicitly states there is no data on employee satisfaction — so we cannot confirm OR deny anything about satisfaction levels; the correct classification is "Not Given," a common trap in this question type.', domain: 'Tipos de pregunta IELTS', difficulty: 'medium' },
      { type: 'multiple', question: 'What is the main purpose of "skimming" a passage in IELTS Reading?', options: { A: 'To read every word carefully and memorize details', B: 'To quickly get a general understanding of the main ideas and structure of the text, before answering detailed questions', C: 'To translate the passage into another language', D: 'To count the number of paragraphs' }, answer: ['B'], explanation: 'Skimming is a fast-reading technique to grasp the overall gist, structure and main ideas of a passage quickly, used as a first pass before locating specific details for questions.', domain: 'Skimming y scanning', difficulty: 'easy' },
      { type: 'multiple', question: 'What is "scanning" used for in IELTS Reading, as opposed to skimming?', options: { A: 'Reading the entire text slowly word by word', B: 'Quickly searching the text for specific information (dates, names, numbers) needed to answer a particular question, without reading everything', C: 'Memorizing the passage completely', D: 'Translating unfamiliar words' }, answer: ['B'], explanation: 'Scanning is a targeted search technique used to quickly locate specific pieces of information (like a date, name, or figure) needed for a question, without reading the surrounding text in detail.', domain: 'Skimming y scanning', difficulty: 'easy' },
      { type: 'multiple', question: 'Read: "The economic downturn led many companies to postpone expansion plans." Which of the following is the best paraphrase of this sentence?', options: { A: 'Companies expanded rapidly due to the economic downturn.', B: 'Due to the recession, several businesses delayed their growth strategies.', C: 'The economic downturn had no effect on company plans.', D: 'Companies canceled all future plans permanently.' }, answer: ['B'], explanation: 'A correct paraphrase preserves the original meaning using different words: "recession" for "economic downturn," "delayed their growth strategies" for "postpone expansion plans" — option B accurately captures this without adding or losing meaning.', domain: 'Paráfrasis', difficulty: 'medium' },
      { type: 'multiple', question: 'In a "Sentence Completion" question, why is it important to check the word limit given in the instructions (e.g., "NO MORE THAN TWO WORDS")?', options: { A: 'It doesn\'t matter; any answer length is accepted', B: 'Exceeding the stated word limit will make the answer incorrect, even if the content/meaning is otherwise correct', C: 'The word limit only applies to the Listening section, not Reading', D: 'Word limits are only suggestions, not strict rules' }, answer: ['B'], explanation: 'IELTS strictly enforces word limits in completion tasks — an answer that exceeds the stated limit (e.g., three words when the limit is two) is marked incorrect regardless of whether the content itself is accurate.', domain: 'Tipos de pregunta IELTS', difficulty: 'medium' },
      { type: 'multiple', question: 'Read: "Despite initial skepticism, the new teaching method has since gained widespread acceptance among educators." What can be inferred about the current attitude of educators toward this method?', options: { A: 'Educators remain skeptical', B: 'Educators have largely come to accept and support the method, despite early doubts', C: 'Educators have rejected the method entirely', D: 'No inference can be made about educators\' current attitude' }, answer: ['B'], explanation: 'The phrase "has since gained widespread acceptance" clearly indicates the CURRENT attitude has shifted from initial skepticism to broad support among educators.', domain: 'Identificación de la idea principal', difficulty: 'medium' },
      { type: 'multiple', question: 'What is the recommended overall time management strategy for the IELTS Academic Reading test (3 passages, 60 minutes)?', options: { A: 'Spend as long as needed on Passage 1, regardless of time remaining for the others', B: 'Allocate roughly 20 minutes per passage, adjusting slightly based on passage difficulty, since all passages carry similar weight toward the final score', C: 'Spend the entire 60 minutes only on Passage 3, since it is usually the hardest', D: 'Time management doesn\'t matter in the Reading test' }, answer: ['B'], explanation: 'With 3 passages and 60 minutes, a common effective strategy is to allocate roughly 20 minutes per passage, since all passages and their questions carry similar overall weight in the final band score.', domain: 'Manejo del tiempo', difficulty: 'medium' },
      { type: 'multiple', question: 'Which academic vocabulary word most likely appears in an IELTS Academic passage discussing research methodology?', options: { A: 'Yummy', B: 'Methodology', C: 'Awesome', D: 'Kinda' }, answer: ['B'], explanation: '"Methodology" is formal academic vocabulary commonly found in IELTS Academic passages, which draw on academic and professional texts, unlike the informal words in the other options.', domain: 'Vocabulario académico', difficulty: 'easy' },
      { type: 'multiple', question: 'In a "True/False/Not Given" question, what does "False" mean specifically?', options: { A: 'The passage does not mention this information at all', B: 'The statement directly contradicts information given in the passage', C: 'The statement is a paraphrase of the passage', D: 'The statement is only partially related to the passage' }, answer: ['B'], explanation: '"False" means the statement directly contradicts what the passage actually says — different from "Not Given," which means the passage simply doesn\'t address that specific point at all.', domain: 'Tipos de pregunta IELTS', difficulty: 'medium' },
      { type: 'multiple', question: 'Read: "Although the survey sample was relatively small, the results align closely with findings from larger, previous studies." Which statement best matches this sentence?', options: { A: 'The small survey sample invalidates the results completely.', B: 'Despite a limited sample size, the survey findings are consistent with prior larger-scale research.', C: 'The survey is the only study ever conducted on this topic.', D: 'Larger studies always produce different results than smaller ones.' }, answer: ['B'], explanation: 'The sentence acknowledges a limitation (small sample) while noting the results still align with larger studies — option B correctly paraphrases this nuanced relationship without overstating or dismissing the findings.', domain: 'Paráfrasis', difficulty: 'hard' },
    ],
  },
  {
    slug: 'ielts-academic-writing',
    title: 'IELTS Academic — Writing',
    description: 'Practice questions on IELTS Academic Writing format: Task 1 (graphs/processes), Task 2 (essays) and the four assessment criteria.',
    domain: 'english', category: 'ielts', level: 'advanced', language: 'en',
    tags: ['ielts', 'writing', 'academic'], passPercent: 65, timeMinutes: 20,
    source: 'Based on IELTS Academic Writing Task 1 & Task 2 Band Descriptors (public version) — ielts.org (original content)',
    questions: [
      { type: 'multiple', question: 'What is the main focus of IELTS Academic Writing Task 1?', options: { A: 'Writing a personal narrative essay', B: 'Describing, summarizing or explaining visual information (a graph, table, chart, diagram or process) in your own words', C: 'Writing a formal letter of complaint', D: 'Arguing for or against a controversial opinion' }, answer: ['B'], explanation: 'Task 1 (Academic) requires describing and summarizing visual data — graphs, tables, charts, diagrams, or processes — objectively, without giving personal opinions.', domain: 'Task 1: descripción de gráficos, tablas y procesos', difficulty: 'easy' },
      { type: 'multiple', question: 'When describing a line graph for Task 1, what should the introduction (paraphrase) do?', options: { A: 'Copy the exact wording of the question prompt', B: 'Restate the information given in the prompt using different words, without adding specific data yet', C: 'Give a personal opinion about the graph', D: 'Immediately list every single data point from the graph' }, answer: ['B'], explanation: 'A good Task 1 introduction paraphrases the question prompt using synonyms and different sentence structure, without copying it verbatim, and without yet diving into specific data (that comes in the body paragraphs).', domain: 'Task 1: descripción de gráficos, tablas y procesos', difficulty: 'medium' },
      { type: 'multiple', question: 'What is the minimum recommended word count for IELTS Writing Task 2?', options: { A: '150 words', B: '250 words', C: '350 words', D: '500 words' }, answer: ['B'], explanation: 'Task 2 requires a minimum of 250 words; writing significantly under this limit results in a penalty, as the essay would be considered underdeveloped.', domain: 'Task 2: tipos de ensayo', difficulty: 'easy' },
      { type: 'multiple', question: 'What type of essay asks the writer to discuss both sides of an issue and then give their own opinion?', options: { A: 'Opinion essay (Agree/Disagree)', B: 'Discussion essay (Discuss both views and give your opinion)', C: 'Problem-solution essay', D: 'Advantages-disadvantages essay' }, answer: ['B'], explanation: 'A "discussion" essay explicitly requires presenting both viewpoints on an issue in a balanced way before stating and justifying the writer\'s own opinion, distinct from a pure opinion essay that focuses primarily on defending one side.', domain: 'Task 2: tipos de ensayo', difficulty: 'medium' },
      { type: 'multiple', question: 'What does "coherence" refer to in the IELTS Writing band descriptors?', options: { A: 'The variety of vocabulary used', B: 'The logical organization and clear progression of ideas, so the reader can easily follow the writer\'s argument', C: 'The correct use of grammar tenses', D: 'The total word count of the essay' }, answer: ['B'], explanation: 'Coherence refers to how logically and clearly ideas are organized and connected, allowing the reader to follow the overall argument or description easily — distinct from "cohesion," which focuses on specific linking devices.', domain: 'Cohesion y coherence', difficulty: 'medium' },
      { type: 'multiple', question: 'What does "cohesion" specifically assess in an IELTS essay?', options: { A: 'The writer\'s personal opinion on the topic', B: 'The effective use of linking words and referencing devices (e.g., "however," "this," "therefore") to connect ideas within and between sentences', C: 'The total number of paragraphs used', D: 'The use of complex vocabulary exclusively' }, answer: ['B'], explanation: 'Cohesion specifically evaluates how well the writer uses cohesive devices (linking words, pronouns, referencing) to connect sentences and paragraphs smoothly, a distinct criterion from the broader logical organization measured by coherence.', domain: 'Cohesion y coherence', difficulty: 'medium' },
      { type: 'multiple', question: 'What does the "Lexical Resource" criterion assess in IELTS Writing?', options: { A: 'The range and accuracy of vocabulary used, including the ability to use less common/topic-specific words appropriately', B: 'Only the length of the essay', C: 'The number of grammatical errors exclusively', D: 'The handwriting quality of the response' }, answer: ['A'], explanation: 'Lexical Resource evaluates the range, accuracy, and appropriateness of vocabulary used — including the ability to use less common and topic-specific words naturally, not just correctness of grammar (which is a separate criterion).', domain: 'Lexical resource', difficulty: 'medium' },
      { type: 'multiple', question: 'What does "Grammatical Range and Accuracy" assess in an IELTS essay?', options: { A: 'The use of a variety of correct grammatical structures (simple, compound, complex sentences), with minimal errors', B: 'Only whether the essay uses long sentences', C: 'Whether the writer memorized a template', D: 'The visual formatting of the essay' }, answer: ['A'], explanation: 'This criterion evaluates both the range (variety of sentence structures, from simple to complex) and the accuracy (correctness) of grammar used throughout the essay.', domain: 'Grammatical range and accuracy', difficulty: 'medium' },
      { type: 'multiple', question: 'For a "problem-solution" Task 2 essay, what should the body paragraphs typically address?', options: { A: 'Only personal anecdotes unrelated to the topic', B: 'The problem(s) related to the topic, followed by realistic solution(s) to address them', C: 'A random list of unrelated facts', D: 'Only the advantages, ignoring any disadvantages' }, answer: ['B'], explanation: 'A problem-solution essay structure requires clearly identifying the problem(s) associated with the topic and then proposing realistic, well-explained solutions to address them.', domain: 'Task 2: tipos de ensayo', difficulty: 'medium' },
      { type: 'multiple', question: 'When describing a process diagram in Task 1 (e.g., how a product is manufactured), what verb form is typically used throughout, since there is no specific timeframe (a general, repeated process)?', options: { A: 'Past simple', B: 'Present simple passive', C: 'Future continuous', D: 'Present perfect' }, answer: ['B'], explanation: 'Process diagrams describing general, repeated procedures (not a one-time historical event) are typically described using the present simple passive (e.g., "the raw material is collected, then it is processed..."), since the focus is on the steps, not who performs them.', domain: 'Task 1: descripción de gráficos, tablas y procesos', difficulty: 'hard' },
      { type: 'multiple', question: 'Why is it considered a weakness in IELTS Task 2 to include a personal opinion in a purely descriptive/discussion prompt that doesn\'t explicitly ask for one?', options: { A: 'It is never a weakness, opinions are always welcome regardless of the prompt', B: 'It may indicate the writer did not fully understand or address the specific task requirements, potentially affecting the Task Response score', C: 'Personal opinions are grammatically incorrect', D: 'It always results in an automatic score of zero' }, answer: ['B'], explanation: 'IELTS Task 2 prompts vary in what they require (some ask explicitly for opinion, others for pure discussion); failing to address the specific requirements of the actual prompt affects the Task Response criterion, since the response must be fully relevant to what was actually asked.', domain: 'Task 2: tipos de ensayo', difficulty: 'hard' },
    ],
  },
  {
    slug: 'toefl-ibt-fundamentals',
    title: 'TOEFL iBT — Fundamentals',
    description: 'Practice questions on the structure and strategies of the four TOEFL iBT sections: Reading, Listening, Speaking and Writing.',
    domain: 'english', category: 'toefl', level: 'advanced', language: 'en',
    tags: ['toefl', 'ibt'], passPercent: 65, timeMinutes: 22,
    source: 'Based on TOEFL iBT Test Content & Structure (ETS) — ets.org/toefl (original content)',
    questions: [
      { type: 'multiple', question: 'What are the four sections that make up the TOEFL iBT test?', options: { A: 'Reading, Listening, Speaking, Writing', B: 'Grammar, Vocabulary, Pronunciation, Composition', C: 'Math, Science, History, Literature', D: 'Reading, Writing, Translation, Conversation' }, answer: ['A'], explanation: 'The TOEFL iBT assesses all four core academic English skills: Reading, Listening, Speaking, and Writing, reflecting the demands of university-level academic settings.', domain: 'Estructura del examen', difficulty: 'easy' },
      { type: 'multiple', question: 'What type of texts appear in the TOEFL iBT Reading section?', options: { A: 'Casual text messages and social media posts', B: 'Academic passages similar to those found in university-level textbooks, covering a range of subjects', C: 'Legal contracts exclusively', D: 'Poetry exclusively' }, answer: ['B'], explanation: 'TOEFL Reading passages are academic in nature, similar in style and complexity to introductory university textbook material, covering topics from various academic disciplines.', domain: 'Reading (academic passages, integrated questions)', difficulty: 'easy' },
      { type: 'multiple', question: 'What is an "integrated task" in TOEFL, as opposed to an "independent task"?', options: { A: 'A task based only on personal opinion without any source material', B: 'A task that combines multiple skills (e.g., reading a passage, listening to a lecture, then speaking or writing about both) to test how well a student synthesizes information from different sources', C: 'A task with no time limit', D: 'A task exclusive to the Reading section' }, answer: ['B'], explanation: 'Integrated tasks require combining skills (e.g., read + listen, then speak or write about the combined content), testing the ability to synthesize information from multiple sources — a key academic skill assessed distinctly from purely independent (opinion-based) tasks.', domain: 'Reading (academic passages, integrated questions)', difficulty: 'medium' },
      { type: 'multiple', question: 'What types of audio material does the TOEFL Listening section typically include?', options: { A: 'Only casual phone calls between friends', B: 'Academic lectures and conversations set in a university/campus context (e.g., a student speaking with a professor or an administrator)', C: 'Only news broadcasts', D: 'Only music with lyrics' }, answer: ['B'], explanation: 'TOEFL Listening includes academic lectures (similar to a university class) and conversations in campus-related contexts, testing comprehension of the kind of spoken English used in real academic settings.', domain: 'Listening (lectures, conversations)', difficulty: 'easy' },
      { type: 'multiple', question: 'What is the "independent speaking task" in TOEFL Speaking, as opposed to the integrated tasks?', options: { A: 'A task requiring the student to give a personal opinion or experience on a familiar topic, without any reading or listening source material', B: 'A task requiring listening to three separate lectures', C: 'A task that only tests pronunciation, ignoring content', D: 'A task with no speaking involved at all' }, answer: ['A'], explanation: 'The independent speaking task asks the student to express a personal opinion or describe a personal experience based solely on their own knowledge, without relying on a reading or listening passage — distinct from the integrated speaking tasks.', domain: 'Speaking (independent, integrated tasks)', difficulty: 'medium' },
      { type: 'multiple', question: 'What does the "integrated writing task" in TOEFL typically require?', options: { A: 'Writing a purely personal essay with no source material', B: 'Reading a short passage, listening to a lecture that challenges or supports it, and writing a response that explains how the lecture relates to the reading', C: 'Copying the reading passage word for word', D: 'Writing only in bullet points without full sentences' }, answer: ['B'], explanation: 'The integrated writing task requires synthesizing a reading passage and a related lecture (which often challenges or supports points from the reading), then writing a response that explains the relationship between the two sources.', domain: 'Writing (integrated, academic discussion)', difficulty: 'medium' },
      { type: 'multiple', question: 'What is the "academic discussion" writing task added in more recent TOEFL iBT formats?', options: { A: 'Writing a response to a professor\'s question in an online discussion forum, engaging with classmates\' viewpoints', B: 'A task exclusive to the Speaking section', C: 'A task requiring no interaction with any prompt or context', D: 'A purely grammar-focused fill-in-the-blank exercise' }, answer: ['A'], explanation: 'The academic discussion task simulates responding to a professor\'s discussion board question, requiring students to contribute their own viewpoint while engaging meaningfully with the academic discussion context — reflecting real online academic environments.', domain: 'Writing (integrated, academic discussion)', difficulty: 'medium' },
      { type: 'multiple', question: 'Why is time management particularly important in the TOEFL Reading section, given multiple passages must be completed?', options: { A: 'Time management is irrelevant since there is no overall time limit', B: 'Since each passage has a shared or individual time allocation with several questions, spending too long on one passage can leave insufficient time to properly complete the others', C: 'The Reading section has no questions, only passages to read', D: 'Time management only matters in the Speaking section' }, answer: ['B'], explanation: 'With multiple passages and a limited overall time budget, spending excessive time on one passage risks leaving too little time to properly read and answer questions for the remaining passages — a common strategic challenge in TOEFL Reading.', domain: 'Gestión del tiempo', difficulty: 'medium' },
      { type: 'multiple', question: 'Which of the following words is more likely to be classified as "academic vocabulary" typical of TOEFL passages?', options: { A: 'Analyze', B: 'Cool', C: 'Gonna', D: 'Yeah' }, answer: ['A'], explanation: '"Analyze" is formal academic vocabulary commonly found in TOEFL passages and lectures, which reflect university-level academic register, unlike the informal words in the other options.', domain: 'Vocabulario académico TOEFL', difficulty: 'easy' },
      { type: 'multiple', question: 'In TOEFL Listening, why is note-taking specifically encouraged during lectures and conversations?', options: { A: 'Note-taking is prohibited during the TOEFL test', B: 'Because lectures can be several minutes long with multiple details, and questions may ask about specific points made throughout, making notes useful for recalling structure and key details', C: 'Because the audio is repeated multiple times automatically', D: 'Because students are graded directly on their handwriting' }, answer: ['B'], explanation: 'TOEFL lectures/conversations can be lengthy with multiple supporting details; since the audio plays only once, taking notes helps students recall the structure and key points needed to answer detailed comprehension questions afterward.', domain: 'Listening (lectures, conversations)', difficulty: 'medium' },
    ],
  },
  {
    slug: 'toeic-listening-reading',
    title: 'TOEIC Listening & Reading',
    description: 'Practice questions oriented to Business English for the TOEIC Listening & Reading test format.',
    domain: 'english', category: 'toeic', level: 'intermediate', language: 'en',
    tags: ['toeic', 'business-english'], passPercent: 65, timeMinutes: 20,
    source: 'Based on TOEIC Listening & Reading Test Format (ETS) — ets.org/toeic (original content)',
    questions: [
      { type: 'multiple', question: 'What business context do most TOEIC Listening and Reading passages typically focus on?', options: { A: 'Academic university lectures', B: 'Workplace and business situations: meetings, emails, offices, travel, and everyday professional contexts', C: 'Creative fiction writing', D: 'Poetry analysis' }, answer: ['B'], explanation: 'TOEIC is specifically designed to assess English proficiency in workplace and business contexts, unlike TOEFL (which focuses on academic English), covering situations like meetings, emails, offices, and business travel.', domain: 'Vocabulario de negocios', difficulty: 'easy' },
      { type: 'multiple', question: 'In the TOEIC Listening "Photographs" question type, what must the test-taker do?', options: { A: 'Write a description of the photograph', B: 'Select the statement that best describes what is happening in a photograph, from four spoken options', C: 'Draw a picture based on a description', D: 'Translate the photograph\'s caption' }, answer: ['B'], explanation: 'In the Photographs section, test-takers hear four spoken statements about a single photograph and must select the one that most accurately describes what is shown in the image.', domain: 'Listening: photographs, question-response, conversations, talks', difficulty: 'easy' },
      { type: 'multiple', question: 'In the TOEIC Listening "Question-Response" section, what does the test-taker hear and need to do?', options: { A: 'A question or statement followed by three possible spoken responses; select the best response', B: 'A full lecture followed by 10 questions', C: 'A photograph description', D: 'A written passage to read silently' }, answer: ['A'], explanation: 'The Question-Response section presents a spoken question or statement followed by three possible responses (also spoken); the test-taker selects the response that most appropriately answers or reacts to it.', domain: 'Listening: photographs, question-response, conversations, talks', difficulty: 'medium' },
      { type: 'multiple', question: 'Choose the sentence that correctly completes it (TOEIC-style "Incomplete Sentences"): "The quarterly report must be ____ by Friday afternoon."', options: { A: 'submit', B: 'submitted', C: 'submitting', D: 'submission' }, answer: ['B'], explanation: 'The passive construction "must be submitted" requires the past participle form after "be" — "submitted" correctly completes this passive structure.', domain: 'Reading: incomplete sentences, text completion, single y double passages', difficulty: 'medium' },
      { type: 'multiple', question: 'In the TOEIC Reading "Text Completion" question type, what is being tested?', options: { A: 'Filling in blanks within a short passage (email, memo, article), often testing vocabulary, grammar, and understanding of the surrounding context', B: 'Listening comprehension exclusively', C: 'Handwriting skills', D: 'Speaking fluency' }, answer: ['A'], explanation: 'Text Completion presents a short passage with blanks (words, phrases, or sentences), requiring the test-taker to choose the option that fits both grammatically and contextually within the surrounding text.', domain: 'Reading: incomplete sentences, text completion, single y double passages', difficulty: 'medium' },
      { type: 'multiple', question: 'What does the TOEIC "Double Passages" reading task typically require, compared to a single passage?', options: { A: 'Reading only one document with no cross-referencing needed', B: 'Reading two related documents (e.g., an email and a schedule) and answering questions that may require synthesizing information from both', C: 'Reading the same passage twice for repetition', D: 'Listening to two audio clips simultaneously' }, answer: ['B'], explanation: 'Double Passages present two related documents (e.g., a job posting and a cover letter, or an email exchange), with some questions requiring the test-taker to combine information from both texts to answer correctly.', domain: 'Reading: incomplete sentences, text completion, single y double passages', difficulty: 'medium' },
      { type: 'multiple', question: 'Choose the correct business vocabulary word: "The company decided to ____ its operations to reduce costs during the downturn."', options: { A: 'expand', B: 'downsize', C: 'celebrate', D: 'ignore' }, answer: ['B'], explanation: '"Downsize" means to reduce the size of a company (e.g., staff or operations), fitting the context of cutting costs during an economic downturn.', domain: 'Vocabulario de negocios', difficulty: 'easy' },
      { type: 'multiple', question: 'In TOEIC Listening "Talks," what type of audio content is typically presented?', options: { A: 'A single spoken monologue, such as an announcement, advertisement, or short business presentation', B: 'A dialogue between two people exclusively', C: 'A photograph description', D: 'A single-word vocabulary quiz' }, answer: ['A'], explanation: 'The "Talks" section presents a spoken monologue (e.g., an announcement, voicemail message, or short presentation), followed by questions testing comprehension of the content and purpose of the talk.', domain: 'Listening: photographs, question-response, conversations, talks', difficulty: 'medium' },
      { type: 'multiple', question: 'Which strategy is most effective for the TOEIC Reading section, given its strict overall time limit across many questions?', options: { A: 'Read every word of every passage with equal, careful attention regardless of time remaining', B: 'Skim passages first for general understanding, then scan for specific details needed to answer each question, managing time carefully across all passages', C: 'Answer questions randomly without reading any passages', D: 'Only read the first sentence of each passage and ignore the rest' }, answer: ['B'], explanation: 'Given the significant number of questions and strict time limit, an effective TOEIC Reading strategy combines skimming for general understanding with targeted scanning for specific details, managing time carefully across all passages rather than reading everything with uniform depth.', domain: 'Estrategias por tipo de pregunta', difficulty: 'medium' },
      { type: 'multiple', question: 'Choose the correct word: "Please find ____ the attached invoice for your review."', options: { A: 'enclosed', B: 'enclosing', C: 'enclose', D: 'encloses' }, answer: ['A'], explanation: '"Please find enclosed" is a standard formal business email phrase, using "enclosed" as a past participle functioning adjectivally to describe the attached document.', domain: 'Vocabulario de negocios', difficulty: 'medium' },
    ],
  },
  {
    slug: 'business-english-b2',
    title: 'Business English — B2',
    description: 'Practice questions on B2-level Business English: emails, meetings, presentations, negotiations and telephone English.',
    domain: 'english', category: 'business-english', level: 'intermediate', language: 'en',
    tags: ['business', 'english', 'b2'], passPercent: 70, timeMinutes: 20,
    source: 'Based on CEFR B2 Business Context descriptors + Cambridge Business English Certificate (BEC) Vantage specifications (original content)',
    questions: [
      { type: 'multiple', question: 'Choose the most appropriate opening line for a formal complaint email.', options: { A: 'Hey, what\'s up with my order?', B: 'I am writing to express my concern regarding a recent issue with my order.', C: 'Yo, my order is wrong lol.', D: 'Whatever, my order is messed up.' }, answer: ['B'], explanation: 'Formal complaint emails should use professional, measured language: "I am writing to express my concern regarding..." is an appropriate, formal opening, unlike the overly casual options.', domain: 'Email writing (formal/informal, requests, complaints)', difficulty: 'easy' },
      { type: 'multiple', question: 'Choose the most appropriate way to make a polite request in a business email.', options: { A: 'Send me the report now.', B: 'I would appreciate it if you could send me the report by Friday.', C: 'Give me the report.', D: 'You need to send the report immediately.' }, answer: ['B'], explanation: '"I would appreciate it if you could..." is a polite, indirect request structure common in professional business emails, softening the demand compared to the blunt/direct alternatives.', domain: 'Email writing (formal/informal, requests, complaints)', difficulty: 'medium' },
      { type: 'multiple', question: 'As the chair of a meeting, which phrase is appropriate to formally open the discussion?', options: { A: 'Shall we get started?', B: 'I\'d like to call this meeting to order and welcome everyone.', C: 'Hey guys, let\'s chat.', D: 'Whatever, let\'s begin I guess.' }, answer: ['B'], explanation: '"I\'d like to call this meeting to order" is a standard, formal phrase used by a chairperson to officially begin a meeting, appropriate for a professional context.', domain: 'Meetings (chairing, participating, agreeing/disagreeing)', difficulty: 'medium' },
      { type: 'multiple', question: 'Which phrase is appropriate for politely disagreeing with a colleague\'s point during a meeting?', options: { A: 'You\'re completely wrong about that.', B: 'I see your point, but I have a slightly different view on this.', C: 'That\'s a stupid idea.', D: 'No way, that\'s not true at all.' }, answer: ['B'], explanation: '"I see your point, but I have a slightly different view" acknowledges the other person\'s perspective before politely disagreeing, a diplomatic approach appropriate for professional meetings, unlike the blunt alternatives.', domain: 'Meetings (chairing, participating, agreeing/disagreeing)', difficulty: 'medium' },
      { type: 'multiple', question: 'What is a "signposting" phrase used in business presentations to guide the audience through the structure?', options: { A: '"Firstly, I\'ll discuss the market analysis; then, I\'ll move on to our proposed strategy."', B: 'A phrase with no connection to the presentation content', C: 'A random joke unrelated to the topic', D: 'Reading directly from the slides without any transition phrases' }, answer: ['A'], explanation: 'Signposting phrases (e.g., "Firstly... then... finally...") explicitly guide the audience through the logical structure of a presentation, helping them follow the flow of information clearly.', domain: 'Presentations (signposting, transitions)', difficulty: 'medium' },
      { type: 'multiple', question: 'Which transition phrase is appropriate to move from one section of a presentation to the next?', options: { A: 'Moving on to the next point, let\'s look at our financial projections.', B: 'Whatever, next slide.', C: 'I don\'t know what to say now.', D: 'Random topic change without any warning.' }, answer: ['A'], explanation: '"Moving on to the next point..." is a clear and professional transition phrase that signals a shift to a new topic within a presentation, helping the audience follow the logical progression.', domain: 'Presentations (signposting, transitions)', difficulty: 'easy' },
      { type: 'multiple', question: 'In a business negotiation, which phrase represents a diplomatic way to reject a proposal while keeping the conversation open?', options: { A: 'That\'s completely unacceptable, forget it.', B: 'I understand your position, but unfortunately we can\'t agree to those terms as they stand. Could we explore an alternative?', C: 'No.', D: 'That offer is ridiculous and insulting.' }, answer: ['B'], explanation: 'This response acknowledges the other party\'s position, clearly states the disagreement professionally, and proposes moving forward constructively — a diplomatic negotiation technique, unlike the blunt or hostile alternatives.', domain: 'Negotiations', difficulty: 'hard' },
      { type: 'multiple', question: 'Choose the appropriate way to answer a business phone call professionally.', options: { A: 'Yeah, who is this?', B: 'Good morning, this is [Name] speaking from [Company]. How can I help you?', C: 'What do you want?', D: 'Hold on, I\'m busy.' }, answer: ['B'], explanation: 'A professional phone greeting identifies the speaker and company clearly and offers assistance politely: "Good morning, this is [Name] speaking from [Company]. How can I help you?"', domain: 'Telephone English', difficulty: 'easy' },
      { type: 'multiple', question: 'What is the appropriate phrase to politely ask someone to repeat information during a business phone call?', options: { A: 'What?', B: 'Could you say that again, please? I didn\'t quite catch that.', C: 'Huh?', D: 'Say it again now.' }, answer: ['B'], explanation: '"Could you say that again, please? I didn\'t quite catch that." is a polite and professional way to request repetition during a business call, unlike the abrupt alternatives.', domain: 'Telephone English', difficulty: 'medium' },
      { type: 'multiple', question: 'Which vocabulary term is commonly used in corporate contexts to describe the process of formally ending an employee\'s contract due to company restructuring?', options: { A: 'Promotion', B: 'Redundancy (or layoff)', C: 'Onboarding', D: 'Bonus' }, answer: ['B'], explanation: '"Redundancy" (British English) or "layoff" (American English) refers to terminating employment, typically due to restructuring or reduced need for a position, rather than performance issues.', domain: 'Vocabulario corporativo', difficulty: 'medium' },
    ],
  },
  {
    slug: 'english-grammar-advanced',
    title: 'English Grammar — Advanced',
    description: 'Practice questions on advanced English grammar structures: perfect modals, mixed conditionals, inversion, participle clauses and gerunds vs. infinitives.',
    domain: 'english', category: 'grammar', level: 'advanced', language: 'en',
    tags: ['grammar', 'english', 'advanced'], passPercent: 70, timeMinutes: 22,
    source: 'Based on "A Student\'s Grammar of the English Language" (Greenbaum & Quirk) + Cambridge Grammar in Use Advanced (original content)',
    questions: [
      { type: 'multiple', question: 'Choose the correct sentence expressing a regret about a past action.', options: { A: 'I should have called her before leaving.', B: 'I should call her before leaving.', C: 'I should calling her before leaving.', D: 'I should have call her before leaving.' }, answer: ['A'], explanation: '"Should have + past participle" expresses regret about something that didn\'t happen in the past: "I should have called her" (but I didn\'t).', domain: 'Modales perfectos', difficulty: 'medium' },
      { type: 'multiple', question: 'Choose the sentence that correctly expresses criticism about a past unnecessary action.', options: { A: 'You needn\'t have brought an umbrella; it didn\'t rain.', B: 'You didn\'t need to bring an umbrella; it didn\'t rain.', C: 'You needn\'t bring an umbrella; it didn\'t rain.', D: 'You needn\'t have bring an umbrella; it didn\'t rain.' }, answer: ['A'], explanation: '"Needn\'t have + past participle" expresses that an action was performed but was unnecessary in hindsight: "You needn\'t have brought an umbrella" (you brought it, but it turned out to be unnecessary).', domain: 'Modales perfectos', difficulty: 'hard' },
      { type: 'multiple', question: 'Choose the correct mixed conditional: (present habitual character causing a past hypothetical result)', options: { A: 'If he weren\'t so impatient, he wouldn\'t have shouted at the waiter yesterday.', B: 'If he isn\'t so impatient, he wouldn\'t have shouted at the waiter yesterday.', C: 'If he hadn\'t been so impatient, he wouldn\'t shout at the waiter yesterday.', D: 'If he wasn\'t so impatient, he won\'t have shouted at the waiter yesterday.' }, answer: ['A'], explanation: 'This mixed conditional combines a present unreal condition (his general character trait) with a past unreal result, using "if + past simple, would have + past participle": "If he weren\'t so impatient, he wouldn\'t have shouted..."', domain: 'Mixed conditionals', difficulty: 'hard' },
      { type: 'multiple', question: 'Choose the sentence with correct inversion: (Original: "I have seldom witnessed such generosity.")', options: { A: 'Seldom I have witnessed such generosity.', B: 'Seldom have I witnessed such generosity.', C: 'Seldom I witnessed have such generosity.', D: 'Have seldom I witnessed such generosity.' }, answer: ['B'], explanation: 'The adverb "seldom" placed at the start of a sentence triggers subject-auxiliary inversion: "Seldom have I witnessed such generosity."', domain: 'Inversion', difficulty: 'hard' },
      { type: 'multiple', question: 'Choose the cleft sentence that correctly emphasizes "her dedication" as what impressed the panel. (Original: "Her dedication impressed the panel.")', options: { A: 'It was her dedication that impressed the panel.', B: 'It was her dedication what impressed the panel.', C: 'What impressed her dedication was the panel.', D: 'It was the panel that her dedication impressed.' }, answer: ['A'], explanation: 'An it-cleft with "that" (not "what," which is grammatically incorrect after "it was") correctly emphasizes "her dedication" as the subject that caused the impression.', domain: 'Cleft sentences', difficulty: 'medium' },
      { type: 'multiple', question: 'Choose the sentence with the correct use of the mandative subjunctive.', options: { A: 'It is essential that he arrives on time.', B: 'It is essential that he arrive on time.', C: 'It is essential that he arriving on time.', D: 'It is essential that he will arrive on time.' }, answer: ['B'], explanation: 'The mandative subjunctive uses the base form of the verb (without -s for third person) after expressions like "it is essential that": "It is essential that he arrive on time" (not "arrives").', domain: 'Subjuntivo (mandative)', difficulty: 'hard' },
      { type: 'multiple', question: 'Choose the sentence with a correctly used participle clause. (Original: "Because she was exhausted, she went straight to bed.")', options: { A: 'Exhausting, she went straight to bed.', B: 'Exhausted, she went straight to bed.', C: 'Being exhausting, she went straight to bed.', D: 'To exhaust, she went straight to bed.' }, answer: ['B'], explanation: 'Since the subject (she) IS exhausted (passive, receiving the state), the past participle "Exhausted" is correct: "Exhausted, she went straight to bed." "Exhausting" would describe something that causes exhaustion in others, not the state of being tired.', domain: 'Participles y participle clauses', difficulty: 'hard' },
      { type: 'multiple', question: 'Choose the correct sentence: gerund vs. infinitive with a change in meaning. ("Remember" + gerund vs. infinitive)', options: { A: 'I remember to lock the door this morning. (recalling a memory of a past action)', B: 'I remember locking the door this morning. (recalling a memory of a past action)', C: 'I remember lock the door this morning.', D: 'I remember locked the door this morning.' }, answer: ['B'], explanation: '"Remember + gerund" refers to recalling a memory of something already done ("I remember locking the door" = I have a memory of doing it); "remember + infinitive" would instead mean not forgetting to do something in the future.', domain: 'Gerunds vs infinitives con cambio de significado', difficulty: 'hard' },
      { type: 'multiple', question: 'Choose the correct sentence: "stop" + gerund vs. infinitive (different meanings).', options: { A: 'He stopped to smoke. (He paused another activity in order to smoke a cigarette)', B: 'He stopped smoking. (He quit the habit of smoking entirely)', C: 'Both sentences mean exactly the same thing', D: 'Neither sentence is grammatically correct' }, answer: ['B'], explanation: '"Stop + gerund" means to quit/cease an ongoing habit or action ("He stopped smoking" = he quit the habit); "stop + infinitive" means to pause one activity in order to do something else ("He stopped to smoke" = he paused to have a cigarette) — both A and B are grammatically valid but express different meanings, and B matches the description given.', domain: 'Gerunds vs infinitives con cambio de significado', difficulty: 'hard' },
      { type: 'multiple', question: 'Choose the sentence with correct inversion after a conditional-like structure: (Original: "If you should need any help, call me.")', options: { A: 'Should you need any help, call me.', B: 'Should need you any help, call me.', C: 'You should need any help, call me.', D: 'Need should you any help, call me.' }, answer: ['A'], explanation: 'In formal English, "if" can be omitted with certain conditional structures by inverting the subject and auxiliary: "Should you need any help, call me" is equivalent to "If you should need any help..."', domain: 'Inversion', difficulty: 'hard' },
      { type: 'multiple', question: 'Choose the correct mixed conditional describing a past action with an ongoing present consequence.', options: { A: 'If I hadn\'t missed the flight, I would be at the conference right now.', B: 'If I didn\'t miss the flight, I would be at the conference right now.', C: 'If I hadn\'t missed the flight, I would have been at the conference right now.', D: 'If I don\'t miss the flight, I would be at the conference right now.' }, answer: ['A'], explanation: 'This mixed conditional combines a past unreal condition with a present unreal result, using "if + past perfect, would + base verb": "If I hadn\'t missed the flight, I would be at the conference right now."', domain: 'Mixed conditionals', difficulty: 'hard' },
      { type: 'multiple', question: 'Choose the sentence with a correctly used participle clause replacing a relative clause. (Original: "The man who is standing by the door is my uncle.")', options: { A: 'The man standing by the door is my uncle.', B: 'The man stood by the door is my uncle.', C: 'The man to stand by the door is my uncle.', D: 'The man stand by the door is my uncle.' }, answer: ['A'], explanation: 'A present participle clause can replace an active relative clause ("who is standing") concisely: "The man standing by the door is my uncle."', domain: 'Participles y participle clauses', difficulty: 'medium' },
    ],
  },
  {
    slug: 'academic-vocabulary-advanced',
    title: 'Academic Vocabulary — Advanced',
    description: 'Practice questions on the Academic Word List (AWL), academic collocations, discourse markers and commonly confused words for C1/C2 level.',
    domain: 'english', category: 'vocabulary', level: 'advanced', language: 'en',
    tags: ['vocabulary', 'awl', 'academic'], passPercent: 70, timeMinutes: 20,
    source: 'Based on the Academic Word List (Coxhead, 2000) + Oxford Academic Vocabulary Practice C1-C2 (original content)',
    questions: [
      { type: 'multiple', question: 'Choose the word closest in meaning to "consequently" (a common Academic Word List term).', options: { A: 'Nevertheless', B: 'Therefore', C: 'However', D: 'Meanwhile' }, answer: ['B'], explanation: '"Consequently" means "as a result," making "therefore" its closest synonym among the options; the others express contrast or simultaneity, not causal result.', domain: 'Academic Word List (AWL)', difficulty: 'medium' },
      { type: 'multiple', question: 'Which word from the Academic Word List best completes: "The study aims to ____ the relationship between sleep and memory retention."', options: { A: 'investigate', B: 'chat about', C: 'wonder', D: 'guess' }, answer: ['A'], explanation: '"Investigate" is formal academic vocabulary appropriate for describing the purpose of a research study, unlike the informal alternatives.', domain: 'Academic Word List (AWL)', difficulty: 'easy' },
      { type: 'multiple', question: 'Choose the correct academic collocation: "The research ____ significant implications for public policy."', options: { A: 'does', B: 'has', C: 'makes', D: 'takes' }, answer: ['B'], explanation: '"Have implications" is the standard academic collocation, meaning to result in consequences or effects.', domain: 'Collocations académicas', difficulty: 'medium' },
      { type: 'multiple', question: 'Choose the correct academic collocation: "The findings ____ with previous research in the field."', options: { A: 'are consistent', B: 'do consistent', C: 'make consistent', D: 'take consistent' }, answer: ['A'], explanation: '"Be consistent with" is the correct academic collocation, meaning to align with or not contradict something else (in this case, previous research).', domain: 'Collocations académicas', difficulty: 'medium' },
      { type: 'multiple', question: 'Which discourse marker is appropriate to introduce a contrasting idea in academic writing?', options: { A: 'In addition', B: 'Nevertheless', C: 'Furthermore', D: 'Similarly' }, answer: ['B'], explanation: '"Nevertheless" introduces a contrasting or unexpected idea despite what was previously stated, unlike "in addition," "furthermore," and "similarly," which all signal addition or similarity rather than contrast.', domain: 'Transition words y discourse markers', difficulty: 'medium' },
      { type: 'multiple', question: 'Which discourse marker is appropriate to introduce a logical conclusion drawn from previous evidence?', options: { A: 'Thus', B: 'Meanwhile', C: 'Alternatively', D: 'Conversely' }, answer: ['A'], explanation: '"Thus" signals a logical conclusion or result following from what was previously stated, distinct from the other options which indicate time, alternatives, or contrast.', domain: 'Transition words y discourse markers', difficulty: 'medium' },
      { type: 'multiple', question: 'Which phrase is an example of "hedging language" often taught alongside academic vocabulary?', options: { A: 'It is absolutely certain that...', B: 'The evidence tends to suggest that...', C: 'There is no doubt whatsoever that...', D: 'It is a proven fact that...' }, answer: ['B'], explanation: '"The evidence tends to suggest that..." is a hedging phrase that presents a claim cautiously, characteristic of careful academic writing, unlike the absolute, unhedged claims in the other options.', domain: 'Hedging language', difficulty: 'medium' },
      { type: 'multiple', question: 'What does the academic prefix "inter-" typically mean, as in "interdisciplinary"?', options: { A: 'Within one single thing', B: 'Between or among two or more things', C: 'Before something happens', D: 'Against or opposed to something' }, answer: ['B'], explanation: 'The prefix "inter-" means "between" or "among," as in "interdisciplinary" (between/among multiple disciplines) or "international" (between nations).', domain: 'Prefijos y sufijos académicos', difficulty: 'easy' },
      { type: 'multiple', question: 'What does the academic suffix "-ology" typically indicate, as in "sociology" or "psychology"?', options: { A: 'A person who performs an action', B: 'The study or science of a particular subject', C: 'A negative quality', D: 'A small quantity of something' }, answer: ['B'], explanation: 'The suffix "-ology" denotes the study or science of a subject (e.g., "sociology" = the study of society, "psychology" = the study of the mind).', domain: 'Prefijos y sufijos académicos', difficulty: 'easy' },
      { type: 'multiple', question: 'Choose the more formal academic synonym for "a lot of" in the sentence: "There is ____ evidence supporting this theory."', options: { A: 'a lot of', B: 'substantial', C: 'loads of', D: 'tons of' }, answer: ['B'], explanation: '"Substantial" is a formal academic synonym for "a lot of," appropriate for scholarly writing, unlike the informal alternatives.', domain: 'Sinónimos formales vs informales', difficulty: 'medium' },
      { type: 'multiple', question: 'What is the difference between "affect" and "effect" in standard academic usage?', options: { A: 'They are always interchangeable with no difference in meaning', B: '"Affect" is typically used as a verb (to influence); "effect" is typically used as a noun (a result)', C: '"Effect" is always a verb; "affect" is always a noun', D: 'Neither word can be used in academic writing' }, answer: ['B'], explanation: 'In standard usage, "affect" functions as a verb meaning "to influence" (e.g., "smoking affects health"), while "effect" functions as a noun meaning "a result" (e.g., "the effect of smoking on health") — a commonly confused pair in academic writing.', domain: 'Palabras frecuentemente confundidas', difficulty: 'medium' },
      { type: 'multiple', question: 'What is the difference between "principle" and "principal" in academic writing?', options: { A: 'They are exact synonyms with identical meaning and use', B: '"Principle" refers to a fundamental rule or belief (noun); "principal" typically means "main/most important" (adjective) or refers to the head of a school (noun)', C: '"Principal" is always a verb', D: 'Neither word is used in formal writing' }, answer: ['B'], explanation: '"Principle" is a noun referring to a fundamental truth, rule, or belief (e.g., "a guiding principle"); "principal" is most commonly an adjective meaning "main" (e.g., "the principal cause") or a noun referring to a school\'s head — a classic pair of commonly confused academic words.', domain: 'Palabras frecuentemente confundidas', difficulty: 'medium' },
    ],
  },
  {
    slug: 'english-pronunciation-phonetics',
    title: 'English Pronunciation & Phonetics',
    description: 'Practice questions on the International Phonetic Alphabet, vowel and consonant sounds, stress patterns, intonation and connected speech.',
    domain: 'english', category: 'phonetics', level: 'intermediate', language: 'en',
    tags: ['pronunciation', 'phonetics', 'ipa'], passPercent: 65, timeMinutes: 20,
    source: 'Based on Peter Roach: "English Phonetics and Phonology" (4th Ed) + IPA Chart — internationalphoneticalphabet.org (original content)',
    questions: [
      { type: 'multiple', question: 'What does IPA (in this context) stand for?', options: { A: 'International Pronunciation Association', B: 'International Phonetic Alphabet', C: 'Internal Phonics Assessment', D: 'Institute of Phonetic Analysis' }, answer: ['B'], explanation: 'IPA stands for International Phonetic Alphabet, a standardized system of symbols used to represent the sounds of spoken language precisely, independent of spelling.', domain: 'Alfabeto fonético internacional (IPA)', difficulty: 'easy' },
      { type: 'multiple', question: 'What is a "diphthong" in English phonetics?', options: { A: 'A single, pure vowel sound that doesn\'t change quality', B: 'A vowel sound that glides from one vowel quality to another within the same syllable, such as the vowel sound in "price" /praɪs/', C: 'A type of consonant cluster', D: 'A silent letter in a word' }, answer: ['B'], explanation: 'A diphthong is a vowel sound involving a glide from one vowel quality to another within a single syllable (e.g., the /aɪ/ sound in "price"), as opposed to a monophthong (pure, unchanging vowel sound).', domain: 'Sonidos vocálicos (monoftongos, diptongos)', difficulty: 'medium' },
      { type: 'multiple', question: 'Which of the following is an example of a monophthong (pure vowel sound) in English?', options: { A: 'The /iː/ sound in "see"', B: 'The /aɪ/ sound in "time"', C: 'The /aʊ/ sound in "now"', D: 'The /ɔɪ/ sound in "boy"' }, answer: ['A'], explanation: 'The /iː/ sound in "see" is a monophthong — a single, steady vowel sound without a glide to another vowel quality, unlike the diphthongs in the other examples.', domain: 'Sonidos vocálicos (monoftongos, diptongos)', difficulty: 'medium' },
      { type: 'multiple', question: 'What type of consonant sound is /p/, /t/, and /k/, characterized by a complete blockage and sudden release of airflow?', options: { A: 'Fricatives', B: 'Plosives (or stops)', C: 'Affricates', D: 'Nasals' }, answer: ['B'], explanation: 'Plosives (or stops) like /p/, /t/, and /k/ are produced by completely blocking the airflow and then releasing it suddenly, creating a burst of sound — different from fricatives, which involve continuous friction.', domain: 'Sonidos consonánticos (oclusivas, fricativas, africadas)', difficulty: 'medium' },
      { type: 'multiple', question: 'What type of consonant sound is /f/ and /v/, characterized by continuous friction as air passes through a narrow gap?', options: { A: 'Plosives', B: 'Fricatives', C: 'Nasals', D: 'Approximants' }, answer: ['B'], explanation: 'Fricatives like /f/ and /v/ are produced by forcing air through a narrow constriction, creating continuous audible friction, unlike plosives, which involve a complete stop and sudden release.', domain: 'Sonidos consonánticos (oclusivas, fricativas, africadas)', difficulty: 'medium' },
      { type: 'multiple', question: 'The sound at the beginning of "church" /tʃ/ is an example of what type of consonant?', options: { A: 'A pure fricative', B: 'An affricate — a combination of a plosive followed immediately by a fricative in the same sound', C: 'A nasal', D: 'A pure vowel' }, answer: ['B'], explanation: 'The /tʃ/ sound in "church" is an affricate: it begins as a plosive (stop) /t/ and releases into a fricative /ʃ/, combining both articulation types into a single perceived sound.', domain: 'Sonidos consonánticos (oclusivas, fricativas, africadas)', difficulty: 'hard' },
      { type: 'multiple', question: 'In the word "photograph" (PHO-to-graph), where does the primary word stress fall?', options: { A: 'On the first syllable (PHO)', B: 'On the second syllable (to)', C: 'On the third syllable (graph)', D: 'English words never have stress patterns' }, answer: ['A'], explanation: '"Photograph" is stressed on the first syllable: PHO-to-graph. Note that related words shift stress (e.g., "phoTOGraphy" stresses the second syllable), illustrating how English stress patterns can change with word form.', domain: 'Word stress y patrones', difficulty: 'medium' },
      { type: 'multiple', question: 'What happens to word stress between "record" as a noun (a music record) and "record" as a verb (to record something)?', options: { A: 'Stress never changes between the noun and verb forms', B: 'The noun form stresses the first syllable (REcord), while the verb form stresses the second syllable (reCORD) — a common pattern for many English noun/verb pairs', C: 'Both forms are always stressed on the second syllable', D: 'Neither form has any stress at all' }, answer: ['B'], explanation: 'This is a classic example of English stress shifting between noun and verb forms of the same spelling: "REcord" (noun, first syllable stress) vs. "reCORD" (verb, second syllable stress) — a common pattern in many two-syllable English word pairs.', domain: 'Word stress y patrones', difficulty: 'medium' },
      { type: 'multiple', question: 'In the sentence "I didn\'t say she stole the money" (implying someone ELSE said it, not "I"), which word receives the primary sentence stress to convey this specific meaning?', options: { A: '"I"', B: '"say"', C: '"stole"', D: '"money"' }, answer: ['A'], explanation: 'Sentence stress can change meaning: stressing "I" implies someone else said it, not "I" — a demonstration of how shifting sentence stress alters the implied meaning of an otherwise identical sentence.', domain: 'Sentence stress y rhythm', difficulty: 'hard' },
      { type: 'multiple', question: 'What does "connected speech" refer to in English pronunciation, including features like linking, elision and assimilation?', options: { A: 'The way individual words change or blend together in natural, fluent speech, rather than being pronounced as isolated, separate units', B: 'A formal writing style', C: 'A type of vocabulary list', D: 'A grammar rule about sentence structure' }, answer: ['A'], explanation: 'Connected speech describes how words naturally blend, link, and change in fluent spoken English (through linking, elision — dropping sounds, and assimilation — sounds changing to match neighboring sounds), rather than each word being pronounced as a fully separate, isolated unit.', domain: 'Connected speech (linking, elision, assimilation)', difficulty: 'medium' },
      { type: 'multiple', question: 'What is "elision" in connected speech, as in the casual pronunciation of "next day" sounding like "nex(t) day"?', options: { A: 'Adding an extra sound between two words', B: 'The omission or dropping of a sound (often a consonant) in rapid, natural speech, especially in consonant clusters', C: 'Changing the meaning of a word entirely', D: 'Stressing every single syllable equally' }, answer: ['B'], explanation: 'Elision is the omission of a sound in connected, natural speech, commonly occurring with consonant clusters (e.g., the /t/ in "next day" is often dropped in fast speech: "nex(t) day"), making speech flow more smoothly.', domain: 'Connected speech (linking, elision, assimilation)', difficulty: 'hard' },
      { type: 'multiple', question: 'What is "assimilation" in connected speech, as in "handbag" often being pronounced with an /m/ sound instead of /n/?', options: { A: 'A sound completely disappearing with no trace', B: 'A sound changing to become more similar to (or match) a neighboring sound, due to ease of articulation in connected speech', C: 'Adding stress to every word in a sentence', D: 'A grammatical rule unrelated to pronunciation' }, answer: ['B'], explanation: 'Assimilation occurs when a sound changes to become more similar to an adjacent sound for ease of pronunciation — e.g., in "handbag," the /n/ often becomes /m/ before the bilabial /b/, matching its place of articulation.', domain: 'Connected speech (linking, elision, assimilation)', difficulty: 'hard' },
    ],
  },
];
