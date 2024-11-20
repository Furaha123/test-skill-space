import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { AuthenticationRoutingModule } from "./authentication-routing.module";
import { RegisterPageComponent } from "./pages/registration/register-page.component";
import { CompanyRegistrationFormComponent } from "./components/company-registration-form/company-registration-form.component";
import { SharedModule } from "../shared/shared.module";
import { TalentRegistrationFormComponent } from "./components/talent-registration-form/talent-registration-form.component";
import { ReactiveFormsModule } from "@angular/forms";
import { VerificationPageComponent } from "./pages/verification-page/verification-page.component";
import { ForgotPasswordComponent } from "./components/forgot-password/forgot-password.component";
import { CreateNewPasswordComponent } from "./components/create-new-password/create-new-password.component";
import { StoreModule } from "@ngrx/store";
import { userReducer } from "./auth-store/auth.reducers";
import { EffectsModule } from "@ngrx/effects";
import { UserEffects } from "./auth-store/auth.effects";

@NgModule({
  declarations: [
    RegisterPageComponent,
    CompanyRegistrationFormComponent,
    TalentRegistrationFormComponent,
    VerificationPageComponent,
    ForgotPasswordComponent,
    CreateNewPasswordComponent,
  ],

  imports: [
    CommonModule,
    AuthenticationRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    StoreModule.forFeature("user", userReducer),
    EffectsModule.forFeature([UserEffects]),
  ],
})
export class AuthenticationModule {}
