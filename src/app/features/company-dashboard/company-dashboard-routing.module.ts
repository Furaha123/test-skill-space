import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CompanyDashboardComponent } from "./company-dashboard.component";
import { CompanyProfileComponent } from "./components/company-profile/company-profile.component";
import { DashboardDetailsComponent } from "./components/dashboard-details/dashboard-details.component";
import { CompanyJobPostingComponent } from "./components/company-job-posting/company-job-posting.component";

import { CreateProgramComponent } from "../company-dash-board/components/create-program/create-program.component";
import { CareerProgramsComponent } from "../company-dash-board/components/career-programs/career-programs.component";
import { COMPANY_PATHS } from "./company.routes";
const routes: Routes = [
  {
    path: "",
    component: CompanyDashboardComponent,
    children: [
      {
        path: COMPANY_PATHS.dashboard,
        component: DashboardDetailsComponent,
      },
      {
        path: COMPANY_PATHS.settings,
        component: CompanyProfileComponent,
      },
      { path: "job-posting", component: CompanyJobPostingComponent },
      {
        path: COMPANY_PATHS.programs,
        component: CareerProgramsComponent,
      },
      {
        path: COMPANY_PATHS.edit_program,
        component: CreateProgramComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfilesRoutingModule {}
