import { SQLOutputValue } from "node:sqlite";

export interface User {
    userId: string;
    username: string;
    name: string;
    lastName: string;
    password: string;
    email: string;
    isAdmin: boolean;
    createdAt: string;
}

export interface UserRow {
    user_id: string;
    username: string;
    name: string;
    last_name: string;
    password: string;
    email: string;
    is_admin: number;
    created_at: string | Date;
    [key: string]: SQLOutputValue | Date;
}

export function isUserRow(obj: Record<string, any>): obj is UserRow {
    return (
        "user_id" in obj && typeof obj.user_id === "string" &&
        "username" in obj && typeof obj.username === "string" &&
        "name" in obj && typeof obj.name === "string" &&
        "last_name" in obj && typeof obj.last_name === "string" &&
        "password" in obj && typeof obj.password === "string" &&
        "email" in obj && typeof obj.email === "string" &&
        "is_admin" in obj && typeof obj.is_admin === "number" &&
        "created_at" in obj && (typeof obj.created_at === "string" || obj.created_at instanceof Date)
    );
}