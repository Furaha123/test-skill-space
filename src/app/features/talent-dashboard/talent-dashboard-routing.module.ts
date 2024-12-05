import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { TalentDashboardComponent } from "./talent-dashboard.component";
import { TalentProfileComponent } from "./components/talent-profile/talent-profile.component";
import { DashboardTalentComponent } from "./components/dashboard-talent/dashboard-talent.component";
import { ProgramsComponent } from "./components/programs/programs.component";
import { SingleProgramComponent } from "./components/single-program/single-program.component";
import { ProgramApplicationFormComponent } from "./components/program-application-form/program-application-form.component";
import { TALENT_PATHS } from "./talent.routes";
const routes: Routes = [
  {
    path: "",
    component: TalentDashboardComponent,
    children: [
      { path: TALENT_PATHS.dashboard, component: DashboardTalentComponent },
      { path: TALENT_PATHS.settings, component: TalentProfileComponent },
      { path: TALENT_PATHS.programs, component: ProgramsComponent },
      {
        path: TALENT_PATHS.single_program,
        component: SingleProgramComponent,
      },
      {
        path: TALENT_PATHS.apply,
        component: ProgramApplicationFormComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TalentDashboardRoutingModule {}
