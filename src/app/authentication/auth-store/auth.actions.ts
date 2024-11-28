import { createAction, props } from "@ngrx/store";
import { Talent } from "../../shared/models/talent.interface";
import { Company } from "../../shared/models/company.interface";

export const registerUser = createAction(
  "[User] Register User",
  props<{ user: Talent }>(),
);

export const registerUserSuccess = createAction("[User] Register User Success");

export const registerUserFailure = createAction(
  "[User] Register User Failure",
  props<{ error: string }>(),
);

// Company registration actions

export const registerCompany = createAction(
  "[Auth] Register Company",
  props<{ company: Company }>(),
);
export const registerCompanySuccess = createAction(
  "[Auth] Register Company Success",
);

export const registerCompanyFailure = createAction(
  "[Auth] Register Company Failure",
  props<{ error: string }>(),
);
export const login = createAction(
  "[Auth] Login",
  props<{ email: string; password: string }>(),
);

export const loginSuccess = createAction(
  "[Auth] Login Success",
  props<{ token: string; roles: string[] }>(),
);

export const loginFailure = createAction(
  "[Auth] Login Failure",
  props<{ error: string }>(),
);

export const forgotPassword = createAction(
  "[Auth] Forgot Password",
  props<{ email: string }>(),
);

export const forgotPasswordSuccess = createAction(
  "[Auth] Forgot Password Success",
  props<{ message: string }>(),
);

export const forgotPasswordFailure = createAction(
  "[Auth] Forgot Password Failure",
  props<{ error: string }>(),
);

export const verifyResetOtp = createAction(
  "[Auth] Verify Reset OTP",
  props<{ email: string; otp: string }>(),
);

export const verifyResetOtpSuccess = createAction(
  "[Auth] Verify Reset OTP Success",
  props<{ message: string }>(),
);

export const verifyResetOtpFailure = createAction(
  "[Auth] Verify Reset OTP Failure",
  props<{ error: string }>(),
);

export const verifyPasswordResetOtp = createAction(
  "[Auth] Verify Password Reset OTP",
  props<{ email: string; otp: string }>(),
);

export const verifyPasswordResetOtpSuccess = createAction(
  "[Auth] Verify Password Reset OTP Success",
  props<{ message: string }>(),
);

export const verifyPasswordResetOtpFailure = createAction(
  "[Auth] Verify Password Reset OTP Failure",
  props<{ error: string }>(),
);

export const requestNewOtp = createAction(
  "[Auth] Request New OTP",
  props<{ email: string }>(),
);

export const requestNewOtpSuccess = createAction(
  "[Auth] Request New OTP Success",
  props<{ message: string }>(),
);

export const requestNewOtpFailure = createAction(
  "[Auth] Request New OTP Failure",
  props<{ error: string }>(),
);

export const resetPassword = createAction(
  "[Auth] Reset Password",
  props<{
    email: string;
    newPassword: string;
    confirmPassword: string;
  }>(),
);

export const resetPasswordSuccess = createAction(
  "[Auth] Reset Password Success",
  props<{ message: string }>(),
);

export const resetPasswordFailure = createAction(
  "[Auth] Reset Password Failure",
  props<{ error: string }>(),
);

export const tokenCleared = createAction("[Auth] Token Cleared");
