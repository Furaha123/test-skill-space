import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { GoogleAuthService } from "../../services/google-auth.service";
import { environment } from "../../../../environments/environment.development";
import { take } from "rxjs";
import { AuthResponse } from "../../models/auth-response.model";

interface GoogleCredentialResponse {
  credential: string;
}

interface DecodedToken {
  email: string;
  name: string; // Include the user's name from the decoded token
}

declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: GoogleCredentialResponse) => void;
          }) => void;
          renderButton: (
            element: Element | null,
            options: {
              theme: string;
              size: string;
              width: string;
            },
          ) => void;
          prompt: () => void;
        };
      };
    };
  }
}

@Component({
  selector: "app-register-page",
  templateUrl: "./register-page.component.html",
  styleUrl: "./register-page.component.scss",
})
export class RegisterPageComponent implements OnInit {
  currentForm = "talent";
  userName: string | null = null;

  constructor(
    private readonly googleAuthService: GoogleAuthService,
    private readonly router: Router,
  ) {}

  ngOnInit() {
    // Initialize Google login with the client ID and callback
    window.google.accounts.id.initialize({
      client_id: environment.googleClientId,
      callback: this.handleCredentialResponse.bind(this),
    });

    // Render Google login button
    window.google.accounts.id.renderButton(
      document.querySelector(".btn-google"),
      {
        theme: "outline",
        size: "large",
        width: "100%",
      },
    );

    // Check if user is already authenticated
    const token = localStorage.getItem("token");
    if (token) {
      this.setUserInfo();
    }
  }

  setUserInfo() {
    const decoded = this.decodeJwtResponse(localStorage.getItem("token")!);
    this.userName = decoded.name;
  }

  onRegisterCompany() {
    this.currentForm = "company";
  }

  onRegisterTalent() {
    this.currentForm = "talent";
  }

  registerWithGoogle() {
    window.google.accounts.id.prompt();
  }

  private handleCredentialResponse(response: GoogleCredentialResponse) {
    if (response.credential) {
      const decoded = this.decodeJwtResponse(response.credential);

      this.googleAuthService
        .postRegistration(response.credential, decoded.email)
        .pipe(take(1))
        .subscribe({
          next: (response: AuthResponse) => {
            const { roles, token } = response.data;
            localStorage.setItem("token", token); // Save token to localStorage

            if (roles.some((role) => role.toLowerCase() === "talent")) {
              this.router.navigate(["/talent"]);
            }

            this.setUserInfo();
          },
          error: (error) => {
            throw new Error(error);
          },
        });
    }
  }

  private decodeJwtResponse(token: string): DecodedToken {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(window.atob(base64));
  }
}
