import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  Pencil, Check, X, ChevronDown, Crown, Mail, Trash2,
  Sun, Moon, Monitor, ShieldAlert,
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
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, right: 0 });
  const btnRef = useRef(null);

  const options = [
    { id: 'light', label: t('settings.mode.light'), icon: Sun },
    { id: 'dark', label: t('settings.mode.dark'), icon: Moon },
    { id: 'auto', label: t('settings.mode.auto'), icon: Monitor },
  ];
  const current = options.find((o) => o.id === mode) ?? options[2];
  const CurrentIcon = current.icon;

  const handleOpen = () => {
    if (btnRef.current) {
      const r = btnRef.current.getBoundingClientRect();
      setCoords({ top: r.bottom + 6, right: window.innerWidth - r.right });
    }
    setOpen((v) => !v);
  };

  return (
    <div>
      <button
        ref={btnRef}
        type="button"
        onClick={handleOpen}
        className="h-9 px-3 rounded-full bg-surface-muted border border-surface-border flex items-center gap-2 text-sm font-medium text-ink hover:border-brand-500 transition-colors"
      >
        <CurrentIcon size={14} />
        {current.label}
        <ChevronDown size={14} className="text-ink-muted" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div
            className="fixed w-36 rounded-lg border border-surface-border bg-surface-card shadow-lg z-50 overflow-hidden"
            style={{ top: coords.top, right: coords.right }}
          >
            {options.map((o) => {
              const Icon = o.icon;
              return (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => { setMode(o.id); setOpen(false); }}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-surface-muted ${
                    mode === o.id ? 'text-brand-600 font-semibold' : 'text-ink'
                  }`}
                >
                  <Icon size={14} />{o.label}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

function LangSelect() {
  const { lang, setLang } = useTranslation();
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, right: 0 });
  const btnRef = useRef(null);
  const current = SUPPORTED_LANGS.find((l) => l.id === lang) ?? SUPPORTED_LANGS[0];

  const handleOpen = () => {
    if (btnRef.current) {
      const r = btnRef.current.getBoundingClientRect();
      setCoords({ top: r.bottom + 6, right: window.innerWidth - r.right });
    }
    setOpen((v) => !v);
  };

  return (
    <div>
      <button
        ref={btnRef}
        type="button"
        onClick={handleOpen}
        className="h-9 px-3 rounded-full bg-surface-muted border border-surface-border flex items-center gap-2 text-sm font-medium text-ink hover:border-brand-500 transition-colors"
      >
        {current.label}
        <ChevronDown size={14} className="text-ink-muted" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div
            className="fixed w-44 rounded-lg border border-surface-border bg-surface-card shadow-lg z-50 overflow-hidden"
            style={{ top: coords.top, right: coords.right }}
          >
            {SUPPORTED_LANGS.map((l) => (
              <button
                key={l.id}
                type="button"
                onClick={() => { setLang(l.id); setOpen(false); }}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-surface-muted ${
                  lang === l.id ? 'text-brand-600 font-semibold' : 'text-ink'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
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
  const { t } = useTranslation();

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
    if (trimmed.length < 2) { setNameError('Mínimo 2 caracteres.'); return; }
    if (trimmed.length > 40) { setNameError('Máximo 40 caracteres.'); return; }
    setSavingName(true);
    setNameError(null);
    try {
      await updateDisplayName(user.uid, trimmed);
      setEditingName(false);
    } catch (err) {
      setNameError(err.message ?? 'Error al guardar');
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
        <title>{t('settings.title')} — CertZen</title>
      </Helmet>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-10">
        <h1 className="text-3xl font-bold text-ink">{t('settings.title')}</h1>

        {/* Suscripción */}
        <Section title={t('settings.subscription')}>
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
                    ? 'Acceso ilimitado a exámenes y funciones premium.'
                    : 'Plan gratuito. Actualiza para acceso ilimitado.'}
                </p>
              </div>
              {!isPro && (
                <Button size="sm" onClick={() => navigate('/pricing')}>
                  Actualizar
                </Button>
              )}
            </CardBody>
          </Card>
        </Section>

        {/* Información personal */}
        <Section title={t('settings.personalInfo')}>
          <Card>
            <div className="divide-y divide-surface-border">
              <Row
                title="Nombre"
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
                        aria-label={t('common.save')}
                      >
                        <Check size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => { setEditingName(false); setNameError(null); }}
                        className="h-9 w-9 flex items-center justify-center rounded-md bg-surface-muted border border-surface-border text-ink-soft hover:bg-surface-muted"
                        aria-label={t('common.cancel')}
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
                    <Pencil size={12} />{t('common.edit')}
                  </button>
                )}
              </Row>
              <Row title="Email" subtitle={user.email}>
                <span className="text-xs text-ink-muted flex items-center gap-1">
                  <Mail size={12} />Verificado
                </span>
              </Row>
            </div>
          </Card>
        </Section>

        {/* Apariencia */}
        <Section title={t('settings.appearance')}>
          <Card>
            <div className="divide-y divide-surface-border">
              <Row title={t('settings.mode')} subtitle="Auto sigue el tema del sistema">
                <ModeSelect />
              </Row>
              <Row title={t('settings.language')} subtitle="La interfaz se traduce al idioma seleccionado">
                <LangSelect />
              </Row>
            </div>
          </Card>
        </Section>

        {/* Notificaciones */}
        <Section title={t('settings.notifications')}>
          <Card>
            <div className="divide-y divide-surface-border">
              <Row
                title="Actualizaciones de estudio"
                subtitle="Recordatorios, rutinas e insignias"
              >
                <Toggle
                  checked={notifStudy}
                  onChange={(v) => persist('study', v, setNotifStudy)}
                  ariaLabel="Activar actualizaciones de estudio"
                />
              </Row>
              <Row
                title="Novedades de CertZen"
                subtitle="Nuevas funciones y consejos"
              >
                <Toggle
                  checked={notifNews}
                  onChange={(v) => persist('news', v, setNotifNews)}
                  ariaLabel="Activar novedades"
                />
              </Row>
              <Row
                title="Promociones"
                subtitle="Ofertas y sorteos"
              >
                <Toggle
                  checked={notifPromos}
                  onChange={(v) => persist('promos', v, setNotifPromos)}
                  ariaLabel="Activar promociones"
                />
              </Row>
            </div>
          </Card>
        </Section>

        {/* Cuenta y privacidad */}
        <Section title={t('settings.account')}>
          <Card>
            <div className="divide-y divide-surface-border">
              <Row title={t('settings.changePassword')} subtitle="Cambia tu contraseña por email">
                <button
                  type="button"
                  onClick={() => navigate('/login?reset=1')}
                  className="text-sm text-brand-600 font-medium hover:underline"
                >
                  {t('common.edit')}
                </button>
              </Row>
              <Row
                title={t('settings.deleteAccount')}
                subtitle={t('settings.deleteAccountHelp')}
                danger
              >
                <button
                  type="button"
                  disabled
                  title="Contacta soporte para eliminar tu cuenta"
                  className="h-9 px-4 rounded-full bg-danger-500/10 text-danger-600 text-sm font-semibold border border-danger-500/20 opacity-60 cursor-not-allowed flex items-center gap-1.5"
                >
                  <Trash2 size={12} />Borrar cuenta
                </button>
              </Row>
            </div>
          </Card>
          <p className="text-xs text-ink-muted flex items-center gap-1.5 px-1">
            <ShieldAlert size={12} />
            La eliminación de cuenta está temporalmente manejada por soporte.
          </p>
        </Section>
      </div>
    </AppShell>
  );
}
