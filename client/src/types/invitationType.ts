import { SQLOutputValue } from "node:sqlite";

export type Role = "Owner" | "Invited" | "Member";

export interface InvitationRow {
    boardId: String;
    boardTitle: string;
    role: Role;
}

