/**
 * Real API implementation for Trusty Credentials
 * This replaces the mock API with actual backend calls
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

// Helper function to make API calls
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const defaultHeaders = {
    "Content-Type": "application/json",
  };

  // Add auth token if available
  const token = localStorage.getItem("auth_token");
  if (token) {
    defaultHeaders["Authorization"] = `Token ${token}`;
  }

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || `HTTP ${response.status}: ${response.statusText}`,
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`API call failed: ${endpoint}`, error);
    throw error;
  }
}

// Auth API
export const authApi = {
  async login(email: string, password: string, role?: string) {
    const body: any = { email, password };
    // Only include role if it's provided and we want to filter by it
    // For now, let's not filter by role to avoid the error

    const response = await apiCall<any>("/auth/login/", {
      method: "POST",
      body: JSON.stringify(body),
    });
    const user = response.data || response;

    // Store token for future requests
    if (user.token) {
      localStorage.setItem("auth_token", user.token);
    }

    // Map backend user response to frontend user type
    const mappedUser = {
      id: user.id,
      name: `${user.first_name} ${user.last_name}`.trim(),
      email: user.email,
      role: user.roles?.[0]?.role || "student", // Get first role
      walletAddress: "", // Will be populated later if needed
      avatarUrl: user.avatar_url || "",
      institution:
        user.roles?.[0]?.role === "institution"
          ? "Massachusetts Institute of Technology"
          : undefined,
      institutionId: user.roles?.[0]?.scope_id || undefined, // Add institution ID from role scope
    };

    return mappedUser;
  },

  async signup(data: {
    name: string;
    email: string;
    password: string;
    role: string;
    institution?: string;
  }) {
    const [firstName, ...lastNameParts] = data.name.split(" ");
    const lastName = lastNameParts.join(" ");

    const response = await apiCall<any>("/auth/signup/", {
      method: "POST",
      body: JSON.stringify({
        email: data.email,
        username: data.email.split("@")[0],
        first_name: firstName,
        last_name: lastName,
        password: data.password,
        role: data.role,
      }),
    });
    const user = response.data || response;

    if (user.token) {
      localStorage.setItem("auth_token", user.token);
    }

    // Map backend user response to frontend user type
    const mappedUser = {
      id: user.id,
      name: `${user.first_name} ${user.last_name}`.trim(),
      email: user.email,
      role: user.roles?.[0]?.role || data.role,
      walletAddress: "",
      avatarUrl: user.avatar_url || "",
      institution: data.institution,
    };

    return mappedUser;
  },

  async getCurrentUser() {
    const response = await apiCall<any>("/auth/me/");
    const user = response.data || response;

    // Map backend user response to frontend user type
    const mappedUser = {
      id: user.id,
      name: `${user.first_name} ${user.last_name}`.trim(),
      email: user.email,
      role: user.roles?.[0]?.role || "student", // Get first role
      walletAddress: "", // Will be populated later if needed
      avatarUrl: user.avatar_url || "",
      institution:
        user.roles?.[0]?.role === "institution"
          ? "Massachusetts Institute of Technology"
          : undefined,
      institutionId: user.roles?.[0]?.scope_id || undefined, // Add institution ID from role scope
    };

    return mappedUser;
  },

  async logout() {
    try {
      await apiCall("/auth/logout/", { method: "POST" });
    } finally {
      localStorage.removeItem("auth_token");
    }
  },

  async requestPasswordReset(email: string) {
    return await apiCall<any>("/auth/forgot-password/", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },

  async resetPassword(token: string, newPassword: string) {
    return await apiCall<any>("/auth/reset-password/", {
      method: "POST",
      body: JSON.stringify({ token, password: newPassword }),
    });
  },
};

// Credentials API
export const credentialsApi = {
  async getCredentials(filters?: any) {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, String(value));
      });
    }
    
    const endpoint = `/credentials/${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await apiCall<any>(endpoint);
    
    // Map backend response to frontend format
    const mappedCredentials = (response.data || []).map((cred: any) => ({
      id: cred.id,
      studentId: cred.student,
      studentName: cred.metadata?.student_name || 'Unknown Student',
      institutionId: cred.institution,
      institutionName: cred.institution_name,
      certificateType: cred.certificate_type,
      course: cred.course,
      grade: cred.grade,
      issueDate: cred.issue_date,
      expiryDate: cred.expiry_date,
      credentialHash: cred.credential_hash_hex,
      txHash: cred.tx_hash || '',
      blockNumber: cred.block_number || 0,
      networkName: 'Polygon',
      status: cred.status,
      nftTokenId: cred.nft_token_id,
      ipfsUrl: cred.ipfs_cid ? `https://ipfs.io/ipfs/${cred.ipfs_cid}` : undefined,
      issuedBy: cred.issued_by_email || 'Unknown',
    }));
    
    return { data: mappedCredentials };
  },

  async getCredential(id: string) {
    const response = await apiCall<any>(`/credentials/${id}/`);
    
    // Map single credential
    const cred = response.data;
    const mappedCredential = {
      id: cred.id,
      studentId: cred.student,
      studentName: cred.metadata?.student_name || 'Unknown Student',
      institutionId: cred.institution,
      institutionName: cred.institution_name,
      certificateType: cred.certificate_type,
      course: cred.course,
      grade: cred.grade,
      issueDate: cred.issue_date,
      expiryDate: cred.expiry_date,
      credentialHash: cred.credential_hash_hex,
      txHash: cred.tx_hash || '',
      blockNumber: cred.block_number || 0,
      networkName: 'Polygon',
      status: cred.status,
      nftTokenId: cred.nft_token_id,
      ipfsUrl: cred.ipfs_cid ? `https://ipfs.io/ipfs/${cred.ipfs_cid}` : undefined,
      issuedBy: cred.issued_by_email || 'Unknown',
    };
    
    return { data: mappedCredential };
  },

  async issueCredential(data: any) {
    // Transform frontend data to match backend expectations
    const backendData = {
      student_email: data.studentEmail || `${data.studentName?.toLowerCase().replace(/\s+/g, '.')}@student.example.com`,
      student_name: data.studentName,
      institution: data.institutionId || 'e56b14fc-f13a-4a35-9d3e-be6114660540', // Default to MIT
      certificate_type: data.certificateType,
      course: data.course,
      grade: data.grade,
      issue_date: data.graduationDate || new Date().toISOString().split('T')[0],
      expiry_date: data.expiryDate || null,
      metadata_description: data.description || `${data.certificateType} in ${data.course}`,
    };

    console.log('Sending credential data:', backendData);

    const response = await apiCall<any>('/credentials/', {
      method: 'POST',
      body: JSON.stringify(backendData),
    });
    return response.data ?? response;
  },

  async revokeCredential(id: string, reason: string) {
    return await apiCall<any>(`/credentials/${id}/revoke/`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  },

  async getStudentCredentials(studentId: string) {
    const response = await apiCall<any>(`/credentials/by_student/?student_id=${studentId}`);
    
    // Map credentials array
    const mappedCredentials = (response.data || []).map((cred: any) => ({
      id: cred.id,
      studentId: cred.student,
      studentName: cred.metadata?.student_name || 'Unknown Student',
      institutionId: cred.institution,
      institutionName: cred.institution_name,
      certificateType: cred.certificate_type,
      course: cred.course,
      grade: cred.grade,
      issueDate: cred.issue_date,
      expiryDate: cred.expiry_date,
      credentialHash: cred.credential_hash_hex,
      txHash: cred.tx_hash || '',
      blockNumber: cred.block_number || 0,
      networkName: 'Polygon',
      status: cred.status,
      nftTokenId: cred.nft_token_id,
      ipfsUrl: cred.ipfs_cid ? `https://ipfs.io/ipfs/${cred.ipfs_cid}` : undefined,
      issuedBy: cred.issued_by_email || 'Unknown',
    }));
    
    return { data: mappedCredentials };
  },

  async getInstitutionCredentials(institutionId: string) {
    const response = await apiCall<any>(`/credentials/by_institution/?institution_id=${institutionId}`);
    
    // Map credentials array
    const mappedCredentials = (response.data || []).map((cred: any) => ({
      id: cred.id,
      studentId: cred.student,
      studentName: cred.metadata?.student_name || 'Unknown Student',
      institutionId: cred.institution,
      institutionName: cred.institution_name,
      certificateType: cred.certificate_type,
      course: cred.course,
      grade: cred.grade,
      issueDate: cred.issue_date,
      expiryDate: cred.expiry_date,
      credentialHash: cred.credential_hash_hex,
      txHash: cred.tx_hash || '',
      blockNumber: cred.block_number || 0,
      networkName: 'Polygon',
      status: cred.status,
      nftTokenId: cred.nft_token_id,
      ipfsUrl: cred.ipfs_cid ? `https://ipfs.io/ipfs/${cred.ipfs_cid}` : undefined,
      issuedBy: cred.issued_by_email || 'Unknown',
    }));
    
    return { data: mappedCredentials };
  },
};

// Verification API
export const verificationApi = {
  async verifyCredential(hash: string) {
    return await apiCall<any>('/verify/', {
      method: 'POST',
      body: JSON.stringify({ credential_hash: hash }),
    });
  },

  async getVerificationHistory() {
    return await apiCall<any>('/verifications/');
  },
};

// Institutions API
export const institutionsApi = {
  async getInstitutions() {
    const response = await apiCall<any>('/institutions/');
    
    // Map backend response to frontend format
    const institutions = (response.results || response.data || []).map((inst: any) => ({
      id: inst.id,
      name: inst.name,
      country: inst.country,
      accreditationId: inst.accreditation_id,
      publicKey: inst.public_key,
      logoUrl: inst.logo_url,
      totalIssued: 0, // TODO: Calculate from credentials
      joinedDate: inst.joined_at ? new Date(inst.joined_at).toLocaleDateString() : 'Unknown',
    }));
    
    return { data: institutions };
  },

  async getInstitution(id: string) {
    const response = await apiCall<any>(`/institutions/${id}/`);
    
    // Map single institution
    const inst = response.data || response;
    const mappedInstitution = {
      id: inst.id,
      name: inst.name,
      country: inst.country,
      accreditationId: inst.accreditation_id,
      publicKey: inst.public_key,
      logoUrl: inst.logo_url,
      totalIssued: 0, // TODO: Calculate from credentials
      joinedDate: inst.joined_at ? new Date(inst.joined_at).toLocaleDateString() : 'Unknown',
    };
    
    return { data: mappedInstitution };
  },

  async createInstitution(data: any) {
    return await apiCall<any>('/institutions/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// Blockchain API
export const blockchainApi = {
  async getTransactions() {
    return await apiCall<any>('/blockchain-transactions/');
  },

  async getTransaction(id: string) {
    return await apiCall<any>(`/blockchain-transactions/${id}/`);
  },
};

// Notifications API
export const notificationsApi = {
  async getNotifications(userId: string) {
    return await apiCall<any>('/notifications/');
  },

  async markRead(id: string) {
    return await apiCall<any>(`/notifications/${id}/mark_read/`, {
      method: 'POST',
    });
  },

  async markAllRead() {
    return await apiCall<any>('/notifications/mark_all_read/', {
      method: 'POST',
    });
  },
};

// Dashboard API
export const dashboardApi = {
  async getStats(role: string, userId?: string) {
    const params = new URLSearchParams();
    params.append('role', role);
    if (userId) params.append('userId', userId);
    
    return await apiCall<any>(`/dashboard/stats/?${params.toString()}`);
  },
};

// Export all APIs
export const realApi = {
  auth: authApi,
  credentials: credentialsApi,
  verification: verificationApi,
  institutions: institutionsApi,
  blockchain: blockchainApi,
  notifications: notificationsApi,
  dashboard: dashboardApi,
};