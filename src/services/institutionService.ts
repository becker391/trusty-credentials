import { api } from '@/api';

export const getInstitutions = () => api.institutions.getInstitutions();
export const getInstitutionById = (id: string) => api.institutions.getInstitution(id);
