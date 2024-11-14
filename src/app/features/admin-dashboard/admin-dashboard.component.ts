import { Component } from "@angular/core";

@Component({
  selector: "app-admin-dashboard",
  templateUrl: "./admin-dashboard.component.html",
})
export class AdminDashboardComponent {
  adminDashboardSidebarItems = [
    {
      label: "Company Approval",
      icon: "assets/icon/program.svg",
      route: "/admin-dashboard/company-approval", // Route for Company Approval component
    },
  ];
}
