import { forwardRef } from 'react'
import { cn } from '../../lib/utils'

const variants = {
  primary:   'bg-zen-brand text-white shadow-zen hover:shadow-zen-lg hover:brightness-110 focus-visible:ring-zen',
  secondary: 'bg-glass-light-2 dark:bg-glass-dark-2 text-zen-ink dark:text-white border border-glass-light-border dark:border-glass-dark-border backdrop-blur-md hover:bg-glass-light-3 dark:hover:bg-glass-dark-3 focus-visible:ring-zen',
  success:   'bg-zen-success text-white shadow-sm hover:brightness-95 focus-visible:ring-zen-success',
  danger:    'bg-zen-danger text-white shadow-sm hover:brightness-95 focus-visible:ring-zen-danger',
  ghost:     'text-zen-ink/70 dark:text-white/70 hover:bg-glass-light-2 dark:hover:bg-glass-dark-2 hover:text-zen-ink dark:hover:text-white focus-visible:ring-zen',
  outline:   'border border-glass-light-border dark:border-glass-dark-border text-zen-ink/80 dark:text-white/80 hover:bg-glass-light-2 dark:hover:bg-glass-dark-2 focus-visible:ring-zen',
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
        'focus-visible:outline-none focus-visible:ring-2',
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
