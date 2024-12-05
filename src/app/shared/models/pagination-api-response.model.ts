import { Company } from "../../features/admin-dashboard/models/company.model";

export interface CompanyApiResponse {
  message: string;
  data: Company[];
  currentPage: number;
  size: number;
  hasNext: boolean;
  nextPageState: string | null;
}

export interface PaginatedCompanyResponse {
  message: string;
  data: Company[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  hasNext: boolean;
  hasPrevious: boolean;
}
