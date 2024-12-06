import { createReducer, on } from "@ngrx/store";
import { CompanyUser } from "../models/company-user";
import {
  getUserInformation,
  getUserInformationSuccess,
  getUserInformationFailure,
  updateUserInformation,
  updateUserInformationSuccess,
  updateUserInformationFailure,
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

  on(
    getUserInformation,
    (state): CompanyUserState => ({
      ...state,
      loading: true,
      error: null,
    }),
  ),

  on(
    getUserInformationSuccess,
    (state, { user }): CompanyUserState => ({
      ...state,
      user,
      loading: false,
      error: null,
    }),
  ),

  on(
    getUserInformationFailure,
    (state, { error }): CompanyUserState => ({
      ...state,
      loading: false,
      error,
    }),
  ),

  // Removed unused parameters
  on(
    updateUserInformation,
    (state): CompanyUserState => ({
      ...state,
      loading: true,
      error: null,
    }),
  ),

  on(
    updateUserInformationSuccess,
    (state, { user }): CompanyUserState => ({
      ...state,
      user,
      loading: false,
      error: null,
    }),
  ),

  on(
    updateUserInformationFailure,
    (state, { error }): CompanyUserState => ({
      ...state,
      loading: false,
      error,
    }),
  ),
);
