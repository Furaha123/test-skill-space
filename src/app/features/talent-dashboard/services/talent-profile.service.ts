import { Injectable } from "@angular/core";
import { Observable, of, throwError } from "rxjs";
import { catchError, retry } from "rxjs/operators";
import {
  ApiResponse,
  PersonalDetails,
  UserInfo,
} from "../models/personal.detalis.interface";
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { EducationRecord } from "../models/education.record.interface";
import { HttpError } from "../models/http-error.interface";

@Injectable({
  providedIn: "root",
})
export class TalentProfileService {
  private readonly personalDetailsEndpoint = "api/v1/talent/personal-details";
  private readonly schoolsEndpoint = "/api/v1/talent/schools";
  private readonly createSchoolsEndpoint = "/api/v1/talent/schools";
  private readonly STORAGE_KEY = "educationRecords";
  private readonly PERSONAL_DETAILS_KEY = "personalDetails";
  private readonly userInfoEndpoint = "api/v1/auth/get-user-info";

  constructor(private readonly http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "true",
    });
  }

  getPersonalDetails(): Observable<ApiResponse<PersonalDetails>> {
    return this.http
      .get<ApiResponse<PersonalDetails>>(this.personalDetailsEndpoint, {
        headers: this.getHeaders(),
      })
      .pipe(retry(1), catchError(this.handleError));
  }

  updatePersonalDetails(
    updatedDetails: PersonalDetails,
  ): Observable<ApiResponse<PersonalDetails>> {
    return this.http
      .put<ApiResponse<PersonalDetails>>(
        this.personalDetailsEndpoint,
        updatedDetails,
        {
          headers: this.getHeaders(),
        },
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  getSchools(): Observable<ApiResponse<EducationRecord[]>> {
    return this.http
      .get<ApiResponse<EducationRecord[]>>(this.schoolsEndpoint, {
        headers: this.getHeaders(),
      })
      .pipe(retry(1), catchError(this.handleError));
  }

  createSchools(
    school: EducationRecord,
  ): Observable<ApiResponse<EducationRecord>> {
    return this.http
      .post<ApiResponse<EducationRecord>>(this.createSchoolsEndpoint, school, {
        headers: this.getHeaders(),
      })
      .pipe(retry(1), catchError(this.handleError));
  }

  updateLocalStorage(id: string, updatedRecord: EducationRecord): void {
    const records = localStorage.getItem(this.STORAGE_KEY);
    if (records) {
      const parsedRecords = JSON.parse(records);
      const updatedRecords = parsedRecords.map((record: EducationRecord) =>
        record.id === id ? updatedRecord : record,
      );
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedRecords));
    }
  }
  deleteSchool(id: string): Observable<ApiResponse<void>> {
    const records = localStorage.getItem(this.STORAGE_KEY);
    if (records) {
      const parsedRecords = JSON.parse(records) as EducationRecord[];
      const updatedRecords = parsedRecords.filter(
        (record: EducationRecord) => record.id !== id,
      );
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedRecords));
    }

    return of({
      status: "success",
      message: "School deleted successfully",
      data: undefined,
    });
  }

  getUserInfo(): Observable<ApiResponse<UserInfo>> {
    return this.http
      .get<ApiResponse<UserInfo>>(this.userInfoEndpoint, {
        headers: this.getHeaders(),
      })
      .pipe(retry(1), catchError(this.handleError));
  }

  private handleError(error: HttpError): Observable<never> {
    let errorMessage = "Something went wrong please try again!";
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }
}
