import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { useAuthStore } from '../store/useAuthStore';
import { useFeatureFlags } from '../hooks/useFeatureFlags';
import { MaintenancePage } from '../../features/public/pages/MaintenancePage';
import { analytics } from '../analytics/events';

// Eager — landing page loads immediately
import { WelcomePage } from '../../features/welcome/WelcomePage';

// Lazy-loaded — split into separate chunks for faster initial load
const ExamPage           = lazy(() => import('../../features/exam/pages/ExamPage').then(m => ({ default: m.ExamPage })));
const ResultsPage        = lazy(() => import('../../features/results/ResultsPage').then(m => ({ default: m.ResultsPage })));
const LoginPage          = lazy(() => import('../../features/auth/pages/LoginPage').then(m => ({ default: m.LoginPage })));
const RegisterPage       = lazy(() => import('../../features/auth/pages/RegisterPage').then(m => ({ default: m.RegisterPage })));
const DashboardPage      = lazy(() => import('../../features/dashboard/pages/DashboardPage').then(m => ({ default: m.DashboardPage })));
const HomePage           = lazy(() => import('../../features/home/pages/HomePage').then(m => ({ default: m.HomePage })));
const FolderPage         = lazy(() => import('../../features/home/pages/FolderPage').then(m => ({ default: m.FolderPage })));
const SettingsPage       = lazy(() => import('../../features/profile/pages/SettingsPage').then(m => ({ default: m.SettingsPage })));
const PricingPage        = lazy(() => import('../../features/plans/pages/PricingPage').then(m => ({ default: m.PricingPage })));
const PaymentSuccessPage = lazy(() => import('../../features/plans/pages/PaymentSuccessPage').then(m => ({ default: m.PaymentSuccessPage })));
const ExploreExamsPage   = lazy(() => import('../../features/explore/pages/ExploreExamsPage').then(m => ({ default: m.ExploreExamsPage })));
const ExamSetLandingPage = lazy(() => import('../../features/explore/pages/ExamSetLandingPage').then(m => ({ default: m.ExamSetLandingPage })));
const CreateExamPage     = lazy(() => import('../../features/creator/pages/CreateExamPage').then(m => ({ default: m.CreateExamPage })));
const MySetsPage         = lazy(() => import('../../features/creator/pages/MySetsPage').then(m => ({ default: m.MySetsPage })));
const EditExamPage       = lazy(() => import('../../features/creator/pages/EditExamPage').then(m => ({ default: m.EditExamPage })));
const ProfilePage        = lazy(() => import('../../features/profile/pages/ProfilePage').then(m => ({ default: m.ProfilePage })));
const AboutPage          = lazy(() => import('../../features/public/pages/AboutPage').then(m => ({ default: m.AboutPage })));
const PrivacyPage        = lazy(() => import('../../features/public/pages/PrivacyPage').then(m => ({ default: m.PrivacyPage })));
const TermsPage          = lazy(() => import('../../features/public/pages/TermsPage').then(m => ({ default: m.TermsPage })));
const ContactPage        = lazy(() => import('../../features/public/pages/ContactPage').then(m => ({ default: m.ContactPage })));
const AdminLoginPage     = lazy(() => import('../../features/admin/pages/AdminLoginPage').then(m => ({ default: m.AdminLoginPage })));
const AdminDashboardPage = lazy(() => import('../../features/admin/pages/AdminDashboardPage').then(m => ({ default: m.AdminDashboardPage })));
const AdminUsersPage          = lazy(() => import('../../features/admin/pages/AdminUsersPage').then(m => ({ default: m.AdminUsersPage })));
const AdminExamSetsPage       = lazy(() => import('../../features/admin/pages/AdminExamSetsPage').then(m => ({ default: m.AdminExamSetsPage })));
const AdminAttemptsPage       = lazy(() => import('../../features/admin/pages/AdminAttemptsPage').then(m => ({ default: m.AdminAttemptsPage })));
const AdminFlagsPage          = lazy(() => import('../../features/admin/pages/AdminFlagsPage').then(m => ({ default: m.AdminFlagsPage })));
const AdminAuditLogPage       = lazy(() => import('../../features/admin/pages/AdminAuditLogPage').then(m => ({ default: m.AdminAuditLogPage })));
const VerifyEmailPage         = lazy(() => import('../../features/auth/pages/VerifyEmailPage').then(m => ({ default: m.VerifyEmailPage })));
const ForgotPasswordPage      = lazy(() => import('../../features/auth/pages/ForgotPasswordPage').then(m => ({ default: m.ForgotPasswordPage })));
const AuthActionPage          = lazy(() => import('../../features/auth/pages/AuthActionPage').then(m => ({ default: m.AuthActionPage })));

function PageLoader() {  return (
    <div className="min-h-screen bg-surface flex items-center justify-center" aria-busy="true" aria-label="Cargando página">
      <div className="w-8 h-8 rounded-full border-2 border-brand-500/30 border-t-brand-500 animate-spin" />
    </div>
  );
}

/** Scrolls to top and fires GA4 page_view whenever the route changes */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    analytics.pageView({ path: pathname });
  }, [pathname]);
  return null;
}

/**
 * Blocks all non-admin routes when maintenanceMode flag is active.
 * Admins (isAdmin=true) always bypass so the panel stays accessible.
 */
function MaintenanceGate({ children }) {
  const { flags, loading } = useFeatureFlags();
  const { isAdmin } = useAuthStore();
  const { pathname } = useLocation();

  // While flags are loading show a neutral spinner — never flash the app content
  if (loading) return <PageLoader />;

  // Admin paths always bypass maintenance
  if (pathname.startsWith('/admin')) return children;

  if (flags.maintenanceMode && !isAdmin) return <MaintenancePage />;

  return children;
}

/** If logged in and on `/`, redirect to `/home` (Quizlet-style authenticated landing). */
function RootRoute() {
  const { user, isLoading } = useAuthStore();
  if (isLoading) return null;
  if (user) return <Navigate to="/home" replace />;
  return <WelcomePage />;
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
      <MaintenanceGate>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<RootRoute />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/auth/action" element={<AuthActionPage />} />
        {/* /exam is public: demo mode runs client-side with hardcoded questions.
            Community/official sets enforce auth at the landing page (ExamSetLandingPage.launchMode). */}
        <Route path="/exam" element={<ExamPage />} />
        <Route path="/results" element={<ResultsPage />} />

        {/* Authenticated user routes */}
        <Route path="/home" element={<ProtectedRoute requireUser><HomePage /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute requireUser><DashboardPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute requireUser><ProfilePage /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute requireUser><SettingsPage /></ProtectedRoute>} />
        <Route path="/folders/:folderId" element={<ProtectedRoute requireUser><FolderPage /></ProtectedRoute>} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/payment-success" element={<ProtectedRoute requireUser><PaymentSuccessPage /></ProtectedRoute>} />
        <Route path="/explore" element={<ExploreExamsPage />} />
        <Route path="/exam-sets/:slug" element={<ExamSetLandingPage />} />
        <Route path="/create-exam" element={<ProtectedRoute requireUser><CreateExamPage /></ProtectedRoute>} />
        <Route path="/my-sets" element={<ProtectedRoute requireUser><MySetsPage /></ProtectedRoute>} />
        <Route path="/edit-exam/:id" element={<ProtectedRoute requireUser><EditExamPage /></ProtectedRoute>} />

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
          path="/admin/users"
          element={
            <ProtectedRoute>
              <AdminUsersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/exam-sets"
          element={
            <ProtectedRoute>
              <AdminExamSetsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/attempts"
          element={
            <ProtectedRoute>
              <AdminAttemptsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/flags"
          element={
            <ProtectedRoute>
              <AdminFlagsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/audit-log"
          element={
            <ProtectedRoute>
              <AdminAuditLogPage />
            </ProtectedRoute>
          }
        />
        {/* Legacy redirects — removed admin pages redirect to dashboard */}
        <Route path="/admin/questions" element={<Navigate to="/admin" replace />} />
        <Route path="/admin/admins" element={<Navigate to="/admin" replace />} />
        <Route path="/admin/certifications" element={<Navigate to="/admin" replace />} />
        <Route path="/admin/settings" element={<Navigate to="/admin" replace />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      </MaintenanceGate>
      </Suspense>
    </BrowserRouter>
  );
}
