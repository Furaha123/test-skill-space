import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { Company } from "../models/company.model";

export const AdminActions = createActionGroup({
  source: "Admin",
  events: {
    // Load Companies
    "Load Companies": props<{ page: number; size: number }>(),
    "Load Companies Success": props<{
      companies: Company[];
      currentPage: number;
      totalPages: number;
      totalItems: number;
      pageSize: number;
      hasNext: boolean;
      hasPrevious: boolean;
    }>(),
    "Load Companies Failure": props<{ error: string }>(),

    // Select Company
    "Select Company": props<{ companyId: string }>(),
    "Clear Selected Company": emptyProps(),
  },
});
