import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { SharedModule } from "../../shared/shared.module";
import { MatTabsModule } from "@angular/material/tabs";
import { StoreModule } from "@ngrx/store";
import { StoreDevtoolsModule } from "@ngrx/store-devtools";
import { EffectsModule } from "@ngrx/effects";

import { CompanyProfileComponent } from "./components/company-profile/company-profile.component";
import { CompanyDetailsComponent } from "./components/company-details/company-details.component";
import { CompanySecurityComponent } from "./components/company-security/company-security.component";
import { CompanyDashboardComponent } from "./company-dashboard.component";
import { DashboardDetailsComponent } from "./components/dashboard-details/dashboard-details.component";
import { CompanyJobPostingComponent } from "./components/company-job-posting/company-job-posting.component";

import { MaterialModule } from "../../shared/material.module";
import { CreateProgramComponent } from "../company-dash-board/components/create-program/create-program.component";
import { CareerProgramsComponent } from "../company-dash-board/components/career-programs/career-programs.component";
import { AddJobFormComponent } from "./components/company-job-posting/add-job-form/add-job-form.component";

import { ProfilesRoutingModule } from "./company-dashboard-routing.module";
import { companyUserReducer } from "./store/company-profile.reducer";
import { CompanyUserEffects } from "./store/company-profile.effects";

// Material imports
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatOptionModule, MatNativeDateModule } from "@angular/material/core";
import { MatSelectModule } from "@angular/material/select";
import { MatDividerModule } from "@angular/material/divider";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatChipsModule } from "@angular/material/chips";

const materialModules = [
  MatIconModule,
  MatButtonModule,
  MatOptionModule,
  MatSelectModule,
  MatDividerModule,
  MatCardModule,
  MatFormFieldModule,
  MatInputModule,
  MatToolbarModule,
  MatTooltipModule,
  MatDialogModule,
  MatButtonToggleModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatChipsModule,
  MatTabsModule,
];
import { CompanyUpdateComponent } from "./components/company-update/company-update.component";

@NgModule({
  declarations: [
    CompanyProfileComponent,
    CompanyDetailsComponent,
    CompanySecurityComponent,
    CompanyDashboardComponent,
    DashboardDetailsComponent,
    CompanyJobPostingComponent,
    AddJobFormComponent,
    CareerProgramsComponent,
    CreateProgramComponent,
    CompanyUpdateComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    ProfilesRoutingModule,
    ...materialModules,
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
