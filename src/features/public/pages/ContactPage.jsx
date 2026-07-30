import { useEffect, useId, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Trans, useLingui } from '@lingui/react/macro';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { ChevronDown } from 'lucide-react';
import { SEOHead } from '../../../components/SEOHead';
import { PublicLayout } from '../../../components/layout/PublicLayout';
import { GlassCard } from '../../../components/glass/GlassCard';
import { GlassButton } from '../../../components/glass/GlassButton';

function SubjectSelect({ id, name, value, options, placeholder, onChange, error, inputClass, errorInputClass }) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const rootRef = useRef(null);
  const listboxId = `${id}-listbox`;
  const selected = options.find(o => o.value === value) ?? null;

  useEffect(() => {
    if (!open) return;
    function handlePointerDown(e) {
      if (!rootRef.current?.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [open]);

  function commit(index) {
    const option = options[index];
    if (!option) return;
    onChange(option.value);
    setOpen(false);
  }

  function handleTriggerKeyDown(e) {
    if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
      e.preventDefault();
      if (!open) {
        setActiveIndex(Math.max(0, options.findIndex(o => o.value === value)));
        setOpen(true);
      } else if (e.key === 'Enter' || e.key === ' ') {
        commit(activeIndex);
      } else if (e.key === 'ArrowDown') {
        setActiveIndex(i => Math.min(options.length - 1, i + 1));
      } else if (e.key === 'ArrowUp') {
        setActiveIndex(i => Math.max(0, i - 1));
      }
    } else if (e.key === 'Escape' && open) {
      e.preventDefault();
      setOpen(false);
    }
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        id={id}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-required="true"
        aria-invalid={!!error}
        onClick={() => {
          setActiveIndex(Math.max(0, options.findIndex(o => o.value === value)));
          setOpen(o => !o);
        }}
        onKeyDown={handleTriggerKeyDown}
        className={`${inputClass} flex items-center justify-between text-left ${error ? errorInputClass : ''} ${!selected ? 'text-zen-ink/50 dark:text-white/40' : ''}`}
      >
        <span>{selected ? selected.label : placeholder}</span>
        <ChevronDown size={16} className="shrink-0 opacity-60" aria-hidden="true" />
      </button>

      {open && (
        <ul
          id={listboxId}
          role="listbox"
          aria-label={placeholder}
          tabIndex={-1}
          className="absolute z-50 mt-1.5 max-h-60 w-full overflow-auto rounded-zen border border-glass-light-border bg-white shadow-lg dark:border-glass-dark-border dark:bg-[#1f2937]"
        >
          {options.map((o, i) => (
            <li
              key={o.value}
              role="option"
              aria-selected={o.value === value}
              onMouseDown={(e) => { e.preventDefault(); commit(i); }}
              onMouseEnter={() => setActiveIndex(i)}
              className={`cursor-pointer px-3 py-2.5 text-sm transition-colors ${
                i === activeIndex
                  ? 'bg-zen/15 text-zen dark:bg-white/10 dark:text-indigo-300'
                  : 'text-zen-ink dark:text-white'
              }`}
            >
              {o.label}
            </li>
          ))}
        </ul>
      )}

      {/* Hidden native input keeps the value participating in form semantics (validation focus target). */}
      <input type="hidden" name={name} value={value} />
    </div>
  );
}

function Field({ label, id, error, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-semibold">
        {label}
      </label>
      {children}
      {error && (
        <p role="alert" className="mt-1 text-xs text-zen-danger">{error}</p>
      )}
    </div>
  );
}

export function ContactPage() {
  const { t } = useLingui();
  const SUBJECTS = [
    { value: 'support', label: t`Soporte técnico` },
    { value: 'billing', label: t`Cuenta y facturación` },
    { value: 'content', label: t`Reporte de contenido` },
    { value: 'other',   label: t`Otro` },
  ];
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
    'min-h-11 w-full rounded-zen border border-glass-light-border bg-glass-light-2 px-3 py-2.5 text-sm text-zen-ink backdrop-blur-md transition placeholder:text-zen-ink/50 focus:border-zen focus:outline-none focus:ring-2 focus:ring-zen/40 dark:border-glass-dark-border dark:bg-glass-dark-2 dark:text-white dark:placeholder:text-white/40';
  const errorInputClass = 'border-zen-danger focus:ring-zen-danger/40';

  return (
    <PublicLayout>
      <SEOHead
        title={t`Contacto`}
        description={t`¿Tienes alguna pregunta o problema con CertZen? Escríbenos y te respondemos lo antes posible.`}
        path="/contact"
      />

      <div id="main-content" />

      <main id="contact-content" tabIndex={-1} className="max-w-3xl mx-auto px-4 py-12">
        <div className="mb-10">
          <h1 className="mb-2 text-3xl font-extrabold tracking-tight"><Trans>Contacto</Trans></h1>
          <p className="text-sm text-zen-ink/70 dark:text-white/60">
            <Trans>¿Tienes dudas, encontraste un bug o necesitas ayuda? Escríbenos y te respondemos en máximo</Trans>
            <strong className="font-semibold text-zen-ink dark:text-white"> <Trans>2 días hábiles</Trans></strong>.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-5">
          {/* Contact info column */}
          <aside className="md:col-span-2 space-y-5" aria-label={t`Información de contacto`}>
            <GlassCard className="space-y-4 p-5">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-zen-ink/60 dark:text-white/50">
                <Trans>Canales de soporte</Trans>
              </h2>
              <ul className="space-y-3 text-sm" role="list">
                <li className="flex items-start gap-3">
                  <span className="text-lg" aria-hidden="true">✉️</span>
                  <div>
                    <p className="mb-0.5 text-xs text-zen-ink/50 dark:text-white/40"><Trans>Soporte general</Trans></p>
                    <a href="mailto:support@certzen.app" className="text-zen underline hover:text-zen-violet dark:text-indigo-300 dark:hover:text-indigo-200">
                      support@certzen.app
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-lg" aria-hidden="true">🔒</span>
                  <div>
                    <p className="mb-0.5 text-xs text-zen-ink/50 dark:text-white/40"><Trans>Privacidad y legal</Trans></p>
                    <a href="mailto:privacy@certzen.app" className="text-zen underline hover:text-zen-violet dark:text-indigo-300 dark:hover:text-indigo-200">
                      privacy@certzen.app
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-lg" aria-hidden="true">⚡</span>
                  <div>
                    <p className="mb-0.5 text-xs text-zen-ink/50 dark:text-white/40"><Trans>Tiempo de respuesta</Trans></p>
                    <p className="text-zen-ink/80 dark:text-white/70"><Trans>≤ 2 días hábiles</Trans></p>
                  </div>
                </li>
              </ul>
            </GlassCard>

            <GlassCard className="space-y-2 p-5">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-zen-ink/60 dark:text-white/50">
                <Trans>Recursos útiles</Trans>
              </h2>
              <ul className="space-y-1 text-sm" role="list">
                <li>
                  <Link to="/about" className="text-zen transition-colors hover:text-zen-violet dark:text-indigo-300 dark:hover:text-indigo-200">
                    <Trans>Cómo funciona CertZen →</Trans>
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="text-zen transition-colors hover:text-zen-violet dark:text-indigo-300 dark:hover:text-indigo-200">
                    <Trans>Política de privacidad →</Trans>
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="text-zen transition-colors hover:text-zen-violet dark:text-indigo-300 dark:hover:text-indigo-200">
                    <Trans>Términos de uso →</Trans>
                  </Link>
                </li>
              </ul>
            </GlassCard>
          </aside>

          {/* Form column */}
          <div className="md:col-span-3">
            {sent ? (
              <div
                role="status"
                aria-live="polite"
                className="rounded-2xl border border-glass-light-border bg-glass-light-2 p-8 text-center space-y-3 backdrop-blur-md dark:border-glass-dark-border dark:bg-glass-dark-2"
              >
                <span className="text-4xl" aria-hidden="true">✅</span>
                <h2 className="text-xl font-bold"><Trans>¡Mensaje enviado!</Trans></h2>
                <p className="text-sm text-zen-ink/70 dark:text-white/60">
                  <Trans>Recibimos tu mensaje y te responderemos en máximo 2 días hábiles.</Trans>
                </p>
                <button
                  type="button"
                  onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }); }}
                  className="mt-2 min-h-11 text-sm text-zen-ink/70 underline transition-colors hover:text-zen-ink dark:text-white/60 dark:hover:text-white"
                >
                  <Trans>Enviar otro mensaje</Trans>
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                noValidate
                aria-label={t`Formulario de contacto`}
                className="space-y-5 rounded-2xl border border-glass-light-border bg-glass-light-2 p-6 backdrop-blur-md dark:border-glass-dark-border dark:bg-glass-dark-2 sm:p-7"
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
                  <SubjectSelect
                    id={subjectId}
                    name="subject"
                    value={form.subject}
                    options={SUBJECTS}
                    placeholder={t`Selecciona un asunto…`}
                    onChange={(value) => {
                      setForm(prev => ({ ...prev, subject: value }));
                      setErrors(prev => ({ ...prev, subject: undefined }));
                    }}
                    error={errors.subject}
                    inputClass={inputClass}
                    errorInputClass={errorInputClass}
                  />
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

                <GlassButton type="submit" disabled={sending} className="w-full">
                  {sending ? <Trans>Enviando…</Trans> : <Trans>Enviar mensaje</Trans>}
                </GlassButton>

                {submitError && (
                  <p role="alert" className="text-center text-xs text-zen-danger">{submitError}</p>
                )}

                <p className="text-center text-xs text-zen-ink/50 dark:text-white/40">
                  <Trans>Al enviar aceptas nuestra</Trans>{' '}
                  <Link to="/privacy" className="underline transition-colors hover:text-zen-ink dark:hover:text-white">
                    <Trans>política de privacidad</Trans>
                  </Link>
                  .
                </p>
              </form>
            )}
          </div>
        </div>
      </main>

    </PublicLayout>
  );
}
