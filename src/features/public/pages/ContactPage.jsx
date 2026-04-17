import { useId, useState } from 'react';
import { Link } from 'react-router-dom';
import { Trans, useLingui } from '@lingui/react/macro';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { PageSEO } from '../../../components/seo/PageSEO';
import { Footer } from '../../../components/layout/Footer';

const buildSubjects = (t) => [
  { value: 'support', label: t`Soporte técnico` },
  { value: 'billing', label: t`Cuenta y facturación` },
  { value: 'content', label: t`Reporte de contenido` },
  { value: 'other',   label: t`Otro` },
];

function Field({ label, id, error, children }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-ink-soft mb-1">
        {label}
      </label>
      {children}
      {error && (
        <p role="alert" className="mt-1 text-xs text-danger-400">{error}</p>
      )}
    </div>
  );
}

export function ContactPage() {
  const { t } = useLingui();
  const SUBJECTS = buildSubjects(t);
  const formId = useId();
  const nameId = `${formId}-name`;
  const emailId = `${formId}-email`;
  const subjectId = `${formId}-subject`;
  const messageId = `${formId}-message`;

  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = t`El nombre es obligatorio.`;
    if (!form.email.trim()) {
      e.email = t`El correo es obligatorio.`;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = t`El formato del correo no es válido.`;
    }
    if (!form.subject) e.subject = t`Elige un asunto.`;
    if (!form.message.trim()) e.message = t`El mensaje es obligatorio.`;
    else if (form.message.trim().length < 20) e.message = t`El mensaje debe tener al menos 20 caracteres.`;
    return e;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: undefined }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validation = validate();
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      // move focus to first error for accessibility
      const firstErrorField = document.getElementById(
        validation.name ? nameId
          : validation.email ? emailId
          : validation.subject ? subjectId
          : messageId
      );
      firstErrorField?.focus();
      return;
    }

    setSending(true);
    setSubmitError(null);
    try {
      const fn = httpsCallable(getFunctions(), 'sendContactEmail');
      await fn({ ...form });
      setSent(true);
    } catch (err) {
      console.error('sendContactEmail:', err);
      setSubmitError(t`No se pudo enviar el mensaje. Intenta de nuevo o escríbenos directamente a support@certzen.app.`);
    } finally {
      setSending(false);
    }
  }

  const inputClass =
    'w-full rounded-xl bg-surface-soft border border-surface-border text-ink text-sm px-3 py-2.5 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-500 transition';
  const errorInputClass = 'border-danger-500 focus:ring-danger-500';

  return (
    <>
      <PageSEO
        title={t`Contacto`}
        description={t`¿Tienes alguna pregunta o problema con CertZen? Escríbenos y te respondemos lo antes posible.`}
        canonical="/contact"
      />

      <div id="main-content" />

      <header className="border-b border-surface-border bg-white/90 backdrop-blur-xl sticky top-0 z-20" role="banner">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2" aria-label="CertZen inicio">
            <div className="w-8 h-8 rounded-xl bg-brand-500 flex items-center justify-center">
              <span className="text-white font-black text-xs leading-none">CZ</span>
            </div>
            <span className="text-xl font-display font-black text-ink tracking-tight">
              Cert<span className="text-brand-500">Zen</span>
            </span>
          </Link>
          <Link to="/" className="text-sm text-ink-soft hover:text-ink transition-colors"><Trans>← Volver al inicio</Trans></Link>
        </div>
      </header>

      <main id="contact-content" tabIndex={-1} className="max-w-3xl mx-auto px-4 py-12">
        <div className="mb-10">
          <h1 className="text-3xl font-display font-bold text-ink mb-2"><Trans>Contacto</Trans></h1>
          <p className="text-ink-soft text-sm">
            <Trans>¿Tienes dudas, encontraste un bug o necesitas ayuda? Escríbenos y te respondemos en máximo</Trans>
            <strong className="text-ink-soft"> <Trans>2 días hábiles</Trans></strong>.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-5">
          {/* Contact info column */}
          <aside className="md:col-span-2 space-y-5" aria-label={t`Información de contacto`}>
            <div className="glass rounded-2xl border border-surface-border p-5 space-y-4">
              <h2 className="font-display font-semibold text-ink text-sm tracking-wide uppercase">
                <Trans>Canales de soporte</Trans>
              </h2>
              <ul className="space-y-3 text-sm" role="list">
                <li className="flex items-start gap-3">
                  <span className="text-lg" aria-hidden="true">✉️</span>
                  <div>
                    <p className="text-ink-soft text-xs mb-0.5"><Trans>Soporte general</Trans></p>
                    <a href="mailto:support@certzen.app" className="text-brand-600 hover:text-brand-700 underline">
                      support@certzen.app
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-lg" aria-hidden="true">🔒</span>
                  <div>
                    <p className="text-ink-soft text-xs mb-0.5"><Trans>Privacidad y legal</Trans></p>
                    <a href="mailto:privacy@certzen.app" className="text-brand-600 hover:text-brand-700 underline">
                      privacy@certzen.app
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-lg" aria-hidden="true">⚡</span>
                  <div>
                    <p className="text-ink-soft text-xs mb-0.5"><Trans>Tiempo de respuesta</Trans></p>
                    <p className="text-ink-soft"><Trans>≤ 2 días hábiles</Trans></p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="glass rounded-2xl border border-surface-border p-5 space-y-2">
              <h2 className="font-display font-semibold text-ink text-sm tracking-wide uppercase">
                <Trans>Recursos útiles</Trans>
              </h2>
              <ul className="space-y-1 text-sm" role="list">
                <li>
                  <Link to="/about" className="text-brand-600 hover:text-brand-700 transition-colors">
                    <Trans>Cómo funciona CertZen →</Trans>
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="text-brand-600 hover:text-brand-700 transition-colors">
                    <Trans>Política de privacidad →</Trans>
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="text-brand-600 hover:text-brand-700 transition-colors">
                    <Trans>Términos de uso →</Trans>
                  </Link>
                </li>
              </ul>
            </div>
          </aside>

          {/* Form column */}
          <div className="md:col-span-3">
            {sent ? (
              <div
                role="status"
                aria-live="polite"
                className="glass rounded-2xl border border-surface-border p-8 text-center space-y-3"
              >
                <span className="text-4xl" aria-hidden="true">✅</span>
                <h2 className="font-display font-bold text-ink text-xl"><Trans>¡Mensaje enviado!</Trans></h2>
                <p className="text-ink-soft text-sm">
                  <Trans>Recibimos tu mensaje y te responderemos en máximo 2 días hábiles.</Trans>
                </p>
                <button
                  type="button"
                  onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }); }}
                  className="mt-2 text-sm text-ink-soft hover:text-ink underline transition-colors"
                >
                  <Trans>Enviar otro mensaje</Trans>
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                noValidate
                aria-label={t`Formulario de contacto`}
                className="glass rounded-2xl border border-surface-border p-6 sm:p-7 space-y-5"
              >
                <Field label={t`Nombre completo`} id={nameId} error={errors.name}>
                  <input
                    id={nameId}
                    name="name"
                    type="text"
                    autoComplete="name"
                    value={form.name}
                    onChange={handleChange}
                    aria-required="true"
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? `${nameId}-error` : undefined}
                    placeholder={t`Tu nombre`}
                    className={`${inputClass} ${errors.name ? errorInputClass : ''}`}
                  />
                </Field>

                <Field label={t`Correo electrónico`} id={emailId} error={errors.email}>
                  <input
                    id={emailId}
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={handleChange}
                    aria-required="true"
                    aria-invalid={!!errors.email}
                    placeholder={t`tu@correo.com`}
                    className={`${inputClass} ${errors.email ? errorInputClass : ''}`}
                  />
                </Field>

                <Field label={t`Asunto`} id={subjectId} error={errors.subject}>
                  <select
                    id={subjectId}
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    aria-required="true"
                    aria-invalid={!!errors.subject}
                    className={`${inputClass} ${errors.subject ? errorInputClass : ''}`}
                  >
                    <option value="">{t`Selecciona un asunto…`}</option>
                    {SUBJECTS.map(s => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </Field>

                <Field label={t`Mensaje`} id={messageId} error={errors.message}>
                  <textarea
                    id={messageId}
                    name="message"
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                    aria-required="true"
                    aria-invalid={!!errors.message}
                    placeholder={t`Describe tu consulta con el mayor detalle posible…`}
                    className={`${inputClass} resize-y ${errors.message ? errorInputClass : ''}`}
                  />
                </Field>

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-sm transition-colors focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                >
                  {sending ? <Trans>Enviando…</Trans> : <Trans>Enviar mensaje</Trans>}
                </button>

                {submitError && (
                  <p role="alert" className="text-xs text-danger-500 text-center">{submitError}</p>
                )}

                <p className="text-xs text-slate-600 text-center">
                  <Trans>Al enviar aceptas nuestra</Trans>{' '}
                  <Link to="/privacy" className="underline hover:text-ink-soft transition-colors">
                    <Trans>política de privacidad</Trans>
                  </Link>
                  .
                </p>
              </form>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
