import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError, retry } from "rxjs/operators";
import {
  ApiResponse,
  PersonalDetails,
} from "../models/personal.detalis.interface";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../../environments/environment.development";
import { EducationRecord } from "../models/education.record.interface";
import { HttpError } from "../models/http-error.interface";

@Injectable({
  providedIn: "root",
})
export class TalentProfileService {
  private readonly personalDetailsEndpoint =
    "/api/v1/talent/8a57f795-eed2-46ba-a9fc-10616ff24aba/personal-details";
  private readonly schoolsEndpoint =
    "/api/v1/talent/8a57f795-eed2-46ba-a9fc-10616ff24aba/schools";
  private readonly createSchoolsEndpoint = "/api/v1/talent/schools";

  constructor(private readonly http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${environment.token}`,
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "true",
    });
  }

  getPersonalDetails(): Observable<ApiResponse<PersonalDetails>> {
    return this.http
      .get<ApiResponse<PersonalDetails>>(this.personalDetailsEndpoint, {
        headers: this.getHeaders(),
      })
      .pipe(retry(3), catchError(this.handleError));
  }

  getSchools(): Observable<ApiResponse<EducationRecord[]>> {
    return this.http
      .get<ApiResponse<EducationRecord[]>>(this.schoolsEndpoint, {
        headers: this.getHeaders(),
      })
      .pipe(retry(3), catchError(this.handleError));
  }

  createSchools(
    school: EducationRecord,
  ): Observable<ApiResponse<EducationRecord>> {
    return this.http
      .post<ApiResponse<EducationRecord>>(this.createSchoolsEndpoint, school, {
        headers: this.getHeaders(),
      })
      .pipe(retry(3), catchError(this.handleError));
  }

  updateSchool(
    schoolId: string,
    school: EducationRecord,
  ): Observable<ApiResponse<EducationRecord>> {
    const endpoint = `${this.createSchoolsEndpoint}/${schoolId}`;
    return this.http
      .patch<ApiResponse<EducationRecord>>(endpoint, school, {
        headers: this.getHeaders(),
      })
      .pipe(retry(3), catchError(this.handleError));
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
