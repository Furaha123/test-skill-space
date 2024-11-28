import { createFeatureSelector, createSelector } from "@ngrx/store";
import { AuthState } from "./auth.interface";
import { AppState } from "../../shared/models/app.state.interface";

const selectUserState = createFeatureSelector<AppState, AuthState>("auth");

export const selectUser = createSelector(
  selectUserState,
  (state: AuthState) => state.user,
);

export const selectIsLoading = createSelector(
  selectUserState,
  (state: AuthState) => state.loading,
);

export const selectError = createSelector(
  selectUserState,
  (state: AuthState) => state.error,
);

export const selectIsRegistered = createSelector(
  selectUserState,
  (state: AuthState) => state.isRegistered,
);

export const selectSuccessMessage = createSelector(
  selectUserState,
  (state: AuthState) => state.successMessage,
);

export const selectOtpVerified = createSelector(
  selectUserState,
  (state: AuthState) => state.otpVerified,
);

export const selectPasswordResetOtpVerified = createSelector(
  selectUserState,
  (state: AuthState) => state.passwordResetOtpVerified,
);

export const selectIsPasswordReset = createSelector(
  selectUserState,
  (state: AuthState) => state.passwordReset,
);
