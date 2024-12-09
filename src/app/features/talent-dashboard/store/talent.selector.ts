import { createFeatureSelector, createSelector } from "@ngrx/store";
import { EducationState } from "./talent.reducer";

export const selectEducationState =
  createFeatureSelector<EducationState>("education");

// Selector for education records
export const selectEducationRecords = createSelector(
  selectEducationState,
  (state: EducationState) => state.educationRecords,
);

// Selector for loading state
export const selectEducationLoading = createSelector(
  selectEducationState,
  (state: EducationState) => state.isLoading,
);

// Selector for error state
export const selectEducationError = createSelector(
  selectEducationState,
  (state: EducationState) => state.error,
);
