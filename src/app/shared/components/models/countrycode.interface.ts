export interface CountryApiResponse {
  idd: {
    root: string;
    suffixes: string[] | null;
  };
  flags: {
    svg: string;
  };
}

export interface Country {
  code: string;
  flag: string;
}
