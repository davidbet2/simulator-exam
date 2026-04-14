import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { WelcomePage } from '../../features/welcome/WelcomePage';
import { ExamPage } from '../../features/exam/pages/ExamPage';
import { ResultsPage } from '../../features/results/ResultsPage';
import { AdminLoginPage } from '../../features/admin/pages/AdminLoginPage';
import { AdminDashboardPage } from '../../features/admin/pages/AdminDashboardPage';
import { AdminQuestionsPage } from '../../features/admin/pages/AdminQuestionsPage';
import { AdminUsersPage } from '../../features/admin/pages/AdminUsersPage';
import { AdminSettingsPage } from '../../features/admin/pages/AdminSettingsPage';

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public exam routes */}
        <Route path="/" element={<WelcomePage />} />
        <Route path="/exam" element={<ExamPage />} />
        <Route path="/results" element={<ResultsPage />} />

        {/* Admin routes */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/questions"
          element={
            <ProtectedRoute>
              <AdminQuestionsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute>
              <AdminUsersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <ProtectedRoute>
              <AdminSettingsPage />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
