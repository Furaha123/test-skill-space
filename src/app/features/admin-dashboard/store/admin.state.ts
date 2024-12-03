import { Company } from "../models/company.model";
export interface AdminState {
  companies: Company[];
  selectedCompanyId: string | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    pageSize: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
  isSearching: boolean;
}

export const initialAdminState: AdminState = {
  companies: [],
  selectedCompanyId: null,
  isLoading: false,
  error: null,
  pagination: {
    currentPage: 0,
    totalPages: 0,
    totalItems: 0,
    pageSize: 0,
    hasNext: false,
    hasPrevious: false,
  },
  isSearching: false,
};
