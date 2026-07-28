import { Ticket, Flame, ArrowRight, X } from 'lucide-react';
import { usePromoBanner } from '../hooks/usePromoBanner';
import { GlassButton } from '../../../components/glass/GlassButton';

/**
 * PromoBanner — top strip announcing an active promo/coupon.
 * Content (title, code, CTA text, discount/urgency badges, subtitle) and
 * audience are fully admin-editable (`featureFlags/global`), so this same
 * component serves future promos too.
 */
export function PromoBanner() {
  const { shouldShow, title, code, ctaText, discountBadge, subtitle, urgencyBadge, dismiss } = usePromoBanner();

  if (!shouldShow) return null;

  return (
    <div role="complementary" aria-label="Promoción" className="relative z-40 bg-zen-brand-diag shadow-zen">
      <div className="mx-auto flex max-w-screen-xl flex-col items-center gap-3 px-4 py-3 sm:flex-row sm:justify-between sm:gap-4 sm:px-6">
        <div className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1.5 text-center sm:justify-start sm:text-left">
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-white/30 px-3 py-1 text-xs font-bold tracking-wide text-white">
            <Ticket size={13} />
            {code}
          </span>
          {discountBadge && (
            <span className="shrink-0 rounded-full bg-amber-400 px-2.5 py-0.5 text-xs font-bold text-zen-ink">
              {discountBadge}
            </span>
          )}
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-white">{title}</span>
            {subtitle && <span className="text-xs text-white/70">{subtitle}</span>}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {urgencyBadge && (
            <span className="hidden items-center gap-1.5 rounded-full border border-white/30 px-3 py-1 text-xs font-semibold text-white sm:inline-flex">
              <Flame size={13} />
              {urgencyBadge}
            </span>
          )}
          <GlassButton variant="secondary" to="/pricing" className="!border-white/30 !bg-white !text-zen-ink px-4 text-xs hover:!bg-white/90">
            {ctaText}
            <ArrowRight size={13} />
          </GlassButton>
          <button
            type="button"
            onClick={dismiss}
            aria-label="Cerrar"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-white/30 text-white/80 hover:bg-white/15 hover:text-white"
          >
            <X size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
