/**
 * GlassCard — superficie glass del diseño (spec 02).
 * Light: blanco 60–80% alpha + borde #1E1B4B1A + sombra suave.
 * Dark: blanco 7–12% alpha + borde #ffffff14.
 *
 * variant: 'subtle' (nav, fondos), 'default' (cards), 'elevated' (hover/destacado)
 */
const SURFACES = {
  subtle:   'bg-glass-light-1 dark:bg-glass-dark-1',
  default:  'bg-glass-light-2 dark:bg-glass-dark-2',
  elevated: 'bg-glass-light-3 dark:bg-glass-dark-3',
};

export function GlassCard({ variant = 'default', className = '', children, ...props }) {
  return (
    <div
      className={`rounded-2xl border border-glass-light-border backdrop-blur-md shadow-zen-glass dark:border-glass-dark-border dark:shadow-none ${SURFACES[variant] ?? SURFACES.default} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
