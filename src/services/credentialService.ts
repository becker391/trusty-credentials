import { api } from '@/api';
import type { Credential } from '@/types';

export const getAllCredentials = (filters?: { status?: string; course?: string; institutionId?: string }) =>
  api.credentials.getCredentials(filters);

export const getCredentialById = (id: string) => 
  api.credentials.getCredential(id);

export const getCredentialsByStudent = (studentId: string) => 
  api.credentials.getStudentCredentials(studentId);

export const getCredentialsByInstitution = (institutionId: string) => 
  api.credentials.getInstitutionCredentials(institutionId);

export const issueCredential = (data: Partial<Credential>) => 
  api.credentials.issueCredential(data);

export const revokeCredential = (id: string, reason: string) => 
  api.credentials.revokeCredential(id, reason);

export const verifyCredentialByHash = (hash: string) => 
  api.verification.verifyCredential(hash);

export const verifyCredentialByFile = (file: File) => 
  api.verification.verifyCredentialFile(file);

export function generateCredentialHash(_data: Partial<Credential>): string {
  return Array.from({ length: 64 }, () => '0123456789abcdef'[Math.floor(Math.random() * 16)]).join('');
}
