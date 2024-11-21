import {
  createReducer,
  on,
  createFeatureSelector,
  createSelector,
} from "@ngrx/store";
import * as AuthActions from "./auth.actions";
import { AuthState } from "./auth.interface";

export const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  isRegistered: false,
};

export const authReducer = createReducer(
  initialState,

  on(AuthActions.loginSuccess, (state) => ({
    ...state,
    error: null,
  })),

  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    error,
  })),

  on(AuthActions.tokenCleared, () => initialState),
);

export const selectAuthState = createFeatureSelector<AuthState>("auth");

export const selectError = createSelector(
  selectAuthState,
  (state) => state.error,
);
