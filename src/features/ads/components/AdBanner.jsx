import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trans } from '@lingui/react/macro';
import { useUserPlan } from '../../plans/hooks/useUserPlan';

const ETHICAL_ADS_SCRIPT = 'https://media.ethicalads.io/media/client/ethicalads.min.js';
const SCRIPT_ID = 'ethical-ads-client';

/**
 * AdBanner — EthicalAds placement for free-plan users.
 *
 * Requirements:
 *   - Apply and get approved at https://www.ethicalads.io/publishers/
 *   - Set VITE_ETHICAL_ADS_PUBLISHER in .env to your publisher ID
 *
 * Props:
 *   type      — 'image' | 'text' (default 'image')
 *   keywords  — pipe-separated keywords: "certification|developer|appian"
 *   placementId — unique ID per placement for tracking (e.g. "dashboard-main")
 *   className — extra Tailwind classes
 */
export function AdBanner({
  type = 'image',
  keywords = 'certification|developer|appian',
  placementId,
  className = '',
}) {
  const { isPro, isLoading } = useUserPlan();
  const publisherId = import.meta.env.VITE_ETHICAL_ADS_PUBLISHER;

  useEffect(() => {
    if (isLoading || isPro || !publisherId) return;

    if (!document.getElementById(SCRIPT_ID)) {
      const script = document.createElement('script');
      script.id = SCRIPT_ID;
      script.src = ETHICAL_ADS_SCRIPT;
      script.async = true;
      document.head.appendChild(script);
    } else if (window.ethicalads) {
      // SPA navigation — reload to fill the new placement
      window.ethicalads.reload();
    }
  }, [isPro, isLoading, publisherId]);

  // Don't render anything for Pro users or while loading
  if (isLoading || isPro) return null;

  // EthicalAds not configured yet — show sponsor placeholder instead
  if (!publisherId) {
    return (
      <aside
        aria-label="Sponsored content"
        className={`rounded-xl border border-surface-border bg-surface-soft/50 px-4 py-3 text-center ${className}`}
      >
        <p className="text-[10px] uppercase tracking-widest text-ink-muted mb-1.5">
          <Trans>Patrocinado</Trans>
        </p>
        <a
          href="https://appian.com/learn"
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="text-sm text-brand-600 font-medium hover:underline"
        >
          Prepárate con Appian Academy →
        </a>
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

  return (
    <div
      data-ea-publisher={publisherId}
      data-ea-type={type}
      data-ea-manual="true"
      {...(keywords && { 'data-ea-keywords': keywords })}
      {...(placementId && { id: placementId })}
      className={className}
    />
  );
}
