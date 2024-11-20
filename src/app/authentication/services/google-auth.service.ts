import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthResponse } from "../models/auth-response.model";

@Injectable({
  providedIn: "root",
})
export class GoogleAuthService {
  constructor(private readonly http: HttpClient) {}

  postRegistration(token: string, email: string) {
    return this.http.post<AuthResponse>(
      "https://59cf-102-22-146-226.ngrok-free.app/api/v1/auth/register/google",
      { token, email },
    );
  }
}
