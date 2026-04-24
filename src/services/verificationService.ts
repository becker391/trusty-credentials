import { api } from '@/api';
import type { VerificationRequest } from '@/types';

export const getVerificationRequests = async (verifierId?: string): Promise<VerificationRequest[]> => {
  try {
    const response = await api.verification.getVerificationHistory();
    return response.data || [];
  } catch (error) {
    console.warn('Failed to fetch verification requests:', error);
    return [];
  }
};

export const submitVerificationRequest = async (hash: string): Promise<any> => {
  try {
    return await api.verification.verifyCredential(hash);
  } catch (error) {
    console.error('Failed to submit verification request:', error);
    throw error;
  }
};

export function formatVerificationResult(result: VerificationRequest): string {
  if (result.result === 'valid') return '✓ Credential is valid and verified on the blockchain';
  if (result.result === 'invalid') return '✗ Credential verification failed';
  return '⏳ Verification pending';
}
