import { CompanyUser } from "../models/company-user";

export const MOCK_COMPANY_USER: CompanyUser = {
  id: "12345",
  name: "Furaha Dev",
  contact: {
    phone: "+250-780-1627",
    website: "https://furahadev.netlify.app/",
    email: "info@furahadev.com",
  },
  logo: "https://images.pexels.com/photos/11035543/pexels-photo-11035543.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  documentUrl:
    "https://signaturely.com/wp-content/uploads/2022/08/loan-agreement-uplead-791x1024.jpg",
  password: "12121",
} as const;

export const FILE_SIZE_LIMITS = {
  MAX_FILE_SIZE: 5 * 1024 * 1024,
  MAX_LOGO_SIZE: 2 * 1024 * 1024, // 2MB
  MAX_DOCUMENT_SIZE: 5 * 1024 * 1024, // 5MB
} as const;

export const VALIDATION_PATTERNS = {
  PHONE: /^\+\d{1,3}-\d{3}-\d{4}$/,
  WEBSITE: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
} as const;

export const ERROR_MESSAGES = {
  FILE_SIZE: "File size exceeds 5MB limit",
  REQUIRED_FIELD: "This field is required",
  INVALID_PHONE: "Invalid phone number format",
  INVALID_WEBSITE: "Invalid website URL",
  INVALID_EMAIL: "Invalid email address",
} as const;

export const ACCEPTED_FILE_TYPES = {
  IMAGES: ".png, .jpg, .jpeg",
  DOCUMENTS: ".pdf, .doc, .docx",
  ALL: ".png, .jpg, .jpeg, .pdf, .doc, .docx",
} as const;

export const VALID_WEBSITES = [
  "https://furahadev.netlify.app/",
  "http://example.com",
  "example.com",
  "sub.example.com",
  "test.co.uk",
] as const;
