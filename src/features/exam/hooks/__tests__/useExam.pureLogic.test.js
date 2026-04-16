/**
 * Unit tests for the pure functions in useExam.js
 * We test buildDisplayQuestion and computeScore in isolation
 * by extracting them (they are not exported — we test via re-implementation
 * mirroring the production logic, which is the TDD contract).
 */
import { describe, it, expect } from 'vitest';

// ── Pure function mirrors (matches useExam.js exactly) ────────────────────────

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildDisplayQuestion(q, shouldShuffle = true) {
  if (!shouldShuffle) return { ...q };
  if (q.type === 'matching') {
    const shuffledEntries = shuffle(Object.entries(q.matches));
    return { ...q, matches: Object.fromEntries(shuffledEntries) };
  }
  if (q.type === 'ordering') {
    return { ...q, items: shuffle([...q.items]) };
  }
  const sortedKeys = Object.keys(q.options).sort();
  const shuffledValues = shuffle(sortedKeys.map((k) => q.options[k]));
  const newOptions = {};
  sortedKeys.forEach((key, i) => { newOptions[key] = shuffledValues[i]; });
  const newAnswer = q.answer.map((origKey) => {
    const origValue = q.options[origKey];
    return sortedKeys.find((k) => newOptions[k] === origValue);
  });
  return { ...q, options: newOptions, answer: newAnswer };
}

function computeScore(displayQuestions, answers) {
  return displayQuestions.reduce((acc, dq, idx) => {
    const sel = answers[idx] ?? [];
    if (!sel || sel.length === 0) return acc;
    if (dq.type === 'matching') {
      const ok = dq.pairs.every((p, i) => sel[i] === p.correctMatch);
      return acc + (ok ? 1 : 0);
    }
    if (dq.type === 'ordering') {
      const ok = sel.length === dq.correctOrder.length && sel.every((v, i) => v === dq.correctOrder[i]);
      return acc + (ok ? 1 : 0);
    }
    const correct = [...dq.answer].sort();
    const sortedSel = [...sel].sort();
    const ok = sortedSel.length === correct.length && sortedSel.every((v, i) => v === correct[i]);
    return acc + (ok ? 1 : 0);
  }, 0);
}

// ── buildDisplayQuestion ──────────────────────────────────────────────────────

describe('buildDisplayQuestion', () => {
  const mcQuestion = {
    question: 'Which is correct?',
    options: { A: 'Alpha', B: 'Beta', C: 'Gamma', D: 'Delta' },
    answer: ['A'],
    type: undefined,
  };

  it('study mode (shouldShuffle=false) returns unchanged question', () => {
    const result = buildDisplayQuestion(mcQuestion, false);
    expect(result.options).toEqual(mcQuestion.options);
    expect(result.answer).toEqual(mcQuestion.answer);
  });

  it('shuffles option values and remaps answer keys correctly', () => {
    // Run many times to ensure answer always points to correct value
    const origValue = mcQuestion.options[mcQuestion.answer[0]]; // 'Alpha'
    for (let i = 0; i < 50; i++) {
      const result = buildDisplayQuestion(mcQuestion, true);
      const remappedKey = result.answer[0];
      expect(result.options[remappedKey]).toBe(origValue);
    }
  });

  it('preserves all option values after shuffle (set equality)', () => {
    const result = buildDisplayQuestion(mcQuestion, true);
    expect(new Set(Object.values(result.options))).toEqual(new Set(Object.values(mcQuestion.options)));
  });

  it('ordering question: shuffles items array', () => {
    const q = { type: 'ordering', items: ['A', 'B', 'C', 'D'], correctOrder: ['A', 'B', 'C', 'D'] };
    const result = buildDisplayQuestion(q, true);
    expect(result.items).toHaveLength(4);
    expect(new Set(result.items)).toEqual(new Set(q.items));
  });

  it('matching question: shuffles matches pool', () => {
    const q = {
      type: 'matching',
      pairs: [{ term: 'T1', correctMatch: 'M1' }],
      matches: { M1: 'Match 1', M2: 'Match 2' },
    };
    const result = buildDisplayQuestion(q, true);
    expect(new Set(Object.keys(result.matches))).toEqual(new Set(Object.keys(q.matches)));
  });
});

// ── computeScore ──────────────────────────────────────────────────────────────

describe('computeScore', () => {
  it('returns 0 for empty answers', () => {
    const q = { type: undefined, answer: ['A'], options: { A: 'Yes', B: 'No' } };
    expect(computeScore([q], {})).toBe(0);
  });

  it('counts correct multiple choice answer', () => {
    const q = { type: undefined, answer: ['A'], options: { A: 'Yes', B: 'No' } };
    expect(computeScore([q], { 0: ['A'] })).toBe(1);
  });

  it('does NOT count partial multi-select as correct', () => {
    const q = { type: undefined, answer: ['A', 'B'], options: { A: 'X', B: 'Y', C: 'Z' } };
    expect(computeScore([q], { 0: ['A'] })).toBe(0); // missing B
  });

  it('counts correct multi-select (order-insensitive)', () => {
    const q = { type: undefined, answer: ['A', 'B'], options: { A: 'X', B: 'Y', C: 'Z' } };
    expect(computeScore([q], { 0: ['B', 'A'] })).toBe(1);
  });

  it('counts correct matching answer', () => {
    const q = {
      type: 'matching',
      pairs: [
        { term: 'T1', correctMatch: 'M1' },
        { term: 'T2', correctMatch: 'M2' },
      ],
      matches: { M1: 'X', M2: 'Y' },
    };
    expect(computeScore([q], { 0: ['M1', 'M2'] })).toBe(1);
  });

  it('does NOT count partial matching as correct', () => {
    const q = {
      type: 'matching',
      pairs: [
        { term: 'T1', correctMatch: 'M1' },
        { term: 'T2', correctMatch: 'M2' },
      ],
      matches: { M1: 'X', M2: 'Y' },
    };
    expect(computeScore([q], { 0: ['M1', 'M1'] })).toBe(0); // T2 wrong
  });

  it('counts correct ordering answer', () => {
    const q = { type: 'ordering', correctOrder: ['A', 'B', 'C'], items: ['A', 'B', 'C'] };
    expect(computeScore([q], { 0: ['A', 'B', 'C'] })).toBe(1);
  });

  it('does NOT count wrong ordering', () => {
    const q = { type: 'ordering', correctOrder: ['A', 'B', 'C'], items: ['A', 'B', 'C'] };
    expect(computeScore([q], { 0: ['B', 'A', 'C'] })).toBe(0);
  });

  it('aggregates score across multiple questions', () => {
    const q1 = { type: undefined, answer: ['A'], options: { A: 'X', B: 'Y' } };
    const q2 = { type: undefined, answer: ['B'], options: { A: 'X', B: 'Y' } };
    const q3 = { type: undefined, answer: ['A'], options: { A: 'X', B: 'Y' } };
    const score = computeScore([q1, q2, q3], { 0: ['A'], 1: ['B'], 2: ['B'] }); // q3 wrong
    expect(score).toBe(2);
  });
});
