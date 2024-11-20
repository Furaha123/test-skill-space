export interface ResponseInterface {
  status: string;
  message: string;
  data?: object[];
  pagination?: {
    page: number;
    total: number;
    per_page: number;
    total_pages: number;
  };
}
