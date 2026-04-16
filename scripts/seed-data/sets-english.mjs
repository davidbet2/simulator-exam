/**
 * Official English exam sets (CEFR-based).
 *
 * Sources:
 *   - CEFR Global Scale descriptors (Council of Europe, public)
 *   - Original questions written to match CEFR level expectations
 */

export const ENGLISH_SETS = [
  {
    slug: 'english-a2-elementary',
    title: 'English A2 — Elementary',
    description:
      'Basic grammar and vocabulary for elementary learners (CEFR A2). Present tenses, prepositions, common daily situations.',
    domain: 'english',
    category: 'cefr-a2',
    level: 'beginner',
    language: 'en',
    tags: ['english', 'cefr', 'a2', 'elementary'],
    passPercent: 65,
    timeMinutes: 20,
    source: 'Based on CEFR A2 descriptors (Council of Europe, public document)',
    questions: [
      {
        type: 'multiple',
        question: 'She ____ to work by bus every day.',
        options: { A: 'go', B: 'goes', C: 'going', D: 'gone' },
        answer: ['B'],
        explanation: 'Third person singular in present simple: verb + s/es.',
        domain: 'Present Simple',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question: 'Where ____ you ____ yesterday?',
        options: {
          A: 'did / go',
          B: 'do / go',
          C: 'are / going',
          D: 'have / gone',
        },
        answer: ['A'],
        explanation: 'Past simple question: did + subject + base verb.',
        domain: 'Past Simple',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question: 'Choose the correct preposition: "The book is ____ the table."',
        options: { A: 'in', B: 'on', C: 'at', D: 'by' },
        answer: ['B'],
        explanation: '"On" is used for surfaces.',
        domain: 'Prepositions',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question: 'What is the plural of "child"?',
        options: { A: 'childs', B: 'childes', C: 'children', D: 'childern' },
        answer: ['C'],
        explanation: '"Children" is an irregular plural.',
        domain: 'Vocabulary',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question: '____ any milk in the fridge?',
        options: {
          A: 'Is there',
          B: 'Are there',
          C: 'Have there',
          D: 'Has there',
        },
        answer: ['A'],
        explanation:
          '"Milk" is uncountable, so we use singular "Is there" + any.',
        domain: 'There is / There are',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question:
          'Choose the correct question: You want to know the price of a shirt.',
        options: {
          A: 'How many does this shirt?',
          B: 'How much is this shirt?',
          C: 'What\'s money of this shirt?',
          D: 'How cost this shirt?',
        },
        answer: ['B'],
        explanation: '"How much" is used for price/uncountables.',
        domain: 'Questions',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question: 'Which sentence is CORRECT?',
        options: {
          A: 'I have 25 years.',
          B: 'I am 25 years.',
          C: 'I am 25 years old.',
          D: 'I have 25 years old.',
        },
        answer: ['C'],
        explanation: 'Age in English uses "to be" + number + years old.',
        domain: 'Common Mistakes',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question: 'He doesn\'t like coffee, ____ he?',
        options: { A: 'don\'t', B: 'doesn\'t', C: 'does', D: 'is' },
        answer: ['C'],
        explanation:
          'Negative statement → positive tag question: "does he?"',
        domain: 'Question Tags',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question: 'Select TWO sentences that use "can" correctly.',
        options: {
          A: 'I can swim.',
          B: 'She cans speak French.',
          C: 'He can to drive.',
          D: 'Can you help me?',
        },
        answer: ['A', 'D'],
        explanation:
          '"Can" is a modal verb: no -s in third person and no "to" after it.',
        domain: 'Modal Verbs',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question: 'What time is it? "It\'s a quarter past seven" means:',
        options: { A: '6:45', B: '7:15', C: '7:30', D: '7:45' },
        answer: ['B'],
        explanation: '"A quarter past seven" = 15 minutes past 7 = 7:15.',
        domain: 'Time',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question: 'Choose the correct form: "If it ____ tomorrow, we\'ll stay home."',
        options: { A: 'rains', B: 'will rain', C: 'rained', D: 'is raining' },
        answer: ['A'],
        explanation:
          'First conditional: if + present simple, will + base verb.',
        domain: 'Conditionals',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question: 'The opposite of "expensive" is:',
        options: { A: 'cheap', B: 'free', C: 'good', D: 'new' },
        answer: ['A'],
        explanation: '"Cheap" = low price. "Free" = no cost.',
        domain: 'Vocabulary',
        difficulty: 'easy',
      },
    ],
  },

  {
    slug: 'english-b1-intermediate',
    title: 'English B1 — Intermediate',
    description:
      'Intermediate grammar: present perfect, reported speech, conditionals, phrasal verbs. Based on CEFR B1 descriptors.',
    domain: 'english',
    category: 'cefr-b1',
    level: 'intermediate',
    language: 'en',
    tags: ['english', 'cefr', 'b1', 'intermediate'],
    passPercent: 70,
    timeMinutes: 25,
    source: 'Based on CEFR B1 descriptors (Council of Europe, public document)',
    questions: [
      {
        type: 'multiple',
        question: 'I ____ in this city since 2015.',
        options: {
          A: 'live',
          B: 'am living',
          C: 'have lived',
          D: 'lived',
        },
        answer: ['C'],
        explanation:
          'Present perfect with "since" + point in time for an action continuing to the present.',
        domain: 'Present Perfect',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          'Which sentence correctly reports: He said, "I will call you tomorrow."',
        options: {
          A: 'He said he will call me tomorrow.',
          B: 'He said he would call me the next day.',
          C: 'He said he calls me tomorrow.',
          D: 'He told that he will call me.',
        },
        answer: ['B'],
        explanation:
          'Reported speech: will → would; tomorrow → the next day.',
        domain: 'Reported Speech',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question: 'If I ____ you, I wouldn\'t do that.',
        options: { A: 'am', B: 'were', C: 'be', D: 'will be' },
        answer: ['B'],
        explanation: 'Second conditional: "if I were" (subjunctive).',
        domain: 'Conditionals',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question: 'The meeting was ____ off because the boss was sick.',
        options: { A: 'put', B: 'taken', C: 'got', D: 'run' },
        answer: ['A'],
        explanation: '"Put off" = postpone.',
        domain: 'Phrasal Verbs',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question: 'She has been working here ____ ten years.',
        options: { A: 'since', B: 'for', C: 'from', D: 'ago' },
        answer: ['B'],
        explanation: '"For" + duration. "Since" + starting point.',
        domain: 'Time Expressions',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question:
          'Choose the passive voice of: "They built the bridge in 1900."',
        options: {
          A: 'The bridge was built in 1900.',
          B: 'The bridge is built in 1900.',
          C: 'The bridge has been built in 1900.',
          D: 'The bridge built in 1900.',
        },
        answer: ['A'],
        explanation: 'Past simple passive: was/were + past participle.',
        domain: 'Passive Voice',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          'Select TWO correct uses of "used to".',
        options: {
          A: 'I used to smoke, but I quit.',
          B: 'I am used to drink coffee every morning.',
          C: 'She used to live in Paris.',
          D: 'He used to goes there.',
        },
        answer: ['A', 'C'],
        explanation:
          '"Used to + base verb" = past habit. "Be used to + -ing" means "accustomed to".',
        domain: 'Used to',
        difficulty: 'hard',
      },
      {
        type: 'multiple',
        question: '"I wish I ____ more money."',
        options: { A: 'have', B: 'had', C: 'will have', D: 'would have' },
        answer: ['B'],
        explanation:
          '"Wish" + past simple expresses a present unreal desire.',
        domain: 'Wish',
        difficulty: 'hard',
      },
      {
        type: 'multiple',
        question: 'The book ____ I bought yesterday is interesting.',
        options: { A: 'who', B: 'which', C: 'what', D: 'where' },
        answer: ['B'],
        explanation: '"Which/that" for things. "Who" for people.',
        domain: 'Relative Clauses',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          'Which word best completes: "The movie was ____. I almost fell asleep."',
        options: {
          A: 'boring',
          B: 'bored',
          C: 'bore',
          D: 'boringly',
        },
        answer: ['A'],
        explanation:
          '-ing adjective describes the thing/cause. -ed adjective describes how someone feels.',
        domain: 'Adjectives',
        difficulty: 'medium',
      },
    ],
  },
];
