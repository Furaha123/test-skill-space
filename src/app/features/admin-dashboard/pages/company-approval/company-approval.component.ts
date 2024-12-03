import {
  selectCompanies,
  selectCurrentPage,
  selectError,
  selectPageSize,
  selectPagination,
  selectTotalItems,
} from "./../../store/admin.selectors";
import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { selectIsLoading } from "../../store/admin.selectors";
import { take } from "rxjs";
import { AppState } from "../../../../shared/models/app.state.interface";
import { selectSearchTerm } from "../../../../shared/store/app.selectors";
import { AdminActions } from "../../store/admin.actions";

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

  onPageChange(page: number): void {
    this.store
      .select(selectPagination)
      .pipe(take(1))
      .subscribe((pagination) => {
        // Make API call for both previous and next
        this.store.dispatch(
          AdminActions.loadCompanies({
            page: page,
            size: pagination.pageSize,
          }),
        );
      });
  }
}
