export interface GoogleCredentialResponse {
  credential: string;
}

export interface DecodedToken {
  email: string;
  name: string;
  picture?: string;
  given_name?: string;
  family_name?: string;
}

declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: GoogleCredentialResponse) => void;
          }) => void;
          renderButton: (
            element: Element | null,
            options: {
              theme: string;
              size: string;
              width: string;
            },
          ) => void;
          prompt: () => void;
        };
      };
    };
  }
}
