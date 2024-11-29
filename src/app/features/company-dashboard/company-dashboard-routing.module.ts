import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CompanyDashboardComponent } from "./company-dashboard.component";
import { CompanyProfileComponent } from "./components/company-profile/company-profile.component";
import { DashboardDetailsComponent } from "./components/dashboard-details/dashboard-details.component";
import { CompanyJobPostingComponent } from "./components/company-job-posting/company-job-posting.component";

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
      { path: "job-posting", component: CompanyJobPostingComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfilesRoutingModule {}
