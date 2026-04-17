import { Trans } from '@lingui/react/macro';

export function MaintenancePage() {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Icon */}
        <div className="mx-auto w-20 h-20 rounded-2xl bg-warning-50 border border-warning-200 flex items-center justify-center text-4xl">
          🛠️
        </div>

        {/* Heading */}
        <div className="space-y-2">
          <h1 className="font-display font-black text-2xl sm:text-3xl text-ink tracking-tight">
            <Trans>En mantenimiento</Trans>
          </h1>
          <p className="text-ink-soft text-sm sm:text-base leading-relaxed">
            <Trans>
              Estamos haciendo mejoras para ofrecerte una mejor experiencia.
              Vuelve en unos minutos.
            </Trans>
          </p>
        </div>

        {/* Status badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-warning-50 border border-warning-200 text-warning-700 text-sm font-medium">
          <span className="w-2 h-2 rounded-full bg-warning-400 animate-pulse" aria-hidden="true" />
          <Trans>Temporalmente fuera de servicio</Trans>
        </div>

        {/* Contact fallback */}
        <p className="text-xs text-ink-muted">
          <Trans>¿Urgente?</Trans>{' '}
          <a
            href="mailto:support@certzen.app"
            className="text-brand-600 hover:text-brand-700 underline underline-offset-2"
          >
            support@certzen.app
          </a>
        </p>
      </div>
    </div>
  );
}
