// types/AuthContext.ts

import type { User } from "./User";

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  handleLogin: (identifier: string, password: string) => Promise<void>;
  handleLogout: () => void;
  roles: string[];
  permissions: string[];
  csrfToken: string | null;
}
