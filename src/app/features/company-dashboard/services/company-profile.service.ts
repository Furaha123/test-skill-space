import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, of, throwError } from "rxjs";
import { tap, catchError } from "rxjs/operators";
import { CompanyUser } from "../models/company-user";

@Injectable({
  providedIn: "root",
})
export class CompanyProfileService {
  private readonly apiUrl = "assets/company.user.json";

  constructor(private readonly http: HttpClient) {}

  getCompanyUserInfo(): Observable<CompanyUser> {
    return this.http.get<CompanyUser>(this.apiUrl).pipe(
      tap((data: CompanyUser) => {
        localStorage.setItem("companyUser", JSON.stringify(data));
      }),
      catchError(() => {
        return throwError(
          () => new Error("Failed to fetch company user info."),
        );
      }),
    );
  }

  updateCompanyUserInfo(
    updatedData: Partial<CompanyUser>,
  ): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      const currentData = localStorage.getItem("companyUser") ?? "{}";
      try {
        const parsedData: CompanyUser = JSON.parse(currentData) as CompanyUser;

        if (Object.keys(parsedData).length === 0) {
          observer.error(
            new Error("No company user data found in local storage to update."),
          );
          return;
        }

        const mergedData: CompanyUser = { ...parsedData, ...updatedData };
        localStorage.setItem("companyUser", JSON.stringify(mergedData));
        observer.next(true);
        observer.complete();
      } catch {
        observer.error(new Error("Failed to update company user info."));
      }
    }).pipe(catchError(() => of(false)));
  }
}
