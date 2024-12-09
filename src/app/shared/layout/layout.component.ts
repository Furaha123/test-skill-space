import { Component, Input, OnInit } from "@angular/core";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { filter } from "rxjs/operators";
import { AuthService } from "../../core/services/auth/auth-service.service";
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
    private readonly authService: AuthService,
  ) {}

  ngOnInit() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        // Split the URL into segments
        const urlSegments = this.router.url
          .split("/")
          .filter((segment) => segment);

        // For URLs like /admin-dashboard/company-approval/approve/234
        // We want to select based on 'company-approval'
        // Find index where 'approve' or similar child route starts
        const approveIndex = urlSegments.findIndex(
          (segment) =>
            segment === "approve" || segment === "edit" || segment === "view",
        );

        // If we found a child route, use the segment before it
        // Otherwise, use the last segment
        const targetSegment =
          approveIndex !== -1
            ? urlSegments[approveIndex - 1]
            : urlSegments[urlSegments.length - 1];

        // Find matching route
        this.selectedIndex = this.items.findIndex((item) => {
          const routeSegments = item.route
            .split("/")
            .filter((segment) => segment);
          return routeSegments.includes(targetSegment);
        });

        // Handle settings route
        if (this.selectedIndex === -1 && this.router.url.includes("settings")) {
          this.selectSettings();
        }
      });

    // Initial selection
    this.selectItem(this.selectedIndex);
  }

  toggleNav() {
    this.minimized = !this.minimized;
  }

  selectItem(index: number) {
    this.selectedIndex = index;
    this.selectedSetting = false;
    if (index >= 0 && index < this.items.length) {
      this.router.navigate([this.items[index].route]);
    }
  }

  selectSettings() {
    this.selectedSetting = true;
    this.selectedIndex = -1;
    this.router.navigate(["settings"], { relativeTo: this.route });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(["/auth/login"]);
  }
}
