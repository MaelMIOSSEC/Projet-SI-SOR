import { SQLOutputValue } from "node:sqlite";

/**
 * Interface pour les détails de l'utilisateur (UserDto)
 */
export interface UserDto {
  id: string;
  username: string;
  name: string;
  lastName: string;
  email: string;
  password?: string;
  isAdmin: number;
  createdAt: string;
}

/**
 * Interface pour l'objet membre tel qu'il apparaît dans le tableau
 */
export interface BoardMember {
  userDto: UserDto;
  role: string;
}

/**
 * Interface pour la ligne brute en base de données (si besoin)
 */
export interface BoardMemberRow {
  board_id: string;
  user_id: string;
  role: string;
  [key: string]: SQLOutputValue | undefined;
}