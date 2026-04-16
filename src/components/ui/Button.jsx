import { forwardRef } from 'react'
import { cn } from '../../lib/utils'

const variants = {
  primary:   'bg-brand-600 hover:bg-brand-700 text-white shadow-sm shadow-brand-500/25 focus-visible:ring-brand-500',
  secondary: 'bg-surface-soft hover:bg-surface-muted text-ink border border-surface-border focus-visible:ring-brand-500',
  success:   'bg-success-500 hover:bg-success-600 text-white shadow-sm shadow-success-500/25 focus-visible:ring-success-500',
  danger:    'bg-danger-500 hover:bg-danger-600 text-white shadow-sm shadow-danger-500/25 focus-visible:ring-danger-500',
  ghost:     'text-ink-soft hover:bg-surface-soft hover:text-ink focus-visible:ring-brand-500',
  outline:   'border border-surface-border text-ink-soft hover:bg-surface-soft focus-visible:ring-brand-500',
}

const sizes = {
  sm:  'h-8  px-3 text-sm  gap-1.5',
  md:  'h-10 px-4 text-sm  gap-2',
  lg:  'h-12 px-6 text-base gap-2',
  xl:  'h-14 px-8 text-lg  gap-2.5',
  icon:'h-10 w-10',
}

const Button = forwardRef(function Button(
  { variant = 'primary', size = 'md', className, disabled, children, ...props },
  ref
) {
  return (
    <button
      ref={ref}
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center rounded-xl font-medium transition-all duration-150',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-surface',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
        'active:scale-[0.97]',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
})

export default Button
