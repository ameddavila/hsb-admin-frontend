// src/types/User.ts
export interface Role {
  id: string;
  name: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  dni?: string;
  firstName?: string;
  lastName?: string;
  phone?: string | null;
  profileImage?: string | null;
  isActive: boolean; 
  // Usado solo en memoria
  roles?: Role[];
  permissions?: string[];
}
