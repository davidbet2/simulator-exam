import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAdmin } from '../hooks/useAdmin';
import { QuestionForm } from '../components/QuestionForm';
import { ImportModal } from '../components/ImportModal';
import { CERTIFICATIONS } from '../../../core/constants/certifications';

export function AdminQuestionsPage() {
  const { questions, loading, error, fetchQuestions, addQuestion, updateQuestion, deleteQuestion, importQuestions, fetchCertifications } =
    useAdmin();

  const [filters, setFilters] = useState({ category: '', level: '' });
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [showImport, setShowImport] = useState(false);
  const [certList, setCertList] = useState(CERTIFICATIONS);

  useEffect(() => {
    fetchCertifications().then((list) => { if (list) setCertList(list); });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchQuestions(filters);
  }, [filters, fetchQuestions]);

  async function handleSave(data) {
    let ok;
    if (editTarget) {
      ok = await updateQuestion(editTarget.id, data);
    } else {
      ok = await addQuestion(data);
    }
    if (ok) {
      setShowForm(false);
      setEditTarget(null);
      fetchQuestions(filters);
    }
  }

  async function handleDelete(id) {
    await deleteQuestion(id);
    setDeleteConfirm(null);
  }

  const certOptions = [
    { value: '', label: 'Todas las certificaciones' },
    ...certList.map((c) => ({ value: c.id, label: c.labelEs })),
  ];

  function handleCertFilter(value) {
    if (!value) {
      setFilters({ category: '', level: '' });
    } else {
      const cert = certList.find((c) => c.id === value);
      const category = cert?.category ?? value.split('-')[0];
      const level = cert?.level ?? value.split('-').slice(1).join('-');
      setFilters({ category, level });
    }
  }

  return (
    <div className="min-h-screen bg-appian-bg">
      {/* Topbar */}
      <header className="bg-white shadow-sm px-6 py-4 flex items-center gap-4">
        <Link to="/admin" className="text-appian-muted hover:text-appian-blue text-sm">← Dashboard</Link>
        <div className="h-4 border-l border-gray-300" />
        <h1 className="font-bold text-gray-800 text-base">Gestionar Preguntas</h1>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <select
            onChange={(e) => handleCertFilter(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-appian-blue flex-1"
          >
            {certOptions.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <button
            onClick={() => { setEditTarget(null); setShowForm(true); }}
            className="bg-appian-blue hover:bg-appian-blue-dark text-white font-bold px-5 py-2 rounded text-sm transition-colors whitespace-nowrap"
          >
            + Nueva pregunta
          </button>
          <button
            onClick={() => setShowImport(true)}
            className="border border-appian-blue text-appian-blue hover:bg-appian-blue-light font-bold px-5 py-2 rounded text-sm transition-colors whitespace-nowrap"
          >
            ↑ Importar JSON
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-appian-error-light text-appian-error text-sm rounded p-3 mb-4">{error}</div>
        )}

        {/* Loading */}
        {loading && (
          <div className="text-appian-muted text-sm py-10 text-center">Cargando preguntas...</div>
        )}

        {/* Empty */}
        {!loading && questions.length === 0 && (
          <div className="text-center py-16 bg-white rounded-lg border border-gray-100">
            <p className="text-appian-muted text-sm">No hay preguntas para esta selección.</p>
            <button
              onClick={() => { setEditTarget(null); setShowForm(true); }}
              className="mt-3 text-appian-blue text-sm font-semibold hover:underline"
            >
              Agregar la primera pregunta
            </button>
          </div>
        )}

        {/* Table */}
        {!loading && questions.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
              <span className="text-xs text-appian-muted font-semibold">
                {questions.length} pregunta{questions.length !== 1 ? 's' : ''}
              </span>
            </div>
            <ul className="divide-y divide-gray-100">
              {questions.map((q) => {
                const cert = CERTIFICATIONS.find(
                  (c) => c.category === q.category && c.level === q.level
                );
                return (
                  <li key={q.id} className="px-5 py-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-800 line-clamp-2">{q.question}</p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="text-xs bg-appian-blue-light text-appian-blue font-semibold px-1.5 py-0.5 rounded">
                            {cert?.labelEs ?? `${q.category} / ${q.level}`}
                          </span>
                          {q.type && q.type !== 'multiple' && (
                            <span className="text-xs bg-purple-100 text-purple-700 font-semibold px-1.5 py-0.5 rounded capitalize">
                              {q.type === 'ordering' ? 'ordenamiento' : 'emparejamiento'}
                            </span>
                          )}
                          {q.explanation && (
                            <span className="text-xs bg-yellow-100 text-yellow-700 font-semibold px-1.5 py-0.5 rounded" title={q.explanation}>💡 Justificación</span>
                          )}
                          <span className="text-xs text-appian-muted">
                            {q.type === 'ordering'
                              ? `${q.items?.length ?? 0} pasos`
                              : q.type === 'matching'
                              ? `${q.pairs?.length ?? 0} pares`
                              : `${Object.keys(q.options ?? {}).length} opciones · Respuesta: ${(q.answer ?? []).join(', ')}`}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => { setEditTarget(q); setShowForm(true); }}
                          className="text-xs text-appian-blue hover:underline font-semibold"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(q.id)}
                          className="text-xs text-appian-error hover:underline font-semibold"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </main>

      {/* Add/Edit modal */}
      {showForm && (
        <QuestionForm
          initial={editTarget}
          certifications={certList}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditTarget(null); }}
          loading={loading}
        />
      )}

      {/* Import JSON modal */}
      {showImport && (
        <ImportModal
          certifications={certList}
          onImport={async (questions, category, level) => {
            const res = await importQuestions(questions, category, level);
            if (res.ok) fetchQuestions(filters);
            return res;
          }}
          onClose={() => setShowImport(false)}
        />
      )}

      {/* Delete confirm modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full">
            <h3 className="font-bold text-gray-800 mb-2">¿Eliminar pregunta?</h3>
            <p className="text-sm text-appian-muted mb-6">Esta acción no se puede deshacer.</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-sm border border-gray-300 rounded text-gray-600 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="px-4 py-2 text-sm bg-appian-error text-white font-bold rounded hover:opacity-90"
              >
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
