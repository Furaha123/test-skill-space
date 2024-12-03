export interface HttpError {
  error: {
    message: string;
  } | null;
  status: number;
  message: string;
}
