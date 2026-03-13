import { type ReactNode, useState } from "react";

import { AuthContext, type AuthContextValue } from "./AuthContext.ts";

import { type AuthResponse } from "../model.ts";

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [authResponse, setAuthResponse] = useState<AuthResponse | null>(() => {
    const stored = localStorage.getItem("authResponse");
    return stored ? JSON.parse(stored) : null;
  });

  const setUser = (user: User) => {
  if (authResponse) {
    const newAuth = { ...authResponse, user }; 
    setAuthResponse(newAuth);
    localStorage.setItem("authResponse", JSON.stringify(newAuth));
  }
};

  const value: AuthContextValue = { authResponse, setAuthResponse, setUser }; 

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
