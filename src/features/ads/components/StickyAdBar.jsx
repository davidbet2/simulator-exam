import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X } from 'lucide-react';
import { Trans } from '@lingui/react/macro';
import { useUserPlan } from '../../plans/hooks/useUserPlan';
import { useFeatureFlags } from '../../../core/hooks/useFeatureFlags';

const ADSENSE_SCRIPT_ID = 'google-adsense-client';

// Routes where the sticky ad should NOT appear
const EXCLUDED_PATHS = ['/exam', '/admin', '/payment-success'];

/**
 * StickyAdBar — global fixed-bottom ad strip for free users and public visitors.
 *
 * - Renders once globally (placed in AppRouter), covers all pages
 * - Hides automatically for Pro users
 * - Respects `adsEnabled` feature flag
 * - User can dismiss per session (sessionStorage)
 * - Height: 0 during AdSense initialization → never creates blank space
 * - Adds bottom padding to <body> so page content isn't hidden behind it
 */
export function StickyAdBar() {
  const { isPro, isLoading } = useUserPlan();
  const { flags } = useFeatureFlags();
  const { pathname } = useLocation();
  const adsenseId = import.meta.env.VITE_GOOGLE_ADSENSE_ID;
  const adSlot    = import.meta.env.VITE_ADSENSE_SLOT;

  const pushedRef = useRef(false);
  const insRef    = useRef(null);
  const [adFilled, setAdFilled]   = useState(null); // null=pending, true=filled, false=hidden
  const [dismissed, setDismissed] = useState(
    () => sessionStorage.getItem('sticky-ad-dismissed') === '1',
  );

  const excluded = EXCLUDED_PATHS.some((p) => pathname.startsWith(p));
  const visible  = !isLoading && !isPro && flags.adsEnabled && !dismissed && !excluded && !!adsenseId && !!adSlot;

  // ── Load AdSense script ──────────────────────────────────────────────────
  useEffect(() => {
    if (!visible) return;
    if (!document.getElementById(ADSENSE_SCRIPT_ID)) {
      const script = document.createElement('script');
      script.id = ADSENSE_SCRIPT_ID;
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseId}`;
      script.async = true;
      script.crossOrigin = 'anonymous';
      document.head.appendChild(script);
    }
  }, [visible, adsenseId]);

  // ── Push ad unit once ────────────────────────────────────────────────────
  useEffect(() => {
    if (!visible || pushedRef.current) return;
    pushedRef.current = true;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // safe to ignore
    }
  }, [visible]);

  // ── Detect filled / unfilled ─────────────────────────────────────────────
  useEffect(() => {
    if (!visible) return;
    const el = insRef.current;
    if (!el) return;

    const check = () => {
      const status = el.getAttribute('data-ad-status');
      if (status === 'filled') setAdFilled(true);
      else setAdFilled(false); // unfilled or no response after timeout → hide
    };

    const observer = new MutationObserver(check);
    observer.observe(el, { attributes: true, attributeFilter: ['data-ad-status'] });
    // After 4s with no fill (e.g. account under review), collapse the bar
    const timer = setTimeout(check, 4000);
    return () => { observer.disconnect(); clearTimeout(timer); };
  }, [visible]);

  // ── Manage body bottom padding ────────────────────────────────────────────
  useEffect(() => {
    if (!visible || adFilled !== true) {
      document.body.style.paddingBottom = '';
      return;
    }
    document.body.style.paddingBottom = '80px';
    return () => { document.body.style.paddingBottom = ''; };
  }, [visible, adFilled]);

  // Don't render at all when not needed
  if (!visible || adFilled === false) return null;

  function handleDismiss() {
    sessionStorage.setItem('sticky-ad-dismissed', '1');
    setDismissed(true);
    document.body.style.paddingBottom = '';
  }

  return (
    <div
      role="complementary"
      aria-label="Publicidad"
      className="fixed bottom-0 left-0 right-0 z-40 bg-surface-card border-t border-surface-border shadow-2xl"
      style={adFilled === true ? undefined : { height: 0, overflow: 'hidden' }}
    >
      {adFilled === true && (
        <div className="relative max-w-screen-xl mx-auto px-4 py-1">
          {/* Label + dismiss */}
          <div className="flex items-center justify-between mb-0.5">
            <span className="text-[9px] uppercase tracking-widest text-ink-muted/50 select-none">
              Publicidad ·{' '}
              <Link to="/pricing" className="underline text-brand-500 hover:text-brand-400">
                <Trans>Eliminar con Pro</Trans>
              </Link>
            </span>
            <button
              type="button"
              onClick={handleDismiss}
              aria-label="Cerrar anuncio"
              className="h-5 w-5 flex items-center justify-center rounded text-ink-muted/60 hover:text-ink-muted hover:bg-surface-muted transition-colors"
            >
              <X size={12} />
            </button>
          </div>

          {/* AdSense unit */}
          <ins
            ref={insRef}
            className="adsbygoogle"
            style={{ display: 'block' }}
            data-ad-client={adsenseId}
            data-ad-slot={adSlot}
            data-ad-format="horizontal"
            data-full-width-responsive="true"
          />
        </div>
      )}

      {/* Keep ins in DOM while adFilled is null so AdSense can initialize */}
      {adFilled === null && (
        <ins
          ref={insRef}
          className="adsbygoogle"
          style={{ display: 'none' }}
          data-ad-client={adsenseId}
          data-ad-slot={adSlot}
          data-ad-format="horizontal"
          data-full-width-responsive="true"
        />
      )}
    </div>
  );
}
