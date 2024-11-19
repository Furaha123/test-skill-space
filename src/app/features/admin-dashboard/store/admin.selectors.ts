import { createFeatureSelector, createSelector } from "@ngrx/store";
import { AdminState } from "./admin.state";

// Base selector
export const selectAdminState = createFeatureSelector<AdminState>("admin");

// Companies list selectors
export const selectCompanies = createSelector(
  selectAdminState,
  (state) => state.companies,
);

export const selectIsLoading = createSelector(
  selectAdminState,
  (state) => state.isLoading,
);

export const selectError = createSelector(
  selectAdminState,
  (state) => state.error,
);

// Individual company selectors
export const selectCompanyById = (companyId: string) =>
  createSelector(selectCompanies, (companies) =>
    companies?.find((company) => company.id === companyId),
  );

// Status-based selectors
export const selectPendingCompanies = createSelector(
  selectCompanies,
  (companies) =>
    companies?.filter((company) => company.status === "pending") || [],
);

export const selectApprovedCompanies = createSelector(
  selectCompanies,
  (companies) =>
    companies?.filter((company) => company.status === "approved") || [],
);

export const selectRejectedCompanies = createSelector(
  selectCompanies,
  (companies) =>
    companies?.filter((company) => company.status === "rejected") || [],
);

// Count selectors
export const selectTotalCompanies = createSelector(
  selectCompanies,
  (companies) => companies?.length || 0,
);

export const selectPendingCount = createSelector(
  selectPendingCompanies,
  (companies) => companies.length,
);

export const selectApprovedCount = createSelector(
  selectApprovedCompanies,
  (companies) => companies.length,
);

export const selectRejectedCount = createSelector(
  selectRejectedCompanies,
  (companies) => companies.length,
);

// Search selector
export const selectSearchResults = (searchTerm: string) =>
  createSelector(
    selectCompanies,
    (companies) =>
      companies?.filter((company) => {
        const searchTermLower = searchTerm?.toLowerCase() || "";
        const nameMatch =
          company?.name?.toLowerCase()?.includes(searchTermLower) || false;
        const webMatch =
          company?.web?.toLowerCase()?.includes(searchTermLower) || false;
        const emailMatch =
          company?.email?.toLowerCase()?.includes(searchTermLower) || false;
        const phoneMatch =
          company?.phone?.toLowerCase()?.includes(searchTermLower) || false;

        return nameMatch || webMatch || emailMatch || phoneMatch;
      }) || [],
  );
