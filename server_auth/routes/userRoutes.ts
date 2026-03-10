import { Router, context } from "@oak/oak";
import { DatabaseSync } from "node:sqlite";
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

const db = new DatabaseSync("");

const router = new Router({ prefix: "/users" });

router.post("/register", async (ctx: context) => {
  try {
    const data = await ctx.request.body.json();

    const userIdValue = crypto.randomUUID();
    const pseudoValue = data.pseudo;
    const nameValue = data.name;
    const lastNameValue = data.lastName;
    const password = await hashPassword(data.password);
    const emailValue = data.email;

    const insertResult = db
      .prepare(
        `INSERT INTO User (user_id, pseudo, name, last_name, password, email, isAdmin, created_at) VALUES (:userId, :pseudo, :name, :lastName, :password, :email, :isAdmin, :createdAt)`,
      )
      .run({
        userId: userIdValue,
        pseudo: pseudoValue,
        name: nameValue,
        lastName: lastNameValue,
        password: password,
        email: emailValue,
        isAdmin: 0,
        createdAt: new Date().toISOString().split("T")[0],
      });

    if (!insertResult || insertResult.changes === 0) {
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

    const userRow = db
      .prepare(
        `SELECT user_id, pseudo, name, last_name, password, email, isAdmin, created_at FROM User WHERE user_id = ?`,
      )
      .get(userIdValue);

    if (!userRow || !isUserRow(userRow)) {
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
      data: userRowToApi(userRow),
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

    const userRow = db
      .prepare(
        `SELECT user_id, pseudo, name, last_name, password, isAdmin, created_at FROM User WHERE pseudo = ?`,
      )
      .get(pseudoValue);

    if (userRow && isUserRow(userRow)) {
      if (await verifyPassword(data.password, userRow.password)) {
        const userPayload = {
            userId: userRow.user_id,
            username: userRow.pseudo,
            isAdmin: userRow.isAdmin,
        };

        const jwtToken = await createJWT(userPayload);

        const loginPayload: AuthResponse = {
            token: jwtToken,          
            user: userRowToApi(userRow)
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

router.get("/me", authMiddleware, (ctx: AuthContext) => {
  try {
    const userId = ctx.state.user?.userId;

    if (!userId) {
      throw new APIException(
        ApiErrorCode.UNAUTHORIZED,
        401,
        "User not identified in the token...",
      );
    }

    const userRow = db
      .prepare(
        `SELECT user_id, pseudo, name, last_name, password, isAdmin, created_at FROM User WHERE user_id = ?`,
      )
      .get(userId);

    if (!userRow || !isUserRow(userRow)) {
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
      data: userRowToApi(userRow),
    };

    ctx.response.status = 200;
    ctx.response.body = response;
  } catch (error: any) {
    console.error("Detailed SQL error : ", error.message);
    ctx.response.status = 500;
    ctx.response.body = { success: false, error: { message: error.message } };
  }
});
