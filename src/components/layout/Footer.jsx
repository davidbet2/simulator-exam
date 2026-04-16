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

export function Footer() {
  return (
    <footer
      role="contentinfo"
      aria-label="Pie de página"
      className="border-t border-surface-border bg-surface-soft/60 backdrop-blur-md mt-16"
    >
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Top grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-1">
            <Link to="/" aria-label="CertZen — inicio" className="inline-block mb-3">
              <span className="text-xl font-display font-bold text-gradient-brand">CertZen</span>
            </Link>
            <p className="text-xs text-ink-soft leading-relaxed">
              Simulador inteligente de exámenes de certificación. Practica con confianza y aprueba la primera vez.
            </p>
          </div>

          {/* Nav groups */}
          {NAV.map(({ heading, links }) => (
            <nav key={heading} aria-label={heading}>
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-ink-soft mb-3">
                {heading}
              </h3>
              <ul className="space-y-2">
                {links.map(({ to, label }) => (
                  <li key={to}>
                    <Link
                      to={to}
                      className="text-sm text-ink-soft hover:text-ink transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-surface-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-ink">
          <p>© {CURRENT_YEAR} CertZen. Todos los derechos reservados.</p>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="hover:text-ink-soft transition-colors">Privacidad</Link>
            <Link to="/terms"   className="hover:text-ink-soft transition-colors">Términos</Link>
            <Link to="/contact" className="hover:text-ink-soft transition-colors">Contacto</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
