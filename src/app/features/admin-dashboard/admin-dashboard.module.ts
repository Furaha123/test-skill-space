import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { AdminDashboardRoutingModule } from "./admin-dashboard-routing.module";
import { AdminDashboardComponent } from "./admin-dashboard.component";
import { SharedModule } from "../../shared/shared.module";
import { CompanyApprovalComponent } from "./pages/company-approval/company-approval.component";
import { AdminSettingsComponent } from "./pages/admin-settings/admin-settings.component";

@NgModule({
  declarations: [
    AdminDashboardComponent,
    CompanyApprovalComponent,
    AdminSettingsComponent,
  ],
  imports: [CommonModule, AdminDashboardRoutingModule, SharedModule],
})
export class AdminDashboardModule {}
