import { createFeatureSelector, createSelector } from "@ngrx/store";
import { UserState } from "./auth.interface";

const selectUserState = createFeatureSelector<UserState>("user");

export const selectUser = createSelector(
  selectUserState,
  (state: UserState) => state.user,
);

export const selectIsLoading = createSelector(
  selectUserState,
  (state: UserState) => state.loading,
);

export const selectError = createSelector(
  selectUserState,
  (state: UserState) => state.error,
);

export const selectIsRegistered = createSelector(
  selectUserState,
  (state: UserState) => state.isRegistered,
);
