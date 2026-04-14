import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

export function ProtectedRoute({ children }) {
  const isAdmin = useAuthStore((s) => s.isAdmin);
  const isLoading = useAuthStore((s) => s.isLoading);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-appian-muted text-lg">Cargando...</div>
      </div>
    );
  }

  return isAdmin ? children : <Navigate to="/admin/login" replace />;
}
