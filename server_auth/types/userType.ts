import { SQLOutputValue } from "node:sqlite";

export interface User {
    userId: string;
    username: string;
    name: string;
    lastName: string;
    password: string;
    email: string;
    role: string;
    createdAt: string;
}

export interface UserRow {
    user_id: string;
    username: string;
    name: string;
    last_name: string;
    password: string;
    email: string;
    role: string;
    created_at: string;
    [key: string]: SQLOutputValue;
}

export function isUserRow(obj: Record<string, SQLOutputValue>): obj is UserRow {
    return (
        "user_id" in obj && typeof obj.user_id === "string" &&
        "username" in obj && typeof obj.username === "string" &&
        "name" in obj && typeof obj.name === "string" &&
        "last_name" in obj && typeof obj.last_name === "string" &&
        "password" in obj && typeof obj.password === "string" &&
        "email" in obj && typeof obj.email === "string" &&
        "is_admin" in obj && typeof obj.role === "int" &&
        "created_at" in obj && typeof obj.created_at === "string"
    );
}