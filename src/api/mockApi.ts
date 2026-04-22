import type { User, Credential, Institution, VerificationRequest, Transaction, DashboardStats, Notification, UserRole } from '@/types';

const delay = (ms?: number) => new Promise(r => setTimeout(r, ms ?? (400 + Math.random() * 400)));

const randomHash = () => Array.from({ length: 64 }, () => '0123456789abcdef'[Math.floor(Math.random() * 16)]).join('');
const randomTx = () => '0x' + randomHash();

// ─── Seed Data ───────────────────────────────────────

const institutions: Institution[] = [
  { id: 'inst-1', name: 'Machakos University', country: 'Kenya', accreditationId: 'CUE-MKS-2018', publicKey: '0x' + randomHash().slice(0, 40), logoUrl: '', totalIssued: 156, joinedDate: '2022-03-15' },
  { id: 'inst-2', name: 'University of Nairobi', country: 'Kenya', accreditationId: 'CUE-UON-2015', publicKey: '0x' + randomHash().slice(0, 40), logoUrl: '', totalIssued: 312, joinedDate: '2021-06-01' },
  { id: 'inst-3', name: 'Strathmore University', country: 'Kenya', accreditationId: 'CUE-STR-2016', publicKey: '0x' + randomHash().slice(0, 40), logoUrl: '', totalIssued: 98, joinedDate: '2023-01-20' },
];

const users: (User & { password: string })[] = [
  { id: 'user-1', name: 'Dr. James Kariuki', email: 'admin@machakos.ac.ke', role: 'institution', walletAddress: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef12', avatarUrl: '', institution: 'Machakos University', password: 'demo' },
  { id: 'user-2', name: 'John Muthui Gachuru', email: 'john.gachuru@student.mksu.ac.ke', role: 'student', walletAddress: '0x9876543210fedcba9876543210fedcba98765432', avatarUrl: '', institution: 'Machakos University', password: 'demo' },
  { id: 'user-3', name: 'Grace Wanjiku', email: 'grace@techcorp.co.ke', role: 'employer', walletAddress: '0xaabbccdd11223344556677889900aabbccddeeff', avatarUrl: '', password: 'demo' },
  { id: 'user-4', name: 'Hon. Peter Mutua', email: 'admin@education.go.ke', role: 'government', walletAddress: '0x1122334455667788990011223344556677889900', avatarUrl: '', password: 'demo' },
  { id: 'user-5', name: 'Alice Mwende', email: 'alice@student.uon.ac.ke', role: 'student', walletAddress: '0x' + randomHash().slice(0, 40), avatarUrl: '', institution: 'University of Nairobi', password: 'demo' },
  { id: 'user-6', name: 'Brian Ochieng', email: 'brian@student.mksu.ac.ke', role: 'student', walletAddress: '0x' + randomHash().slice(0, 40), avatarUrl: '', institution: 'Machakos University', password: 'demo' },
  { id: 'user-7', name: 'Faith Njeri', email: 'faith@student.strathmore.edu', role: 'student', walletAddress: '0x' + randomHash().slice(0, 40), avatarUrl: '', institution: 'Strathmore University', password: 'demo' },
  { id: 'user-8', name: 'David Kimani', email: 'david@student.uon.ac.ke', role: 'student', walletAddress: '0x' + randomHash().slice(0, 40), avatarUrl: '', institution: 'University of Nairobi', password: 'demo' },
  { id: 'user-9', name: 'Sarah Achieng', email: 'sarah@student.mksu.ac.ke', role: 'student', walletAddress: '0x' + randomHash().slice(0, 40), avatarUrl: '', institution: 'Machakos University', password: 'demo' },
  { id: 'user-10', name: 'Emmanuel Wafula', email: 'emmanuel@student.strathmore.edu', role: 'student', walletAddress: '0x' + randomHash().slice(0, 40), avatarUrl: '', institution: 'Strathmore University', password: 'demo' },
  { id: 'user-11', name: 'Mary Akinyi', email: 'mary@student.mksu.ac.ke', role: 'student', walletAddress: '0x' + randomHash().slice(0, 40), avatarUrl: '', institution: 'Machakos University', password: 'demo' },
];

const credentials: Credential[] = [
  { id: 'cred-1', studentId: 'user-2', studentName: 'John Muthui Gachuru', institutionId: 'inst-1', institutionName: 'Machakos University', certificateType: 'Degree', course: 'BSc Computer Science', grade: 'First Class Honours', issueDate: '2026-01-15', credentialHash: randomHash(), txHash: randomTx(), blockNumber: 18234567, networkName: 'Ethereum', status: 'active', nftTokenId: '1042', issuedBy: 'Dr. James Kariuki' },
  { id: 'cred-2', studentId: 'user-5', studentName: 'Alice Mwende', institutionId: 'inst-2', institutionName: 'University of Nairobi', certificateType: 'Degree', course: 'BSc Mathematics', grade: 'Second Class Upper', issueDate: '2025-12-20', credentialHash: randomHash(), txHash: randomTx(), blockNumber: 18234100, networkName: 'Polygon', status: 'active', issuedBy: 'Prof. Odhiambo' },
  { id: 'cred-3', studentId: 'user-6', studentName: 'Brian Ochieng', institutionId: 'inst-1', institutionName: 'Machakos University', certificateType: 'Diploma', course: 'Diploma in IT', grade: 'Distinction', issueDate: '2025-11-10', credentialHash: randomHash(), txHash: randomTx(), blockNumber: 18233900, networkName: 'Ethereum', status: 'active', issuedBy: 'Dr. James Kariuki' },
  { id: 'cred-4', studentId: 'user-7', studentName: 'Faith Njeri', institutionId: 'inst-3', institutionName: 'Strathmore University', certificateType: 'Degree', course: 'BBS Finance', grade: 'First Class Honours', issueDate: '2025-10-05', credentialHash: randomHash(), txHash: randomTx(), blockNumber: 18233500, networkName: 'Polygon', status: 'active', issuedBy: 'Dr. Kamau' },
  { id: 'cred-5', studentId: 'user-8', studentName: 'David Kimani', institutionId: 'inst-2', institutionName: 'University of Nairobi', certificateType: 'Certificate', course: 'Certificate in Data Science', grade: 'Credit', issueDate: '2025-09-15', credentialHash: randomHash(), txHash: randomTx(), blockNumber: 18233000, networkName: 'Ethereum', status: 'revoked', issuedBy: 'Prof. Odhiambo' },
  { id: 'cred-6', studentId: 'user-9', studentName: 'Sarah Achieng', institutionId: 'inst-1', institutionName: 'Machakos University', certificateType: 'Degree', course: 'BSc Information Technology', grade: 'Second Class Upper', issueDate: '2025-08-20', credentialHash: randomHash(), txHash: randomTx(), blockNumber: 18232500, networkName: 'Polygon', status: 'active', issuedBy: 'Dr. James Kariuki' },
  { id: 'cred-7', studentId: 'user-10', studentName: 'Emmanuel Wafula', institutionId: 'inst-3', institutionName: 'Strathmore University', certificateType: 'Diploma', course: 'Diploma in Cyber Security', grade: 'Distinction', issueDate: '2025-07-12', credentialHash: randomHash(), txHash: randomTx(), blockNumber: 18232000, networkName: 'Ethereum', status: 'active', issuedBy: 'Dr. Kamau' },
  { id: 'cred-8', studentId: 'user-11', studentName: 'Mary Akinyi', institutionId: 'inst-1', institutionName: 'Machakos University', certificateType: 'Certificate', course: 'Certificate in Web Development', grade: 'Pass', issueDate: '2025-06-30', credentialHash: randomHash(), txHash: randomTx(), blockNumber: 18231500, networkName: 'Polygon', status: 'pending', issuedBy: 'Dr. James Kariuki' },
  { id: 'cred-9', studentId: 'user-2', studentName: 'John Muthui Gachuru', institutionId: 'inst-1', institutionName: 'Machakos University', certificateType: 'Certificate', course: 'Certificate in Cloud Computing', grade: 'Distinction', issueDate: '2024-12-01', credentialHash: randomHash(), txHash: randomTx(), blockNumber: 18231000, networkName: 'Ethereum', status: 'active', issuedBy: 'Dr. James Kariuki' },
  { id: 'cred-10', studentId: 'user-5', studentName: 'Alice Mwende', institutionId: 'inst-2', institutionName: 'University of Nairobi', certificateType: 'Degree', course: 'MSc Applied Statistics', grade: 'First Class', issueDate: '2026-02-28', credentialHash: randomHash(), txHash: randomTx(), blockNumber: 18235000, networkName: 'Ethereum', status: 'active', issuedBy: 'Prof. Odhiambo' },
  { id: 'cred-11', studentId: 'user-6', studentName: 'Brian Ochieng', institutionId: 'inst-1', institutionName: 'Machakos University', certificateType: 'Degree', course: 'BSc Software Engineering', grade: 'Second Class Lower', issueDate: '2026-03-10', credentialHash: randomHash(), txHash: randomTx(), blockNumber: 18235500, networkName: 'Polygon', status: 'pending', issuedBy: 'Dr. James Kariuki' },
  { id: 'cred-12', studentId: 'user-7', studentName: 'Faith Njeri', institutionId: 'inst-3', institutionName: 'Strathmore University', certificateType: 'Certificate', course: 'Certificate in Project Management', grade: 'Credit', issueDate: '2025-05-18', credentialHash: randomHash(), txHash: randomTx(), blockNumber: 18230500, networkName: 'Ethereum', status: 'active', issuedBy: 'Dr. Kamau' },
];

const verificationRequests: VerificationRequest[] = [
  { id: 'vr-1', verifierId: 'user-3', verifierName: 'Grace Wanjiku', verifierOrg: 'TechCorp Kenya', credentialHash: credentials[0].credentialHash, credentialId: 'cred-1', requestDate: '2026-04-10', result: 'valid', responseTime: 1.2 },
  { id: 'vr-2', verifierId: 'user-3', verifierName: 'Grace Wanjiku', verifierOrg: 'TechCorp Kenya', credentialHash: credentials[1].credentialHash, credentialId: 'cred-2', requestDate: '2026-04-09', result: 'valid', responseTime: 0.8 },
  { id: 'vr-3', verifierId: 'user-3', verifierName: 'Grace Wanjiku', verifierOrg: 'TechCorp Kenya', credentialHash: 'invalid_hash_attempt_123', credentialId: '', requestDate: '2026-04-08', result: 'invalid', responseTime: 0.5 },
  { id: 'vr-4', verifierId: 'user-3', verifierName: 'Grace Wanjiku', verifierOrg: 'TechCorp Kenya', credentialHash: credentials[4].credentialHash, credentialId: 'cred-5', requestDate: '2026-04-07', result: 'invalid', responseTime: 1.0 },
  { id: 'vr-5', verifierId: 'user-3', verifierName: 'Grace Wanjiku', verifierOrg: 'TechCorp Kenya', credentialHash: credentials[3].credentialHash, credentialId: 'cred-4', requestDate: '2026-04-06', result: 'valid', responseTime: 0.9 },
  { id: 'vr-6', verifierId: 'user-3', verifierName: 'Grace Wanjiku', verifierOrg: 'TechCorp Kenya', credentialHash: credentials[6].credentialHash, credentialId: 'cred-7', requestDate: '2026-04-05', result: 'pending', responseTime: undefined },
];

const transactions: Transaction[] = [
  { id: 'tx-1', txHash: credentials[0].txHash, type: 'issue', timestamp: '2026-01-15T10:30:00Z', gasUsed: 45230, blockNumber: credentials[0].blockNumber, network: 'Ethereum', status: 'confirmed' },
  { id: 'tx-2', txHash: credentials[1].txHash, type: 'issue', timestamp: '2025-12-20T14:15:00Z', gasUsed: 38900, blockNumber: credentials[1].blockNumber, network: 'Polygon', status: 'confirmed' },
  { id: 'tx-3', txHash: credentials[2].txHash, type: 'issue', timestamp: '2025-11-10T09:45:00Z', gasUsed: 42100, blockNumber: credentials[2].blockNumber, network: 'Ethereum', status: 'confirmed' },
  { id: 'tx-4', txHash: randomTx(), type: 'verify', timestamp: '2026-04-10T16:20:00Z', gasUsed: 21000, blockNumber: 18236000, network: 'Ethereum', status: 'confirmed' },
  { id: 'tx-5', txHash: randomTx(), type: 'revoke', timestamp: '2025-09-20T11:00:00Z', gasUsed: 35600, blockNumber: 18233200, network: 'Ethereum', status: 'confirmed' },
  { id: 'tx-6', txHash: credentials[3].txHash, type: 'issue', timestamp: '2025-10-05T08:30:00Z', gasUsed: 39800, blockNumber: credentials[3].blockNumber, network: 'Polygon', status: 'confirmed' },
  { id: 'tx-7', txHash: randomTx(), type: 'verify', timestamp: '2026-04-09T13:45:00Z', gasUsed: 21000, blockNumber: 18235800, network: 'Polygon', status: 'confirmed' },
  { id: 'tx-8', txHash: credentials[5].txHash, type: 'issue', timestamp: '2025-08-20T15:10:00Z', gasUsed: 41200, blockNumber: credentials[5].blockNumber, network: 'Polygon', status: 'confirmed' },
  { id: 'tx-9', txHash: randomTx(), type: 'verify', timestamp: '2026-04-08T10:05:00Z', gasUsed: 21000, blockNumber: 18235600, network: 'Ethereum', status: 'confirmed' },
  { id: 'tx-10', txHash: credentials[8].txHash, type: 'issue', timestamp: '2024-12-01T12:00:00Z', gasUsed: 43500, blockNumber: credentials[8].blockNumber, network: 'Ethereum', status: 'confirmed' },
];

const notifications: Notification[] = [
  { id: 'n-1', userId: 'user-2', title: 'Credential Issued', message: 'Your BSc Computer Science credential has been issued and stored on the blockchain.', type: 'success', read: false, createdAt: '2026-04-12T09:00:00Z' },
  { id: 'n-2', userId: 'user-2', title: 'Verification Request', message: 'TechCorp Kenya has verified your BSc Computer Science credential.', type: 'info', read: false, createdAt: '2026-04-10T16:30:00Z' },
  { id: 'n-3', userId: 'user-1', title: 'New Student Enrolled', message: 'A new student has registered on the platform.', type: 'info', read: true, createdAt: '2026-04-09T08:00:00Z' },
  { id: 'n-4', userId: 'user-3', title: 'Verification Complete', message: 'Credential verification for John Muthui Gachuru completed successfully.', type: 'success', read: false, createdAt: '2026-04-10T16:25:00Z' },
  { id: 'n-5', userId: 'user-4', title: 'Fraud Alert', message: 'An invalid credential hash was submitted for verification.', type: 'warning', read: false, createdAt: '2026-04-08T10:10:00Z' },
];

// ─── API Functions ───────────────────────────────────

let currentUser: User | null = null;

export async function mockLogin(email: string, _password: string, role: UserRole): Promise<User> {
  await delay();
  const user = users.find(u => u.email === email && u.role === role) || users.find(u => u.role === role);
  if (!user) throw new Error('Invalid credentials');
  const { password: _, ...safe } = user;
  currentUser = safe;
  return safe;
}

export async function mockGetCurrentUser(): Promise<User | null> {
  await delay(200);
  return currentUser;
}

export async function mockLogout(): Promise<void> {
  await delay(200);
  currentUser = null;
}

export async function mockSignup(data: { name: string; email: string; password: string; role: UserRole; institution?: string }): Promise<User> {
  await delay(900);
  if (users.some(u => u.email.toLowerCase() === data.email.toLowerCase())) {
    throw new Error('An account with this email already exists');
  }
  const newUser: User & { password: string } = {
    id: 'user-' + (users.length + 1),
    name: data.name,
    email: data.email,
    role: data.role,
    walletAddress: '0x' + randomHash().slice(0, 40),
    avatarUrl: '',
    institution: data.institution,
    password: data.password,
  };
  users.push(newUser);
  const { password: _, ...safe } = newUser;
  return safe;
}

export async function mockRequestPasswordReset(email: string): Promise<{ sent: boolean; email: string }> {
  await delay(1200);
  return { sent: true, email };
}

export async function mockResetPassword(token: string, newPassword: string): Promise<{ success: boolean }> {
  await delay(1200);
  if (!token || newPassword.length < 6) throw new Error('Invalid reset token or password');
  return { success: true };
}

// Credentials
export async function mockGetAllCredentials(filters?: { status?: string; course?: string; institutionId?: string }): Promise<Credential[]> {
  await delay();
  let result = [...credentials];
  if (filters?.status) result = result.filter(c => c.status === filters.status);
  if (filters?.course) result = result.filter(c => c.course.toLowerCase().includes(filters.course!.toLowerCase()));
  if (filters?.institutionId) result = result.filter(c => c.institutionId === filters.institutionId);
  return result;
}

export async function mockGetCredentialById(id: string): Promise<Credential | undefined> {
  await delay();
  return credentials.find(c => c.id === id);
}

export async function mockGetCredentialsByStudent(studentId: string): Promise<Credential[]> {
  await delay();
  return credentials.filter(c => c.studentId === studentId);
}

export async function mockGetCredentialsByInstitution(institutionId: string): Promise<Credential[]> {
  await delay();
  return credentials.filter(c => c.institutionId === institutionId);
}

export async function mockIssueCredential(data: Partial<Credential>): Promise<Credential> {
  await delay(800);
  const newCred: Credential = {
    id: 'cred-' + (credentials.length + 1),
    studentId: data.studentId || '',
    studentName: data.studentName || '',
    institutionId: data.institutionId || 'inst-1',
    institutionName: data.institutionName || 'Machakos University',
    certificateType: data.certificateType || 'Degree',
    course: data.course || '',
    grade: data.grade || '',
    issueDate: new Date().toISOString().split('T')[0],
    credentialHash: randomHash(),
    txHash: randomTx(),
    blockNumber: 18236000 + Math.floor(Math.random() * 1000),
    networkName: Math.random() > 0.5 ? 'Ethereum' : 'Polygon',
    status: 'active',
    issuedBy: data.issuedBy || 'Admin',
    ...data,
  };
  credentials.push(newCred);
  return newCred;
}

export async function mockRevokeCredential(id: string, _reason: string): Promise<Credential> {
  await delay();
  const cred = credentials.find(c => c.id === id);
  if (!cred) throw new Error('Credential not found');
  cred.status = 'revoked';
  return { ...cred };
}

export async function mockVerifyCredentialByHash(hash: string): Promise<{ valid: boolean; credential?: Credential; message: string }> {
  await delay(800);
  const cred = credentials.find(c => c.credentialHash === hash);
  if (cred && cred.status === 'active') {
    return { valid: true, credential: cred, message: 'Credential is valid and verified on the blockchain.' };
  }
  if (cred && cred.status === 'revoked') {
    return { valid: false, credential: cred, message: 'This credential has been revoked by the issuing institution.' };
  }
  return { valid: false, message: 'No credential found matching this hash. The credential may be fraudulent.' };
}

// Institutions
export async function mockGetInstitutions(): Promise<Institution[]> {
  await delay();
  return [...institutions];
}

export async function mockGetInstitutionById(id: string): Promise<Institution | undefined> {
  await delay();
  return institutions.find(i => i.id === id);
}

// Verifications
export async function mockGetVerificationRequests(verifierId?: string): Promise<VerificationRequest[]> {
  await delay();
  if (verifierId) return verificationRequests.filter(v => v.verifierId === verifierId);
  return [...verificationRequests];
}

export async function mockSubmitVerificationRequest(hash: string): Promise<VerificationRequest> {
  await delay(800);
  const cred = credentials.find(c => c.credentialHash === hash);
  const req: VerificationRequest = {
    id: 'vr-' + (verificationRequests.length + 1),
    verifierId: currentUser?.id || 'user-3',
    verifierName: currentUser?.name || 'Verifier',
    verifierOrg: 'TechCorp Kenya',
    credentialHash: hash,
    credentialId: cred?.id || '',
    requestDate: new Date().toISOString().split('T')[0],
    result: cred && cred.status === 'active' ? 'valid' : 'invalid',
    responseTime: Math.random() * 2 + 0.5,
  };
  verificationRequests.push(req);
  return req;
}

// Transactions
export async function mockGetTransactions(filters?: { type?: string }): Promise<Transaction[]> {
  await delay();
  let result = [...transactions];
  if (filters?.type) result = result.filter(t => t.type === filters.type);
  return result;
}

// Dashboard
export async function mockGetDashboardStats(_role: UserRole, _userId?: string): Promise<DashboardStats> {
  await delay();
  return {
    totalCredentials: credentials.length,
    totalInstitutions: institutions.length,
    totalStudents: users.filter(u => u.role === 'student').length,
    totalVerifications: verificationRequests.length,
    fraudPrevented: 23,
    avgVerificationTime: 1.2,
  };
}

// Notifications
export async function mockGetNotifications(userId: string): Promise<Notification[]> {
  await delay();
  return notifications.filter(n => n.userId === userId);
}

export async function mockMarkNotificationRead(id: string): Promise<void> {
  await delay(200);
  const n = notifications.find(n => n.id === id);
  if (n) n.read = true;
}

// Export for credential hash lookup
export function getCredentialHashes(): string[] {
  return credentials.map(c => c.credentialHash);
}
