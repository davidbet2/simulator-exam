import { PublicLayout } from '../../../components/layout/PublicLayout';
import { GlassCard } from '../../../components/glass/GlassCard';

export function MaintenancePage() {
  return (
    <PublicLayout hideChrome>
      <div className="flex min-h-screen items-center justify-center px-4">
        <GlassCard className="w-full max-w-sm space-y-8 p-8 text-center">

          {/* Animated icon */}
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl border border-zen/30 bg-zen/15 text-5xl dark:bg-zen/25">
            🛠️
          </div>

          {/* Text */}
          <div className="space-y-3">
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              En mantenimiento
            </h1>
            <p className="text-sm leading-relaxed text-zen-ink/70 dark:text-white/60 sm:text-base">
              Estamos haciendo mejoras para ofrecerte una mejor experiencia.
              <br />
              Vuelve en unos minutos.
            </p>
          </div>

          {/* Animated status pill */}
          <div className="inline-flex items-center gap-2.5 rounded-full border border-zen-warning/30 bg-zen-warning/10 px-5 py-2.5 text-sm font-medium text-amber-600 dark:text-zen-warning">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-zen-warning opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-zen-warning" />
            </span>
            Temporalmente fuera de servicio
          </div>

          {/* Divider */}
          <div className="border-t border-glass-light-border dark:border-glass-dark-border" />

          {/* Contact */}
          <p className="text-xs text-zen-ink/50 dark:text-white/40">
            ¿Necesitas ayuda urgente?{' '}
            <a
              href="mailto:support@certzen.app"
              className="text-zen underline underline-offset-2 transition-colors hover:text-zen-violet dark:text-indigo-300 dark:hover:text-indigo-200"
            >
              support@certzen.app
            </a>
          </p>

        </GlassCard>
      </div>
    </PublicLayout>
  );
}
