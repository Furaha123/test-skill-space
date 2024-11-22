import { createReducer, on } from "@ngrx/store";
import * as UserActions from "./auth.actions";
import { initialUserState } from "./auth.interface";

export const authReducer = createReducer(
  initialUserState,

  on(UserActions.registerUser, (state, { user }) => ({
    ...state,
    loading: true,
    error: null,
    user,
  })),

  on(UserActions.registerUserSuccess, (state) => ({
    ...state,
    loading: false,
    isRegistered: true,
    error: null,
  })),

  on(UserActions.registerUserFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
    isRegistered: false,
  })),
);
