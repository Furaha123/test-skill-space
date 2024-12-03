import { Component, OnInit } from "@angular/core";
import { AppState } from "../../shared/models/app.state.interface";
import { Store } from "@ngrx/store";
import { AdminActions } from "./store/admin.actions";

@Component({
  selector: "app-admin-dashboard",
  templateUrl: "./admin-dashboard.component.html",
})
export class AdminDashboardComponent implements OnInit {
  adminDashboardSidebarItems = [
    {
      label: "Company Approval",
      icon: "assets/icon/program.svg",
      route: "/admin-dashboard/company-approval",
    },
  ];

  constructor(private readonly store: Store<AppState>) {}

  ngOnInit(): void {
    this.store.dispatch(AdminActions.loadCompanies({ page: 0, size: 5 }));
  }
}
