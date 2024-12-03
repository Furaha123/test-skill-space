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
      mergeMap(({ page, size }) =>
        this.adminService.getInitialCompanies(page, size).pipe(
          map((response) =>
            AdminActions.loadCompaniesSuccess({
              companies: response.data,
              currentPage: response.currentPage,
              totalPages: response.totalPages,
              totalItems: response.totalItems,
              pageSize: response.pageSize,
              hasNext: response.hasNext,
              hasPrevious: response.hasPrevious,
            }),
          ),
          catchError((error) =>
            of(AdminActions.loadCompaniesFailure({ error: error.message })),
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
