import { SQLOutputValue } from "node:sqlite";

export type Role = "Owner" | "Invited" | "Member";

export interface InvitationRow {
    boardTitle: string;
    role: Role;
}

