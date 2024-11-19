import { createReducer, on } from "@ngrx/store";
import { CompanyUser } from "../models/company-user";
import {
  getUserInformation,
  getUserInformationSuccess,
  getUserInformationFailure,
  updateUserCompany,
} from "./company-profile-actions";

export interface CompanyUserState {
  user: CompanyUser | null;

  error: string | null;
  loading: boolean;
}

export const initialState: CompanyUserState = {
  user: null,
  error: null,
  loading: false,
};

export const companyUserReducer = createReducer(
  initialState,

  on(updateUserCompany, (state, { user }) => ({
    ...state,
    user: { ...user },
  })),

  on(getUserInformation, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(getUserInformationSuccess, (state, { user }) => ({
    ...state,
    user,
    loading: false,
    error: null,
  })),

  on(getUserInformationFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(updateUserCompany, (state, { user }) => ({
    ...state,
    user: { ...user },
  })),
);
