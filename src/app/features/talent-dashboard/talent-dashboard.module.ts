import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { TalentDashboardRoutingModule } from "./talent-dashboard-routing.module";
import { TalentDashboardComponent } from "./talent-dashboard.component";
import { TalentDetailsComponent } from "./components/talent-details/talent-details.component";
import { TalentProfileComponent } from "./components/talent-profile/talent-profile.component";
import { SharedModule } from "../../shared/shared.module";
import { MatTabsModule } from "@angular/material/tabs";
import { FormsModule } from "@angular/forms";
import { DashboardTalentComponent } from "./components/dashboard-talent/dashboard-talent.component";
import { TalentEducationComponent } from "./components/talent-education/talent-education.component";

@NgModule({
  declarations: [
    TalentDashboardComponent,
    TalentDetailsComponent,
    TalentProfileComponent,
    DashboardTalentComponent,
    TalentEducationComponent,
  ],
  imports: [
    CommonModule,
    TalentDashboardRoutingModule,
    SharedModule,
    MatTabsModule,
    FormsModule,
  ],
})
export class TalentDashboardModule {}
