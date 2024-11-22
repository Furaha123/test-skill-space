import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AUTH_PATHS } from "./auth.routes";
import { RegisterPageComponent } from "./pages/registration/register-page.component";
import { VerificationPageComponent } from "./pages/verification-page/verification-page.component";
import { ForgotPasswordComponent } from "./components/forgot-password/forgot-password.component";
import { CreateNewPasswordComponent } from "./components/create-new-password/create-new-password.component";
import { CompanyVerificationPageComponent } from "./pages/company-verification-page/company-verification-page.component";

const routes: Routes = [
  {
    path: AUTH_PATHS.register,
    component: RegisterPageComponent,
  },
  {
    path: AUTH_PATHS.verifyTalent,
    component: VerificationPageComponent,
  },
  { path: AUTH_PATHS.forgotPassword, component: ForgotPasswordComponent },
  { path: AUTH_PATHS.reset, component: CreateNewPasswordComponent },
  {
    path: AUTH_PATHS.verifyCompany,
    component: CompanyVerificationPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthenticationRoutingModule {}
