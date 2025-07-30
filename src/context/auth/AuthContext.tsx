import { createContext } from "react";
import type { AuthContextType } from "@/types/AuthContext";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default AuthContext;
