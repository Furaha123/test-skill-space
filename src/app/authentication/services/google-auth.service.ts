import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthResponse } from "../models/auth-response.model";
import { environment } from "../../../environments/environment.development";

@Injectable({
  providedIn: "root",
})
export class GoogleAuthService {
  constructor(private readonly http: HttpClient) {}

  postRegistration(token: string, email: string) {
    return this.http.post<AuthResponse>(
      environment.apiUrlForPostRegisterGoogle,
      { token, email },
    );
  }

  postLogin(token: string, email: string) {
    return this.http.post<AuthResponse>(environment.apiUrlForPostLoginGoogle, {
      token,
      email,
    });
  }
}
