export interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
}

export interface PersonalDetails {
  firstName: string;
  lastName: string;
  introduction: string;
  birthDate: string;
  nationality: string;
  currentLocation: string;
  phoneNumber: string;
  phoneVisibility: "public" | "private";
  socialMedia: SocialMedia[];
  profilePictureUrl: string;
  cvUrl: string;
  portfolios: string[];
}

export interface SocialMedia {
  name: string;
  url: string;
}
export interface UserInfo {
  id: number;
  email: string;
}
