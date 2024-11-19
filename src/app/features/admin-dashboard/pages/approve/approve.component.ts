import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable } from "rxjs";
import { Company } from "../../models/company.model";
import { Store } from "@ngrx/store";
import {
  selectCompanyById,
  selectIsLoading,
} from "../../store/admin.selectors";
import { AdminActions } from "../../store/admin.actions";

@Component({
  selector: "app-approve",
  templateUrl: "./approve.component.html",
})
export class ApproveComponent implements OnInit {
  companyId!: string;
  company$!: Observable<Company | undefined>;
  isLoading$: Observable<boolean>;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly store: Store,
  ) {
    this.isLoading$ = this.store.select(selectIsLoading);
  }

  ngOnInit() {
    this.companyId = this.route.snapshot.paramMap.get("id")!;
    this.company$ = this.store.select(selectCompanyById(this.companyId));
  }

  headBack() {
    this.router.navigate(["admin-dashboard", "company-approval"]);
  }

  approveCompany() {
    this.store.dispatch(
      AdminActions.approveCompany({ companyId: this.companyId }),
    );
  }

  rejectCompany() {
    this.store.dispatch(
      AdminActions.rejectCompany({ companyId: this.companyId }),
    );
  }
}
