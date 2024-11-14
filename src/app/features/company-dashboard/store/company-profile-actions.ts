import { createAction, props } from "@ngrx/store";
import { CompanyUser } from "../models/company-user";

// Action to initiate user company update
export const updateUserCompany = createAction(
  "[CompanyUser] Update User Company",
  props<{ user: CompanyUser }>(),
);

// Action to get user information
export const getUserInformation = createAction(
  "[CompanyUser] Get User Information",
);

// Action for successful retrieval of user information
export const getUserInformationSuccess = createAction(
  "[CompanyUser] Get User Information Success",
  props<{ user: CompanyUser }>(),
);

// Action for failed retrieval of user information
export const getUserInformationFailure = createAction(
  "[CompanyUser] Get User Information Failure",
  props<{ error: string }>(),
);

// Action to initiate user information update
export const updateUserInformation = createAction(
  "[CompanyUser] Update User Information",
  props<{ updatedData: Partial<CompanyUser> }>(),
);

// Action for successful update of user information
export const updateUserInformationSuccess = createAction(
  "[CompanyUser] Update User Information Success",
);

// Action for failed update of user information
export const updateUserInformationFailure = createAction(
  "[CompanyUser] Update User Information Failure",
  props<{ error: string }>(),
);
