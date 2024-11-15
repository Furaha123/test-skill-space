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

  constructor(
    private actions$: Actions,
    private adminService: AdminService,
  ) {}
}
