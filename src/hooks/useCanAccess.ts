// src/hooks/useCanAccess.ts
import { useAuthStore } from "@/store/authStore";

export default function useCanAccess(permission: string): boolean {
  const permissions = useAuthStore((state) => state.permissions);
  console.log("[useCanAccses]", permission);
  return permissions.includes(permission);
}
