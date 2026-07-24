import { cn } from '../../lib/utils'

const variants = {
  default: 'bg-glass-light-2 text-zen-ink/60 border border-glass-light-border dark:bg-glass-dark-2 dark:text-white/60 dark:border-glass-dark-border',
  brand:   'bg-zen/15 text-zen border border-zen/30 dark:text-indigo-300',
  success: 'bg-zen-success/15 text-emerald-600 border border-zen-success/30 dark:text-zen-success',
  warning: 'bg-zen-warning/15 text-amber-600 border border-zen-warning/30 dark:text-zen-warning',
  danger:  'bg-zen-danger/15 text-rose-600 border border-zen-danger/30 dark:text-zen-danger',
  pro:     'bg-gradient-to-r from-zen-warning/20 to-orange-500/20 text-amber-600 border border-zen-warning/40 dark:text-zen-warning',
}

export function Badge({ variant = 'default', className, children, ...props }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}
