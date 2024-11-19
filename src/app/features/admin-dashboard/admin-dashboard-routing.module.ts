import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AdminDashboardComponent } from "./admin-dashboard.component";
import { AdminSettingsComponent } from "./pages/admin-settings/admin-settings.component";
import { CompanyApprovalComponent } from "./pages/company-approval/company-approval.component";
import { ApproveComponent } from "./pages/approve/approve.component";
import { CompanyDetailResolver } from "./resolvers/company-detail.resolver";

const routes: Routes = [
  {
    path: "",
    component: AdminDashboardComponent,
    children: [
      {
        path: "company-approval",
        component: CompanyApprovalComponent,
      },
      {
        path: "company-approval/approve/:id",
        component: ApproveComponent,
        resolve: {
          company: CompanyDetailResolver,
        },
      },
      { path: "settings", component: AdminSettingsComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminDashboardRoutingModule {}
