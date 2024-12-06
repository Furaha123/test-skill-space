import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { Store } from "@ngrx/store";
import { Observable } from "rxjs";

import { AppState } from "../../../shared/models/app.state.interface";
import * as AuthActions from "../../auth-store/auth.actions";
import * as AuthSelectors from "../../auth-store/auth.selectors";

@Component({
  selector: "app-create-new-password",
  templateUrl: "./create-new-password.component.html",
  styleUrls: ["./create-new-password.component.scss"],
})
export class CreateNewPasswordComponent {
  passwordForm: FormGroup = this.initializeForm();
  showPasswordWarning = false;
  showPasswordError = false;

  loading$: Observable<boolean> = this.store.select(
    AuthSelectors.selectIsLoading,
  );
  error$: Observable<string | null> = this.store.select(
    AuthSelectors.selectError,
  );
  successMessage$: Observable<string | null> = this.store.select(
    AuthSelectors.selectSuccessMessage,
  );
  isPasswordReset$: Observable<boolean> = this.store.select(
    AuthSelectors.selectIsPasswordReset,
  );

  private readonly passwordPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
  ) {}

  private initializeForm(): FormGroup {
    return this.fb.group(
      {
        newPassword: [
          "",
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(this.passwordPattern),
          ],
        ],
        confirmPassword: ["", [Validators.required]],
      },
      {
        validators: this.passwordMatchValidator,
      },
    );
  }

  private passwordMatchValidator(
    g: FormGroup,
  ): { [key: string]: boolean } | null {
    const newPassword = g.get("newPassword")?.value;
    const confirmPassword = g.get("confirmPassword")?.value;
    return newPassword === confirmPassword ? null : { mismatch: true };
  }

  isNewPasswordInvalid(): boolean {
    const control = this.passwordForm.get("newPassword");
    return Boolean(control?.invalid && (control?.touched || control?.dirty));
  }

  isConfirmPasswordInvalid(): boolean {
    const control = this.passwordForm.get("confirmPassword");
    return (
      Boolean(control?.invalid && (control?.touched || control?.dirty)) ||
      this.isPasswordMismatch()
    );
  }

  isPasswordMismatch(): boolean {
    const confirmTouched = Boolean(
      this.passwordForm.get("confirmPassword")?.touched,
    );
    return Boolean(this.passwordForm.hasError("mismatch") && confirmTouched);
  }

  validatePassword(): void {
    const newPasswordControl = this.passwordForm.get("newPassword");
    const confirmPasswordControl = this.passwordForm.get("confirmPassword");

    const newPassword = newPasswordControl?.value || "";
    const confirmPassword = confirmPasswordControl?.value || "";

    this.showPasswordWarning = Boolean(
      !this.passwordPattern.test(newPassword) && newPasswordControl?.touched,
    );

    // Check password match
    this.showPasswordError = Boolean(
      newPassword !== confirmPassword && confirmPasswordControl?.touched,
    );
  }

  isSubmitDisabled(): boolean {
    return Boolean(
      this.passwordForm.invalid ||
        this.showPasswordWarning ||
        this.showPasswordError,
    );
  }

  onSubmit(): void {
    if (
      this.passwordForm.valid &&
      !this.showPasswordError &&
      !this.showPasswordWarning
    ) {
      // Dispatch reset password action
      const newPassword = this.passwordForm.get("newPassword")?.value;
      this.store.dispatch(AuthActions.resetPassword({ newPassword }));
    } else {
      // Mark all fields as touched to trigger validation display
      Object.keys(this.passwordForm.controls).forEach((key) => {
        const control = this.passwordForm.get(key);
        control?.markAsTouched();
      });
      this.validatePassword();
    }
  }
}
