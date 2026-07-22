import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Mail, MailCheck } from 'lucide-react';
import { useAuthStore } from '../../../core/store/useAuthStore';
import { GlassButton } from '../../../components/glass/GlassButton';
import { AuthShell, GlassField, authLinkClass } from '../components/AuthShell';
import { SEOHead } from '../../../components/SEOHead';

const schema = z.object({
  email: z.string().email('Correo electrónico inválido'),
});

export function ForgotPasswordPage() {
  const { resetPassword } = useAuthStore();
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [sentEmail, setSentEmail] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  async function onSubmit({ email }) {
    setSending(true);
    try {
      await resetPassword(email);
      setSentEmail(email);
      setSent(true);
    } catch {
      // Silently succeed even on unknown email to prevent enumeration (OWASP A07)
      setSentEmail(email);
      setSent(true);
    } finally {
      setSending(false);
    }
  }

  return (
    <AuthShell>
      <SEOHead title="Recuperar contraseña" description="" path="/forgot-password" noindex />

      {sent ? (
        /* ── Success state ── */
        <div className="space-y-4 text-center">
          <div className="flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zen/15 dark:bg-zen/25">
              <MailCheck size={28} className="text-zen dark:text-indigo-300" />
            </div>
          </div>
          <div>
            <h1 className="mb-1 text-lg font-bold">Revisa tu correo</h1>
            <p className="text-sm leading-relaxed text-zen-ink/70 dark:text-white/60">
              Si <span className="font-semibold text-zen-ink dark:text-white">{sentEmail}</span> tiene una cuenta,
              recibirás un enlace para restablecer tu contraseña en los próximos minutos.
            </p>
          </div>
          <p className="text-xs text-zen-ink/50 dark:text-white/40">
            ¿No llegó? Revisa la carpeta de spam.
          </p>
          <GlassButton to="/login" variant="secondary" className="w-full">
            <ArrowLeft size={15} />
            Volver al inicio de sesión
          </GlassButton>
        </div>
      ) : (
        /* ── Form state ── */
        <>
          <div>
            <h1 className="text-xl font-bold">Recuperar contraseña</h1>
            <p className="mt-1 text-sm text-zen-ink/70 dark:text-white/60">
              Ingresa tu correo y te enviaremos un enlace para crear una nueva contraseña.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <GlassField
              id="forgot-email"
              label="Correo electrónico"
              icon={Mail}
              type="email"
              autoComplete="email"
              placeholder="tu@correo.com"
              error={errors.email?.message}
              {...register('email')}
            />
            <GlassButton type="submit" className="w-full" disabled={sending}>
              {sending ? 'Enviando...' : 'Enviar enlace de recuperación'}
            </GlassButton>
          </form>

          <p className="text-center text-sm">
            <Link to="/login" className={`inline-flex items-center gap-1.5 ${authLinkClass}`}>
              <ArrowLeft size={13} />
              Volver al inicio de sesión
            </Link>
          </p>
        </>
      )}
    </AuthShell>
  );
}
