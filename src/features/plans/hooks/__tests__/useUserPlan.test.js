/**
 * useUserPlan — unit tests.
 *
 * Free plan no longer carries a monthly exam quota: only Práctica Rápida
 * (mode=quick) is available for free users. This hook is now a thin,
 * read-only projection of useAuthStore's { isPro, isLoading }.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook } from '@testing-library/react';

let mockIsPro = false;
let mockIsLoading = false;

vi.mock('../../../../core/store/useAuthStore', () => ({
  useAuthStore: () => ({ isPro: mockIsPro, isLoading: mockIsLoading }),
}));

import { useUserPlan } from '../useUserPlan';

beforeEach(() => {
  vi.clearAllMocks();
  mockIsPro = false;
  mockIsLoading = false;
});

describe('useUserPlan', () => {
  it('free user → isPro false', () => {
    const { result } = renderHook(() => useUserPlan());
    expect(result.current.isPro).toBe(false);
    expect(result.current.isLoading).toBe(false);
  });

  it('pro user → isPro true', () => {
    mockIsPro = true;
    const { result } = renderHook(() => useUserPlan());
    expect(result.current.isPro).toBe(true);
  });

  it('reflects auth store loading state', () => {
    mockIsLoading = true;
    const { result } = renderHook(() => useUserPlan());
    expect(result.current.isLoading).toBe(true);
  });
});
