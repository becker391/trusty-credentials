import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import type { UserRole } from '@/types';

// Helper function to get dashboard path based on role
const getDashboardPath = (role: UserRole): string => {
  const rolePathMap: Record<UserRole, string> = {
    institution: '/institution/dashboard',
    student: '/student/dashboard',
    employer: '/verifier/dashboard',
    government: '/government/dashboard',
    verifier: '/verifier/dashboard',
    admin: '/government/dashboard', // Admin uses government dashboard
  };
  return rolePathMap[role] || '/student/dashboard';
};

export default function DashboardRedirect() {
  const { user, isAuthenticated, loading } = useAuth();

  // Show loading while auth is being determined
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Redirect to appropriate dashboard based on user role
  const dashboardPath = getDashboardPath(user.role);
  return <Navigate to={dashboardPath} replace />;
}