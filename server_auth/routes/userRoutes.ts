import { Router, context } from "@oak/oak";
import { DatabaseSync } from "node:sqlite";
import { hashPassword } from "../lib/jwt.ts";
import { ApiErrorCode, ApiResponse } from "../types/exceptionType.ts";
import { authMiddleware, AuthContext } from "../middlewares/authMiddleware.ts";
import { User } from "../types/userType.ts";
import { isUserRow } from "../types/userType.ts";
import { userRowToApi } from "../mappers/userMapper.ts"

const db = new DatabaseSync("");

const router = new Router({ prefix: "/users" });

router.post("/register", async (ctx: context) => {
    try {
        const userIdValue = crypto.randomUUID();
        const pseudoValue = ctx.params.pseudo;
        const nameValue = ctx.params.name;
        const lastNameValue = ctx.params.lastName;
        const password = await hashPassword(ctx.params.password);;
        const emailValue = ctx.params.email;

        const insertResult = db
            .prepare(`INSERT INTO User (user_id, pseudo, name, last_name, password, email, isAdmin, created_at) VALUES (:userId, :pseudo, :name, :lastName, :password, :email, :isAdmin, :createdAt)`)
            .run({
                userId: userIdValue,
                pseudo: pseudoValue,
                name: nameValue,
                lastName: lastNameValue,
                password: password,
                email: emailValue,
                isAdmin: 0,
                createdAt: new Date().toISOString().split('T')[0]
            });

        if (!insertResult || insertResult.changes === 0) {
            const response: ApiResponse<User> = {
                success: false,
                error: {
                    code: ApiErrorCode.BAD_REQUEST,
                    message: "Error in the request..."
                },
            };

            ctx.response.status = 404;
            ctx.response.body = response;

            return;
        }

        const userRow = db
            .prepare(`SELECT user_id, pseudo, name, last_name, password, email, isAdmin, created_at FROM User WHERE user_id = ?`).get(insertResult.lastInsertRowid);

        if (!userRow || !isUserRow(userRow)) {
            const response: ApiResponse<User> = {
                success: false,
                error: {
                    code: ApiErrorCode.NOT_FOUND,
                    message: "User not found..."
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

});

router.get("/me", authMiddleware, (ctx: AuthContext) => {

});