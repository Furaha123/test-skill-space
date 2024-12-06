import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { tap, catchError, map } from "rxjs/operators";
import {
  ApiResponse,
  CompanyUser,
  CompanyUserResponse,
  UpdateCompanyUser,
} from "../models/company-user";

@Injectable({
  providedIn: "root",
})
export class CompanyProfileService {
  private readonly apiUrl = "/api/v1/companys/profile";

  private readonly headers = new HttpHeaders({
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  });

  constructor(private readonly http: HttpClient) {}

  getCompanyUserInfo(): Observable<CompanyUser> {
    return this.http
      .get<ApiResponse<CompanyUser>>(this.apiUrl, { headers: this.headers })
      .pipe(
        map((response: ApiResponse<CompanyUser>) => {
          if (!response.data) {
            throw new Error("Invalid response format");
          }
          return response.data;
        }),
        tap((data: CompanyUser) => {
          localStorage.setItem("companyUser", JSON.stringify(data));
        }),
        catchError(this.handleError<CompanyUser>()),
      );
  }

  updateCompanyUserInfo(
    updatedData: Partial<UpdateCompanyUser>,
  ): Observable<CompanyUserResponse> {
    return this.http
      .put<ApiResponse<CompanyUserResponse>>(this.apiUrl, updatedData, {
        headers: this.headers,
      })
      .pipe(
        map((response: ApiResponse<CompanyUserResponse>) => response.data),
        catchError(this.handleError<CompanyUserResponse>()),
      );
  }

  private handleError<T>() {
    return (error: HttpErrorResponse): Observable<T> => {
      if (error.error instanceof ErrorEvent) {
        return throwError(() => new Error(`Error: ${error.error.message}`));
      }

      return throwError(
        () =>
          new Error(`Error Code: ${error.status}\nMessage: ${error.message}`),
      );
    };
  }
}
