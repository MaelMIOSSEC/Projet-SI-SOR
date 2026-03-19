import { Context, Next, State } from "@oak/oak";
import { verifyJWT } from "../lib/jwt.ts";
import type { AuthPayload } from "../types/autentificationType.ts";
import { ApiErrorCode, APIException } from "../types/exceptionType.ts";

/** Authentication context and middleware for protected routes. */
export interface AuthContext extends Context {
    response: any;
    request: any;
    state: AuthState;
}
/** Authentication state containing the authenticated user's payload. */
export interface AuthState extends State {
  user?: AuthPayload;
}

/** Middleware to authenticate requests using JWT tokens.
 * It checks for the presence of a Bearer token in the Authorization header,
 * verifies the token, and attaches the user payload to the context state.
 * If authentication fails, it throws an APIException with a 401 status code.
 * @param ctx - The authentication context containing request and response objects.
 * @param next - The next middleware function to call if authentication succeeds.
 */
export async function authMiddleware(ctx: AuthContext, next: Next) {
    const authHeader = ctx.request.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
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