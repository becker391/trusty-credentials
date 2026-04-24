/**
 * API Configuration - Switch between mock and real API
 */

import * as mockApiFunctions from './mockApi';
import { realApi } from './api';

// Create mockApi object from individual functions
const mockApi = {
  auth: {
    login: mockApiFunctions.mockLogin,
    getCurrentUser: mockApiFunctions.mockGetCurrentUser,
    logout: mockApiFunctions.mockLogout,
    signup: mockApiFunctions.mockSignup,
    requestPasswordReset: mockApiFunctions.mockRequestPasswordReset,
    resetPassword: mockApiFunctions.mockResetPassword,
  },
  credentials: {
    getCredentials: mockApiFunctions.mockGetAllCredentials,
    getCredential: mockApiFunctions.mockGetCredentialById,
    getStudentCredentials: mockApiFunctions.mockGetCredentialsByStudent,
    getInstitutionCredentials: mockApiFunctions.mockGetCredentialsByInstitution,
    issueCredential: mockApiFunctions.mockIssueCredential,
    revokeCredential: mockApiFunctions.mockRevokeCredential,
  },
  verification: {
    verifyCredential: mockApiFunctions.mockVerifyCredentialByHash,
    getVerificationHistory: mockApiFunctions.mockGetVerificationRequests,
  },
  institutions: {
    getInstitutions: mockApiFunctions.mockGetInstitutions,
    getInstitution: mockApiFunctions.mockGetInstitutionById,
  },
  blockchain: {
    getTransactions: mockApiFunctions.mockGetTransactions,
  },
  notifications: {
    getNotifications: mockApiFunctions.mockGetNotifications,
    markRead: mockApiFunctions.mockMarkNotificationRead,
  },
  dashboard: {
    getStats: mockApiFunctions.mockGetDashboardStats,
  },
};

// Use environment variable to determine which API to use
// In development, you can set VITE_USE_REAL_API=true to use real backend
const USE_REAL_API = import.meta.env.VITE_USE_REAL_API === 'true';

console.log(`Using ${USE_REAL_API ? 'REAL' : 'MOCK'} API`);

// Export the appropriate API based on configuration
export const api = USE_REAL_API ? realApi : mockApi;

// Also export both for direct access if needed
export { mockApi, realApi };

// Re-export types for convenience
export type { User, Credential, Institution, VerificationRequest, Transaction, DashboardStats, Notification, UserRole } from '@/types';