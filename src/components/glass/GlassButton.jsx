import { Link } from 'react-router-dom';

/**
 * GlassButton — botón del diseño Glassmorphism (spec 02).
 * primary: gradiente indigo→violeta con glow. secondary: superficie glass con borde.
 * ghost: solo texto (links de nav). Touch target mínimo 44px (min-h-11).
 *
 * Renderiza <Link> si recibe `to`, <a> si recibe `href`, <button> en caso contrario.
 */
const VARIANTS = {
  primary:
    'bg-zen-brand text-white shadow-zen hover:shadow-zen-lg hover:brightness-110',
  secondary:
    'bg-glass-light-2 text-zen-ink border border-glass-light-border backdrop-blur-md hover:bg-glass-light-3 dark:bg-glass-dark-2 dark:text-white dark:border-glass-dark-border dark:hover:bg-glass-dark-3',
  ghost:
    'text-zen-ink/80 hover:text-zen-ink hover:bg-glass-light-1 dark:text-white/80 dark:hover:text-white dark:hover:bg-glass-dark-1',
};

export function GlassButton({ variant = 'primary', to, href, className = '', children, ...props }) {
  const classes = `inline-flex min-h-11 items-center justify-center gap-2 rounded-zen px-5 text-sm font-semibold transition-all ${VARIANTS[variant] ?? VARIANTS.primary} ${className}`;

  if (to) {
    return <Link to={to} className={classes} {...props}>{children}</Link>;
  }
  if (href) {
    return <a href={href} className={classes} rel="noopener noreferrer" {...props}>{children}</a>;
  }
  return <button type="button" className={classes} {...props}>{children}</button>;
}
