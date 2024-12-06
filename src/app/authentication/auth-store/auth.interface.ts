import { Company } from "../../shared/models/company.interface";
import { Talent } from "../../shared/models/talent.interface";

// Base State Interface
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

// Base Response Interface
export interface BaseResponse {
  status: string;
  message: string;
}

// OTP Related Interfaces
export interface OtpVerificationData {
  email?: string;
  otp: string;
}

export interface OtpResponseData {
  email?: string;
  otpVerified?: boolean;
}

// Login Related Interfaces
export interface LoginResponseData {
  token: string;
  roles: string[];
}

export interface LoginResponse extends BaseResponse {
  data: LoginResponseData;
}

// Password Reset Interfaces
export interface PasswordResetOtpRequest {
  otp: string;
}

export interface PasswordResetRequest {
  newPassword: string;
  email?: string;
}

export interface PasswordResetResponse extends BaseResponse {
  data?: {
    email?: string;
    passwordReset?: boolean;
  };
}

// Common Response Interface
export interface ResponseInterface extends BaseResponse {
  data?: {
    email?: string;
    token?: string;
    roles?: string[];
    otpVerified?: boolean;
    passwordReset?: boolean;
  };
}

// Error Interface
export interface ApiError {
  error: {
    message: string;
    status: number;
  };
}
