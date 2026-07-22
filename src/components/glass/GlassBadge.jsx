/**
 * GlassBadge — pill/etiqueta del diseño (spec 02): "MÁS USADO", "PRÓXIMAMENTE", etc.
 * Tintes al ~12–16% de alpha sobre glass, radio 999px.
 */
const TONES = {
  brand:   'bg-zen/15 text-zen dark:bg-zen/25 dark:text-indigo-300',
  neutral: 'bg-glass-light-2 text-zen-ink/60 border border-glass-light-border dark:bg-glass-dark-2 dark:text-white/60 dark:border-glass-dark-border',
  success: 'bg-zen-success/15 text-emerald-600 dark:text-zen-success',
  warning: 'bg-zen-warning/15 text-amber-600 dark:text-zen-warning',
  danger:  'bg-zen-danger/15 text-rose-600 dark:text-zen-danger',
};

export function GlassBadge({ tone = 'brand', className = '', children, ...props }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider ${TONES[tone] ?? TONES.brand} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
