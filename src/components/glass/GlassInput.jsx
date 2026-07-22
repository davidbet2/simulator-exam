/**
 * GlassInput — input sobre superficie glass (spec 02).
 * Superficie translúcida + borde glass; focus con anillo indigo.
 * Altura mínima 44px (touch target).
 */
export function GlassInput({ className = '', ...props }) {
  return (
    <input
      className={`min-h-11 w-full rounded-zen border border-glass-light-border bg-glass-light-2 px-4 text-sm text-zen-ink placeholder:text-zen-ink/50 backdrop-blur-md transition-colors focus:border-zen focus:outline-none focus:ring-2 focus:ring-zen/40 dark:border-glass-dark-border dark:bg-glass-dark-2 dark:text-white dark:placeholder:text-white/40 ${className}`}
      {...props}
    />
  );
}
