import { createReducer, on } from "@ngrx/store";
import * as AuthActions from "./auth.actions";
import { initialState } from "./auth.interface";

export const authReducer = createReducer(
  initialState,

  on(AuthActions.registerUser, (state, { user }) => ({
    ...state,
    loading: true,
    error: null,
    user,
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

  on(AuthActions.login, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(AuthActions.loginSuccess, (state) => ({
    ...state,
    loading: false,
    error: null,
  })),

  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(AuthActions.forgotPassword, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(AuthActions.forgotPasswordSuccess, (state, { message }) => ({
    ...state,
    loading: false,
    error: null,
    successMessage: message,
  })),

  on(AuthActions.forgotPasswordFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(AuthActions.verifyResetOtp, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(AuthActions.verifyResetOtpSuccess, (state, { message }) => ({
    ...state,
    loading: false,
    error: null,
    successMessage: message,
    otpVerified: true,
  })),

  on(AuthActions.verifyResetOtpFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
    otpVerified: false,
  })),

  on(AuthActions.verifyPasswordResetOtp, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(AuthActions.verifyPasswordResetOtpSuccess, (state, { message }) => ({
    ...state,
    loading: false,
    error: null,
    successMessage: message,
    otpVerified: true,
  })),

  on(AuthActions.verifyPasswordResetOtpFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
    otpVerified: false,
  })),

  on(AuthActions.requestNewOtp, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(AuthActions.requestNewOtpSuccess, (state, { message }) => ({
    ...state,
    loading: false,
    error: null,
    successMessage: message,
  })),

  on(AuthActions.requestNewOtpFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(AuthActions.resetPassword, (state) => ({
    ...state,
    loading: true,
    error: null,
    passwordReset: false,
  })),

  on(AuthActions.resetPasswordSuccess, (state, { message }) => ({
    ...state,
    loading: false,
    error: null,
    successMessage: message,
    passwordReset: true,
  })),

  on(AuthActions.resetPasswordFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
    passwordReset: false,
  })),
);
