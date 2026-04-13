import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { NotificationProvider } from "@/context/NotificationContext";
import { AppLayout } from "@/components/layout/AppLayout";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/auth/LoginPage";
import InstitutionDashboard from "./pages/institution/InstitutionDashboard";
import IssueCredentialPage from "./pages/institution/IssueCredentialPage";
import ManageCredentialsPage from "./pages/institution/ManageCredentialsPage";
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentWalletPage from "./pages/student/StudentWalletPage";
import ShareCredentialPage from "./pages/student/ShareCredentialPage";
import VerifierDashboard from "./pages/verifier/VerifierDashboard";
import VerifyCredentialPage from "./pages/verifier/VerifyCredentialPage";
import GovDashboard from "./pages/government/GovDashboard";
import InstitutionsPage from "./pages/government/InstitutionsPage";
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
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/credential/:id" element={<CredentialDetailPage />} />

      <Route element={<AppLayout />}>
        <Route path="/institution/dashboard" element={<ProtectedRoute allowedRole="institution"><InstitutionDashboard /></ProtectedRoute>} />
        <Route path="/institution/issue" element={<ProtectedRoute allowedRole="institution"><IssueCredentialPage /></ProtectedRoute>} />
        <Route path="/institution/credentials" element={<ProtectedRoute allowedRole="institution"><ManageCredentialsPage /></ProtectedRoute>} />

        <Route path="/student/dashboard" element={<ProtectedRoute allowedRole="student"><StudentDashboard /></ProtectedRoute>} />
        <Route path="/student/wallet" element={<ProtectedRoute allowedRole="student"><StudentWalletPage /></ProtectedRoute>} />
        <Route path="/student/share" element={<ProtectedRoute allowedRole="student"><ShareCredentialPage /></ProtectedRoute>} />

        <Route path="/verifier/dashboard" element={<ProtectedRoute allowedRole="employer"><VerifierDashboard /></ProtectedRoute>} />
        <Route path="/verifier/verify" element={<ProtectedRoute allowedRole="employer"><VerifyCredentialPage /></ProtectedRoute>} />

        <Route path="/government/dashboard" element={<ProtectedRoute allowedRole="government"><GovDashboard /></ProtectedRoute>} />
        <Route path="/government/institutions" element={<ProtectedRoute allowedRole="government"><InstitutionsPage /></ProtectedRoute>} />
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
