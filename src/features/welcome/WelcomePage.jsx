import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../core/firebase/firebase';
import { CERTIFICATIONS } from '../../core/constants/certifications';

const COLOR_CLASSES = {
  blue:   { bg: 'bg-blue-50',   border: 'border-blue-200',   badge: 'bg-appian-blue',  text: 'text-appian-blue'  },
  purple: { bg: 'bg-purple-50', border: 'border-purple-200', badge: 'bg-purple-600',   text: 'text-purple-700'   },
  green:  { bg: 'bg-green-50',  border: 'border-green-200',  badge: 'bg-green-600',    text: 'text-green-700'    },
  orange: { bg: 'bg-orange-50', border: 'border-orange-200', badge: 'bg-orange-500',   text: 'text-orange-700'   },
  red:    { bg: 'bg-red-50',    border: 'border-red-200',    badge: 'bg-red-500',       text: 'text-red-700'     },
  pink:   { bg: 'bg-pink-50',   border: 'border-pink-200',   badge: 'bg-pink-500',      text: 'text-pink-700'    },
};
const DEFAULT_COLORS = COLOR_CLASSES.blue;

const CATEGORY_LABEL = { developer: 'Desarrollador', analyst: 'Analista' };

function colorsFor(cert) {
  return COLOR_CLASSES[cert.color] ?? DEFAULT_COLORS;
}

export function WelcomePage() {
  const navigate = useNavigate();
  const [certs, setCerts]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [selectedCert, setSelectedCert] = useState(null);

  useEffect(() => {
    // Load certifications from Firestore; fall back to static list on failure
    getDocs(collection(db, 'certifications'))
      .then((snap) => {
        if (snap.empty) {
          setCerts(CERTIFICATIONS);
        } else {
          const list = snap.docs
            .map((d) => ({ id: d.id, ...d.data() }))
            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
          setCerts(list);
        }
      })
      .catch(() => setCerts(CERTIFICATIONS))
      .finally(() => setLoading(false));
  }, []);

  // Group by category for display
  const groupedCerts = certs.reduce((acc, cert) => {
    const key = cert.category ?? 'other';
    if (!acc[key]) acc[key] = [];
    acc[key].push(cert);
    return acc;
  }, {});

  function openModePicker(cert) {
    if (!cert.available) return;
    setSelectedCert(cert);
  }

  function startWithMode(mode) {
    if (!selectedCert) return;
    navigate(`/exam?cert=${selectedCert.id}&mode=${mode}`);
  }

  return (
    <>
      <div className="min-h-screen bg-appian-bg flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-2xl">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="text-3xl">🧩</span>
            <h1 className="text-2xl font-bold text-appian-blue">Simulador de Certificación</h1>
          </div>
          <p className="text-appian-muted text-sm">
            Selecciona el tipo de examen para comenzar tu práctica
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12 text-appian-muted text-sm">Cargando…</div>
        ) : (
          <>
            {/* Certification groups */}
            {Object.entries(groupedCerts).map(([category, certList]) => {
              // derive header color from first cert in the group
              const firstColors = colorsFor(certList[0]);
              const categoryLabel = CATEGORY_LABEL[category] ?? category;
              return (
                <div key={category} className="mb-6">
                  <h2 className={`text-sm font-bold uppercase tracking-wider mb-3 ${firstColors.text}`}>
                    {categoryLabel}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {certList.map((cert) => {
                      const colors = colorsFor(cert);
                      return (
                        <div
                          key={cert.id}
                          onClick={() => openModePicker(cert)}
                          className={`rounded-lg border p-5 transition-all ${
                            cert.available
                              ? `${colors.bg} ${colors.border} cursor-pointer hover:shadow-md hover:scale-[1.02]`
                              : 'bg-gray-50 border-gray-200 cursor-not-allowed opacity-60'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <h3 className="font-bold text-gray-800 text-sm">{cert.labelEs}</h3>
                            {cert.available ? (
                              <span className={`text-xs text-white font-semibold px-2 py-0.5 rounded ${colors.badge}`}>
                                Disponible
                              </span>
                            ) : (
                              <span className="text-xs bg-gray-200 text-gray-500 font-semibold px-2 py-0.5 rounded">
                                Próximamente
                              </span>
                            )}
                          </div>

                          <ul className="text-xs text-appian-muted space-y-1 mb-4">
                            <li>• <strong className="text-gray-700">{cert.questionCount} preguntas</strong> seleccionadas al azar</li>
                            <li>• <strong className="text-gray-700">{cert.timeMinutes} minutos</strong> de tiempo en Modo Examen</li>
                            <li>• Puntaje mínimo para aprobar: <strong className="text-gray-700">{cert.passPercent}%</strong></li>
                            <li>• Navegación libre entre preguntas</li>
                          </ul>

                          {cert.available && (
                            <button className={`w-full py-2 rounded text-white text-sm font-bold transition-colors ${colors.badge} hover:opacity-90`}>
                              Elegir modo →
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </>
        )}

        {/* Admin link */}
        <div className="text-center mt-6">
          <a
            href="/admin/login"
            className="text-xs text-gray-400 hover:text-appian-muted underline"
          >
            Acceso administrador
          </a>
        </div>
      </div>
    </div>

    {/* Mode picker modal */}
    {selectedCert && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-sm p-6">
          <h2 className="font-bold text-gray-800 text-base mb-1">{selectedCert.labelEs}</h2>
          <p className="text-appian-muted text-sm mb-5">¿En qué modo quieres practicar?</p>

          <div className="flex flex-col gap-3 mb-4">
            <button
              onClick={() => startWithMode('exam')}
              className="flex items-start gap-3 p-4 rounded border border-appian-blue bg-blue-50 hover:bg-appian-blue-light text-left transition-colors"
            >
              <span className="text-xl shrink-0">🎯</span>
              <div>
                <div className="font-bold text-appian-blue text-sm">Modo Examen</div>
                <div className="text-xs text-appian-muted mt-0.5">
                  Con cronómetro, navegación libre y revisión de errores al finalizar
                </div>
              </div>
            </button>

            <button
              onClick={() => startWithMode('study')}
              className="flex items-start gap-3 p-4 rounded border border-green-400 bg-green-50 hover:bg-green-100 text-left transition-colors"
            >
              <span className="text-xl shrink-0">📖</span>
              <div>
                <div className="font-bold text-green-700 text-sm">Modo Estudio</div>
                <div className="text-xs text-appian-muted mt-0.5">
                  Sin cronómetro — confirma cada respuesta y ve al instante si es correcta
                </div>
              </div>
            </button>
          </div>

          <button
            onClick={() => setSelectedCert(null)}
            className="w-full text-sm text-gray-500 hover:text-gray-700 py-2 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    )}
    </>
  );
}
