import { Injectable } from "@angular/core";

import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { environment } from "../../../../environments/environment";
import { Talent } from "../../../shared/models/talent.interface";
import { HttpClient } from "@angular/common/http";
import { ResponseInterface } from "../../../shared/models/response.interface";


@Injectable({
  providedIn: "root",
})
export class AuthService {
  readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  talentRegister(user: Talent): Observable<ResponseInterface> {
    return this.http.post<ResponseInterface>(
      `${this.apiUrl}/talent/register`,
      user,
    );
  }

  verifyOTP(otp: {
    email?: string;
    otp: string;
  }): Observable<ResponseInterface> {
    return this.http.post<ResponseInterface>(
      `${this.apiUrl}/otp/verify-otp`,
      otp,
    );
  }

  requestNewOTP(email: string): Observable<ResponseInterface> {
    return this.http.post<ResponseInterface>(
      `${this.apiUrl}/otp/generate-new`,
      {
        email,
      },
    );
  }

  // Send login request to backend and return an Observable of the response
  login(
    email: string,
    password: string,
  ): Observable<{ token: string; role: string }> {
    const headers = new HttpHeaders({ "Content-Type": "application/json" });
    const body = { email, password };

    return this.http
      .post<{ token: string; role: string }>(this.apiUrl, body, { headers })
      .pipe(tap((response) => this.setSession(response.token, response.role)));
  }

  // Store JWT token and role in localStorage
  private setSession(token: string, role: string): void {
    localStorage.setItem("jwtToken", token);
    localStorage.setItem("userRole", role);
  }

  // Retrieve JWT token
  getToken(): string | null {
    return localStorage.getItem("jwtToken");
  }

  // Retrieve user role
  getUserRole(): string | null {
    return localStorage.getItem("userRole");
  }

  // Clear session on logout
  logout(): void {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("userRole");
  }
}
