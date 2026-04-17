export function MaintenancePage() {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4">
      <div className="max-w-sm w-full text-center space-y-8">

        {/* Animated icon */}
        <div className="mx-auto w-24 h-24 rounded-3xl bg-gradient-to-br from-brand-500/20 to-brand-600/10 border border-brand-500/20 flex items-center justify-center text-5xl shadow-lg">
          🛠️
        </div>

        {/* Text */}
        <div className="space-y-3">
          <h1 className="font-display font-black text-3xl sm:text-4xl text-ink tracking-tight">
            En mantenimiento
          </h1>
          <p className="text-ink-soft text-sm sm:text-base leading-relaxed">
            Estamos haciendo mejoras para ofrecerte una mejor experiencia.
            <br />
            Vuelve en unos minutos.
          </p>
        </div>

        {/* Animated status pill */}
        <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-warning-500/10 border border-warning-500/20 text-warning-400 text-sm font-medium">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-warning-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-warning-400" />
          </span>
          Temporalmente fuera de servicio
        </div>

        {/* Divider */}
        <div className="border-t border-surface-muted" />

        {/* Contact */}
        <p className="text-xs text-ink-muted">
          ¿Necesitas ayuda urgente?{' '}
          <a
            href="mailto:support@certzen.app"
            className="text-brand-400 hover:text-brand-300 underline underline-offset-2 transition-colors"
          >
            support@certzen.app
          </a>
        </p>

      </div>
    </div>
  );
}
