import { createFeatureSelector, createSelector } from "@ngrx/store";
import { AppRootState } from "./app.state";

export const selectAppState = createFeatureSelector<AppRootState>("app");

export const selectSearchTerm = createSelector(
  selectAppState,
  (state) => state.searchTerm,
);
