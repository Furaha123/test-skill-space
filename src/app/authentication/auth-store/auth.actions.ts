import { createAction, props } from "@ngrx/store";
import { Talent } from "../../shared/models/talent.interface";

export const registerUser = createAction(
  "[User] Register User",
  props<{ user: Talent }>(),
);

export const registerUserSuccess = createAction("[User] Register User Success");

export const registerUserFailure = createAction(
  "[User] Register User Failure",
  props<{ error: string }>(),
);
