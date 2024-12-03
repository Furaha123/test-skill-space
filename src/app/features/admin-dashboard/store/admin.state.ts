import { Company } from "../models/company.model";
export interface AdminState {
  companies: Company[];
  searchedCompanies: Company[];
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
  searchPagination: {
    currentPage: number;
    itemsPerPage: number;
  };
  loadedDataSources: string[];
  searchLoadedDataSources: string[];
  hasMoreData: boolean;
  hasMoreSearchData: boolean;
  isSearching: boolean;
}

export const initialAdminState: AdminState = {
  companies: [],
  searchedCompanies: [],
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
  searchPagination: {
    currentPage: 1,
    itemsPerPage: 5,
  },
  loadedDataSources: [],
  searchLoadedDataSources: [],
  hasMoreData: true,
  hasMoreSearchData: true,
  isSearching: false,
};
