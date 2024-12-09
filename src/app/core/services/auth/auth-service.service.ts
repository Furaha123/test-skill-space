import { Injectable } from "@angular/core";
import { Observable, tap, retry } from "rxjs";
import { environment } from "../../../../environments/environment.development";
import { Talent } from "../../../shared/models/talent.interface";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ResponseInterface } from "../../../shared/models/response.interface";
import { Company } from "../../../shared/models/company.interface";
import { PasswordResetResponse } from "../../../authentication/auth-store/auth.interface";

interface VerifyOtpResponse {
  status: string;
  message: string;
  data: {
    token: string;
  };
}

interface ChangePasswordDTO {
  newPassword: string;
}

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  talentRegister(user: Talent): Observable<ResponseInterface> {
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "true",
    });
    return this.http.post<ResponseInterface>(`/api/v1/talent/register`, user, {
      headers,
    });
  }

  forgotPassword(email: string): Observable<ResponseInterface> {
    return this.http.post<ResponseInterface>(
      `${this.apiUrl}/auth/forget-password`,
      { email },
    );
  }

  verifyOTP(otp: {
    email?: string;
    otp: string;
  }): Observable<ResponseInterface> {
    return this.http.post<ResponseInterface>(`/api/v1/otp/verify-otp`, otp);
  }
  verifyCompanyOTP(otp: {
    email?: string;
    otp: string;
  }): Observable<ResponseInterface> {
    return this.http.post<ResponseInterface>(`/api/v1/otp/verify-otp`, otp);
  }

  verifyPasswordResetOtp(otp: string): Observable<VerifyOtpResponse> {
    return this.http
      .post<VerifyOtpResponse>(
        `${this.apiUrl}/auth/verify-password-reset-otp`,
        { otp },
      )
      .pipe(
        tap((response) => {
          if (response.data?.token) {
            localStorage.setItem("reset_token", response.data.token);
          }
        }),
      );
  }

  resetPassword(newPassword: string): Observable<PasswordResetResponse> {
    const resetToken = localStorage.getItem("reset_token");
    const headers = new HttpHeaders()
      .set("Reset-Token", resetToken || "")
      .set("Content-Type", "application/json");

    const changePasswordDTO: ChangePasswordDTO = { newPassword };

    return this.http
      .post<PasswordResetResponse>(
        `${this.apiUrl}/auth/reset-password`,
        changePasswordDTO,
        { headers },
      )
      .pipe(tap(() => localStorage.removeItem("reset_token")));
  }

  requestNewOTP(email: string): Observable<ResponseInterface> {
    return this.http.post<ResponseInterface>(
      `${this.apiUrl}/otp/generate-new`,
      { email },
    );
  }

  login(
    email: string,
    password: string,
  ): Observable<{
    status: string;
    message: string;
    data: { token: string; roles: string[] };
  }> {
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      Accept: "application/json",
    });

    const body = {
      email: email.trim().toLowerCase(),
      password,
    };

    return this.http.post<{
      status: string;
      message: string;
      data: { token: string; roles: string[] };
    }>(`${this.apiUrl}/v1/auth/login`, body, { headers });
  }

  companyRegister(data: Company): Observable<ResponseInterface> {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (key === "logo" && value instanceof File) {
        formData.append(key, value, value.name);
      } else if (key === "certificates" && value instanceof File) {
        formData.append(key, value, value.name);
      } else if (value instanceof Date) {
        formData.append(key, value.toISOString());
      } else if (value !== null) {
        formData.append(key, value.toString());
      }
    });
    return this.http
      .post<ResponseInterface>(`/api/v1/companys/register`, formData)
      .pipe(retry(1));
  }

  logout(): void {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("reset_token");
  }
}
