import { Component, Input, OnInit } from "@angular/core";
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
})
export class LayoutComponent implements OnInit {
  @Input() items: Array<{ label: string; icon: string; route: string }> =
    sidebarItems;
  minimized = false;
  selectedIndex = 0;
  selectedSetting = false;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.router.events.subscribe(() => {
      this.selectedIndex = this.items.findIndex(
        (item) => item.route === this.router.url,
      );
    });
    this.selectItem(this.selectedIndex);
  }

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
