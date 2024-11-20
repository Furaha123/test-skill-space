import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";

@Component({
  selector: "app-create-new-password",
  templateUrl: "./create-new-password.component.html",
  styleUrls: ["./create-new-password.component.scss"],
})
export class CreateNewPasswordComponent {
  passwordForm: FormGroup;
  showPasswordWarning = false;
  showPasswordError = false;
  showSuccessMessage = false;

  // Simulate the old password
  private oldPassword = "Coutipati99%";

  constructor(
    private fb: FormBuilder,
    private router: Router,
  ) {
    this.passwordForm = this.fb.group({
      newPassword: ["", [Validators.required, Validators.minLength(8)]],
      confirmPassword: ["", [Validators.required]],
    });
  }

  // Validate password on input
  validatePassword() {
    const newPassword = this.passwordForm.get("newPassword")?.value || "";
    const confirmPassword =
      this.passwordForm.get("confirmPassword")?.value || "";
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/;
    this.showPasswordWarning = !passwordRegex.test(newPassword);
    this.showPasswordError = newPassword === this.oldPassword;
    this.showSuccessMessage =
      !this.showPasswordWarning &&
      !this.showPasswordError &&
      newPassword === confirmPassword &&
      newPassword.length > 0;
  }

  // Form submission handler
  onSubmit() {
    if (this.passwordForm.valid) {
      const { newPassword, confirmPassword } = this.passwordForm.value;

      if (this.showPasswordError) {
        alert("You cannot reuse the old password!");
      } else if (this.showPasswordWarning) {
        alert("Please ensure the password meets the requirements!");
      } else if (newPassword !== confirmPassword) {
        alert("Passwords do not match!");
      } else {
        this.showSuccessMessage = true;
      }
    }
  }

  // Redirect to login when "Continue" is clicked
  redirectToLogin() {
    this.router.navigate(["/auth/login"]);
  }
}
