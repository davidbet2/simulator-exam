import { Link } from 'react-router-dom';

const CURRENT_YEAR = new Date().getFullYear();

const NAV = [
  {
    heading: 'Plataforma',
    links: [
      { to: '/',          label: 'Simuladores' },
      { to: '/about',     label: 'Sobre CertZen' },
      { to: '/pricing',   label: 'Planes' },
      { to: '/explore',   label: 'Comunidad' },
    ],
  },
  {
    heading: 'Cuenta',
    links: [
      { to: '/login',     label: 'Ingresar' },
      { to: '/register',  label: 'Registrarse gratis' },
      { to: '/dashboard', label: 'Dashboard' },
      { to: '/profile',   label: 'Mi perfil' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { to: '/privacy',   label: 'Privacidad' },
      { to: '/terms',     label: 'Términos de uso' },
      { to: '/contact',   label: 'Contacto' },
    ],
  },
];

/*
 * variant="glass": estilo Glassmorphism (spec 02) para páginas ya rediseñadas.
 * El default mantiene el look legacy hasta que specs 03–05 migren el resto.
 */
const STYLES = {
  legacy: {
    grid:     'grid grid-cols-2 sm:grid-cols-4 gap-8 mb-10',
    footer:   'border-t border-surface-border bg-surface-soft/60 backdrop-blur-md mt-16',
    brand:    'text-xl font-display font-bold text-gradient-brand',
    tagline:  'text-xs text-ink-soft leading-relaxed',
    heading:  'text-[11px] font-bold uppercase tracking-widest text-ink-soft mb-3',
    link:     'text-sm text-ink-soft hover:text-ink transition-colors',
    bottom:   'border-t border-surface-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-ink',
    bottomLink: 'hover:text-ink-soft transition-colors',
  },
  glass: {
    // Mobile: una sola columna apilada, como "Home — Mobile" del diseño
    grid:     'grid grid-cols-1 sm:grid-cols-4 gap-8 mb-10',
    footer:   'border-t border-glass-light-border bg-glass-light-1 backdrop-blur-md mt-16 text-zen-ink dark:border-glass-dark-border dark:bg-glass-dark-1 dark:text-white',
    brand:    'text-xl font-display font-bold text-gradient-zen',
    tagline:  'text-xs leading-relaxed text-zen-ink/70 dark:text-white/60',
    heading:  'text-[11px] font-bold uppercase tracking-widest mb-3 text-zen-ink/60 dark:text-white/50',
    link:     'text-sm transition-colors text-zen-ink/70 hover:text-zen-ink dark:text-white/60 dark:hover:text-white',
    bottom:   'border-t border-glass-light-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zen-ink/70 dark:border-glass-dark-border dark:text-white/60',
    bottomLink: 'transition-colors hover:text-zen-ink dark:hover:text-white',
  },
};

export function Footer({ variant = 'legacy' }) {
  const s = STYLES[variant] ?? STYLES.legacy;
  return (
    <footer
      role="contentinfo"
      aria-label="Pie de página"
      className={s.footer}
    >
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Top grid */}
        <div className={s.grid}>
          {/* Brand */}
          <div className="col-span-full sm:col-span-1">
            <Link to="/" aria-label="CertZen — inicio" className="inline-block mb-3">
              <span className={s.brand}>CertZen</span>
            </Link>
            <p className={s.tagline}>
              Simulador inteligente de exámenes de certificación. Practica con confianza y aprueba la primera vez.
            </p>
          </div>

          {/* Nav groups */}
          {NAV.map(({ heading, links }) => (
            <nav key={heading} aria-label={heading}>
              <h3 className={s.heading}>
                {heading}
              </h3>
              <ul className="space-y-2">
                {links.map(({ to, label }) => (
                  <li key={to}>
                    <Link to={to} className={s.link}>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Bottom bar */}
        <div className={s.bottom}>
          <p>© {CURRENT_YEAR} CertZen. Todos los derechos reservados.</p>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className={s.bottomLink}>Privacidad</Link>
            <Link to="/terms"   className={s.bottomLink}>Términos</Link>
            <Link to="/contact" className={s.bottomLink}>Contacto</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
