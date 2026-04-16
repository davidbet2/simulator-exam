import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '../../../core/firebase/firebase';
import { useAdmin } from '../hooks/useAdmin';
import { CERTIFICATIONS } from '../../../core/constants/certifications';

// ── helpers ──────────────────────────────────────────────────────
function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

const COLOR_OPTIONS = ['blue', 'purple', 'green', 'orange', 'red', 'pink'];

const COLOR_BADGE = {
  blue:   'bg-appian-blue text-white',
  purple: 'bg-purple-600 text-white',
  green:  'bg-green-600 text-white',
  orange: 'bg-orange-500 text-white',
  red:    'bg-red-500 text-white',
  pink:   'bg-pink-500 text-white',
};

const COLOR_DOT = {
  blue:   'bg-appian-blue',
  purple: 'bg-purple-600',
  green:  'bg-green-600',
  orange: 'bg-orange-500',
  red:    'bg-red-500',
  pink:   'bg-pink-500',
};

// ── NumField ─────────────────────────────────────────────────────
function NumField({ label, value, onChange, min, max, unit }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <label className="text-sm text-gray-700 flex-1">{label}</label>
      <div className="flex items-center gap-1.5">
        <input
          type="number"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-20 border border-gray-300 rounded px-2 py-1.5 text-sm text-center focus:outline-none focus:border-appian-blue"
        />
        {unit && <span className="text-xs text-appian-muted">{unit}</span>}
      </div>
    </div>
  );
}

// ── CertCard ──────────────────────────────────────────────────────
function CertCard({ cert, onSave, onDelete }) {
  const [vals, setVals] = useState({
    labelEs:       cert.labelEs,
    category:      cert.category,
    available:     cert.available,
    color:         cert.color ?? 'blue',
    questionCount: cert.questionCount,
    timeMinutes:   cert.timeMinutes,
    passPercent:   cert.passPercent,
  });
  const [saving, setSaving]   = useState(false);
  const [saved, setSaved]     = useState(false);
  const [err, setErr]         = useState(null);
  const [confirmDel, setConfirmDel] = useState(false);

  function set(key) {
    return (v) => { setSaved(false); setVals((p) => ({ ...p, [key]: v })); };
  }

  async function handleSave() {
    if (!vals.labelEs.trim()) { setErr('El nombre no puede estar vacío.'); return; }
    setErr(null); setSaving(true);
    const ok = await onSave(cert.id, vals);
    setSaving(false);
    if (ok) setSaved(true);
    else setErr('Error al guardar. Intenta de nuevo.');
  }

  return (
    <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-5">
      {/* Header */}
      <div className="flex items-start justify-between mb-4 gap-2">
        <div className="flex-1 min-w-0">
          <input
            value={vals.labelEs}
            onChange={(e) => set('labelEs')(e.target.value)}
            className="font-bold text-gray-800 text-sm w-full border-b border-transparent hover:border-gray-300 focus:border-appian-blue focus:outline-none pb-0.5 bg-transparent"
            placeholder="Nombre del examen"
          />
          <p className="text-xs text-appian-muted mt-0.5">{cert.id}</p>
        </div>
        {/* Available toggle */}
        <button
          onClick={() => { setSaved(false); setVals((p) => ({ ...p, available: !p.available })); }}
          className={`text-xs font-semibold px-2 py-0.5 rounded shrink-0 transition-colors ${
            vals.available
              ? 'bg-green-100 text-green-700 hover:bg-green-200'
              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
          }`}
        >
          {vals.available ? '✓ Disponible' : 'Próximamente'}
        </button>
      </div>

      {/* Color picker */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs text-appian-muted">Color:</span>
        {COLOR_OPTIONS.map((c) => (
          <button
            key={c}
            title={c}
            onClick={() => set('color')(c)}
            className={`w-5 h-5 rounded-full ${COLOR_DOT[c]} ${vals.color === c ? 'ring-2 ring-offset-1 ring-gray-700' : 'opacity-60 hover:opacity-100'}`}
          />
        ))}
      </div>

      {/* Settings fields */}
      <div className="flex flex-col gap-3 mb-5">
        <NumField label="Número de preguntas" value={vals.questionCount} onChange={set('questionCount')} min={1} max={500} unit="preguntas" />
        <NumField label="Tiempo límite"        value={vals.timeMinutes}   onChange={set('timeMinutes')}   min={1} max={480} unit="minutos"   />
        <NumField label="Puntaje mínimo"       value={vals.passPercent}   onChange={set('passPercent')}   min={1} max={100} unit="%"         />
      </div>

      {err && <p className="text-red-500 text-xs mb-3">{err}</p>}

      <div className="flex items-center justify-between gap-3">
        {/* Delete */}
        {confirmDel ? (
          <div className="flex items-center gap-2">
            <span className="text-xs text-red-500">¿Eliminar?</span>
            <button onClick={() => onDelete(cert.id)} className="text-xs text-red-600 font-bold hover:underline">Sí</button>
            <button onClick={() => setConfirmDel(false)} className="text-xs text-gray-500 hover:underline">Cancelar</button>
          </div>
        ) : (
          <button onClick={() => setConfirmDel(true)} className="text-xs text-red-400 hover:text-red-600 transition-colors">
            Eliminar
          </button>
        )}

        <div className="flex items-center gap-3">
          {saved && <span className="text-green-600 text-xs font-semibold">✓ Guardado</span>}
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-appian-blue hover:bg-appian-blue-dark text-white text-xs font-bold px-4 py-1.5 rounded transition-colors disabled:opacity-50"
          >
            {saving ? 'Guardando…' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── NewCertForm ───────────────────────────────────────────────────
const EMPTY_FORM = { labelEs: '', category: 'developer', color: 'blue', questionCount: 50, timeMinutes: 60, passPercent: 60, available: false };

function NewCertForm({ existingIds, onCreate, onCancel }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState(null);

  const generatedId = slugify(form.labelEs) || 'nueva-certificacion';
  const isDuplicate = existingIds.includes(generatedId);

  function set(key) {
    return (v) => setForm((p) => ({ ...p, [key]: v }));
  }

  async function handleCreate() {
    if (!form.labelEs.trim()) { setErr('El nombre es obligatorio.'); return; }
    if (isDuplicate) { setErr(`Ya existe una certificación con id "${generatedId}".`); return; }
    setErr(null); setSaving(true);
    const ok = await onCreate(generatedId, {
      labelEs:       form.labelEs.trim(),
      category:      form.category,
      color:         form.color,
      questionCount: form.questionCount,
      timeMinutes:   form.timeMinutes,
      passPercent:   form.passPercent,
      available:     form.available,
      order:         existingIds.length,
    });
    setSaving(false);
    if (!ok) setErr('Error al crear. Intenta de nuevo.');
  }

  return (
    <div className="bg-white rounded-lg border-2 border-dashed border-appian-blue p-5">
      <h3 className="font-bold text-gray-800 text-sm mb-4">Nueva Certificación</h3>

      <div className="flex flex-col gap-3 mb-4">
        <div>
          <label className="text-xs text-appian-muted block mb-1">Nombre <span className="text-red-400">*</span></label>
          <input
            value={form.labelEs}
            onChange={(e) => set('labelEs')(e.target.value)}
            placeholder="Ej: Analista Senior"
            className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-appian-blue"
          />
          <p className={`text-xs mt-1 ${isDuplicate ? 'text-red-500' : 'text-appian-muted'}`}>
            ID: <span className="font-mono">{generatedId}</span>
            {isDuplicate && ' — ya existe'}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-appian-muted block mb-1">Categoría</label>
            <select
              value={form.category}
              onChange={(e) => { set('category')(e.target.value); set('color')(e.target.value === 'analyst' ? 'purple' : 'blue'); }}
              className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-appian-blue"
            >
              <option value="developer">Desarrollador</option>
              <option value="analyst">Analista</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-appian-muted block mb-1">Color</label>
            <div className="flex items-center gap-2 pt-1.5">
              {COLOR_OPTIONS.map((c) => (
                <button key={c} title={c} onClick={() => set('color')(c)}
                  className={`w-5 h-5 rounded-full ${COLOR_DOT[c]} ${form.color === c ? 'ring-2 ring-offset-1 ring-gray-700' : 'opacity-60 hover:opacity-100'}`}
                />
              ))}
            </div>
          </div>
        </div>

        <NumField label="Preguntas"      value={form.questionCount} onChange={set('questionCount')} min={1} max={500} unit="preguntas" />
        <NumField label="Tiempo"         value={form.timeMinutes}   onChange={set('timeMinutes')}   min={1} max={480} unit="minutos"   />
        <NumField label="Puntaje mínimo" value={form.passPercent}   onChange={set('passPercent')}   min={1} max={100} unit="%"         />

        <div className="flex items-center gap-2">
          <input type="checkbox" id="new-avail" checked={form.available} onChange={(e) => set('available')(e.target.checked)} />
          <label htmlFor="new-avail" className="text-sm text-gray-700 cursor-pointer">Disponible al publicar</label>
        </div>
      </div>

      {err && <p className="text-red-500 text-xs mb-3">{err}</p>}

      <div className="flex justify-end gap-3">
        <button onClick={onCancel} className="text-sm text-gray-500 hover:text-gray-700">Cancelar</button>
        <button
          onClick={handleCreate}
          disabled={saving}
          className="bg-appian-blue hover:bg-appian-blue-dark text-white text-xs font-bold px-4 py-1.5 rounded transition-colors disabled:opacity-50"
        >
          {saving ? 'Creando…' : 'Crear'}
        </button>
      </div>
    </div>
  );
}

// ── AdminSettingsPage ─────────────────────────────────────────────
export function AdminSettingsPage() {
  const { fetchCertifications, seedCertifications, saveCertification, createCertification, deleteCertification } = useAdmin();

  const [certs, setCerts]         = useState([]);
  const [loadState, setLoadState] = useState('loading'); // 'loading' | 'ready' | 'error'
  const [showNewForm, setShowNewForm] = useState(false);

  // ── Load certifications (seed from static list if Firestore is empty) ──
  const load = useCallback(async () => {
    setLoadState('loading');
    let list = await fetchCertifications();
    if (list === null) {
      // Fetch any legacy settings overrides, then seed
      let settingsMap = {};
      try {
        const snap = await getDocs(collection(db, 'settings'));
        snap.docs.forEach((d) => { settingsMap[d.id] = d.data(); });
      } catch { /* ignore */ }

      const toSeed = CERTIFICATIONS.map((cert, i) => {
        const s = settingsMap[cert.id] ?? {};
        return {
          id:            cert.id,
          labelEs:       cert.labelEs,
          category:      cert.category,
          color:         cert.color ?? 'blue',
          questionCount: s.questionCount ?? cert.questionCount,
          timeMinutes:   s.timeMinutes   ?? cert.timeMinutes,
          passPercent:   s.passPercent   ?? cert.passPercent,
          available:     cert.available,
          order:         i,
        };
      });
      await seedCertifications(toSeed);
      list = toSeed;
    }
    setCerts(list ?? []);
    setLoadState('ready');
  }, [fetchCertifications, seedCertifications]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); }, [load]);

  // ── handlers ──────────────────────────────────────────────────
  async function handleSave(id, data) {
    const ok = await saveCertification(id, data);
    if (ok) setCerts((prev) => prev.map((c) => c.id === id ? { ...c, ...data } : c));
    return ok;
  }

  async function handleDelete(id) {
    const ok = await deleteCertification(id);
    if (ok) setCerts((prev) => prev.filter((c) => c.id !== id));
  }

  async function handleCreate(id, data) {
    const ok = await createCertification(id, data);
    if (ok) {
      setCerts((prev) => [...prev, { id, ...data }]);
      setShowNewForm(false);
    }
    return ok;
  }

  // ── group by category ─────────────────────────────────────────
  const grouped = certs.reduce((acc, cert) => {
    const key = cert.category ?? 'other';
    if (!acc[key]) acc[key] = [];
    acc[key].push(cert);
    return acc;
  }, {});

  const CATEGORY_LABEL = { developer: 'Desarrollador', analyst: 'Analista' };

  return (
    <div className="min-h-screen bg-appian-bg">
      <header className="bg-white shadow-sm px-6 py-4 flex items-center gap-4">
        <Link to="/admin" className="text-appian-muted hover:text-appian-blue text-sm">← Dashboard</Link>
        <div className="h-4 border-l border-gray-300" />
        <h1 className="font-bold text-gray-800 text-base">Certificaciones</h1>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6">
        <p className="text-sm text-appian-muted mb-6">
          Activa, desactiva, edita o crea certificaciones. Los cambios se reflejan de inmediato en el simulador público.
        </p>

        {loadState === 'loading' && (
          <p className="text-sm text-appian-muted text-center py-12">Cargando…</p>
        )}

        {loadState === 'ready' && (
          <>
            {Object.entries(grouped).map(([category, list]) => (
              <div key={category} className="mb-8">
                <h2 className="text-xs font-bold uppercase tracking-wider text-appian-muted mb-3">
                  {CATEGORY_LABEL[category] ?? category}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {list.map((cert) => (
                    <CertCard
                      key={cert.id}
                      cert={cert}
                      onSave={handleSave}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              </div>
            ))}

            {/* New cert */}
            <div className="mt-2">
              {showNewForm ? (
                <NewCertForm
                  existingIds={certs.map((c) => c.id)}
                  onCreate={handleCreate}
                  onCancel={() => setShowNewForm(false)}
                />
              ) : (
                <button
                  onClick={() => setShowNewForm(true)}
                  className="w-full py-3 rounded-lg border-2 border-dashed border-gray-300 text-sm text-gray-500 hover:border-appian-blue hover:text-appian-blue transition-colors"
                >
                  + Agregar certificación
                </button>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
