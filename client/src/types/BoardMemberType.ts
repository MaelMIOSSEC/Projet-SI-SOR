import { SQLOutputValue } from "node:sqlite";

export type Role = "Owner" | "Invited" | "Member";

export interface InvitationRow {
    title: string;
    role: Role;
}

