import { createReducer, on } from "@ngrx/store";
import { initialAdminState } from "./admin.state";
import { AdminActions } from "./admin.actions";

export const adminReducer = createReducer(
  initialAdminState,
  // Load Companies
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
);
