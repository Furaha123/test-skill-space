export interface CompanyUser {
  id?: string;
  name: string;
  contact: CompanyContact | undefined;
  logo: string;
  documentUrl?: string;
  password: string;
}

export interface CompanyContact {
  email: string;
  phone: string | undefined;
  website: string;
}
