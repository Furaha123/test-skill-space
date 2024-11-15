import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { AuthenticationRoutingModule } from "./authentication-routing.module";
import { RegisterPageComponent } from "./pages/registration/register-page.component";
import { CompanyRegistrationFormComponent } from "./components/company-registration-form/company-registration-form.component";
import { SharedModule } from "../shared/shared.module";
import { TalentRegistrationFormComponent } from "./components/talent-registration-form/talent-registration-form.component";
import { ReactiveFormsModule } from "@angular/forms";
import { VerificationPageComponent } from "./pages/verification-page/verification-page.component";

@NgModule({
  declarations: [
    RegisterPageComponent,
    CompanyRegistrationFormComponent,
    TalentRegistrationFormComponent,
    VerificationPageComponent,
  ],
  imports: [
    CommonModule,
    AuthenticationRoutingModule,
    SharedModule,
    ReactiveFormsModule,
  ],
})
export class AuthenticationModule {}
