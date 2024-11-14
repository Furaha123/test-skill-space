import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AdminDashboardComponent } from "./admin-dashboard.component";
import { AdminSettingsComponent } from "./pages/admin-settings/admin-settings.component";
import { CompanyApprovalComponent } from "./pages/company-approval/company-approval.component";
import { ApproveComponent } from "./pages/approve/approve.component";

const routes: Routes = [
  {
    path: "",
    component: AdminDashboardComponent, // Wrapper component with <app-layout>
    children: [
      {
        path: "company-approval",
        component: CompanyApprovalComponent,
      },
      { path: "company-approval/approve/:id", component: ApproveComponent },
      { path: "settings", component: AdminSettingsComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminDashboardRoutingModule {}
