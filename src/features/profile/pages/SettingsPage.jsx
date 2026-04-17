import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Trans, useLingui } from '@lingui/react/macro';
import {
  Pencil, Check, X, Crown, Mail, Trash2, ShieldAlert,
} from 'lucide-react';
import { useAuthStore } from '../../../core/store/useAuthStore';
import { useThemeStore } from '../../../core/store/useThemeStore';
import { useTranslation, SUPPORTED_LANGS } from '../../../core/i18n';
import { AppShell } from '../../../components/layout/AppShell';
import { Card, CardBody } from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';

function Section({ title, children }) {
  return (
    <section className="space-y-3">
      <h2 className="text-xs font-bold uppercase tracking-wider text-ink-muted">{title}</h2>
      {children}
    </section>
  );
}

function Row({ title, subtitle, children, danger }) {
  return (
    <div className={`flex items-center justify-between gap-4 py-4 px-5 ${danger ? '' : ''}`}>
      <div className="min-w-0 flex-1">
        <p className={`text-sm font-semibold ${danger ? 'text-danger-600' : 'text-ink'}`}>{title}</p>
        {subtitle && <p className="text-xs text-ink-muted mt-0.5 break-words">{subtitle}</p>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function Divider() {
  return <div className="border-t border-surface-border" />;
}

function ModeSelect() {
  const { mode, setMode } = useThemeStore();
  const { t: tMacro } = useLingui();
  const options = [
    { id: 'light', label: tMacro`Claro` },
    { id: 'dark', label: tMacro`Oscuro` },
    { id: 'auto', label: tMacro`Auto` },
  ];
  return (
    <select
      value={mode}
      onChange={(e) => setMode(e.target.value)}
      className="h-9 px-3 pr-8 rounded-full bg-surface-muted border border-surface-border text-sm font-medium text-ink hover:border-brand-500 focus:outline-none focus:border-brand-500 transition-colors cursor-pointer appearance-none"
      style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center' }}
    >
      {options.map((o) => (
        <option key={o.id} value={o.id}>{o.label}</option>
      ))}
    </select>
  );
}

function LangSelect() {
  const { lang, setLang } = useTranslation();
  const current = SUPPORTED_LANGS.find((l) => l.id === lang) ?? SUPPORTED_LANGS[0];
  return (
    <select
      value={current.id}
      onChange={(e) => setLang(e.target.value)}
      className="h-9 px-3 pr-8 rounded-full bg-surface-muted border border-surface-border text-sm font-medium text-ink hover:border-brand-500 focus:outline-none focus:border-brand-500 transition-colors cursor-pointer appearance-none"
      style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center' }}
    >
      {SUPPORTED_LANGS.map((l) => (
        <option key={l.id} value={l.id}>{l.label}</option>
      ))}
    </select>
  );
}

function Toggle({ checked, onChange, ariaLabel }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
        checked ? 'bg-brand-500' : 'bg-surface-muted ring-1 ring-surface-border ring-inset'
      }`}
    >
      <span
        aria-hidden="true"
        className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm ring-0 transition-transform duration-200 ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
}

export function SettingsPage() {
  const navigate = useNavigate();
  const { user, displayName, isPro, updateDisplayName } = useAuthStore();
  const { t: tMacro } = useLingui();

  const [editingName, setEditingName] = useState(false);
  const [nameValue, setNameValue] = useState(displayName ?? '');
  const [savingName, setSavingName] = useState(false);
  const [nameError, setNameError] = useState(null);

  // Notification toggles (local-only for now; stubbed to localStorage)
  const [notifStudy, setNotifStudy] = useState(
    () => JSON.parse(localStorage.getItem('certzen:notif:study') ?? 'true')
  );
  const [notifNews, setNotifNews] = useState(
    () => JSON.parse(localStorage.getItem('certzen:notif:news') ?? 'true')
  );
  const [notifPromos, setNotifPromos] = useState(
    () => JSON.parse(localStorage.getItem('certzen:notif:promos') ?? 'false')
  );
  const persist = (key, value, setter) => {
    localStorage.setItem(`certzen:notif:${key}`, JSON.stringify(value));
    setter(value);
  };

  async function saveName() {
    const trimmed = nameValue.trim();
    if (trimmed.length < 2) { setNameError(tMacro`Mínimo 2 caracteres.`); return; }
    if (trimmed.length > 40) { setNameError(tMacro`Máximo 40 caracteres.`); return; }
    setSavingName(true);
    setNameError(null);
    try {
      await updateDisplayName(user.uid, trimmed);
      setEditingName(false);
    } catch (err) {
      setNameError(err.message ?? tMacro`Error al guardar`);
    } finally {
      setSavingName(false);
    }
  }

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <AppShell>
      <Helmet>
        <title>{tMacro`Ajustes`} — CertZen</title>
      </Helmet>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-10">
        <h1 className="text-3xl font-bold text-ink"><Trans>Ajustes</Trans></h1>

        {/* Suscripción */}
        <Section title={tMacro`Suscripción`}>
          <Card>
            <CardBody className="p-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-base font-semibold text-ink flex items-center gap-2">
                  {isPro ? (
                    <><Crown size={16} className="text-accent-amber" />CertZen Plus</>
                  ) : (
                    'CertZen Free'
                  )}
                </p>
                <p className="text-xs text-ink-muted mt-1">
                  {isPro
                    ? <Trans>Acceso ilimitado a exámenes y funciones premium.</Trans>
                    : <Trans>Plan gratuito. Actualiza para acceso ilimitado.</Trans>}
                </p>
              </div>
              {!isPro && (
                <Button size="sm" onClick={() => navigate('/pricing')}>
                  <Trans>Actualizar</Trans>
                </Button>
              )}
            </CardBody>
          </Card>
        </Section>

        {/* Información personal */}
        <Section title={tMacro`Información personal`}>
          <Card>
            <div className="divide-y divide-surface-border">
              <Row
                title={tMacro`Nombre`}
                subtitle={!editingName ? (displayName ?? '—') : null}
              >
                {editingName ? (
                  <div className="flex flex-col items-end gap-1">
                    <div className="flex gap-1">
                      <input
                        autoFocus
                        type="text"
                        value={nameValue}
                        onChange={(e) => setNameValue(e.target.value)}
                        maxLength={40}
                        className="h-9 px-3 rounded-md bg-surface-muted border border-surface-border text-sm text-ink focus:outline-none focus:border-brand-500"
                      />
                      <button
                        type="button"
                        onClick={saveName}
                        disabled={savingName}
                        className="h-9 w-9 flex items-center justify-center rounded-md bg-brand-500 text-white hover:bg-brand-600 disabled:opacity-50"
                        aria-label={tMacro`Guardar`}
                      >
                        <Check size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => { setEditingName(false); setNameError(null); }}
                        className="h-9 w-9 flex items-center justify-center rounded-md bg-surface-muted border border-surface-border text-ink-soft hover:bg-surface-muted"
                        aria-label={tMacro`Cancelar`}
                      >
                        <X size={14} />
                      </button>
                    </div>
                    {nameError && <p className="text-xs text-danger-600">{nameError}</p>}
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => { setNameValue(displayName ?? ''); setEditingName(true); }}
                    className="text-sm text-brand-600 font-medium hover:underline flex items-center gap-1"
                  >
                    <Pencil size={12} /><Trans>Editar</Trans>
                  </button>
                )}
              </Row>
              <Row title={tMacro`Email`} subtitle={user.email}>
                <span className="text-xs text-ink-muted flex items-center gap-1">
                  <Mail size={12} /><Trans>Verificado</Trans>
                </span>
              </Row>
            </div>
          </Card>
        </Section>

        {/* Apariencia */}
        <Section title={tMacro`Apariencia`}>
          <Card>
            <div className="divide-y divide-surface-border">
              <Row title={tMacro`Modo`} subtitle={tMacro`Auto sigue el tema del sistema`}>
                <ModeSelect />
              </Row>
              <Row title={tMacro`Idioma`} subtitle={tMacro`La interfaz se traduce al idioma seleccionado`}>
                <LangSelect />
              </Row>
            </div>
          </Card>
        </Section>

        {/* Notificaciones */}
        <Section title={tMacro`Notificaciones`}>
          <Card>
            <div className="divide-y divide-surface-border">
              <Row
                title={tMacro`Actualizaciones de estudio`}
                subtitle={tMacro`Recordatorios, rutinas e insignias`}
              >
                <Toggle
                  checked={notifStudy}
                  onChange={(v) => persist('study', v, setNotifStudy)}
                  ariaLabel={tMacro`Activar actualizaciones de estudio`}
                />
              </Row>
              <Row
                title={tMacro`Novedades de CertZen`}
                subtitle={tMacro`Nuevas funciones y consejos`}
              >
                <Toggle
                  checked={notifNews}
                  onChange={(v) => persist('news', v, setNotifNews)}
                  ariaLabel={tMacro`Activar novedades`}
                />
              </Row>
              <Row
                title={tMacro`Promociones`}
                subtitle={tMacro`Ofertas y sorteos`}
              >
                <Toggle
                  checked={notifPromos}
                  onChange={(v) => persist('promos', v, setNotifPromos)}
                  ariaLabel={tMacro`Activar promociones`}
                />
              </Row>
            </div>
          </Card>
        </Section>

        {/* Cuenta y privacidad */}
        <Section title={tMacro`Cuenta y privacidad`}>
          <Card>
            <div className="divide-y divide-surface-border">
              <Row title={tMacro`Cambiar la contraseña`} subtitle={tMacro`Cambia tu contraseña por email`}>
                <button
                  type="button"
                  onClick={() => navigate('/login?reset=1')}
                  className="text-sm text-brand-600 font-medium hover:underline"
                >
                  <Trans>Editar</Trans>
                </button>
              </Row>
              <Row
                title={tMacro`Elimina tu cuenta`}
                subtitle={tMacro`Esta acción borrará todos tus datos y no puede deshacerse.`}
                danger
              >
                <button
                  type="button"
                  disabled
                  title={tMacro`Contacta soporte para eliminar tu cuenta`}
                  className="h-9 px-4 rounded-full bg-danger-500/10 text-danger-600 text-sm font-semibold border border-danger-500/20 opacity-60 cursor-not-allowed flex items-center gap-1.5"
                >
                  <Trash2 size={12} /><Trans>Borrar cuenta</Trans>
                </button>
              </Row>
            </div>
          </Card>
          <p className="text-xs text-ink-muted flex items-center gap-1.5 px-1">
            <ShieldAlert size={12} />
            <Trans>La eliminación de cuenta está temporalmente manejada por soporte.</Trans>
          </p>
        </Section>
      </div>
    </AppShell>
  );
}
