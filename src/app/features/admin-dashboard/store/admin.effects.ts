import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { map, mergeMap, catchError } from "rxjs/operators";
import { AdminService } from "../services/admin.service";
import { AdminActions } from "./admin.actions";

@Injectable()
export class AdminEffects {
  loadCompanies$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminActions.loadCompanies),
      mergeMap(() =>
        this.adminService.getCompanies().pipe(
          map((companies) => AdminActions.loadCompaniesSuccess({ companies })),
          catchError((error) =>
            of(AdminActions.loadCompaniesFailure({ error: error.message })),
          ),
        ),
      ),
    ),
  );

  approveCompany$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminActions.approveCompany),
      mergeMap(({ companyId }) =>
        this.adminService.approveCompany(companyId).pipe(
          map((company) => AdminActions.approveCompanySuccess({ company })),
          catchError((error) =>
            of(AdminActions.approveCompanyFailure({ error: error.message })),
          ),
        ),
      ),
    ),
  );

  rejectCompany$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminActions.rejectCompany),
      mergeMap(({ companyId }) =>
        this.adminService.rejectCompany(companyId).pipe(
          map((company) => AdminActions.rejectCompanySuccess({ company })),
          catchError((error) =>
            of(AdminActions.rejectCompanyFailure({ error: error.message })),
          ),
        ),
      ),
    ),
  );

  constructor(
    private readonly actions$: Actions,
    private readonly adminService: AdminService,
  ) {}
}
