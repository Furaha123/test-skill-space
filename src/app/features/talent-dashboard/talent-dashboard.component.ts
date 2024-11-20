import { Component } from "@angular/core";

@Component({
  selector: "app-talent-dashboard",
  templateUrl: "./talent-dashboard.component.html",
})
export class TalentDashboardComponent {
  sidebarItems = [
    {
      label: "Dashboard",
      icon: "assets/icon/dashboard.svg",
      route: "talent/dashboard",
    },
    {
      label: "Programs",
      icon: "assets/icon/program.svg",
      route: "/talent/program",
    },
    {
      label: "Applications",
      icon: "assets/icon/application.svg",
      route: "/talent/applications",
    },
    {
      label: "Assessments",
      icon: "assets/icon/assessment.svg",
      route: "/talent/assessments",
    },
    {
      label: "Messages",
      icon: "assets/icon/message.svg",
      route: "/talent/messages",
    },
  ];
}
