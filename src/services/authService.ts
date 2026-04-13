import { mockLogin, mockGetCurrentUser, mockLogout } from '@/api/mockApi';
import type { User, UserRole } from '@/types';

export const login = (email: string, password: string, role: UserRole): Promise<User> =>
  mockLogin(email, password, role);

export const getCurrentUser = (): Promise<User | null> =>
  mockGetCurrentUser();

export const logout = (): Promise<void> =>
  mockLogout();
