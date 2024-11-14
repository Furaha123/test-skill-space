import { Component } from "@angular/core";

import { CompanyUser } from "../../models/company-user";

@Component({
  selector: "app-company-profile",
  templateUrl: "./company-profile.component.html",
  styleUrls: ["./company-profile.component.scss"],
})
export class CompanyProfileComponent {
  selectedTabIndex = 0;

  companyUser!: CompanyUser;

  onTabChange(index: number): void {
    this.selectedTabIndex = index;
  }
}
