import { mockGetInstitutions, mockGetInstitutionById } from '@/api/mockApi';

export const getInstitutions = () => mockGetInstitutions();
export const getInstitutionById = (id: string) => mockGetInstitutionById(id);
