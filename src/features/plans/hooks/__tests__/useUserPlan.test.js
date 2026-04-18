/**
 * useUserPlan — unit tests for the free-user 3-exam monthly quota.
 *
 * Verifies:
 *   1. Free user with 0 attempts  → remaining: 3, canTakeExam: true
 *   2. Free user with 1 attempt   → remaining: 2, canTakeExam: true
 *   3. Free user with 2 attempts  → remaining: 1, canTakeExam: true  (upgrade CTA visible)
 *   4. Free user with 3 attempts  → remaining: 0, canTakeExam: false (quota exhausted)
 *   5. Free user with 4 attempts  → remaining: 0, canTakeExam: false (clamped, not negative)
 *   6. Pro user                   → remaining: Infinity, canTakeExam: true, skips Firestore
 *   7. No user (unauthenticated)  → isLoading settles false, no Firestore call
 *   8. Correct calendar-month filter applied in query (where createdAt >= start of month)
 *
 * All Firestore calls are mocked — no emulator needed.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';

// ── Mutable state for auth mock (modified per-test) ─────────────────────────
let mockUser = { uid: 'user-abc' };
let mockIsPro = false;

// ── Mock: firebase/firestore ──────────────────────────────────────────────
const mockGetCount = vi.fn();
const collectionSpy = vi.fn((...a) => ({ __type: 'collection', a }));
const querySpy      = vi.fn((...a) => ({ __type: 'query', a }));
const whereSpy      = vi.fn((...a) => ({ __type: 'where', a }));

vi.mock('firebase/firestore', () => ({
  collection:          (...a) => collectionSpy(...a),
  query:               (...a) => querySpy(...a),
  where:               (...a) => whereSpy(...a),
  getCountFromServer:  (...a) => mockGetCount(...a),
  Timestamp:           { fromDate: vi.fn((d) => ({ _seconds: Math.floor(d.getTime() / 1000) })) },
}));

// ── Mock: Firebase db instance ────────────────────────────────────────────
vi.mock('../../../../core/firebase/firebase', () => ({ db: {} }));

// ── Mock: useAuthStore ────────────────────────────────────────────────────
vi.mock('../../../../core/store/useAuthStore', () => ({
  useAuthStore: () => ({ user: mockUser, isPro: mockIsPro }),
}));

import { useUserPlan } from '../useUserPlan';

// ── Helpers ───────────────────────────────────────────────────────────────
function makeCountSnap(count) {
  return { data: () => ({ count }) };
}

beforeEach(() => {
  vi.clearAllMocks();
  // Default: free user with 0 attempts this month
  mockUser  = { uid: 'user-abc' };
  mockIsPro = false;
  mockGetCount.mockResolvedValue(makeCountSnap(0));
});

// ── Tests ─────────────────────────────────────────────────────────────────

describe('useUserPlan — free user quota (FREE_LIMIT = 3)', () => {
  it('0 attempts → remaining 3, canTakeExam true', async () => {
    mockGetCount.mockResolvedValue(makeCountSnap(0));
    const { result } = renderHook(() => useUserPlan());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.usedThisMonth).toBe(0);
    expect(result.current.remaining).toBe(3);
    expect(result.current.canTakeExam).toBe(true);
    expect(result.current.isPro).toBe(false);
  });

  it('1 attempt → remaining 2, canTakeExam true', async () => {
    mockGetCount.mockResolvedValue(makeCountSnap(1));
    const { result } = renderHook(() => useUserPlan());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.usedThisMonth).toBe(1);
    expect(result.current.remaining).toBe(2);
    expect(result.current.canTakeExam).toBe(true);
  });

  it('2 attempts → remaining 1, canTakeExam true (upgrade CTA threshold)', async () => {
    mockGetCount.mockResolvedValue(makeCountSnap(2));
    const { result } = renderHook(() => useUserPlan());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.usedThisMonth).toBe(2);
    expect(result.current.remaining).toBe(1);
    expect(result.current.canTakeExam).toBe(true);
  });

  it('3 attempts → remaining 0, canTakeExam false (quota exhausted)', async () => {
    mockGetCount.mockResolvedValue(makeCountSnap(3));
    const { result } = renderHook(() => useUserPlan());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.usedThisMonth).toBe(3);
    expect(result.current.remaining).toBe(0);
    expect(result.current.canTakeExam).toBe(false);
  });

  it('4 attempts → remaining clamped to 0 (never negative), canTakeExam false', async () => {
    // Edge case: data inconsistency shouldn't produce negative remaining
    mockGetCount.mockResolvedValue(makeCountSnap(4));
    const { result } = renderHook(() => useUserPlan());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.remaining).toBe(0);
    expect(result.current.canTakeExam).toBe(false);
  });
});

describe('useUserPlan — pro user (unlimited)', () => {
  it('pro user → remaining Infinity, canTakeExam true, skips Firestore', async () => {
    mockIsPro = true;
    const { result } = renderHook(() => useUserPlan());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.isPro).toBe(true);
    expect(result.current.remaining).toBe(Infinity);
    expect(result.current.canTakeExam).toBe(true);
    // Pro users bypass the Firestore count query
    expect(mockGetCount).not.toHaveBeenCalled();
  });
});

describe('useUserPlan — unauthenticated (no user)', () => {
  it('no user → isLoading settles to false, Firestore NOT called', async () => {
    mockUser = null;
    const { result } = renderHook(() => useUserPlan());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(mockGetCount).not.toHaveBeenCalled();
  });
});

describe('useUserPlan — Firestore query shape (correct month filter)', () => {
  it('queries attempts collection filtered by uid and start-of-month createdAt', async () => {
    mockGetCount.mockResolvedValue(makeCountSnap(1));
    const { result } = renderHook(() => useUserPlan());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    // collection('attempts') was called
    expect(collectionSpy).toHaveBeenCalledWith(
      expect.anything(), // db
      'attempts'
    );

    // where('uid', '==', user.uid) filter applied
    const whereUidCall = whereSpy.mock.calls.find(
      (c) => c[0] === 'uid' && c[1] === '==' && c[2] === mockUser.uid
    );
    expect(whereUidCall).toBeDefined();

    // where('createdAt', '>=', <start of month>) filter applied
    const whereDateCall = whereSpy.mock.calls.find(
      (c) => c[0] === 'createdAt' && c[1] === '>='
    );
    expect(whereDateCall).toBeDefined();

    // getCountFromServer was called (aggregate query, not getDocs)
    expect(mockGetCount).toHaveBeenCalledOnce();
  });
});
