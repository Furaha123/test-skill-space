import { createReducer, on } from "@ngrx/store";
import * as AuthActions from "./auth.actions";
import { initialState } from "./auth.interface";

export const authReducer = createReducer(
  initialState,

  on(AuthActions.registerUser, (state, { user }) => ({
    ...state,
    loading: true,
    error: null,
    user: {
      ...user,
      password: "*********",
    },
  })),

  on(AuthActions.registerUserSuccess, (state) => ({
    ...state,
    loading: false,
    isRegistered: true,
    error: null,
  })),

  on(AuthActions.registerUserFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
    isRegistered: false,
  })),

  on(AuthActions.registerCompany, (state, { company }) => ({
    ...state,
    loading: true,
    user: {
      ...company,
      password: "*********",
    },
  })),
  on(AuthActions.registerCompanySuccess, (state) => ({
    ...state,
    loading: false,
    error: null,
  })),
  on(AuthActions.registerCompanyFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

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
