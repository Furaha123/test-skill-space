import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { CompanyProfileService } from "../services/company-profile.service";
import { catchError, map, mergeMap, tap } from "rxjs/operators";
import { of } from "rxjs";
import { CompanyUser } from "../models/company-user";
import {
  getUserInformation,
  getUserInformationFailure,
  getUserInformationSuccess,
  updateUserInformation,
  updateUserInformationFailure,
  updateUserInformationSuccess,
} from "./company-profile-actions";

@Injectable()
export class CompanyUserEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly companyProfileService: CompanyProfileService,
  ) {}

  loadUserInformation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getUserInformation),
      mergeMap(() =>
        this.companyProfileService.getCompanyUserInfo().pipe(
          map((user: CompanyUser) => getUserInformationSuccess({ user })),
          tap((action) => {
            localStorage.setItem("companyUser", JSON.stringify(action.user));
          }),
          catchError((error) => of(getUserInformationFailure({ error }))),
        ),
      ),
    ),
  );

  updateUserInformation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateUserInformation),
      mergeMap((action) =>
        this.companyProfileService
          .updateCompanyUserInfo(action.updatedData)
          .pipe(
            map((response) => updateUserInformationSuccess({ user: response })),
            catchError((error) =>
              of(updateUserInformationFailure({ error: error.message })),
            ),
          ),
      ),
    ),
  );
}
