import { Link } from 'react-router-dom';
import { Trans } from '@lingui/react/macro';
import { useUserPlan } from '../../plans/hooks/useUserPlan';

/**
 * SponsorBanner — shows a static sponsor placeholder to free-plan users only.
 * Pro users see nothing (null returned immediately).
 *
 * Replace the `href`, `label`, and `description` props with real sponsor data
 * once you have a direct advertiser, or swap the component for AdBanner
 * (EthicalAds) once approved.
 *
 * Props:
 *   href        — sponsor URL (default: Appian Academy)
 *   label       — sponsor CTA text
 *   description — small tagline below CTA
 *   className   — extra Tailwind classes for the wrapper
 */
export function SponsorBanner({
  href = 'https://appian.com/learn',
  label = 'Prepárate con Appian Academy →',
  description,
  className = '',
}) {
  const { isPro, isLoading } = useUserPlan();

  // Don't flash ad while plan status loads
  if (isLoading || isPro) return null;

  return (
    <aside
      aria-label="Sponsored content"
      className={`rounded-xl border border-surface-border bg-surface-soft/50 px-4 py-3 text-center ${className}`}
    >
      <p className="text-[10px] uppercase tracking-widest text-ink-muted mb-1.5">
        <Trans>Patrocinado</Trans>
      </p>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer nofollow"
        className="text-sm text-brand-600 font-medium hover:underline"
      >
        {label}
      </a>
      {description && (
        <p className="text-xs text-ink-muted mt-1">{description}</p>
      )}
      <p className="text-[10px] text-ink-muted mt-2">
        <Trans>
          Elimina los anuncios con{' '}
          <Link to="/pricing" className="underline text-brand-500">
            CertZen Pro
          </Link>
        </Trans>
      </p>
    </aside>
  );
}
