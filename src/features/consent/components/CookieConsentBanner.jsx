import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trans } from '@lingui/react/macro';
import { GlassCard } from '../../../components/glass/GlassCard';
import { GlassButton } from '../../../components/glass/GlassButton';
import { CONSENT_STORAGE_KEY, updateConsent, readStoredConsent } from '../consent';

/**
 * CookieConsentBanner — pide consentimiento GDPR/LGPD para Consent Mode v2.
 *
 * Sin este banner, ad_storage/analytics_storage quedan en 'denied' para
 * siempre (default de index.html): GA4/GTM no mide usuarios y AdBanner no
 * carga el script de Google AdSense (ver certzen:consent-changed en
 * consent.js) — nunca se envía un 'consent update' a 'granted'.
 */
export function CookieConsentBanner() {
  const [visible, setVisible] = useState(() => readStoredConsent() === null);

  if (!visible) return null;

  function handleChoice(granted) {
    updateConsent(granted);
    localStorage.setItem(CONSENT_STORAGE_KEY, granted ? 'granted' : 'denied');
    setVisible(false);
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 p-4 sm:p-6" role="dialog" aria-live="polite" aria-label="Consentimiento de cookies">
      <GlassCard variant="elevated" className="mx-auto flex max-w-2xl flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <p className="text-sm text-zen-ink/80 dark:text-white/70">
          <Trans>
            Usamos cookies para medir el uso del sitio y, si lo aceptas, para mostrarte anuncios de Google AdSense personalizados.
            Lee más en nuestra{' '}
            <Link to="/privacy" className="underline text-zen hover:text-zen-violet">
              Política de Privacidad
            </Link>.
          </Trans>
        </p>
        <div className="flex shrink-0 gap-2">
          <GlassButton variant="secondary" onClick={() => handleChoice(false)}>
            <Trans>Rechazar</Trans>
          </GlassButton>
          <GlassButton variant="primary" onClick={() => handleChoice(true)}>
            <Trans>Aceptar</Trans>
          </GlassButton>
        </div>
      </GlassCard>
    </div>
  );
}
