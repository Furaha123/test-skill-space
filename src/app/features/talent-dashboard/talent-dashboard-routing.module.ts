import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { TalentDashboardComponent } from "./talent-dashboard.component";
import { TalentProfileComponent } from "./components/talent-profile/talent-profile.component";
import { DashboardTalentComponent } from "./components/dashboard-talent/dashboard-talent.component";

const routes: Routes = [
  {
    path: "",
    component: TalentDashboardComponent,
    children: [
      { path: "dashboard", component: DashboardTalentComponent },
      { path: "settings", component: TalentProfileComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TalentDashboardRoutingModule {}
