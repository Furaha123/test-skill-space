import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, map, take } from "rxjs";
import { PaginatedCompanyResponse } from "../../../shared/models/pagination-api-response.model";
import { environment } from "../../../../environments/environment.development";
import { Company } from "../models/company.model";
import { selectCompanies } from "../store/admin.selectors";
import { Store } from "@ngrx/store";

@Injectable({
  providedIn: "root",
})
export class AdminService {
  private apiUrl = environment.getPaginatedCompanies;

  constructor(
    private readonly http: HttpClient,
    private readonly store: Store,
  ) {}

  getInitialCompanies(
    page = 0,
    size = 10,
  ): Observable<PaginatedCompanyResponse> {
    // Remove the existing query parameters and add new ones
    const baseUrl = this.apiUrl.split("?")[0];
    const url = `${baseUrl}?page=${page}&size=${size}`;

    const headers = new HttpHeaders({
      Authorization: `Bearer ${environment.token}`,
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "true",
    });

    return this.http.get<PaginatedCompanyResponse>(url, { headers });
  }

  // Update other methods to handle multiple data sources
  getCompanyById(id: string): Observable<Company | undefined> {
    return this.store.select(selectCompanies).pipe(
      take(1),
      map((companies) => companies.find((company) => company.id === id)),
    );
  }

  // Simulate PUT/POST requests (in a real app these would be HTTP requests)
  approveCompany(id: string): Observable<Company> {
    return this.getCompanyById(id).pipe(
      map((company) => {
        if (!company) {
          throw new Error("Company not found");
        }
        return { ...company, status: "approved" as const };
      }),
    );
  }

  rejectCompany(id: string): Observable<Company> {
    return this.getCompanyById(id).pipe(
      map((company) => {
        if (!company) {
          throw new Error("Company not found");
        }
        return { ...company, status: "rejected" as const };
      }),
    );
  }
}
