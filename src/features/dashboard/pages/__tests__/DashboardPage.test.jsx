/**
 * DashboardPage — free-user UI conditions.
 *
 * Free-specific requirements verified:
 *   1. Shows `plan` value "free" in the caption text
 *   2. Shows "Actualizar a Pro" upgrade link to /pricing (only for free users)
 *   3. Does NOT show upgrade link for Pro users
 *   4. AdBanner is rendered for free users (via AdBanner unit tests, but here
 *      we confirm the Dashboard itself mounts AdBanner for free users)
 *
 * We mock AppShell, AdBanner, SEOHead, framer-motion, and Firestore to keep
 * the render focused and network-free.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// ── Lingui stubs ─────────────────────────────────────────────────────────────
const linguiT = (s) =>
  typeof s === 'string' ? s : (s?.message ?? s?.id ?? s?.toString?.() ?? '');

vi.mock('@lingui/react/macro', () => ({
  Trans: ({ children }) => <>{children}</>,
  useLingui: () => ({ t: linguiT, _: linguiT, i18n: { _: linguiT } }),
}));
vi.mock('@lingui/react', () => ({
  Trans: ({ children, id, message }) => <>{children ?? message ?? id}</>,
  useLingui: () => ({ t: linguiT, _: linguiT, i18n: { _: linguiT } }),
  I18nProvider: ({ children }) => <>{children}</>,
}));

// ── Firebase / Firestore ──────────────────────────────────────────────────────
vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  orderBy: vi.fn(),
  limit: vi.fn(),
  getDocs: vi.fn(async () => ({ docs: [] })),
}));
vi.mock('../../../../core/firebase/firebase', () => ({ db: {} }));

// ── Auth store ────────────────────────────────────────────────────────────────
let authState = {
  user: { uid: 'u-free' },
  displayName: 'David',
  isPro: false,
  plan: 'free',
};
vi.mock('../../../../core/store/useAuthStore', () => ({
  useAuthStore: (sel) => (sel ? sel(authState) : authState),
}));

// ── Heavy deps stubbed ────────────────────────────────────────────────────────
vi.mock('../../../../components/layout/AppShell', () => ({
  AppShell: ({ children }) => <div>{children}</div>,
}));
vi.mock('../../../../components/SEOHead', () => ({
  SEOHead: () => null,
}));
vi.mock('framer-motion', () => ({
  motion: new Proxy({}, { get: () => ({ children, ...rest }) => <div {...rest}>{children}</div> }),
  AnimatePresence: ({ children }) => <>{children}</>,
}));
vi.mock('../../../../components/ui/Card', () => ({
  Card: ({ children, ...p }) => <div {...p}>{children}</div>,
  CardBody: ({ children }) => <div>{children}</div>,
  CardHeader: ({ children }) => <div>{children}</div>,
}));
vi.mock('../../../../components/ui/Badge', () => ({
  Badge: ({ children }) => <span>{children}</span>,
}));
vi.mock('../../../ads/components/AdBanner', () => ({
  AdBanner: (props) => <div data-testid="ad-banner" data-placement={props.placementId} />,
}));
vi.mock('../../../../components/ui/Button', () => ({
  default: ({ children, onClick }) => <button onClick={onClick}>{children}</button>,
}));

import { DashboardPage } from '../DashboardPage';

beforeEach(() => {
  authState = { user: { uid: 'u-free' }, displayName: 'David', isPro: false, plan: 'free' };
});

describe('DashboardPage — free-user conditions', () => {
  it('shows plan name "free" in the subtitle', async () => {
    render(<MemoryRouter><DashboardPage /></MemoryRouter>);
    // The <span> renders {plan} which is the string 'free' (capitalized via CSS only)
    await waitFor(() => expect(screen.getByText('free')).toBeTruthy());
  });

  it('shows "Actualizar a Pro" upgrade link for free user', async () => {
    render(<MemoryRouter><DashboardPage /></MemoryRouter>);
    await waitFor(() =>
      expect(screen.getByRole('link', { name: /actualizar a pro/i })).toBeTruthy()
    );
    const link = screen.getByRole('link', { name: /actualizar a pro/i });
    expect(link.getAttribute('href')).toBe('/pricing');
  });

  it('mounts AdBanner for free user (dashboard-main placement)', async () => {
    render(<MemoryRouter><DashboardPage /></MemoryRouter>);
    await waitFor(() =>
      expect(screen.getByTestId('ad-banner')).toBeTruthy()
    );
    expect(screen.getByTestId('ad-banner').dataset.placement).toBe('dashboard-main');
  });

  it('does NOT show "Actualizar a Pro" link for Pro user', async () => {
    authState = { user: { uid: 'u-pro' }, displayName: 'Pro User', isPro: true, plan: 'pro' };
    render(<MemoryRouter><DashboardPage /></MemoryRouter>);
    // Give a tick for effects
    await waitFor(() => expect(screen.queryByRole('link', { name: /actualizar a pro/i })).toBeNull());
  });
});
