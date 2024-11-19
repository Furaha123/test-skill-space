import { createReducer, on } from "@ngrx/store";
import { initialAdminState } from "./admin.state";
import { AdminActions } from "./admin.actions";

export const adminReducer = createReducer(
  initialAdminState,
  // Load Companies
  on(AdminActions.loadCompanies, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),
  on(AdminActions.loadCompaniesSuccess, (state, { companies }) => ({
    ...state,
    companies,
    isLoading: false,
    error: null,
  })),
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

  // Update Company Status
  on(AdminActions.approveCompanySuccess, (state, { company }) => ({
    ...state,
    companies: state.companies.map((c) =>
      c.id === company.id ? { ...c, status: "approved" } : c,
    ),
  })),
  on(AdminActions.rejectCompanySuccess, (state, { company }) => ({
    ...state,
    companies: state.companies.map((c) =>
      c.id === company.id ? { ...c, status: "rejected" } : c,
    ),
  })),
);
