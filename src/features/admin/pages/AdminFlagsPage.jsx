import { useEffect, useState } from 'react';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Flag, Save, AlertCircle, CheckCircle2 } from 'lucide-react';
import { AdminShell } from '../components/AdminShell';
import { db } from '../../../core/firebase/firebase';
import { useFeatureFlags, DEFAULT_FLAGS } from '../../../core/hooks/useFeatureFlags';
import { useAuthStore } from '../../../core/store/useAuthStore';
import { useAudit } from '../hooks/useAudit';
import Button from '../../../components/ui/Button';
import { GlassCard } from '../../../components/glass/GlassCard';
import { GlassBadge } from '../../../components/glass/GlassBadge';

/**
 * Human-readable metadata for each flag. Add new flags here + in DEFAULT_FLAGS.
 */
const FLAG_META = [
  { key: 'registrationEnabled',  label: 'Registro de usuarios',  desc: 'Permite que nuevos usuarios se registren con email o Google.' },
  { key: 'googleLoginEnabled',   label: 'Login con Google',      desc: 'Habilita el botón "Continuar con Google" en login/registro.' },
  { key: 'creatorEnabled',       label: 'Creador de exámenes',    desc: 'Los usuarios pueden crear y publicar sus propios sets.' },
  { key: 'publicExploreEnabled', label: 'Explorador público',    desc: 'La sección /explore es accesible para cualquier usuario.' },
  { key: 'xlsxImportEnabled',    label: 'Importar desde XLSX',   desc: 'Los usuarios pueden importar preguntas desde archivos Excel.' },
  { key: 'pdfImportEnabled',     label: 'Importar desde PDF',    desc: 'Los usuarios pueden importar preguntas desde archivos PDF.' },
  { key: 'adsEnabled',          label: 'Publicidad (AdSense)',   desc: 'Muestra banners de publicidad a usuarios free y visitantes. Desactiva para retirar todos los anuncios.' },
  { key: 'maintenanceMode',      label: 'Modo mantenimiento',    desc: 'Bloquea el acceso a todo excepto el panel admin. ¡Cuidado!', danger: true },
];

function Toggle({ checked, onChange, disabled }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      disabled={disabled}
      className={[
        'relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors',
        checked ? 'bg-zen-brand' : 'bg-glass-light-3 dark:bg-glass-dark-3',
        disabled && 'opacity-50 cursor-not-allowed',
      ].filter(Boolean).join(' ')}
    >
      <span
        className={`inline-block h-5 w-5 rounded-full bg-white shadow transform transition-transform ${
          checked ? 'translate-x-5' : 'translate-x-0.5'
        } translate-y-0.5`}
      />
    </button>
  );
}

export function AdminFlagsPage() {
  const { flags, loading } = useFeatureFlags();
  const user = useAuthStore((s) => s.user);
  const { logAction } = useAudit();

  const [draft, setDraft]     = useState(DEFAULT_FLAGS);
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState(null);
  const [saved, setSaved]     = useState(false);

  // Sync draft when live flags load/change (unless user is mid-edit).
  useEffect(() => {
    if (!loading) setDraft(flags);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  const dirty = Object.keys(DEFAULT_FLAGS).some((k) => draft[k] !== flags[k]);

  function toggle(key, next) {
    setDraft((p) => ({ ...p, [key]: next }));
    setSaved(false);
  }

  async function handleSave() {
    setSaving(true); setError(null); setSaved(false);
    try {
      const changedKeys = Object.keys(DEFAULT_FLAGS).filter((k) => draft[k] !== flags[k]);
      await setDoc(
        doc(db, 'featureFlags', 'global'),
        {
          ...draft,
          updatedAt:    serverTimestamp(),
          updatedBy:    user?.email ?? 'admin',
        },
        { merge: true },
      );
      await logAction({
        action: 'featureFlags.update',
        target: 'featureFlags',
        targetId: 'global',
        diff: changedKeys.reduce((acc, k) => {
          acc[k] = { from: flags[k], to: draft[k] };
          return acc;
        }, {}),
      });
      setSaved(true);
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  function handleDiscard() {
    setDraft(flags);
    setSaved(false);
    setError(null);
  }

  return (
    <AdminShell
      title="Feature flags"
      subtitle="Activa o desactiva funcionalidades globales sin redeploy. Los cambios se aplican en tiempo real."
      actions={
        dirty ? (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleDiscard} disabled={saving}>
              Descartar
            </Button>
            <Button size="sm" onClick={handleSave} disabled={saving} className="inline-flex items-center">
              <Save size={13} className="mr-1.5" />{saving ? 'Guardando…' : 'Guardar cambios'}
            </Button>
          </div>
        ) : saved ? (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-zen-success">
            <CheckCircle2 size={13} /> Guardado
          </span>
        ) : null
      }
    >
      {error && (
        <div className="mb-4 flex items-center gap-1.5 rounded-lg border border-zen-danger/30 bg-zen-danger/10 px-3 py-2 text-xs text-zen-danger">
          <AlertCircle size={13} /> {error}
        </div>
      )}

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl bg-glass-light-2 dark:bg-glass-dark-2" />
          ))}
        </div>
      ) : (
        <GlassCard className="overflow-hidden">
          <ul className="divide-y divide-glass-light-border dark:divide-glass-dark-border">
            {FLAG_META.map((f) => (
              <li key={f.key} className="flex items-center gap-4 px-5 py-4">
                <Flag
                  size={16}
                  className={f.danger ? 'shrink-0 text-zen-danger' : 'shrink-0 text-zen'}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold">{f.label}</p>
                    {f.danger && <GlassBadge tone="danger">destructivo</GlassBadge>}
                  </div>
                  <p className="mt-0.5 text-xs text-zen-ink/50 dark:text-white/50">{f.desc}</p>
                </div>
                <Toggle
                  checked={!!draft[f.key]}
                  onChange={(next) => toggle(f.key, next)}
                  disabled={saving}
                />
              </li>
            ))}
          </ul>
        </GlassCard>
      )}
    </AdminShell>
  );
}
