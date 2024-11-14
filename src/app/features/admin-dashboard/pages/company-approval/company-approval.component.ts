import { Component } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-company-approval",
  templateUrl: "./company-approval.component.html",
})
export class CompanyApprovalComponent {
  constructor(private readonly router: Router) {}
  routeTo(id: string) {
    this.router.navigate([
      "admin-dashboard",
      "company-approval",
      "approve",
      id,
    ]);
  }
}
