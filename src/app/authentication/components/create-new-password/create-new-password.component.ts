import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { Observable, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { AppState } from "../../../shared/models/app.state.interface";
import * as AuthActions from "../../auth-store/auth.actions";
import * as AuthSelectors from "../../auth-store/auth.selectors";

@Component({
  selector: "app-create-new-password",
  templateUrl: "./create-new-password.component.html",
  styleUrls: ["./create-new-password.component.scss"],
})
export class CreateNewPasswordComponent implements OnInit, OnDestroy {
  passwordForm: FormGroup;
  showPasswordWarning = false;
  showPasswordError = false;
  showSuccessMessage = false;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  private destroy$ = new Subject<void>();
  private email = "";

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private store: Store<AppState>,
  ) {
    this.passwordForm = this.fb.group(
      {
        newPassword: [
          "",
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            ),
          ],
        ],
        confirmPassword: ["", [Validators.required]],
      },
      { validators: this.passwordMatchValidator },
    );

    this.loading$ = this.store.select(AuthSelectors.selectIsLoading);
    this.error$ = this.store.select(AuthSelectors.selectError);
  }

  ngOnInit() {
    this.store
      .select(AuthSelectors.selectIsPasswordReset)
      .pipe(takeUntil(this.destroy$))
      .subscribe((isReset) => {
        if (isReset) {
          this.redirectToLogin();
        }
      });

    this.email = sessionStorage.getItem("resetPasswordEmail") || "";
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get("newPassword")?.value === g.get("confirmPassword")?.value
      ? null
      : { mismatch: true };
  }

  isNewPasswordInvalid(): boolean {
    const control = this.passwordForm.get("newPassword");
    return Boolean(control?.invalid && control?.touched);
  }

  isConfirmPasswordInvalid(): boolean {
    const control = this.passwordForm.get("confirmPassword");
    return Boolean(
      control?.touched && (control?.invalid || this.isPasswordMismatch()),
    );
  }

  isPasswordMismatch(): boolean {
    return Boolean(this.passwordForm.hasError("mismatch"));
  }

  isSubmitDisabled(): boolean {
    return this.passwordForm.invalid || Boolean(this.loading$);
  }

  validatePassword() {
    const newPassword = this.passwordForm.get("newPassword")?.value || "";
    const confirmPassword =
      this.passwordForm.get("confirmPassword")?.value || "";
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    this.showPasswordWarning = !passwordRegex.test(newPassword);
    this.showPasswordError = this.passwordForm.hasError("mismatch");
    this.showSuccessMessage =
      !this.showPasswordWarning &&
      !this.showPasswordError &&
      newPassword === confirmPassword &&
      newPassword.length > 0;
  }

  onSubmit() {
    if (this.passwordForm.valid && !this.showPasswordWarning) {
      const { newPassword, confirmPassword } = this.passwordForm.value;

      if (newPassword !== confirmPassword) {
        this.showPasswordError = true;
        return;
      }

      this.store.dispatch(
        AuthActions.resetPassword({
          email: this.email,
          newPassword,
          confirmPassword,
        }),
      );
    } else {
      if (this.showPasswordWarning) {
        this.passwordForm.get("newPassword")?.setErrors({ pattern: true });
      }
      this.passwordForm.markAllAsTouched();
    }
  }

  redirectToLogin() {
    this.router.navigate(["/auth/login"]);
  }
}
