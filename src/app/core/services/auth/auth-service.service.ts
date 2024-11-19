import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { Talent } from "../../../shared/models/talent.interface";
import { HttpClient } from "@angular/common/http";
import { ResponseInterface } from "../../../shared/models/response.interface";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AuthServiceService {
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
}
