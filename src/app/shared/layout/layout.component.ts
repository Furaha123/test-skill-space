import { Component, Input } from "@angular/core";
const sidebarItems = [
  {
    label: "Dashboard",
    icon: "assets/icon/dashboard.svg",
    route: "/dashboard",
  },
  { label: "Programs", icon: "assets/icon/program.svg", route: "/programs" },
  {
    label: "Applications",
    icon: "assets/icon/application.svg",
    route: "/applications",
  },
  {
    label: "Assessments",
    icon: "assets/icon/assessment.svg",
    route: "/assessments",
  },
  { label: "Messages", icon: "assets/icon/message.svg", route: "/messages" },
];

@Component({
  selector: "app-layout",
  templateUrl: "./layout.component.html",
  styleUrl: "./layout.component.scss",
})
export class LayoutComponent {
  @Input() items: Array<{ label: string; icon: string; route: string }> =
    sidebarItems;
  minimized = false;
  selectedIndex = 0;
  selectedSetting = false;

  constructor() {}

  toggleNav() {
    this.minimized = !this.minimized;
  }

  selectItem(index: number) {
    this.selectedIndex = index;
    this.selectedSetting = false; // Deselect settings when selecting other items
    // You can add your navigation logic here (e.g., using Angular Router)
    // this.router.navigate([this.items[index].route]);
  }

  selectSettings() {
    this.selectedSetting = true;
    this.selectedIndex = -1; // Deselect other items when selecting settings
    // Add logic to navigate to the settings route or any other behavior needed
  }
}
