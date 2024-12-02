import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatTabsModule } from "@angular/material/tabs";
import { StoreModule } from "@ngrx/store";
import { StoreDevtoolsModule } from "@ngrx/store-devtools";
import { EffectsModule } from "@ngrx/effects";

import { ProfilesRoutingModule } from "./company-dashboard-routing.module";

import { CompanyProfileComponent } from "./components/company-profile/company-profile.component";
import { SharedModule } from "../../shared/shared.module";
import { CompanyDetailsComponent } from "./components/company-details/company-details.component";
import { CompanySecurityComponent } from "./components/company-security/company-security.component";
import { companyUserReducer } from "./store/company-profile.reducer";
import { HttpClientModule } from "@angular/common/http";
import { CompanyUserEffects } from "./store/company-profile.effects";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CompanyDashboardComponent } from "./company-dashboard.component";
import { DashboardDetailsComponent } from "./components/dashboard-details/dashboard-details.component";
import { CompanyJobPostingComponent } from "./components/company-job-posting/company-job-posting.component";

import { MaterialModule } from "../../shared/material.module";
import { CreateProgramComponent } from "../company-dash-board/components/create-program/create-program.component";
import { CareerProgramsComponent } from "../company-dash-board/components/career-programs/career-programs.component";

import { MaterialModule } from "../../shared/material.module";
import { CreateProgramComponent } from "../company-dash-board/components/create-program/create-program.component";
import { CareerProgramsComponent } from "../company-dash-board/components/career-programs/career-programs.component";

@NgModule({
  declarations: [
    CompanyProfileComponent,
    CompanyDetailsComponent,
    CompanySecurityComponent,
    CompanyDashboardComponent,
    DashboardDetailsComponent,
    CompanyJobPostingComponent,
    CreateProgramComponent,

    CareerProgramsComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    ProfilesRoutingModule,
    SharedModule,
    FormsModule,
    MatTabsModule,
    StoreModule.forFeature("companyUser", companyUserReducer),
    EffectsModule.forFeature([CompanyUserEffects]),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: true,
      autoPause: true,
      trace: false,
      traceLimit: 75,
      connectInZone: true,
    }),
    MaterialModule,
  ],
})
export class CompanyDashboardModule {}
