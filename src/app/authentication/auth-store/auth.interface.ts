import { Company } from "../../shared/models/company.interface";
import { Talent } from "../../shared/models/talent.interface";

export interface AuthState {
  user: Talent | Company | null;
  loading: boolean;
  error: string | null;
  isRegistered: boolean;
  successMessage: string | null;
  otpVerified: boolean;
  passwordResetOtpVerified: boolean;
  passwordReset: boolean;
}

export const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  isRegistered: false,
  successMessage: null,
  otpVerified: false,
  passwordResetOtpVerified: false,
  passwordReset: false,
};

export interface LoginResponse {
  status: string;
  data: {
    token: string;
    roles: string[];
  };
  message: string;
}

export interface LoginError {
  message: string;
  status: number;
  error: string;
}

export interface ForgotPasswordResponse {
  status: string;
  message: string;
}

export interface OtpVerificationResponse {
  status: string;
  message: string;
}

export interface PasswordResetOtpResponse {
  status: string;
  message: string;
}

export interface PasswordResetRequest {
  email: string;
  newPassword: string;
  confirmPassword: string;
}

export interface PasswordResetResponse {
  status: string;
  message: string;
}

export interface ApiError {
  error: {
    message: string;
    status: number;
  };
}
