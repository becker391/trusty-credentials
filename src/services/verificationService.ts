import { api } from '@/api';
import type { VerificationRequest } from '@/types';

export const getVerificationRequests = async (verifierId?: string): Promise<VerificationRequest[]> => {
  try {
    const response = await api.verification.getVerificationHistory();
    
    // Map backend response to frontend format
    const mappedRequests = (response.data || []).map((req: any) => ({
      id: req.id,
      verifierId: req.verifier || 'unknown',
      verifierName: req.verifier_email || 'Unknown Verifier',
      verifierOrg: req.verifier_org || 'Unknown Organization',
      credentialHash: req.credential_hash_hex,
      credentialId: req.credential_hash_hex, // Use hash as ID for now
      requestDate: req.created_at,
      result: req.result as 'valid' | 'invalid' | 'pending',
      responseTime: req.response_ms,
    }));
    
    return mappedRequests;
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

export const submitFileVerificationRequest = async (file: File): Promise<any> => {
  try {
    return await api.verification.verifyCredentialFile(file);
  } catch (error) {
    console.error('Failed to submit file verification request:', error);
    throw error;
  }
};

export function formatVerificationResult(result: VerificationRequest): string {
  if (result.result === 'valid') return '✓ Credential is valid and verified on the blockchain';
  if (result.result === 'invalid') return '✗ Credential verification failed';
  return '⏳ Verification pending';
}
