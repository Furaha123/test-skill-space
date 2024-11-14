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
import { ReactiveFormsModule } from "@angular/forms";
import { CompanyDashboardComponent } from "./company-dashboard.component";
import { DashboardDetailsComponent } from "./components/dashboard-details/dashboard-details.component";

@NgModule({
  declarations: [
    CompanyProfileComponent,
    CompanyDetailsComponent,
    CompanySecurityComponent,
    CompanyDashboardComponent,
    DashboardDetailsComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    ProfilesRoutingModule,
    SharedModule,
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
  ],
})
export class CompanyDashboardModule {}
