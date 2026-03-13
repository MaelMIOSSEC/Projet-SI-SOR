import { SQLOutputValue } from "node:sqlite";

export interface Board {
  boardId: string;
  title: string;
}

export interface BoardRow {
  board_id: string;
  title: string;
  [key: string]: SQLOutputValue;
}

export function isBoardRow(
  obj: Record<string, SQLOutputValue>,
): obj is BoardRow {
  return (
    "board_id" in obj &&
    typeof obj.board_id === "string" &&
    "title" in obj &&
    typeof obj.title === "string"
  );
}
