import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { selectCompanies, selectIsLoading } from "../../store/admin.selectors";
import { Company } from "../../models/company.model";
import { Observable } from "rxjs";
import { AdminActions } from "../../store/admin.actions";

@Component({
  selector: "app-company-approval",
  templateUrl: "./company-approval.component.html",
})
export class CompanyApprovalComponent implements OnInit {
  companies$: Observable<Company[]> = this.store.select(selectCompanies);
  isLoading$: Observable<boolean> = this.store.select(selectIsLoading);

  constructor(
    private readonly router: Router,
    private readonly store: Store,
  ) {}

  ngOnInit(): void {
    this.store.dispatch(AdminActions.loadCompanies());
  }

  routeTo(id: string) {
    this.selectCompany(id);
    this.router.navigate([
      "admin-dashboard",
      "company-approval",
      "approve",
      id,
    ]);
  }

  selectCompany(id: string) {
    this.store.dispatch(AdminActions.selectCompany({ companyId: id }));
  }
}
