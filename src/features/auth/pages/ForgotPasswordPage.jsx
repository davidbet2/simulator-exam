import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { ArrowLeft, MailCheck } from 'lucide-react';
import { useAuthStore } from '../../../core/store/useAuthStore';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
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
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <SEOHead title="Recuperar contraseña" description="" path="/forgot-password" noindex />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-xl bg-brand-500 flex items-center justify-center shadow-brand">
              <span className="text-white font-black text-xs leading-none">CZ</span>
            </div>
            <span className="text-xl font-display font-black text-ink tracking-tight">
              Cert<span className="text-brand-500">Zen</span>
            </span>
          </div>
          <p className="text-ink-soft text-sm">Domina tu certificación</p>
        </div>

        <div className="rounded-2xl border border-surface-border bg-surface-soft p-6 space-y-5">

          {sent ? (
            /* ── Success state ── */
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="w-14 h-14 rounded-2xl bg-brand-50 flex items-center justify-center">
                  <MailCheck size={28} className="text-brand-500" />
                </div>
              </div>
              <div>
                <h1 className="text-lg font-semibold text-ink mb-1">Revisa tu correo</h1>
                <p className="text-sm text-ink-soft leading-relaxed">
                  Si <span className="font-semibold text-ink">{sentEmail}</span> tiene una cuenta,
                  recibirás un enlace para restablecer tu contraseña en los próximos minutos.
                </p>
              </div>
              <p className="text-xs text-ink-muted">
                ¿No llegó? Revisa la carpeta de spam.
              </p>
              <Link to="/login">
                <Button variant="outline" className="w-full">
                  <ArrowLeft size={15} />
                  Volver al inicio de sesión
                </Button>
              </Link>
            </div>
          ) : (
            /* ── Form state ── */
            <>
              <div>
                <h1 className="text-xl font-semibold text-ink">Recuperar contraseña</h1>
                <p className="text-sm text-ink-soft mt-1">
                  Ingresa tu correo y te enviaremos un enlace para crear una nueva contraseña.
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                <Input
                  label="Correo electrónico"
                  type="email"
                  autoComplete="email"
                  placeholder="tu@email.com"
                  error={errors.email?.message}
                  {...register('email')}
                />
                <Button type="submit" className="w-full" disabled={sending}>
                  {sending ? 'Enviando...' : 'Enviar enlace de recuperación'}
                </Button>
              </form>

              <p className="text-center text-sm text-ink-soft">
                <Link to="/login" className="inline-flex items-center gap-1.5 text-brand-600 hover:text-brand-700 font-medium">
                  <ArrowLeft size={13} />
                  Volver al inicio de sesión
                </Link>
              </p>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
