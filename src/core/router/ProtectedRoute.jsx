import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

/**
 * requireUser=true  → requires any authenticated user (redirect to /login)
 * requireUser=false → requires admin role (redirect to /admin/login) [default]
 */
export function ProtectedRoute({ children, requireUser = false }) {
  const { isAdmin, user, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-surface">
        <div className="w-8 h-8 rounded-full border-2 border-brand-500 border-t-transparent animate-spin" role="status" aria-label="Cargando" />
      </div>
    );
  }

  if (requireUser) {
    return user ? children : <Navigate to="/login" replace />;
  }

  return isAdmin ? children : <Navigate to="/admin/login" replace />;
}
