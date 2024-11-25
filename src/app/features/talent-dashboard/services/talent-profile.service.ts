import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { environment } from "../../../../environments/environment";
import { PersonalDetails } from "../models/personal.detalis.interface";

@Injectable({
  providedIn: "root",
})
export class TalentProfileService {
  public readonly apiUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  getPersonalDetails(): Observable<PersonalDetails> {
    const endpoint = `${this.apiUrl}/talent/talentId/personal-details`;

    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Accept: "application/json",
        "ngrok-skip-browser-warning": "true",
      }),
      responseType: "json" as const,
    };

    return this.http
      .get<{
        status: string;
        message: string;
        data: PersonalDetails;
      }>(endpoint, options)
      .pipe(
        map((response) => response.data),
        catchError((err) => throwError(() => err)),
      );
  }
}
