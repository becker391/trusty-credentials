import {
  mockLogin,
  mockGetCurrentUser,
  mockLogout,
  mockSignup,
  mockRequestPasswordReset,
  mockResetPassword,
} from '@/api/mockApi';
import type { User, UserRole } from '@/types';

export const login = (email: string, password: string, role: UserRole): Promise<User> =>
  mockLogin(email, password, role);

export const getCurrentUser = (): Promise<User | null> =>
  mockGetCurrentUser();

export const logout = (): Promise<void> =>
  mockLogout();

export const signup = (data: {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  institution?: string;
}): Promise<User> => mockSignup(data);

export const requestPasswordReset = (email: string): Promise<{ sent: boolean; email: string }> =>
  mockRequestPasswordReset(email);

export const resetPassword = (token: string, newPassword: string): Promise<{ success: boolean }> =>
  mockResetPassword(token, newPassword);
