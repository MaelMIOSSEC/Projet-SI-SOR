import {User, UserRow} from "../types/userType.ts";

export function userRowToApi(row: UserRow): User {
    return {
        userId: row.user_id,
        pseudo: row.pseudo,
        name: row.name,
        lastName: row.last_name,
        password: row.password,
        email: row.email,
        role: row.role,
        createdAt: row.created_at
    }
}