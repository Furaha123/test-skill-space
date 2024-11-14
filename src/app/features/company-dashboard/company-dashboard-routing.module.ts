import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CompanyDashboardComponent } from "./company-dashboard.component";
import { CompanyProfileComponent } from "./components/company-profile/company-profile.component";
import { DashboardDetailsComponent } from "./components/dashboard-details/dashboard-details.component";

const routes: Routes = [
  {
    path: "",
    component: CompanyDashboardComponent,
    children: [
      {
        path: "dashboard",
        component: DashboardDetailsComponent,
      },
      {
        path: "settings",
        component: CompanyProfileComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfilesRoutingModule {}
