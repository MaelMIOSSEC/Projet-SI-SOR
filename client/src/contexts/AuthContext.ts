import { createContext } from "react";

import { type AuthResponse } from "../model.ts";

export interface AuthContextValue {
  authResponse: AuthResponse | null;
  setAuthResponse: (authResponse: AuthResponse | null) => void;
  setUser: (user: User) => void;
}

export const AuthContext = createContext<AuthContextValue>({
  authResponse: null,
  setAuthResponse: () => {},
});
