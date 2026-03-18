import { SQLOutputValue } from "node:sqlite";

export interface Task {
  id: string;
  title: string;
  description: string;
  deadline: string;
  priority: string;
  position: number;
  userId: string;
  kanbanColumnId: string;
}

export interface TaskRow {
  task_id: string;
  title: string;
  description?: string;
  deadline?: string | Date;
  priority: string;
  position: number;
  user_id: string;
  kanban_column_id: string;
  [key: string]: SQLOutputValue | Date | undefined;
}

export function isTaskRow(obj: Record<string, SQLOutputValue | Date | undefined>): obj is TaskRow {
  return (
    "task_id" in obj &&
    typeof obj.task_id === "string" &&
    "title" in obj &&
    typeof obj.title === "string" &&

    (!("description" in obj) || obj.description === null || typeof obj.description === "string") &&
    (!("deadline" in obj) || obj.deadline === null || typeof obj.deadline === "string" || obj.deadline instanceof Date) &&

    "priority" in obj &&
    typeof obj.priority === "string" &&
    "position" in obj &&
    typeof obj.position === "number" &&

    "user_id" in obj &&
    typeof obj.user_id === "string" &&
    "kanban_column_id" in obj &&
    typeof obj.kanban_column_id === "string"
  );
}
