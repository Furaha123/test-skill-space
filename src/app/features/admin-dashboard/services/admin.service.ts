import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, map, take } from "rxjs";
import { PaginatedCompanyResponse } from "../../../shared/models/pagination-api-response.model";
import { environment } from "../../../../environments/environment.development";
import { Company } from "../models/company.model";
import { selectCompanies } from "../store/admin.selectors";
import { Store } from "@ngrx/store";

const headers = new HttpHeaders({
  "Content-Type": "application/json",
  "ngrok-skip-browser-warning": "true",
});

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
    size = 5,
  ): Observable<PaginatedCompanyResponse> {
    // Remove the existing query parameters and add new ones
    const baseUrl = this.apiUrl.split("?")[0];
    const url = `${baseUrl}?page=${page}&size=${size}`;
    return this.http.get<PaginatedCompanyResponse>(url, { headers });
  }

  // Update other methods to handle multiple data sources
  getCompanyById(id: string): Observable<Company | undefined> {
    return this.store.select(selectCompanies).pipe(
      take(1),
      map((companies) => companies.find((company) => company.id === id)),
    );
  }

  approveCompany(companyId: string): Observable<Company> {
    const url = environment.approveCompanyUrl.replace("{companyId}", companyId);
    return this.http.post<Company>(url, {}, { headers });
  }

  rejectCompany(companyId: string): Observable<Company> {
    const url = environment.rejectCompanyUrl.replace("{companyId}", companyId);
    return this.http.post<Company>(url, {}, { headers });
  }

  searchCompanies(
    searchTerm: string,
    page = 0,
    size = 5,
  ): Observable<PaginatedCompanyResponse> {
    // Remove the existing query parameters and add new ones
    const baseUrl = this.apiUrl.split("?")[0];
    const url = `${baseUrl}?page=${page}&size=${size}&search=${searchTerm}`;
    return this.http.get<PaginatedCompanyResponse>(url, { headers });
  }
}
