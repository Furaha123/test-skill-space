import { createReducer, on } from "@ngrx/store";
import * as AuthActions from "./auth.actions";

export interface AuthState {
  token: string | null;
  role: string | null;
  error: string | null;
}

export const initialState: AuthState = {
  token: null,
  role: null,
  error: null,
};

export const authReducer = createReducer(
  initialState,
  on(AuthActions.loginSuccess, (state, { token, role }) => ({
    ...state,
    token,
    role,
    error: null,
  })),
  on(AuthActions.loginFailure, (state, { error }) => ({ ...state, error })),
  on(AuthActions.logout, (state) => ({
    ...state,
    token: null,
    role: null,
    error: null,
  })),
);
