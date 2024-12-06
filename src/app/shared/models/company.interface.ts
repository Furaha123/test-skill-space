export interface Company {
  [key: string]: string | Date | File | null;
  email: string;
  password: string;
  name: string;
  websiteUrl: string;
  phoneNumber: string;
  logo: File;
  certificates: File;
}
