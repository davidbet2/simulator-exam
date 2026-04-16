import { cn } from '../../lib/utils'

const variants = {
  default: 'bg-surface-muted text-slate-300 border border-surface-border',
  brand:   'bg-brand-500/15 text-brand-300 border border-brand-500/30',
  success: 'bg-success-500/15 text-emerald-300 border border-success-500/30',
  warning: 'bg-warning-500/15 text-amber-300 border border-warning-500/30',
  danger:  'bg-danger-500/15 text-red-300 border border-danger-500/30',
  pro:     'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border border-amber-500/40',
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
