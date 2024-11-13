import { Component } from "@angular/core";

@Component({
  selector: "app-admin-dashboard",
  templateUrl: "./admin-dashboard.component.html",
  styleUrl: "./admin-dashboard.component.scss",
})
export class AdminDashboardComponent {
  adminDashboardSidebarItems = [
    {
      label: "Dashboard",
      icon: "assets/icon/dashboard.svg",
      route: "/admin-dashboard", // Root route for admin dashboard
    },
    {
      label: "Company Approval",
      icon: "assets/icon/program.svg",
      route: "/admin-dashboard/company-approval", // Route for Company Approval component
    },
  ];
}
