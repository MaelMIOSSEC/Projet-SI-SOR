import {User, UserRow} from "../types/userType.ts";

/** * Maps a UserRow object to a User object.
 * @param row - The UserRow object to be mapped.
 * @returns A User object with the corresponding properties from the UserRow.
 */
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