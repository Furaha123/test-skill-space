// admin-dashboard/services/admin.service.ts
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, map } from "rxjs";
import { Company } from "../models/company.model";

@Injectable({
  providedIn: "root",
})
export class AdminService {
  constructor(private readonly http: HttpClient) {}

  getCompanies(): Observable<Company[]> {
    return this.http
      .get<{ companies: Company[] }>("assets/mock-data/company-data.json")
      .pipe(map((response) => response.companies));
  }

  getCompanyById(id: string): Observable<Company | undefined> {
    return this.getCompanies().pipe(
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
