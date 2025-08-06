// src/types/AxiosError.ts
export type AxiosErrorResponse = {
  response?: {
    data?: unknown;
  };
  message?: string;
};
