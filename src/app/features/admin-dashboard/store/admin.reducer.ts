import { createReducer, on } from "@ngrx/store";
import { initialAdminState } from "./admin.state";
import { AdminActions, AppActions } from "./admin.actions";

export const adminReducer = createReducer(
  initialAdminState,
  // Load Companies
  on(AdminActions.loadCompanies, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),
  on(
    AdminActions.loadCompaniesSuccess,
    (
      state,
      {
        companies,
        currentPage,
        totalPages,
        totalItems,
        pageSize,
        hasNext,
        hasPrevious,
      },
    ) => ({
      ...state,
      companies,
      isLoading: false,
      error: null,
      pagination: {
        currentPage,
        totalPages,
        totalItems,
        pageSize,
        hasNext,
        hasPrevious,
      },
    }),
  ),
  on(AdminActions.loadCompaniesFailure, (state, { error }) => ({
    ...state,
    companies: [],
    isLoading: false,
    error,
  })),

  // Select Company
  on(AdminActions.selectCompany, (state, { companyId }) => ({
    ...state,
    selectedCompanyId: companyId,
  })),
  on(AdminActions.clearSelectedCompany, (state) => ({
    ...state,
    selectedCompanyId: null,
  })),

  // For searching companies
  on(AdminActions.searchCompanies, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),
  // For searching companies
  on(AdminActions.searchCompanies, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),
  on(
    AdminActions.searchCompaniesSuccess,
    (
      state,
      {
        companies,
        currentPage,
        totalPages,
        totalItems,
        pageSize,
        hasNext,
        hasPrevious,
      },
    ) => ({
      ...state,
      companies,
      isLoading: false,
      error: null,
      // Update search pagination for search results
      pagination: {
        currentPage,
        totalPages,
        totalItems,
        pageSize,
        hasNext,
        hasPrevious,
      },
    }),
  ),
  on(AdminActions.searchCompaniesFailure, (state, { error }) => ({
    ...state,
    companies: [],
    isLoading: false,
    error,
  })),

  on(AppActions.setSearchTerm, (state, { searchTerm }) => ({
    ...state,
    isSearching: searchTerm.length > 0,
  })),

  // Approve Company
  on(AdminActions.approveCompany, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),
  on(AdminActions.approveCompanySuccess, (state) => ({
    ...state,
    isLoading: false,
  })),
  on(AdminActions.approveCompanyFailure, (state) => ({
    ...state,
    isLoading: false,
    error: null,
  })),

  // Reject Company
  on(AdminActions.rejectCompany, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),
  on(AdminActions.rejectCompanySuccess, (state) => ({
    ...state,
    isLoading: false,
  })),
  on(AdminActions.rejectCompanyFailure, (state) => ({
    ...state,
    isLoading: false,
    error: null,
  })),
);
