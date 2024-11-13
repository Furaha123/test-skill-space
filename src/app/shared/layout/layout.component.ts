import { Component, Input } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
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

  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  toggleNav() {
    this.minimized = !this.minimized;
  }

  selectItem(index: number) {
    this.selectedIndex = index;
    this.selectedSetting = false;
    this.router.navigate([this.items[index].route]);
  }

  selectSettings() {
    this.selectedSetting = true;
    this.selectedIndex = -1;
    this.router.navigate(["settings"], { relativeTo: this.route });
  }
}
