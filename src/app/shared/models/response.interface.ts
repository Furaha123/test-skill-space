import { Talent } from "./talent.interface";

export interface LoginResponseData {
  [key: string]:
    | string
    | number
    | boolean
    | string[]
    | null
    | undefined
    | Talent;
  token?: string;
  roles?: string[];
  verified?: boolean;
  sent?: boolean;
  error?: string;
  message?: string;
  user?: Talent;
}

export interface ResponseInterface {
  status: string;
  message: string;
  data?: LoginResponseData;
}
