import { api } from '@/api';
import type { UserRole, DashboardStats } from '@/types';

export const getDashboardStats = async (role: UserRole, userId?: string): Promise<DashboardStats> => {
  try {
    // Try to get stats from the dedicated dashboard endpoint first
    try {
      const dashboardResponse = await api.dashboard.getStats(role, userId);
      if (dashboardResponse.data) {
        return dashboardResponse.data;
      }
    } catch (dashboardError) {
      console.warn('Dashboard API not available, calculating from individual endpoints:', dashboardError);
    }

    // Fallback: Get real data from multiple endpoints and calculate stats
    const [credentialsResponse, institutionsResponse, verificationsResponse] = await Promise.all([
      api.credentials.getCredentials().catch(() => ({ data: [] })),
      api.institutions.getInstitutions().catch(() => ({ data: [] })),
      api.verification.getVerificationHistory().catch(() => ({ data: [] })),
    ]);

    const credentials = credentialsResponse.data || [];
    const institutions = institutionsResponse.data || [];
    const verifications = verificationsResponse.data || [];

    // Calculate role-specific stats
    let stats: DashboardStats;

    if (role === 'institution') {
      // Institution-specific stats
      const activeCredentials = credentials.filter((c: any) => c.status === 'active');
      const revokedCredentials = credentials.filter((c: any) => c.status === 'revoked');
      const uniqueStudents = new Set(credentials.map((c: any) => c.studentId)).size;

      stats = {
        totalCredentials: credentials.length,
        totalInstitutions: 1, // Current institution
        totalStudents: uniqueStudents,
        totalVerifications: verifications.length,
        fraudPrevented: revokedCredentials.length,
        avgVerificationTime: 2.3, // Mock value for now
      };
    } else if (role === 'student') {
      // Student-specific stats
      const userCredentials = credentials.filter((c: any) => c.studentId === userId);
      const activeCredentials = userCredentials.filter((c: any) => c.status === 'active');

      stats = {
        totalCredentials: userCredentials.length,
        totalInstitutions: new Set(userCredentials.map((c: any) => c.institutionId)).size,
        totalStudents: 1, // Current user
        totalVerifications: verifications.filter((v: any) => v.verifierId === userId).length,
        fraudPrevented: 0, // Not relevant for students
        avgVerificationTime: 1.8,
      };
    } else if (role === 'government') {
      // Government-wide stats
      const activeCredentials = credentials.filter((c: any) => c.status === 'active');
      const revokedCredentials = credentials.filter((c: any) => c.status === 'revoked');
      const uniqueStudents = new Set(credentials.map((c: any) => c.studentId)).size;

      stats = {
        totalCredentials: credentials.length,
        totalInstitutions: institutions.length,
        totalStudents: uniqueStudents,
        totalVerifications: verifications.length,
        fraudPrevented: revokedCredentials.length,
        avgVerificationTime: 2.1,
      };
    } else if (role === 'employer') {
      // Employer/Verifier stats
      const userVerifications = verifications.filter((v: any) => v.verifierId === userId);
      const validVerifications = userVerifications.filter((v: any) => v.result === 'valid');

      stats = {
        totalCredentials: 0, // Employers don't issue credentials
        totalInstitutions: institutions.length,
        totalStudents: 0, // Not relevant
        totalVerifications: userVerifications.length,
        fraudPrevented: userVerifications.length - validVerifications.length,
        avgVerificationTime: 1.5,
      };
    } else {
      // Default fallback stats
      stats = {
        totalCredentials: credentials.length,
        totalInstitutions: institutions.length,
        totalStudents: new Set(credentials.map((c: any) => c.studentId)).size,
        totalVerifications: verifications.length,
        fraudPrevented: credentials.filter((c: any) => c.status === 'revoked').length,
        avgVerificationTime: 2.0,
      };
    }

    return stats;
  } catch (error) {
    console.warn('Failed to fetch real dashboard stats, using fallback:', error);
    
    // Fallback stats
    return {
      totalCredentials: 0,
      totalInstitutions: 0,
      totalStudents: 0,
      totalVerifications: 0,
      fraudPrevented: 0,
      avgVerificationTime: 0,
    };
  }
};
