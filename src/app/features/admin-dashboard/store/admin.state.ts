import { Company } from "../models/company.model";

export interface AdminState {
  companies: Company[];
  selectedCompanyId: string | null;
  isLoading: boolean;
  error: string | null;
}

export const initialAdminState: AdminState = {
  companies: [],
  selectedCompanyId: null,
  isLoading: false,
  error: null,
};
