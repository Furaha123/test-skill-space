import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { GoogleAuthService } from "../../services/google-auth.service";
import { take } from "rxjs";
import { AuthResponse } from "../../models/auth-response.model";
import { DecodedToken } from "../../models/google-auth.model";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-register-page",
  templateUrl: "./register-page.component.html",
  styleUrls: ["./register-page.component.scss"],
})
export class RegisterPageComponent {
  currentForm = "talent";
  userName: string | null = null;

  constructor(
    private readonly googleAuthService: GoogleAuthService,
    private readonly router: Router,
    private readonly toastr: ToastrService,
  ) {}

  onRegisterCompany() {
    this.currentForm = "company";
  }

  onRegisterTalent() {
    this.currentForm = "talent";
  }

  handleCredentialResponse(response: { credential: string }) {
    if (response.credential) {
      const decoded = this.decodeJwtResponse(response.credential);

      this.googleAuthService
        .postRegistration(response.credential, decoded.email)
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
            this.toastr.success("Successfully registered and logged in");
            this.setUserInfo();
          },
          error: (error) => {
            if (error?.error?.message && error.status === 409) {
              this.googleAuthService
                .postLogin(response.credential, decoded.email)
                .pipe(take(1))
                .subscribe({
                  next: (response: AuthResponse) => {
                    const { roles, token } = response.data;
                    localStorage.setItem("token", token);

                    if (roles.some((role) => role.toLowerCase() === "talent")) {
                      this.router.navigate(["/talent"]);
                    } else if (
                      roles.some((role) => role.toLowerCase() === "admin")
                    ) {
                      this.router.navigate(["/admin-dashboard"]);
                    }
                    this.toastr.success("Successfully logged in");
                    this.setUserInfo();
                  },
                  error: (error) => {
                    this.toastr.error(error?.error?.message);
                  },
                });
            }
          },
        });
    }
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
