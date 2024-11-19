import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AdminDashboardRoutingModule } from "./admin-dashboard-routing.module";
import { AdminDashboardComponent } from "./admin-dashboard.component";
import { SharedModule } from "../../shared/shared.module";
import { CompanyApprovalComponent } from "./pages/company-approval/company-approval.component";
import { AdminSettingsComponent } from "./pages/admin-settings/admin-settings.component";
import { ApproveComponent } from "./pages/approve/approve.component";
import { StoreModule } from "@ngrx/store";
import { adminReducer } from "./store/admin.reducer";
import { AdminEffects } from "./store/admin.effects";
import { EffectsModule } from "@ngrx/effects";

@NgModule({
  declarations: [
    AdminDashboardComponent,
    CompanyApprovalComponent,
    AdminSettingsComponent,
    ApproveComponent,
  ],
  imports: [
    CommonModule,
    AdminDashboardRoutingModule,
    SharedModule,
    StoreModule.forFeature("admin", adminReducer),
    EffectsModule.forFeature([AdminEffects]),
  ],
})
export class AdminDashboardModule {}
