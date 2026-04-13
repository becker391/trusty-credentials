import { mockGetDashboardStats } from '@/api/mockApi';
import type { UserRole } from '@/types';

export const getDashboardStats = (role: UserRole, userId?: string) => mockGetDashboardStats(role, userId);
