/**
 * useExam — Firestore branch coverage.
 *
 * The pure logic (buildDisplayQuestion, computeScore) is exercised by
 * useExam.pureLogic.test.js. This file complements it by covering the
 * data-fetching branches of `loadQuestions`:
 *
 *  1. ExamSet path: certification.isExamSet → reads examSets/{setId}/questions
 *  2. Standard path: !isExamSet → queries `questions` by category+level
 *  3. Empty result → sets a friendly error and finishes
 *  4. Domain filter applied → filters questions in-memory after fetch
 *
 * We mock firebase/firestore + the auth store; no emulator needed. We avoid
 * asserting full session/timer behavior (that's already covered indirectly)
 * and focus on the branch each test names.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';

// ── Firestore mock ───────────────────────────────────────────────────────────
const mockGetDocs = vi.fn();
const mockGetDoc = vi.fn(async () => ({ exists: () => false, data: () => ({}) }));
const collectionSpy = vi.fn((...args) => ({ __type: 'collection', args }));
const querySpy = vi.fn((...args) => ({ __type: 'query', args }));
const whereSpy = vi.fn((...args) => ({ __type: 'where', args }));
const docSpy = vi.fn((...args) => ({ __type: 'doc', args }));

vi.mock('firebase/firestore', () => ({
  collection: (...a) => collectionSpy(...a),
  query: (...a) => querySpy(...a),
  where: (...a) => whereSpy(...a),
  doc: (...a) => docSpy(...a),
  getDoc: (...a) => mockGetDoc(...a),
  getDocs: (...a) => mockGetDocs(...a),
}));

vi.mock('../../../../core/firebase/firebase', () => ({ db: {} }));

// Auth: no user → SRS/weak filters are skipped (those are tested separately).
vi.mock('../../../../core/store/useAuthStore', () => ({
  useAuthStore: () => ({ user: null }),
}));

// Stub mark-progress side-effect so it never runs network calls.
vi.mock('../../../progress/lib/markAttempt', () => ({
  markAttempt: vi.fn(async () => {}),
}));

import { useExam } from '../useExam';

function snap(items) {
  return { docs: items.map((it) => ({ id: it.id, data: () => it })) };
}

beforeEach(() => {
  mockGetDocs.mockReset();
  mockGetDoc.mockClear();
  collectionSpy.mockClear();
  querySpy.mockClear();
  whereSpy.mockClear();
  // Clear sessionStorage between tests so saved sessions don't leak.
  sessionStorage.clear();
});

describe('useExam — Firestore loadQuestions branches', () => {
  it('ExamSet path: reads examSets/{setId}/questions when isExamSet is true', async () => {
    mockGetDocs.mockResolvedValueOnce(
      snap([
        { id: 'q1', type: 'single', options: { A: '1', B: '2' }, answer: ['A'] },
        { id: 'q2', type: 'single', options: { A: '1', B: '2' }, answer: ['B'] },
      ])
    );

    const certification = {
      id: 'set-abc',
      isExamSet: true,
      setId: 'set-abc',
      timeMinutes: 30,
      questionCount: 2,
      passPercent: 60,
    };

    const { result } = renderHook(() => useExam(certification, 'exam'));

    await waitFor(() => expect(result.current.status).toBe('running'));
    expect(result.current.total).toBe(2);
    // Verify it hit the examSets/{setId}/questions sub-collection.
    expect(collectionSpy).toHaveBeenCalledWith({}, 'examSets', 'set-abc', 'questions');
    // No category/level where-clauses on the ExamSet path.
    expect(whereSpy).not.toHaveBeenCalled();
  });

  it('Standard path: queries `questions` by category+level when not isExamSet', async () => {
    mockGetDocs.mockResolvedValueOnce(
      snap([
        { id: 'q1', type: 'single', options: { A: '1', B: '2' }, answer: ['A'], category: 'appian', level: 'developer-senior' },
      ])
    );

    const certification = {
      id: 'developer-senior',
      isExamSet: false,
      category: 'appian',
      level: 'developer-senior',
      timeMinutes: 60,
      questionCount: 1,
      passPercent: 72,
    };

    const { result } = renderHook(() => useExam(certification, 'exam'));

    await waitFor(() => expect(result.current.status).toBe('running'));
    expect(collectionSpy).toHaveBeenCalledWith({}, 'questions');
    expect(whereSpy).toHaveBeenCalledWith('category', '==', 'appian');
    expect(whereSpy).toHaveBeenCalledWith('level', '==', 'developer-senior');
  });

  it('Empty result: surfaces a friendly error and finishes', async () => {
    mockGetDocs.mockResolvedValueOnce(snap([]));

    const certification = {
      id: 'set-empty',
      isExamSet: true,
      setId: 'set-empty',
      timeMinutes: 30,
      questionCount: 10,
      passPercent: 60,
    };

    const { result } = renderHook(() => useExam(certification, 'exam'));

    await waitFor(() => expect(result.current.status).toBe('finished'));
    expect(result.current.error).toMatch(/No hay preguntas/i);
    expect(result.current.total).toBe(0);
  });

  it('Domain filter: drops questions outside the selected domain', async () => {
    mockGetDocs.mockResolvedValueOnce(
      snap([
        { id: 'q1', type: 'single', options: { A: '1', B: '2' }, answer: ['A'], domain: 'Process Modeling' },
        { id: 'q2', type: 'single', options: { A: '1', B: '2' }, answer: ['A'], domain: 'Records' },
        { id: 'q3', type: 'single', options: { A: '1', B: '2' }, answer: ['B'], domain: 'process modeling' }, // case-insensitive
      ])
    );

    const certification = {
      id: 'set-domain',
      isExamSet: true,
      setId: 'set-domain',
      timeMinutes: 30,
      questionCount: 10,
      passPercent: 60,
    };

    // 4th arg is domainFilter; mode 'study' avoids timer side-effects.
    const { result } = renderHook(() =>
      useExam(certification, 'study', null, 'Process Modeling')
    );

    await waitFor(() => expect(result.current.status).toBe('running'));
    // q1 + q3 match (case-insensitive); q2 dropped.
    expect(result.current.total).toBe(2);
  });

  it('Domain filter: empty result for an unknown domain → friendly error', async () => {
    mockGetDocs.mockResolvedValueOnce(
      snap([
        { id: 'q1', type: 'single', options: { A: '1', B: '2' }, answer: ['A'], domain: 'Records' },
      ])
    );

    const certification = {
      id: 'set-domain',
      isExamSet: true,
      setId: 'set-domain',
      timeMinutes: 30,
      questionCount: 10,
      passPercent: 60,
    };

    const { result } = renderHook(() =>
      useExam(certification, 'study', null, 'Nonexistent Domain')
    );

    await waitFor(() => expect(result.current.status).toBe('finished'));
    expect(result.current.error).toMatch(/Nonexistent Domain/i);
  });
});
