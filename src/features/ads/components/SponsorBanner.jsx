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
      className={`rounded-xl border border-glass-light-border bg-glass-light-1 dark:border-glass-dark-border dark:bg-glass-dark-1 px-4 py-3 text-center ${className}`}
    >
      <p className="text-[10px] uppercase tracking-widest text-zen-ink/50 dark:text-white/50 mb-1.5">
        <Trans>Patrocinado</Trans>
      </p>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer nofollow"
        className="text-sm text-zen dark:text-indigo-300 font-medium hover:underline"
      >
        {label}
      </a>
      {description && (
        <p className="text-xs text-zen-ink/50 dark:text-white/50 mt-1">{description}</p>
      )}
      <p className="text-[10px] text-zen-ink/50 dark:text-white/50 mt-2">
        <Trans>
          Elimina los anuncios con{' '}
          <Link to="/pricing" className="underline text-zen">
            CertZen Pro
          </Link>
        </Trans>
      </p>
    </aside>
  );
}
