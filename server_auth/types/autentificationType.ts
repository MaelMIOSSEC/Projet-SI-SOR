import { User } from "../types/userType.ts"

/**Types for authentication-related requests and responses. */
export interface LoginRequest {
    username: string;
    password: string;
}

/**Types for authentication-related requests and responses. */
export interface RegisterRequest {
    username: string;
    password: string;
    isAdmin?: boolean;
}

/**Types for authentication-related requests and responses. */
export interface AuthResponse {
    token: string;
    user: User;
}

/**Types for authentication-related requests and responses. */
export interface AuthPayload {
    userId: string;
    username: string;
    isAdmin: boolean;
    exp: number;
}

/**Type guard function to check if an object is of type AuthPayload. */
export function isAuthPayload(obj: any): obj is AuthPayload {
    return (
        "userId" in obj && typeof obj.userId === "string" &&
        "username" in obj && typeof obj.username === "string" &&
        "isAdmin" in obj && typeof obj.isAdmin === "boolean" &&
        "exp" in obj && typeof obj.exp === "number"
    );
}