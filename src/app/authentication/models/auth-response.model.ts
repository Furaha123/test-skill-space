export interface AuthResponse {
  data: {
    email: string;
    roles: string[];
    token: string;
  };
  message: string;
  status: string;
}
