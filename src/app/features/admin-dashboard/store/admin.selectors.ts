import { createFeatureSelector, createSelector } from "@ngrx/store";
import { AdminState } from "./admin.state";

// Base selector
export const selectAdminState = createFeatureSelector<AdminState>("admin");

// Companies list selectors
export const selectCompanies = createSelector(
  selectAdminState,
  (state) => state.companies,
);

export const selectPagination = createSelector(
  selectAdminState,
  (state) => state.pagination,
);

export const selectIsLoading = createSelector(
  selectAdminState,
  (state) => state.isLoading,
);

export const selectError = createSelector(
  selectAdminState,
  (state) => state.error,
);

export const selectTotalItems = createSelector(
  selectPagination,
  (pagination) => pagination.totalItems,
);

export const selectCurrentPage = createSelector(
  selectPagination,
  (pagination) => pagination.currentPage,
);

export const selectPageSize = createSelector(
  selectPagination,
  (pagination) => pagination.pageSize,
);

export const selectIsSearching = createSelector(
  selectAdminState,
  (state) => state.isSearching,
);

// Individual company selectors
export const selectCompanyById = (companyId: string) =>
  createSelector(selectCompanies, (companies) =>
    companies?.find((company) => company.id === companyId),
  );
