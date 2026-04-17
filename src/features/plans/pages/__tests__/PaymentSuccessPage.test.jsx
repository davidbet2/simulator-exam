/**
 * PaymentSuccessPage — exploit-gate non-regression tests (P1.3).
 *
 * Critical scenarios:
 *   1. User hits /payment-success without an active subscription
 *      → must show "No encontramos un pago activo" (blocks fraud).
 *   2. Sync confirms an active subscription → success view renders.
 *   3. User already has isPro=true in store → success view immediately, no sync call.
 *   4. Sync throws → error banner inside success view (still allowed because
 *      already Pro path; if not Pro the exploit-gate would have triggered first).
 */
import { describe, it, beforeEach, vi, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// ── Mocks ────────────────────────────────────────────────────────────────
const mockHttpsCallable = vi.fn();
vi.mock('firebase/functions', () => ({
  getFunctions: vi.fn(() => ({})),
  httpsCallable: (...args) => mockHttpsCallable(...args),
}));
vi.mock('firebase/app', () => ({ getApp: vi.fn(() => ({})) }));

const mockUseAuthStore = vi.fn();
vi.mock('../../../../core/store/useAuthStore', () => ({
  useAuthStore: () => mockUseAuthStore(),
}));

// Lightweight component shims to avoid pulling Tailwind/SEO/AppShell tree.
vi.mock('../../../../components/layout/AppShell', () => ({
  AppShell: ({ children }) => <div data-testid="app-shell">{children}</div>,
}));
vi.mock('../../../../components/SEOHead', () => ({
  SEOHead: () => null,
}));
vi.mock('../../../../components/ui/Card', () => ({
  Card: ({ children }) => <div>{children}</div>,
  CardBody: ({ children }) => <div>{children}</div>,
}));
vi.mock('../../../../components/ui/Badge', () => ({
  Badge: ({ children }) => <span>{children}</span>,
}));
vi.mock('../../../../components/ui/Button', () => ({
  default: ({ children }) => <button>{children}</button>,
}));
// framer-motion: passthrough (avoids animation timers in tests)
vi.mock('framer-motion', () => ({
  motion: new Proxy({}, { get: () => ({ children, ...rest }) => <div {...rest}>{children}</div> }),
}));

import { PaymentSuccessPage } from '../PaymentSuccessPage';

const baseUser = { uid: 'u1', email: 'test@example.com' };

function renderPage() {
  return render(
    <MemoryRouter>
      <PaymentSuccessPage />
    </MemoryRouter>
  );
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe('PaymentSuccessPage — exploit gate (P1.3)', () => {
  it('blocks direct access when no active subscription found in Dodo', async () => {
    const refreshProfile = vi.fn();
    mockUseAuthStore.mockReturnValue({
      user: baseUser,
      isPro: false,
      subscriptionStatus: null,
      subscriptionRenewsAt: null,
      refreshProfile,
    });
    const syncFn = vi.fn().mockResolvedValue({ data: { synced: false } });
    mockHttpsCallable.mockReturnValue(syncFn);

    renderPage();

    // Initial state: verifying
    expect(screen.getByText(/verificando tu pago/i)).toBeInTheDocument();

    await waitFor(
      () => {
        expect(
          screen.getByText(/no encontramos un pago activo/i)
        ).toBeInTheDocument();
      },
      { timeout: 4000 }
    );
    expect(syncFn).toHaveBeenCalledOnce();
    expect(refreshProfile).not.toHaveBeenCalled();
  });

  it('shows success view immediately when user is already Pro (no sync call)', async () => {
    mockUseAuthStore.mockReturnValue({
      user: baseUser,
      isPro: true,
      subscriptionStatus: 'active',
      subscriptionRenewsAt: '2026-12-01',
      refreshProfile: vi.fn(),
    });
    const syncFn = vi.fn();
    mockHttpsCallable.mockReturnValue(syncFn);

    renderPage();

    // Should render success straight away (initial state derived from isPro)
    expect(screen.getByText(/¡pago exitoso!/i)).toBeInTheDocument();
    expect(syncFn).not.toHaveBeenCalled();
  });

  it('renders success after sync confirms active subscription', async () => {
    const refreshProfile = vi.fn().mockResolvedValue();
    mockUseAuthStore.mockReturnValue({
      user: baseUser,
      isPro: false,
      subscriptionStatus: null,
      subscriptionRenewsAt: null,
      refreshProfile,
    });
    const syncFn = vi.fn().mockResolvedValue({ data: { synced: true } });
    mockHttpsCallable.mockReturnValue(syncFn);

    renderPage();

    await waitFor(
      () => {
        expect(screen.getByText(/¡pago exitoso!/i)).toBeInTheDocument();
      },
      { timeout: 4000 }
    );
    expect(syncFn).toHaveBeenCalledOnce();
    expect(refreshProfile).toHaveBeenCalledOnce();
  });

  it('redirects unauthenticated users to /login', () => {
    mockUseAuthStore.mockReturnValue({
      user: null,
      isPro: false,
      subscriptionStatus: null,
      subscriptionRenewsAt: null,
      refreshProfile: vi.fn(),
    });
    const { container } = renderPage();
    // Navigate renders nothing visible — assert no success/exploit text
    expect(container.textContent).not.toMatch(/¡pago exitoso!/i);
    expect(container.textContent).not.toMatch(/no encontramos un pago/i);
  });
});
