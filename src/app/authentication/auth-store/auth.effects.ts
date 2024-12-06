import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { AuthService } from "../../core/services/auth/auth-service.service";
import * as AuthActions from "./auth.actions";
import { catchError, map, mergeMap, tap, of } from "rxjs";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";

@Injectable()
export class AuthEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly toastr: ToastrService,
  ) {}

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      mergeMap((action) =>
        this.authService.login(action.email, action.password).pipe(
          map((response) => {
            if (response.status === "Success" && response.data?.token) {
              // Store token
              sessionStorage.setItem("authToken", response.data.token);
              if (response.data.roles) {
                sessionStorage.setItem(
                  "authRoles",
                  JSON.stringify(response.data.roles),
                );
              }
              return AuthActions.loginSuccess(response.data);
            }
            return AuthActions.loginFailure({
              error: response.message || "Login failed",
            });
          }),
          catchError((error) => {
            let errorMessage = "Login failed";
            if (error.status === 401) {
              errorMessage = "Invalid email or password";
            } else if (error.error?.message) {
              errorMessage = error.error.message;
            }
            this.toastr.error(errorMessage);
            return of(AuthActions.loginFailure({ error: errorMessage }));
          }),
        ),
      ),
    ),
  );

  // Rest of the code remains the same...
  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(({ roles }) => {
          if (roles && roles.length > 0) {
            this.handleRoleNavigation(roles);
          }
        }),
      ),
    { dispatch: false },
  );

  forgotPassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.forgotPassword),
      mergeMap(({ email }) =>
        this.authService.forgotPassword(email).pipe(
          map((response) =>
            AuthActions.forgotPasswordSuccess({ message: response.message }),
          ),
          catchError((error) =>
            of(
              AuthActions.forgotPasswordFailure({
                error:
                  error.error?.message ||
                  "Something went wrong, please try again",
              }),
            ),
          ),
        ),
      ),
    ),
  );

  verifyResetOtp$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.verifyResetOtp),
      mergeMap(({ email, otp }) =>
        this.authService.verifyOTP({ email, otp }).pipe(
          map((response) =>
            AuthActions.verifyResetOtpSuccess({ message: response.message }),
          ),
          catchError((error) =>
            of(
              AuthActions.verifyResetOtpFailure({
                error: error.error?.message || "OTP verification failed",
              }),
            ),
          ),
        ),
      ),
    ),
  );

  verifyPasswordResetOtp$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.verifyPasswordResetOtp),
      mergeMap(({ otp }) =>
        this.authService.verifyPasswordResetOtp(otp).pipe(
          map((response) => {
            this.router.navigate(["/auth/reset-password"]);
            return AuthActions.verifyPasswordResetOtpSuccess({
              message: response.message,
              token: response.data.token,
            });
          }),
          catchError((error) =>
            of(
              AuthActions.verifyPasswordResetOtpFailure({
                error: error.error?.message || "OTP verification failed",
              }),
            ),
          ),
        ),
      ),
    ),
  );

  resetPassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.resetPassword),
      mergeMap(({ newPassword }) =>
        this.authService.resetPassword(newPassword).pipe(
          map((response) => {
            this.toastr.success("Password reset successfully");
            this.router.navigate(["/auth/login"]);
            return AuthActions.resetPasswordSuccess({
              message: response.message,
            });
          }),
          catchError((error) => {
            this.toastr.error(error.error?.message || "Password reset failed");
            return of(
              AuthActions.resetPasswordFailure({ error: error.error?.message }),
            );
          }),
        ),
      ),
    ),
  );

  requestNewOtp$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.requestNewOtp),
      mergeMap(({ email }) =>
        this.authService.requestNewOTP(email).pipe(
          map((response) =>
            AuthActions.requestNewOtpSuccess({ message: response.message }),
          ),
          catchError((error) =>
            of(
              AuthActions.requestNewOtpFailure({
                error: error.error?.message || "Failed to request new OTP",
              }),
            ),
          ),
        ),
      ),
    ),
  );

  showRegistrationSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.registerUserSuccess),
        tap(() => {
          this.toastr.success("Registration successful!", "Success");
          this.router.navigateByUrl("/auth/talent-verification");
        }),
      ),
    { dispatch: false },
  );

  showSuccessToast$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          AuthActions.forgotPasswordSuccess,
          AuthActions.verifyResetOtpSuccess,
          AuthActions.verifyPasswordResetOtpSuccess,
          AuthActions.resetPasswordSuccess,
          AuthActions.requestNewOtpSuccess,
        ),
        tap(({ message }) => {
          this.toastr.success(message, "Success");
        }),
      ),
    { dispatch: false },
  );

  showCompanyRegistrationSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          AuthActions.forgotPasswordFailure,
          AuthActions.verifyResetOtpFailure,
          AuthActions.verifyPasswordResetOtpFailure,
          AuthActions.resetPasswordFailure,
          AuthActions.requestNewOtpFailure,
        ),
        tap(({ error }) => {
          this.toastr.error(error, "Error");
        }),
      ),
    { dispatch: false },
  );

  private handleRoleNavigation(roles: string[]) {
    const roleRouteMap: Record<string, string> = {
      SYSTEM_ADMIN: "/admin-dashboard",
      TALENT: "/talent/dashboard",
      COMPANY_ADMIN: "/company/dashboard",
      MENTOR: "/mentor/dashboard",
    };

    const matchingRole = roles.find((role) => roleRouteMap[role]);
    const route = matchingRole ? roleRouteMap[matchingRole] : "/login";

    if (!matchingRole) {
      throw new Error(`Unexpected roles: ${roles.join(", ")}`);
    }

    this.router.navigate([route]);
  }

  registerUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.registerUser),
      mergeMap(({ user }) =>
        this.authService.talentRegister(user).pipe(
          map(() => AuthActions.registerUserSuccess()),
          catchError(() => {
            this.toastr.error(
              "An unexpected error occurred. Please try again.",
              "Error",
            );

            return of(
              AuthActions.registerUserFailure({
                error: "Failed to register your account. Please try again",
              }),
            );
          }),
        ),
      ),
    ),
  );

  registerCompany$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.registerCompany),
      mergeMap(({ company }) =>
        this.authService.companyRegister(company).pipe(
          map(() => {
            this.toastr.success(
              "Registration successful. Please check your mail for further instructions",
            );

            this.router.navigateByUrl("/auth/company-verification");
            return AuthActions.registerCompanySuccess();
          }),
          catchError(() => {
            this.toastr.error(
              "An unexpected error occured. Please try again",
              "Error",
            );

            return of(
              AuthActions.registerCompanyFailure({
                error: "Failed to register your account. Please try again",
              }),
            );
          }),
        ),
      ),
    ),
  );
}
