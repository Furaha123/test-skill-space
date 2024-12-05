import {
  selectCompanies,
  selectCurrentPage,
  selectError,
  selectIsSearching,
  selectPageSize,
  selectPagination,
  selectTotalItems,
} from "./../../store/admin.selectors";
import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { selectIsLoading } from "../../store/admin.selectors";
import { combineLatest, take } from "rxjs";
import { AppState } from "../../../../shared/models/app.state.interface";
import { selectSearchTerm } from "../../../../shared/store/app.selectors";
import { AdminActions, AppActions } from "../../store/admin.actions";

@Component({
  selector: "app-company-approval",
  templateUrl: "./company-approval.component.html",
})
export class CompanyApprovalComponent {
  isLoading$ = this.store.select(selectIsLoading);
  paginatedCompanies$ = this.store.select(selectCompanies);
  pageSize$ = this.store.select(selectPageSize);
  totalItems$ = this.store.select(selectTotalItems);
  searchTerm$ = this.store.select(selectSearchTerm);
  error$ = this.store.select(selectError);
  currentPage$ = this.store.select(selectCurrentPage);
  isSearching$ = this.store.select(selectIsSearching);

  constructor(
    private readonly router: Router,
    private readonly store: Store<AppState>,
  ) {}
  routeTo(id: string) {
    this.selectCompany(id);
    this.router.navigate([
      "admin-dashboard",
      "company-approval",
      "approve",
      id,
    ]);
  }

  selectCompany(id: string): void {
    this.store.dispatch(AdminActions.selectCompany({ companyId: id }));
  }

  onSearchChange(searchTerm: string, page = 0): void {
    this.store.dispatch(AppActions.setSearchTerm({ searchTerm }));
    combineLatest([
      this.store.select(selectIsSearching),
      this.store.select(selectPagination),
      this.store.select(selectSearchTerm),
    ])
      .pipe(take(1))
      .subscribe(([isSearching, pagination, searchTerm]) => {
        if (isSearching && searchTerm) {
          // If we're searching, dispatch search action with the new page
          this.store.dispatch(
            AdminActions.searchCompanies({
              searchTerm,
              page,
              size: pagination.pageSize,
            }),
          );
        } else {
          // If we're not searching, load regular companies
          this.store.dispatch(AdminActions.clearSearch());
          this.store.dispatch(
            AdminActions.loadCompanies({
              page: 0,
              size: 5,
            }),
          );
        }
      });
  }

  onPageChange(page: number): void {
    combineLatest([
      this.store.select(selectIsSearching),
      this.store.select(selectPagination),
      this.store.select(selectSearchTerm),
    ])
      .pipe(take(1))
      .subscribe(([isSearching, pagination, searchTerm]) => {
        if (isSearching && searchTerm) {
          // If we're searching, dispatch search action with the new page
          this.store.dispatch(
            AdminActions.searchCompanies({
              searchTerm,
              page,
              size: pagination.pageSize,
            }),
          );
        } else {
          // If we're not searching, load regular companies
          this.store.dispatch(
            AdminActions.loadCompanies({
              page,
              size: pagination.pageSize,
            }),
          );
        }
      });
  }
}
