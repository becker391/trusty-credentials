export type UserRole = 'institution' | 'student' | 'employer' | 'government';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  walletAddress: string;
  avatarUrl: string;
  institution?: string;
}

export type CredentialStatus = 'active' | 'revoked' | 'pending';

export interface Credential {
  id: string;
  studentId: string;
  studentName: string;
  institutionId: string;
  institutionName: string;
  certificateType: string;
  course: string;
  grade: string;
  issueDate: string;
  expiryDate?: string;
  credentialHash: string;
  txHash: string;
  blockNumber: number;
  networkName: string;
  status: CredentialStatus;
  nftTokenId?: string;
  ipfsUrl?: string;
  issuedBy: string;
}

export interface Institution {
  id: string;
  name: string;
  country: string;
  accreditationId: string;
  publicKey: string;
  logoUrl: string;
  totalIssued: number;
  joinedDate: string;
}

export type VerificationResult = 'valid' | 'invalid' | 'pending';

export interface VerificationRequest {
  id: string;
  verifierId: string;
  verifierName: string;
  verifierOrg: string;
  credentialHash: string;
  credentialId: string;
  requestDate: string;
  result: VerificationResult;
  responseTime?: number;
}

export type TransactionType = 'issue' | 'revoke' | 'verify';

export interface Transaction {
  id: string;
  txHash: string;
  type: TransactionType;
  timestamp: string;
  gasUsed: number;
  blockNumber: number;
  network: string;
  status: string;
}

export interface DashboardStats {
  totalCredentials: number;
  totalInstitutions: number;
  totalStudents: number;
  totalVerifications: number;
  fraudPrevented: number;
  avgVerificationTime: number;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
}
