import { Router, context } from "@oak/oak";
import { mysql } from "mysql";
import { Deno } from "https://deno.land/std@0.208.0/version.ts";
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

const connection = mysql.createConnection({
  host: Deno.env.get("MYSQL_HOST") || "localhost",
  port: Number(Deno.env.get("MYSQL_PORT") || "3306"),
  user: Deno.env.get("MYSQL_USER") || "e22206673sql",
  password: Deno.env.get("MYSQL_PASSWORD") || "rDoKnVI6",
  database: Deno.env.get("MYSQL_DATABASE") || "e22206673_db1",
});

const router = new Router({ prefix: "/users" });

router.post("/register", async (ctx: context) => {
  try {
    const data = await ctx.request.body.json();

    console.log("test")

    const existingUsers = await connection.query(
        `SELECT pseudo FROM User WHERE pseudo = ?`, [data.pseudo]
    );

    if (existingUsers.length > 0) {
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
      `INSERT INTO User (user_id, pseudo, name, last_name, password, email, isAdmin, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userIdValue,
        data.pseudo,
        data.name,
        data.lastName,
        passwordHash,
        data.email,
        0,
        createdAtValue,
      ],
    );

    if (!insertResult || (insertResult.affectedRows === 0 && insertResult.changes === undefined)) {
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
      `SELECT user_id, pseudo, name, last_name, password, email, isAdmin, created_at FROM User WHERE user_id = ?`,
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

router.post("/login", async (ctx: context) => {
  try {
    const data = await ctx.request.body.json();

    const passwordValue = data.password;
    const pseudoValue = data.pseudo;

    if (!passwordValue || !pseudoValue) {
      throw new APIException(
        ApiErrorCode.UNAUTHORIZED,
        404,
        "Missing information(s)...",
      );
    }

    const userRow = await connection.query(
      `SELECT user_id, pseudo, name, last_name, password, isAdmin, created_at FROM User WHERE pseudo = ?`,
      [pseudoValue],
    );

    if (userRow[0] && isUserRow(userRow[0])) {
      if (await verifyPassword(data.password, userRow[0].password)) {
        const userPayload = {
          userId: userRow[0].user_id,
          username: userRow[0].pseudo,
          isAdmin: userRow[0].isAdmin,
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
      `SELECT user_id, pseudo, name, last_name, password, isAdmin, created_at FROM User WHERE user_id = ?`,
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
