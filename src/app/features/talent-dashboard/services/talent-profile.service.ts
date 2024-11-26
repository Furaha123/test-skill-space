/* eslint-disable no-console */
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { map, catchError, tap } from "rxjs/operators";

import { PersonalDetails } from "../models/personal.detalis.interface";
import { environment } from "../../../../environments/environment.development";

@Injectable({
  providedIn: "root",
})
export class TalentProfileService {
  constructor(private readonly http: HttpClient) {}

  private readonly endpoint = `${environment.apiUrl}/talent/2dcbb3fc-5531-445c-abbd-48012f9ef935/personal-details`;

  getPersonalDetails(): Observable<PersonalDetails> {
    return this.http
      .get<{
        status: string;
        message: string;
        data: PersonalDetails;
      }>(this.endpoint)
      .pipe(
        tap((response) => console.log("Response from backend:", response)),
        map((response) => response.data),
        catchError((err) => {
          return throwError(() => err.error || err.message || err);
        }),
      );
  }

  patchPersonalDetails(
    personalDetails: Partial<PersonalDetails>,
  ): Observable<PersonalDetails> {
    return this.http
      .patch<{
        status: string;
        message: string;
        data: PersonalDetails;
      }>(this.endpoint, personalDetails)
      .pipe(
        tap((response) => console.log("Response from backend:", response)),
        map((response) => response.data),

        catchError((err) => {
          console.error("Error updating personal details:", err);
          return throwError(() => err.error || err.message || err);
        }),
      );
  }
}
