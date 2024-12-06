import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { TalentDashboardRoutingModule } from "./talent-dashboard-routing.module";
import { TalentDashboardComponent } from "./talent-dashboard.component";
import { TalentDetailsComponent } from "./components/talent-details/talent-details.component";
import { TalentProfileComponent } from "./components/talent-profile/talent-profile.component";
import { SharedModule } from "../../shared/shared.module";
import { MatTabsModule } from "@angular/material/tabs";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DashboardTalentComponent } from "./components/dashboard-talent/dashboard-talent.component";
import { TalentEducationComponent } from "./components/talent-education/talent-education.component";
import { TalentEducationUpateComponent } from "./components/talent-education-upate/talent-education-upate.component";
import { TabComponent } from "./components/tab/tab.component";
import { ProgramsComponent } from "./components/programs/programs.component";
import { SingleProgramComponent } from "./components/single-program/single-program.component";
import { MaterialModule } from "../../shared/material.module";
import { ProgramApplicationFormComponent } from "./components/program-application-form/program-application-form.component";
import { PreferencesComponent } from "./components/preferences/preferences.component";

import { StoreModule } from "@ngrx/store";
import { EffectsModule } from "@ngrx/effects";
import { educationReducer } from "./store/talent.reducer";
import { EducationEffects } from "./store/talent.effects";
import { PersonalDetailsUpdateComponent } from "./components/personal-details-update/personal-details-update.component";

@NgModule({
  declarations: [
    TalentDashboardComponent,
    TalentDetailsComponent,
    TalentProfileComponent,
    DashboardTalentComponent,
    TalentEducationComponent,
    TalentEducationUpateComponent,
    TabComponent,
    ProgramsComponent,
    SingleProgramComponent,
    ProgramApplicationFormComponent,
    PreferencesComponent,
    PersonalDetailsUpdateComponent,
  ],
  imports: [
    CommonModule,
    TalentDashboardRoutingModule,
    SharedModule,
    MatTabsModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,

    StoreModule.forFeature("education", educationReducer),
    EffectsModule.forFeature([EducationEffects]),
  ],
})
export class TalentDashboardModule {}
