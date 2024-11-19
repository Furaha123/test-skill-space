import { Component } from "@angular/core";

@Component({
  selector: "app-company-dashboard",
  templateUrl: "./company-dashboard.component.html",
})
export class CompanyDashboardComponent {
  sidebarItems = [
    {
      label: "Dashboard",
      icon: "assets/icon/dashboard.svg",
      route: "company/dashboard",
    },
    {
      label: "Programs",
      icon: "assets/icon/program.svg",
      route: "/company/program",
    },
    {
      label: "Applications",
      icon: "assets/icon/application.svg",
      route: "/company/applications",
    },
    {
      label: "Assessments",
      icon: "assets/icon/assessment.svg",
      route: "/company/assessments",
    },
    {
      label: "Messages",
      icon: "assets/icon/message.svg",
      route: "/company/messages",
    },
  ];
}
