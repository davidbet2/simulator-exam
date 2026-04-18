/**
 * AdBanner & SponsorBanner — free-user gate unit tests.
 *
 * Both components must:
 *   - Return null for Pro users (no ad rendered)
 *   - Return null while plan status is loading (prevent flash)
 *   - Render sponsored content for free users
 *
 * useUserPlan is fully mocked; no Firestore needed.
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// ── Lingui stubs (macro + runtime) ───────────────────────────────────────────
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

// ── useUserPlan: mutable per-describe ─────────────────────────────────────────
let mockPlanState = { isPro: false, isLoading: false };

vi.mock('../../../plans/hooks/useUserPlan', () => ({
  useUserPlan: () => mockPlanState,
}));

import { AdBanner } from '../AdBanner';
import { SponsorBanner } from '../SponsorBanner';

// ── AdBanner tests ────────────────────────────────────────────────────────────

describe('AdBanner — free-user gate', () => {
  it('renders sponsored placeholder for free user (no EthicalAds publisher configured)', () => {
    mockPlanState = { isPro: false, isLoading: false };
    // VITE_ETHICAL_ADS_PUBLISHER not set → renders sponsor placeholder
    render(
      <MemoryRouter>
        <AdBanner keywords="certification" placementId="test" />
      </MemoryRouter>
    );
    expect(screen.getByRole('complementary')).toBeTruthy(); // <aside aria-label="Sponsored content">
    expect(screen.getByText(/patrocinado/i)).toBeTruthy();
  });

  it('returns null for Pro user — no ad rendered', () => {
    mockPlanState = { isPro: true, isLoading: false };
    const { container } = render(
      <MemoryRouter>
        <AdBanner keywords="certification" placementId="test" />
      </MemoryRouter>
    );
    expect(container.firstChild).toBeNull();
  });

  it('returns null while loading — prevents flash of ad for Pro', () => {
    mockPlanState = { isPro: false, isLoading: true };
    const { container } = render(
      <MemoryRouter>
        <AdBanner keywords="certification" placementId="test" />
      </MemoryRouter>
    );
    expect(container.firstChild).toBeNull();
  });
});

// ── SponsorBanner tests ───────────────────────────────────────────────────────

describe('SponsorBanner — free-user gate', () => {
  it('renders for free user with "Patrocinado" label', () => {
    mockPlanState = { isPro: false, isLoading: false };
    render(
      <MemoryRouter>
        <SponsorBanner />
      </MemoryRouter>
    );
    expect(screen.getByText(/patrocinado/i)).toBeTruthy();
    // The banner renders (aside with aria-label "Sponsored content") for free users
    expect(screen.getByRole('complementary')).toBeTruthy();
  });

  it('shows default sponsor link (Appian Academy) for free user', () => {
    mockPlanState = { isPro: false, isLoading: false };
    render(
      <MemoryRouter>
        <SponsorBanner />
      </MemoryRouter>
    );
    const sponsorLink = screen.getByText(/appian academy/i);
    expect(sponsorLink).toBeTruthy();
  });

  it('returns null for Pro user', () => {
    mockPlanState = { isPro: true, isLoading: false };
    const { container } = render(
      <MemoryRouter>
        <SponsorBanner />
      </MemoryRouter>
    );
    expect(container.firstChild).toBeNull();
  });

  it('returns null while loading', () => {
    mockPlanState = { isPro: false, isLoading: true };
    const { container } = render(
      <MemoryRouter>
        <SponsorBanner />
      </MemoryRouter>
    );
    expect(container.firstChild).toBeNull();
  });
});
