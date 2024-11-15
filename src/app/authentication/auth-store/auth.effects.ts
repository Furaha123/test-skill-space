import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { ToastrService } from "ngx-toastr";
import { catchError, map, mergeMap, of, tap } from "rxjs";
import * as UserActions from "./auth.actions";
import { AuthService } from "../../core/services/auth/auth-service.service";
import { Router } from "@angular/router";

import * as AuthActions from "./auth.actions";


@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private toastr: ToastrService,
    private readonly router: Router,
  ) {}
  



  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      mergeMap((action) =>
        this.authService.login(action.email, action.password).pipe(
          map((response) =>
            AuthActions.loginSuccess({
              token: response.token,
              role: response.role,
            }),
          ),
          catchError(() =>
            of(AuthActions.loginFailure({ error: "Invalid credentials" })),
          ), // Removed unused `_`
        ),
      ),
    ),
  );

  showSuccessToast$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(UserActions.registerUserSuccess),
        tap(() => {
          this.toastr.success("Registration successful!", "Success");
          this.router.navigateByUrl("/auth/au-ver");
        }),
      ),
    { dispatch: false },
  );
  registerUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.registerUser),
      mergeMap(({ user }) =>
        this.authService.talentRegister(user).pipe(
          map(() => UserActions.registerUserSuccess()),
          catchError((error) =>
            of(UserActions.registerUserFailure({ error: error.error.message })),
          ),
        ),
      ),
    ),
  );

  showErrorToast$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(UserActions.registerUserFailure),
        tap(({ error }) => {
          this.toastr.error(error || "Registration failed!", "Error");
        }),
      ),
    { dispatch: false },
  );
}
