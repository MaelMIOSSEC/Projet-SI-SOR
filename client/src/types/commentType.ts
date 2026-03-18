import { SQLOutputValue } from "node:sqlite";

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  userId: string;
  taskId: string;
}

export interface CommentRow {
  comment_id: string;
  content: string;
  created_at: string;
  user_id: string;
  task_id: string;
  [key: string]: SQLOutputValue | undefined;
}

export function isCommentRow(obj: Record<string, SQLOutputValue | undefined>): obj is CommentRow {
  return (
    "comment_id" in obj &&
    typeof obj.comment_id === "string" &&
    "content" in obj &&
    typeof obj.content === "string" &&
    "created_at" in obj &&
    typeof obj.created_at === "string" &&
    "user_id" in obj &&
    typeof obj.user_id === "string" &&
    "task_id" in obj &&
    typeof obj.task_id === "string"
  );
}