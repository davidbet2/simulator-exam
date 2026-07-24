import { cn } from '../../lib/utils'

export function Card({ className, children, ...props }) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-glass-light-border bg-glass-light-2 backdrop-blur-md dark:border-glass-dark-border dark:bg-glass-dark-2',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ className, children, ...props }) {
  return (
    <div className={cn('px-6 pt-6 pb-4', className)} {...props}>
      {children}
    </div>
  )
}

export function CardBody({ className, children, ...props }) {
  return (
    <div className={cn('px-6 pb-6', className)} {...props}>
      {children}
    </div>
  )
}

export function CardFooter({ className, children, ...props }) {
  return (
    <div
      className={cn('px-6 py-4 border-t border-glass-light-border dark:border-glass-dark-border', className)}
      {...props}
    >
      {children}
    </div>
  )
}
