/**
 * ResultsPage — attempt-save rules (free-user quota correctness).
 *
 * The `attempts` Firestore collection is the source-of-truth for the monthly
 * counter in useUserPlan. Incorrect saves inflate or deflate the quota.
 *
 * Rules under test (from ResultsPage source):
 *   SAVE conditions (attempt IS written to Firestore):
 *     1. mode='exam'  + logged-in user + non-demo cert
 *     2. mode='quick' + logged-in user + non-demo cert (any mode that isn't excluded)
 *
 *   NO-SAVE conditions (attempt is NOT written):
 *     3. mode='study'  — study mode never counted
 *     4. mode='weak'   — targeted practice never counted
 *     5. mode='srs'    — spaced repetition never counted
 *     6. mode='wager'  — confidence wager never counted
 *     7. certId='demo' — demo exam never counted (even in exam mode)
 *     8. user=null     — unauthenticated, nothing to save
 *
 * Strategy: mock useLocation to inject state, mock addDoc to spy on calls,
 * mock useNavigate + confetti + heavy UI to keep render minimal.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// ── Lingui stubs ─────────────────────────────────────────────────────────────
const linguiT = (s) =>
  typeof s === 'string' ? s : (s?.message ?? s?.id ?? s?.toString?.() ?? '');

vi.mock('@lingui/react/macro', () => ({
  Trans: ({ children, message, id }) => <>{children ?? message ?? id}</>,
  useLingui: () => ({ t: linguiT, _: linguiT, i18n: { _: linguiT } }),
  Plural: ({ value, one, other }) => <>{value === 1 ? one : other}</>,
}));
vi.mock('@lingui/react', () => ({
  Trans: ({ children, message, id }) => <>{children ?? message ?? id}</>,
  useLingui: () => ({ t: linguiT, _: linguiT, i18n: { _: linguiT } }),
  I18nProvider: ({ children }) => <>{children}</>,
}));

// ── Firebase spies ─────────────────────────────────────────────────────────
const mockAddDoc = vi.fn(async () => ({ id: 'attempt-1' }));
vi.mock('firebase/firestore', () => ({
  collection: vi.fn(() => ({})),
  addDoc: (...a) => mockAddDoc(...a),
  serverTimestamp: vi.fn(() => 'ts'),
}));
vi.mock('../../../core/firebase/firebase', () => ({ db: {} }));

// ── Auth store ────────────────────────────────────────────────────────────────
let mockUser = { uid: 'user-free' };
vi.mock('../../../core/store/useAuthStore', () => ({
  useAuthStore: () => ({ user: mockUser }),
}));

// ── React Router (location state injection) ─────────────────────────────────
let mockLocationState = null;
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({ state: mockLocationState }),
  };
});

// ── Heavy deps stub ──────────────────────────────────────────────────────────
vi.mock('canvas-confetti', () => ({ default: vi.fn() }));
vi.mock('../../../components/SEOHead', () => ({ SEOHead: () => null }));
vi.mock('../../../components/ui/ShareButton', () => ({ ShareButton: () => null }));
vi.mock('../../ads/components/AdBanner', () => ({ AdBanner: () => null }));
vi.mock('framer-motion', () => ({
  motion: new Proxy({}, { get: () => ({ children, ...rest }) => <div {...rest}>{children}</div> }),
  AnimatePresence: ({ children }) => <>{children}</>,
}));

import { ResultsPage } from '../ResultsPage';

// ── Helpers ───────────────────────────────────────────────────────────────────
function makeState(overrides = {}) {
  return {
    score: 7,
    total: 10,
    passPercent: 70,
    certId: 'cert-appian',
    certLabel: 'Appian Developer',
    mode: 'exam',
    displayQuestions: [],
    answers: [],
    isTimeOut: false,
    ...overrides,
  };
}

function renderResults() {
  return render(<MemoryRouter><ResultsPage /></MemoryRouter>);
}

beforeEach(() => {
  vi.clearAllMocks();
  mockUser = { uid: 'user-free' };
  mockLocationState = makeState();
  mockNavigate.mockClear();
});

// ── Tests: attempt IS saved ────────────────────────────────────────────────

describe('ResultsPage — attempt saved (counts against quota)', () => {
  it('saves attempt for mode=exam with a real cert', async () => {
    mockLocationState = makeState({ mode: 'exam' });
    renderResults();
    await waitFor(() => expect(mockAddDoc).toHaveBeenCalledOnce());
    const saved = mockAddDoc.mock.calls[0][1];
    expect(saved.uid).toBe('user-free');
    expect(saved.mode).toBe('exam');
    expect(saved.certId).toBe('cert-appian');
    expect(saved.score).toBe(7);
    expect(saved.total).toBe(10);
  });

  it('saves attempt for mode=quick (non-excluded mode, non-demo)', async () => {
    mockLocationState = makeState({ mode: 'quick' });
    renderResults();
    await waitFor(() => expect(mockAddDoc).toHaveBeenCalledOnce());
  });
});

// ── Tests: attempt NOT saved ───────────────────────────────────────────────

describe('ResultsPage — attempt NOT saved (quota unaffected)', () => {
  it('does NOT save for mode=study', async () => {
    mockLocationState = makeState({ mode: 'study' });
    renderResults();
    // Small tick to allow any async to settle
    await new Promise((r) => setTimeout(r, 50));
    expect(mockAddDoc).not.toHaveBeenCalled();
  });

  it('does NOT save for mode=weak', async () => {
    mockLocationState = makeState({ mode: 'weak' });
    renderResults();
    await new Promise((r) => setTimeout(r, 50));
    expect(mockAddDoc).not.toHaveBeenCalled();
  });

  it('does NOT save for mode=srs', async () => {
    mockLocationState = makeState({ mode: 'srs' });
    renderResults();
    await new Promise((r) => setTimeout(r, 50));
    expect(mockAddDoc).not.toHaveBeenCalled();
  });

  it('does NOT save for mode=wager', async () => {
    mockLocationState = makeState({ mode: 'wager' });
    renderResults();
    await new Promise((r) => setTimeout(r, 50));
    expect(mockAddDoc).not.toHaveBeenCalled();
  });

  it('does NOT save for certId=demo (demo exam mode)', async () => {
    mockLocationState = makeState({ mode: 'exam', certId: 'demo' });
    renderResults();
    await new Promise((r) => setTimeout(r, 50));
    expect(mockAddDoc).not.toHaveBeenCalled();
  });

  it('does NOT save when user is not logged in', async () => {
    mockUser = null;
    mockLocationState = makeState({ mode: 'exam' });
    renderResults();
    await new Promise((r) => setTimeout(r, 50));
    expect(mockAddDoc).not.toHaveBeenCalled();
  });

  it('saves only once (idempotent — savedRef guard prevents double-save)', async () => {
    mockLocationState = makeState({ mode: 'exam' });
    renderResults();
    await waitFor(() => expect(mockAddDoc).toHaveBeenCalledOnce());
    // Allow time for any second-call to be made
    await new Promise((r) => setTimeout(r, 100));
    expect(mockAddDoc).toHaveBeenCalledOnce();
  });
});
