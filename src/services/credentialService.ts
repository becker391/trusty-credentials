import { mockGetAllCredentials, mockGetCredentialById, mockGetCredentialsByStudent, mockGetCredentialsByInstitution, mockIssueCredential, mockRevokeCredential, mockVerifyCredentialByHash } from '@/api/mockApi';
import type { Credential } from '@/types';

export const getAllCredentials = (filters?: { status?: string; course?: string; institutionId?: string }) =>
  mockGetAllCredentials(filters);

export const getCredentialById = (id: string) => mockGetCredentialById(id);

export const getCredentialsByStudent = (studentId: string) => mockGetCredentialsByStudent(studentId);

export const getCredentialsByInstitution = (institutionId: string) => mockGetCredentialsByInstitution(institutionId);

export const issueCredential = (data: Partial<Credential>) => mockIssueCredential(data);

export const revokeCredential = (id: string, reason: string) => mockRevokeCredential(id, reason);

export const verifyCredentialByHash = (hash: string) => mockVerifyCredentialByHash(hash);

export function generateCredentialHash(_data: Partial<Credential>): string {
  return Array.from({ length: 64 }, () => '0123456789abcdef'[Math.floor(Math.random() * 16)]).join('');
}
