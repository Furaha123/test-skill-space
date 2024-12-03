import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { map, mergeMap, catchError, switchMap } from "rxjs/operators";
import { AdminService } from "../services/admin.service";
import { AdminActions } from "./admin.actions";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { Store } from "@ngrx/store";

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

  searchCompanies$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminActions.searchCompanies),
      switchMap(({ searchTerm, page, size }) =>
        this.adminService.searchCompanies(searchTerm, page, size).pipe(
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

  approveCompany$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminActions.approveCompany),
      switchMap(({ companyId }) =>
        this.adminService.approveCompany(companyId).pipe(
          map((company) => {
            this.toastr.success("Company approved successfully");
            this.router.navigate(["admin-dashboard", "company-approval"]);
            this.store.dispatch(
              AdminActions.loadCompanies({ page: 0, size: 5 }),
            );
            return AdminActions.approveCompanySuccess({ company });
          }),
          catchError((error) => {
            this.toastr.error(error.message || "Failed to approve company");
            return of(AdminActions.approveCompanyFailure());
          }),
        ),
      ),
    ),
  );

  rejectCompany$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminActions.rejectCompany),
      switchMap(({ companyId }) =>
        this.adminService.rejectCompany(companyId).pipe(
          map((company) => {
            this.toastr.success("Company rejected successfully");
            this.router.navigate(["admin-dashboard", "company-approval"]);
            this.store.dispatch(
              AdminActions.loadCompanies({ page: 0, size: 5 }),
            );
            return AdminActions.rejectCompanySuccess({ company });
          }),
          catchError((error) => {
            this.toastr.error(error.message || "Failed to reject company");
            return of(AdminActions.rejectCompanyFailure());
          }),
        ),
      ),
    ),
  );

  constructor(
    private readonly actions$: Actions,
    private readonly adminService: AdminService,
    private readonly router: Router,
    private readonly toastr: ToastrService,
    private readonly store: Store,
  ) {}
}
