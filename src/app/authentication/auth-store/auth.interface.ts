import { Talent } from "../../shared/models/talent.interface";

export interface AuthState {
  user: Talent | null;
  loading: boolean;
  error: string | null;
  isRegistered: boolean;
}

export const initialUserState: AuthState = {
  user: null,
  loading: false,
  error: null,
  isRegistered: false,
};
