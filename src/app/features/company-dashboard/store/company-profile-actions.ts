import { createAction, props } from "@ngrx/store";
import { CompanyUser } from "../models/company-user";

export const updateUserCompany = createAction(
  "[CompanyUser] Update User Company",
  props<{ user: CompanyUser }>(),
);

export const getUserInformation = createAction(
  "[CompanyUser] Get User Information",
);

export const getUserInformationSuccess = createAction(
  "[CompanyUser] Get User Information Success",
  props<{ user: CompanyUser }>(),
);

export const getUserInformationFailure = createAction(
  "[CompanyUser] Get User Information Failure",
  props<{ error: string }>(),
);

export const updateUserInformation = createAction(
  "[CompanyUser] Update User Information",
  props<{ updatedData: Partial<CompanyUser> }>(),
);

export const updateUserInformationSuccess = createAction(
  "[CompanyUser] Update User Information Success",
  props<{ user: CompanyUser }>(),
);

export const updateUserInformationFailure = createAction(
  "[CompanyUser] Update User Information Failure",
  props<{ error: string }>(),
);
