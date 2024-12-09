export interface CompanyUser {
  id?: string;
  name: string;
  websiteUrl: string;
  socialMedia: string[];
  logoUrl: string;
  status: string;
  registrationDate: string;
  companyAdmin: number;
  phoneNumber: string;
}
export interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
}
export interface UpdateCompanyUser {
  phoneNumber?: string;
  socialMedia?: string[];
  websiteUrl?: string;
}
export interface CompanyUserResponse {
  id: string;
  name: string;
  websiteUrl: string;
  socialMedia: string[];
  logoUrl: string;
  status: string;
  registrationDate: string;
  companyAdmin: number;
  phoneNumber: string;
}
