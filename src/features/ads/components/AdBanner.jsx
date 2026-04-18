import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Trans } from '@lingui/react/macro';
import { useUserPlan } from '../../plans/hooks/useUserPlan';

const ETHICAL_ADS_SCRIPT = 'https://media.ethicalads.io/media/client/ethicalads.min.js';
const SCRIPT_ID = 'ethical-ads-client';
const ADSENSE_SCRIPT_ID = 'google-adsense-client';

/**
 * AdBanner — Ad placement for free-plan users.
 *
 * Priority order:
 *   1. Google AdSense   — set VITE_GOOGLE_ADSENSE_ID=ca-pub-XXXXXXXXXXXXXXXX
 *   2. EthicalAds       — set VITE_ETHICAL_ADS_PUBLISHER=your-publisher-id
 *   3. Sponsor placeholder (fallback, always shown when neither is configured)
 *
 * Props:
 *   type        — 'image' | 'text' (EthicalAds only, default 'image')
 *   keywords    — pipe-separated keywords: "certification|developer|appian"
 *   placementId — unique ID per placement for tracking (e.g. "dashboard-main")
 *   adSlot      — Google AdSense ad unit slot ID (e.g. "1234567890")
 *   className   — extra Tailwind classes
 */
export function AdBanner({
  type = 'image',
  keywords = 'certification|developer|appian',
  placementId,
  adSlot,
  className = '',
}) {
  const { isPro, isLoading } = useUserPlan();
  const adsenseId = import.meta.env.VITE_GOOGLE_ADSENSE_ID;
  const publisherId = import.meta.env.VITE_ETHICAL_ADS_PUBLISHER;
  const pushedRef = useRef(false);

  // ── Google AdSense loader ──────────────────────────────────────────────────
  useEffect(() => {
    if (isLoading || isPro || !adsenseId) return;

    if (!document.getElementById(ADSENSE_SCRIPT_ID)) {
      const script = document.createElement('script');
      script.id = ADSENSE_SCRIPT_ID;
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseId}`;
      script.async = true;
      script.crossOrigin = 'anonymous';
      document.head.appendChild(script);
    }
  }, [isLoading, isPro, adsenseId]);

  // ── Google AdSense push (call once per mount) ─────────────────────────────
  useEffect(() => {
    if (isLoading || isPro || !adsenseId || pushedRef.current) return;
    try {
      pushedRef.current = true;
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // adsbygoogle already filled — safe to ignore
    }
  }, [isLoading, isPro, adsenseId]);

  // ── EthicalAds loader ─────────────────────────────────────────────────────
  useEffect(() => {
    if (isLoading || isPro || adsenseId || !publisherId) return;

    if (!document.getElementById(SCRIPT_ID)) {
      const script = document.createElement('script');
      script.id = SCRIPT_ID;
      script.src = ETHICAL_ADS_SCRIPT;
      script.async = true;
      document.head.appendChild(script);
    } else if (window.ethicalads) {
      window.ethicalads.reload();
    }
  }, [isPro, isLoading, adsenseId, publisherId]);

  // Don't render anything for Pro users or while loading
  if (isLoading || isPro) return null;

  // ── Google AdSense ad unit ─────────────────────────────────────────────────
  // Only render a manual <ins> placement when a specific adSlot is provided.
  // Without adSlot, the script is still loaded (enables Auto Ads from the
  // AdSense dashboard) but we fall through to the visible sponsor placeholder.
  if (adsenseId && adSlot) {
    return (
      <aside
        aria-label="Publicidad"
        className={`rounded-xl overflow-hidden ${className}`}
        {...(placementId && { id: placementId })}
      >
        <p className="text-[9px] uppercase tracking-widest text-ink-muted/50 text-right pr-1 mb-0.5 select-none">
          Publicidad
        </p>
        <ins
          className="adsbygoogle"
          style={{ display: 'block', minHeight: '90px' }}
          data-ad-client={adsenseId}
          data-ad-slot={adSlot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </aside>
    );
  }

  // ── EthicalAds placement ───────────────────────────────────────────────────
  if (publisherId) {
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

  // ── Sponsor placeholder ────────────────────────────────────────────────────
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
