import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
import { Talent } from "../../../shared/models/talent.interface";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ResponseInterface } from "../../../shared/models/response.interface";
import { Company } from "../../../shared/models/company.interface";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  talentRegister(user: Talent): Observable<ResponseInterface> {
    const headers = new HttpHeaders({ "Content-Type": "application/json" });
    return this.http.post<ResponseInterface>(
      `${this.apiUrl}/talent/register`,
      user,
      { headers },
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

  login(
    email: string,
    password: string,
  ): Observable<{
    status: string;
    message: string;
    data: { token: string; roles: string[] };
  }> {
    const headers = new HttpHeaders({ "Content-Type": "application/json" });
    const body = { email, password };

    return this.http.post<{
      status: string;
      message: string;
      data: { token: string; roles: string[] };
    }>(`${this.apiUrl}/auth/login`, body, { headers });
  }

  companyRegister(company: Company): Observable<ResponseInterface> {
    const headers = new HttpHeaders({ "Content-Type": "application/json" });
    return this.http.post<ResponseInterface>(
      `${this.apiUrl}/companys/register`,
      company,
      { headers },
    );
  }
}
