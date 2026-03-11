import {User, UserRow} from "../types/userType.ts";

export function userRowToApi(row: UserRow): User {
    return {
        userId: row.user_id,
        username: row.username,
        name: row.name,
        lastName: row.last_name,
        password: row.password,
        email: row.email,
        isAdmin: row.is_admin === 0 ? false : true,
        createdAt: row.created_at instanceof Date ? row.created_at.toISOString() : row.created_at
    }
}