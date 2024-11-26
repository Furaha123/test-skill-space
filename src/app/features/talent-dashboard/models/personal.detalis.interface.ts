export interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
}

export interface PersonalDetails {
  firstName: string | null;
  lastName: string | null;
  introduction: string | null;
  birthDate: string | null;
  nationality: string | null;
  currentLocation: string | null;
  phoneNumber: string | null;
  phoneVisibility: "public" | "private" | null;
  socialMedia: SocialMedia[];
  profilePicture: string | null;
  cvUrl: string | null;
  portfolios: Portfolio[];
}

export interface SocialMedia {
  name: string;
  url: string;
}

export interface Portfolio {
  id: string;
  url: string;
  description?: string;
}
