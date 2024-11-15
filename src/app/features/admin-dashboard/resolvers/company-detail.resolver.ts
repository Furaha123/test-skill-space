import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot } from "@angular/router";
import { Store } from "@ngrx/store";
import { Observable, filter, first, tap } from "rxjs";
import { Company } from "../models/company.model";
import { AdminActions } from "../store/admin.actions";
import { selectCompanyById } from "../store/admin.selectors";

@Injectable({ providedIn: "root" })
export class CompanyDetailResolver implements Resolve<Company | undefined> {
  constructor(private readonly store: Store) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Company | undefined> {
    const companyId = route.paramMap.get("id")!;

    // Dispatch action to load company
    this.store.dispatch(AdminActions.loadCompany({ companyId }));

    // Wait for the company to be loaded
    return this.store.select(selectCompanyById(companyId)).pipe(
      filter((company) => !!company), // Wait until company is loaded
      first(), // Complete after first emission
      tap((company) => {
        if (!company) {
          throw new Error("Company not found");
        }
      }),
    );
  }
}
