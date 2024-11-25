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
  phoneVisibility: boolean | null;
  socialMedia: SocialMedia[];
  profilePictureUrl: string | null;
  cvUrl: string | null;
  portfolios: Portfolio[];
}

export interface SocialMedia {
  platform: string;
  url: string;
}

export interface Portfolio {
  id: string;
  url: string;
  description?: string;
}
