import { forwardRef } from 'react'
import { cn } from '../../lib/utils'

const Input = forwardRef(function Input(
  { label, error, hint, className, id, ...props },
  ref
) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-zen-ink dark:text-white">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        className={cn(
          'min-h-11 w-full rounded-zen border bg-glass-light-2 dark:bg-glass-dark-2 px-4 text-sm text-zen-ink dark:text-white placeholder:text-zen-ink/50 dark:placeholder:text-white/40 backdrop-blur-md',
          'transition-colors duration-150 outline-none',
          'focus:border-zen focus:ring-2 focus:ring-zen/40',
          error
            ? 'border-zen-danger focus:border-zen-danger focus:ring-zen-danger/20'
            : 'border-glass-light-border dark:border-glass-dark-border',
          className
        )}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
        {...props}
      />
      {error && (
        <p id={`${inputId}-error`} className="text-xs text-zen-danger" role="alert">
          {error}
        </p>
      )}
      {hint && !error && (
        <p id={`${inputId}-hint`} className="text-xs text-zen-ink/50 dark:text-white/50">
          {hint}
        </p>
      )}
    </div>
  )
})

export default Input
