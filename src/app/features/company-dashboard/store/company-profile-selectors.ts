import { createSelector, createFeatureSelector } from "@ngrx/store";
import { CompanyUserState } from "./company-profile.reducer";

export const selectCompanyUserState =
  createFeatureSelector<CompanyUserState>("companyUser");

export const selectCompanyUser = createSelector(
  selectCompanyUserState,
  (state: CompanyUserState) => state.user,
);
