import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { ToastrService } from "ngx-toastr";
import { catchError, map, mergeMap, of, tap } from "rxjs";
import * as UserActions from "./auth.actions";
import { AuthService } from "../../core/services/auth/auth-service.service";
import { Router } from "@angular/router";

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private toastr: ToastrService,
    private readonly router: Router,
  ) {}
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
