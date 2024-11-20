import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AUTH_PATHS } from "./auth.routes";
import { RegisterPageComponent } from "./pages/registration/register-page.component";
import { VerificationPageComponent } from "./pages/verification-page/verification-page.component";
import { ForgotPasswordComponent } from "./components/forgot-password/forgot-password.component";
import { CreateNewPasswordComponent } from "./components/create-new-password/create-new-password.component";

const routes: Routes = [
  {
    path: AUTH_PATHS.register,
    component: RegisterPageComponent,
  },
  {
    path: AUTH_PATHS.verify,
    component: VerificationPageComponent,
  },
  { path: AUTH_PATHS.forgotPassword, component: ForgotPasswordComponent },
  { path: "reset-password", component: CreateNewPasswordComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthenticationRoutingModule {}
