import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import * as AuthActions from "../../auth-store/auth.actions";
import { AuthState } from "../../auth-store/auth.reducer";
import { Router } from "@angular/router";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  showError$!: Observable<string | null>; // Non-null assertion operator

  constructor(
    private fb: FormBuilder,
    private store: Store<{ auth: AuthState }>,
    private router: Router,
  ) {
    // Initialize the login form with custom validators
    this.loginForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: [
        "",
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
          ),
        ],
      ],
    });
  }

  ngOnInit(): void {
    // Observable to track login errors from NgRx store
    this.showError$ = this.store.select((state) => state.auth.error);
  }

  // Method to check if a form field is invalid and has been touched or dirty
  isFieldInvalid(field: string): boolean {
    const control = this.loginForm.get(field);
    return !!control && control.invalid && (control.touched || control.dirty);
  }

  // Submit handler
  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.store.dispatch(AuthActions.login({ email, password }));

      // Simulate role-based redirection
      this.store
        .select((state) => state.auth.role)
        .subscribe((role) => {
          if (role) {
            switch (role) {
              case "admin":
                this.router.navigate(["/admin/dashboard"]);
                break;
              case "talent":
                this.router.navigate(["/talent/dashboard"]);
                break;
              case "company":
                this.router.navigate(["/company/dashboard"]);
                break;
              case "mentor":
                this.router.navigate(["/mentor/dashboard"]);
                break;
              default:
                this.router.navigate(["/login"]);
            }
          }
        });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
