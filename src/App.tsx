import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { NotificationProvider } from "@/context/NotificationContext";
import { AppLayout } from "@/components/layout/AppLayout";
import { PublicLayout } from "@/components/layout/PublicLayout";
import HomePage from "./pages/public/HomePage";
import HowItWorksPage from "./pages/public/HowItWorksPage";
import VerifyPage from "./pages/public/VerifyPage";
import AboutPage from "./pages/public/AboutPage";
import PrivacyPolicyPage from "./pages/public/PrivacyPolicyPage";
import TermsOfServicePage from "./pages/public/TermsOfServicePage";
import ContactPage from "./pages/public/ContactPage";
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import InstitutionDashboard from "./pages/institution/InstitutionDashboard";
import IssueCredentialPage from "./pages/institution/IssueCredentialPage";
import ManageCredentialsPage from "./pages/institution/ManageCredentialsPage";
import TransactionsPage from "./pages/institution/TransactionsPage";
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentWalletPage from "./pages/student/StudentWalletPage";
import ShareCredentialPage from "./pages/student/ShareCredentialPage";
import ActivityPage from "./pages/student/ActivityPage";
import VerifierDashboard from "./pages/verifier/VerifierDashboard";
import VerifyCredentialPage from "./pages/verifier/VerifyCredentialPage";
import VerificationHistoryPage from "./pages/verifier/VerificationHistoryPage";
import GovDashboard from "./pages/government/GovDashboard";
import InstitutionsPage from "./pages/government/InstitutionsPage";
import AnalyticsPage from "./pages/government/AnalyticsPage";
import AlertsPage from "./pages/government/AlertsPage";
import SettingsPage from "./pages/shared/SettingsPage";
import CredentialDetailPage from "./pages/shared/CredentialDetailPage";
import NotFoundPage from "./pages/NotFoundPage";
import type { UserRole } from "./types";

const queryClient = new QueryClient();

function ProtectedRoute({ children, allowedRole }: { children: React.ReactNode; allowedRole: UserRole }) {
  const { isAuthenticated, role, loading } = useAuth();
  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (role !== allowedRole) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public pages with shared layout */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="/verify" element={<VerifyPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/privacy" element={<PrivacyPolicyPage />} />
        <Route path="/terms" element={<TermsOfServicePage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Route>

      {/* Auth pages */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      {/* Public credential detail */}
      <Route path="/credential/:id" element={<CredentialDetailPage />} />

      {/* Protected dashboard routes */}
      <Route element={<AppLayout />}>
        <Route path="/institution/dashboard" element={<ProtectedRoute allowedRole="institution"><InstitutionDashboard /></ProtectedRoute>} />
        <Route path="/institution/issue" element={<ProtectedRoute allowedRole="institution"><IssueCredentialPage /></ProtectedRoute>} />
        <Route path="/institution/credentials" element={<ProtectedRoute allowedRole="institution"><ManageCredentialsPage /></ProtectedRoute>} />
        <Route path="/institution/transactions" element={<ProtectedRoute allowedRole="institution"><TransactionsPage /></ProtectedRoute>} />
        <Route path="/institution/settings" element={<ProtectedRoute allowedRole="institution"><SettingsPage /></ProtectedRoute>} />

        <Route path="/student/dashboard" element={<ProtectedRoute allowedRole="student"><StudentDashboard /></ProtectedRoute>} />
        <Route path="/student/wallet" element={<ProtectedRoute allowedRole="student"><StudentWalletPage /></ProtectedRoute>} />
        <Route path="/student/share" element={<ProtectedRoute allowedRole="student"><ShareCredentialPage /></ProtectedRoute>} />
        <Route path="/student/activity" element={<ProtectedRoute allowedRole="student"><ActivityPage /></ProtectedRoute>} />
        <Route path="/student/settings" element={<ProtectedRoute allowedRole="student"><SettingsPage /></ProtectedRoute>} />

        <Route path="/verifier/dashboard" element={<ProtectedRoute allowedRole="employer"><VerifierDashboard /></ProtectedRoute>} />
        <Route path="/verifier/verify" element={<ProtectedRoute allowedRole="employer"><VerifyCredentialPage /></ProtectedRoute>} />
        <Route path="/verifier/history" element={<ProtectedRoute allowedRole="employer"><VerificationHistoryPage /></ProtectedRoute>} />
        <Route path="/verifier/settings" element={<ProtectedRoute allowedRole="employer"><SettingsPage /></ProtectedRoute>} />

        <Route path="/government/dashboard" element={<ProtectedRoute allowedRole="government"><GovDashboard /></ProtectedRoute>} />
        <Route path="/government/institutions" element={<ProtectedRoute allowedRole="government"><InstitutionsPage /></ProtectedRoute>} />
        <Route path="/government/analytics" element={<ProtectedRoute allowedRole="government"><AnalyticsPage /></ProtectedRoute>} />
        <Route path="/government/alerts" element={<ProtectedRoute allowedRole="government"><AlertsPage /></ProtectedRoute>} />
        <Route path="/government/settings" element={<ProtectedRoute allowedRole="government"><SettingsPage /></ProtectedRoute>} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <NotificationProvider>
            <AppRoutes />
          </NotificationProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
