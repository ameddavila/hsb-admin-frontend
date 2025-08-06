// src/types/Auth.ts
import { User } from "./User";
import type { MenuNode } from "./Menu";

export interface AuthResponse {
  user: User;
  csrfToken: string;
  accessToken: string;
  roles: string[];
  permissions: string[];
  menus: MenuNode[];
}

export interface CsrfResponse {
  csrfToken: string;
}

// en src/types/Auth.ts o directamente arriba
export type RefreshResponse = {
  accessToken: string;
  csrfToken: string;
  accessTokenExpiresIn: number;
};
