import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { AuthService } from "../../core/services/auth/auth-service.service";
import * as AuthActions from "./auth.actions";
import { catchError, map, mergeMap, tap, of } from "rxjs";
import { Router } from "@angular/router";
import { LoginResponse, LoginError } from "../auth-store/auth.interface";
import { ToastrService } from "ngx-toastr";

@Injectable()
export class AuthEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly toastr: ToastrService,
  ) {}

  // Custom error handling
  private handleAPIError(): never {
    const errorMessage = "An unexpected error occurred. Please try again.";
    throw new Error(errorMessage);
  }

  private createLoginError(error: LoginError): string {
    return error?.message || "An unexpected error occurred. Please try again.";
  }

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      mergeMap((action) =>
        this.authService.login(action.email, action.password).pipe(
          tap((response: LoginResponse) => {
            if (
              response.status === "Success" &&
              response.data?.token &&
              response.data?.roles
            ) {
              const { token, roles } = response.data;
              sessionStorage.setItem("authToken", token);
              sessionStorage.setItem("authRoles", JSON.stringify(roles));
            } else {
              this.handleAPIError();
            }
          }),
          map((response: LoginResponse) => {
            const { token, roles } = response.data!;
            return AuthActions.loginSuccess({ token, roles });
          }),
          catchError((error: LoginError) =>
            of(
              AuthActions.loginFailure({
                error: this.createLoginError(error),
              }),
            ),
          ),
        ),
      ),
    ),
  );

  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(({ roles }) => {
          if (roles && roles.length > 0) {
            this.handleRoleNavigation(roles);
          } else {
            this.router.navigate(["/login"]);
            throw new Error("Missing or invalid roles in login response");
          }
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
              "An unexpected error occured, please try again?",
              "Error",
            );

            return of(
              AuthActions.registerUserFailure({
                error: "An unexpected error occured, please try again?",
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
          map(() => AuthActions.registerCompanySuccess()),
          catchError(() => {
            this.toastr.error(
              "An unexpected error occured, please try again?",
              "Error",
            );

            return of(
              AuthActions.registerCompanyFailure({
                error: "An unexpected error occured, please try again?",
              }),
            );
          }),
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
  showCompanyRegistrationSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.registerCompanySuccess),
        tap(() => {
          this.toastr.success("Registration successful!", "Success");
          this.router.navigateByUrl("/auth/company-verification");
        }),
      ),
    { dispatch: false },
  );
}
