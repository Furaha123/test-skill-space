import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Store } from "@ngrx/store";
import * as AuthActions from "../../auth-store/auth.actions";
import { selectError } from "../../auth-store/auth.reducer";
import { Observable, of, take } from "rxjs";
import { GoogleAuthService } from "../../services/google-auth.service";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { DecodedToken } from "../../models/google-auth.model";
import { AuthResponse } from "../../models/auth-response.model";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  showError$: Observable<string | null> = of("");
  currentForm = "talent";
  userName: string | null = null;

  constructor(
    private readonly fb: FormBuilder,
    private readonly store: Store,
    private readonly googleAuthService: GoogleAuthService,
    private readonly router: Router,
    private readonly toastr: ToastrService,
  ) {
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
    this.showError$ = this.store.select(selectError);
  }

  isFieldInvalid(field: string): boolean {
    const control = this.loginForm.get(field);
    return !!control && control.invalid && (control.touched || control.dirty);
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      this.store.dispatch(AuthActions.login({ email, password }));
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  handleCredentialResponse({ credential }: { credential: string }) {
    if (!credential) {
      this.toastr.error("No credentials provided");
      return;
    }
    const decoded = this.decodeJwtResponse(credential);

    this.googleAuthService
      .postLogin(credential, decoded.email)
      .pipe(take(1))
      .subscribe({
        next: (response: AuthResponse) => {
          const { roles, token } = response.data;
          localStorage.setItem("token", token);

          if (roles.some((role) => role.toLowerCase() === "talent")) {
            this.router.navigate(["/talent"]);
          } else if (roles.some((role) => role.toLowerCase() === "admin")) {
            this.router.navigate(["/admin-dashboard"]);
          }
          this.toastr.success("Successfully logged in");
          this.setUserInfo();
        },
        error: (error) => {
          this.toastr.error("Failed to login", error.message);
        },
      });
  }

  private setUserInfo() {
    const decoded = this.decodeJwtResponse(localStorage.getItem("token")!);
    this.userName = decoded.name;
  }

  private decodeJwtResponse(token: string): DecodedToken {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(window.atob(base64));
  }
}
