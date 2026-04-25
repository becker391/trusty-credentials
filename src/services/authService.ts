import { api } from '@/api';
import type { User, UserRole } from '@/types';

export const login = (email: string, password: string): Promise<User> =>
  api.auth.login(email, password);

export const getCurrentUser = (): Promise<User | null> =>
  api.auth.getCurrentUser();

export const logout = (): Promise<void> =>
  api.auth.logout();

export const signup = (data: {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  institution?: string;
}): Promise<User> => api.auth.signup(data);

export const requestPasswordReset = (email: string): Promise<{ sent: boolean; email: string }> =>
  api.auth.requestPasswordReset(email);

export const resetPassword = (token: string, newPassword: string): Promise<{ success: boolean }> =>
  api.auth.resetPassword(token, newPassword);
