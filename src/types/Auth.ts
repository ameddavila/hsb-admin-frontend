// src/types/Auth.ts
import { User } from "./User";

export interface AuthResponse {
  user: User;
  csrfToken: string;
}

export interface CsrfResponse {
  csrfToken: string;
}
