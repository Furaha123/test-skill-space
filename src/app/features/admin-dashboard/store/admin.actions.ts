import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { Company } from "../models/company.model";

export const AdminActions = createActionGroup({
  source: "Admin",
  events: {
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

    "Select Company": props<{ companyId: string }>(),
    "Clear Selected Company": emptyProps(),

    "Search Companies": props<{
      searchTerm: string;
      page: number;
      size: number;
    }>(),
    "Search Companies Success": props<{
      companies: Company[];
      currentPage: number;
      totalPages: number;
      totalItems: number;
      pageSize: number;
      hasNext: boolean;
      hasPrevious: boolean;
    }>(),
    "Search Companies Failure": props<{ error: string }>(),
    "Clear Search": emptyProps(),

    "Approve Company": props<{ companyId: string }>(),
    "Approve Company Success": props<{ company: Company }>(),
    "Approve Company Failure": emptyProps(),

    "Reject Company": props<{ companyId: string }>(),
    "Reject Company Success": props<{ company: Company }>(),
    "Reject Company Failure": emptyProps(),
  },
});

export const AppActions = createActionGroup({
  source: "App",
  events: {
    "Set Search Term": props<{ searchTerm: string }>(),
  },
});
