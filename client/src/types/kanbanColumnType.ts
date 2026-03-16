import { SQLOutputValue } from "node:sqlite";

/**
 * Interface représentant l'entité KanbanColumn (Côté Client/Frontend)
 */
export interface KanbanColumn {
  id: string;
  title: string;
  position: number;
}

/**
 * Interface représentant une ligne de la table KanbanColumn 
 * telle qu'elle sort de SQLite (Côté Serveur/DB)
 */
export interface KanbanColumnRow {
  kanban_column_id: string;
  title: string;
  position: number;
  board_id: string;
  [key: string]: SQLOutputValue;
}

/**
 * Type Guard pour vérifier si un objet est une ligne de colonne Kanban
 */
export function isKanbanColumnRow(
  obj: Record<string, SQLOutputValue>,
): obj is KanbanColumnRow {
  return (
    "kanban_column_id" in obj &&
    typeof obj.kanban_column_id === "string" &&
    "title" in obj &&
    typeof obj.title === "string" &&
    "position" in obj &&
    typeof obj.position === "number" &&
    "board_id" in obj &&
    typeof obj.board_id === "string"
  );
}