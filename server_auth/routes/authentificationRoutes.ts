import { Router, Context, type RouterContext } from "@oak/oak";
import connection from "../config/db.ts";
import { createJWT, hashPassword, verifyPassword } from "../lib/jwt.ts";
import {
  ApiErrorCode,
  APIException,
  ApiResponse,
} from "../types/exceptionType.ts";
import { authMiddleware, AuthContext } from "../middlewares/authMiddleware.ts";
import { User } from "../types/userType.ts";
import { isUserRow } from "../types/userType.ts";
import { userRowToApi } from "../mappers/userMapper.ts";
import { AuthResponse } from "../types/autentificationType.ts";

/** Router for handling authentication-related routes. */
const router = new Router({ prefix: "/users" });

/** Route for user registration. It checks for duplicate usernames and emails, hashes the password, creates a new user in the database, and returns a JWT token along with user information. */
router.post("/register", async (ctx: RouterContext<"/register">) => {
  try {
    const data = await ctx.request.body.json();

    const existingUsername = await connection.query(
      `SELECT username FROM User WHERE username = ?`,
      [data.username],
    );

    const existingEmail = await connection.query(
      `SELECT email FROM User WHERE email = ?`,
      [data.email],
    );

    if (existingUsername.length > 0 || existingEmail.length > 0) {
      const response: ApiResponse<User> = {
        success: false,
        error: {
          code: ApiErrorCode.CONFLICT,
          message: "Duplicate entry...",
        },
      };

      ctx.response.status = 409;
      ctx.response.body = response;

      return;
    }

    const userIdValue = crypto.randomUUID();
    const passwordHash = await hashPassword(data.password);
    const createdAtValue = new Date().toISOString().split("T")[0];

    const insertResult = await connection.query(
      `INSERT INTO User (user_id, username, name, last_name, password, email, is_admin, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userIdValue,
        data.username,
        data.name,
        data.lastName,
        passwordHash,
        data.email,
        0,
        createdAtValue,
      ],
    );

    if (
      !insertResult ||
      (insertResult.affectedRows === 0 && insertResult.changes === undefined)
    ) {
      const response: ApiResponse<User> = {
        success: false,
        error: {
          code: ApiErrorCode.BAD_REQUEST,
          message: "Error in the request...",
        },
      };

      ctx.response.status = 404;
      ctx.response.body = response;

      return;
    }

    const userRow = await connection.query(
      `SELECT user_id, username, name, last_name, password, email, is_admin, created_at FROM User WHERE user_id = ?`,
      [userIdValue],
    );

    if (!userRow[0] || !isUserRow(userRow[0])) {
      const response: ApiResponse<User> = {
        success: false,
        error: {
          code: ApiErrorCode.NOT_FOUND,
          message: "User not found...",
        },
      };

      ctx.response.status = 404;
      ctx.response.body = response;

      return;
    }

    const userPayload = {
      userId: userRow[0].user_id,
      username: userRow[0].username,
      isAdmin: !!userRow[0].isAdmin,
    };

    const jwtToken = await createJWT(userPayload);

    const loginPayload: AuthResponse = {
      token: jwtToken,
      user: userRowToApi(userRow[0]),
    };

    const response: ApiResponse<AuthResponse> = {
      success: true,
      data: loginPayload,
    };

    ctx.response.status = 200;
    ctx.response.body = response;
  } catch (error: any) {
    console.error("Detailed SQL error : ", error.message);
    ctx.response.status = 500;
    ctx.response.body = { success: false, error: { message: error.message } };
  }
});

/** Route for user login. It verifies the provided credentials, and if valid, returns a JWT token along with user information. */ 
router.post("/login", async (ctx: RouterContext<"/login">) => {
  try {
    const data = await ctx.request.body.json();

    const passwordValue = data.password;
    const usernameValue = data.username;

    if (!passwordValue || !usernameValue) {
      throw new APIException(
        ApiErrorCode.UNAUTHORIZED,
        404,
        "Missing information(s)...",
      );
    }

    const userRow = await connection.query(
      `SELECT user_id, username, name, last_name, password, email, is_admin, created_at FROM User WHERE username = ?`,
      [usernameValue],
    );

    if (userRow[0] && isUserRow(userRow[0])) {
      if (await verifyPassword(data.password, userRow[0].password)) {
        const userPayload = {
          userId: userRow[0].user_id,
          username: userRow[0].username,
          isAdmin: !!userRow[0].isAdmin,
        };

        const jwtToken = await createJWT(userPayload);

        const loginPayload: AuthResponse = {
          token: jwtToken,
          user: userRowToApi(userRow[0]),
        };

        const response: ApiResponse<AuthResponse> = {
          success: true,
          data: loginPayload,
        };

        ctx.response.status = 200;
        ctx.response.body = response;
      } else {
        const response = {
          success: false,
          error: {
            code: ApiErrorCode.UNAUTHORIZED,
            message: "Wrong Password...",
          },
        };

        ctx.response.status = 401;
        ctx.response.body = response;

        return;
      }
    } else {
      const response = {
        success: false,
        error: {
          code: ApiErrorCode.NOT_FOUND,
          message: "User Not Found...",
        },
      };

      ctx.response.status = 404;
      ctx.response.body = response;

      return;
    }
  } catch (error: any) {
    console.error("Detailed SQL error : ", error.message);
    ctx.response.status = 500;
    ctx.response.body = { success: false, error: { message: error.message } };
  }
});

/** Route to get the authenticated user's information. It uses the authMiddleware to ensure the request is authenticated, and then retrieves and returns the user's information based on the user ID from the JWT token. */
router.get("/me", authMiddleware, async (ctx: AuthContext) => {
  try {
    const userId = ctx.state.user?.userId;

    if (!userId) {
      throw new APIException(
        ApiErrorCode.UNAUTHORIZED,
        401,
        "User not identified in the token...",
      );
    }

    const userRow = await connection.query(
      `SELECT user_id, username, name, last_name, password, isAdmin, created_at FROM User WHERE user_id = ?`,
      [userId],
    );

    if (!userRow[0] || !isUserRow(userRow[0])) {
      const response: ApiResponse<User> = {
        success: false,
        error: {
          code: ApiErrorCode.NOT_FOUND,
          message: "User not found...",
        },
      };

      ctx.response.status = 404;
      ctx.response.body = response;

      return;
    }

    const response: ApiResponse<User> = {
      success: true,
      data: userRowToApi(userRow[0]),
    };

    ctx.response.status = 200;
    ctx.response.body = response;
  } catch (error: any) {
    console.error("Detailed SQL error : ", error.message);
    ctx.response.status = 500;
    ctx.response.body = { success: false, error: { message: error.message } };
  }
});

export default router;
