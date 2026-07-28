import { useState } from 'react';
import { useAuthStore } from '../../../core/store/useAuthStore';
import { useFeatureFlags } from '../../../core/hooks/useFeatureFlags';

const DISMISS_KEY = 'promo-banner-dismissed';

/**
 * usePromoBanner — combines the `promoBannerEnabled`/content flags with the
 * current user's audience segment (anonymous / free / pro) and a per-session
 * dismiss, exposing whether the promo banner should render.
 */
export function usePromoBanner() {
  const { flags } = useFeatureFlags();
  const { user, isPro } = useAuthStore();
  const [dismissed, setDismissed] = useState(
    () => sessionStorage.getItem(DISMISS_KEY) === '1',
  );

  const audience = !user ? 'anonymous' : isPro ? 'pro' : 'free';

  const audienceAllowed =
    (audience === 'anonymous' && flags.promoBannerShowAnonymous) ||
    (audience === 'free' && flags.promoBannerShowFree) ||
    (audience === 'pro' && flags.promoBannerShowPro);

  const hasContent = !!flags.promoBannerTitle && !!flags.promoBannerCode;

  const shouldShow =
    flags.promoBannerEnabled && audienceAllowed && hasContent && !dismissed;

  function dismiss() {
    sessionStorage.setItem(DISMISS_KEY, '1');
    setDismissed(true);
  }

  return {
    shouldShow,
    audience,
    title:          flags.promoBannerTitle,
    code:           flags.promoBannerCode,
    ctaText:        flags.promoBannerCtaText,
    discountBadge:  flags.promoBannerDiscountBadge,
    subtitle:       flags.promoBannerSubtitle,
    urgencyBadge:   flags.promoBannerUrgencyBadge,
    dismiss,
  };
}
