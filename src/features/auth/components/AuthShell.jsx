import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { Trans } from '@lingui/react/macro';
import { PublicLayout } from '../../../components/layout/PublicLayout';
import { GlassCard } from '../../../components/glass/GlassCard';
import { GlassInput } from '../../../components/glass/GlassInput';

/**
 * AuthShell — patrón de página de auth del diseño (spec 03):
 * fondo glass sin nav/footer, logo centrado con tagline y card glass.
 */
export function AuthShell({ children }) {
  return (
    <PublicLayout hideChrome>
      <div className="flex min-h-screen items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-sm"
        >
          <div className="mb-8 text-center">
            <div className="mb-2 inline-flex items-center gap-2.5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-zen-brand">
                <Sparkles size={20} className="text-white" />
              </div>
              <span className="text-3xl font-bold tracking-tight">CertZen</span>
            </div>
            <p className="text-sm text-zen-ink/60 dark:text-white/50"><Trans>Domina tu certificación</Trans></p>
          </div>

          <GlassCard className="space-y-5 p-6">
            {children}
          </GlassCard>
        </motion.div>
      </div>
    </PublicLayout>
  );
}

/** Campo de formulario del diseño: label + icono a la izquierda + GlassInput. */
export function GlassField({ label, icon: Icon, error, id, ...inputProps }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <Icon size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zen-ink/40 dark:text-white/40" />
        )}
        <GlassInput id={id} className={Icon ? 'pl-10' : ''} aria-invalid={!!error} {...inputProps} />
      </div>
      {error && <p className="mt-1 text-xs text-zen-danger">{error}</p>}
    </div>
  );
}

/** Enlace violeta del diseño (¿Olvidaste tu contraseña?, Regístrate gratis…). */
export const authLinkClass = 'font-medium text-zen transition-colors hover:text-zen-violet dark:text-indigo-300 dark:hover:text-indigo-200';
