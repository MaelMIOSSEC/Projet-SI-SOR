import { Router, context } from "@oak/oak";
import { DatabaseSync } from "node:sqlite";

const db = new DatabaseSync("");

const router = new Router({ prefix: "/users" });

router.post("/register", async (ctx: context) => {

});

router.post("/login", async (ctx: context) => {

});

router.get("/me", authMiddleware, (ctx: AuthContext) => {

});