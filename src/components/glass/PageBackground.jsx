import { GlassOrbs } from './GlassOrbs';

/**
 * PageBackground — fondo de página del diseño Glassmorphism (spec 02).
 * Gradiente light (#EEF2FF→#F5F3FF→#E0F2FE) / dark (#0F0F2A→#1A0E3C→#0D1F3C)
 * según la clase `.dark` (useThemeStore), con orbes decorativos detrás del contenido.
 */
export function PageBackground({ children, className = '' }) {
  return (
    <div className={`relative min-h-screen bg-zen-bg-light text-zen-ink dark:bg-zen-bg-dark dark:text-white ${className}`}>
      <GlassOrbs />
      <div className="relative z-[1]">{children}</div>
    </div>
  );
}
