import { Company } from "../../shared/models/company.interface";
import { Talent } from "../../shared/models/talent.interface";

export interface AuthState {
  user: Talent | Company | null;
  loading: boolean;
  error: string | null;
  isRegistered: boolean;
}

export const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  isRegistered: false,
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
