import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { Company } from "../models/company.model";

export const AdminActions = createActionGroup({
  source: "Admin",
  events: {
    // Load Companies
    "Load Companies": emptyProps(),
    "Load Companies Success": props<{ companies: Company[] }>(),
    "Load Companies Failure": props<{ error: string }>(),

    // Select Company
    "Select Company": props<{ companyId: string }>(),
    "Clear Selected Company": emptyProps(),

    // Load Single Company
    "Load Company": props<{ companyId: string }>(),
    "Load Company Success": props<{ company: Company }>(),
    "Load Company Failure": props<{ error: string }>(),

    // Update Company Status
    "Approve Company": props<{ companyId: string }>(),
    "Approve Company Success": props<{ company: Company }>(),
    "Approve Company Failure": props<{ error: string }>(),

    "Reject Company": props<{ companyId: string }>(),
    "Reject Company Success": props<{ company: Company }>(),
    "Reject Company Failure": props<{ error: string }>(),
  },
});
