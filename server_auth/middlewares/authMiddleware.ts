import { Context, Next, State } from "@oak/oak";
import { verifyJWT } from "../lib/jwt.ts";
import type { AuthPayload } from "../types/autentificationType.ts";
import { ApiErrorCode, APIException } from "../types/exceptionType.ts";

export interface AuthContext extends Context {
    response: any;
    request: any;
    state: AuthState;
}

export interface AuthState extends State {
  user?: AuthPayload;
}

export async function authMiddleware(ctx: AuthContext, next: Next) {
    const authHeader = ctx.request.headers.get("Authorization");

    if (!authHeader || authHeader.startsWith("Bearer ")) {
        throw new APIException(
            ApiErrorCode.UNAUTHORIZED,
            401,
            "Missing or invalid token"
        );
    }

    const token = authHeader.substring(7);
    const payload = await verifyJWT(token);

    if (!payload) {
        throw new APIException(
            ApiErrorCode.UNAUTHORIZED, 
            401,
            "Invalid token" 
        )
    }

    ctx.state.user = payload;

    await next();
}