import { Talent } from "../../shared/models/talent.interface";

export interface UserState {
  user: Talent | null;
  loading: boolean;
  error: string | null;
  isRegistered: boolean;
}

export const initialUserState: UserState = {
  user: null,
  loading: false,
  error: null,
  isRegistered: false,
};
