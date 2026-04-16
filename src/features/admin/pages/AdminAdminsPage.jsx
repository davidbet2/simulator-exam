import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAdmin } from '../hooks/useAdmin';
import { useAuthStore } from '../../../core/store/useAuthStore';

export function AdminAdminsPage() {
  const currentUser = useAuthStore((s) => s.user);
  const { loading, error, grantAdmin, revokeAdmin, fetchAdmins } = useAdmin();
  const [admins, setAdmins] = useState([]);
  const [newEmail, setNewEmail] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [revokeConfirm, setRevokeConfirm] = useState(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    loadAdmins();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function loadAdmins() {
    const data = await fetchAdmins();
    setAdmins(data);
  }

  async function handleGrant(e) {
    e.preventDefault();
    const email = newEmail.trim().toLowerCase();
    if (!email) return;
    const ok = await grantAdmin(email);
    if (ok) {
      setFeedback({ type: 'success', msg: `Acceso otorgado a ${email}` });
      setNewEmail('');
      loadAdmins();
    } else {
      setFeedback({ type: 'error', msg: 'No se pudo otorgar acceso.' });
    }
    setTimeout(() => setFeedback(null), 3000);
  }

  async function handleRevoke(email) {
    const ok = await revokeAdmin(email);
    if (ok) {
      setAdmins((prev) => prev.filter((a) => a.email !== email));
      setFeedback({ type: 'success', msg: `Acceso revocado para ${email}` });
    } else {
      setFeedback({ type: 'error', msg: 'No se pudo revocar el acceso.' });
    }
    setRevokeConfirm(null);
    setTimeout(() => setFeedback(null), 3000);
  }

  return (
    <div className="min-h-screen bg-appian-bg">
      {/* Topbar */}
      <header className="bg-white shadow-sm px-6 py-4 flex items-center gap-4">
        <Link to="/admin" className="text-appian-muted hover:text-appian-blue text-sm">← Dashboard</Link>
        <div className="h-4 border-l border-gray-300" />
        <h1 className="font-bold text-gray-800 text-base">Administradores</h1>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        {/* Feedback */}
        {feedback && (
          <div
            className={`text-sm rounded p-3 mb-4 font-medium ${
              feedback.type === 'success'
                ? 'bg-appian-success-light text-appian-success'
                : 'bg-appian-error-light text-appian-error'
            }`}
          >
            {feedback.msg}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-appian-error-light text-appian-error text-sm rounded p-3 mb-4">{error}</div>
        )}

        {/* Grant form */}
        <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-6 mb-6">
          <h2 className="font-bold text-gray-800 text-sm mb-1">Otorgar acceso de administrador</h2>
          <p className="text-xs text-appian-muted mb-4">
            El usuario debe registrarse con este correo en la página de login.
          </p>
          <form onSubmit={handleGrant} className="flex gap-3">
            <input
              type="email"
              required
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="correo@empresa.com"
              className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-appian-blue"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-appian-blue hover:bg-appian-blue-dark text-white font-bold px-4 py-2 rounded text-sm disabled:bg-gray-300"
            >
              Agregar
            </button>
          </form>
        </div>

        {/* Admins list */}
        <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100">
            <span className="text-xs font-semibold text-appian-muted">
              {admins.length} administrador{admins.length !== 1 ? 'es' : ''}
            </span>
          </div>
          {admins.length === 0 && (
            <p className="text-center text-appian-muted text-sm py-8">Sin administradores registrados.</p>
          )}
          <ul className="divide-y divide-gray-100">
            {admins.map((admin) => {
              const isSelf = admin.email === currentUser?.email;
              return (
                <li key={admin.email} className="px-5 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {admin.email}
                      {isSelf && (
                        <span className="ml-2 text-xs bg-appian-success-light text-appian-success font-semibold px-1.5 py-0.5 rounded">
                          Tú
                        </span>
                      )}
                    </p>
                    {admin.grantedBy && (
                      <p className="text-xs text-appian-muted">Otorgado por: {admin.grantedBy}</p>
                    )}
                  </div>
                  {!isSelf && (
                    <button
                      onClick={() => setRevokeConfirm(admin.email)}
                      className="text-xs text-appian-error hover:underline font-semibold"
                    >
                      Revocar
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </main>

      {/* Revoke confirm modal */}
      {revokeConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full">
            <h3 className="font-bold text-gray-800 mb-2">¿Revocar acceso?</h3>
            <p className="text-sm text-appian-muted mb-1">
              Se eliminará el acceso de administrador para:
            </p>
            <p className="text-sm font-semibold text-gray-800 mb-6">{revokeConfirm}</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setRevokeConfirm(null)}
                className="px-4 py-2 text-sm border border-gray-300 rounded text-gray-600 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleRevoke(revokeConfirm)}
                className="px-4 py-2 text-sm bg-appian-error text-white font-bold rounded hover:opacity-90"
              >
                Sí, revocar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
