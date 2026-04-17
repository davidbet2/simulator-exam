/**
 * ProfilePage — billing flow tests (cancel + reactivate renewal).
 *
 * Strategy:
 *  - Mock Firebase Functions httpsCallable so we never hit the network.
 *  - Mock the auth store to project a Pro user with an active dodo subscription.
 *  - Mock heavy/peripheral components (AppShell, SEOHead, framer-motion) to keep
 *    the render small and independent from layout side-effects.
 *  - Drive the 2-step cancel UX (button → confirm → "Sí, cancelar") and the
 *    one-step reactivate.
 *
 * What we deliberately do NOT test here:
 *  - The whole profile UI (history, achievements, edit name) — those have their
 *    own concerns and would couple this test to layout churn. We focus on the
 *    business-critical billing handlers (`handleCancelRenewal`,
 *    `handleReactivateRenewal`) where a regression silently breaks revenue.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// ── Mocks ────────────────────────────────────────────────────────────────────
const mockCallable = vi.fn();
vi.mock('firebase/functions', () => ({
  getFunctions: vi.fn(() => ({})),
  httpsCallable: vi.fn(() => mockCallable),
}));

vi.mock('firebase/app', () => ({
  getApp: vi.fn(() => ({})),
}));

vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  orderBy: vi.fn(),
  // No attempts → empty history; keeps render light.
  getDocs: vi.fn(async () => ({ docs: [] })),
}));

vi.mock('../../../../core/firebase/firebase', () => ({ db: {} }));

const baseAuthState = {
  user: { uid: 'u-1', email: 'pro@test.com' },
  displayName: 'Pro User',
  logout: vi.fn(),
  isPro: true,
  isAdmin: false,
  updateDisplayName: vi.fn(async () => {}),
  subscriptionStatus: 'active',
  subscriptionRenewsAt: '2026-12-01',
  subscriptionStartedAt: '2026-04-01',
  dodoSubscriptionId: 'sub_test_123',
};
let authState = { ...baseAuthState };
vi.mock('../../../../core/store/useAuthStore', () => ({
  useAuthStore: (selector) => (selector ? selector(authState) : authState),
}));

// Light-weight stand-ins so we don't pull in app shell + seo concerns.
vi.mock('../../../../components/layout/AppShell', () => ({
  AppShell: ({ children }) => <div data-testid="app-shell">{children}</div>,
}));
vi.mock('../../../../components/SEOHead', () => ({
  SEOHead: () => null,
}));
vi.mock('../../../../components/ui/Badge', () => ({
  Badge: ({ children }) => <span>{children}</span>,
}));
vi.mock('framer-motion', () => ({
  motion: new Proxy({}, { get: () => (props) => <div {...props} /> }),
  AnimatePresence: ({ children }) => <>{children}</>,
}));

// Lingui macros are expanded by the babel plugin (see vitest.config.js) into
// runtime calls against `@lingui/react`. The macro output destructures `_`
// from useLingui (e.g. `const { _: _t } = useLingui()`) and invokes it as
// `_t({ id, message, values })`. Our stub mirrors that contract.
const linguiT = (strsOrDescriptor, ...values) => {
  if (typeof strsOrDescriptor === 'object' && strsOrDescriptor && 'message' in strsOrDescriptor) {
    return strsOrDescriptor.message ?? strsOrDescriptor.id ?? '';
  }
  if (Array.isArray(strsOrDescriptor)) {
    return strsOrDescriptor.reduce(
      (acc, s, i) => acc + s + (i < values.length ? String(values[i]) : ''),
      ''
    );
  }
  return String(strsOrDescriptor ?? '');
};
vi.mock('@lingui/react/macro', () => ({
  Trans: ({ children }) => <>{children}</>,
  useLingui: () => ({ t: linguiT, _: linguiT, i18n: { _: linguiT } }),
}));
vi.mock('@lingui/react', () => ({
  Trans: ({ children, id, message }) => <>{children ?? message ?? id}</>,
  useLingui: () => ({ t: linguiT, _: linguiT, i18n: { _: linguiT } }),
  I18nProvider: ({ children }) => <>{children}</>,
}));

import { ProfilePage } from '../ProfilePage';

function renderProfile() {
  return render(
    <MemoryRouter>
      <ProfilePage />
    </MemoryRouter>
  );
}

beforeEach(() => {
  authState = { ...baseAuthState };
  mockCallable.mockReset();
});

// Helpers — find a button by a regex against its (normalized) textContent.
// We avoid getByRole({ name }) because lucide SVG children + leading
// whitespace can throw off accessible-name calculation in jsdom.
async function findButtonByText(re) {
  // Wait for the page to settle (initial effect runs setLoading(false)).
  await waitFor(() => expect(screen.getByTestId('app-shell')).toBeInTheDocument());
  const buttons = screen.queryAllByRole('button');
  const match = buttons.find((b) => re.test((b.textContent ?? '').trim()));
  if (!match) {
    throw new Error(
      `No button matched ${re}. Available: ${JSON.stringify(buttons.map((b) => (b.textContent ?? '').trim()))}`
    );
  }
  return match;
}

describe('ProfilePage — cancel renewal flow', () => {
  it('requires explicit confirmation before calling the cancel function (2-step UX)', async () => {
    renderProfile();
    const trigger = await findButtonByText(/^Cancelar renovaci/i);
    fireEvent.click(trigger);
    expect(mockCallable).not.toHaveBeenCalled();
    const confirm = await findButtonByText(/cancelar/i);
    expect(confirm).toBeInTheDocument();
  });

  it('calls cancelDodoSubscription with the user subscription id and shows success', async () => {
    mockCallable.mockResolvedValueOnce({ data: { ok: true } });
    renderProfile();

    fireEvent.click(await findButtonByText(/^Cancelar renovaci/i));
    // After expanding, the "Sí, cancelar" button is the one whose text starts with S.
    fireEvent.click(await findButtonByText(/^S.{1,2},?\s*cancelar/i));

    await waitFor(() => expect(mockCallable).toHaveBeenCalledTimes(1));
    expect(mockCallable).toHaveBeenCalledWith({ subscriptionId: 'sub_test_123' });
    expect(await screen.findByText(/Renovaci.+cancelada/i)).toBeInTheDocument();
  });

  it('surfaces the error message when the cancel call rejects', async () => {
    mockCallable.mockRejectedValueOnce(new Error('boom-cancel'));
    renderProfile();

    fireEvent.click(await findButtonByText(/^Cancelar renovaci/i));
    fireEvent.click(await findButtonByText(/^S.{1,2},?\s*cancelar/i));

    expect(await screen.findByText(/boom-cancel/)).toBeInTheDocument();
    expect(screen.queryByText(/Renovaci.+cancelada/i)).not.toBeInTheDocument();
  });
});

describe('ProfilePage — reactivate renewal flow', () => {
  it('shows reactivate button when subscription is in cancelled state', async () => {
    authState = { ...baseAuthState, subscriptionStatus: 'cancelled' };
    renderProfile();
    expect(await findButtonByText(/Reactivar renovaci/i)).toBeInTheDocument();
  });

  it('calls reactivateDodoSubscription and shows success on click', async () => {
    authState = { ...baseAuthState, subscriptionStatus: 'cancelled' };
    mockCallable.mockResolvedValueOnce({ data: { ok: true } });
    renderProfile();

    fireEvent.click(await findButtonByText(/Reactivar renovaci/i));

    await waitFor(() => expect(mockCallable).toHaveBeenCalledTimes(1));
    expect(mockCallable).toHaveBeenCalledWith({ subscriptionId: 'sub_test_123' });
    expect(await screen.findByText(/Renovaci.+reactivada/i)).toBeInTheDocument();
  });

  it('surfaces the error message when reactivate call rejects', async () => {
    authState = { ...baseAuthState, subscriptionStatus: 'cancelled' };
    mockCallable.mockRejectedValueOnce(new Error('boom-reactivate'));
    renderProfile();

    fireEvent.click(await findButtonByText(/Reactivar renovaci/i));

    expect(await screen.findByText(/boom-reactivate/)).toBeInTheDocument();
  });
});

describe('ProfilePage — guards', () => {
  it('does NOT render cancel section when user has no dodoSubscriptionId', async () => {
    authState = { ...baseAuthState, dodoSubscriptionId: null };
    renderProfile();
    await waitFor(() => expect(screen.getByTestId('app-shell')).toBeInTheDocument());
    const buttons = screen.queryAllByRole('button');
    expect(buttons.some((b) => /Cancelar renovaci/i.test(b.textContent ?? ''))).toBe(false);
  });

  it('does NOT render cancel section for free users', async () => {
    authState = { ...baseAuthState, isPro: false };
    renderProfile();
    await waitFor(() => expect(screen.getByTestId('app-shell')).toBeInTheDocument());
    const buttons = screen.queryAllByRole('button');
    expect(buttons.some((b) => /Cancelar renovaci/i.test(b.textContent ?? ''))).toBe(false);
  });
});
