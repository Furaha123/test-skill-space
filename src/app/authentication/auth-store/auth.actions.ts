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

export const tokenCleared = createAction("[Auth] Token Cleared");
