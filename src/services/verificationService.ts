import { mockGetVerificationRequests, mockSubmitVerificationRequest } from '@/api/mockApi';
import type { VerificationRequest } from '@/types';

export const getVerificationRequests = (verifierId?: string) => mockGetVerificationRequests(verifierId);
export const submitVerificationRequest = (hash: string) => mockSubmitVerificationRequest(hash);

export function formatVerificationResult(result: VerificationRequest): string {
  if (result.result === 'valid') return '✓ Credential is valid and verified on the blockchain';
  if (result.result === 'invalid') return '✗ Credential verification failed';
  return '⏳ Verification pending';
}
