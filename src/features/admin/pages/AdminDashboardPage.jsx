import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuthStore } from '../../../core/store/useAuthStore';
import { useAdmin } from '../hooks/useAdmin';
import { CERTIFICATIONS } from '../../../core/constants/certifications';

export function AdminDashboardPage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const { stats, fetchStats, fetchCertifications } = useAdmin();
  const [certs, setCerts] = useState([]);

  useEffect(() => {
    fetchStats();
    fetchCertifications().then((list) => {
      setCerts(list ?? CERTIFICATIONS);
    });
  }, [fetchStats, fetchCertifications]);

  async function handleLogout() {
    await logout();
    navigate('/admin/login');
  }

  return (
    <div className="min-h-screen bg-appian-bg">
      {/* Topbar */}
      <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xl">🧩</span>
          <div>
            <h1 className="text-appian-blue font-bold text-base">Panel Administrador</h1>
              <p className="text-xs text-appian-muted">Panel CertZen</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-appian-muted hidden sm:block">{user?.email}</span>
          <button
            onClick={handleLogout}
            className="text-xs border border-gray-300 text-gray-600 hover:bg-gray-100 px-3 py-1.5 rounded transition-colors"
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Quick nav */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <NavCard
            icon="📋"
            title="Gestionar Preguntas"
            desc="Agregar, editar o eliminar preguntas"
            to="/admin/questions"
          />
          <NavCard
            icon="👥"
            title="Administradores"
            desc="Otorgar o revocar acceso admin"
            to="/admin/users"
          />
          <NavCard
            icon="⚙️"
            title="Certificaciones"
            desc="Activar, crear o eliminar certificaciones"
            to="/admin/settings"
          />
          <NavCard
            icon="🔗"
            title="Ver Simulador"
            desc="Ir a la página pública del examen"
            to="/"
            external
          />
        </div>

        {/* Stats */}
        <h2 className="text-sm font-bold text-gray-600 uppercase tracking-wider mb-4">
          Preguntas por certificación
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {certs.map((cert) => {
            // cert.id follows the `${category}-${level}` pattern — use it directly
            const count = stats[cert.id] ?? stats[`${cert.category}-${cert.level}`] ?? 0;
            return (
              <div
                key={cert.id}
                className="bg-white rounded-lg border border-gray-100 shadow-sm p-5 flex items-center justify-between"
              >
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{cert.labelEs}</p>
                  <p className="text-xs text-appian-muted mt-0.5">
                    {cert.available ? 'Disponible' : 'Próximamente'}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-appian-blue">{count}</span>
                  <p className="text-xs text-appian-muted">preguntas</p>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}

function NavCard({ icon, title, desc, to, external }) {
  const Component = external ? 'a' : Link;
  const props = external ? { href: to } : { to };
  return (
    <Component
      {...props}
      className="bg-white rounded-lg border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow block"
    >
      <span className="text-2xl">{icon}</span>
      <h3 className="font-bold text-gray-800 text-sm mt-2">{title}</h3>
      <p className="text-xs text-appian-muted mt-1">{desc}</p>
    </Component>
  );
}
